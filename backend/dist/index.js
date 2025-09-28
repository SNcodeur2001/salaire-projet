import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employees.js";
import entrepriseRoutes from "./routes/entreprises.js";
import payrunRoutes from "./routes/payruns.js";
import payslipRoutes from "./routes/payslips.js";
import paymentRoutes from "./routes/payments.js";
dotenv.config();
const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());
// inject prisma into req (simple pattern)
app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});
// routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/entreprises", entrepriseRoutes);
app.use("/api/payruns", payrunRoutes);
app.use("/api/payslips", payslipRoutes);
app.use("/api/payments", paymentRoutes);
// health
app.get("/api/health", (req, res) => res.json({ ok: true }));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map