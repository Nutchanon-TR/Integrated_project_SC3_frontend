import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
<<<<<<< HEAD
    // baseUrl: 'http://ip24sc3.sit.kmutt.ac.th',
    // baseAPI: 'http://ip24sc3.sit.kmutt.ac.th/itb-mshop',
    baseUrl: 'http://localhost:5173',
    baseAPI: 'http://localhost:8080/itb-mshop',
=======
    baseUrl: 'http://ip24sc3.sit.kmutt.ac.th/',
    baseAPI: 'http://ip24sc3.sit.kmutt.ac.th/itb-mshop',
    // baseUrl: 'http://localhost:5173/',
    // baseAPI: 'http://localhost:8080/itb-mshop',
>>>>>>> a5557006ebcd0667a22091d7dbd5445f2ac1dc2e
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
