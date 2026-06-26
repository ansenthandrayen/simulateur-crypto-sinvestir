// Composant Sidebar - navigation principale de l'application
// Reproduit le style visuel de simulateurs.sinvestir.fr
export default function Sidebar() {
  return (
    <aside className="w-64 bg-surface border-r border-border min-h-screen flex flex-col p-6">
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
  );
}
