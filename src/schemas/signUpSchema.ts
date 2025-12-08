import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .max(30, "Username must be at most 30 characters long")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const signUpSchema = z.object({
  username: usernameSchema,
  email: z.string().regex(/^\S+@\S+\.\S+$/, "Please use a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
