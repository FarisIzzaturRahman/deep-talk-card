import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const siteName = "ajakBicara";
const siteDescription =
  "Game pertanyaan untuk obrolan santai, seru-seruan, PDKT, dan percakapan yang lebih bermakna.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ajakbicara.web.id"),
  applicationName: siteName,
  title: siteName,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    title: siteName,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className="font-sans"
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
