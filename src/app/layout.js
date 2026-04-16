import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ['400', '700'],
});

export const metadata = {
  title: "Neuro-Linguistic Resonance Dashboard",
  description: "Real-time neural oscillation monitor based on semantic cognitive load analysis.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
