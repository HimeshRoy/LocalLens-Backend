import dotenv from "dotenv";
import type { StringValue } from "ms";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 5000,

  DATABASE_URL: process.env.DATABASE_URL!,

  JWT_SECRET: process.env.JWT_SECRET!,

  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN || "7d") as StringValue,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,

  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,

  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
};