"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { SignInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const page = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { toast } = useToast();
	const router = useRouter();

	// zod implementation
	const form = useForm<z.infer<typeof SignInSchema>>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
		setIsSubmitting(true);
		const result = await signIn("credentials", {
			identifier: data.identifier,
			password: data.password,
			redirect: false,
		});
		if (result?.error) {
			if (result.error === "CredentialsSignin") {
				toast({
					title: "Login Failed",
					description: "Invalid email or password",
					variant: "destructive",
				});
			} else {
				toast({
					title: "Login Failed",
					description: result.error,
					variant: "destructive",
				});
			}
		}

		// if (result?.url) {
		// 	router.replace("/dashboard");
		// }
		setIsSubmitting(false);
	};

	return (
		<>
			<div className="flex justify-center items-center max-h-screen bg-gray-100">
				<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
					<div className="text-center">
						<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
							Join The Whisper Box
						</h1>
						<p className="mb-4">Sign In to start your anonymous adventure</p>
					</div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="space-y-6">
								<FormField
									control={form.control}
									name="identifier"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email/Username</FormLabel>
											<FormControl>
												<Input
													type="text"
													placeholder="email/username"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
											wait
										</>
									) : (
										"Sign In"
									)}
								</Button>
							</div>
						</form>
					</Form>
					<div className="text-center mt-4">
						<p>
							Don't have Account?
							<Link
								href="/sign-up"
								className="text-blue-600 hover:text-blue-800"
							>
								Sign Up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</>
	);
};
export default page;
