import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: {
    default: "The Long Read",
    template: "%s — The Long Read",
  },
  description:
    "Essays, fiction, and dispatches from writers who take their time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ minHeight: "calc(100vh - var(--nav-height))" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}