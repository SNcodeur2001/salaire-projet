import express from "express";
import authController from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
const router = express.Router();
// Register
router.post("/register", authController.register.bind(authController));
// Login
router.post("/login", authController.login.bind(authController));
// Me
router.get("/me", requireAuth, authController.me.bind(authController));
export default router;
//# sourceMappingURL=auth.js.map