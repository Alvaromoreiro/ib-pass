function CapitalLetterFilter() {
  return (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };
}
module CapitalLetterFilter {
  export const $inject = [];
}
@Filters(
  "ib-commons-filters-module",
  [],
  [],
  CapitalLetterFilter,
  "CapitalLetterFilter",
)()
class CapitalLetterFilterClass {
  constructor() {}
}
