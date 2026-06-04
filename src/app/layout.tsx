import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestion de Trésorerie Associative",
  description: "Application mobile-first pour trésoriers d'associations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full`}>
        <NextAuthProvider>
          <div className="min-h-full">
            <Navigation />
            <main className="pb-20 md:pb-0 md:pl-64">
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
