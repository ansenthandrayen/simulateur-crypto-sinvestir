import type { PricePoint } from "@/services/binanceApi";
import { calculateDCA } from "@/services/dcaCalculator";
import { describe, expect, it } from "vitest";

// Données de test fictives - simule 4 semaines de prix Bitcoin
// On contrôle exactement les valeurs pour pouvoir calculer
// manuellement le résultat attendu
const mockPrices: PricePoint[] = [
  { date: new Date("2024-01-01"), price: 40000 },
  { date: new Date("2024-01-08"), price: 42000 },
  { date: new Date("2024-01-15"), price: 38000 },
  { date: new Date("2024-01-22"), price: 44000 },
];

describe("calculateDCA", () => {
  // Test 1 → vérifie le calcul DCA hebdomadaire de base
  it("calcule correctement un DCA hebdomadaire", () => {
    const result = calculateDCA(mockPrices, {
      amount: 100,
      frequency: "weekly",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-22"),
    });

    // 4 achats de 100€ chacun → 400€ investis au total
    expect(result.totalInvested).toBe(400);

    // Acquis = somme de (100/40000 + 100/42000 + 100/38000 + 100/44000)
    const expectedAcquired =
      100 / 40000 + 100 / 42000 + 100 / 38000 + 100 / 44000;
    expect(result.totalAcquired).toBeCloseTo(expectedAcquired, 8);
  });

  // Test 2 → vérifie le calcul one-shot (investissement unique)
  it("calcule correctement un investissement one-shot", () => {
    const result = calculateDCA(mockPrices, {
      amount: 1000,
      frequency: "once",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-22"),
    });

    // Investi = montant unique, pas de répétition
    expect(result.totalInvested).toBe(1000);

    // Acheté au premier prix disponible (40000€)
    expect(result.averagePrice).toBe(40000);

    // Acquis = 1000 / 40000
    expect(result.totalAcquired).toBeCloseTo(1000 / 40000, 8);
  });

  // Test 3 → vérifie que la performance est calculée correctement
  it("calcule une performance positive quand le prix final est plus haut", () => {
    const result = calculateDCA(mockPrices, {
      amount: 1000,
      frequency: "once",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-22"),
    });

    // Premier prix 40000€, dernier prix 44000€ → forcément positif
    expect(result.performancePercent).toBeGreaterThan(0);
  });

  // Test 4 → vérifie le comportement avec un tableau de prix vide
  it("renvoie un résultat vide si aucune donnée de prix", () => {
    const result = calculateDCA([], {
      amount: 100,
      frequency: "weekly",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-22"),
    });

    expect(result.totalInvested).toBe(0);
    expect(result.totalAcquired).toBe(0);
    expect(result.finalCapital).toBe(0);
  });
});
