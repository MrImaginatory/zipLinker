import type { Metadata } from "next";
import { Geist, Poppins, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const logoPath = process.env.NEXT_PUBLIC_LOGO_PATH || "/logo.svg"
const productName = process.env.NEXT_PUBLIC_PRODUCT_NAME || ""

export const metadata: Metadata = {
  title: productName ? `${productName} - URL Shortener` : "URL Shortener",
  description: productName
    ? `Shorten, share, and track your links with ${productName}.`
    : "Shorten, share, and track your links.",
  icons: {
    icon: logoPath,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${poppins.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          {children}
          <div className="fixed bottom-6 right-6 z-50 hidden md:block">
            <ThemeToggle />
          </div>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
