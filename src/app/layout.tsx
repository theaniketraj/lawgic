import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Onest } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToasterProvider } from "./providers/toaster";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { ServiceWorkerRegister } from "@/components/layout/service-worker-register";
import { DisclaimerModal } from "@/components/layout/disclaimer-modal";

const onest = Onest({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lawgicchat.netlify.app"),
  title: {
    default: "LAWgic - Indian Judiciary AI Consultant",
    template: "%s | LAWgic",
  },
  description:
    "LAWgic is an AI-powered legal advisory and drafting tool for the Indian Judiciary. Consult BNS, BNSS, BSA, and case precedents.",
  keywords: [
    "Lawgic",
    "Indian Judiciary",
    "Legal AI",
    "BNS",
    "BNSS",
    "BSA",
    "Legal Consultant",
  ],
  authors: [{ name: "Lawgic Team" }],
  creator: "Lawgic",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://lawgicchat.netlify.app",
    title: "LAWgic - Indian Judiciary AI Consultant",
    description:
      "AI-powered legal advisory and drafting tool for the Indian Judiciary.",
    siteName: "LAWgic",
    images: [
      {
        url: "/og-image.jpg", // Ensure you add an og-image later
        width: 1200,
        height: 630,
        alt: "LAWgic AI Consultant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LAWgic - Indian Judiciary AI Consultant",
    description:
      "AI-powered legal advisory and drafting tool for the Indian Judiciary.",
    images: ["/og-image.jpg"],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "googlec38aaf57e2bde5ad",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Basic PWA Theme Color */}
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#0a0a0a"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body
        className={`bg-gray-50 dark:bg-dark-secondary min-h-screen flex flex-col ${onest.className}`}
      >
        <ThemeProvider disableTransitionOnChange>
          {/* ToasterProvider must render before the children components */}
          {/* https://github.com/emilkowalski/sonner/issues/168#issuecomment-1773734618 */}
          <ToasterProvider />
          <ServiceWorkerRegister />

          <div className="isolate flex flex-col flex-1">{children}</div>
          <DisclaimerModal />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
