// Type qui décrit une "bougie" simplifiée pour notre usage
// On ne garde que ce qui nous intéresse : la date et le prix de clôture
export type PricePoint = {
  date: Date;
  price: number;
};

// URL de base de l'API publique Binance
const BASE_URL = "https://api.binance.com/api/v3/klines";

// Binance limite à 1000 résultats par requête
// On doit donc paginer si on demande plus de 1000 jours
const MAX_LIMIT = 1000;

// Convertit une Date JavaScript en timestamp millisecondes (format Binance)
function toBinanceTimestamp(date: Date): number {
  return date.getTime();
}

// Récupère l'historique des prix journaliers d'une crypto entre deux dates
// symbol : ex "BTCEUR", "ETHEUR"
// startDate / endDate : les bornes de la période demandée
export async function getHistoricalPrices(
  symbol: string,
  startDate: Date,
  endDate: Date,
): Promise<PricePoint[]> {
  const allPrices: PricePoint[] = [];

  // On garde une "date de curseur" qui avance à chaque requête
  // pour paginer sur toute la période demandée
  let currentStart = toBinanceTimestamp(startDate);
  const finalEnd = toBinanceTimestamp(endDate);

  // Boucle de pagination → tant qu'on n'a pas atteint la date de fin
  while (currentStart < finalEnd) {
    const url = `${BASE_URL}?symbol=${symbol}&interval=1d&startTime=${currentStart}&endTime=${finalEnd}&limit=${MAX_LIMIT}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur API Binance : ${response.status}`);
    }

    const data = await response.json();

    // Si Binance ne renvoie plus rien, on arrête la boucle
    if (data.length === 0) break;

    // On transforme chaque bougie brute en notre format simplifié
    for (const candle of data) {
      allPrices.push({
        date: new Date(candle[0]), // timestamp → Date
        price: parseFloat(candle[4]), // close price (string → number)
      });
    }

    // On avance le curseur juste après la dernière bougie reçue
    // +1 jour en millisecondes pour ne pas la recevoir deux fois
    const lastCandleTime = data[data.length - 1][0];
    currentStart = lastCandleTime + 24 * 60 * 60 * 1000;

    // Si on a reçu moins que la limite, c'est qu'on a tout récupéré
    if (data.length < MAX_LIMIT) break;
  }

  return allPrices;
}
