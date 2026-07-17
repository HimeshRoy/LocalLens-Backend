import { Request, Response } from "express";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  getDashboard,
  getUsers,
  updateUserStatus,
} from "./admin.service.js";

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
  const users = await getUsers(_req.query);

  res.status(200).json(
    new ApiResponse(
      true,
      "Users fetched successfully",
      users,
    ),
  );
};

export const updateAdminUserStatus = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await updateUserStatus(id as string, isActive);

  res.status(200).json(
    new ApiResponse(
      true,
      `User ${
        isActive ? "activated" : "suspended"
      } successfully`,
      user,
    ),
  );
};