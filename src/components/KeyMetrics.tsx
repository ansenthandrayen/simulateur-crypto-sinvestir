import type { SimulationResult } from "@/services/dcaCalculator";

// Props : result contient tous les chiffres calculés par calculateDCA
type KeyMetricsProps = {
  result: SimulationResult;
};

// Formate un nombre en euros, avec séparateur de milliers français
function formatEuro(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function KeyMetrics({ result }: KeyMetricsProps) {
  const { totalInvested, finalCapital, performancePercent } = result;

  // Gains = différence entre capital final et investi
  const gains = finalCapital - totalInvested;

  // Pourcentage investi vs gains, pour la barre de progression
  // On protège contre une division par zéro si rien n'est investi
  const investedPercent =
    finalCapital > 0 ? (totalInvested / finalCapital) * 100 : 0;
  const gainsPercent = 100 - investedPercent;

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h2 className="title-section text-sm text-gold mb-6">Vos résultats</h2>

      {/* Capital final - le chiffre principal, mis en avant */}
      <div className="mb-6">
        <p className="text-sm text-text-secondary mb-1">Capital final</p>
        <p className="text-4xl font-bold text-text-primary">
          {formatEuro(finalCapital)}
        </p>
      </div>

      {/* Barre de progression investi / intérêts gagnés */}
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-accent-blue">
          Somme investie {formatEuro(totalInvested)}
        </span>
        <span className="text-gold">Intérêts gagnés {formatEuro(gains)}</span>
      </div>

      <div className="w-full h-3 rounded-full bg-background overflow-hidden flex mb-6">
        <div
          className="bg-accent-blue h-full"
          style={{ width: `${investedPercent}%` }}
        />
        <div className="bg-gold h-full" style={{ width: `${gainsPercent}%` }} />
      </div>

      {/* Performance en pourcentage */}
      <div>
        <p className="text-sm text-text-secondary mb-1">Performance</p>
        <p
          className={`text-2xl font-semibold ${
            performancePercent >= 0 ? "text-success" : "text-red-500"
          }`}
        >
          {performancePercent >= 0 ? "+" : ""}
          {performancePercent.toFixed(2)} %
        </p>
      </div>
    </div>
  );
}
