"use client";

import Sidebar from "@/components/Sidebar";
import SimulationForm from "@/components/SimulationForm";

export default function Home() {
  // Pour l'instant on affiche juste les paramètres choisis dans la console
  // On branchera le vrai calcul DCA à l'étape suivante
  function handleFormSubmit(params: {
    symbol: string;
    amount: number;
    frequency: string;
    startDate: Date;
    endDate: Date;
  }) {
    console.log("Paramètres soumis :", params);
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-background">
        <h1 className="title-section text-2xl text-text-primary mb-6">
          Simulateur intérêts composés
        </h1>
        <div className="max-w-md">
          <SimulationForm onSubmit={handleFormSubmit} />
        </div>
      </main>
    </div>
  );
}
