namespace CitySelectorConstantsNamespace {
  const citySelectorConstants = {
    ALPHABET: [
      { name: "A" },
      { name: "B" },
      { name: "C" },
      { name: "D" },
      { name: "E" },
      { name: "F" },
      { name: "G" },
      { name: "H" },
      { name: "I" },
      { name: "J" },
      { name: "K" },
      { name: "L" },
      { name: "M" },
      { name: "N" },
      { name: "Ñ" },
      { name: "O" },
      { name: "P" },
      { name: "Q" },
      { name: "R" },
      { name: "S" },
      { name: "T" },
      { name: "U" },
      { name: "V" },
      { name: "W" },
      { name: "X" },
      { name: "Y" },
      { name: "Z" },
    ],
    LEETERS: { ALL: "all" },
    ORIGIN: "origin",
    DESTINY: "destiny",
  };

  angular
    .module("ib-ui-city-selector-component-module")
    .constant("CitySelectorConstants", citySelectorConstants);
  export type CitySelectorConstants = typeof citySelectorConstants;
}
