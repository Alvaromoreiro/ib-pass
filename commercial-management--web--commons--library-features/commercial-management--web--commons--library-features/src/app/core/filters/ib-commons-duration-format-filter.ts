function CommonsDurationFormatFilter() {
  return (duration: number): string => {
    let durationFormatted = "";

    if (duration > 0) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      durationFormatted = `${hours > 0 ? hours + "h " : ""}${
        minutes > 0 ? minutes + "min." : ""
      }`;
    }
    return durationFormatted;
  };
}
module CommonsDurationFormatFilter {
  export const $inject = [];
}
@Filters(
  "ib-commons-filters-module",
  [],
  [],
  CommonsDurationFormatFilter,
  "CommonsDurationFormatFilter",
)()
class IbCommonsDurationFormatFilter {
  constructor() {}
}
