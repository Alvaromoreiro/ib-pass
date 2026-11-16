@Component(
  "ib-ui-prefix-city-module",
  "ibUiPrefixCity",
  {
    bindings: {
      containerForm: "<",
      prefixId: "=",
      prefixModel: "=?",
      prefixList: "=?",
      isRequired: "=?",
      prefixPlaceholder: "=?",
      prefixLabel: "=?",
    },
    controllerAs: "ibUiPrefixCityCtrl",
    templateUrl: [
      "$rootScope",
      ($rootScope) => {
        return `${$rootScope.routes.templates}ib-ui-prefix-city-view.html`;
      },
    ],
  },
  [],
  [],
)
class ibUiPrefixCity implements ng.IController {
  constructor() {}

  ////////////////
  $onInit = () => {};
}
