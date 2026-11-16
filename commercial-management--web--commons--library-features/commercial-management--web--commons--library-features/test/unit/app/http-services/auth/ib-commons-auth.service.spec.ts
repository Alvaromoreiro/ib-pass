import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { IbCAuthService } from "ib-web-commons/http-services";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CommonsHttpServicesConstants } from "ib-web-commons/constants";
import {
  AJSRootScope,
  CommonsRootScope,
  IbCUserUtilsService,
  getSalesforceUrl,
  IbCTokenUtilsService,
} from "ib-web-commons/utils";

describe("Auth Service tests", () => {
  let httpTestingController: HttpTestingController;
  let service: IbCAuthService;
  let spyIbCUserUtilsService: jasmine.SpyObj<IbCUserUtilsService>;
  let spyRootScope: jasmine.SpyObj<CommonsRootScope>;
  let spyTokenUtilsService: IbCTokenUtilsService;

  beforeEach(() => {
    const mockUserUtilsService = jasmine.createSpyObj("IbCUserUtilsService", [
      "isUserLoggedNotONB",
      "isUserLoggedONB",
      "isSoftUser",
      "setUserRole",
      "setSoftUser",
      "setUserLoggedONB",
      "setUserLogged",
    ]);
    const mockRootScope = jasmine.createSpyObj("AJSRootScope", ["$broadcast"]);

    TestBed.configureTestingModule({
      providers: [
        IbCAuthService,
        IbCTokenUtilsService,
        { provide: IbCUserUtilsService, useValue: mockUserUtilsService },
        { provide: AJSRootScope, useValue: mockRootScope },
      ],
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(IbCAuthService);
    spyIbCUserUtilsService = TestBed.inject(
      IbCUserUtilsService,
    ) as jasmine.SpyObj<IbCUserUtilsService>;
    spyRootScope = TestBed.inject(
      AJSRootScope,
    ) as jasmine.SpyObj<CommonsRootScope>;
    spyTokenUtilsService = TestBed.inject(IbCTokenUtilsService);
  });

  describe("#refreshNecessaryToken() should refresh the necessary token for the user", () => {
    it("When user is not logged, it should refresh anonymous token", () => {
      spyOn(spyTokenUtilsService, "setAnonymousToken").and.callThrough();
      const mockedService = {
        access_token: "test token",
      };
      const anonymousTokenUri = CommonsHttpServicesConstants.tokenServiceURI;

      service.refreshNecessaryToken().subscribe((res) => {
        expect(res).toBeDefined();
        expect(spyTokenUtilsService.setAnonymousToken).toHaveBeenCalledOnceWith(
          "test token",
        );
      });
      const req = httpTestingController.expectOne(anonymousTokenUri);
      expect(req.request.method).toEqual("POST");
      req.flush(mockedService);
    });

    it("When user is logged, it should refresh salesforce and ibis token and save the token and the user type", () => {
      spyOn(spyTokenUtilsService, "getSFAccessToken").and.callThrough();
      spyOn(spyTokenUtilsService, "setKCAccessToken").and.returnValue();
      spyOn(spyTokenUtilsService, "setSFAccessToken").and.returnValue();
      spyOn(spyTokenUtilsService, "getAnonymousToken").and.returnValue(
        "ANONYMOUS",
      );
      spyOn(spyTokenUtilsService, "getUserTypeFromToken").and.returnValue(
        "IBPLUS",
      );
      spyIbCUserUtilsService.isUserLoggedNotONB.and.returnValue(true);
      spyIbCUserUtilsService.setUserRole.and.returnValue();

      const mockService = {
        access_token: "test token",
      };
      const sfAccessTokenUri =
        CommonsHttpServicesConstants.SALESFORCE_TOKEN.tokenURI;
      const introspectUri =
        CommonsHttpServicesConstants.SALESFORCE_TOKEN.introspectURI;
      const tokenUri = CommonsHttpServicesConstants.tokenServiceURI;
      const anonymousTokenUri = CommonsHttpServicesConstants.tokenServiceURI;

      service.refreshNecessaryToken().subscribe((res) => {
        expect(res).toBeDefined();
        expect(spyTokenUtilsService.getSFAccessToken).toHaveBeenCalled();
        expect(spyTokenUtilsService.setKCAccessToken).toHaveBeenCalled();
        expect(spyIbCUserUtilsService.setUserRole).toHaveBeenCalledOnceWith(
          "IBPLUS",
        );
      });

      const req0 = httpTestingController.expectOne(anonymousTokenUri);
      expect(req0.request.method).toEqual("POST");
      req0.flush(mockService);

      const req = httpTestingController.expectOne(sfAccessTokenUri);
      expect(req.request.method).toEqual("POST");
      req.flush(mockService);

      const req2 = httpTestingController.expectOne(introspectUri);
      expect(req2.request.method).toEqual("POST");
      req2.flush({ active: true, exp: 11000, iat: 1000 });

      const req3 = httpTestingController.expectOne(tokenUri);
      expect(req3.request.method).toEqual("POST");
      req3.flush({
        access_token: "test token",
        expires_in: 10000,
        refresh_expires_in: 10000,
      });
    });

    it("When user is logged and should change to soft user, it should do the change and refresh tokens", () => {
      spyOn(spyTokenUtilsService, "getSFAccessToken").and.callThrough();
      spyOn(spyTokenUtilsService, "setKCAccessToken").and.returnValue();
      spyOn(spyTokenUtilsService, "setSFAccessToken").and.returnValue();
      spyOn(spyTokenUtilsService, "getAnonymousToken").and.returnValue(
        "ANONYMOUS",
      );
      spyOn(spyTokenUtilsService, "getUserTypeFromToken").and.returnValue(
        "IBPLUS",
      );
      spyIbCUserUtilsService.isUserLoggedNotONB.and.returnValue(true);
      spyIbCUserUtilsService.setUserRole.and.returnValue();
      spyIbCUserUtilsService.setSoftUser.and.returnValue();
      spyIbCUserUtilsService.isSoftUser.and.returnValue(false);

      const mockService = {
        access_token: "test token",
      };
      const sfAccessTokenUri =
        CommonsHttpServicesConstants.SALESFORCE_TOKEN.tokenURI;
      const introspectUri =
        CommonsHttpServicesConstants.SALESFORCE_TOKEN.introspectURI;
      const tokenUri = CommonsHttpServicesConstants.tokenServiceURI;
      const anonymousTokenUri = CommonsHttpServicesConstants.tokenServiceURI;

      service.refreshNecessaryToken().subscribe((res) => {
        expect(res).toBeDefined();
        expect(spyTokenUtilsService.getSFAccessToken).toHaveBeenCalled();
        expect(spyTokenUtilsService.setKCAccessToken).toHaveBeenCalled();
        expect(spyIbCUserUtilsService.setUserRole).toHaveBeenCalledOnceWith(
          "IBPLUS",
        );
        expect(spyIbCUserUtilsService.setSoftUser).toHaveBeenCalledOnceWith(
          true,
        );
      });

      const req0 = httpTestingController.expectOne(anonymousTokenUri);
      expect(req0.request.method).toEqual("POST");
      req0.flush(mockService);

      const req = httpTestingController.expectOne(sfAccessTokenUri);
      expect(req.request.method).toEqual("POST");
      req.flush(mockService);

      const req2 = httpTestingController.expectOne(introspectUri);
      expect(req2.request.method).toEqual("POST");
      req2.flush({ active: false, exp: 11000, iat: 1000 });

      const req3 = httpTestingController.expectOne(tokenUri);
      expect(req3.request.method).toEqual("POST");
      req3.flush({
        access_token: "test token",
        expires_in: 10000,
        refresh_expires_in: 10000,
      });
    });

    it("When user is soft user and needs only ibis refresh, it should do the change and refresh ibis tokens", () => {
      spyOn(spyTokenUtilsService, "getSFAccessToken").and.returnValue("test");
      spyOn(spyTokenUtilsService, "setKCAccessToken").and.returnValue();
      spyOn(spyTokenUtilsService, "getUserTypeFromToken").and.returnValue(
        "IBPLUS",
      );
      spyIbCUserUtilsService.isUserLoggedNotONB.and.returnValue(true);
      spyIbCUserUtilsService.setUserRole.and.returnValue();
      spyIbCUserUtilsService.isSoftUser.and.returnValue(true);

      const tokenUri = CommonsHttpServicesConstants.tokenServiceURI;

      service.refreshNecessaryToken().subscribe((res) => {
        expect(res).toBeDefined();
        expect(spyTokenUtilsService.getSFAccessToken).toHaveBeenCalled();
        expect(spyTokenUtilsService.setKCAccessToken).toHaveBeenCalled();
      });

      const req3 = httpTestingController.expectOne(tokenUri);
      expect(req3.request.method).toEqual("POST");
      req3.flush({
        access_token: "test token",
        expires_in: 10000,
        refresh_expires_in: 10000,
      });
    });

    it("When user is ONB, it should do the refresh ibis tokens", () => {
      spyOn(spyTokenUtilsService, "setONBAccessToken").and.returnValue();
      spyIbCUserUtilsService.isUserLoggedNotONB.and.returnValue(false);
      spyIbCUserUtilsService.isUserLoggedONB.and.returnValue(true);
      spyIbCUserUtilsService.setUserLoggedONB.and.returnValue();

      const tokenUri = CommonsHttpServicesConstants.tokenOBServiceURI;

      service.refreshNecessaryToken().subscribe((res) => {
        expect(res).toBeDefined();
        expect(spyTokenUtilsService.setONBAccessToken).toHaveBeenCalled();
        expect(spyIbCUserUtilsService.setUserLoggedONB).toHaveBeenCalled();
      });

      const req3 = httpTestingController.expectOne(tokenUri);
      expect(req3.request.method).toEqual("POST");
      req3.flush({
        access_token: "test token",
        expires_in: 10000,
        refresh_expires_in: 10000,
      });
    });
  });

  describe("#needsTokenRefresh() should check if a token refresh is needed returning a boolean observable", () => {
    it("When user is logged and not ONB, if not ibis token, should return true to refresh token", fakeAsync(() => {
      spyIbCUserUtilsService.isUserLoggedNotONB.and.returnValue(true);
      spyOn(spyTokenUtilsService, "getSFAccessToken").and.returnValue("TEST");
      spyOn(spyTokenUtilsService, "getKCAccessToken").and.returnValue(null);
      let expected: boolean;
      service.needsTokenRefresh().subscribe((val) => {
        expected = val;
      });
      tick();
      expect(expected).toBe(true);
    }));
    it("When user is logged and not ONB, if not sf access token, should return true to refresh token", fakeAsync(() => {
      spyIbCUserUtilsService.isUserLoggedNotONB.and.returnValue(true);
      spyOn(spyTokenUtilsService, "getSFAccessToken").and.returnValue(null);
      spyOn(spyTokenUtilsService, "getSFRefreshToken").and.returnValue("TEST");
      spyOn(spyTokenUtilsService, "getKCAccessToken").and.returnValue("TEST");
      let expected: boolean;
      service.needsTokenRefresh().subscribe((val) => {
        expected = val;
      });
      tick();
      expect(expected).toBe(true);
    }));
    it("When user is logged and not ONB, with all tokens, should return false to refresh token", fakeAsync(() => {
      spyIbCUserUtilsService.isUserLoggedNotONB.and.returnValue(true);
      spyOn(spyTokenUtilsService, "getSFAccessToken").and.returnValue("TEST");
      spyOn(spyTokenUtilsService, "getKCAccessToken").and.returnValue("TEST");
      let expected: boolean;
      service.needsTokenRefresh().subscribe((val) => {
        expected = val;
      });
      tick();
      expect(expected).toBe(false);
    }));

    it("When user is logged ONB, if not ibis token, should return true to refresh token", fakeAsync(() => {
      spyIbCUserUtilsService.isUserLoggedNotONB.and.returnValue(false);
      spyIbCUserUtilsService.isUserLoggedONB.and.returnValue(true);
      spyOn(spyTokenUtilsService, "getONBAccessToken").and.returnValue(null);
      spyOn(spyTokenUtilsService, "getONBRefreshToken").and.returnValue("TEST");
      let expected: boolean;
      service.needsTokenRefresh().subscribe((val) => {
        expected = val;
      });
      tick();
      expect(expected).toBe(true);
    }));

    it("When user is logged ONB, if not ibis token, should return true to refresh token", fakeAsync(() => {
      spyIbCUserUtilsService.isUserLoggedNotONB.and.returnValue(false);
      spyIbCUserUtilsService.isUserLoggedONB.and.returnValue(true);
      spyOn(spyTokenUtilsService, "getONBAccessToken").and.returnValue("TEST");
      spyOn(spyTokenUtilsService, "getONBRefreshToken").and.returnValue("TEST");
      let expected: boolean;
      service.needsTokenRefresh().subscribe((val) => {
        expected = val;
      });
      tick();
      expect(expected).toBe(false);
    }));

    it("When user is not logged, if not anonymous token, should return true to refresh token", fakeAsync(() => {
      spyIbCUserUtilsService.isUserLoggedNotONB.and.returnValue(false);
      spyIbCUserUtilsService.isUserLoggedONB.and.returnValue(false);
      spyOn(spyTokenUtilsService, "getAnonymousToken").and.returnValue(null);
      let expected: boolean;
      service.needsTokenRefresh().subscribe((val) => {
        expected = val;
      });
      tick();
      expect(expected).toBe(true);
    }));
  });

  describe("#revokeNecessaryToken() is called", () => {
    it("When user is logged and not ONB, should revoke token", fakeAsync(() => {
      spyIbCUserUtilsService.isUserLoggedNotONB.and.returnValue(true);
      spyOn(spyTokenUtilsService, "getSFAccessToken").and.returnValue("TEST");
      spyOn(spyTokenUtilsService, "getSFRefreshToken").and.returnValue("TEST");
      spyOn(spyTokenUtilsService, "getKCAccessToken").and.returnValue("TEST");
      spyOn(spyTokenUtilsService, "getKCRefreshToken").and.returnValue("TEST");
      service.revokeNecessaryToken().subscribe((val) => {
        expect(true).toBe(true);
      });
      const req2 = httpTestingController.expectOne(
        CommonsHttpServicesConstants.revokeTokenServiceURI,
      );
      expect(req2.request.method).toEqual("POST");
      req2.flush({});
      const revokeTokenURI =
        getSalesforceUrl() +
        CommonsHttpServicesConstants.SALESFORCE_TOKEN.logoutURI;
      const req = httpTestingController.expectOne(revokeTokenURI);
      expect(req.request.method).toEqual("POST");
      req.flush({});
    }));

    it("When user is not logged, should do nothing", fakeAsync(() => {
      spyIbCUserUtilsService.isUserLoggedNotONB.and.returnValue(false);
      service.revokeNecessaryToken().subscribe({
        complete: () => {
          expect(true).toBe(true);
        },
      });
      tick();
    }));
  });
});
