import type { Metadata } from "next";
import { Outfit, Vazirmatn } from "next/font/google";
import "./globals.css";

const vazir = Vazirmatn({ subsets: ["arabic"], variable: "--font-vazir" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Feature Selector | Mean-to-Std Index",
  description: "Dimensionality reduction with the |mean| / std index.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${vazir.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
