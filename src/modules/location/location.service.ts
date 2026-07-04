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