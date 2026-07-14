import { prisma } from "../../config/prisma.js";
import { generateSlug } from "../../utils/slug.js";
import {
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "./category.types.js";

export const createCategory = async (payload: CreateCategoryInput) => {
  const slug = generateSlug(payload.name);

  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [
        {
          name: payload.name,
        },
        {
          slug,
        },
      ],
    },
  });

  if (existingCategory) {
    return {
      success: false,
      message: "Category already exists",
    };
  }

  const category = await prisma.category.create({
    data: {
      name: payload.name,
      slug,
      description: payload.description,
      icon: payload.icon,
    },
  });

  return {
    success: true,
    message: "Category created successfully",
    data: category,
  };
};

export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          places: true,
        },
      },
    },
  });

  return {
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  };
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    return {
      success: false,
      message: "Category not found",
    };
  }

  return {
    success: true,
    message: "Category fetched successfully",
    data: category,
  };
};

export const updateCategory = async (
  id: string,
  payload: UpdateCategoryInput,
) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!existingCategory) {
    return {
      success: false,
      message: "Category not found",
    };
  }

  const category = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name: payload.name ?? existingCategory.name,
      slug: payload.name ? generateSlug(payload.name) : existingCategory.slug,
      description: payload.description ?? existingCategory.description,
      icon: payload.icon ?? existingCategory.icon,
    },
  });

  return {
    success: true,
    message: "Category updated successfully",
    data: category,
  };
};

export const deleteCategory = async (id: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!existingCategory) {
    return {
      success: false,
      message: "Category not found",
    };
  }

  const category = await prisma.category.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });

  return {
    success: true,
    message: "Category deleted successfully",
    data: category,
  };
};
