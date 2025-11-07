import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from '../firebase/firebase.service';
import { AuthService } from '../auth/auth.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private firebaseService: FirebaseService,
    private authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const user = await this.authenticateSocket(client);

      if (!user) {
        this.logger.warn(`Unauthorized connection attempt from ${client.id}`);
        client.disconnect();
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      client.data.user = user;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.log(`Client connected: ${client.id}, user: ${(user as { email: string }).email}`);

      // Join user to their personal room
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      client.join(`user:${(user as { id: string }).id}`);

      // Notify client of successful connection
      client.emit('connected', { 
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        userId: (user as { id: string }).id, 
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        email: (user as { email: string }).email 
      });
    } catch (error: unknown) {
      this.logger.error(`Connection error: ${(error as Error).message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user = client.data.user;
    this.logger.log(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
      `Client disconnected: ${client.id}${user ? `, user: ${user.email}` : ''}`,
    );
  }

  private async authenticateSocket(client: Socket): Promise<unknown> {
    try {
      // Try to get token from handshake auth or query
      const token =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '') ||
        (client.handshake.query?.token as string);

      if (!token) {
        return null;
      }

      // Try to verify as JWT first
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const payload = this.jwtService.verify(token, {
          secret: this.configService.get('JWT_SECRET'),
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        const user = await this.authService.validateUserById(payload.sub);
        if (user) {
          return user;
        }
      } catch {
        // If JWT fails, try Firebase token
        try {
          const decodedToken = await this.firebaseService.verifyIdToken(token);

          const user = await this.authService.validateUserById(
            decodedToken.uid,
          );
          if (user) {
            return user;
          }

          // Find by Firebase UID
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const firebaseUser = await (this.authService as any).prisma.user.findUnique(
            {
              where: { firebaseUid: decodedToken.uid },
            },
          );

          if (firebaseUser) {
            return firebaseUser;
          }
        } catch (firebaseError: unknown) {
          // Both JWT and Firebase failed
          this.logger.debug(`Authentication failed: ${(firebaseError as Error).message}`);
        }
      }

      return null;
    } catch (error: unknown) {
      this.logger.error(`Authentication error: ${(error as Error).message}`);
      return null;
    }
  }

  @SubscribeMessage('message')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user = client.data.user;
    this.logger.log(`Message from ${user?.email as string}: ${JSON.stringify(data)}`);

    // Echo message back to sender
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    return { event: 'message', data: { ...data, from: user?.email } };
  }

  // Method to send notification to specific user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  // Method to broadcast to all connected clients
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}
