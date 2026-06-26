"use client";

import KeyMetrics from "@/components/KeyMetrics";
import Sidebar from "@/components/Sidebar";
import SimulationChart from "@/components/SimulationChart";
import SimulationForm from "@/components/SimulationForm";
import { getHistoricalPrices } from "@/services/binanceApi";
import {
  calculateDCA,
  type Frequency,
  type SimulationResult,
} from "@/services/dcaCalculator";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(params: {
    symbol: string;
    amount: number;
    frequency: Frequency;
    startDate: Date;
    endDate: Date;
  }) {
    setLoading(true);

    const prices = await getHistoricalPrices(
      params.symbol,
      params.startDate,
      params.endDate,
    );

    const simulationResult = calculateDCA(prices, params);
    setResult(simulationResult);
    setLoading(false);
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-background">
        <h1 className="title-section text-2xl text-text-primary mb-6">
          Simulateur intérêts composés
        </h1>

        <div className="flex gap-6">
          <div className="w-96">
            <SimulationForm onSubmit={handleFormSubmit} />
          </div>

          <div className="flex-1">
            {loading && (
              <p className="text-text-secondary">Calcul en cours...</p>
            )}
            {result && <KeyMetrics result={result} />}
            {result && (
              <div className="mt-6">
                <SimulationChart history={result.history} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
