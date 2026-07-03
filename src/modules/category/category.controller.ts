import { Request, Response } from "express";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
   deleteCategory,
} from "./category.service.js";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await createCategory(req.body);

    const response = new ApiResponse(
      result.success,
      result.message,
      result.data,
    );

    res.status(result.success ? 201 : 400).json(response);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getCategories();

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

export const getById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await getCategoryById(id as string);

    const response = new ApiResponse(
      result.success,
      result.message,
      result.data
    );

    res.status(result.success ? 200 : 404).json(response);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const update = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await updateCategory(id as string, req.body);

    const response = new ApiResponse(
      result.success,
      result.message,
      result.data
    );

    res.status(result.success ? 200 : 404).json(response);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const remove = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await deleteCategory(id as string);

    const response = new ApiResponse(
      result.success,
      result.message,
      result.data
    );

    res.status(result.success ? 200 : 404).json(response);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};