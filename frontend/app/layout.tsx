import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Ten Year Wrapped",
  description: "A rotating Spotify cover story built from your listening export.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
