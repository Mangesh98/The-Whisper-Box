"use client";

import React from "react";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar = () => {
	const { data: session } = useSession();
	const user: User = session?.user as User;

	return (
		<>
			<nav className="p-4 md:p-6 shadow-md">
				<div className="flex justify-between items-center container mx-auto flex-col md:flex-row">
					<h1 className="text-xl font-bold mb-4 md:mb-0">The Whisper Box</h1>
					<a href="#">
						{session ? (
							<>
								<span className="mr-4">
									Welcome, {user?.username || user?.email}
								</span>
								<Button onClick={() => signOut()} className="w-full md:w-auto">
									Logout
								</Button>
							</>
						) : (
							<>
								<Link href="/sign-in">
									<Button className="w-full md:w-auto">Sign In</Button>
								</Link>
							</>
						)}
					</a>
				</div>
			</nav>
		</>
	);
};

export default Navbar;
