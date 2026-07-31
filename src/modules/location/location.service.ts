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

const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY;

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult> => {
  if (!LOCATIONIQ_API_KEY) {
    throw new Error("LOCATIONIQ_API_KEY is not configured in environment variables.");
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
    throw new Error("LOCATIONIQ_API_KEY is not configured in environment variables.");
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