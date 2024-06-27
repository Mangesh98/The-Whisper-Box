import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "@/model/User";
import { NextAuthOptions, RequestInternal } from "next-auth";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn } from "next-auth/react";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials: any, req: any) {
				await dbConnect();
				try {
					const user = await UserModel.findOne({
						$or: [
							{ email: credentials.identifier },
							{ username: credentials.identifier },
						],
					});
					if (!user) {
						throw new Error("User not found");
					}
					if (!user.isVerified) {
						throw new Error("Please verify your account before login");
					}
					const isPasswordCorrect = await bcrypt.compare(
						credentials.password,
						user.password
					);
					if (isPasswordCorrect) {
						return user;
					}
					throw new Error("Incorrect credentials");
				} catch (error: any) {
					throw new Error(error);
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			token._id = user._id?.toString();
			token.isVerified = user.isVerified;
			token.isAcceptingMessages = user.isAcceptingMessages;
			token.username = user.username;
			return token;
		},
		async session({ session, token }) {
            if(token)
                {
                    session.user._id = token._id;
                    session.user.isVerified = token.isVerified;
                    session.user.isAcceptingMessages = token.isAcceptingMessages;
                    session.user.username = token.username;
                }
			return session;
		},
	},
	pages: {
		signIn: "/sign-in",
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXT_AUTH_SECRET,
};
