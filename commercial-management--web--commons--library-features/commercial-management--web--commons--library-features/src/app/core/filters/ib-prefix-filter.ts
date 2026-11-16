function prefixCheckSpecialCharactersFilter() {
  return (items: Array<string>, letterSelected: string) => {
    const removeAccents = (value: string): string => {
      return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };
    let item,
      filtered = [];
    const resultFilter = [];
    const letterLength = letterSelected.length;
    if (items?.length > 0) {
      for (let i = 0; i < items.length; i++) {
        item = items[i];
        const checkName = item.name ? item.name : null;
        const checkDescription = item.description
          ? item.description
          : checkName;
        let objectItem = null;
        if (checkDescription) {
          objectItem = removeAccents(
            checkDescription.toLowerCase().substring(0, letterLength),
          ).includes(removeAccents(letterSelected.toLowerCase()));
          if (objectItem) {
            resultFilter.push(item);
          }
        }
      }
    }
    filtered = resultFilter;
    return filtered;
  };
}
module prefixCheckSpecialCharactersFilter {
  export const $inject = [];
}
@Filters(
  "ib-commons-filters-module",
  [],
  [],
  prefixCheckSpecialCharactersFilter,
  "prefixCheckSpecialCharactersFilter",
)()
class PrefixCheckSpecialCharactersFilter {
  constructor() {}
}
