import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

interface CustomJwtPayload {
  userId: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: CustomJwtPayload;
}

export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

   const token = authHeader.split(" ")[1];

if (!token) {
  return res.status(401).json({
    message: "Invalid token format.",
  });
}

const secret = process.env.JWT_SECRET;

if (!secret) {
  return res.status(500).json({
    message: "JWT secret is missing",
  });
}

const decoded = jwt.verify(token, secret) as unknown as CustomJwtPayload;
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};