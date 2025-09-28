import jwt from "jsonwebtoken";
export function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth)
        return res.status(401).json({ error: "token manquant" });
    const token = auth.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId, role: payload.role };
        return next();
    }
    catch (e) {
        return res.status(401).json({ error: "token invalide" });
    }
}
export function requireRole(...roles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user)
            return res.status(401).json({ error: "non authentifié" });
        if (!roles.includes(user.role))
            return res.status(403).json({ error: "accès refusé" });
        next();
    };
}
//# sourceMappingURL=auth.js.map