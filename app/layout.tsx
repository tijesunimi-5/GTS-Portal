import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/component/Context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student Portal",
  description: "A student portal with authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}