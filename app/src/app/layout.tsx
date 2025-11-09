import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tehran Evening Vista",
  description:
    "Hyper-realistic cinematic rendering of Tehran's skyline in a misty evening glow."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-night-900 text-white antialiased">
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
