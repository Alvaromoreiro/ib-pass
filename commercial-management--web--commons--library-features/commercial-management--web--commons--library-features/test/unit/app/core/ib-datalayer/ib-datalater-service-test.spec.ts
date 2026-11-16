import angular from "angular";
import { DataLayerService } from "src/app/core/ib-datalayer/services/ib-datalayer-service";
import { StorageServiceMock } from "../../../../mocks/Services/StorageServiceMock";
describe("Test DataLayerService", () => {
  //Define variables
  let service: DataLayerService;
  let localStorageService: StorageServiceMock = new StorageServiceMock();
  let rootScope: CommonsRootScope;
  let fakeWindow = {
    datalayer_general: {},
    datalayer_ecommerce: {},
    DigitalChange: (type, datalayer, ecommerce) => {},
  };

  beforeEach(() => {
    localStorageService.clear();

    angular.mock.module(
      "ib-datalayer-module",
      "ngCookies",
      "ib-commons-constants-module",
      "ib-monetate-module",
      ($provide) => {
        $provide.value("localStorageService", localStorageService);
        $provide.value("$window", fakeWindow);
      },
    );
    inject((_DataLayerService_, _$rootScope_) => {
      service = _DataLayerService_;
      rootScope = _$rootScope_;
    });
  });
  describe("Call initDatalayer", () => {
    beforeEach(() => {});
    it("and set datalayer and ecommerce objects with {}", () => {
      service.initDatalayer({}, {});
      expect(service.datalayer_general).toEqual({});
    });
  });
  describe("Call isDatalayerInit", () => {
    beforeEach(() => {
      service.datalayer_general = { market: "ES" };
      service.datalayer_ecommerce = {};
    });
    it("and return true if datalayers are initialized", () => {
      let returnData = service.isDatalayerInit();
      expect(returnData).toBeTruthy();
    });
  });
  describe("Call addDataLayerGeneralInfo", () => {
    beforeEach(() => {
      service.datalayer_general = { market: "ES" };
      service.datalayer_ecommerce = {};
    });
    it("and set new datalayer_general attribute", () => {
      service.addDataLayerGeneralInfo({ language: "es" });
      expect(localStorageService.get("confirmationDatalayerInfo")).toEqual({
        market: "ES",
        language: "es",
      });
    });
  });
  describe("Call addDataLayerEcommerceInfo", () => {
    beforeEach(() => {
      service.datalayer_general = { market: "ES" };
      service.datalayer_ecommerce = {};
    });
    it("and set new datalayer_general attribute", () => {
      service.addDataLayerEcommerceInfo({ items: {} });
      expect(service.datalayer_ecommerce).toEqual({ items: {} });
    });
  });
  describe("Call removeAllDatalayerInfo", () => {
    beforeEach(() => {
      service.datalayer_general = { market: "ES" };
      service.datalayer_ecommerce = { items: {} };
    });
    it("and it will remove every datalayer info", () => {
      service.removeAllDatalayerInfo();
      expect(service.datalayer_general).toEqual({});
      expect(service.datalayer_ecommerce).toEqual({});
    });
  });
  describe("Call getDatalayerGeneral", () => {
    beforeEach(() => {
      service.datalayer_general = { market: "ES" };
    });
    it("and it will return datalayer_general info", () => {
      let returnData = service.getDatalayerGeneral();
      expect(returnData).toEqual({ market: "ES" });
    });
  });
  describe("Call getEcommerceDatalayer", () => {
    beforeEach(() => {
      service.datalayer_ecommerce = { items: {} };
    });
    it("and it will return datalayer_ecommerce info", () => {
      let returnData = service.getEcommerceDatalayer();
      expect(returnData).toEqual({ items: {} });
    });
  });
  describe("Call callUpdateTagManager", () => {
    beforeEach(() => {
      service.datalayer_ecommerce = { items: {} };
    });
    it("and it will return datalayer_ecommerce info", () => {
      service.callUpdateTagManager("view");
      expect(localStorageService.get("sendDatalayerEcommerce")).toBeFalsy();
    });
  });
  describe("Call removeDatalayerGeneralInfo", () => {
    beforeEach(() => {
      service.datalayer_general = {
        market: "ES",
        language: "es",
        process: "booking",
      };
    });
    it("and it will return datalayer_ecommerce info", () => {
      service.removeDatalayerGeneralInfo(["market"]);
      expect(service.datalayer_general).toEqual({
        language: "es",
        process: "booking",
      });
    });
  });
});
