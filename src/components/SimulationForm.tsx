"use client";

import { cryptos } from "@/data/cryptos";
import type { Frequency } from "@/services/dcaCalculator";
import { useState } from "react";

// Props : onSubmit appelé quand l'utilisateur valide le formulaire
// avec toutes les valeurs choisies
type SimulationFormProps = {
  onSubmit: (params: {
    symbol: string;
    amount: number;
    frequency: Frequency;
    startDate: Date;
    endDate: Date;
  }) => void;
};

export default function SimulationForm({ onSubmit }: SimulationFormProps) {
  // États contrôlés pour chaque champ du formulaire
  const [symbol, setSymbol] = useState(cryptos[0].symbol);
  const [amount, setAmount] = useState(25);
  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [startDate, setStartDate] = useState("2018-01-01");
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Appelée quand l'utilisateur soumet le formulaire
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      symbol,
      amount,
      frequency,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-border rounded-lg p-6 space-y-5"
    >
      <h2 className="title-section text-sm text-gold mb-4">Simulation</h2>

      {/* Sélection de la cryptomonnaie */}
      <div>
        <label className="block text-sm text-text-secondary mb-2">
          Actif numérique
        </label>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary"
        >
          {cryptos.map((crypto) => (
            <option key={crypto.id} value={crypto.symbol}>
              {crypto.name}
            </option>
          ))}
        </select>
      </div>

      {/* Montant investi */}
      <div>
        <label className="block text-sm text-text-secondary mb-2">
          Montant
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min={1}
          className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary"
        />
      </div>

      {/* Fréquence d'investissement */}
      <div>
        <label className="block text-sm text-text-secondary mb-2">
          Fréquence
        </label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as Frequency)}
          className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary"
        >
          <option value="once">Investissement unique</option>
          <option value="daily">Par jour</option>
          <option value="weekly">Par semaine</option>
          <option value="monthly">Par mois</option>
        </select>
      </div>

      {/* Date de début */}
      <div>
        <label className="block text-sm text-text-secondary mb-2">Depuis</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary"
        />
      </div>

      {/* Date de fin */}
      <div>
        <label className="block text-sm text-text-secondary mb-2">
          Jusqu&apos;au
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary"
        />
      </div>

      {/* Bouton de soumission */}
      <button
        type="submit"
        className="w-full bg-accent-blue text-text-primary rounded-lg py-3 font-medium hover:bg-accent-blue/80 transition-colors"
      >
        Simuler
      </button>
    </form>
  );
}
