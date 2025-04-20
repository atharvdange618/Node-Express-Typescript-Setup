import { Router } from "express";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/auth", authRoutes);

// router.use('/users', userRoutes);
// router.use('/posts', postRoutes);

export default router;
