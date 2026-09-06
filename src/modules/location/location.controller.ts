import { Request, Response } from "express";
import {
  reverseGeocode,
  searchLocation,
  getDirections,
  fetchMapTile,
} from "./location.service.js";

export const getCurrentLocation = async (req: Request, res: Response) => {
  try {
    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.lng);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required.",
      });
    }

    const location = await reverseGeocode(latitude, longitude);

    return res.status(200).json({
      success: true,
      message: "Location fetched successfully.",
      data: location,
    });
  } catch (error) {
    console.error("Reverse Geocode Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch location.",
    });
  }
};

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error) {
    console.error("Location Search Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search locations.",
    });
  }
};

export const directions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const startLat = Number(req.query.startLat);
    const startLng = Number(req.query.startLng);
    const destinationLat = Number(req.query.destinationLat);
    const destinationLng = Number(req.query.destinationLng);

    if (
      !Number.isFinite(startLat) ||
      !Number.isFinite(startLng) ||
      !Number.isFinite(destinationLat) ||
      !Number.isFinite(destinationLng)
    ) {
      res.status(400).json({
        success: false,
        message: "Valid start and destination coordinates are required.",
      });

      return;
    }

    const route = await getDirections(
      startLat,
      startLng,
      destinationLat,
      destinationLng,
    );

    res.status(200).json({
      success: true,
      message: "Directions fetched successfully.",
      data: route,
    });
  } catch (error) {
    console.error("Directions Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch directions.",
    });
  }
};

export const mapTile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const z = Number(req.params.z);
    const x = Number(req.params.x);
    const y = Number(req.params.y);

    if (
      !Number.isInteger(z) ||
      !Number.isInteger(x) ||
      !Number.isInteger(y)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid tile coordinates.",
      });
      return;
    }

    await fetchMapTile(z, x, y, res);
  } catch (error) {
    console.error("Map Tile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load map tile.",
    });
  }
};