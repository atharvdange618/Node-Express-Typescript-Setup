import jwt, { SignOptions } from "jsonwebtoken";
import * as argon2 from "argon2";
import { environment } from "../config/environment";

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface AccessTokenPayload {
  id: string;
  role: string;
  email: string;
}

interface RefreshTokenPayload {
  id: string;
  role: string;
  email: string;
}

export class AuthUtils {
  static async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  static async verifyPassword(
    hashedPassword: string,
    plainPassword: string
  ): Promise<boolean> {
    return await argon2.verify(hashedPassword, plainPassword);
  }

  static generateAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, environment.jwtSecret, {
      expiresIn: environment.jwtExpiresIn,
    } as SignOptions);
  }

  static generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, environment.refreshTokenSecret, {
      expiresIn: environment.refreshTokenExpiresIn,
    } as SignOptions);
  }

  static verifyAccessToken(token: string): AccessTokenPayload | null {
    try {
      return jwt.verify(token, environment.jwtSecret) as AccessTokenPayload;
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
      return jwt.verify(
        token,
        environment.refreshTokenSecret
      ) as RefreshTokenPayload;
    } catch (error) {
      return null;
    }
  }

  static generateTokens(payload: AccessTokenPayload): TokenResponse {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken({
      id: payload.id,
      role: payload.role,
      email: payload.email,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
