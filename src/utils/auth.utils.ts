import jwt, { SignOptions } from "jsonwebtoken";
import * as argon2 from "argon2";
import { environment } from "../config/environment";

interface TokenPayload {
  id: string;
  role: string;
  email: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
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

  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, environment.jwtSecret, {
      expiresIn: environment.jwtExpiresIn,
      audience: environment.appUrl,
      issuer: environment.serverHostname,
    } as SignOptions);
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, environment.refreshTokenSecret, {
      expiresIn: environment.refreshTokenExpiresIn,
      audience: environment.appUrl,
      issuer: environment.serverHostname,
    } as SignOptions);
  }

  static verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, environment.jwtSecret, {
        audience: environment.appUrl,
        issuer: environment.serverHostname,
      }) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, environment.refreshTokenSecret, {
        audience: environment.appUrl,
        issuer: environment.serverHostname,
      }) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  static generateTokens(payload: TokenPayload): TokenResponse {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}
