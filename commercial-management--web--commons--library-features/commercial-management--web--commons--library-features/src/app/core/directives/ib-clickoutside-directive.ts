import { IScope } from "angular";

@Directives("ib-commons-directives-module", ["$document"], [])
class ibClickOutSide implements ng.IDirective {
  restrict: string = "A";

  constructor(private $document: ng.IDocumentService) {}

  link = (scope: any, element: any, attrs: any) => {
    this.$document.on("click", (event: any): void => {
      this.triggerEvent(event, scope, attrs.menuOpen, attrs.ibClickOutSide);
    });
    this.$document.on("keyup", (event: any): void => {
      this.triggerEvent(event, scope, attrs.menuOpen, attrs.ibClickOutSide);
    });
  };
  private triggerEvent = (
    event: any,
    scope: IScope,
    menuOpen: string,
    launcher: string,
  ): void => {
    const targetElement = event.target;
    const targetParent = targetElement.closest(
      "[ib-click-out-side=" + launcher + "]",
    );
    const handleObj = event.handleObj.type;
    let menuOpenStatus: boolean = false;
    if (menuOpen === "true") {
      menuOpenStatus = true;
    }
    if (
      (handleObj === "keyup" && event.keyCode === 9) ||
      handleObj === "click"
    ) {
      if (targetParent === null && menuOpenStatus) {
        scope.$emit(launcher);
      }
    }
    if (handleObj === "keyup" && event.keyCode === 27 && menuOpenStatus) {
      scope.$emit(launcher);
    }
  };
}
