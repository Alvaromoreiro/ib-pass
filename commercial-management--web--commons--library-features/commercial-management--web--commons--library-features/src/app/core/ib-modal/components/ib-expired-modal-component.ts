import * as angular from "angular";
import { RedirectionService } from "../../utils/ib-commons-redirection.service";
import { DatalayerConstantsType } from "src/app/core/ib-datalayer/ib-datalayer-constants";

const selector = "expiredModalComponent";

const options: AngularJSComponent = {
  bindings: {
    resolve: "<",
    modalInstance: "<",
  },
  controllerAs: "modalCtrl",
  templateUrl: [
    "$rootScope",
    ($rootScope: CommonsRootScope) => {
      return `${$rootScope.routes.templates}ib-modal-session.html`;
    },
  ],
  controller: class expiredModalComponent {
    public modalInstance;
    public resolve;
    public expiredFlash: boolean;
    public model;

    constructor(
      private $window: ng.IWindowService,
      private RedirectionService: RedirectionService,
      private DatalayerConstants: DatalayerConstantsType,
    ) {}

    $onInit() {
      this.expiredFlash = true;
      this.model = this.resolve.object ?? {};
      if (this.model.isFlash) {
        this.model.title = "EXPIRED_MODAL_TITLE";
        this.model.body = "EXPIRED_MODAL_BODY";
        this.model.rightButton = "EXPIRED_MODAL_RIGHT_BUTTON";
        this.model.leftButton = "EXPIRED_MODAL_LEFT_BUTTON";
      }
    }

    close = (): void => {
      const url =
        this.$window.location.origin +
        this.$window.location.pathname +
        "#!/" +
        this.DatalayerConstants.QUADRIGAMS.LANDING_FLASH;
      this.modalInstance.dismiss();
      this.model.isFlash ? this.RedirectionService.externalRedirect(url) : "";
    };

    accept = (): void => {
      this.modalInstance.close();
    };
  },
};
const inject = ["$window", "RedirectionService", "DatalayerConstants"];
try {
  const mod = angular.module("ib-commons-modal-service-module");
  options.controller.$inject = inject;
  mod.component(selector, options);
} catch (error) {
  const mod = angular.module("ib-commons-modal-service-module", []);
  options.controller.$inject = inject;
  mod.component(selector, options);
}
