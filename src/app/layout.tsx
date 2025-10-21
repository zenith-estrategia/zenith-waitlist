import type { Metadata, Viewport } from "next";
import type React from "react";
import { Figtree, Instrument_Serif } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const siteConfig = {
  title: "Zenith Estratégia | Transformamos Marcas em Líderes de Mercado",
  description:
    "Junte-se a mais de 200 marcas visionárias. Vagas limitadas para marcas prontas para dominar o mercado com estratégias de marketing criativas que geram resultados.",
  url: "https://www.zenithestrategia.com.br",
  ogImage: "https://www.zenithestrategia.com.br/og-image.png",
  author: "Zenith Estratégia",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | Zenith Estratégia`,
  },
  description: siteConfig.description,
  keywords: [
    "marketing digital",
    "estratégia de marca",
    "liderança de mercado",
    "crescimento de negócios",
    "marketing criativo",
    "consultoria de marketing",
  ],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  generator: "Next.js",
  manifest: "/site.webmanifest",

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },

  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "Zenith Estratégia",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: siteConfig.url,
    languages: {
      "pt-BR": siteConfig.url,
    },
  },

  category: "business",
};

export const viewport: Viewport = {
  themeColor: "#d3ff33",
  colorScheme: "light",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Zenith Estratégia",
  url: siteConfig.url,
  logo: `${siteConfig.url}/icon.svg`,
  sameAs: [
    "https://www.linkedin.com/company/zenith-estrategia",
    "https://www.instagram.com/zenith.estrategia",
    "https://www.facebook.com/zenith.estrategia",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${figtree.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
