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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test calcul DCA</h1>

      {loading && <p>Chargement...</p>}

      {result && (
        <div className="space-y-2">
          <p>Investi total : {result.totalInvested.toFixed(2)} €</p>
          <p>Acquis total : {result.totalAcquired.toFixed(8)} BTC</p>
          <p>Prix moyen : {result.averagePrice.toFixed(2)} €</p>
          <p>Capital final : {result.finalCapital.toFixed(2)} €</p>
          <p>Performance : {result.performancePercent.toFixed(2)} %</p>
          <p>Points d&apos;historique : {result.history.length}</p>
        </div>
      )}
    </div>
  );
}
