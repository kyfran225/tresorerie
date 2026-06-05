import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestion de Trésorerie Associative",
  description: "Application mobile-first pour trésoriers d'associations",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="fr" className="h-full">
      <body className={cn(inter.className, "h-full bg-background text-foreground transition-colors duration-300")}>
        <NextAuthProvider>
          <div className="min-h-full">
            <Navigation />
            <Header />
            <main className={cn(
              "min-h-screen",
              session ? "pb-24 pt-16 md:pb-0 md:pl-64" : ""
            )}>
              <div className={cn(
                "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
                session ? "py-8" : ""
              )}>
                {children}
              </div>
            </main>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
