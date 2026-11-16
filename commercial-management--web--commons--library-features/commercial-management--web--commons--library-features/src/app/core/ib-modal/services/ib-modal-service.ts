@Service("ib-commons-modal-service-module", [
  "$rootScope",
  "$uibModal",
  "$uibModalStack",
])
export class CommonsModalService {
  waitingModalInstance: any;
  errorMessage: any;
  errorCode: any;
  constructor(
    private $rootScope: CommonsRootScope,
    private $uibModal: ng.ui.bootstrap.IModalService,
    private $uibModalStack: ng.ui.bootstrap.IModalStackService,
  ) {
    this.waitingModalInstance = null;
  }
  ////////////////
  /**
   * Opens a generic error modal returning its instance
   * @param {Object} errorObject - the error object to show in the template. It is passed to the controller.
   * @param {boolean} isModalBlocked - if the error modal must be blocked on outside user click.
   * @param {string} extraModalClass - The additional classes for the modal window
   * @returns {Object} -the error modal instance opened
   */
  showGenericError = (
    errorObject?: CommonsModalsModels.GenericErrorComponentModalModel,
    isModalBlocked: boolean = false,
    extraModalClass?: string,
  ): ng.ui.bootstrap.IModalInstanceService => {
    return this.showComponentModal(
      "ibGenericErrorModalComponent",
      isModalBlocked,
      errorObject,
      extraModalClass ?? "ib-modals--md",
    );
  };

  ////////////////
  /**
   * Opens a generic  modal returning its instance
   * @param {boolean} isModalBlocked - if the  modal must be blocked on outside user click.
   * @param {string} template - the name of a custom template to be shown in the modal
   * @returns {Object} -the  modal instance opened
   */
  showGenericModal = (
    isModalBlocked: boolean,
    template: string,
    modelObject?: object,
    extraModalClass?: string,
  ): ng.ui.bootstrap.IModalInstanceService => {
    if (template)
      template = template.includes(".html") ? template : template + ".html";
    const modalObject: CommonsModalsModels.ModalObject = {
      animation: false,
      templateUrl: this.$rootScope.routes.templates + template,
      controller: "GenericModalController",
      controllerAs: "modalCtrl",
      windowClass:
        "ib-modals" +
        (extraModalClass ? " " + extraModalClass : " ib-modals--md"),
      resolve: {
        object: function () {
          return modelObject;
        },
      },
    };
    if (isModalBlocked) {
      modalObject.backdrop = "static";
      modalObject.keyboard = false;
    }
    return this.$uibModal.open(modalObject);
  };

  showGenericDynamicModal = (
    isModalBlocked: boolean,
    template: string,
    modelObject: object,
    controller: string,
    extraModalClass: string = null,
  ): ng.ui.bootstrap.IModalInstanceService => {
    const modalObject: CommonsModalsModels.ModalObject = {
      animation: false,
      templateUrl: this.$rootScope.routes.templates + template,
      controller: controller,
      controllerAs: "modalCtrl",
      windowClass: extraModalClass
        ? `ib-modals ${extraModalClass}`
        : "ib-modals ib-modals--md ib-modals--padding-big",
      resolve: {
        object: function () {
          return modelObject;
        },
      },
    };
    if (isModalBlocked) {
      modalObject.backdrop = "static";
      modalObject.keyboard = false;
    }

    return this.$uibModal.open(modalObject);
  };

  showComponentModal = (
    component: string,
    isModalBlocked: boolean = false,
    modelObject?: Record<string, any>,
    extraModalClass?: string,
  ): ng.ui.bootstrap.IModalInstanceService => {
    const modalObject: CommonsModalsModels.ModalObjectComponent = {
      animation: false,
      component: component,
      windowClass: extraModalClass
        ? `ib-modals ${extraModalClass}`
        : "ib-modals ib-modals--md ib-modals--padding-big",
      resolve: {
        object: function () {
          return modelObject;
        },
      },
    };
    if (isModalBlocked) {
      modalObject.backdrop = "static";
      modalObject.keyboard = false;
    }
    return this.$uibModal.open(modalObject);
  };

  showGenericComponentModal = (
    modelObject?: CommonsModalsModels.GenericComponentModalModel,
    isModalBlocked: boolean = false,
    extraModalClass?: string,
  ): ng.ui.bootstrap.IModalInstanceService => {
    return this.showComponentModal(
      "ibGenericModalComponent",
      isModalBlocked,
      modelObject,
      extraModalClass,
    );
  };

  showGenericErrorComponent = (
    errorObject?: CommonsModalsModels.GenericErrorComponentModalModel,
    isModalBlocked: boolean = false,
    extraModalClass?: string,
  ): ng.ui.bootstrap.IModalInstanceService => {
    return this.showComponentModal(
      "ibGenericErrorModalComponent",
      isModalBlocked,
      errorObject,
      extraModalClass ?? "ib-modals--md",
    );
  };

  showOnholdModal = (
    isModalBlocked: boolean,
    template: string,
    modelObject?: object,
    extraModalClass?: string,
  ): ng.ui.bootstrap.IModalInstanceService => {
    if (template)
      template = template.includes(".html") ? template : template + ".html";
    const modalObject: CommonsModalsModels.ModalObject = {
      animation: false,
      templateUrl: this.$rootScope.routes.templates + template,
      controller: "OnholdModalController",
      controllerAs: "modalCtrl",
      windowClass:
        "ib-modals" +
        (extraModalClass ? " " + extraModalClass : " ib-modals--md"),
      resolve: {
        object: function () {
          return modelObject;
        },
      },
    };
    if (isModalBlocked) {
      modalObject.backdrop = "static";
      modalObject.keyboard = false;
    }
    return this.$uibModal.open(modalObject);
  };

  /**
   * Opens the waiting modal, saving its instance in the service as attribute
   */
  showWaitingModal = (
    template?: string,
    classTpl?: string,
    background?: boolean,
    modelObject?: object,
  ): void => {
    const tpl = template || "generic-wait-modal";
    const templateFile = tpl.includes(".html") ? tpl : tpl + ".html";
    const clss = classTpl || "";
    const waitModalObject: CommonsModalsModels.ModalObject = {
      animation: false,
      templateUrl: this.$rootScope.routes.templates + templateFile,
      size: "loading",
      backdrop: "static",
      controller: "GenericModalController",
      controllerAs: "modalCtrl",
      keyboard: false,
      windowClass: clss ? clss : "ib-modals ib-modals--loading",
      resolve: {
        object: function () {
          return modelObject;
        },
      },
    };
    if (background) {
      waitModalObject.windowTemplateUrl =
        this.$rootScope.routes.templates + "ib-modal-background.html";
    }
    this.waitingModalInstance ??= this.$uibModal.open(waitModalObject);
  };

  /**
   * Opens a fares  modal returning its instance
   * @param {boolean} isModalBlocked - if the  modal must be blocked on outside user click.
   * @param {string} template - the name of a custom template to be shown in the modal
   * @returns {Object} -the  modal instance opened
   */
  showFaresModal = (
    isModalBlocked: boolean,
    template: string,
    modelObject?: object,
    extraModalClass?: string,
  ): ng.ui.bootstrap.IModalInstanceService => {
    if (template)
      template = template.includes(".html") ? template : template + ".html";
    const modalObject: CommonsModalsModels.ModalObject = {
      animation: false,
      templateUrl: this.$rootScope.routes.templates + template,
      controller: "FareModalController",
      controllerAs: "modalCtrl",
      windowClass:
        "ib-modals" +
        (extraModalClass ? " " + extraModalClass : " ib-modals--md"),
      resolve: {
        object: function () {
          return modelObject;
        },
      },
    };
    if (isModalBlocked) {
      modalObject.backdrop = "static";
      modalObject.keyboard = false;
    }
    return this.$uibModal.open(modalObject);
  };

  /**
   * Closes the current waiting modal if it exists
   */
  finishWaiting = (): void => {
    if (this.waitingModalInstance) {
      this.waitingModalInstance.dismiss();
      this.waitingModalInstance = null;
    }
  };

  /**
   * Closes all the opened modals in the aplication
   */
  closeAllCurrentModals = (): void => {
    this.$uibModalStack.dismissAll();
  };

  /**
   * @function
   * @name setErrorMessage
   * @desc Sets the param object, the object that contains the message error.
   */
  setErrorMessage = (object: object): void => {
    this.errorMessage = object;
  };

  getErrorMessage = (): string => {
    return this.errorMessage;
  };

  /**
   * @function
   * @name setErrorMessage
   * @desc Sets the param object, the object that contains the message error.
   */
  setErrorCode = (object: object): void => {
    this.errorCode = object;
  };

  /**
   * @function
   * @name isError
   * @desc Sets the variable error to true and opens the modal
   */
  isError = (
    modelObject?: object,
    template?: string,
    staticModal?: object,
  ): ng.ui.bootstrap.IModalInstanceService => {
    const modalObject: CommonsModalsModels.ModalObject = {
      animation: false,
      templateUrl:
        this.$rootScope.routes.templates +
        (template || "ib-generic-error-modal.html"),
      controller: "GenericErrorModalController",
      controllerAs: "modalCtrl",
      size: "md",
      windowClass: "ib-modals ib-modals--md",
      resolve: {
        object: () => {
          return modelObject || {};
        },
      },
    };
    if (staticModal || this.getErrorCode() === "IB_00002") {
      modalObject.backdrop = "static";
      modalObject.keyboard = false;
    }
    return this.$uibModal.open(modalObject);
  };

  /**
   * @function
   * @name getErrorCode
   * @desc Returns the variable errorCode
   */
  getErrorCode = (): string => {
    return this.errorCode;
  };

  open = (modalObject: object): ng.ui.bootstrap.IModalInstanceService => {
    return this.$uibModal.open(modalObject);
  };

  /**
   * @function
   * @name openBuildGenericModal
   * @desc Build Generic Model
   * @param {Object} dataModel data inject on controller
   * @param {any} template name file html modal
   * @param {string} extraModalClass add class css
   * @param {any} nameController name controller refer
   * @returns {Object} the  modal instance opened
   */
  openBuildGenericModal = (
    dataModel: object,
    template: string,
    extraModalClass: string,
    nameController: string,
    isModalBlocked?: boolean,
  ): ng.ui.bootstrap.IModalInstanceService => {
    const modalObject: CommonsModalsModels.ModalObject = {
      animation: false,
      templateUrl:
        this.$rootScope.routes.templates +
        (template.includes(".html") ? template : template + ".html"),
      controller: nameController,
      controllerAs: "modalCtrl",
      windowClass:
        "ib-modals" +
        (extraModalClass ? " " + extraModalClass : " ib-modals--md"),
      resolve: {
        object: function () {
          return dataModel;
        },
      },
    };

    if (isModalBlocked) {
      modalObject.backdrop = "static";
      modalObject.keyboard = false;
    }
    return this.$uibModal.open(modalObject);
  };

  showAcceptTermsModal = (modelObject: object) => {
    const modalObject: CommonsModalsModels.ModalObject = {
      animation: false,
      templateUrl: `${this.$rootScope.routes.templates}ib-modal-terms-conditions.html`,
      controller: "TermsConditionsModalController",
      controllerAs: "TCmodalCtrl",
      windowClass: "ib-modals ib-modals--md",
      backdrop: "static",
      keyboard: false,
      resolve: {
        object: function () {
          return modelObject;
        },
      },
    };
    return this.$uibModal.open(modalObject);
  };

  /**
   * Show Component modal back main.
   * Flows: BKI, CKI and MMB
   */
  showBackMainModalComponent = (
    modelObject?: CommonsModalsModels.GenericComponentModalModel,
    isModalBlocked: boolean = false,
    extraModalClass?: string,
  ): ng.ui.bootstrap.IModalInstanceService => {
    return this.showComponentModal(
      "ibBackMainModalComponent",
      isModalBlocked,
      modelObject,
      extraModalClass,
    );
  };
}
