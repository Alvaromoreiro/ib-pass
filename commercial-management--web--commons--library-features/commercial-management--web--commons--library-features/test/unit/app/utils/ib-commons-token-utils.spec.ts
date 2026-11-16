import { TestBed } from "@angular/core/testing";
import {
  IbCTokenUtilsService,
  CommonsSessionStorageService,
  CommonsBrowserStorageService,
  AJSRootScope,
  CommonsCookiesService,
} from "ib-web-commons/utils";
import {
  CommonsConstants,
  CommonsHttpServicesConstants,
} from "ib-web-commons/constants";
import { JWTAccessTokenInformation } from "ib-web-commons/models";

describe("IbCTokenUtilsService", () => {
  let service: IbCTokenUtilsService;
  let spySessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
  let spyCommonsBrowserStorageService: jasmine.SpyObj<CommonsBrowserStorageService>;
  let spyCookiesService: jasmine.SpyObj<CommonsCookiesService>;

  beforeEach(() => {
    const mockSessionStorageService = jasmine.createSpyObj(
      "CommonsSessionStorageService",
      ["get", "set", "remove"],
    );
    const mockBrowserStorageService = jasmine.createSpyObj(
      "CommonsBrowserStorageService",
      ["get", "set", "remove"],
    );
    const mockRootScope = jasmine.createSpyObj("AJSRootScope", ["$broadcast"]);
    const mockCookiesService = jasmine.createSpyObj("CommonsCookiesService", [
      "get",
      "set",
      "remove",
    ]);

    TestBed.configureTestingModule({
      providers: [
        IbCTokenUtilsService,
        {
          provide: CommonsSessionStorageService,
          useValue: mockSessionStorageService,
        },
        {
          provide: CommonsBrowserStorageService,
          useValue: mockBrowserStorageService,
        },
        { provide: CommonsCookiesService, useValue: mockCookiesService },
        { provide: AJSRootScope, useValue: mockRootScope },
      ],
    });
    service = TestBed.inject(IbCTokenUtilsService);
    spySessionStorageService = TestBed.inject(
      CommonsSessionStorageService,
    ) as jasmine.SpyObj<CommonsSessionStorageService>;
    spyCommonsBrowserStorageService = TestBed.inject(
      CommonsBrowserStorageService,
    ) as jasmine.SpyObj<CommonsBrowserStorageService>;
    spyCookiesService = TestBed.inject(
      CommonsCookiesService,
    ) as jasmine.SpyObj<CommonsCookiesService>;
  });

  describe("#getFrequentFlyerFromToken ", () => {
    it("should return frequent flyer from logged token", () => {
      spyCookiesService.get.and.returnValue(
        "eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIxMzY2YjdjNS0zN2ZhLTQ1NmEtODg0OS1lODMzM2Q2OGE5ODkiLCJleHAiOjE2NjA3NjgxMTQsIm5iZiI6MCwiaWF0IjoxNjYwNzY3MjE0LCJpc3MiOiJodHRwOi8vYXV0aC1pYmlzdWF0Yi5jb3JwLmliZXJpYS5lcy9hdXRoL3JlYWxtcy9jb21tZXJjaWFsX3BsYXRmb3JtIiwiYXVkIjoiaWJlcmlhX3dlYiIsInN1YiI6IjAwMDAwMDA4ODk3MTgzIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaWJlcmlhX3dlYiIsInNlc3Npb25fc3RhdGUiOiJiNjY4MGVhYS1iMjk5LTQ0ZjItYmU0Yy0zOTEwZDFiODY3YTciLCJjbGllbnRfc2Vzc2lvbiI6Ijg2YzZiNGZmLWM5YTctNGM4ZC05YzYyLTc0MzgyMWMxMDRlOCIsImFsbG93ZWQtb3JpZ2lucyI6W10sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJST0xFX0NNX0NMQUlNUyIsInNvZnRfdXNlciIsIlJPTEVfTUVNQkVSIiwiUk9MRV9PUk0iLCJST0xFX1BNVCIsIlJPTEVfT1JTIiwiUk9MRV9CUE0iLCJST0xFX0FWTSIsIlJPTEVfSUJFUklBX1BMVVMiLCJST0xFX0xPQyIsIlJPTEVfQVZDIiwiUk9MRV9BRFZNIiwiUk9MRV9IT01FIiwiUk9MRV9NRU1CRVJfQVNTT0NJQVRFIiwiUk9MRV9JRENfR0VUX0lERU5USUZJRVJTIiwiUk9MRV9PV0NBUkRfU0FQUEhJUkUiLCJST0xFX0NVU1QiLCJST0xFX0lEQ19TRUFSQ0hfQ1VTVE9NRVJfU0EiLCJST0xFX1BBQ0MiLCJST0xFX01FTUJFUl9BQ0NPVU5UUyIsIlJPTEVfQ1JZUFRPX01BTkFHRVIiLCJST0xFX01FTUJFUl9QRVJNSVNTSU9OUyIsIlJPTEVfU0ZNIiwiUk9MRV9TRUFUUyIsIlJPTEVfQVBJTSIsIlJPTEVfQUdMX0NSRURJVF9DVVJSRU5DWSIsIlJPTEVfSUJDQVJEX0lORklOSVRBUFJJTUUiLCJST0xFX0ZPRkYiLCJST0xFX0JJT01FVFJJQyIsIlJPTEVfRkFWTCIsIlJPTEVfTFBNIiwiUk9MRV9TQUwiLCJST0xFX0ZNIiwiUk9MRV9VU0VSIiwiUk9MRV9QUk0iLCJST0xFX01FTUJFUl9JTlZJVEFUSU9OIiwiUk9MRV9DSEFOTkVMX0FEQVBURVIiLCJST0xFX0ZBU1MiLCJST0xFX0FHTF9DUkVESVRfVFJBTlNBQ1RJT04iLCJST0xFX1NSViJdfSwicmVzb3VyY2VfYWNjZXNzIjp7fSwibmFtZSI6IiIsInByZWZlcnJlZF91c2VybmFtZSI6IjAwMDAwMDA4ODk3MTgzIn0.fDF5qCRCJek0tORTN3cuQphI3dIE6T8o2uXOy2a3duJVZElaLuM6MuQDJIb5d0MoO_Rf1buxPcg6tek5_V70Tp1LgV7NN9nDbLG3fsZqPxJeINb5vvPOLdELYneqRYG9wJKr6SRWfiNl5Ap6OtOfiKBZl7w2ChWznhKyG_ldYOhfecGwO_c8qL0iiS9T6LBriAn6q8bX9NawGQq-oXNWr8rgIrRUrBloBphzpwS9By-bOoHtxezOXr1l5y-zscpqIhpf1opPnuVkg5BRIPJvM8aI0zGZZv2lziHc-OTTXBQW_EqDrSjH1e3zBTSSZ-edCODJqugDUxxAn1Spl52kRg",
      );
      const result = service.getFrequentFlyerFromToken();
      expect(result).toEqual("00000008897183");
    });
    it("and no token in cookies", () => {
      spyCookiesService.get.and.returnValue(null);
      spySessionStorageService.get.and.returnValue(
        "eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIxMzY2YjdjNS0zN2ZhLTQ1NmEtODg0OS1lODMzM2Q2OGE5ODkiLCJleHAiOjE2NjA3NjgxMTQsIm5iZiI6MCwiaWF0IjoxNjYwNzY3MjE0LCJpc3MiOiJodHRwOi8vYXV0aC1pYmlzdWF0Yi5jb3JwLmliZXJpYS5lcy9hdXRoL3JlYWxtcy9jb21tZXJjaWFsX3BsYXRmb3JtIiwiYXVkIjoiaWJlcmlhX3dlYiIsInN1YiI6IjAwMDAwMDA4ODk3MTgzIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaWJlcmlhX3dlYiIsInNlc3Npb25fc3RhdGUiOiJiNjY4MGVhYS1iMjk5LTQ0ZjItYmU0Yy0zOTEwZDFiODY3YTciLCJjbGllbnRfc2Vzc2lvbiI6Ijg2YzZiNGZmLWM5YTctNGM4ZC05YzYyLTc0MzgyMWMxMDRlOCIsImFsbG93ZWQtb3JpZ2lucyI6W10sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJST0xFX0NNX0NMQUlNUyIsInNvZnRfdXNlciIsIlJPTEVfTUVNQkVSIiwiUk9MRV9PUk0iLCJST0xFX1BNVCIsIlJPTEVfT1JTIiwiUk9MRV9CUE0iLCJST0xFX0FWTSIsIlJPTEVfSUJFUklBX1BMVVMiLCJST0xFX0xPQyIsIlJPTEVfQVZDIiwiUk9MRV9BRFZNIiwiUk9MRV9IT01FIiwiUk9MRV9NRU1CRVJfQVNTT0NJQVRFIiwiUk9MRV9JRENfR0VUX0lERU5USUZJRVJTIiwiUk9MRV9PV0NBUkRfU0FQUEhJUkUiLCJST0xFX0NVU1QiLCJST0xFX0lEQ19TRUFSQ0hfQ1VTVE9NRVJfU0EiLCJST0xFX1BBQ0MiLCJST0xFX01FTUJFUl9BQ0NPVU5UUyIsIlJPTEVfQ1JZUFRPX01BTkFHRVIiLCJST0xFX01FTUJFUl9QRVJNSVNTSU9OUyIsIlJPTEVfU0ZNIiwiUk9MRV9TRUFUUyIsIlJPTEVfQVBJTSIsIlJPTEVfQUdMX0NSRURJVF9DVVJSRU5DWSIsIlJPTEVfSUJDQVJEX0lORklOSVRBUFJJTUUiLCJST0xFX0ZPRkYiLCJST0xFX0JJT01FVFJJQyIsIlJPTEVfRkFWTCIsIlJPTEVfTFBNIiwiUk9MRV9TQUwiLCJST0xFX0ZNIiwiUk9MRV9VU0VSIiwiUk9MRV9QUk0iLCJST0xFX01FTUJFUl9JTlZJVEFUSU9OIiwiUk9MRV9DSEFOTkVMX0FEQVBURVIiLCJST0xFX0ZBU1MiLCJST0xFX0FHTF9DUkVESVRfVFJBTlNBQ1RJT04iLCJST0xFX1NSViJdfSwicmVzb3VyY2VfYWNjZXNzIjp7fSwibmFtZSI6IiIsInByZWZlcnJlZF91c2VybmFtZSI6IjAwMDAwMDA4ODk3MTgzIn0.fDF5qCRCJek0tORTN3cuQphI3dIE6T8o2uXOy2a3duJVZElaLuM6MuQDJIb5d0MoO_Rf1buxPcg6tek5_V70Tp1LgV7NN9nDbLG3fsZqPxJeINb5vvPOLdELYneqRYG9wJKr6SRWfiNl5Ap6OtOfiKBZl7w2ChWznhKyG_ldYOhfecGwO_c8qL0iiS9T6LBriAn6q8bX9NawGQq-oXNWr8rgIrRUrBloBphzpwS9By-bOoHtxezOXr1l5y-zscpqIhpf1opPnuVkg5BRIPJvM8aI0zGZZv2lziHc-OTTXBQW_EqDrSjH1e3zBTSSZ-edCODJqugDUxxAn1Spl52kRg",
      );
      const result = service.getFrequentFlyerFromToken();
      expect(result).toEqual("00000008897183");
    });
    it("and no token, should return null", () => {
      spyCookiesService.get.and.returnValue(null);
      spySessionStorageService.get.and.returnValue(null);
      const result = service.getFrequentFlyerFromToken();
      expect(result).toEqual(null);
    });
  });

  it("#getTokenInformation should return null if no token", () => {
    const result = service.getTokenInformation(null);
    expect(result).toEqual(null);
  });

  it("#deleteLoggedTokens should clean cookies of logged tokens", () => {
    spyCookiesService.remove.and.returnValue();
    service.deleteLoggedTokens();
    expect(spyCookiesService.remove).toHaveBeenCalledTimes(12);
  });

  describe("when #getTierLevelFromToken called", () => {
    it("and token in role, should return tier level", () => {
      spyOn(service, "getAccessTokenInformation").and.returnValue({
        realm_access: {
          roles: ["ROLE_IBCARD_PLATINO"],
        },
      } as JWTAccessTokenInformation);

      const result = service.getTierLevelFromToken();
      expect(result).toEqual("PLATINO");
    });

    it("and no token, should return null", () => {
      spyOn(service, "getAccessTokenInformation").and.returnValue(null);

      const result = service.getTierLevelFromToken();
      expect(result).toEqual(null);
    });
  });
});
