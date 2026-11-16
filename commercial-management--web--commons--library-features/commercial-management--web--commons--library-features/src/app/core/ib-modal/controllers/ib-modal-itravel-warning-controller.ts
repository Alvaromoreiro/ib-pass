@Controller("ib-commons-modal-service-module", [
  "$uibModalInstance",
  "object",
  "DatalayerUtilsService",
  "RedirectionService",
  "$filter",
  "$scope",
])
class ITravelWarningModalController implements ng.IController {
  public model: any;

  constructor(
    private $uibModalInstance: ng.ui.bootstrap.IModalInstanceService,
    private object: object,
    private DatalayerUtilsService: any,
    private $scope: ng.IScope,
  ) {
    this.model = this.object;
  }

  ////////////////
  $onInit() {
    this.activate();
  }

  activate = (): void => {
    const idModal =
      this.model && this.model.idModal ? this.model.idModal : this.model;
    this.DatalayerUtilsService.sendDatalayerModalEvent(idModal);
    this.$uibModalInstance.result.then(
      this.DatalayerUtilsService.removeDatalayerModalAttrs,
      this.DatalayerUtilsService.removeDatalayerModalAttrs,
    );
  };
  /**
   * Closes the modal dismissing its instance
   */
  close = (): void => {
    this.$uibModalInstance.dismiss();
  };

  /**
   * Closes the modal calling close method of its instance
   */
  accept = (): void => {
    this.$uibModalInstance.close();
  };

  /**
   * Emits the event that notify the controller about the "I Travel" checkbox status. In this case we set it to true
   */
  checkItravelAgain = (): void => {
    this.$scope.$emit("checkITravelAgain");
    this.close();
  };
}
