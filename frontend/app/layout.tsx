import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Ten Year Wrapped | Malique Spooner",
  description: "A visual, interactive archive of a decade in music listening.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
