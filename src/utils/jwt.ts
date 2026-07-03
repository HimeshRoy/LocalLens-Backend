import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { type TokenPayload } from "../types/jwt.types.js";

export const generateToken = (
  userId: string,
  username: string,
  role: string
) => {
  return jwt.sign(
    {
      userId,
      username,
      role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );
};

export const verifyToken = (
  token: string
): TokenPayload => {
  return jwt.verify(
    token,
    env.JWT_SECRET
  ) as TokenPayload;
};