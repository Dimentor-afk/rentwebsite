import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import 'react-day-picker/dist/style.css';

export const metadata: Metadata = {
  title: "SeaVista | Beachfront Apartments",
  description:
    "Premium beachfront apartments in Miami offering serene ocean views and exceptional amenities.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-mist text-body antialiased">{children}</body>
    </html>
  );
}