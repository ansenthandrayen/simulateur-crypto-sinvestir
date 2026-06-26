"use client";

import { getHistoricalPrices } from "@/services/binanceApi";
import { calculateDCA, type SimulationResult } from "@/services/dcaCalculator";
import { useEffect, useState } from "react";

// Page de test temporaire - sera remplacée par le vrai simulateur
export default function Home() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testCalculation() {
      // On récupère 6 mois de données pour tester rapidement
      const startDate = new Date("2024-01-01");
      const endDate = new Date("2024-06-01");

      const prices = await getHistoricalPrices("BTCEUR", startDate, endDate);

      // On simule un DCA pour one shot
      const simulationResult = calculateDCA(prices, {
        amount: 1000,
        frequency: "once", // ← on teste le one-shot
        startDate,
        endDate,
      });

      setResult(simulationResult);
      setLoading(false);
    }

    testCalculation();
  }, []);

  return (
    <div className="p-8 bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gold">Test Design System</h1>
      <h2 className="title-section text-2xl text-text-primary">
        Simulateur intérêts composés
      </h2>
      <div className="bg-surface border border-border rounded-lg p-4">
        <p className="text-text-primary">Texte principal</p>
        <p className="text-text-secondary">Texte secondaire</p>
        <p className="text-accent-blue">Accent bleu</p>
        <p className="text-success">Succès (vert)</p>
      </div>
    </div>
  );
}
