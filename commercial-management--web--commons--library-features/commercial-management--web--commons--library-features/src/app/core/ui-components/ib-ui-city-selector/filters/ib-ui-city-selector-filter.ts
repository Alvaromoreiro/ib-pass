function CitySelectorComponentFilter($filter: ng.IFilterFunction) {
  return (items: any[], letterSelected: string): any => {
    let i,
      filtered = [];
    const letterMatch = new RegExp(letterSelected, "i");
    if (letterSelected !== "all" && items.length > 0) {
      for (i = 0; i < items.length; i++) {
        const item = items[i];
        const description = $filter("translate")(item.description);
        if (letterMatch.test(description.substring(0, 1))) {
          filtered.push(item);
        }
      }
    } else {
      filtered = items;
    }
    return filtered;
  };
}

module CitySelectorComponentFilter {
  export const $inject = ["$filter"];
}

@Filters(
  "ib-ui-city-selector-component-module",
  ["$filter"],
  [],
  CitySelectorComponentFilter,
  "CitySelectorComponentFilter",
)()
class citySelectorFilterClass {
  constructor() {}
}
