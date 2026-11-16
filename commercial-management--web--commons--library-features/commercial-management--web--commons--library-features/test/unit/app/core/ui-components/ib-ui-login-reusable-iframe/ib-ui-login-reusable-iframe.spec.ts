describe("ibUiLoginReusableIframeController test", () => {
  let controller, scope;

  const fakeCommonsHttpServicesConstants = {
    SALESFORCE_ENVIRONMENTS: {
      PREE: "https://pree.salesforce.com/IbIdentity",
      PREB: "https://preb.salesforce.com/IbIdentity",
      INT_AWS: "https://int-aws.salesforce.com/IbIdentity",
      PRE_AWS: "https://pre-aws.salesforce.com/IbIdentity",
      PRO_AWS: "https://pro-aws.salesforce.com",
      PRO: "https://pro.salesforce.com",
    },
    SALESFORCE_TOKEN: {
      iframeURI: "/oauth2/authorize?",
    },
  };

  const fakeCommonsComponentUtils = {
    equalHeight: jasmine.createSpy("equalHeight"),
  };

  const fakeCommonsUserUtilsService = {
    isSoftUser: jasmine.createSpy("isSoftUser").and.returnValue(false),
  };

  const fakeCommonsModalService = {
    showGenericError: jasmine.createSpy("showGenericError"),
  };

  const fakeLocalStorageService = {
    set: jasmine.createSpy("set"),
    get: jasmine.createSpy("get"),
  };

  const fakeDocument = [{
    head: {
      querySelector: jasmine.createSpy("querySelector").and.returnValue(null),
      appendChild: jasmine.createSpy("appendChild"),
    },
    createElement: jasmine.createSpy("createElement").and.callFake((tag) => {
      if (tag === "iframe") {
        return {
          remove: jasmine.createSpy("remove"),
          style: {},
          width: "",
          id: "",
          src: "",
          onload: null,
        };
      }
      return { rel: "", href: "", crossOrigin: "" };
    }),
    getElementById: jasmine.createSpy("getElementById").and.returnValue({
      appendChild: jasmine.createSpy("appendChild"),
      style: {},
    }),
  }];

  const fakeWindow = {
    addEventListener: jasmine.createSpy("addEventListener"),
    removeEventListener: jasmine.createSpy("removeEventListener"),
    dispatchEvent: jasmine.createSpy("dispatchEvent"),
    location: { origin: "https://www.iberia.com" },
  };

  beforeEach(() => {
    angular.mock.module("ib-ui-login-reusable-iframe-component", ($provide) => {
      $provide.value("CommonsHttpServicesConstants", fakeCommonsHttpServicesConstants);
      $provide.value("CommonsComponentUtils", fakeCommonsComponentUtils);
      $provide.value("CommonsUserUtilsService", fakeCommonsUserUtilsService);
      $provide.value("CommonsModalService", fakeCommonsModalService);
      $provide.value("localStorageService", fakeLocalStorageService);
      $provide.value("$window", fakeWindow);
      $provide.value("$document", fakeDocument);
    });

    inject(($rootScope, $componentController, $timeout) => {
      $rootScope.appMarket = "ES";
      $rootScope.appLang = "es";
      $rootScope.routes = { templates: "/templates/" };

      scope = $rootScope.$new();

      controller = $componentController(
        "ibUiLoginReusableIframeComponent",
        {
          $scope: scope,
          $timeout,
          $document: fakeDocument,
          $window: fakeWindow,
          CommonsHttpServicesConstants: fakeCommonsHttpServicesConstants,
          CommonsComponentUtils: fakeCommonsComponentUtils,
          CommonsUserUtilsService: fakeCommonsUserUtilsService,
          CommonsModalService: fakeCommonsModalService,
          localStorageService: fakeLocalStorageService,
        },
        { flow: "BKI" }
      );
      scope.$digest();
    });
  });

  describe("When controller is initialized", () => {
    it(", it will be defined", () => {
      controller.$onInit();
      expect(controller).toBeDefined();
    });

    it(", isLoading will be true after $onInit", () => {
      controller.$onInit();
      expect(controller.isLoading).toBeTrue();
    });
  });

  describe("When isLoading is false", () => {
    it(", iframeReusableLogin container should be shown (isLoading falsy)", () => {
      controller.isLoading = false;
      expect(controller.isLoading).toBeFalse();
    });

    it(", isIframeError should be falsy to show iframe container", () => {
      controller.isIframeError = false;
      expect(controller.isIframeError).toBeFalsy();
    });
  });

  describe("When isLoading is true", () => {
    it(", loading spinner should be shown", () => {
      controller.isLoading = true;
      expect(controller.isLoading).toBeTrue();
    });
  });

  describe("When loadIframe is called", () => {
    it(", it will set isLoading to true", () => {
      controller.$onInit();
      expect(controller.isLoading).toBeTrue();
    });

    it(", it will set iframeType to '3' for BKI flow", () => {
      controller.flow = "BKI";
      controller.$onInit();
      expect(controller.iframeType).toEqual("3");
    });

    it(", it will set iframeType to '4' for MMB_CKI flow", () => {
      controller.flow = "MMB_CKI";
      controller.$onInit();
      expect(controller.iframeType).toEqual("4");
    });

    it(", it will set iframeType to '5' for BKI_RG flow", () => {
      controller.flow = "BKI_RG";
      controller.$onInit();
      expect(controller.iframeType).toEqual("5");
    });
  });

  describe("When a postMessage event is received", () => {
    it(", window message listener is registered on construction", () => {
      expect(fakeWindow.addEventListener).toHaveBeenCalledWith(
        "message",
        jasmine.any(Function)
      );
    });
  });

  describe("When scope is destroyed", () => {
    it(", it will remove window event listeners", () => {
      scope.$destroy();
      expect(fakeWindow.removeEventListener).toHaveBeenCalledWith(
        "message",
        jasmine.any(Function)
      );
    });
  });
});