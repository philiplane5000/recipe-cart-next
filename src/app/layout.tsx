import type { Metadata } from "next";
import { nunitoSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recipe Cart",
  description:
    "A modern web application that simplifies meal planning by allowing users to curate recipes, dynamically generate shopping lists from their weekly meal selections, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
