import { z } from "zod";
import { UserRole } from "@prisma/client";

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.nativeEnum(UserRole),
  }),
});