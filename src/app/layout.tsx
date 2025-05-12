import TQProvider from "@/lib/providers/TQProvider";
import "@/styles/globals.scss";
import type { Metadata } from "next";
import localFont from "next/font/local";

const pretendard = localFont({
  src: "../assets/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard"
});

export const metadata: Metadata = {
  title: "GitHub Activity Tracker",
  description: "Track and visualize your GitHub activities",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={pretendard.className}>
                <TQProvider>{children}</TQProvider>
            </body>
        </html>
    );
}
