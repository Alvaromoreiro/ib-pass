import * as angular from "angular";
import { CommonsModalService } from "../../ib-modal/services/ib-modal-service";
import { ContentParserUtilsService } from "../services/ib-content-parser-utils";

@Directives("ib-commons-directives-module", [
  "$document",
  "ContentParserUtilsService",
  "$anchorScroll",
  "localStorageService",
  "CommonsModalService",
])
export class ibLinkContentParser implements ng.IDirective {
  constructor(
    private $document: any,
    private ContentParserUtilsService: ContentParserUtilsService,
    private $anchorScroll: any,
    private localStorageService: any,
    private CommonsModalService: CommonsModalService,
  ) {}

    restrict = 'AE';
    link = ($scope, $element, $attrs) => {
        if (this.ContentParserUtilsService.isExternalLink($attrs)) {
            angular.element($element).attr('target', '_blank');
        } else if (this.ContentParserUtilsService.isModalLink($attrs)) {
            angular.element($element).attr('href', 'javascript:void(0)');
        }
        angular.element($element).bind('click',  (event) => {
            if (!this.ContentParserUtilsService.isExternalLink($attrs) && this.ContentParserUtilsService.isInternalLink($attrs)) {
                event.preventDefault();
                this.$anchorScroll($attrs.href.split('#')[1]);
            } else if (this.ContentParserUtilsService.isModalLink($attrs)) {
                const modalsTemp = this.localStorageService.get($attrs.contentInfo).modals;
                const contentidTemp = $attrs.contentid;
                const template = $attrs?.template ? $attrs.template : 'ib-terms-condition-gift-cards.html';
                this.CommonsModalService.showGenericModal(
                    false,
                    template,
                    {
                        info: this.ContentParserUtilsService.searchModalContent(modalsTemp, contentidTemp)
                    },
                    null
                );
            }
        });
    };
}
