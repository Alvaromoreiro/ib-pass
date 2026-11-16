@Component(
  "ib-ui-discount-offer-module",
  "ibUiDiscountOffer",
  {
    controllerAs: "uiDiscountOfferCtrl",
    bindings: {
      isResident: "=",
      availableDiscounts: "<",
      showSelectResident: "<",
      availableResidentDisc: "<",
      residentDiscounts: "<",
      familyDiscounts: "<",
      applyDiscount: "=",
    },
    templateUrl: [
      "$rootScope",
      ($rootScope: CommonsRootScope) => {
        return `${$rootScope.routes.templates}ib-ui-discount-offer-view.html`;
      },
    ],
  },
  [],
  [],
)
class IbUiDiscountOfferComponent implements ng.IController {
  public isResident: boolean;
  public applyDiscount;

  constructor() {}

  active = (): any => {};

  discountsChange = (
    residentDiscountSelected: any,
    familyDiscountSelected: any,
  ): void => {
    this.applyDiscount(
      this.isResident,
      residentDiscountSelected,
      familyDiscountSelected,
    );
  };

  $onInit = this.active();
}
