import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
	email: string,
	username: string,
	verifyCode: string
): Promise<ApiResponse> {
	try {
		const { data, error } = await resend.emails.send({
			from: "Acme <onboarding@resend.dev>",
			to: email,
			subject: "The Whisper Box | Verification code",
			react: VerificationEmail({ username, otp: verifyCode }),
		});

		if (error) {
			console.error("Error sending verification email:", error);
			return { success: false, message: "Error sending verification email" };
		} else {
			return { success: true, message: "Verification Email send successfully" };
		}
	} catch (error) {
		console.error("Error sending verification email:", error);
		return { success: false, message: "Failed to send verification email." };
	}
}
