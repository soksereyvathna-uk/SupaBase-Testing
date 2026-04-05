import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Charcoal Chicken — Born From the Flame",
  description: "Slow-cooked over real hardwood charcoal. Smoky, tender, and unapologetically bold. Melbourne's favourite charcoal chicken restaurant.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#1a1208", color: "#f5efe6", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
