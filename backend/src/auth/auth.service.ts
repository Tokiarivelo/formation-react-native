import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { User } from '@prisma/client';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private firebaseService: FirebaseService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, username, password, firstName, lastName } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    const tokens = await this.generateTokens(user);
    return { user, ...tokens };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has a password (not Firebase user)
    if (!user.password) {
      throw new UnauthorizedException(
        'This account uses social login. Please use Firebase authentication.',
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, ...tokens };
  }

  async refreshTokens(refreshToken: string) {
    try {
      // Find refresh token in database
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { hashedToken: refreshToken },
        include: { user: true },
      });

      if (!storedToken || storedToken.revoked || !storedToken.user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(storedToken.user);

      // Revoke old refresh token
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = storedToken.user;
      return { user: userWithoutPassword, ...tokens };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.updateMany({
      where: { hashedToken: refreshToken },
      data: { revoked: true },
    });
  }

  private async generateTokens(user: Partial<User>) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
    });

    // Store hashed refresh token
    await this.prisma.refreshToken.create({
      data: {
        hashedToken: refreshToken,
        userId: user.id!,
      },
    });

    return { accessToken, refreshToken };
  }

  async authenticateWithFirebase(idToken: string) {
    try {
      // Verify Firebase token
      const decodedToken = await this.firebaseService.verifyIdToken(idToken);

      const { uid, email, name } = decodedToken;

      if (!email) {
        throw new UnauthorizedException('Email not found in Firebase token');
      }

      // Find or create user
      let user = await this.prisma.user.findUnique({
        where: { firebaseUid: uid },
      });

      if (!user) {
        // Check if user with email exists
        user = await this.prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          // Link existing user to Firebase
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: { firebaseUid: uid },
          });
        } else {
          // Create new user
          const username = email.split('@')[0] + '_' + uid.substring(0, 6);
          user = await this.prisma.user.create({
            data: {
              email,
              username,
              firebaseUid: uid,
              firstName: name || null,
              password: null, // No password for Firebase users
            },
          });
        }
      }

      if (!user.isActive) {
        throw new UnauthorizedException('User account is deactivated');
      }

      // Generate app tokens
      const tokens = await this.generateTokens(user);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      return { user: userWithoutPassword, ...tokens };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  async validateUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
    });
  }
}
