import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Simule un environnement navigateur pour les tests
    environment: "jsdom",
    // Importe automatiquement les matchers jest-dom
    setupFiles: "./src/tests/setup.ts",
    // Permet d'utiliser describe/it/expect sans les importer
    globals: true,
  },
  resolve: {
    alias: {
      // Recrée l'alias @/ utilisé dans le projet Next.js
      // pour que les imports fonctionnent aussi dans les tests
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
