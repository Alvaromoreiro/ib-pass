import * as angular from "angular";

/**
 * A generic modal component totally customizable for iberia with a model
 * Properties of the model : Default value  -> Use
 * {
 *     showCloseButton: true -> shows the X top left to close the modal
 *     showHeader: true -> shows the header or not
 *     showCancelButton: false -> Shows the cancel button text
 *     dismissOnCancel: true -> Dismiss modal on cancelButtonClick *
 *     title: '' -> Text for title
 *     subtitle: '' -> Text for subtitle
 *     body: '' -> Body text
 *     extraBody: '' -> Extra body text,
 *     accept: 'Accept' -> Accept button text
 *     cancel: 'Cancel' -> Cancel button text
 * }
 */
const selector = "ibGenericModalComponent";
const options: AngularJSComponent = {
  bindings: {
    resolve: "<",
    modalInstance: "<",
  },
  controllerAs: "modalCtrl",
  templateUrl: [
    "$rootScope",
    ($rootScope: CommonsRootScope) => {
      return `${$rootScope.routes.templates}ib-modal-generic.html`;
    },
  ],
  controller: class ibGenericModalComponent {
    public modalInstance;
    public resolve;
    public showCloseButton: boolean;
    public showCancelButton: boolean;
    public showHeader: boolean;
    public dismissOnCancel: boolean;
    public closeOnAccept: boolean;
    public titleTranslateParams: Record<string, string>;
    public modalTitle: string;

    constructor() {}

    $onInit() {
      this.showCloseButton = this.resolve.object.showCloseButton ?? true;
      this.showHeader = this.resolve.object.showHeader ?? true;
      this.showCancelButton =
        this.resolve.object.showCancelButton || this.resolve.object.cancel;
      this.dismissOnCancel = this.resolve.object.dismissOnCancel ?? true;
      this.titleTranslateParams =
        this.resolve.object.titleTranslateParams ?? {};
      this.modalTitle = this.resolve.object.title ?? "MODAL_ERROR_TITLE";
    }

    close = (): void => {
      this.modalInstance.dismiss();
    };

    accept = () => {
      this.modalInstance.close();
    };

    cancel = () => {
      if (this.dismissOnCancel) {
        this.modalInstance.dismiss();
      }
    };
  },
};
const inject = [];
try {
  const mod = angular.module("ib-commons-modal-service-module");
  options.controller.$inject = inject;
  mod.component(selector, options);
} catch (error) {
  const mod = angular.module("ib-commons-modal-service-module", []);
  options.controller.$inject = inject;
  mod.component(selector, options);
}
