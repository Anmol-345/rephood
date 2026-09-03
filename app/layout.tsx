import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "RepHood — Agentic Reputation Engine",
  description:
    "Verifiable on-chain reputation for every wallet. Computed by AI agents. Settled on Botchain.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "RepHood — Agentic Reputation Engine",
    description: "Verifiable on-chain reputation for every wallet. Computed by AI agents. Settled on Botchain.",
    url: "https://rephood.xyz",
    siteName: "RepHood",
    images: [
      {
        url: "/images/hero-bg.webp",
        width: 1200,
        height: 630,
        alt: "RepHood Agentic Reputation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RepHood — Agentic Reputation Engine",
    description: "Verifiable on-chain reputation for every wallet. Computed by AI agents. Settled on Botchain.",
    images: ["/images/hero-bg.webp"],
  },
};

import Web3Provider from "@/components/Web3Provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" as="image" href="/images/hero-bg.webp" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
