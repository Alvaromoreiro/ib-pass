function CitySearchComponentFilter() {
  return (items: any[], letterSelected: string): any => {
    let i: number,
      filtered: any[] = [];
    const codeIata: any[] = [],
      firstLettersCity: any[] = [],
      cityAnyMatch: any[] = [],
      letterLength = letterSelected.length;
    if (letterLength >= 3 && items.length > 0) {
      for (i = 0; i < items.length; i++) {
        const item = items[i];
        if (
          item.code
            .substring(0, 3)
            .toLowerCase()
            .includes(removeAccents(letterSelected.toLowerCase()))
        ) {
          codeIata.unshift(item);
        } else if (
          removeAccents(
            item.description.toLowerCase().substring(0, letterLength),
          ).includes(removeAccents(letterSelected.toLowerCase()))
        ) {
          firstLettersCity.push(item);
        } else if (
          removeAccents(item.description.toLowerCase()).includes(
            removeAccents(letterSelected.toLowerCase()),
          )
        ) {
          cityAnyMatch.push(item);
        } else if (
          item.countryLong &&
          removeAccents(item.countryLong.toLowerCase()).includes(
            removeAccents(letterSelected.toLowerCase()),
          )
        ) {
          cityAnyMatch.push(item);
        }
      }
    } else {
      filtered = items;
    }
    firstLettersCity.sort(orderList);
    cityAnyMatch.sort(orderList);
    filtered = codeIata.concat(firstLettersCity, cityAnyMatch);
    return filtered;
  };
}

function removeAccents(str: any) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function orderList(a: any, b: any): number {
  if (a.description > b.description) {
    return 1;
  }
  if (a.description < b.description) {
    return -1;
  }
  return 0;
}

module CitySearchComponentFilter {
  export const $inject = [];
}

@Filters(
  "ib-ui-city-selector-component-module",
  [],
  [],
  CitySearchComponentFilter,
  "CitySearchComponentFilter",
)()
class CitySearchComponentFilterClass {
  constructor() {}
}
