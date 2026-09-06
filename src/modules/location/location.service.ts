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

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult> => {
  if (!LOCATIONIQ_API_KEY) {
    throw new Error(
      "LOCATIONIQ_API_KEY is not configured in environment variables."
    );
  }

  const response = await fetch(
    `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`,
    {
      headers: {
        Accept: "application/json",
      },
    }
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
  query: string
): Promise<LocationSearchResult[]> => {
  if (!LOCATIONIQ_API_KEY) {
    throw new Error(
      "LOCATIONIQ_API_KEY is not configured in environment variables."
    );
  }

  const response = await fetch(
    `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
      query
    )}&limit=5&format=json&addressdetails=1`,
    {
      headers: {
        Accept: "application/json",
      },
    }
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
  destinationLng: number
): Promise<DirectionsResult> => {
  if (!LOCATIONIQ_API_KEY) {
    throw new Error(
      "LOCATIONIQ_API_KEY is not configured in environment variables."
    );
  }

  const response = await fetch(
    `https://us1.locationiq.com/v1/directions/driving/${startLng},${startLat};${destinationLng},${destinationLat}?key=${LOCATIONIQ_API_KEY}&geometries=geojson&overview=full`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error("LocationIQ Directions Error:", errorText);

    throw new Error("Failed to fetch directions from LocationIQ.");
  }

  const data = await response.json();

  if (!data.routes || data.routes.length === 0) {
    throw new Error("No route found.");
  }

  const route = data.routes[0];

  const coordinates =
    route.geometry?.coordinates?.map(
      (coordinate: [number, number]) => coordinate
    ) ?? [];

  return {
    coordinates,
    distance: Number(route.distance ?? 0),
    duration: Number(route.duration ?? 0),
  };
};