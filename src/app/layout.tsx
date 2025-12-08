import "@/styles/globals.css";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/Providers/toast-provider";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    template: "%s | CentraQu",
    default: "CentraQu - Business Management Platform",
  },
  description:
    "Comprehensive business management platform for audit certification and consulting project management.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning className={manrope.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
