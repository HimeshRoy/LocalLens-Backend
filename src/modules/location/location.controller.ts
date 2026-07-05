import { Request, Response } from "express";
import { reverseGeocode, searchLocation } from "./location.service.js";

export const getCurrentLocation = async (
  req: Request,
  res: Response
) => {
  try {
    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.lng);

    const location = await reverseGeocode(latitude, longitude);

    return res.status(200).json({
      success: true,
      message: "Location fetched successfully.",
      data: location,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch location.",
    });
  }
};

export const search = async (
  req: Request,
  res: Response
): Promise<void> => {
  const query = req.query.q as string;

  if (!query || query.trim().length < 2) {
    res.status(400).json({
      success: false,
      message: "Search query is required.",
    });
    return;
  }

  const locations = await searchLocation(query);

  res.status(200).json({
    success: true,
    message: "Locations fetched successfully.",
    data: locations,
  });
};