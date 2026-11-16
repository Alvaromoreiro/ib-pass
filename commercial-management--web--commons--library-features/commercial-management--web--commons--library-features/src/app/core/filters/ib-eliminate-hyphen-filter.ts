function EliminateHyphenFilter() {
  return (text: string): string => {
    return text.replace(/[-]/g, " ");
  };
}
module EliminateHyphenFilter {
  export const $inject = [];
}
@Filters(
  "ib-commons-filters-module",
  [],
  [],
  EliminateHyphenFilter,
  "EliminateHyphenFilter",
)()
class EliminateHyphenFilterClass {
  constructor() {}
}
