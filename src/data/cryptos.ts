// Liste des cryptomonnaies populaires disponibles dans le simulateur
// symbol correspond au ticker utilisé par l'API Binance (ex: BTCEUR)
export type Crypto = {
  id: string;
  name: string;
  symbol: string; // symbole Binance, ex "BTCEUR"
};

export const cryptos: Crypto[] = [
  { id: "bitcoin", name: "Bitcoin (BTC)", symbol: "BTCEUR" },
  { id: "ethereum", name: "Ethereum (ETH)", symbol: "ETHEUR" },
  { id: "binancecoin", name: "BNB (BNB)", symbol: "BNBEUR" },
  { id: "solana", name: "Solana (SOL)", symbol: "SOLEUR" },
  { id: "ripple", name: "XRP (XRP)", symbol: "XRPEUR" },
  { id: "cardano", name: "Cardano (ADA)", symbol: "ADAEUR" },
  { id: "dogecoin", name: "Dogecoin (DOGE)", symbol: "DOGEEUR" },
  { id: "polkadot", name: "Polkadot (DOT)", symbol: "DOTEUR" },
  { id: "litecoin", name: "Litecoin (LTC)", symbol: "LTCEUR" },
  { id: "chainlink", name: "Chainlink (LINK)", symbol: "LINKEUR" },
];
