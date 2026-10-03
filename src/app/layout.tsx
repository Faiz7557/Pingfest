import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { GridPulse } from "@/components/ui/grid-pulse";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#001D39",
};

export const metadata: Metadata = {
  title: "SIGAP | Sistem Informasi Geospasial Akses Presisi - Pingfest UNS 2026",
  description: "Memetakan Kesenjangan Kesiapan Digital Menuju Indonesia Emas 2045. AI memetakan, manusia memutuskan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col lg:flex-row bg-[#EDF4F9] text-[#001D39] selection:bg-[#7BBDE8] selection:text-[#001D39] relative">
        {/* Dynamic Interactive Grid Pulse Background with SIGAP Palette */}
        <GridPulse className="fixed inset-0 z-0 opacity-75" />

        {/* Responsive Navigation (Desktop Sidebar + Mobile Topbar/Drawer + Mobile Bottom Bar) */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-16 lg:pb-0 relative z-10">
          <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex-1">
            {children}
          </main>

          {/* Unified Global Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
