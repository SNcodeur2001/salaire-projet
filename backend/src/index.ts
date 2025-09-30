import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employees.js";
import entrepriseRoutes from "./routes/entreprises.js";
import payrunRoutes from "./routes/payruns.js";
import payslipRoutes from "./routes/payslips.js";
import paymentRoutes from "./routes/payments.js";
import userRoutes from "./routes/users.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// inject prisma into req (simple pattern)
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).prisma = prisma;
  next();
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/entreprises", entrepriseRoutes);
app.use("/api/payruns", payrunRoutes);
app.use("/api/payslips", payslipRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);

// health
app.get("/api/health", (req: Request, res: Response) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
