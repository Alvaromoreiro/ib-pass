import { TestBed } from "@angular/core/testing";
import {
  IbCUserUtilsService,
  CommonsSessionStorageService,
  CommonsBrowserStorageService,
  AJSRootScope,
  IbCTokenUtilsService,
} from "ib-web-commons/utils";
import {
  CommonsConstants,
  CommonsHttpServicesConstants,
} from "ib-web-commons/constants";

describe("IbCUserUtilsService", () => {
  let service: IbCUserUtilsService;
  let spySessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
  let spyCommonsBrowserStorageService: jasmine.SpyObj<CommonsBrowserStorageService>;
  const fakeIbCTokenUtilsService = jasmine.createSpyObj<IbCTokenUtilsService>(
    "IbCTokenUtilsService",
    ["deleteLoggedTokens", "getFrequentFlyerFromToken"],
  );

  beforeEach(() => {
    const mockSessionStorageService =
      jasmine.createSpyObj<CommonsSessionStorageService>(
        "CommonsSessionStorageService",
        ["get", "set", "remove"],
      );
    const mockBrowserStorageService =
      jasmine.createSpyObj<CommonsBrowserStorageService>(
        "CommonsBrowserStorageService",
        ["get", "set", "remove"],
      );
    const mockRootScope = jasmine.createSpyObj("AJSRootScope", ["$broadcast"]);

    TestBed.configureTestingModule({
      providers: [
        IbCUserUtilsService,
        {
          provide: CommonsSessionStorageService,
          useValue: mockSessionStorageService,
        },
        {
          provide: CommonsBrowserStorageService,
          useValue: mockBrowserStorageService,
        },
        { provide: IbCTokenUtilsService, useValue: fakeIbCTokenUtilsService },
        { provide: AJSRootScope, useValue: mockRootScope },
      ],
    });
    service = TestBed.inject(IbCUserUtilsService);
    spySessionStorageService = TestBed.inject(
      CommonsSessionStorageService,
    ) as jasmine.SpyObj<CommonsSessionStorageService>;
    spyCommonsBrowserStorageService = TestBed.inject(
      CommonsBrowserStorageService,
    ) as jasmine.SpyObj<CommonsBrowserStorageService>;
  });

  it("#setUserRole should call sessionStorage and save role", () => {
    spySessionStorageService.set.and.returnValue(null);
    service.setUserRole("TEST");
    expect(spySessionStorageService.set).toHaveBeenCalledWith(
      "IberiaUserType",
      "TEST",
    );
    expect(spySessionStorageService.set.calls.count()).toEqual(1);
  });

  it("#removeUserRole should call sessionStorage and remove roles", () => {
    spySessionStorageService.remove.and.returnValue(null);
    service.removeUserRole();
    expect(spySessionStorageService.remove).toHaveBeenCalledWith(
      "IberiaUserType",
    );
    expect(spySessionStorageService.remove.calls.count()).toEqual(1);
  });

  it("#setIbZero should call sessionStorage and set role IbZero", () => {
    spySessionStorageService.set.and.returnValue(null);
    service.setIbZero();
    expect(spySessionStorageService.set).toHaveBeenCalledWith(
      "IberiaUserType",
      CommonsConstants.ROLE_IBERIA,
    );
    expect(spySessionStorageService.set.calls.count()).toEqual(1);
  });

  it("#setIbPlus should call sessionStorage and set role IbPlus", () => {
    spySessionStorageService.set.and.returnValue(null);
    service.setIbPlus();
    expect(spySessionStorageService.set).toHaveBeenCalledWith(
      "IberiaUserType",
      CommonsConstants.ROLE_IBERIA_PLUS,
    );
    expect(spySessionStorageService.set.calls.count()).toEqual(1);
  });

  it("#isIbZero should call sessionStorage and return if is IbZero role", () => {
    spySessionStorageService.get.and.returnValue(CommonsConstants.ROLE_IBERIA);

    const result = service.isIbZero();
    expect(spySessionStorageService.get).toHaveBeenCalledWith("IberiaUserType");
    expect(spySessionStorageService.get.calls.count()).toEqual(1);
    expect(result).toEqual(true);
  });

  it("#isIbPlus should call sessionStorage and return if is IbPlus role", () => {
    spySessionStorageService.get.and.returnValue(
      CommonsConstants.ROLE_IBERIA_PLUS,
    );

    const result = service.isIbPlus();
    expect(spySessionStorageService.get).toHaveBeenCalledWith("IberiaUserType");
    expect(spySessionStorageService.get.calls.count()).toEqual(1);
    expect(result).toEqual(true);
  });

  it("#setSoftUser should call localStorage and set user as softUser", () => {
    spyCommonsBrowserStorageService.set.and.returnValue(null);

    service.setSoftUser(true);
    expect(spyCommonsBrowserStorageService.set).toHaveBeenCalledWith(
      "IB_PERMANENT_LOGIN",
      "true",
    );
    expect(spyCommonsBrowserStorageService.set.calls.count()).toEqual(1);
  });

  it("#isSoftUser should call localStorage and return if the user is SoftUser", () => {
    spyCommonsBrowserStorageService.get.and.returnValue(true);

    const result = service.isSoftUser();
    expect(spyCommonsBrowserStorageService.get).toHaveBeenCalledWith(
      "IB_PERMANENT_LOGIN",
    );
    expect(spyCommonsBrowserStorageService.get.calls.count()).toEqual(1);
    expect(result).toBe(true);
  });

  it("#removeSoftUser should call localStorage and remove the key for soft user", () => {
    spyCommonsBrowserStorageService.remove.and.returnValue(null);

    service.removeSoftUser();
    expect(spyCommonsBrowserStorageService.remove).toHaveBeenCalledWith(
      "IB_PERMANENT_LOGIN",
    );
    expect(spyCommonsBrowserStorageService.remove.calls.count()).toEqual(1);
  });
  describe("#isUserLogged,", () => {
    it(",should call session storage and return true if an user is logged", () => {
      spySessionStorageService.get.and.returnValue(true);

      const result = service.isUserLogged();
      expect(spySessionStorageService.get).toHaveBeenCalledWith("userLogged");
      expect(spySessionStorageService.get.calls.count()).toEqual(1);
      expect(result).toEqual(true);
    });

    it(",should call session storage and return true if an ONB user is logged", () => {
      spySessionStorageService.get.and.returnValue(
        CommonsHttpServicesConstants.LOGIN_ONB,
      );

      const result = service.isUserLogged();
      expect(spySessionStorageService.get).toHaveBeenCalledWith("userLogged");
      expect(spySessionStorageService.get.calls.count()).toEqual(1);
      expect(result).toEqual(true);
    });

    it(",should call session storage and return false if no user is logged", () => {
      spySessionStorageService.get.and.returnValue(false);

      const result = service.isUserLogged();
      expect(spySessionStorageService.get).toHaveBeenCalledWith("userLogged");
      expect(spySessionStorageService.get.calls.count()).toEqual(1);
      expect(result).toEqual(false);
    });
  });

  describe("#isUserLoggedNotONB,", () => {
    it("should call session storage and return true if an user is logged", () => {
      spySessionStorageService.get.and.returnValue(true);

      const result = service.isUserLoggedNotONB();
      expect(spySessionStorageService.get).toHaveBeenCalledWith("userLogged");
      expect(spySessionStorageService.get.calls.count()).toEqual(1);
      expect(result).toEqual(true);
    });

    it("should call session storage and return false if an ONB user is logged", () => {
      spySessionStorageService.get.and.returnValue(
        CommonsHttpServicesConstants.LOGIN_ONB,
      );

      const result = service.isUserLoggedNotONB();
      expect(spySessionStorageService.get).toHaveBeenCalledWith("userLogged");
      expect(spySessionStorageService.get.calls.count()).toEqual(1);
      expect(result).toEqual(false);
    });

    it("should call session storage and return false if no user is logged", () => {
      spySessionStorageService.get.and.returnValue("false");

      const result = service.isUserLoggedNotONB();
      expect(spySessionStorageService.get).toHaveBeenCalledWith("userLogged");
      expect(spySessionStorageService.get.calls.count()).toEqual(1);
      expect(result).toEqual(false);
    });
  });

  describe("#isUserLoggedONB,", () => {
    it("should call session storage and return false if an user is logged", () => {
      spySessionStorageService.get.and.returnValue("true");

      const result = service.isUserLoggedONB();
      expect(spySessionStorageService.get).toHaveBeenCalledWith("userLogged");
      expect(spySessionStorageService.get.calls.count()).toEqual(1);
      expect(result).toEqual(false);
    });

    it("should call session storage and return true if an ONB user is logged", () => {
      spySessionStorageService.get.and.returnValue(
        CommonsHttpServicesConstants.LOGIN_ONB,
      );

      const result = service.isUserLoggedONB();
      expect(spySessionStorageService.get).toHaveBeenCalledWith("userLogged");
      expect(spySessionStorageService.get.calls.count()).toEqual(1);
      expect(result).toEqual(true);
    });

    it("should call session storage and return false if no user is logged", () => {
      spySessionStorageService.get.and.returnValue("false");

      const result = service.isUserLoggedONB();
      expect(spySessionStorageService.get).toHaveBeenCalledWith("userLogged");
      expect(spySessionStorageService.get.calls.count()).toEqual(1);
      expect(result).toEqual(false);
    });
  });

  it("#setUserLogged should call sessionStorage and set user logged", () => {
    spySessionStorageService.set.and.returnValue(null);
    service.setUserLogged(true);
    expect(spySessionStorageService.set).toHaveBeenCalledWith(
      "userLogged",
      true,
    );
    expect(spySessionStorageService.set.calls.count()).toEqual(1);
  });

  it("#setUserLoggedONB should call sessionStorage and set user logged as ONB", () => {
    spySessionStorageService.set.and.returnValue(null);
    service.setUserLoggedONB();
    expect(spySessionStorageService.set).toHaveBeenCalledWith(
      "userLogged",
      CommonsHttpServicesConstants.LOGIN_ONB,
    );
    expect(spySessionStorageService.set.calls.count()).toEqual(1);
  });

  it("#logout should remove user cached data", () => {
    fakeIbCTokenUtilsService.deleteLoggedTokens.and.stub();
    spySessionStorageService.remove.and.returnValue(null);
    spyOn(service, "removeUserRole").and.stub();
    service.logout();

    expect(spySessionStorageService.remove).toHaveBeenCalled();
    expect(fakeIbCTokenUtilsService.deleteLoggedTokens).toHaveBeenCalled();
    expect(service.removeUserRole).toHaveBeenCalled();
  });

  describe("#getFrequentFlyer", () => {
    it("and frequentFlyer in token should get user frequent flyer", () => {
      fakeIbCTokenUtilsService.getFrequentFlyerFromToken.and.returnValue(
        "TOKEN",
      );
      expect(service.getFrequentFlyer()).toBe("TOKEN");
    });

    it("and not frequentFlyer in token should get user frequent flyer", () => {
      fakeIbCTokenUtilsService.getFrequentFlyerFromToken.and.returnValue(
        undefined,
      );
      spySessionStorageService.get.and.returnValue("TOKEN2");
      expect(service.getFrequentFlyer()).toBe("TOKEN2");
    });

    it("and not frequentFlyer found, should return null", () => {
      fakeIbCTokenUtilsService.getFrequentFlyerFromToken.and.returnValue(
        undefined,
      );
      spySessionStorageService.get.and.returnValue(null);
      expect(service.getFrequentFlyer()).toEqual("NOT_FOUND");
    });
  });
});
