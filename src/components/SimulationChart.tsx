"use client";

import type { HistoryPoint } from "@/services/dcaCalculator";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Props : history vient de SimulationResult.history
type SimulationChartProps = {
  history: HistoryPoint[];
};

// Formate un nombre en euros pour l'affichage dans le graphique
function formatEuro(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

// Formate une date courte pour l'axe X (ex: "jan. 2024")
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function SimulationChart({ history }: SimulationChartProps) {
  // Recharts a besoin de données "plates" avec des clés simples
  // On transforme notre HistoryPoint en format compatible
  const chartData = history.map((point) => ({
    date: formatDate(point.date),
    valeur: Math.round(point.value),
    investi: Math.round(point.invested),
  }));

  // On n'affiche qu'un point sur N pour éviter de surcharger le graphique
  // si l'historique contient des milliers de jours (ex: 8 ans de données)
  const sampledData = chartData.filter(
    (_, index) => index % Math.ceil(chartData.length / 200) === 0,
  );

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h2 className="title-section text-sm text-gold mb-6">Historique</h2>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={sampledData}>
          {/* Grille de fond légère */}
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />

          {/* Axe horizontal - dates */}
          <XAxis
            dataKey="date"
            stroke="var(--text-secondary)"
            tick={{ fontSize: 12 }}
          />

          {/* Axe vertical - montants en euros */}
          <YAxis
            stroke="var(--text-secondary)"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatEuro(value)}
          />

          {/* Info-bulle au survol */}
          <Tooltip
            formatter={(value: number) => formatEuro(value)}
            contentStyle={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
            }}
          />

          {/* Zone remplie dorée - valeur du portefeuille */}
          <Area
            type="monotone"
            dataKey="valeur"
            stroke="var(--gold)"
            fill="var(--gold)"
            fillOpacity={0.15}
            strokeWidth={2}
            name="Valeur"
          />

          {/* Ligne bleue - montant investi cumulé */}
          <Line
            type="monotone"
            dataKey="investi"
            stroke="var(--accent-blue)"
            strokeWidth={2}
            dot={false}
            name="Investi"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
