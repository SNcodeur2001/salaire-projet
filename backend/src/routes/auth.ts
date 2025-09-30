import express, { Router } from "express";
import authController from "../controllers/authController.js";
import { requireAuth,requireRole } from "../middleware/auth.js";

const router: Router = express.Router();

// Register (authentication required for user creation)
router.post(
  "/register",
  requireAuth,
  authController.register.bind(authController)
);
// Login
router.post("/login", authController.login.bind(authController));

// Me
router.get("/me", requireAuth, authController.me.bind(authController));

export default router;
