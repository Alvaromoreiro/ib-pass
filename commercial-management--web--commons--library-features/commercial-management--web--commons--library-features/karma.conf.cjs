// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  const WATCH_MODE = process.env.npm_lifecycle_event === "test-watch";
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage"),
      subdir: ".",
      reporters: [{ type: "html" }, { type: "text-summary" },{ type: "lcov" }],
      check: {
        global: {
          statements: 18.9,
          branches: 17.1,
          functions: 18.5,
          lines: 17.6,
        },
      },
    },
    reporters: ["progress", "kjhtml"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [WATCH_MODE ? "Chrome" : "ChromeHeadless"],
    customLaunchers: {
      Chrome_headless: {
        base: "ChromeHeadless",
      },
      ChromeHeadlessCI: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"]
      },
    },
    singleRun: !WATCH_MODE,
    restartOnFileChange: true,
  });
};
