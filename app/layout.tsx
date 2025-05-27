"use client";
//import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import StoreProvider from "./StoreProvider";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        {pathname === "/login" || pathname === "/" ? (
          <StoreProvider>{children}</StoreProvider>
        ) : (
          <Layout>{children}</Layout>
        )}
      </body>
    </html>
  );
}
