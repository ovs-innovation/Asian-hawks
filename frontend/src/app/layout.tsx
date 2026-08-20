import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Asian Hawks — Find Jobs Faster. Build Your Career.",
    template: "%s · Asian Hawks",
  },
  description: "Government jobs, private jobs, and career growth in one place. Asian Hawks Manpower Services Pvt. Ltd.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-[var(--bg)] text-[var(--heading)] antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
