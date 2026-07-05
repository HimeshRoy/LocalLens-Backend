import { prisma } from "../config/prisma.js";

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

export const generateUniqueSlug = async (
  name: string,
  city: string
): Promise<string> => {
  const baseSlug = generateSlug(`${name}-${city}`);

  let slug = baseSlug;
  let counter = 2;

  while (
    await prisma.place.findUnique({
      where: {
        slug,
      },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};