import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 10000,
    viewportWidth: 1024,
    viewportHeight: 733,
    blockHosts: [
        'securepubads.g.doubleclick.net',
        'pagead2.googlesyndication.com',
        'googleads4.g.doubleclick.net',
        'obseu.forroundprince.com'
    ],
    chromeWebSecurity: false,
    video: false,
    e2e: {
        setupNodeEvents (on, config) {
            // implement node event listeners here
        }
    },
    env: {
        url: 'http://localhost:9008/'
    }
});
