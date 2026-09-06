import { Response as ExpressResponse } from "express";

export interface ReverseGeocodeResult {
  city: string;
  state: string;
  country: string;
}

export interface LocationSearchResult {
  displayName: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface DirectionsResult {
  coordinates: [number, number][];
  distance: number;
  duration: number;
}

const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY;

let lastDirectionsRequest = 0;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const getDirectionsWithThrottle = async (
  url: string,
): Promise<globalThis.Response> => {
  const minimumInterval = 600;

  const now = Date.now();
  const elapsed = now - lastDirectionsRequest;

  if (elapsed < minimumInterval) {
    await wait(minimumInterval - elapsed);
  }

  lastDirectionsRequest = Date.now();

  return fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number,
): Promise<ReverseGeocodeResult> => {
  if (!LOCATIONIQ_API_KEY) {
    throw new Error(
      "LOCATIONIQ_API_KEY is not configured in environment variables.",
    );
  }

  const response = await fetch(
    `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch location from LocationIQ.");
  }

  const data = await response.json();
  const address = data.address || {};

  return {
    city:
      address.city ||
      address.town ||
      address.village ||
      address.hamlet ||
      address.suburb ||
      "",
    state: address.state || "",
    country: address.country || "",
  };
};

export const searchLocation = async (
  query: string,
): Promise<LocationSearchResult[]> => {
  if (!LOCATIONIQ_API_KEY) {
    throw new Error(
      "LOCATIONIQ_API_KEY is not configured in environment variables.",
    );
  }

  const response = await fetch(
    `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
      query,
    )}&limit=5&format=json&addressdetails=1`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to search location from LocationIQ.");
  }

  const data = await response.json();

  return data.map((item: any) => {
    const address = item.address || {};

    return {
      displayName: item.display_name,
      city:
        address.city ||
        address.town ||
        address.village ||
        address.hamlet ||
        address.suburb ||
        "",
      state: address.state || "",
      country: address.country || "",
      latitude: Number(item.lat),
      longitude: Number(item.lon),
    };
  });
};

export const getDirections = async (
  startLat: number,
  startLng: number,
  destinationLat: number,
  destinationLng: number,
): Promise<DirectionsResult> => {
  if (!LOCATIONIQ_API_KEY) {
    throw new Error(
      "LOCATIONIQ_API_KEY is not configured in environment variables.",
    );
  }

  const url =
    `https://us1.locationiq.com/v1/directions/driving/` +
    `${startLng},${startLat};${destinationLng},${destinationLat}` +
    `?key=${LOCATIONIQ_API_KEY}` +
    `&overview=full` +
    `&geometries=geojson`;

  console.log(
    "LocationIQ Directions Request:",
    `${startLng},${startLat} -> ${destinationLng},${destinationLat}`,
  );

  const response = await getDirectionsWithThrottle(url);

  const responseText = await response.text();

  console.log(
    "LocationIQ Directions Status:",
    response.status,
  );

  if (!response.ok) {
    console.log(
      "LocationIQ Directions Response:",
      responseText,
    );

    if (response.status === 429) {
      throw new Error(
        "LocationIQ is temporarily rate limiting directions. Please try again shortly.",
      );
    }

    throw new Error(
      `LocationIQ Directions failed with status ${response.status}: ${responseText}`,
    );
  }

  let data: any;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      "LocationIQ returned an invalid directions response.",
    );
  }

  if (!data.routes || data.routes.length === 0) {
    throw new Error(
      "LocationIQ returned no routes.",
    );
  }

  const route = data.routes[0];

  const coordinates =
    route.geometry?.coordinates?.map(
      (coordinate: [number, number]) => coordinate,
    ) ?? [];

  if (coordinates.length < 2) {
    throw new Error(
      "LocationIQ returned an empty route.",
    );
  }

  return {
    coordinates,
    distance: Number(route.distance ?? 0),
    duration: Number(route.duration ?? 0),
  };
};

export const fetchMapTile = async (
  z: number,
  x: number,
  y: number,
  res: ExpressResponse,
) => {
  if (!LOCATIONIQ_API_KEY) {
    throw new Error(
      "LOCATIONIQ_API_KEY is not configured in environment variables.",
    );
  }

  const subdomains = ["a", "b", "c"];
  const subdomain =
    subdomains[(x + y) % subdomains.length];

  const url =
    `https://${subdomain}-tiles.locationiq.com/v3/streets/r/` +
    `${z}/${x}/${y}.png?key=${LOCATIONIQ_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Failed to fetch map tile.",
    );
  }

  const buffer = Buffer.from(
    await response.arrayBuffer(),
  );

  res.setHeader(
    "Content-Type",
    "image/png",
  );

  res.setHeader(
    "Cache-Control",
    "public, max-age=86400",
  );

  res.send(buffer);
};