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

// Page principale - route "/"
// Structure : Sidebar (navigation) + formulaire + résultats (chiffres clés + graphique)
export default function Home() {
  // Stocke le résultat complet de la simulation DCA une fois calculé
  const [result, setResult] = useState<SimulationResult | null>(null);

  // Indique si une simulation est en cours de calcul (appel API + calcul)
  const [loading, setLoading] = useState(false);

  // Stocke un message d'erreur si la simulation échoue
  // (API indisponible, crypto/période invalide, etc.)
  const [error, setError] = useState<string | null>(null);

  // Stocke un message informatif si la période réelle des données
  // diffère de la période demandée par l'utilisateur
  // (ex: crypto qui n'existait pas encore à la date de début demandée)
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Appelée quand l'utilisateur soumet le formulaire de simulation
  // Récupère les prix historiques puis calcule le DCA
  async function handleFormSubmit(params: {
    symbol: string;
    amount: number;
    frequency: Frequency;
    startDate: Date;
    endDate: Date;
  }) {
    setLoading(true);
    setError(null); // on efface l'erreur précédente avant une nouvelle tentative
    setResult(null); // on efface le résultat précédent pendant le nouveau calcul
    setInfoMessage(null); // on efface l'info précédente avant une nouvelle tentative

    try {
      // Récupère l'historique des prix depuis l'API Binance
      const prices = await getHistoricalPrices(
        params.symbol,
        params.startDate,
        params.endDate,
      );

      // Si aucune donnée n'est revenue, on considère ça comme une erreur
      if (prices.length === 0) {
        setError(
          "Aucune donnée disponible pour cette crypto sur cette période.",
        );
        return;
      }

      // On compare la date réelle du premier prix avec la date demandée
      // Si la crypto n'existait pas encore à la date demandée, Binance
      // renvoie les données à partir de sa date réelle de lancement
      const actualStartDate = prices[0].date;
      if (actualStartDate.getTime() > params.startDate.getTime()) {
        const formattedDate = new Intl.DateTimeFormat("fr-FR").format(
          actualStartDate,
        );
        setInfoMessage(
          `Les données disponibles débutent le ${formattedDate} (date de lancement de ${params.symbol} sur Binance).`,
        );
      }

      // Calcule le résultat de la simulation DCA à partir des prix récupérés
      const simulationResult = calculateDCA(prices, params);
      setResult(simulationResult);
    } catch (err) {
      // On log l'erreur en console pour faciliter le debug
      // mais on affiche un message simple et clair à l'utilisateur
      console.error("Erreur lors de la simulation :", err);
      setError("Une erreur est survenue lors du calcul. Veuillez réessayer.");
    } finally {
      // Dans tous les cas (succès ou échec), on arrête le chargement
      setLoading(false);
    }
  }

  return (
    <div className="flex">
      {/* Navigation latérale */}
      <Sidebar />

      {/* pt-20 sur mobile pour laisser de la place au bouton hamburger fixe */}
      <main className="flex-1 p-4 pt-20 md:p-8 md:pt-8 bg-background">
        {/* Titre principal de la page */}
        <h1 className="title-section text-xl md:text-2xl text-text-primary mb-6">
          Simulateur intérêts composés
        </h1>

        {/* flex-col par défaut (mobile) → flex-row à partir de md (desktop) */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Colonne formulaire - largeur fixe sur desktop, pleine largeur sur mobile */}
          <div className="w-full md:w-96">
            <SimulationForm onSubmit={handleFormSubmit} />
          </div>

          {/* Colonne résultats (chargement / erreur / info / données) */}
          <div className="flex-1">
            {/* Message affiché pendant le calcul */}
            {loading && (
              <p className="text-text-secondary">Calcul en cours...</p>
            )}

            {/* Message d'erreur si la simulation a échoué */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 mb-4">
                {error}
              </div>
            )}

            {/* Message informatif si la période réelle diffère de la demande */}
            {infoMessage && (
              <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-4 text-accent-blue mb-4 text-sm">
                ℹ️ {infoMessage}
              </div>
            )}

            {/* Bloc des chiffres clés - affiché uniquement si on a un résultat */}
            {result && <KeyMetrics result={result} />}

            {/* Graphique combiné - affiché uniquement si on a un résultat */}
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
