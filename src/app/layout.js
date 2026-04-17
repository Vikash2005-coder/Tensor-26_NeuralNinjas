import { Inter, Space_Mono, Dela_Gothic_One } from "next/font/google";
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

const delaGothic = Dela_Gothic_One({
  variable: "--font-dela",
  subsets: ["latin"],
  weight: '400',
});

export const metadata = {
  title: "MINDSTONE: Neural Analysis Division",
  description: "Advanced cognitive resonance monitoring and empathetic intervention cockpit.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable} ${delaGothic.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
