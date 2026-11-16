import {
  IbCTokenUtilsService,
  IbCUserUtilsService,
} from "ib-web-commons/utils";
import * as angular from "angular";
import { IbCAuthService } from "ib-web-commons/http-services";
import { of } from "rxjs";

const fakeLocalStoregeService = {
  get: () => {},
  set: () => {},
  remove: () => {},
  clear: () => {},
};
const fakeRootScope = {};

const fakeCommonsConstants = {
  DISCOUNT_TYPE: {
    RESIDENT: "RES",
    LARGE_FAMILY: "LGF",
    DUMBO: "DUMBO",
    PLUTO: "PLUTO",
    PARTNER: "PARTNER",
  },
};
const fakeCommonsModalService = {};
const fakeCookies = {
  get: () => {},
  set: () => {},
  remove: () => {},
};
const fakeCommonsHttpServicesConstants = {
  COOKIES: {
    PERSONALIZATION: "string",
    GDR_PA_INFO: "string",
    DEFAULT_EXPIRY_TIME: 0,
    DEFAULT_PATH: "string",
    DEFAULT_DOMAIN: "string",
    IBERIACOM_LAST_SEARCH: {
      NAME: "string",
      PARAMS: {
        ORIGIN: 0,
        DATES: [],
      },
    },
  },
};
const fakeFilter = {};
const fakeLocation = jasmine.createSpyObj("$location", ["absUrl"]);
const fakeCommonsCookiesService = {};
const fakeDocument = {};
let fakeRedirectionService = {
  redirectToLoginPage: jasmine.createSpy("redirectToLoginPage"),
};
const fakeCommonsUserUtilsService = jasmine.createSpyObj<IbCUserUtilsService>(
  "IbCUserUtilsService",
  ["getFrequentFlyer", "isSoftUser", "logout"],
);

const fakeIbCTokenUtilsService = jasmine.createSpyObj<IbCTokenUtilsService>(
  "IbCTokenUtilsService",
  ["getFrequentFlyerFromToken"],
);

const fakeIbCAuthService = jasmine.createSpyObj<IbCAuthService>(
  "IbCAuthService",
  ["revokeNecessaryToken"],
);
fakeIbCAuthService.revokeNecessaryToken.and.returnValue(of(null));

const fakeWindow = {
  location: {
    href: "",
  },
};

let service;

describe("Test CommonsUtilService", () => {
  beforeEach(() => {
    angular.mock.module("ib-commons-utils-module", ($provide) => {
      $provide.value("$window", fakeWindow);
      $provide.value("localStorageService", fakeLocalStoregeService);
      $provide.value("$rootScope", fakeRootScope);
      $provide.value("CommonsConstants", fakeCommonsConstants);
      $provide.value("CommonsModalService", fakeCommonsModalService);
      $provide.value("$cookies", fakeCookies);
      $provide.value("$filter", fakeFilter);
      $provide.value("$location", fakeLocation);
      $provide.value("CommonsCookiesService", fakeCommonsCookiesService);
      $provide.value("$document", fakeDocument);
      $provide.value("CommonsUserUtilsService", fakeCommonsUserUtilsService);
      $provide.value(
        "CommonsHttpServicesConstants",
        fakeCommonsHttpServicesConstants,
      );
      $provide.value("IbCTokenUtilsService", fakeIbCTokenUtilsService);
      $provide.value("IbCAuthService", fakeIbCAuthService);
      $provide.value("RedirectionService", fakeRedirectionService);
    });
    inject((_CommonsUtilService_) => {
      service = _CommonsUtilService_;
    });
  });
  describe("Test isDiscountTypePartnerEquivalent", () => {
    it("TEST called with DUMBO", () => {
      const result = service.isDiscountTypePartnerEquivalent("DUMBO");
      expect(result).toBe(true);
    });
    it("TEST called with PLUTO", () => {
      const result = service.isDiscountTypePartnerEquivalent("PLUTO");
      expect(result).toBe(true);
    });
    it("TEST called with OTHER", () => {
      const result = service.isDiscountTypePartnerEquivalent("OTHER");
      expect(result).toBe(false);
    });
  });

  describe("when #getMemberId is called", () => {
    it("should call getFrequentFlyer", () => {
      service.getMemberId();
      expect(fakeCommonsUserUtilsService.getFrequentFlyer).toHaveBeenCalled();
    });
  });

  describe("when #getMemberIdByToken is called", () => {
    it("should call getFrequentFlyer", () => {
      service.getMemberIdByToken();
      expect(
        fakeIbCTokenUtilsService.getFrequentFlyerFromToken,
      ).toHaveBeenCalled();
    });
  });

  describe("when #getMemberIdFromCookie is called", () => {
    it("should call getFrequentFlyer", () => {
      service.getMemberIdFromCookie();
      expect(
        fakeIbCTokenUtilsService.getFrequentFlyerFromToken,
      ).toHaveBeenCalled();
    });
  });

  describe("when #getFFUser is called", () => {
    it("and frequent flyer found, should return it", () => {
      fakeCommonsUserUtilsService.getFrequentFlyer.and.returnValue("123456789");
      expect(service.getFFUser()).toBe("123456789");
    });

    it("and frequent flyer not found, should return it", () => {
      fakeCommonsUserUtilsService.getFrequentFlyer.and.returnValue("NOT_FOUND");
      const result = service.getFFUser();
      expect(result).toBe("NOT_FOUND");
      expect(fakeCommonsUserUtilsService.logout).toHaveBeenCalled();
    });
  });
});
