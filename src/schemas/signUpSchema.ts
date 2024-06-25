import { z } from "zod";

export const UsernameValidation = z
	.string()
	.min(3, "Username must be at least 3 characters long.")
	.max(20, "Username must be no more than 20 characters long.")
	.regex(/^[a-zA-Z0-9_]+$/, "Username must contain only letters and numbers.");

export const SignUpSchema =z.object({
    username:UsernameValidation,
    email:z.string().email({message:"Invalid email address."}),
    password:z.string().min(6, {message:"Password must be at least 6 characters long."}),
})