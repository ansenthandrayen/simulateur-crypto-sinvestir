import type { PricePoint } from "./binanceApi";

// Les fréquences d'investissement possibles
export type Frequency = "daily" | "weekly" | "monthly" | "once";

// Ce que l'utilisateur configure dans le formulaire
export type SimulationParams = {
  amount: number; // montant investi à chaque fois
  frequency: Frequency; // fréquence d'investissement
  startDate: Date;
  endDate: Date;
};

// Le résultat complet de la simulation, prêt à afficher
export type SimulationResult = {
  totalInvested: number; // somme totale investie
  totalAcquired: number; // quantité totale de crypto acquise
  averagePrice: number; // prix moyen d'acquisition
  finalCapital: number; // valeur du capital à la fin
  performancePercent: number; // performance en %
  history: HistoryPoint[]; // historique jour par jour pour le graphique
};

// Un point de l'historique, utilisé pour tracer le graphique
export type HistoryPoint = {
  date: Date;
  invested: number; // cumul investi à cette date
  acquired: number; // cumul crypto acquise à cette date
  value: number; // valeur du portefeuille à cette date (au prix du jour)
};

// Convertit une fréquence en nombre de jours entre deux achats
// "once" n'est pas concerné ici, géré séparément
function frequencyToDays(frequency: Frequency): number {
  switch (frequency) {
    case "daily":
      return 1;
    case "weekly":
      return 7;
    case "monthly":
      return 30;
    default:
      return 7;
  }
}

// Fonction principale - calcule toute la simulation DCA
// prices : l'historique des prix récupéré depuis Binance
// params : la configuration choisie par l'utilisateur
export function calculateDCA(
  prices: PricePoint[],
  params: SimulationParams,
): SimulationResult {
  const { amount, frequency, startDate, endDate } = params;

  // Cas particulier : investissement unique (one-shot)
  if (frequency === "once") {
    return calculateOneShot(prices, amount, startDate, endDate);
  }

  // Variables qui s'accumulent au fil de la boucle
  let totalInvested = 0;
  let totalAcquired = 0;
  const history: HistoryPoint[] = [];

  const intervalDays = frequencyToDays(frequency);

  // On parcourt les prix dans l'ordre chronologique
  // et on "achète" à intervalle régulier
  let nextBuyDate = new Date(startDate);

  for (const point of prices) {
    // On ignore les prix hors de la période demandée
    if (point.date < startDate || point.date > endDate) continue;

    // Si on a atteint (ou dépassé) la date du prochain achat → on achète
    if (point.date >= nextBuyDate) {
      totalInvested += amount;
      totalAcquired += amount / point.price;

      // On programme le prochain achat
      nextBuyDate = new Date(nextBuyDate);
      nextBuyDate.setDate(nextBuyDate.getDate() + intervalDays);
    }

    // On enregistre un point d'historique à CHAQUE jour
    // (même les jours sans achat) pour avoir un graphique fluide
    history.push({
      date: point.date,
      invested: totalInvested,
      acquired: totalAcquired,
      value: totalAcquired * point.price,
    });
  }

  // Le prix le plus récent dans nos données = prix actuel
  const lastPrice = prices[prices.length - 1]?.price ?? 0;

  const finalCapital = totalAcquired * lastPrice;
  const averagePrice = totalAcquired > 0 ? totalInvested / totalAcquired : 0;
  const performancePercent =
    totalInvested > 0
      ? ((finalCapital - totalInvested) / totalInvested) * 100
      : 0;

  return {
    totalInvested,
    totalAcquired,
    averagePrice,
    finalCapital,
    performancePercent,
    history,
  };
}

// Calcule le cas particulier d'un investissement unique (one-shot)
// On achète tout en une seule fois, au premier prix disponible
function calculateOneShot(
  prices: PricePoint[],
  amount: number,
  startDate: Date,
  endDate: Date,
): SimulationResult {
  // On filtre la période demandée
  const periodPrices = prices.filter(
    (p) => p.date >= startDate && p.date <= endDate,
  );

  if (periodPrices.length === 0) {
    // Aucune donnée disponible → on renvoie un résultat vide
    return {
      totalInvested: 0,
      totalAcquired: 0,
      averagePrice: 0,
      finalCapital: 0,
      performancePercent: 0,
      history: [],
    };
  }

  // Premier prix de la période = prix d'achat unique
  const buyPrice = periodPrices[0].price;
  const totalAcquired = amount / buyPrice;

  // On construit l'historique jour par jour avec la quantité fixe acquise
  const history: HistoryPoint[] = periodPrices.map((point) => ({
    date: point.date,
    invested: amount, // toujours le même montant investi
    acquired: totalAcquired, // toujours la même quantité
    value: totalAcquired * point.price,
  }));

  const lastPrice = periodPrices[periodPrices.length - 1].price;
  const finalCapital = totalAcquired * lastPrice;
  const performancePercent = ((finalCapital - amount) / amount) * 100;

  return {
    totalInvested: amount,
    totalAcquired,
    averagePrice: buyPrice,
    finalCapital,
    performancePercent,
    history,
  };
}
