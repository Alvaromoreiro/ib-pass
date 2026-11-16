"use strict";
const path = require("path");
const strictMode = true;
const order = require("./config/stylelint/stylelintorder.cjs");

module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-recommended-scss"],
  cache: true,
  cacheLocation: path.resolve(__dirname, "cache"),
  defaultSeverity: strictMode ? "error" : "warning",
  plugins: [
    "stylelint-declaration-strict-value",
    "stylelint-scss",
    "stylelint-order",
  ],
  rules: {
    "no-empty-source": null,
    "selector-pseudo-element-no-unknown": [
      true,
      { ignorePseudoElements: ["/ng-deep/"] },
    ],
    "property-no-vendor-prefix": null,
    "value-no-vendor-prefix": null,
    "no-descending-specificity": null,
    "selector-class-pattern": null,
    "unit-allowed-list": [
      ["rem", "px", "em", "%", "vh", "vw", "vmin", "vmax", "fr", "dvh", "dvw"],
      {
        ignoreProperties: {
          deg: ["/transform/"],
          s: ["/animation/", "/transition/"],
          ms: ["/transition/", "/animation/"],
        },
      },
    ],
    "scale-unlimited/declaration-strict-value": [
      [
        "/color/",
        "/border/",
        "/margin/",
        "/padding/",
        "font-family",
        "font-size",
        "/width/",
        "/^(?!line).*height/",
        "/padding/",
        "/border/",
        "/margin/",
      ],
      {
        ignoreVariables: true,
        ignoreFunctions: {
          "font-family": false,
        },
        ignoreValues: [
          0,
          "100%",
          "inherit",
          "auto",
          "transparent",
          "none",
          "solid",
          "initial",
          "exact",
          "/vh/",
          "/vw/",
          "/%/",
          "/max-content/",
          "/min-content/",
          "/color-adjust/",
          "/rem/",
          "/em/",
          "/unset/",
        ],
        disableFix: true,
      },
    ],
    "order/order": [
      "custom-properties",
      "dollar-variables",
      "at-variables",
      //'at-rules',
      "declarations",
      "rules",
    ],
    "order/properties-order": [
      [
        {
          groupName: "position",
          noEmptyLineBetween: true,
          properties: order.position,
        },
        {
          groupName: "display",
          noEmptyLineBetween: false,
          properties: order.display,
        },
        {
          groupName: "text",
          noEmptyLineBetween: true,
          properties: order.text,
        },
        {
          groupName: "colors",
          noEmptyLineBetween: true,
          properties: order.colors,
        },
      ],
      {
        unspecified: "bottomAlphabetical",
      },
    ],
  },
  ignoreFiles: [
    "**/*.js",
    "**/*.ts",
    "**/*.json",
    "**/*.ejs",
    "node_modules",
    "config",
    "test",
    "bin",
    "build",
    "version.txt",
    "README.md",
    ".gitignore",
    ".eslintrc",
    ".eslintignore",
    ".npmrc",
  ],
};
