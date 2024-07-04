import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { UsernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
	username: UsernameValidation,
});

export async function GET(request: Request) {
	await dbConnect();
	try {
		const { searchParams } = new URL(request.url);
		const queryParams = {
			username: searchParams.get("username"),
		};
		// validate with zod
		const result = UsernameQuerySchema.safeParse(queryParams);

		if (!result.success) {
			const usernameErrors = result.error.format().username?._errors || [];
			return Response.json(
				{
					success: false,
					message:
						usernameErrors?.length > 0
							? usernameErrors.join(",")
							: "Invalid query parameters",
				},
				{ status: 400 }
			);
		}
		const { username } = result.data;

		const existingVerifiedUser = await UserModel.findOne({
			username,
			isVerified: true,
		});

		if (existingVerifiedUser) {
			return Response.json(
				{
					success: false,
					message: "Username is already taken.",
				},
				{ status: 400 }
			);
		}
		return Response.json(
			{
				success: true,
				message: "Username is available",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error Checking Username. ", error);
		return Response.json(
			{
				success: false,
				message: "Error Checking Username.",
			},
			{ status: 500 }
		);
	}
}
