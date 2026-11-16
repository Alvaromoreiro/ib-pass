import { CommonsModalService } from "../services/ib-modal-service";

@Controller("ib-commons-modal-service-module", [
  "$rootScope",
  "$uibModalInstance",
  "object",
  "DatalayerUtilsService",
  "CommonsModalService",
])
export class OnholdModalController implements ng.IController {
  public model: any;

  constructor(
    private $rootScope: CommonsRootScope,
    private $uibModalInstance: ng.ui.bootstrap.IModalInstanceService,
    private object: object,
    private DatalayerUtilsService: any,
    private CommonsModalService: CommonsModalService,
  ) {
    this.model = this.object;
  }

  ////////////////
  $onInit() {
    this.activate();
  }

  activate = (): void => {
    const idModal: object =
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
  accept = (type: object) => {
    this.$uibModalInstance.close(type);
    this.CommonsModalService.showWaitingModal(
      "ib-modal-loading-plane",
      "ib-modals ib-modals--transparent ib-modals--loading-page",
      true,
      null,
    );
  };

  acceptBuyOnhold = (): void => {
    this.close();
    this.$rootScope.$broadcast("acceptBuyOnhold", true);
  };
}
