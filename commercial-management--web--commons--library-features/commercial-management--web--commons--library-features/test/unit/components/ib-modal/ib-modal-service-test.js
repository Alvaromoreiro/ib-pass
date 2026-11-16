describe("CommonsModalService test", () => {
  let CommonsModalService, rootScope, uibModal, uibModalStack;
  const fake$uibModal = {
    open: jasmine.createSpy(),
  };
  const fake$uibModalStack = {
    dismissAll: jasmine.createSpy(),
  };

  beforeEach(() => {
    angular.mock.module("ib-commons-modal-service-module", ($provide) => {
      $provide.value("$uibModal", fake$uibModal);
      $provide.value("$uibModalStack", fake$uibModalStack);
    });

    inject(($rootScope, _CommonsModalService_) => {
      CommonsModalService = _CommonsModalService_;
      rootScope = $rootScope;
      rootScope.routes = {
        templates: "",
      };
    });
  });
  describe("when showGenericError() is called", () => {
    it("showGenericError", (done) => {
      CommonsModalService.showGenericError();
      done();
    });
  });
  describe("when showGenericModal() is called", () => {
    it("showGenericModal", (done) => {
      CommonsModalService.showGenericModal();
      done();
    });
  });
  describe("when showWaitingModal() is called", () => {
    it("showWaitingModal", (done) => {
      CommonsModalService.showWaitingModal("");
      done();
    });
  });
  describe("when showOnholdModal() is called", () => {
    it("showOnholdModal", (done) => {
      CommonsModalService.showOnholdModal();
      done();
    });
  });
  describe("when showFaresModal() is called", () => {
    it("showFaresModal", (done) => {
      CommonsModalService.showFaresModal();
      done();
    });
  });
  describe("when finishWaiting() is called", () => {
    it("finishWaiting", (done) => {
      CommonsModalService.finishWaiting();
      done();
    });
  });
  describe("when closeAllCurrentModals() is called", () => {
    it("closeAllCurrentModals", (done) => {
      CommonsModalService.closeAllCurrentModals();
      done();
    });
  });
  describe("when setErrorMessage() is called", () => {
    it("setErrorMessage", (done) => {
      CommonsModalService.setErrorMessage({});
      done();
    });
  });
  describe("when getErrorMessage() is called", () => {
    it("getErrorMessage", (done) => {
      CommonsModalService.getErrorMessage();
      done();
    });
  });
  describe("when setErrorCode() is called", () => {
    it("setErrorCode", (done) => {
      CommonsModalService.setErrorCode({});
      done();
    });
  });
  describe("when isError() is called", () => {
    it("isError", (done) => {
      CommonsModalService.isError();
      done();
    });
  });
  describe("when getErrorCode() is called", () => {
    it("getErrorCode", (done) => {
      CommonsModalService.getErrorCode();
      done();
    });
  });
  describe("when open() is called", () => {
    it("open", (done) => {
      CommonsModalService.open({});
      done();
    });
  });
  xdescribe("when openBuildGenericModal() is called", () => {
    it("openBuildGenericModal", (done) => {
      CommonsModalService.openBuildGenericModal();
      done();
    });
  });
  describe("when showAcceptTermsModal() is called", () => {
    it("showAcceptTermsModal", (done) => {
      CommonsModalService.showAcceptTermsModal({});
      done();
    });
  });
});
