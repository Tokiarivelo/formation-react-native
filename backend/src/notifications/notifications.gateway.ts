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
import { User } from '@prisma/client';

interface AuthenticatedSocket extends Socket {
  data: {
    user?: User;
  };
}

@WebSocketGateway({
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.ALLOWED_ORIGINS?.split(',') || [] 
      : '*',
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

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const user = await this.authenticateSocket(client);

      if (!user) {
        this.logger.warn(`Unauthorized connection attempt from ${client.id}`);
        client.disconnect();
        return;
      }

      client.data.user = user;
      this.logger.log(`Client connected: ${client.id}, user: ${user.email}`);

      // Join user to their personal room
      client.join(`user:${user.id}`);

      // Notify client of successful connection
      client.emit('connected', { 
        userId: user.id, 
        email: user.email 
      });
    } catch (error: unknown) {
      this.logger.error(`Connection error: ${(error as Error).message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const user = client.data.user;
    this.logger.log(
      `Client disconnected: ${client.id}${user ? `, user: ${user.email}` : ''}`,
    );
  }

  private async authenticateSocket(client: Socket): Promise<User | null> {
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

          // Try to find by Firebase UID using the proper method
          const firebaseUser = await this.authService.validateUserByFirebaseUid(
            decodedToken.uid,
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
  handleMessage(@MessageBody() data: { text?: string }, @ConnectedSocket() client: AuthenticatedSocket) {
    const user = client.data.user;
    this.logger.log(`Message from ${user?.email || 'unknown'}: ${JSON.stringify(data)}`);

    // Echo message back to sender
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
