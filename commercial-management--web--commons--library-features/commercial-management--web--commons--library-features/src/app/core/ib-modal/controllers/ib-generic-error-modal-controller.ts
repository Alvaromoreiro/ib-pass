@Controller("ib-commons-modal-service-module", [
  "$uibModalInstance",
  "object",
  "DatalayerUtilsService",
  "$window",
  "RedirectionService",
])
class GenericErrorModalController implements ng.IController {
  public model: any;
  constructor(
    private $uibModalInstance: ng.ui.bootstrap.IModalInstanceService,
    private object: object,
    private DatalayerUtilsService: any,
    private $window: ng.IWindowService,
    private RedirectionService: any,
  ) {
    this.model = this.object ?? {};
  }
  ////////////////

  $onInit() {
    this.activate();
  }

  activate = (): void => {
    this.DatalayerUtilsService.sendDatalayerErrorEvent(this.model);
    this.$uibModalInstance.result.then(
      () => {
        this.DatalayerUtilsService.removeDatalayerErrorAttrs();
      },
      () => {
        this.DatalayerUtilsService.removeDatalayerErrorAttrs();
      },
    );
  };

  /**
   * Closes the error modal dismissing its instance
   */
  close = (): void => {
    if (!this.checkTimeOutSesssion() && !this.model.redirect) {
      this.$uibModalInstance.dismiss();
    } else {
      this.RedirectionService.externalRedirect(
        this.model.redirect
          ? this.model.redirect
          : this.$window.location.origin,
      );
    }
  };

  /**
   * Closes the error modal calling close method of its instance
   */
  accept = (type: any): void => {
    if (!this.checkTimeOutSesssion() && !this.model.redirect) {
      this.$uibModalInstance.close(type);
    } else {
      this.RedirectionService.externalRedirect(
        this.model.redirect
          ? this.model.redirect
          : this.$window.location.origin,
      );
    }
  };

  checkTimeOutSesssion = (): boolean => {
    return (
      this.model.internalErrorCode === "SSE_ORM_9999" ||
      this.model.internalErrorCode === "SSE_AVM_9008"
    );
  };
}
