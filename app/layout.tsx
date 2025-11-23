import "./globals.css";
import { Metadata } from "next";
import BountyProviders from "../components/providers/BountyProviders";

export const metadata: Metadata = {
  title: "Bounty Wizard",
  description: "Create bounties with a 3-step wizard",
  icons: {
    icon: "./assets/target.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body>
      <BountyProviders>{children}</BountyProviders>
    </body>
  </html>
  );
}