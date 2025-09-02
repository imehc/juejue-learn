import clsx from "clsx";
import type { Metadata, Viewport } from "next";
import { fontSans } from "~/config/fonts";
import { siteConfig } from "~/config/site";

import { Providers } from "./providers";

import "~/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "absolute left-0 top-0 h-screen w-screen bg-background font-sans antialiased overflow-hidden",
          fontSans.variable,
        )}
      >
        <Providers attribute="class" defaultTheme="dark">
          {children}
        </Providers>
      </body>
    </html>
  );
}
