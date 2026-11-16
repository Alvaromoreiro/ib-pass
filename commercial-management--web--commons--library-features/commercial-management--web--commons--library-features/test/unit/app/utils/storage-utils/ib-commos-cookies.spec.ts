import { TestBed } from "@angular/core/testing";
import { CommonsCookiesService } from "ib-web-commons/utils";
import { CookieService } from "ngx-cookie-service";
import { BookingFlightSearchInformation } from "ib-web-commons/models";

describe("CommonsCookiesService", () => {
  let service: CommonsCookiesService;
  let spyCookieService: jasmine.SpyObj<CookieService>;

  beforeEach(() => {
    const mockSessionStorageService = jasmine.createSpyObj("CookieService", [
      "get",
      "set",
      "getAll",
      "delete",
      "deleteAll",
    ]);

    TestBed.configureTestingModule({
      providers: [
        CommonsCookiesService,
        { provide: CookieService, useValue: mockSessionStorageService },
      ],
    });
    service = TestBed.inject(CommonsCookiesService);
    spyCookieService = TestBed.inject(
      CookieService,
    ) as jasmine.SpyObj<CookieService>;
  });

  it("#get should call cookie service and return value", () => {
    spyCookieService.get.and.returnValue("TEST");
    const result = service.get("KEY");
    expect(spyCookieService.get).toHaveBeenCalledWith("KEY");
    expect(spyCookieService.get.calls.count()).toEqual(1);
    expect(result).toEqual("TEST");
  });

  it("#getCookie should call cookie service and return value", () => {
    spyCookieService.get.and.returnValue("TEST");
    const result = service.getCookie("KEY");
    expect(spyCookieService.get).toHaveBeenCalledWith("KEY");
    expect(spyCookieService.get.calls.count()).toEqual(1);
    expect(result).toEqual("TEST");
  });

  it("#getAll should call cookie service and return all cookies", () => {
    spyCookieService.getAll.and.returnValue({ a: "b" });
    const result = service.getAll();
    expect(spyCookieService.getAll).toHaveBeenCalledWith();
    expect(spyCookieService.getAll.calls.count()).toEqual(1);
    expect(result).toEqual({ a: "b" });
  });

  it("#set should call cookie service and set a new cookie", () => {
    spyCookieService.set.and.returnValue(null);
    service.set("KEY", "TEST");
    expect(spyCookieService.set).toHaveBeenCalled();
    expect(spyCookieService.set.calls.count()).toEqual(1);
  });

  it("#set should call cookie service and set a new cookie", () => {
    spyCookieService.set.and.returnValue(null);
    service.set("KEY", "TEST", { expires: 10000, path: "/a" });
    expect(spyCookieService.set).toHaveBeenCalled();
    expect(spyCookieService.set.calls.count()).toEqual(1);
  });

  it("#putCookie should call cookie service and set a new cookie", () => {
    spyCookieService.set.and.returnValue(null);
    service.putCookie("KEY", "TEST");
    expect(spyCookieService.set).toHaveBeenCalledWith("KEY", "TEST", {
      expires: undefined,
      path: "/",
    });
    expect(spyCookieService.set.calls.count()).toEqual(1);
  });

  it("#remove should call cookie service and remove cookie", () => {
    spyCookieService.delete.and.returnValue(null);
    service.remove("KEY");
    expect(spyCookieService.delete).toHaveBeenCalledWith(
      "KEY",
      "/",
      undefined,
      undefined,
      undefined,
    );
    expect(spyCookieService.delete.calls.count()).toEqual(1);
  });

  it("#removeAll should call cookie service and remove cookie", () => {
    spyCookieService.deleteAll.and.returnValue(null);
    service.removeAll();
    expect(spyCookieService.deleteAll).toHaveBeenCalledWith(
      "/",
      undefined,
      undefined,
      undefined,
    );
    expect(spyCookieService.deleteAll.calls.count()).toEqual(1);
  });

  describe("#updateCookie,", () => {
    it(",should call cookie service and remove cookie", () => {
      spyCookieService.set.and.returnValue(null);
      service.updateCookie("KEY", "asd", 10, "/");
      expect(spyCookieService.set).toHaveBeenCalled();
      expect(spyCookieService.set.calls.count()).toEqual(1);
    });
  });

  describe("#getCookieParams", () => {
    it(", if no cookie should return null", () => {
      spyCookieService.get.and.returnValue(undefined);

      const result = service.getCookieParams("KEY", "a", false);
      expect(spyCookieService.get).toHaveBeenCalledWith("KEY");
      expect(result).toEqual(null);
    });
  });

  describe("#updateAvailabilitySearchCookies", () => {
    it(", with no passengers and date should call cookie service", () => {
      spyCookieService.get.and.returnValue("MOCKED|TEST");
      spyCookieService.set.and.returnValue(undefined);

      const mockSearchModel: BookingFlightSearchInformation = {
        passengers: undefined,
        payWithAvios: false,
        payWithPoints: false,
        cityOrigin: {
          description: "MOCKED",
          code: "12",
          country: "MOCKED",
        },
        cityDestiny: {
          description: "MOCKED",
          code: "12",
          country: "MOCKED",
        },
        cabinSelected: {
          code: "2",
          description: "MOCKED",
          cabinClass: "MOCKED",
        },
        discountResident: { value: "5", description: "MOCKED" },
        discountFamily: { value: "5", description: "MOCKED" },
        passengersSelected: [],
      };
      service.updateAvailabilitySearchCookies(mockSearchModel);
      expect(spyCookieService.get).toHaveBeenCalledWith(
        "IBERIACOM_LAST_SEARCH",
      );
      expect(spyCookieService.set).toHaveBeenCalled();
    });
    it(", with passengers and date should call cookie service", () => {
      spyCookieService.get.and.returnValue("MOCKED|TEST");
      spyCookieService.set.and.returnValue(undefined);

      const mockSearchModel: BookingFlightSearchInformation = {
        passengers: undefined,
        payWithAvios: false,
        payWithPoints: false,
        cityOrigin: {
          description: "MOCKED",
          code: "12",
          country: "MOCKED",
        },
        cityDestiny: {
          description: "MOCKED",
          code: "12",
          country: "MOCKED",
        },
        cabinSelected: {
          code: "2",
          description: "MOCKED",
          cabinClass: "MOCKED",
        },
        discountResident: { value: "5", description: "MOCKED" },
        discountFamily: { value: "5", description: "MOCKED" },
        passengersSelected: [
          {
            count: 1,
            passengerType: "asd",
            infoAge: "asd",
            minPassenger: 0,
            maxPassengers: 2,
          },
          {
            count: 1,
            passengerType: "asd",
            infoAge: "asd",
            minPassenger: 0,
            maxPassengers: 2,
          },
          {
            count: 1,
            passengerType: "asd",
            infoAge: "asd",
            minPassenger: 0,
            maxPassengers: 2,
          },
        ],
        selectedOutbondDate: new Date(),
        selectedReturnDate: new Date(),
        tripOptionSelected: { code: 2, description: "MOCKED" },
      };
      service.updateAvailabilitySearchCookies(mockSearchModel);
      expect(spyCookieService.get).toHaveBeenCalledWith(
        "IBERIACOM_LAST_SEARCH",
      );
      expect(spyCookieService.set).toHaveBeenCalled();
    });
  });

  describe("#updateCookieValue,", () => {
    it(", if no cookie do nothing", () => {
      spyCookieService.set.and.returnValue(null);
      spyCookieService.get.and.returnValue(undefined);

      service.updateCookieValue(
        "KEY",
        0,
        "testValue",
        "/",
        new Date(new Date().getTime() + 100000),
      );
      expect(spyCookieService.set.calls.count()).toEqual(0);
    });

    it(", if finds the cookie changes the cookie value", () => {
      spyCookieService.set.and.returnValue(null);
      spyCookieService.get.and.returnValue("RETURNED");

      service.updateCookieValue(
        "KEY",
        0,
        "testValue",
        "/",
        new Date(new Date().getTime() + 100000),
      );
      expect(spyCookieService.set).toHaveBeenCalled();
      expect(spyCookieService.set.calls.count()).toEqual(1);
    });
  });
});
