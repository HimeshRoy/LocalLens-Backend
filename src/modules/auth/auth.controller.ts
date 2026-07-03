import { type Request, type Response } from "express";
import { registerUser, loginUser } from "./auth.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await registerUser(req.body);

    const response = new ApiResponse(
      result.success,
      result.message,
      result.data,
    );

    res.status(201).json(response);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body);
    const result = await loginUser(req.body);

    const response = new ApiResponse(
      result.success,
      result.message,
      result.data,
    );

    res.status(200).json(response);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
