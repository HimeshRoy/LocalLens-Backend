interface ReverseGeocodeResult {
  city: string;
  state: string;
  country: string;
}

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult> => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
    {
      headers: {
        "User-Agent": "LocalLensAI/1.0",
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch location.");
  }

  const data = await response.json();

  return {
    city:
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.hamlet ||
      "",

    state: data.address.state || "",

    country: data.address.country || "",
  };
};

export interface LocationSearchResult {
  displayName: string;
  latitude: number;
  longitude: number;
}

export const searchLocation = async (
  query: string
): Promise<LocationSearchResult[]> => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
      query
    )}&limit=5`,
    {
      headers: {
        "User-Agent": "LocalLensAI/1.0",
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to search location.");
  }

  const data = await response.json();

  return data.map((item: any) => ({
    displayName: item.display_name,
    latitude: Number(item.lat),
    longitude: Number(item.lon),
  }));
};