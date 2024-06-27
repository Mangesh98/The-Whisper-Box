import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { UsernameValidation } from "@/schemas/signUpSchema";
import { VerifySchema } from "@/schemas/verifySchema";

const UsernameQuerySchema = z.object({
	username: UsernameValidation,
});
const codeVerifyQuerySchema = z.object({
	code: VerifySchema,
});

export async function POST(request: Request) {
	await dbConnect();
	try {
		let { username, code } = await request.json();
		
		// TODO: validate username and code
		// const queryParams = { username, code };
		// validate with zod
		// const usernameResult = UsernameQuerySchema.safeParse(queryParams);
		// const codeResult = codeVerifyQuerySchema.safeParse(queryParams);
		

		// if (!usernameResult.success) {
		// 	const usernameErrors =
		// 		usernameResult.error.format().username?._errors || [];
		// 	return Response.json(
		// 		{
		// 			success: false,
		// 			message:
		// 				usernameErrors?.length > 0
		// 					? usernameErrors.join(",")
		// 					: "Invalid query parameters",
		// 		},
		// 		{ status: 400 }
		// 	);
		// }
		// if (!codeResult.success) {
		// 	const codeErrors = codeResult.error.format().code?._errors || [];
		// 	return Response.json(
		// 		{
		// 			success: false,
		// 			message:
		// 				codeErrors?.length > 0
		// 					? codeErrors.join(",")
		// 					: "Invalid query parameters",
		// 		},
		// 		{ status: 400 }
		// 	);
		// }
		// username = usernameResult.data;
		// code = codeResult.data;

		const user = await UserModel.findOne({
			username,
		});

		if (!user) {
			return Response.json(
				{
					success: false,
					message: "User not found.",
				},
				{ status: 500 }
			);
		}

		const isCodeValid = user.verifyCode === code.code;
		const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

		if (isCodeValid && isCodeNotExpired) {
			user.isVerified = true;
			await user.save();
			return Response.json({
				success: true,
				message: "User verified successfully.",
			});
		} else if (!isCodeNotExpired) {
			return Response.json(
				{
					success: false,
					message: "Code Expired. Please sign up again.",
				},
				{ status: 400 }
			);
		} else {
			return Response.json({
				success: false,
				message: "Invalid Code. Please check the code and try again.",
			});
		}
	} catch (error) {
		console.error("Error Verifying User. ", error);
		return Response.json(
			{
				success: false,
				message: "Error Verifying User.",
			},
			{ status: 500 }
		);
	}
}
