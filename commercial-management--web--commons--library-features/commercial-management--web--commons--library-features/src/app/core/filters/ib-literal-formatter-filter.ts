function literalFormatter() {
  return (input: any, tagsInfo: any): string => {
    let result = null,
      prop = null,
      tagInfo = null;
    const defaultTagsInfo = {
      bold: {
        tag: "span",
        class: "ib-text ib-text--bold",
      },
      under: {
        tag: "span",
        class: "ib-text ib-text--underline",
      },
      link: {
        tag: "a",
        href: "",
        target: "_blank",
        title: "",
        class: "ib-link ib-link--underline",
      },
    };
    if (!input) {
      return "";
    }
    if (!tagsInfo) {
      tagsInfo = {};
    }
    tagsInfo = angular.merge({}, defaultTagsInfo, tagsInfo);
    for (prop in tagsInfo) {
      tagInfo = tagsInfo[prop];
      if (tagInfo.class && !angular.isArray(tagInfo.class)) {
        tagInfo.class = tagInfo.class.split(" ");
      }
    }

    const formatLiteral2 = (input: any, tagsInfo: any) => {
      let matchStr = null,
        before = null,
        after = null,
        key = null,
        otherKeys = null,
        tagOpen = null;
      let tagClose = null,
        properties = null,
        property = null,
        value = null,
        i = null,
        j = null,
        classSet = null;
      let tagInfo = null,
        match = null;
      const matches = getMatches(input);
      for (i = matches.length - 1; i >= 0; i--) {
        match = matches[i];
        matchStr = match[0];
        before = input.substring(0, match.index);
        after = input.substring(match.index + matchStr.length);
        if (after.indexOf("$$") !== -1) {
          key = match[1];
          otherKeys = match[2] || null;
          if (otherKeys) {
            otherKeys = otherKeys.substring(1).split("+");
          }
          tagOpen = "";
          tagClose = "";
          if (tagsInfo && tagsInfo[key] && tagsInfo[key].tag) {
            tagInfo = tagsInfo[key];
            tagClose = "</" + tagInfo.tag + ">";
            classSet = [];
            addClassToSet(classSet, tagInfo);
            if (otherKeys) {
              for (j in otherKeys) {
                addClassToSet(classSet, tagsInfo[otherKeys[j]]);
              }
            }
            tagOpen = "<" + tagInfo.tag;
            properties = Object.keys(tagInfo);
            for (j in properties) {
              property = properties[j];
              if (
                property.toLowerCase() !== "tag" &&
                property.toLowerCase() !== "class"
              ) {
                value = tagsInfo[key][property];
                tagOpen = tagOpen + " " + property;
                if (value !== "") {
                  tagOpen = tagOpen + '="' + value + '"';
                }
              }
            }
            if (classSet.length !== 0) {
              tagOpen = tagOpen + ' class="' + classSet.join(" ") + '"';
            }
            tagOpen = tagOpen + ">";
          }
          after = after.replace("$$", tagClose);
          input = before + tagOpen + after;
        }
      }
      return input;
    };
    const getMatches = (input: string): any[] => {
      let match = null;
      const expRegOpen: RegExp = /\$\$([a-zA-Z\d]+)((?:\+[a-zA-Z\d]+)*)\$/g;
      const matches: any[] = [];
      while ((match = expRegOpen.exec(input)) !== null) {
        matches.push(match);
      }
      return matches;
    };
    const addClassToSet = (classSet: any, tagInfo: any) => {
      let i = null,
        classStr = null;
      const trimExpReg: RegExp = /^\s+|\s+$/g;
      if (tagInfo.class && angular.isArray(tagInfo.class)) {
        for (i in tagInfo.class) {
          classStr = tagInfo.class[i] || "".replace(trimExpReg, "");
          if (classStr && classSet.indexOf(classStr) === -1) {
            classSet.push(classStr);
          }
        }
      }
    };

    result = formatLiteral2(input, tagsInfo);

    return result;
  };
}
module literalFormatter {
  export const $inject = [];
}
@Filters(
  "ib-commons-filters-module",
  [],
  [],
  literalFormatter,
  "literalFormatter",
)()
class LiteralFormatter {
  constructor() {}
}
