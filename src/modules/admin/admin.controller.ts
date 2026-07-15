import { Request, Response } from "express";
import ApiResponse from "../../utils/ApiResponse.js";
import { getDashboard, getUsers } from "./admin.service.js";

export const getAdminDashboard = async (_req: Request, res: Response) => {
  const dashboard = await getDashboard();

  res
    .status(200)
    .json(new ApiResponse(true, "Dashboard fetched successfully", dashboard));
};

export const getAdminUsers = async (
  _req: Request,
  res: Response,
) => {
  const users = await getUsers();

  res.status(200).json(
    new ApiResponse(
      true,
      "Users fetched successfully",
      users,
    ),
  );
};