import { DatalayerUtilsService } from "../../ib-datalayer/services/ib-datalayer-utils-service";

@Controller(
  "ib-commons-modal-service-module",
  [
    "$uibModalInstance",
    "object",
    "DatalayerUtilsService",
    "$window",
    "UpdateMemberService",
    "CommonsUtilService",
  ],
  [],
)
export class TermsConditionsModalController implements ng.IController {
  public model: any;
  public submitted: boolean;
  public serviceError: boolean = false;
  constructor(
    private $uibModalInstance: ng.ui.bootstrap.IModalInstanceService,
    private object: object,
    private DatalayerUtilsService: DatalayerUtilsService,
    private $window: ng.IWindowService,
    private UpdateMemberService: any,
    private CommonsUtilService: any,
  ) {
    this.model = this.object;
  }
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
    this.submitted = false;
  };

  close = (): void => {
    this.$uibModalInstance.dismiss();
  };

  accept = (type: object) => {
    this.$uibModalInstance.close(type);
  };

  termsConditionsSubmit = (conditions_check) => {
    const date = new Date();
    this.submitted = true;

    const buildTermsConditions = () => {
      const dateToSend = date.toISOString().split("T")[0];
      return {
        termsAndConditions: {
          version: "1.1",
          acceptedDate: dateToSend,
        },
      };
    };

    if (conditions_check.$valid) {
      const termsConditions = buildTermsConditions();
      const updateMemberSuccess = (res) => {
        this.$window.location.reload();
      };
      const updateMemberFailure = (err) => {
        this.serviceError = true;
      };
      this.UpdateMemberService.updateMember(termsConditions).then(
        updateMemberSuccess,
        updateMemberFailure,
      );
    }
  };
  reloadNoAccess = (): void => {
    this.CommonsUtilService.removeLoggedInfo();
    this.$window.location.reload();
  };
}
