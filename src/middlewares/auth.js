import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Token ausente ou inválido");
      error.status = 401;
      throw error;
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.tokenType !== "access") {
      const error = new Error("Token de acesso inválido");
      error.status = 401;
      throw error;
    }

    req.user = { id: decoded.userId };
    return next();
  } catch (error) {
    error.status = error.status || 401;
    next(error);
  }
}
