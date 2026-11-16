function EliminateAccentFilter() {
  return (text: string = ""): string => {
    text = text.replace(/[áàäâÁÀÄÂ]/g, "a");
    text = text.replace(/[éèëêÉÈËÊ]/g, "e");
    text = text.replace(/[íìïîÍÌÏÎ]/g, "i");
    text = text.replace(/[óòöôÓÒÖÔ]/g, "o");
    text = text.replace(/[úùüûÚÙÜÛ]/g, "u");
    text = text.replace(/[ñÑ]/g, "n");
    text = text.replace(/(\s)/g, "-");
    return text.toLowerCase();
  };
}
module EliminateAccentFilter {
  export const $inject = [];
}
@Filters(
  "ib-commons-filters-module",
  [],
  [],
  EliminateAccentFilter,
  "EliminateAccentFilter",
)()
class EliminateAccentFilterClass {
  constructor() {}
}
