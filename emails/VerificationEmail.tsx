import {
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Text,
	Font,
	Row,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
	username: string;
	otp: string;
}

export default function VerificationEmail({
	username,
	otp,
}: VerificationEmailProps) {
	return (
		<Html lang="en" dir="ltr">
			<Head>
				<title>Verify your email</title>
				<Font
					fontFamily="Roboto"
					fallbackFontFamily="Verdana"
					webFont={{
						url: "https://fonts.gstatic.com/s/roboto/v27/ KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
						format: "woff2",
					}}
					fontWeight={400}
					fontStyle="normal"
				/>
				<Preview>Here&apos;s your verification code: {otp}</Preview>
				<Section>
					<Row>
						<Heading as="h2">Hello {username},</Heading>
					</Row>
					<Row>
						<Text>
							Thank you for registering. Please use the following verification
							code to complete your registration:
						</Text>
					</Row>
					<Row>
						<Text>{otp}</Text>
					</Row>
					<Row>
						<Text>
							if you did not request this code, please ignore this mail.
						</Text>
					</Row>
				</Section>
			</Head>
		</Html>
	);
}
