import type { Metadata } from "next";
import "./globals.css";

// Métadonnées de la page - visibles dans l'onglet du navigateur
// et pour le référencement (SEO)
export const metadata: Metadata = {
  title: "Simulateur Crypto - S'investir",
  description: "Simulateur d'investissement DCA en cryptomonnaies",
};

// Layout racine - gabarit commun à toutes les pages de l'application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
