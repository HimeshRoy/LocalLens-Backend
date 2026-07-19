import { Request, Response } from "express";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  getDashboard,
  getUsers,
  updateUserStatus,
  updateUserVerification,
  updateUserRole,
  deleteUser,
  getPlaces,
  updatePlaceStatus,
  updatePlaceVerification,
  deletePlace,
  getPlaceById,
} from "./admin.service.js";


export const getAdminDashboard = async (_req: Request, res: Response) => {
  const dashboard = await getDashboard();

  res
    .status(200)
    .json(new ApiResponse(true, "Dashboard fetched successfully", dashboard));
};

export const getAdminUsers = async (
  req: Request,
  res: Response,
) => {
  const users = await getUsers(req.query);

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

export const updateAdminUserVerification = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  const user = await updateUserVerification(
    id as string,
    isVerified,
  );

  res.status(200).json(
    new ApiResponse(
      true,
      `User ${
        isVerified ? "verified" : "unverified"
      } successfully`,
      user,
    ),
  );
};

export const updateAdminUserRole = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await updateUserRole(id as string, role);

  res.status(200).json(
    new ApiResponse(
      true,
      "User role updated successfully",
      user,
    ),
  );
};

export const deleteAdminUser = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;

  const user = await deleteUser(id as string);

  res.status(200).json(
    new ApiResponse(
      true,
      "User deleted successfully",
      user,
    ),
  );
};

export const getAdminPlaces = async (
  req: Request,
  res: Response,
) => {
  const places = await getPlaces(req.query);

  res.status(200).json(
    new ApiResponse(
      true,
      "Places fetched successfully",
      places,
    ),
  );
};
export const updateAdminPlaceVerification = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  const place = await updatePlaceVerification(
    id as string,
    isVerified,
  );

  res.status(200).json(
    new ApiResponse(
      true,
      "Place verification updated successfully",
      place,
    ),
  );
};

export const updateAdminPlaceStatus = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const place = await updatePlaceStatus(
    id as string,
    isActive,
  );

  res.status(200).json(
    new ApiResponse(
      true,
      `Place ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      place,
    ),
  );
};

export const deleteAdminPlace = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;

  const place = await deletePlace(id as string);

  res.status(200).json(
    new ApiResponse(
      true,
      "Place deleted successfully",
      place,
    ),
  );
};

export const getAdminPlaceById = async (
  req: Request,
  res: Response,
) => {
  const place = await getPlaceById(req.params.id as string);

  res.status(200).json(
    new ApiResponse(
      true,
      "Place fetched successfully",
      place,
    ),
  );
};