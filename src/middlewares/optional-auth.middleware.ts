import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

export const optionalAuthenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    req.user = decoded;
  } catch {
    // Invalid token -> continue as guest
  }

  next();
};