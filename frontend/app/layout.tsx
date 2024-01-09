import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/common/theme-provider";
import Provider from "./provider";
import { Toaster as Sooner } from "@/components/ui/sonner";
import HolyLoader from "holy-loader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Connect",
    template: "%s - Connect",
  },
  description: "Connect with your friends and family.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/images/logo-light.svg",
        href: "/images/logo-light.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/images/logo-dark.svg",
        href: "/images/logo-dark.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HolyLoader color="#262626" height={5} zIndex={999999999999999} />
          <Provider>{children}</Provider>
          <Sooner />
        </ThemeProvider>
      </body>
    </html>
  );
}
