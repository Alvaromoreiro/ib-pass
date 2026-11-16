import * as angular from 'angular';
import {DatalayerUtilsService} from '../../ib-datalayer/services/ib-datalayer-utils-service';
import {RedirectionService} from '../../utils/ib-commons-redirection.service';
import { CommonsConstantsType } from '../../constants/ib-commons-constants';


const selector = "ibGenericErrorModalComponent";

const options: AngularJSComponent = {
  bindings: {
    resolve: "<",
    modalInstance: "<",
  },
  controllerAs: "modalCtrl",
  templateUrl: [
    "$rootScope",
    ($rootScope: CommonsRootScope) => {
      return `${$rootScope.routes.templates}ib-generic-error-modal.html`;
    },
  ],
  controller: class IbGenericErrorModalComponent {
    public modalInstance;
    public resolve: {
      object: CommonsModalsModels.GenericErrorComponentModalModel;
    };
    public model: CommonsModalsModels.GenericErrorComponentModalModel;

        constructor (private $window: ng.IWindowService, private DatalayerUtilsService: DatalayerUtilsService, private RedirectionService: RedirectionService, private CommonsConstants: CommonsConstantsType, private localStorageService: ng.local.storage.ILocalStorageService) { }

    $onInit() {
      this.model = this.resolve.object ?? {};
      this.DatalayerUtilsService.sendDatalayerErrorEvent(this.model);
      this.modalInstance.result.then(
        () => {
          this.DatalayerUtilsService.removeDatalayerErrorAttrs();
        },
        () => {
          this.DatalayerUtilsService.removeDatalayerErrorAttrs();
        },
      );
    }

        /**
         * Closes the error modal dismissing its instance
         */
        close = (): void => {
            this.handleModalAction(this.modalInstance.dismiss);
        };

        /**
         * Closes the error modal calling close method of its instance
         */
        accept = (): void => {
            this.handleModalAction(this.modalInstance.close);
        };

        /**
         * Maneja la acción modal basada en sies de cerrar o aceptar.
         * @param finalAction - The final action to execute after checking conditions.
         */
        private handleModalAction = (finalAction: () => void): void => {
            if (this.shouldRedirectToMmbSearcher()) {
                this.redirectToMmbSearcher();
                finalAction();
                return;
            }

            if (!this.checkTimeOutSession() && !this.resolve.object?.redirect) {
                finalAction();
            } else {
                this.RedirectionService.externalRedirect(this.resolve.object.redirect ? this.resolve.object.redirect : this.$window.location.origin);
            }
        };

        private checkTimeOutSession = (): boolean => {
            return (this.resolve.object?.internalErrorCode === 'SSE_ORM_9999' || this.resolve.object?.internalErrorCode === 'SSE_AVM_9008');
        };

        /**
         * Checks if the conditions for MMB bookingInfoLight redirection are met.
         * @returns {boolean}
         */
        private shouldRedirectToMmbSearcher = (): boolean => {
            const flowApp = this.localStorageService.get('flowApp');
            const bookingInfoLight = this.localStorageService.get('bookingInfoLight');
            return (flowApp === this.CommonsConstants.APP_TYPES.MANAGEMYBOOKING && !!bookingInfoLight);
        };

        /**
         * Performs the redirection to the MMB searcher.
         */
        private redirectToMmbSearcher = (): void => {
            const url = this.$window.location.origin + this.$window.location.pathname + '#!/' + 'chktrp';
            this.RedirectionService.externalRedirect(url);
        };

    }
};
const inject = ['$window', 'DatalayerUtilsService', 'RedirectionService', 'CommonsConstants', 'localStorageService'];
try {
  const mod = angular.module("ib-commons-modal-service-module");
  options.controller.$inject = inject;
  mod.component(selector, options);
} catch (error) {
  const mod = angular.module("ib-commons-modal-service-module", []);
  options.controller.$inject = inject;
  mod.component(selector, options);
}
