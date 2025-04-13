import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../providers";
import { Inter } from "next/font/google";
import { AppbarClient } from "../components/AppbarClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextPay",
  description: "Simple Payment Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <div className="min-w-screen min-h-screen bg-[#ebe6e6]">
            <AppbarClient />
            {children}
          </div>
        </body>
      </Providers>
    </html>
  );
}
