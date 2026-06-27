"use client";

import { useState } from "react";

// Composant Sidebar - navigation principale de l'application
// Reproduit le style visuel de simulateurs.sinvestir.fr
// Sur mobile : cachée par défaut, ouverte via un bouton hamburger
export default function Sidebar() {
  // Contrôle l'ouverture/fermeture de la sidebar sur mobile
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton hamburger - visible uniquement sur mobile (md:hidden) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-surface border border-border rounded-lg p-2 text-text-primary"
        aria-label="Ouvrir le menu"
      >
        ☰
      </button>

      {/* Overlay sombre derrière la sidebar ouverte sur mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar elle-même
          - Sur desktop (md:) : toujours visible, position normale
          - Sur mobile : cachée par défaut (translate-x négatif), 
            glisse à l'écran quand isOpen est true */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          w-64 bg-surface border-r border-border min-h-screen flex flex-col p-6
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo / nom de l'application */}
        <div className="mb-10">
          <h1 className="title-section text-lg text-gold">S&apos;investir</h1>
          <p className="title-section text-sm text-text-primary">Simulateurs</p>
        </div>

        {/* Navigation principale */}
        <nav className="flex flex-col gap-2">
          {/* Lien actif - mis en évidence avec une bordure bleue */}

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent-blue/10 border-l-2 border-accent-blue text-text-primary text-sm"
          >
            Les simulateurs
          </a>

          {/* Liens inactifs */}

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary text-sm hover:bg-white/5 transition-colors"
          >
            Tableau de bord
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary text-sm hover:bg-white/5 transition-colors"
          >
            Mes simulations
          </a>
        </nav>
      </aside>
    </>
  );
}
