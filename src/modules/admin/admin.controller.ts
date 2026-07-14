import { Request, Response } from "express";
import ApiResponse from "../../utils/ApiResponse.js";
import { getDashboard } from "./admin.service.js";

export const getAdminDashboard = async (_req: Request, res: Response) => {
  const dashboard = await getDashboard();

  res
    .status(200)
    .json(new ApiResponse(true, "Dashboard fetched successfully", dashboard));
};
