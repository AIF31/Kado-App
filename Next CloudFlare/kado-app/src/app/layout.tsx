import type { Metadata } from "next";
import { Jost, Outfit } from "next/font/google";
import "./globals.css";

const jost = Jost({
	variable: "--font-jost",
	subsets: ["latin"],
	display: "swap",
});

const outfit = Outfit({
	variable: "--font-outfit",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Kado App",
	description: "Plataforma de salud nutricional",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body className={`${jost.variable} ${outfit.variable} antialiased bg-kado-light/20`}>{children}</body>
		</html>
	);
}
