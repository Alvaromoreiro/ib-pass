import { CommonsConstantsType } from "../../constants/ib-commons-constants";

@Service("ib-content-parser-module", ["$sce", "CommonsConstants"])
export class ContentPreprocessorService {
  constructor(
    private $sce: ng.ISCEService,
    private CommonsConstants: CommonsConstantsType,
  ) {}

  processContent = (preContent: string, info: string): string => {
    const processLinks = (preContent: string, info: string) => {
      let content = preContent.replace(
        this.CommonsConstants.commonsPatterns.PRE_PROCESSOR_HREF,
        "",
      );
      content = content.replace(
        this.CommonsConstants.commonsPatterns.PRE_PROCESSOR_TARGET,
        "",
      );
      let text = "";
      if (info) {
        text = `data-content-info="${info}"`;
      }
      return content.replace(
        this.CommonsConstants.commonsPatterns.PRE_PROCESSOR_A,
        `<a ib-link-content-parser ${text}`,
      );
    };

    const processedContent = processLinks(preContent, info);
    return this.$sce.trustAsHtml(processedContent);
  };
}
