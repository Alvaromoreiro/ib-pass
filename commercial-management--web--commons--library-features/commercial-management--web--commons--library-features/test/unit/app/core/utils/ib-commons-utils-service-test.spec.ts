import angular from "angular";
import { IbCAuthService } from "ib-web-commons/http-services";
import { of } from "rxjs";
import { StorageServiceMock } from "../../../../mocks/Services/StorageServiceMock";

const fakeIbCAuthService = jasmine.createSpyObj<IbCAuthService>(
  "IbCAuthService",
  ["revokeNecessaryToken"],
);
fakeIbCAuthService.revokeNecessaryToken.and.returnValue(of(null));

describe("CommonsUtilService test", () => {
  // Test scoped variables
  let CommonsUtilService,
    rootScope,
    localStorageService,
    $document,
    testCookies;
  let fakeWindow = {
    location: {
      href: "https://pree.iberia.es/flights/?market=ES&language=en&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=false&TRIP_TYPE=1&BEGIN_CITY_01=GRX&END_CITY_01=MAD&BEGIN_DAY_01=12&BEGIN_MONTH_01=202303&BEGIN_YEAR_01=2023&END_DAY_01=0&END_MONTH_01=00&END_YEAR_01=0&FARE_TYPE=&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0&BNN=0&YTH=0&YCD=0&residentCode=&familianumerosa=&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES&flashOffer=true&flashOfferId=ESGRXMAD15022300001203230920#!/availability",
    },
    innerWidth: 1024,
    document: {
      title: "",
    },
  };
  let fakeSessionStorage = new StorageServiceMock();
  const fakeCookies = {
    get: () => {},
    set: () => {},
    remove: () => {},
    put: () => {},
  };
  let fakeFilter = jasmine.createSpy("$filter").and.callFake((filter) => {
    var filterFunc = () => {
      return "";
    };
    switch (filter) {
      case "translate":
        filterFunc = () => {
          return "Translated Text";
        };
        break;
      case "DateFormatFilter":
        filterFunc = () => {
          return "date";
        };
        break;
      case "date":
        filterFunc = () => {
          return "Mar 10, 2020";
        };
        break;
      default:
        break;
    }

    return filterFunc;
  });
  let fakeLocation = {
    absUrl: jasmine.createSpy("absUrl").and.returnValue("url_location"),
  };
  let fakeCommonsCookiesService = {
    getCookie: jasmine.createSpy("getCookie"),
  };
  let fakeCommonsUserUtilsService = {
    removeUserRole: jasmine.createSpy("removeUserRole"),
    setUserRole: jasmine.createSpy("setUserRole"),
    getFrequentFlyer: jasmine.createSpy("getFrequentFlyer"),
    isSoftUser: jasmine.createSpy("isSoftUser"),
    logout: jasmine.createSpy("logout"),
  };
  let fakeIbCTokenUtilsService = {
    getFrequentFlyerFromToken: jasmine.createSpy("getFrequentFlyerFromToken"),
  };
  let fakeRedirectionService = {
    redirectToLoginPage: jasmine.createSpy("redirectToLoginPage"),
  };
  const fakeCommonsConstants = require("../../../../mocks/constants/CommonsConstants-mock.json");
  const fakeCommonsHttpServicesConstants = {
    COOKIES: {
      PERSONALIZATION: "IBERIACOM_PERSONALIZATION",
      GDR_PA_INFO: "IBERIACOM_GDR_PA_INFO",
      DEFAULT_EXPIRY_TIME: 1000 * 60 * 60 * 24 * 365 * 10, //ten years
      DEFAULT_PATH: "/",
      DEFAULT_DOMAIN: "www.iberia.com",
      IBERIACOM_LAST_SEARCH: {
        NAME: "IBERIACOM_LAST_SEARCH",
        PARAMS: {
          ORIGIN: 0,
          DATES: [2, 3, 4, 5, 6, 7],
        },
      },
      DYNAMIC_PRICING: "DP",
    },
  };
  const mockBookingInfo = {
    outwardSegments: [
      {
        departure: {
          airport: {
            description: "Barajas",
            code: "MAD",
          },
        },
        arrival: {
          airport: {
            description: "El Prat",
            code: "BCN",
          },
        },
        id: 1,
      },
    ],
    returnSegments: [
      {
        departure: {
          airport: {
            description: "El Prat",
            code: "BCN",
          },
        },
        arrival: {
          airport: {
            description: "Barajas",
            code: "MAD",
          },
        },
        id: 2,
      },
    ],
    airShuttleSegments: [
      {
        departure: {
          airport: {
            description: "El Prat",
            code: "BCN",
          },
        },
        arrival: {
          airport: {
            description: "Barajas",
            code: "MAD",
          },
        },
        id: 3,
      },
    ],
  };
  beforeEach(() => {
    angular.mock.module(
      "ib-commons-utils-module",
      "LocalStorageModule",
      "ngCookies",
      ($provide) => {
        $provide.value("$window", fakeWindow);
        $provide.value("CommonsConstants", fakeCommonsConstants);
        $provide.value("$cookies", fakeCookies);
        $provide.value("$filter", fakeFilter);
        $provide.value("$location", fakeLocation);
        $provide.value("CommonsCookiesService", fakeCommonsCookiesService);
        $provide.value("CommonsUserUtilsService", fakeCommonsUserUtilsService);
        $provide.value(
          "CommonsHttpServicesConstants",
          fakeCommonsHttpServicesConstants,
        );
        $provide.value("IbCTokenUtilsService", fakeIbCTokenUtilsService);
        $provide.value("localStorageService", fakeSessionStorage);
        $provide.value("IbCAuthService", fakeIbCAuthService);
        $provide.value("RedirectionService", fakeRedirectionService);
      },
    );
    inject(($rootScope, _CommonsUtilService_, _$document_) => {
      CommonsUtilService = _CommonsUtilService_;
      // localStorageService = _localStorageService_;
      rootScope = $rootScope;
      $document = _$document_;
      // testCookies = $cookies;
    });
  });
  describe("When getProcess is called", () => {
    beforeEach(inject(() => {
      fakeSessionStorage.clear();
    }));
    it("and it is shuttle redemption, it will return a string of shuttle redemption flow", () => {
      fakeSessionStorage.set("isRedemptionFlow", true);
      fakeSessionStorage.set("isShuttleFlow", true);
      let returnData = CommonsUtilService.getProcess();
      expect(returnData).toEqual("puente aéreo redención");
    });
    it("and it is shuttle, it will return a string of shuttle flow", () => {
      fakeSessionStorage.set("isRedemptionFlow", false);
      fakeSessionStorage.set("isShuttleFlow", true);
      let returnData = CommonsUtilService.getProcess();
      expect(returnData).toEqual("puente aéreo");
    });
    it("and it is ONB, it will return a string of ONB flow", () => {
      fakeSessionStorage.set("userLogged", "ONB");
      let returnData = CommonsUtilService.getProcess();
      expect(returnData).toEqual("booking OB obtención");
    });
    it("and it is ONB redemption, it will return a string of ONB redemption flow", () => {
      fakeSessionStorage.set("userLogged", "ONB");
      fakeSessionStorage.set("searchFlightType", "redemptionFlight");
      let returnData = CommonsUtilService.getProcess();
      expect(returnData).toEqual("booking OB redención");
    });
    it("and it is redemption, it will return a string of redemption flow", () => {
      fakeSessionStorage.set("searchFlightType", "redemptionFlight");
      let returnData = CommonsUtilService.getProcess();
      expect(returnData).toEqual("redención");
    });
    it("and it is metasearch, it will return a string of metasearch flow", () => {
      fakeSessionStorage.set("searchFlightType", "metasearchFlight");
      let returnData = CommonsUtilService.getProcess();
      expect(returnData).toEqual("metabuscadores");
    });
    it("and it is Hola Madrid, it will return a string of Hola Madrid flow", () => {
      fakeSessionStorage.set("searchFlightType", "multiCityFlight");
      fakeSessionStorage.set("isHMAD", true);
      let returnData = CommonsUtilService.getProcess();
      expect(returnData).toEqual("stopover hola madrid");
    });
    it("and it is multicity, it will return a string of multicity flow", () => {
      fakeSessionStorage.set("searchFlightType", "multiCityFlight");
      let returnData = CommonsUtilService.getProcess();
      expect(returnData).toEqual("múltiples trayectos");
    });
    it("and it is flashOffer, it will return a string of flasOffer flow", () => {
      fakeWindow.location.href =
        "https://pree.iberia.es/flights/?market=ES&language=en&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=false&TRIP_TYPE=1&BEGIN_CITY_01=GRX&END_CITY_01=MAD&BEGIN_DAY_01=12&BEGIN_MONTH_01=202303&BEGIN_YEAR_01=2023&END_DAY_01=0&END_MONTH_01=00&END_YEAR_01=0&FARE_TYPE=&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0&BNN=0&YTH=0&YCD=0&residentCode=&familianumerosa=&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES&flashOffer=true&flashOfferId=ESGRXMAD15022300001203230920#!/availability";
      let returnData = CommonsUtilService.getProcess();
      expect(returnData).toEqual("flashOffers");
    });
    it("and it is flashOffer, it will return a string of flasOffer flow", () => {
      fakeWindow.location.href =
        "https://pree.iberia.es/flights/?market=ES&language=en&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=false&TRIP_TYPE=1&BEGIN_CITY_01=GRX&END_CITY_01=MAD&BEGIN_DAY_01=12&BEGIN_MONTH_01=202303&BEGIN_YEAR_01=2023&END_DAY_01=0&END_MONTH_01=00&END_YEAR_01=0&FARE_TYPE=&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0&BNN=0&YTH=0&YCD=0&residentCode=&familianumerosa=&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES#!/availability";
      let returnData = CommonsUtilService.getProcess();
      expect(returnData).toEqual("booking");
    });
  });
  describe("when getDeviceType is called and deviceType is not a mobile,", () => {
    it("deviceType should be equals to desktop", () => {
      var returnDeviceType;
      fakeSessionStorage.set("channel", "desktop");
      fakeWindow.innerWidth = 1026;
      returnDeviceType = CommonsUtilService.getDeviceType();
      expect(returnDeviceType).toBe("desktop");
    });
    it("deviceType should be equals to tablet", () => {
      var returnDeviceType;
      fakeSessionStorage.set("channel", "tablet");
      fakeWindow.innerWidth = 500;
      returnDeviceType = CommonsUtilService.getDeviceType();
      expect(returnDeviceType).toBe("tablet");
    });
    it("deviceType should be equals to mobile", () => {
      var returnDeviceType;
      fakeSessionStorage.set("channel", "mobile");
      fakeWindow.innerWidth = 400;
      returnDeviceType = CommonsUtilService.getDeviceType();
      expect(returnDeviceType).toBe("mobile");
    });
  });
  describe("when getDeviceType is called and deviceType is a mobile, ", () => {
    it("deviceType should be equals to mobile", () => {
      var returnDeviceType;
      fakeSessionStorage.set("channel", "mobi");
      returnDeviceType = CommonsUtilService.getDeviceType();
      expect(returnDeviceType).toBe("mobile");
    });
  });
  describe("when keydownInput is called, ", () => {
    it("it will return an object with custom attributes", () => {
      let returnData = CommonsUtilService.keydownInput({});
      expect(returnData.onblur).toBeFalse();
      expect(returnData.keydown).toBeTrue();
      expect(returnData.dynamicError).toBeFalse();
      expect(returnData.importError).toBeFalse();
    });
  });
  describe("when resetFields is called, ", () => {
    it("it will return an object with custom attributes", () => {
      let returnData = CommonsUtilService.resetFields({});
      expect(returnData.onblur).toBeFalse();
      expect(returnData.dynamicPrice).toBeNull();
      expect(returnData.keydown).toBeFalse();
      expect(returnData.focused).toBeFalse();
      expect(returnData.customPrice).toBeNull();
      expect(returnData.dynamicError).toBeFalse();
      expect(returnData.importError).toBeFalse();
    });
  });
  describe("when isMobile is called, ", () => {
    it("it will return an object with custom attributes", () => {
      fakeWindow.innerWidth = 600;
      let returnData = CommonsUtilService.isMobile({});
      expect(returnData.general).toBeTrue();
      expect(returnData.header).toBeTrue();
    });
  });
  xdescribe("when getEndpoint is called, ", () => {
    it("it will return a concrete endpoint stored in localStorage", () => {
      fakeSessionStorage.set("endpoints", [{}]);
      let returnData = CommonsUtilService.getEndpoint("1");
      expect(returnData).toEqual({});
    });
  });
  describe("when getSegmentDetailsById is called, ", () => {
    it("it will return segments info according to an id ", () => {
      let slices = [
        {
          segments: [
            {
              id: "id",
              departure: "MAD",
              arrival: "BCN",
            },
          ],
        },
      ];
      let returnData = CommonsUtilService.getSegmentDetailsById("id", slices);
      expect(returnData).toEqual({ origin: "MAD", arrival: "BCN" });
    });
  });
  describe("when getSegmentsInfo is called, ", () => {
    it("it will return segments info according to an id ", () => {
      fakeSessionStorage.clear();
      fakeSessionStorage.set("bookingInfo", mockBookingInfo);
      let returnData = CommonsUtilService.getSegmentsInfo();
      expect(returnData[0]).toEqual({
        id: "1",
        origin: { description: "Barajas", code: "MAD" },
        destination: { description: "El Prat", code: "BCN" },
      });
      expect(returnData[1]).toEqual({
        id: "2",
        origin: { description: "El Prat", code: "BCN" },
        destination: { description: "Barajas", code: "MAD" },
      });
      expect(returnData[2]).toEqual({
        id: "3",
        origin: { description: "El Prat", code: "BCN" },
        destination: { description: "Barajas", code: "MAD" },
      });
    });
  });
  describe("when getSliceDetailsById is called, ", () => {
    it("it will return an empty object", () => {
      let returnData = CommonsUtilService.getSliceDetailsById();
      expect(returnData).toEqual({});
    });
  });
  describe("when getTierLevelByToken is called", () => {
    beforeEach(inject(() => {
      fakeSessionStorage.clear();
    }));
    xit("and user is logged, it will return an tierLevel object", () => {
      fakeSessionStorage.set("loggedToken", "ROLE_IBCARD_token.token1");
      let returnData = CommonsUtilService.getTierLevelByToken();
      expect(returnData).toEqual({});
    });
    it("and user is not logged, it will return an tierLevel object", () => {
      fakeSessionStorage.set("loggedToken", null);
      let returnData = CommonsUtilService.getTierLevelByToken();
      expect(returnData).toEqual(null);
    });
  });
  describe("when getUserTypeByToken is called", () => {
    beforeEach(inject(() => {
      fakeSessionStorage.clear();
    }));
    xit("and user is logged, it will return an userType object", () => {
      fakeSessionStorage.set("loggedToken", "ROLE_IBCARD_token.token1");
      let returnData = CommonsUtilService.getUserTypeByToken();
      expect(returnData).toEqual({});
    });
    it("and user is not logged, it will return an userType object", () => {
      fakeSessionStorage.set("loggedToken", null);
      let returnData = CommonsUtilService.getUserTypeByToken();
      expect(returnData).toEqual(undefined);
    });
  });
  describe("when getFFUser is called", () => {
    it("and user is logged, it will return an FF string", () => {
      fakeCommonsUserUtilsService.getFrequentFlyer = jasmine
        .createSpy("getCustomerData")
        .and.returnValue("logged");
      fakeCommonsUserUtilsService.isSoftUser = jasmine
        .createSpy("getCustomerData")
        .and.returnValue(true);
      let returnData = CommonsUtilService.getFFUser();
      expect(returnData).toEqual("logged");
    });
    it("and user is not logged, it will return an NOT_FOUND string", () => {
      fakeCommonsUserUtilsService.getFrequentFlyer = jasmine
        .createSpy("getCustomerData")
        .and.returnValue("NOT_FOUND");
      let returnData = CommonsUtilService.getFFUser();
      expect(returnData).toEqual("NOT_FOUND");
    });
  });
  describe("when getMemberIdFromCookie is called,", () => {
    it(" it will return getFrequentFlyerFromToken return value", () => {
      fakeIbCTokenUtilsService.getFrequentFlyerFromToken = jasmine
        .createSpy("getFrequentFlyerFromToken")
        .and.returnValue("getFrequentFlyerFromToken");
      let returnData = CommonsUtilService.getMemberIdFromCookie();
      expect(returnData).toEqual("getFrequentFlyerFromToken");
    });
  });
  describe("when getMemberIdByToken is called,", () => {
    it(" it will return getFrequentFlyerFromToken return value", () => {
      fakeIbCTokenUtilsService.getFrequentFlyerFromToken = jasmine
        .createSpy("getFrequentFlyerFromToken")
        .and.returnValue("getFrequentFlyerFromToken");
      let returnData = CommonsUtilService.getMemberIdByToken();
      expect(returnData).toEqual("getFrequentFlyerFromToken");
    });
  });
  describe("when getMemberId is called,", () => {
    it(" it will return getFrequentFlyer return value", () => {
      fakeCommonsUserUtilsService.getFrequentFlyer = jasmine
        .createSpy("getFrequentFlyer")
        .and.returnValue("getFrequentFlyer");
      let returnData = CommonsUtilService.getMemberId();
      expect(returnData).toEqual("getFrequentFlyer");
    });
  });
  describe("when getAviosInfo is called", () => {
    it(" and it is reward, it will return your totalAvios reward", () => {
      const accountsData = [
        {
          type: "REWARD",
          balance: {
            amount: 0,
          },
        },
      ];
      let returnData = CommonsUtilService.getAviosInfo(accountsData);
      expect(returnData).toEqual(0);
    });
    it(" and it is reward, it will return your totalAvios loan", () => {
      let accountsData = [
        {
          accountType: "LOAN",
          balance: {
            amount: 0,
          },
          outstandingLoan: {
            amount: 2,
          },
        },
        {
          type: "REWARD",
          balance: {
            amount: 2,
          },
        },
      ];
      let returnData = CommonsUtilService.getAviosInfo(accountsData);
      expect(returnData).toEqual(2);
    });
  });
  describe("when getModelCustomerData is called,", () => {
    it(" it will return customer data model", () => {
      const loginData = [
        {
          memberPersonalDetails: {
            schemes: [{ recognitionLevel: { recognitionLevelIdentifier: {} } }],
            identifier: "id",
            person: {
              personName: {
                firstName: "nombre",
                familyName: "apellido1",
                secondFamilyName: "apellido2",
              },
              gender: "male",
              emailAddress: { email: "email" },
            },
            otherStatuses: { isRedemptionEnabled: false },
          },
          accounts: {},
          partners: {},
        },
      ];
      let returnData = CommonsUtilService.getModelCustomerData(loginData);
      expect(returnData.generalInfo).toEqual({
        category: {},
        avios: 0,
        aviosTransformed: null,
        hashEID: null,
      });
      expect(returnData.personalInfo).toEqual({
        ibPlusNumber: "id",
        name: "nombre",
        surname1: "apellido1",
        surname2: "apellido2",
        gender: "male",
        contactEmail: "email",
        telecomAddresses: {},
        alarms: [
          { number: 1, params: ["25"] },
          { number: 5, params: ["DEVOLUCIONES DE CORREO", "20/02/2020"] },
          { number: 7, params: [] },
        ],
      });
      expect(returnData.beneficiaries).toEqual({ ibPlusNumber: "id" });
      expect(returnData.largeFamilyInfo).toEqual({
        category: null,
        docNumber: null,
        zipCode: null,
      });
      expect(returnData.residentInfo).toEqual({ area: -1 });
      expect(returnData.acceptedTermsAndConditions).toBeFalse();
      expect(returnData.otherStatuses).toEqual({ isRedemptionEnabled: false });
      expect(returnData.partners).toEqual({});
    });
  });
  describe("when getModelIbCustomerData is called,", () => {
    it(" it will return customer data model", () => {
      const loginData = [
        {
          name: "nombre",
          lastName: "apellido",
          gender: "male",
        },
        {
          email: "email",
          phone: { number: 569885, prefix: "+34" },
        },
      ];
      let returnData = CommonsUtilService.getModelIbCustomerData(loginData);
      expect(returnData.generalInfo).toEqual({ hashEID: null });
      expect(returnData.personalInfo).toEqual({
        name: "nombre",
        surname1: "apellido",
        gender: "male",
        contactEmail: "email",
        telecomAddresses: {
          deviceType: "MOBILE",
          type: "PERSONAL",
          preferenceIndicator: true,
          number: 569885,
          countryDiallingCode: "+34",
        },
        alarms: [
          { number: 1, params: ["25"] },
          { number: 5, params: ["DEVOLUCIONES DE CORREO", "20/02/2020"] },
          { number: 7, params: [] },
        ],
      });
      expect(returnData.largeFamilyInfo).toEqual({
        category: null,
        docNumber: null,
        zipCode: null,
      });
      expect(returnData.residentInfo).toEqual({ area: -1 });
      expect(returnData.acceptedTermsAndConditions).toBeFalse();
    });
  });
  describe("when removeLoggedInfo is called,", () => {
    it(" it will remove session storage values associated with logged users", () => {
      let returnData = CommonsUtilService.removeLoggedInfo();
      expect(fakeSessionStorage.get("benefits")).toEqual(null);
      expect(fakeSessionStorage.get("userLogged")).toEqual(null);
    });
  });
  describe("when getFareIcon is called,", () => {
    it(" and id is CABINA, it will return its pertinent icon", () => {
      let returnData = CommonsUtilService.getFareIcon("CABINA");
      expect(returnData).toEqual("icon-navegador_avion");
    });
    it(" and id is EQMANO, it will return its pertinent icon", () => {
      let returnData = CommonsUtilService.getFareIcon("EQMANO");
      expect(returnData).toEqual("icon-e_equipaje");
    });
    it(" and id is EQBODEGA, it will return its pertinent icon", () => {
      let returnData = CommonsUtilService.getFareIcon("EQBODEGA");
      expect(returnData).toEqual("icon-e_equipaje_facturado");
    });
    it(" and id is ASIENTO, it will return its pertinent icon", () => {
      let returnData = CommonsUtilService.getFareIcon("ASIENTO");
      expect(returnData).toEqual("icon-asiento");
    });
    it(" and id is ASIENTOXL, it will return its pertinent icon", () => {
      let returnData = CommonsUtilService.getFareIcon("ASIENTOXL");
      expect(returnData).toEqual("icon-asiento-plus");
    });
    it(" and id is CAMBIO, it will return its pertinent icon", () => {
      let returnData = CommonsUtilService.getFareIcon("CAMBIO");
      expect(returnData).toEqual("icon-cambios_y_reembolsos");
    });
    it(" and id is REEMBOLSO, it will return its pertinent icon", () => {
      let returnData = CommonsUtilService.getFareIcon("REEMBOLSO");
      expect(returnData).toEqual("icon-reembolsos");
    });
    it(" and id is CHECKINDESK, it will return its pertinent icon", () => {
      let returnData = CommonsUtilService.getFareIcon("CHECKINDESK");
      expect(returnData).toEqual("icon-check_in");
    });
    it(" and id is SALAVIP, it will return its pertinent icon", () => {
      let returnData = CommonsUtilService.getFareIcon("SALAVIP");
      expect(returnData).toEqual("icon-sala_vip");
    });
    it(" and id is FASTTRACK, it will return its pertinent icon", () => {
      let returnData = CommonsUtilService.getFareIcon("FASTTRACK");
      expect(returnData).toEqual("icon-fast_track");
    });
    it(" and id is TARJEMBANTIC, it will return its pertinent icon", () => {
      let returnData = CommonsUtilService.getFareIcon("TARJEMBANTIC");
      expect(returnData).toEqual("icon-tarjeta_de_embarque");
    });
    it(" and id is EQPPRIOR, it will return its pertinent icon", () => {
      let returnData = CommonsUtilService.getFareIcon("EQPPRIOR");
      expect(returnData).toEqual("icon-e_facturacion_prioritaria");
    });
    it(" and id is COMIDA, it will return its pertinent icon", () => {
      let returnData = CommonsUtilService.getFareIcon("COMIDA");
      expect(returnData).toEqual("icon-c_comidas_nuevas");
    });
    it(" and id is EMBARQUE, it will return its pertinent icon", () => {
      let returnData = CommonsUtilService.getFareIcon("EMBARQUE");
      expect(returnData).toEqual("icon-priority-boarding");
    });
  });
  describe("when fiterTextOptionOnhold is called", () => {
    it("and maxFreeTime is 0, it will return the price condition", () => {
      const onHoldInfo = {
        maxFreeTime: 0,
        moreTimePrice: 0,
        holdTimes: [1, 2, 3, 4],
      };
      fakeSessionStorage.set("onHoldShowInfo", onHoldInfo);
      let returnData = CommonsUtilService.fiterTextOptionOnhold();
      expect(returnData).toEqual({ modalText: "Translated Text" });
    });
    it("and moreTimePrice is 0, it will return free condition price", () => {
      const onHoldInfo = {
        maxFreeTime: 1,
        moreTimePrice: 0,
        holdTimes: [1, 2, 3, 4],
      };
      fakeSessionStorage.set("onHoldShowInfo", onHoldInfo);
      let returnData = CommonsUtilService.fiterTextOptionOnhold();
      expect(returnData).toEqual({ modalText: "Translated Text" });
    });
    describe('when getModelCustomerData is called,', () => {
        it(' it will return customer data model', () => {
            const loginData = [{
                memberPersonalDetails: {
                    schemes:[{recognitionLevel:{recognitionLevelIdentifier:{}}}],
                    identifier:'id',
                    person: {personName:{firstName:'nombre', familyName:'apellido1', secondFamilyName: 'apellido2'}, gender: 'male', emailAddress:{email:'email'}},
                    otherStatuses: {isRedemptionEnabled:false}
                },
                accounts: {},
                partners:{}
            }];
            let returnData = CommonsUtilService.getModelCustomerData(loginData);
            expect(returnData.generalInfo).toEqual({category:{}, avios: 0, aviosTransformed: null, hashEID: null});
            expect(returnData.personalInfo).toEqual({ibPlusNumber:'id', name:'nombre', surname1:'apellido1', surname2:'apellido2', gender: 'male', contactEmail: 'email', telecomAddresses: {}, alarms: [{number:1, params: ['25']}, {number:5, params: ['DEVOLUCIONES DE CORREO', '20/02/2020']}, {number: 7, params: []}]});
            expect(returnData.beneficiaries).toEqual({ibPlusNumber: 'id'});
            expect(returnData.largeFamilyInfo).toEqual({category: null, docNumber: null, zipCode: null});
            expect(returnData.residentInfo).toEqual({area: -1});
            expect(returnData.acceptedTermsAndConditions).toBeFalse();
            expect(returnData.otherStatuses).toEqual({isRedemptionEnabled: false});
            expect(returnData.partners).toEqual({});
        });
    });
  });
  describe("when translateTextAndAddVariable is called,", () => {
    it(" it will return a translate text with a replaced variable", () => {
      let returnData = CommonsUtilService.translateTextAndAddVariable(
        "prueba",
        "hola",
        "e",
      );
      expect(returnData).toEqual("Translatholad Text");
    });
  });
  describe("when translateTextAndAddVariablesArray is called,", () => {
    it(" it will return a translate text with replaced variables", () => {
      let returnData = CommonsUtilService.translateTextAndAddVariablesArray(
        "prueba",
        ["hola", "x"],
        ["e", "T"],
      );
      expect(returnData).toEqual("xranslatholad Text");
    });
  });
  describe("when setTitlePage is called,", () => {
    it(" it will set the title page ", () => {
      let returnData = CommonsUtilService.setTitlePage("prueba");
      expect(fakeWindow.document.title).toEqual("Translated Text");
    });
  });
  describe('when getFareIcon is called,', () => {
      it(' and id is CABINA, it will return its pertinent icon', () => {
          let returnData = CommonsUtilService.getFareIcon('CABINA');
          expect(returnData).toEqual('icon-navegador_avion');
      });
      it(' and id is EQMANO, it will return its pertinent icon', () => {
          let returnData = CommonsUtilService.getFareIcon('EQMANO');
          expect(returnData).toEqual('icon-e_equipaje');
      });
      it(' and id is EQBODEGA, it will return its pertinent icon', () => {
          let returnData = CommonsUtilService.getFareIcon('EQBODEGA');
          expect(returnData).toEqual('icon-e_equipaje_facturado');
      });
      it(' and id is ASIENTO, it will return its pertinent icon', () => {
          let returnData = CommonsUtilService.getFareIcon('ASIENTO');
          expect(returnData).toEqual('icon-asiento');
      });
      it(' and id is ASIENTO24H, it will return its pertinent icon', () => {
          let returnData = CommonsUtilService.getFareIcon('ASIENTO24H');
          expect(returnData).toEqual('icon-asiento');
      });
      it(' and id is ASIENTOXL, it will return its pertinent icon', () => {
          let returnData = CommonsUtilService.getFareIcon('ASIENTOXL');
          expect(returnData).toEqual('icon-asiento-plus');
      });
      it(' and id is CAMBIO, it will return its pertinent icon', () => {
          let returnData = CommonsUtilService.getFareIcon('CAMBIO');
          expect(returnData).toEqual('icon-cambios_y_reembolsos');
      });
      it(' and id is REEMBOLSO, it will return its pertinent icon', () => {
          let returnData = CommonsUtilService.getFareIcon('REEMBOLSO');
          expect(returnData).toEqual('icon-reembolsos');
      });
      it(' and id is CHECKINDESK, it will return its pertinent icon', () => {
          let returnData = CommonsUtilService.getFareIcon('CHECKINDESK');
          expect(returnData).toEqual('icon-check_in');
      });
      it(' and id is SALAVIP, it will return its pertinent icon', () => {
          let returnData = CommonsUtilService.getFareIcon('SALAVIP');
          expect(returnData).toEqual('icon-sala_vip');
      });
      it(' and id is FASTTRACK, it will return its pertinent icon', () => {
          let returnData = CommonsUtilService.getFareIcon('FASTTRACK');
          expect(returnData).toEqual('icon-fast_track');
      });
      it(' and id is TARJEMBANTIC, it will return its pertinent icon', () => {
          let returnData = CommonsUtilService.getFareIcon('TARJEMBANTIC');
          expect(returnData).toEqual('icon-tarjeta_de_embarque');
      });
      it(' and id is EQPPRIOR, it will return its pertinent icon', () => {
          let returnData = CommonsUtilService.getFareIcon('EQPPRIOR');
          expect(returnData).toEqual('icon-e_facturacion_prioritaria');
      });
      it(' and id is COMIDA, it will return its pertinent icon', () => {
          let returnData = CommonsUtilService.getFareIcon('COMIDA');
          expect(returnData).toEqual('icon-c_comidas_nuevas');
      });
      it(' and id is EMBARQUE, it will return its pertinent icon', () => {
          let returnData = CommonsUtilService.getFareIcon('EMBARQUE');
          expect(returnData).toEqual('icon-priority-boarding');
      });
  });
  describe("when isAvailableLightBox is called,", () => {
    it(" it will return if is available to use a light box", () => {
      fakeWindow.innerWidth = 1000;
      rootScope.isRedemptionFlow = false;
      fakeSessionStorage.set("OnholdLightBoxShowed", false);
      fakeSessionStorage.set("activeLightBoxOnHold", true);
      fakeSessionStorage.set("actualStepFlow", "ibpurc");
      fakeSessionStorage.set("flowApp", "BBKI");
      fakeSessionStorage.set("fareData", { offers: [{ onHoldOptions: [{}] }] });
      let returnData = CommonsUtilService.isAvailableLightBox();
      expect(returnData).toBeTrue();
    });
  });
  describe("when getFormatedDate is called,", () => {
    it(" it will return the format date from the user language", () => {
      rootScope.appLang = "ES";
      rootScope.isRedemptionFlow = false;
      fakeSessionStorage.set("commercialData", {
        languages: [{ code: "ES", dateFormat: ["Spain"] }],
      });
      let returnData = CommonsUtilService.getFormatedDate();
      expect(returnData).toEqual({
        formatedDate: "Mar 10, 2020",
        dateFormatByLanguage: null,
      });
    });
  });
  describe("when hasDefaultOption is called,", () => {
    it(" it will return if an array has default option at his first position", () => {
      let returnData = CommonsUtilService.hasDefaultOption("opcion", [
        "opcion",
      ]);
      expect(returnData).toEqual(true);
    });
  });
  describe("when isDiscountTypePartnerEquivalent is called,", () => {
    it(" it will return a boolean depedending on  discountype is DUMBO or PLUTO", () => {
      let returnData =
        CommonsUtilService.isDiscountTypePartnerEquivalent("noEsPlutoNiDumbo");
      expect(returnData).toEqual(false);
    });
  });
  describe("when getTypeSearch is called", () => {
    it("and is Premium Cabin, it will return fareType according to typeSearch", () => {
      fakeWindow.location.href =
        "https://pree.iberia.es/flights/?market=ES&language=en&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=false&TRIP_TYPE=1&BEGIN_CITY_01=GRX&END_CITY_01=MAD&BEGIN_DAY_01=12&BEGIN_MONTH_01=202303&BEGIN_YEAR_01=2023&END_DAY_01=0&END_MONTH_01=00&END_YEAR_01=0&FARE_TYPE=B&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0&BNN=0&YTH=0&YCD=0&residentCode=&familianumerosa=&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES&flashOffer=true&flashOfferId=ESGRXMAD15022300001203230920#!/availability";
      let returnData = CommonsUtilService.getTypeSearch(true);
      expect(returnData).toEqual("Cabinas premium");
    });
    it("and is LowCost, it will return fareType according to typeSearch", () => {
      fakeWindow.location.href =
        "https://pree.iberia.es/flights/?market=ES&language=en&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=false&TRIP_TYPE=1&BEGIN_CITY_01=GRX&END_CITY_01=MAD&BEGIN_DAY_01=12&BEGIN_MONTH_01=202303&BEGIN_YEAR_01=2023&END_DAY_01=0&END_MONTH_01=00&END_YEAR_01=0&FARE_TYPE=R&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0&BNN=0&YTH=0&YCD=0&residentCode=&familianumerosa=&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES&flashOffer=true&flashOfferId=ESGRXMAD15022300001203230920#!/availability";
      let returnData = CommonsUtilService.getTypeSearch(true);
      expect(returnData).toEqual("Tarifa mas economica");
    });
    it("and is Flexible, it will return fareType according to typeSearch", () => {
      fakeWindow.location.href =
        "https://pree.iberia.es/flights/?market=ES&language=en&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=false&TRIP_TYPE=1&BEGIN_CITY_01=GRX&END_CITY_01=MAD&BEGIN_DAY_01=12&BEGIN_MONTH_01=202303&BEGIN_YEAR_01=2023&END_DAY_01=0&END_MONTH_01=00&END_YEAR_01=0&FARE_TYPE=N&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0&BNN=0&YTH=0&YCD=0&residentCode=&familianumerosa=&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES&flashOffer=true&flashOfferId=ESGRXMAD15022300001203230920#!/availability";
      let returnData = CommonsUtilService.getTypeSearch(true);
      expect(returnData).toEqual("Tarifas flexibles");
    });
    it("and is Tourist, it will return fareType according to typeSearch", () => {
      fakeWindow.location.href =
        "https://pree.iberia.es/flights/?market=ES&language=en&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=false&TRIP_TYPE=1&BEGIN_CITY_01=GRX&END_CITY_01=MAD&BEGIN_DAY_01=12&BEGIN_MONTH_01=202303&BEGIN_YEAR_01=2023&END_DAY_01=0&END_MONTH_01=00&END_YEAR_01=0&FARE_TYPE=E&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0&BNN=0&YTH=0&YCD=0&residentCode=&familianumerosa=&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES&flashOffer=true&flashOfferId=ESGRXMAD15022300001203230920#!/availability";
      let returnData = CommonsUtilService.getTypeSearch(true);
      expect(returnData).toEqual("Turista");
    });
  });
  describe("when getIdItem is called", () => {
    it(" and it is CKI flow, it will return idItem from slices", () => {
      fakeSessionStorage.set("flowApp", "CKI");
      fakeSessionStorage.set("segmentsInfo", [
        { id: "prueba", origin: { code: "ES" } },
      ]);
      fakeSessionStorage.set("ancillariesSlices", [
        { id: "prueba_hbgi_hvbiu" },
      ]);
      let returnData = CommonsUtilService.getIdItem("noEsPlutoNiDumbo");
      expect(returnData).toEqual("");
    });
    it(" and it is default flow, it will return idItem from slices", () => {
      fakeSessionStorage.set("flowApp", "BKI");
      fakeSessionStorage.set("availabilityRequestData", {
        slices: [{ origin: "MAD", destination: "BCN" }],
      });
      fakeSessionStorage.set("originDestinationMulticity", false);
      let returnData = CommonsUtilService.getIdItem("noEsPlutoNiDumbo");
      expect(returnData).toEqual("MAD-BCN");
    });
  });

  describe("when getBrandItem is called,", () => {
    beforeEach(inject(() => {
      fakeSessionStorage.clear();
      fakeSessionStorage.set("selectedTripInfo", [
        {
          origin: "MAD",
          info: {
            segments: [{ flight: { operationalCarrier: { name: "IBERIA" } } }],
          },
        },
        {
          origin: "BCN",
          info: {
            segments: [{ flight: { operationalCarrier: { name: "IBERIA" } } }],
          },
        },
      ]);
    }));
    it(" it will return operationalCarrier name according to origin ", () => {
      let returnData = CommonsUtilService.getBrandItem("MAD");
      expect(returnData).toEqual("iberia");
    });
    it(" it will return operationalCarrier name according to origin", () => {
      let returnData = CommonsUtilService.getBrandItem("BCN");
      expect(returnData).toEqual("iberia");
    });
  });
  describe("when getSpeqsVariant is called,", () => {
    it(" it will return ski string ", () => {
      let returnData = CommonsUtilService.getSpeqsVariant("SKI_SNOW");
      expect(returnData).toEqual("ski");
    });
    it(" it will return bike string", () => {
      let returnData = CommonsUtilService.getSpeqsVariant("BICYCLE");
      expect(returnData).toEqual("bike");
    });
    it(" it will return golf string", () => {
      let returnData = CommonsUtilService.getSpeqsVariant("GOLF_EQUIPMENT");
      expect(returnData).toEqual("golf");
    });
    it(" it will return empty string", () => {
      let returnData = CommonsUtilService.getSpeqsVariant("");
      expect(returnData).toEqual("");
    });
  });
  describe("when convertDateIntoString is called,", () => {
    it(" it will return a formatted date separated between forward slash ", () => {
      let returnData = CommonsUtilService.convertDateIntoString(
        new Date(2023, 1, 20),
      );
      expect(returnData).toEqual("20/02/2023");
    });
  });
  describe("when getSliceById is called,", () => {
    beforeEach(inject(() => {
      fakeSessionStorage.clear();
      fakeSessionStorage.set("ancillariesInfo", {
        slices: [{ segmentIds: ["id"] }],
      });
    }));
    it(" it will return a slice according to its id", () => {
      let returnData = CommonsUtilService.getSliceById("id");
      expect(returnData).toEqual({ segmentIds: ["id"] });
    });
  });
  describe("when checkIsAddToCart is called,", () => {
    beforeEach(inject(() => {
      fakeSessionStorage.clear();
      fakeSessionStorage.set("addToCart", {
        ecommerce: { items: [{ item_name: "prueba_item" }] },
      });
    }));
    it(" it will return a boolean if addToCart item is the same as itemName", () => {
      let returnData = CommonsUtilService.checkIsAddToCart("prueba_item");
      expect(returnData).toBeTrue();
    });
  });
  describe("when getAppMarket is called,", () => {
    it(" it will return the app market", () => {
      rootScope.appMarket = "ES";
      let returnData = CommonsUtilService.getAppMarket();
      expect(returnData).toEqual("ES");
    });
  });
  describe("when getPrefixFromMarket is called,", () => {
    beforeEach(inject(() => {
      fakeSessionStorage.clear();
      fakeSessionStorage.set("phoneCodeList", [
        { countryCode: "ES", code: "34" },
      ]);
    }));
    it(" it will return the app market", () => {
      rootScope.appMarket = "ES";
      let returnData = CommonsUtilService.getPrefixFromMarket();
      expect(returnData).toEqual({ code: "34", countryCode: "ES" });
    });
  });
  describe("when getCountryCodeFromPrefix is called,", () => {
      beforeEach(inject(() => {
        fakeSessionStorage.clear();
        fakeSessionStorage.set("phoneCodeList", [
          { countryCode: "ES", code: "34" },
        ]);
      }));
      it(" it will return the app market", () => {
        rootScope.appMarket = "ES";
        let returnData = CommonsUtilService.getCountryCodeFromPrefix("34");
        expect(returnData).toEqual("ES");
      });
  });
  describe('when cki booking have one checkin flight (voluntary)', () => {
        beforeEach(inject(() => {
            const reshopConditions = {
                involuntaryChanges: {
                    enabled: false,
                    flowType: 'INVOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []
                },
                voluntaryChanges: {
                    enabled: true,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: [{
                            code: 'SLICE_WITH_CHECKED_SEGMENT',
                            description: 'Importante: si cambias este vuelo, deberás realizar el Check-in del nuevo.'}
                        ]}, {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []}
                    ],
                    warnings: []
                }
            };
            fakeSessionStorage.clear();
            fakeSessionStorage.set('reshopConditions', reshopConditions);
            fakeSessionStorage.set('isActiveDeinvoicing', true);
        }));
        it('checkSpecificWarningCheckOut should return true', () => {
            let result = CommonsUtilService.checkSpecificWarningCheckOut('MADBIO20230615114500');
            expect(result).toBe(true);
        });
    });
    describe('when cki booking have no checkin flights', () => {
        beforeEach(inject(() => {
            const reshopConditions = {
                involuntaryChanges: {
                    enabled: false,
                    flowType: 'INVOLUNTARY',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []
                },
                voluntaryChanges: {
                    enabled: true,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: []}, 
                    {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []}
                    ],
                    warnings: []
                }
            };
            fakeSessionStorage.clear();
            fakeSessionStorage.set('reshopConditions', reshopConditions);
            fakeSessionStorage.set('isActiveDeinvoicing', true);
        }));
        it('checkSpecificWarningCheckOut should return false', () => {
            let result = CommonsUtilService.checkSpecificWarningCheckOut('MADBIO20230615114500');
            expect(result).toBe(false);
        });
    });
    describe('when cki booking have one checkin flight (involuntary)', () => {
        beforeEach(inject(() => {
            const reshopConditions = {
                voluntaryChanges: {
                    enabled: false,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []},
                involuntaryChanges: {
                    enabled: true,
                    flowType: 'INVOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: [{
                            code: 'SLICE_WITH_CHECKED_SEGMENT',
                            description: 'Importante: si cambias este vuelo, deberás realizar el Check-in del nuevo.'
                        }]
                    },
                    {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []
                    }
                    ],
                    warnings: []
                }
            };
            fakeSessionStorage.clear();
            fakeSessionStorage.set('reshopConditions', reshopConditions);
            fakeSessionStorage.set('isActiveDeinvoicing', true);
        }));
        it('checkSpecificWarningCheckOut should return true', () => {
            let result = CommonsUtilService.checkSpecificWarningCheckOut('MADBIO20230615114500');
            expect(result).toBe(true);
        });
    });
    describe('when ecki booking have checkin flights (involuntary)', () => {
        beforeEach(inject(() => {
            const reshopConditions = {
                voluntaryChanges: {
                    enabled: false,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []},
                involuntaryChanges: {
                    enabled: true,
                    flowType: 'INVOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: []
                    },
                    {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []
                    }
                    ],
                    warnings: [{
                        code: 'ORDER_WITH_EARLY_CHECKING_DONE',
                        description: 'Importante: si cambias este vuelo, deberás realizar el Check-in del nuevo.'
                    }]
                }
            };
            fakeSessionStorage.clear();
            fakeSessionStorage.set('reshopConditions', reshopConditions);
            fakeSessionStorage.set('isActiveDeinvoicing', true);
        }));
        it('checkWarningCheckOut should return true', () => {
            let result = CommonsUtilService.checkWarningCheckOut();
            expect(result).toBe(true);
        });
    });
    describe('when ecki booking have checkin flights (voluntary)', () => {
        beforeEach(inject(() => {
            const reshopConditions = {
                involuntaryChanges: {
                    enabled: false,
                    flowType: 'INVOLUNTARY',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []},
                voluntaryChanges: {
                    enabled: true,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: []
                    },
                    {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []
                    }
                    ],
                    warnings: [{
                        code: 'ORDER_WITH_EARLY_CHECKING_DONE',
                        description: 'Importante: si cambias este vuelo, deberás realizar el Check-in del nuevo.'
                    }]
                }
            };
            fakeSessionStorage.clear();
            fakeSessionStorage.set('reshopConditions', reshopConditions);
            fakeSessionStorage.set('isActiveDeinvoicing', true);
        }));
        it('checkWarningCheckOut should return true', () => {
            let result = CommonsUtilService.checkWarningCheckOut();
            expect(result).toBe(true);
        });
    });
    describe('when ecki booking have one checkin flight (voluntary)', () => {
        beforeEach(inject(() => {
            const reshopConditions = {
                involuntaryChanges: {
                    enabled: false,
                    flowType: 'INVOLUNTARY',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []},
                voluntaryChanges: {
                    enabled: true,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: [{
                            code: 'ORDER_WITH_EARLY_CHECKING_DONE',
                            description: 'Importante: si cambias este vuelo, deberás realizar el Check-in del nuevo.'
                        }]
                    },
                    {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []
                    }
                    ],
                    warnings: []
                }
            };
            fakeSessionStorage.clear();
            fakeSessionStorage.set('reshopConditions', reshopConditions);
            fakeSessionStorage.set('isActiveDeinvoicing', true);
        }));
        it('checkWarningCheckOut should return true', () => {
            let result = CommonsUtilService.checkWarningCheckOut();
            expect(result).toBe(true);
        });
    });
    describe('when ecki booking have one checkin flight (involuntary)', () => {
        beforeEach(inject(() => {
            const reshopConditions = {
                voluntaryChanges: {
                    enabled: false,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []},
                involuntaryChanges: {
                    enabled: true,
                    flowType: 'INVOLUNTARY',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: [{
                            code: 'ORDER_WITH_EARLY_CHECKING_DONE',
                            description: 'Importante: si cambias este vuelo, deberás realizar el Check-in del nuevo.'
                        }]
                    },
                    {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []
                    }
                    ],
                    warnings: []
                }
            };
            fakeSessionStorage.clear();
            fakeSessionStorage.set('reshopConditions', reshopConditions);
            fakeSessionStorage.set('isActiveDeinvoicing', true);
        }));
        it('checkWarningCheckOut should return true', () => {
            let result = CommonsUtilService.checkWarningCheckOut();
            expect(result).toBe(true);
        });
    });
    describe('when booking have no reshopConditions', () => {
        beforeEach(inject(() => {
            const reshopConditions = undefined;
            fakeSessionStorage.clear();
            fakeSessionStorage.set('reshopConditions', reshopConditions);
            fakeSessionStorage.set('isActiveDeinvoicing', true);
        }));
        it('checkSpecificWarningCheckOut should return false', () => {
            let result = CommonsUtilService.checkSpecificWarningCheckOut();
            expect(result).toBe(false);
        });
        it('checkWarningCheckOut should return false', () => {
            let result = CommonsUtilService.checkWarningCheckOut();
            expect(result).toBe(false);
        });
    });
});
