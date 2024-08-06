import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must have atleast 2 characters")
  .max(20, "Username must not be more then 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be atlease 6 characters"),
});
