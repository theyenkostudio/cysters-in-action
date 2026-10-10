import type { Metadata } from "next";
import { ViewTransition } from "react";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cysters in Action",
  description:
    "A community for people living with PMOS to learn, connect and act.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${hanken.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* Cross-fades between pages. Styled by `.page-fade` in globals.css. */}
        <ViewTransition default="page-fade">{children}</ViewTransition>
      </body>
    </html>
  );
}
