import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
<<<<<<< HEAD
    baseUrl: 'http://ip24sc3.sit.kmutt.ac.th/',
    baseAPI: 'http://ip24sc3.sit.kmutt.ac.th/itb-mshop',
    // baseUrl: 'http://localhost:5173',
    // baseAPI: 'http://localhost:8080/itb-mshop',

=======
    // baseUrl: 'http://ip24sc3.sit.kmutt.ac.th/',
    // baseAPI: 'http://ip24sc3.sit.kmutt.ac.th/itb-mshop',
    baseUrl: 'http://localhost:5173',
    baseAPI: 'http://localhost:8080/itb-mshop',
    experimentalRunAllSpecs: true,
>>>>>>> 7317fb36f59bfd45b7d171d329887f36a39f1e64
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

