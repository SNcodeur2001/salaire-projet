import express, { Router } from "express";
import authController from "../controllers/authController.js";
import { requireAuth,requireRole } from "../middleware/auth.js";

const router: Router = express.Router();

// Register (unprotected for initial SUPER_ADMIN creation)
router.post(
  "/register",
  requireAuth,              // Vérifie que l’utilisateur est connecté
  requireRole("SUPER_ADMIN"), // Vérifie que c’est un SUPER_ADMIN
  authController.register.bind(authController)
);
// Login
router.post("/login", authController.login.bind(authController));

// Me
router.get("/me", requireAuth, authController.me.bind(authController));

export default router;
