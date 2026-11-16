import angular from "angular";
import { CommonsConstantsType } from "ib-web-commons/constants";
import { DatalayerBKIConstantsType } from "src/app/core/ib-datalayer/constants/ib-datalayer-bki-constants";
import { DatalayerCKIConstantsType } from "src/app/core/ib-datalayer/constants/ib-datalayer-cki-constants";
import { DatalayerGeneralConstantsType } from "src/app/core/ib-datalayer/constants/ib-datalayer-general-constants";
import { DatalayerMMBConstantsType } from "src/app/core/ib-datalayer/constants/ib-datalayer-mmb-constants";
import { DatalayerConstantsType } from "src/app/core/ib-datalayer/ib-datalayer-constants";
import { DatalayerUtilsService } from "src/app/core/ib-datalayer/services/ib-datalayer-utils-service";
import { StorageServiceMock } from "../../../../mocks/Services/StorageServiceMock";
import {
  bookingUrlParams as shuttleURLparams,
  originDest as origShuttle,
  shuttleExampleModel,
  shuttleDigitalDataInitial,
  shuttleDatalayerInitial,
} from "./Mocks/ib-shuttle-datalayer-mock-data";
import { confirmationDigitalInfo } from "./Mocks/confirmation-digital-info-mock";

describe("Test DatalayerUtilsService", () => {
  class DataLayerServiceMock {
    public addDataLayerGeneralInfo = jasmine.createSpy(
      "addDataLayerGeneralInfo",
    );
  }
  class CommonsUtilServiceMock {
    getTypeSearch = jasmine
      .createSpy("getTypeSearch")
      .and.returnValue("turista");
    getProcess = jasmine.createSpy("getProcess").and.returnValue("booking");
  }
  class CommonsUserUtilsServiceMock {}
  class MonetateUtilsServiceMock {}
  class DigitalDataServiceMock {
    public addDigitalDataInfo = jasmine.createSpy("addDigitalDataInfo");
  }
  //Define variables
  let service: DatalayerUtilsService;
  let rootScope: CommonsRootScope;
  let DataLayerService: DataLayerServiceMock;
  let DatalayerConstants: DatalayerConstantsType;
  let CommonsConstants: CommonsConstantsType;
  let localStorageService: StorageServiceMock = new StorageServiceMock();
  let CommonsUtilService: CommonsUtilServiceMock;
  let CommonsUserUtilsService: CommonsUserUtilsServiceMock;
  let MonetateUtilsService: MonetateUtilsServiceMock;
  let DigitalDataService: DigitalDataServiceMock;
  let DatalayerGeneralConstants: DatalayerGeneralConstantsType;
  let DatalayerBKIConstants: DatalayerBKIConstantsType;
  let DatalayerCKIConstants: DatalayerCKIConstantsType;
  let DatalayerMMBConstants: DatalayerMMBConstantsType;
  let $timeout: ng.ITimeoutService;
  let cookies;
  let $filter: ng.FilterFactory = () => {
    return (input: string) => {
      return input;
    };
  };
  let fakeSessionStorage = new StorageServiceMock();

  beforeEach(() => {
    DataLayerService = new DataLayerServiceMock();
    CommonsUserUtilsService = new CommonsUserUtilsServiceMock();
    CommonsUtilService = new CommonsUtilServiceMock();
    MonetateUtilsService = new MonetateUtilsServiceMock();
    DigitalDataService = new DigitalDataServiceMock();
    localStorageService.clear();

    angular.mock.module("ib-datalayer-module", "ngCookies", ($provide) => {
      $provide.value("localStorageService", localStorageService);
      $provide.value("DataLayerService", DataLayerService);
      $provide.value("CommonsUserUtilsService", CommonsUserUtilsService);
      $provide.value("CommonsUtilService", CommonsUtilService);
      $provide.value("MonetateUtilsService", MonetateUtilsService);
      $provide.value("DigitalDataService", DigitalDataService);
      $provide.value("CommonsSessionStorageService", fakeSessionStorage);
      $provide.value("$filter", $filter);
    });
    inject(
      (
        _DatalayerUtilsService_,
        _$rootScope_,
        _$timeout_,
        _DatalayerConstants_,
        _DatalayerBKIConstants_,
        _DatalayerCKIConstants_,
        _DatalayerMMBConstants_,
        _DatalayerGeneralConstants_,
        _CommonsConstants_,
        _$cookies_,
      ) => {
        service = _DatalayerUtilsService_;
        rootScope = _$rootScope_;
        $timeout = _$timeout_;
        DatalayerConstants = _DatalayerConstants_;
        DatalayerBKIConstants = _DatalayerBKIConstants_;
        DatalayerCKIConstants = _DatalayerCKIConstants_;
        DatalayerMMBConstants = _DatalayerMMBConstants_;
        DatalayerGeneralConstants = _DatalayerGeneralConstants_;
        CommonsConstants = _CommonsConstants_;
        cookies = _$cookies_;
      },
    );
  });
  describe("Call updateDiscountData", () => {
    let resulDatalayerTest;
    let resulDigitalDataTest;
    beforeEach(() => {
      DigitalDataService.addDigitalDataInfo = jasmine
        .createSpy("addDigitalDataInfo")
        .and.callFake((input) => {
          resulDigitalDataTest = input;
        });
      DataLayerService.addDataLayerGeneralInfo = jasmine
        .createSpy("addDataLayerGeneralInfo")
        .and.callFake((input) => {
          resulDatalayerTest = input;
        });
    });
    it("Get string with no discounts", () => {
      service.updateDiscountData([]);
      expect(DigitalDataService.addDigitalDataInfo).toHaveBeenCalled();
      expect(DataLayerService.addDataLayerGeneralInfo).toHaveBeenCalled();
      expect(resulDatalayerTest).toEqual({ descuentosAplicados: "" });
      expect(resulDigitalDataTest).toEqual({ DiscountsApplied: "" });
    });
    it("Get string with all discounts", () => {
      service.updateDiscountData([
        {
          type: "CORPORATE",
          discountType: "ODM",
          description: "Descuento exclusivo",
          percentDiscount: 27.95,
          totalDiscount: 5,
          corporateCodes: "047053",
        },
        {
          type: "RES",
          discountType: "CANARIAS",
          description: "Dto. Residente",
          percentDiscount: 75,
          totalDiscount: 89.45,
          discountCode: "RC",
        },
        {
          type: "LGF",
          discountType: "SPECIAL",
          description: "Dto. Fam. numerosa",
          percentDiscount: 10,
          totalDiscount: 11.92,
        },
        {
          type: "PARTNER",
          percentDiscount: 10,
          totalDiscount: 4,
          description: "Plan Santander One Iberia Plus",
          discountType: "GENERAL",
          partner: { partnerId: "SAN", productId: "63" },
          userMustFly: false,
        },
      ]);
      expect(DigitalDataService.addDigitalDataInfo).toHaveBeenCalled();
      expect(DataLayerService.addDataLayerGeneralInfo).toHaveBeenCalled();
      expect(resulDatalayerTest).toEqual({
        descuentosAplicados:
          "CORPORATE_ODM_047053|RES_RC|LGF_SPECIAL|PARTNER_SAN",
      });
      expect(resulDigitalDataTest).toEqual({
        DiscountsApplied: "CORPORATE_ODM_047053|RES_RC|LGF_SPECIAL|PARTNER_SAN",
      });
    });
  });
  describe("Call addShuttleDigitalData", () => {
    let exampleModel;
    beforeEach(() => {
      localStorageService.set("bookingUrlParams", shuttleURLparams);
      localStorageService.set("originDestination", origShuttle);
      exampleModel = JSON.parse(JSON.stringify(shuttleExampleModel));
      CommonsUtilService.getProcess = jasmine
        .createSpy("getProcess")
        .and.returnValue("puente aéreo");
      CommonsUtilService.getTypeSearch = jasmine
        .createSpy("getTypeSearch")
        .and.returnValue("turista");
      spyOn(service, "addDigitalDataInfo");
    });
    it("test for shuttle view", () => {
      service.addShuttleDigitalData(
        DatalayerConstants.FLOWS.SHUTTLE,
        exampleModel,
      );
      expect(service.addDigitalDataInfo).toHaveBeenCalledWith(
        shuttleDigitalDataInitial,
      );
    });
  });
  describe("Call addShuttleDatalayer", () => {
    let exampleModel;
    beforeEach(() => {
      localStorageService.set("bookingUrlParams", shuttleURLparams);
      localStorageService.set("originDestination", origShuttle);
      exampleModel = JSON.parse(JSON.stringify(shuttleExampleModel));
      CommonsUtilService.getProcess = jasmine
        .createSpy("getProcess")
        .and.returnValue("puente aéreo");
      CommonsUtilService.getTypeSearch = jasmine
        .createSpy("getTypeSearch")
        .and.returnValue("turista");
      spyOn(service, "addDataLayerInfo");
    });
    it("test for shuttle view", () => {
      service.addShuttleDatalayer(
        DatalayerConstants.FLOWS.SHUTTLE,
        exampleModel,
      );
      expect(service.addDataLayerInfo).toHaveBeenCalledWith(
        shuttleDatalayerInitial,
      );
    });
  });

  describe("Call setProcessAndStep", () => {
    beforeEach(() => {
      localStorageService.set("flowApp", "CKI");
      localStorageService.set(
        "confirmationDigitalInfo",
        confirmationDigitalInfo,
      );
      spyOn(service, "setProcessAndStep");
    });
    it("set quadrigam ancillaries MOSEAT", () => {
      service.setProcessAndStep(null, null, "MOSEAT");
      expect(service.setProcessAndStep).toHaveBeenCalled();
    });
    it("set quadrigam ancillaries MOBAGG", () => {
      service.setProcessAndStep("MOBAGG", "MOBAGG", "MOBAGG");
      expect(service.setProcessAndStep).toHaveBeenCalled();
    });
  });
});
