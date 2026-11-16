import { CommonsConstantsType } from "../../constants/ib-commons-constants";

@Service("ib-content-parser-module", ["CommonsConstants"])
export class ContentParserUtilsService {
  constructor(private CommonsConstants: CommonsConstantsType) {}

  isExternalLink = (attributes): boolean => {
    return (
      attributes.href &&
      attributes.href.search(
        this.CommonsConstants.commonsPatterns.PRE_PROCESSOR_SERVICES_HREF,
      ) === -1
    );
  };

  isInternalLink = (attributes): boolean => {
    return (
      attributes.href &&
      attributes.href !== "#" &&
      attributes.href.search(
        this.CommonsConstants.commonsPatterns.PRE_PROCESSOR_SERVICES_HREF,
      ) !== -1
    );
  };

  isModalLink = (attributes): boolean => {
    return !attributes.href;
  };

  searchModalContent = (info, contentId: string): object => {
    let returnedInfo = {},
      infoIndex = 0,
      foundedInfo = false;
    if (info && contentId) {
      while (!foundedInfo && infoIndex < info.length) {
        if (contentId === info[infoIndex].code) {
          returnedInfo = info[infoIndex];
          foundedInfo = true;
        }
        infoIndex++;
      }
    } else if (info) {
      returnedInfo = info[0];
    }
    return returnedInfo;
  };
}
