"use client";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { VerifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const VerifyAccount = () => {
	const router = useRouter();
	const params = useParams<{ username: string }>();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof VerifySchema>>({
		resolver: zodResolver(VerifySchema),
	});

	const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
		try {
			const response = await axios.post(`/api/verify-code`, {
				username: params.username,
				code: data.code,
			});
			// console.log(response.statusText, response.status);

			if (response.status === 200) {
				toast({
					title: "Success",
					description: response.data.message,
				});
				router.replace("/sign-in");
			} else {
				toast({
					title: "Error",
					description: response.data.message,
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error in verify account: ", error);
			const axiosError = error as AxiosError<ApiResponse>;
			let errorMessage = axiosError.response?.data.message;
			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});
		}
	};

	return (
		<>
			<div className="flex justify-center items-center min-h-screen bg-white">
				<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
					<div className="text-center">
						<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
							Verify Your Account
						</h1>
						<p className="mb-4">
							Enter the verification code sent to your email
						</p>
					</div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="space-y-6">
								<FormField
									control={form.control}
									name="code"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Verification Code</FormLabel>
											<FormControl>
												<Input placeholder="Code" {...field} />
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit">Submit</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</>
	);
};

export default VerifyAccount;
