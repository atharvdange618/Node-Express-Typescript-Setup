import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";
import { AuthUtils } from "../utils/auth.utils";
import emailService from "../services/email.service";
import {
  LoginInput,
  RegisterInput,
  RefreshTokenInput,
} from "../validations/auth.validation";
import { environment } from "../config/environment";
import * as Api from "../factories/apiErrorFactory";
import * as ApiResponse from "../factories/apiResponseFactory";
import { AuthenticatedUser } from "../types/auth";

export class AuthController {
  static async register(
    req: Request<{}, {}, RegisterInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password, firstName, lastName } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return next(Api.badRequest("User with this email already exists"));
      }

      const hashedPassword = await AuthUtils.hashPassword(password);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: "user",
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      });

      const { accessToken, refreshToken } = await AuthUtils.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      res
        .status(201)
        .json(
          ApiResponse.created(
            { user, accessToken, refreshToken },
            "User registered successfully"
          )
        );
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request<{}, {}, LoginInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.password) {
        return next(Api.unauthorized("Invalid credentials"));
      }

      const isPasswordValid = await AuthUtils.verifyPassword(
        user.password,
        password
      );

      if (!isPasswordValid) {
        return next(Api.unauthorized("Invalid credentials"));
      }

      const { accessToken, refreshToken } = await AuthUtils.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      res.json(
        ApiResponse.ok(
          {
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
            },
            accessToken,
            refreshToken,
          },
          "Login successful"
        )
      );
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(
    req: Request<{}, {}, RefreshTokenInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { refreshToken } = req.body;

      const decoded = AuthUtils.verifyRefreshToken(refreshToken);

      if (!decoded) {
        return next(Api.unauthorized("Invalid or expired refresh token"));
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || user.refreshToken !== refreshToken) {
        return next(Api.unauthorized("Invalid refresh token"));
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await AuthUtils.generateTokens({
          id: user.id,
          email: user.email,
          role: user.role,
        });

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      res.json(
        ApiResponse.ok(
          { accessToken: newAccessToken, refreshToken: newRefreshToken },
          "Token refreshed successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(Api.unauthorized("Not authenticated"));
      }

      const user = req.user as AuthenticatedUser;

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: null },
      });

      res.json(ApiResponse.ok(null, "Logged out successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async googleAuthCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        return res.redirect("/login?error=authentication-failed");
      }

      const user = req.user as AuthenticatedUser;

      const { accessToken, refreshToken } = await AuthUtils.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      res.redirect(
        `${environment.frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (error) {
      next(error);
    }
  }
}
