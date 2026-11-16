import angular from "angular";
import { CommonsLanguageAndMarketService } from "src/app/core/utils/ib-commons-language-and-market-service";
describe("Test CommonsLanguageAndMarketService", () => {
  class CookieServiceMock {
    private storage = new Map<string, string>();
    get: (key: string) => string = (key: string) => this.storage.get(key);
    set: (key: string, value: string) => void = (key: string, value: string) =>
      this.storage.set(key, value);
  }
  class CommonsUtilServiceMock {
    //Response
    public url: string = "";
    //Method
    getURLFirstParameterByName = jasmine
      .createSpy("getURLFirstParameterByName")
      .and.callFake((parameters: string[]) => {
        for (const parameter of parameters) {
          const matches = new RegExp(`${parameter}=?(\\w+)`).exec(this.url);
          if (matches && matches.length > 1) {
            return matches[1];
          }
        }
      });
  }
  class MockConstants {
    private CONTANTS_VALUES = {
      COMMONS_CONSTANT: {
        nameParameters: {
          lang: ["language"],
          market: ["market"],
        },
        availableLanguages: [
          "en",
          "es",
          "ls",
          "zh",
          "ca",
          "de",
          "fr",
          "it",
          "pt",
          "ja",
          "nl",
          "ru",
        ],
        defaultLang: "fr",
        defaultMarket: "FR",
        COOKIES: {
          PERSONALIZATION: "IBERIACOM_PERSONALIZATION",
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
        },
      },
    };
    get commonsConstants() {
      return JSON.parse(
        JSON.stringify(this.CONTANTS_VALUES.COMMONS_CONSTANT),
      ) as typeof this.CONTANTS_VALUES.COMMONS_CONSTANT;
    }
  }
  let cookiesService: CookieServiceMock;
  let windowMock: any;
  let commonsUtilService: CommonsUtilServiceMock;
  let service: CommonsLanguageAndMarketService;
  const MockConstantsInstance = new MockConstants();
  beforeEach(() => {
    cookiesService = new CookieServiceMock();
    commonsUtilService = new CommonsUtilServiceMock();
    const commonsConstants = MockConstantsInstance.commonsConstants;
    windowMock = {
      navigator: { language: "fr-ES" },
    };
    angular.mock.module("ib-commons-utils-module", ($provide) => {
      $provide.value("CommonsCookiesService", cookiesService);
      $provide.value("$window", windowMock);
      $provide.value("CommonsUtilService", commonsUtilService);
      $provide.value("CommonsConstants", commonsConstants);
    });
    inject((_CommonsLanguageAndMarketService_) => {
      service = _CommonsLanguageAndMarketService_;
    });
  });

  it("Called without market and locale in URL with personalization cookie", () => {
    const constants = MockConstantsInstance.commonsConstants;
    cookiesService.set(constants.COOKIES.PERSONALIZATION, "DE|FR|ja| | |DE|");
    const result = service.init();
    expect(result).toEqual({ market: "FR", language: "ja" });
  });
  it("Called without market and locale in URL whithout personalization cookie and provide navigator Language", () => {
    windowMock.navigator.language = "en-FR";
    const result = service.init();
    expect(result).toEqual({ market: "FR", language: "en" });
  });
  it("Called with market and language into the URL and return the value provided into the url", () => {
    commonsUtilService.url =
      "https://www.iberia.com/es/es/booking/flight-select?market=DE&language=de";
    const result = service.init();
    expect(result).toEqual({ market: "DE", language: "de" });
  });
  it("Called with several markets parameters and return first matching value according to array order", () => {
    commonsUtilService.url =
      "https://www.iberia.com/es/es/booking/flight-select?market2=DE&market1=FR&market3=PT&language=de";
    const result = service.init(["market1", "market2", "market3"]);
    expect(result).toEqual({ market: "FR", language: "de" });
  });
  it("Called with several languages parameters and return first matching value according to array order", () => {
    commonsUtilService.url =
      "https://www.iberia.com/es/es/booking/flight-select?market2=DE&market1=FR&market3=PT&language3=de&&language1=fr&language2=es";
    const result = service.init(["language1", "language2", "language3"]);
    expect(result).toEqual({ market: "FR", language: "fr" });
  });
});
