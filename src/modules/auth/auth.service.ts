import { generateToken } from "../../utils/jwt.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma.js";
import { type RegisterUserInput, type LoginUserInput } from "./auth.types.js";

export const registerUser = async (payload: RegisterUserInput) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: payload.email,
        },
        {
          username: payload.username,
        },
      ],
    },
  });

  if (existingUser) {
    return {
      success: false,
      message: "Email or username already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await prisma.user.create({
    data: {
      fullName: payload.fullName,
      username: payload.username,
      email: payload.email,
      password: hashedPassword,
    },
  });

  return {
    success: true,
    message: "User registered successfully",
    data: {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

export const loginUser = async (payload: LoginUserInput) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: payload.identifier,
        },
        {
          username: payload.identifier,
        },
      ],
    },
  });

  if (!user) {
    return {
      success: false,
      message: "Invalid credentials",
    };
  }

  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordCorrect) {
    return {
      success: false,
      message: "Invalid credentials",
    };
  }

  const token = generateToken(user.id, user.username, user.role);

  return {
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    },
  };
};
