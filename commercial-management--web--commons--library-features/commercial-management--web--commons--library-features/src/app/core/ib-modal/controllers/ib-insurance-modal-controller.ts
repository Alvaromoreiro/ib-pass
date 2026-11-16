@Controller("ib-commons-modal-service-module", [
  "$uibModalInstance",
  "object",
  "$rootScope",
  "localStorageService",
  "$scope",
])
class InsuranceModalController implements ng.IController {
  public model: any;
  public insuranceForm: any;

  constructor(
    private $uibModalInstance: ng.ui.bootstrap.IModalInstanceService,
    private object: object,
    private $rootScope: CommonsRootScope,
    private localStorageService: angular.local.storage.ILocalStorageService,
    private $scope: angular.IScope,
  ) {
    this.model = this.object;
  }

  ////////////////
  $onInit() {
    this.$scope.$on("updateInfoModal", this.updateInfoModal);
    this.activate();
  }

  /**
   * Initialize modal controller
   */
  activate = (): void => {
    const selectedInsurance =
      this.localStorageService.get("selectedInsurance") || null;
    if (selectedInsurance) {
      this.model.insurance = selectedInsurance;
    } else {
      this.model.insurance = this.selectInsuranceInexpensive(this.model);
    }
  };

  /**
   * Listening event emit ancillaries-controller if changeCountry and return the value before
   * conditions of insurance with diferrent country
   * @param {Object} selectedInsurance infoInsurance selected in combo for the user
   */
  updateInfoModal = (): void => {
    if (this.model.info.length > 1) {
      this.model.insurance = this.selectInsuranceInexpensive(this.model);
    } else {
      this.model.insurance = this.model.info[0];
    }
  };

  /**
   * Select more Inexpensive insurance for view ir user no selected Insurance
   * @param {Object} infoInsurance  selected in combo for the user
   */
  selectInsuranceInexpensive = (infoInsurance: any): Object => {
    let insurance: any = {};
    insurance = infoInsurance.info[0];
    if (infoInsurance.info.length > 1) {
      angular.forEach(infoInsurance.info, (offer) => {
        if (offer.originalTotalPrice <= insurance.originalTotalPrice) {
          insurance = offer;
        }
      });
    }
    return insurance;
  };

  /**
   * Emits event for call service of ancillaries for get
   * conditions of insurance with diferrent country
   * @param {Object} country Country selected in combo for get new price  of insurance
   */
  changeInsuranceCountry = (country: object): void => {
    this.model.isModalLoading = true;
    this.$rootScope.$broadcast("changeInsuranceCountry", country);
  };

  /**
   * Check if form is valid, emit event to parent and close modal window
   */
  completeForm = (): void => {
    this.insuranceForm.$submitted = true;
    if (this.insuranceForm.$valid) {
      if (this.model.insuranceCountry.requiredFields.length > 0) {
        angular.forEach(this.model.passengers, (pas) => {
          pas.isComplete = true;
        });
        this.localStorageService.set(
          "passengersWithFieldIsurance",
          this.model.passengers,
        );
      }
      this.$rootScope.$broadcast("changeInsuranceInfo");
      this.$uibModalInstance.close("cancel");
    }
  };

  /**
   * Close modal and send event for discard changes on insurance
   */
  close = (): void => {
    this.$rootScope.$broadcast("cancelChangesInsurance");
    this.$uibModalInstance.dismiss("cancel");
  };
}
