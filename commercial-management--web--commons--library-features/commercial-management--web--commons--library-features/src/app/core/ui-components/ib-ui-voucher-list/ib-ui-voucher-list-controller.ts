@Component(
  "ib-ui-voucher-list-module",
  "ibUiVoucherList",
  {
    bindings: {
      inputs: "<",
    },
    controllerAs: "ibUiVoucherListCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-voucher-list-view.html`;
      },
    ],
  },
  [],
  [],
)
class IbUiVoucherListController implements ng.IController {
  public inputs: any;
  constructor() {}
}
