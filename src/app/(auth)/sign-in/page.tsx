"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { SignInSchema } from "@/schemas/signInSchema";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SignInForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const form = useForm<z.infer<typeof SignInSchema>>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});

	const { toast } = useToast();
	const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
		setIsSubmitting(true);
		try {
			const result = await signIn("credentials", {
				redirect: false,
				identifier: data.identifier,
				password: data.password,
			});

			if (result?.error) {
				if (result.error === "CredentialsSignin") {
					toast({
						title: "Login Failed",
						description: "Incorrect username or password",
						variant: "destructive",
					});
				} else {
					toast({
						title: "Error",
						description: result.error,
						variant: "destructive",
					});
				}
			}

			if (result?.url) {
				toast({
					title: "Login Successful !",
					description: "Welcome back to The Whisper Box",
					variant: "default",
				});
				router.replace("/dashboard");
			}
		} catch (error) {
			console.error(error);
			const axiosError = error as AxiosError<ApiResponse>;
			let errorMessage = axiosError.response?.data.message;
			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-800">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Welcome Back to The Whisper Box
					</h1>
					<p className="mb-4">Sign in to continue your secret conversations</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							name="identifier"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email/Username</FormLabel>
									<Input {...field} />
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<Input type="password" {...field} />
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="w-full" type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
								</>
							) : (
								"Sign In"
							)}
						</Button>
					</form>
				</Form>
				<div className="text-center mt-4">
					<p>
						Not a member yet?{" "}
						<Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
