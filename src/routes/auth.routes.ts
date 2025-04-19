import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import passport from "passport";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
} from "../validations/auth.validation";
import asyncHandler from "express-async-handler";

const router = Router();

// Auth routes with Zod validation
router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(AuthController.register)
);
router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(AuthController.login)
);
router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  asyncHandler(AuthController.refreshToken)
);
router.post("/logout", authMiddleware, AuthController.logout);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  AuthController.googleAuthCallback
);

export default router;
