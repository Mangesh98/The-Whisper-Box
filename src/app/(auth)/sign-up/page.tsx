"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { SignUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
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
export default function SignUpForm(){
	const [username, setUsername] = useState("");
	const [usernameMessage, setUsernameMessage] = useState("");
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const debounced = useDebounceCallback(setUsername, 500);
	const { toast } = useToast();
	const router = useRouter();

	// zod implementation
	const form = useForm<z.infer<typeof SignUpSchema>>({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		const checkUsernameUnique = async () => {
			if (username) {
				setIsCheckingUsername(true);
				setUsernameMessage("");
				try {
					const response = await axios.get(
						`/api/check-username-unique?username=${username}`
					);
					setUsernameMessage(response.data.message);
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;
					setUsernameMessage(
						axiosError.response?.data.message ?? "Error checking username"
					);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		};
		checkUsernameUnique();
	}, [username]);

	const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
		setIsSubmitting(true);
		try {
			const response = await axios.post<ApiResponse>("/api/sign-up", data);
			toast({
				title: "Success",
				description: response.data.message,
			});
			router.replace(`/verify/${username}`);
		} catch (error) {
			console.error("Error in sign-up of user", error);
			const axiosError = error as AxiosError<ApiResponse>;
			let errorMessage =
				axiosError.response?.data.message ?? "Error signing up";
			toast({
				title: "Sign Up failed",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<div className="flex justify-center items-center min-h-screen bg-white">
				<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
					<div className="text-center">
						<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
							Join The Whisper Box
						</h1>
						<p className="mb-4">Sign up to start your anonymous adventure</p>
					</div>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="max-w-sm mx-auto"
						>
							<div className="space-y-6">
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Username</FormLabel>
											<FormControl>
												<Input
													placeholder="username"
													{...field}
													onChange={(e) => {
														field.onChange(e);
														debounced(e.target.value);
													}}
												/>
											</FormControl>
											<p
												className={`text-sm ${
													usernameMessage === "Username is available"
														? "text-green-500"
														: "text-red-500"
												}`}
											>
												test {usernameMessage}
											</p>
											{isCheckingUsername && (
												<Loader2 className="animate-spin" />
											)}
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input type="email" placeholder="email" {...field} />
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
								<Button className="w-full" type="submit" disabled={isSubmitting}>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
											wait
										</>
									) : (
										"Sign Up"
									)}
								</Button>
							</div>
						</form>
					</Form>
					<div className="text-center mt-4">
						<p>
							Already a member?
							<Link
								href="/sign-in"
								className="text-blue-600 hover:text-blue-800"
							>
								Sign In
							</Link>
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

