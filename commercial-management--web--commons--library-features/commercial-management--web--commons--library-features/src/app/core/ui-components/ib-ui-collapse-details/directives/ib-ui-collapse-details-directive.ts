@Directives("ib-ui-collapse-details", ["$document"], [])
class ibCollapseDetails {
  constructor(private $document: ng.IDocumentService) {}

  link = ($scope: any, $element: any, $attrs: any): void => {
    if ($scope.$eval($attrs.outSideClick)) {
      this.$document.bind("click", (event: any) => {
        if (
          !(angular.element($element).find(event.target).length > 0) ||
          angular.element(this.$document).find(event.target).length === 0
        ) {
          $scope.collapseCtrl.isCollapsed = false;
          $scope.$apply();
        }
      });
    }
  };
}
