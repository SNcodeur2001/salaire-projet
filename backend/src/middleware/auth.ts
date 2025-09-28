import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface User {
  userId: string;
  role: string;
  entrepriseId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "token manquant" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = { userId: payload.userId, role: payload.role, entrepriseId: payload.entrepriseId };
    return next();
  } catch (e) {
    return res.status(401).json({ error: "token invalide" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "non authentifié" });
    if (!roles.includes(user.role)) return res.status(403).json({ error: "accès refusé" });
    next();
  };
}
