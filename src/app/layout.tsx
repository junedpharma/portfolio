import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/context/ContentContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Juned Patel — Branch Manager | ATC Pharma Trade Portal",
  description: "Official Trade Information & Scheme Portal for Juned Patel, Branch Manager at ATC Pharma. View active trade schemes, bonus ratios, and branch notices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased selection:bg-[#059669] selection:text-white`}>
        <ContentProvider>
          {children}
        </ContentProvider>
      </body>
    </html>
  );
}
