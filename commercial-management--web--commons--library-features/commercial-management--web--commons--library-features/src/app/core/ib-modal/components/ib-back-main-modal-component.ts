import * as angular from "angular";
import { CommonsConstantsType } from "../../constants/ib-commons-constants";
import { DatalayerConstantsType } from "../../ib-datalayer/ib-datalayer-constants";
import { DatalayerUtilsService } from "../../ib-datalayer/services/ib-datalayer-utils-service";

const selector = "ibBackMainModalComponent";
const options: AngularJSComponent = {
  bindings: {
    resolve: "<",
    modalInstance: "<",
  },
  controllerAs: "modalCtrl",
  templateUrl: [
    "$rootScope",
    ($rootScope: CommonsRootScope) => {
      return `${$rootScope.routes.templates}ib-modal-back-header.html`;
    },
  ],
  controller: class ibBackMainModalComponent {
    public modalInstance;
    public resolve;
    public showCloseButton: boolean;
    public showCancelButton: boolean;
    public showHeader: boolean;
    public dismissOnCancel: boolean;
    public closeOnAccept: boolean;
    public flowApp: string;
    public model: any;

    constructor(
      private localStorageService: angular.local.storage.ILocalStorageService,
      private CommonsConstants: CommonsConstantsType,
      private DatalayerConstants: DatalayerConstantsType,
      private DatalayerUtilsService: DatalayerUtilsService,
    ) {}

    $onInit() {
      this.model = this.resolve.object ? this.resolve.object : {};
      this.flowApp = this.localStorageService.get("flowApp");
      const idModal: object = this.model.idModal
        ? this.model.idModal
        : this.model;
      this.DatalayerUtilsService.sendDatalayerModalEvent(idModal);

      this.buildBackMainHeaderModal();
    }

    close = (): void => {
      this.modalInstance.dismiss();
    };

    accept = () => {
      this.modalInstance.close();
    };

    cancel = () => {
      this.modalInstance.dismiss();
    };

    buildBackMainHeaderModal = () => {
      let needBuildModel: boolean = false,
        modelTextFlow;
      const buildModelToFlow = (modelFlow) => {
        this.model.backMain.header.title = modelFlow.title;
        this.model.backMain.body.text = modelFlow.body;
        this.model.backMain.btn.title = modelFlow.button;
        this.model.backMain.link.title = modelFlow.link;
        this.model.backMain.btn.text = modelFlow.button;
        this.model.backMain.link.text = modelFlow.link;
      };
      this.model.backMain = this.CommonsConstants.MODEL_BACK_MAIN;

      if (
        this.model?.idModal &&
        this.flowApp &&
        this.model?.idModal ===
          this.DatalayerConstants.DATALAYER_MODAL_ID.BACK_MAIN_HEADER_MODAL
      ) {
        switch (this.flowApp) {
          case this.CommonsConstants.APP_TYPES.BOOKING:
          case this.CommonsConstants.APP_TYPES.ONHOLD:
          case this.CommonsConstants.APP_TYPES.SHUTTLE_OPEN:
          case this.CommonsConstants.APP_TYPES.SHUTTLE_OPEN_ONB:
          case this.CommonsConstants.APP_TYPES.SHUTTLE_REDEMPTION:
          case this.CommonsConstants.APP_TYPES.SHUTTLE_REDEMPTION_ONB:
            // flow BKI
            modelTextFlow =
              this.CommonsConstants.MODEL_BACK_MAIN_FLOWS[
                this.CommonsConstants.APP_TYPES.BOOKING
              ];
            needBuildModel = true;
            break;

          case this.CommonsConstants.APP_TYPES.CHECKIN:
            // flow CKI
            modelTextFlow =
              this.CommonsConstants.MODEL_BACK_MAIN_FLOWS[
                this.CommonsConstants.APP_TYPES.CHECKIN
              ];
            needBuildModel = true;
            break;

          case this.CommonsConstants.APP_TYPES.MANAGEMYBOOKING:
          case this.CommonsConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD:
          case this.CommonsConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES:
          case this.CommonsConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE:
          case this.CommonsConstants.APP_TYPES.MANAGEMYBOOKING_BIDS:
            // flow MMB
            modelTextFlow =
              this.CommonsConstants.MODEL_BACK_MAIN_FLOWS[
                this.CommonsConstants.APP_TYPES.MANAGEMYBOOKING
              ];
            needBuildModel = true;
            break;

          default:
            needBuildModel = false;
            break;
        }

        if (needBuildModel) {
          buildModelToFlow(modelTextFlow);
        }
      }
    };
  },
};

const inject = [
  "localStorageService",
  "CommonsConstants",
  "DatalayerConstants",
  "DatalayerUtilsService",
];
try {
  const mod = angular.module("ib-commons-modal-service-module");
  options.controller.$inject = inject;
  mod.component(selector, options);
} catch (error) {
  const mod = angular.module("ib-commons-modal-service-module", []);
  options.controller.$inject = inject;
  mod.component(selector, options);
}
