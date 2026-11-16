import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { IbCAuthInterceptorService } from "ib-web-commons/interceptor";
import { HTTP_INTERCEPTORS, HttpContext } from "@angular/common/http";
import {
  IbCPromiseBaseSFService,
  LOGGED_FLOW_BLOCKING,
  SERVICE_IN_RESTRICTED_AREA,
  SKIP_AUTH_INTERCEPTOR,
  SOFT_RELOAD,
} from "ib-web-commons/proxies";
import {
  AJSRootScope,
  CommonsRootScope, IbCTokenUtilsService,
  IbCUserUtilsService,
  RedirectionService
} from "ib-web-commons/utils";
import { IbCAuthService } from "ib-web-commons/http-services";
import { IbCUserStoreRepositoryService } from "ib-web-commons/services";
import { CommonsHttpServicesConstants } from "ib-web-commons/constants";
import { IbCModalService } from "ib-web-commons/ib-modal";
import { of } from "rxjs";

describe("IbCAuthInterceptorService tests", () => {
  let httpTestingController: HttpTestingController;
  let service: IbCPromiseBaseSFService;
  let interceptor: IbCAuthInterceptorService;
  let authService: IbCAuthService;
  let userUtilsService;
  IbCUserUtilsService;
  let tokenUtilsService: IbCTokenUtilsService;
  let modalService: IbCModalService;
  let redirectionService: RedirectionService;
  let spyRootScope: jasmine.SpyObj<CommonsRootScope>;
  let mockRootScope: CommonsRootScope;
  let fakeIbCUserStoreRepositoryService: jasmine.SpyObj<IbCUserStoreRepositoryService>;

  beforeEach(() => {
    mockRootScope = jasmine.createSpyObj("AJSRootScope", ["$broadcast"]);
    fakeIbCUserStoreRepositoryService = jasmine.createSpyObj(
      "IbCUserStoreRepositoryService",
      ["logoutUser", "updateToPermanentUser", "getUserState"],
    );

    TestBed.configureTestingModule({
      providers: [
        IbCPromiseBaseSFService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: IbCAuthInterceptorService,
          multi: true,
        },
        {
          provide: IbCUserStoreRepositoryService,
          useValue: fakeIbCUserStoreRepositoryService,
        },
        { provide: AJSRootScope, useValue: mockRootScope },
      ],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(IbCPromiseBaseSFService);
    httpTestingController = TestBed.inject(HttpTestingController);
    interceptor = TestBed.inject(IbCAuthInterceptorService);
    authService = TestBed.inject(IbCAuthService);
    userUtilsService = TestBed.inject(IbCUserUtilsService);
    tokenUtilsService = TestBed.inject(IbCTokenUtilsService);
    modalService = TestBed.inject(IbCModalService);
    redirectionService = TestBed.inject(RedirectionService);
    spyRootScope = TestBed.inject(
      AJSRootScope,
    ) as jasmine.SpyObj<CommonsRootScope>;
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe("When a iberia response is send", () => {
    describe("and skips interceptor", () => {
      it("should make the call as normal", fakeAsync(() => {
        service
          .get("/test", {
            context: new HttpContext().set(SKIP_AUTH_INTERCEPTOR, true),
          })
          .catch((err) => {
            expect(err).toBeDefined();
          });
        const req = httpTestingController.expectOne("/test");
        req.flush("", { status: 401, statusText: "Not Found" });
        tick();
        expect(req.request.method).toEqual("GET");
      }));

      it("with url is iberia web content should make the call as normal", fakeAsync(() => {
        const url = "/iberia-web-content/test";
        service.post(url).catch((err) => {
          expect(err).toBeDefined();
        });
        const req = httpTestingController.expectOne(url);
        req.flush("", { status: 401, statusText: "Not Found" });
        tick();
        expect(req.request.method).toEqual("POST");
        httpTestingController.expectNone(url);
      }));

      afterEach(() => {
        httpTestingController.verify();
      });
    });

    describe("and logged not ONB and does not have token", () => {
      describe("if ibis token and not salesforce", () => {
        it("should refresh token and do the service call with new token", fakeAsync(() => {
          spyOn(userUtilsService, "isUserLoggedNotONB").and.returnValue(true);
          spyOn(userUtilsService, "isUserLoggedONB").and.returnValue(false);
          spyOn(userUtilsService, "setUserRole").and.returnValue(false);
          spyOn(tokenUtilsService, "getSFAccessToken").and.returnValue(
            "TOKEN FOUND",
          );
          spyOn(tokenUtilsService, "getKCAccessToken").and.returnValue(null);
          spyOn(tokenUtilsService, "setKCAccessToken").and.returnValue(null);
          spyOn(tokenUtilsService, "setKCRefreshToken").and.returnValue(null);

          const url = "/test";
          service.put(url).catch((err) => {
            expect(err).toBeDefined();
          });

          const req2 = httpTestingController.expectOne(
            CommonsHttpServicesConstants.tokenServiceURI,
          );
          req2.flush(
            {
              access_token:
                "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJNQnl5bzlwSWVqUG5vUzdFeEZxdk12WE41cWVfTy1FRnBRYUlMOUYyQjdRIn0.eyJqdGkiOiJjNGVlMGE3OC04ZWRjLTRjZmMtYWM5ZC1kMmIwOTNlODhlNjYiLCJleHAiOjE2NjM5NzY3NDEsIm5iZiI6MCwiaWF0IjoxNjYzOTc1ODQxLCJpc3MiOiJodHRwczovL25ldy1pYmlzYXV0aC5jb3JwLmliZXJpYS5lcy9hdXRoL3JlYWxtcy9jb21tZXJjaWFsX3BsYXRmb3JtIiwic3ViIjoiMDAxNEwwMDAwME9iWVJGUUEzIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaWJlcmlhX3dlYiIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjE3MjA1YmE0LTdlYWUtNGUxOC1hYjI1LWY5MmE5NmYzYmI3NyIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiUk9MRV9TQUwiLCJST0xFX0xPQyIsIlJPTEVfQlBNIiwiUk9MRV9BUElNIiwiUk9MRV9DVVNUIiwiUk9MRV9GTSIsIlJPTEVfRk9GRiIsIlJPTEVfT1JTIiwiUk9MRV9JQkVSSUFfWkVSTyIsIlJPTEVfT1JNIiwiUk9MRV9IT01FIiwiUk9MRV9VU0VSIiwiUk9MRV9QUk0iLCJvZmZsaW5lX2FjY2VzcyIsIlJPTEVfTUVNQkVSX1pFUk8iLCJST0xFX0FEVk0iLCJST0xFX1BBQ0MiLCJST0xFX0FWTSIsIlJPTEVfU1JWIiwiUk9MRV9QTVQiLCJST0xFX1NFQVRTIiwiUk9MRV9GQVNTIiwic29mdF91c2VyIl19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicHJlZmVycmVkX3VzZXJuYW1lIjoiMDAxNGwwMDAwMG9ieXJmcWEzIn0.dQL_2r-0TCEw2SCeo1RRqqVQ7mc4nzhpM9ENwpFQBMzLC7zDBuEgnRaWW1n95YWaF38FkX9jxMM5wZ4eKVs0spEv4SZUyIhZ7HWojNb7HuajCCbLlLRYUHijOTvDT7lU8oaY714uo3Hoe80p6kHM_EMkDha_gX3SSfg_PHqU_co0mlIcTw3NRg49KM0NmUPw4Wh2TzJL-yNe38qyGXlvBUDeZn8LhG4adonmNjtqwdqAp47FSXGk4ZSbEPTt7LXC8nHi2JbbtBNOpW5Hu5sfOEQSJYscPQtW-pQuLmKC7EVphE-AoelC8nyUkaPybnppe_TejLh_BMo0jz3Dr2MJYA",
              expires_in: 1000,
              refresh_expires_in: 1000,
              refresh_token: "asdasd",
            },
            { status: 200, statusText: "Not Found" },
          );
          tick();
          expect(tokenUtilsService.setKCAccessToken).toHaveBeenCalled();
          expect(tokenUtilsService.setKCRefreshToken).toHaveBeenCalled();
          const req = httpTestingController.expectOne(url);
          req.flush("", { status: 200, statusText: "Not Found" });
          tick();
          expect(req.request.method).toEqual("PUT");
          flush();
        }));

        xit("and two call at the same time, should refresh token time once and do both the service call with new token", fakeAsync(() => {
          spyOn(userUtilsService, "isUserLoggedNotONB").and.returnValue(true);
          spyOn(userUtilsService, "isUserLoggedONB").and.returnValue(false);
          spyOn(userUtilsService, "setUserRole").and.returnValue(false);
          spyOn(tokenUtilsService, "getSFAccessToken").and.returnValue(
            "TOKEN FOUND",
          );
          spyOn(tokenUtilsService, "getKCAccessToken").and.returnValue(null);
          spyOn(tokenUtilsService, "setKCAccessToken").and.returnValue(null);
          spyOn(tokenUtilsService, "setKCRefreshToken").and.returnValue(null);

          const url = "/test";
          Promise.all([service.put(url), service.put(url)]).catch((err) => {
            expect(err).toBeDefined();
          });

          const req2 = httpTestingController.expectOne(
            CommonsHttpServicesConstants.tokenServiceURI,
          );
          req2.flush(
            {
              access_token:
                "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJNQnl5bzlwSWVqUG5vUzdFeEZxdk12WE41cWVfTy1FRnBRYUlMOUYyQjdRIn0.eyJqdGkiOiJjNGVlMGE3OC04ZWRjLTRjZmMtYWM5ZC1kMmIwOTNlODhlNjYiLCJleHAiOjE2NjM5NzY3NDEsIm5iZiI6MCwiaWF0IjoxNjYzOTc1ODQxLCJpc3MiOiJodHRwczovL25ldy1pYmlzYXV0aC5jb3JwLmliZXJpYS5lcy9hdXRoL3JlYWxtcy9jb21tZXJjaWFsX3BsYXRmb3JtIiwic3ViIjoiMDAxNEwwMDAwME9iWVJGUUEzIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaWJlcmlhX3dlYiIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjE3MjA1YmE0LTdlYWUtNGUxOC1hYjI1LWY5MmE5NmYzYmI3NyIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiUk9MRV9TQUwiLCJST0xFX0xPQyIsIlJPTEVfQlBNIiwiUk9MRV9BUElNIiwiUk9MRV9DVVNUIiwiUk9MRV9GTSIsIlJPTEVfRk9GRiIsIlJPTEVfT1JTIiwiUk9MRV9JQkVSSUFfWkVSTyIsIlJPTEVfT1JNIiwiUk9MRV9IT01FIiwiUk9MRV9VU0VSIiwiUk9MRV9QUk0iLCJvZmZsaW5lX2FjY2VzcyIsIlJPTEVfTUVNQkVSX1pFUk8iLCJST0xFX0FEVk0iLCJST0xFX1BBQ0MiLCJST0xFX0FWTSIsIlJPTEVfU1JWIiwiUk9MRV9QTVQiLCJST0xFX1NFQVRTIiwiUk9MRV9GQVNTIiwic29mdF91c2VyIl19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicHJlZmVycmVkX3VzZXJuYW1lIjoiMDAxNGwwMDAwMG9ieXJmcWEzIn0.dQL_2r-0TCEw2SCeo1RRqqVQ7mc4nzhpM9ENwpFQBMzLC7zDBuEgnRaWW1n95YWaF38FkX9jxMM5wZ4eKVs0spEv4SZUyIhZ7HWojNb7HuajCCbLlLRYUHijOTvDT7lU8oaY714uo3Hoe80p6kHM_EMkDha_gX3SSfg_PHqU_co0mlIcTw3NRg49KM0NmUPw4Wh2TzJL-yNe38qyGXlvBUDeZn8LhG4adonmNjtqwdqAp47FSXGk4ZSbEPTt7LXC8nHi2JbbtBNOpW5Hu5sfOEQSJYscPQtW-pQuLmKC7EVphE-AoelC8nyUkaPybnppe_TejLh_BMo0jz3Dr2MJYA",
              expires_in: 1000,
              refresh_expires_in: 1000,
              refresh_token: "asdasd",
            },
            { status: 200, statusText: "Not Found" },
          );
          tick();
          expect(tokenUtilsService.setKCAccessToken).toHaveBeenCalled();
          expect(tokenUtilsService.setKCRefreshToken).toHaveBeenCalled();
          const requests = httpTestingController.match(url);
          expect(requests.length).toBe(2);
          requests[0].flush("", { status: 200, statusText: "Not Found" });
          requests[1].flush("", { status: 200, statusText: "Not Found" });
          tick();
        }));
      });

      describe("if salesforce token", () => {
        beforeEach(() => {
          spyOn(userUtilsService, "isUserLoggedNotONB").and.returnValue(true);
          spyOn(userUtilsService, "isUserLoggedONB").and.returnValue(false);
          spyOn(userUtilsService, "setUserRole").and.returnValue(false);
          spyOn(tokenUtilsService, "setSFAccessToken").and.returnValue(null);
          spyOn(tokenUtilsService, "getSFAccessToken").and.returnValue(null);
          spyOn(tokenUtilsService, "getKCAccessToken").and.returnValue(null);
          spyOn(tokenUtilsService, "setKCAccessToken").and.returnValue(null);
          spyOn(tokenUtilsService, "setKCRefreshToken").and.returnValue(null);
          spyOn(modalService, "showGenericComponentModal").and.returnValue({
            closed: of(true),
            dismissed: of(true),
          } as any);
        });

        it("should refresh token pass to soft user", fakeAsync(() => {
          spyOn(userUtilsService, "isSoftUser").and.returnValue(false);
          const url = "/test";
          service
            .patch(url, undefined, {
              context: new HttpContext().set(SOFT_RELOAD, false),
            })
            .catch((err) => {
              expect(err).toBeDefined();
            });

          const res21 = httpTestingController.expectOne(() => true);
          res21.flush({
            access_token: "FOUND",
          });
          tick();
          const req3 = httpTestingController.expectOne(
            CommonsHttpServicesConstants.SALESFORCE_TOKEN.tokenURI,
          );
          req3.flush({
            access_token: "FOUND",
          });
          tick();
          expect(tokenUtilsService.setSFAccessToken).toHaveBeenCalled();
          const req4 = httpTestingController.expectOne(
            CommonsHttpServicesConstants.SALESFORCE_TOKEN.introspectURI,
          );
          req4.flush({
            active: true,
          });
          tick();
          const req2 = httpTestingController.expectOne(
            CommonsHttpServicesConstants.tokenServiceURI,
          );
          req2.flush(
            {
              access_token:
                "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJNQnl5bzlwSWVqUG5vUzdFeEZxdk12WE41cWVfTy1FRnBRYUlMOUYyQjdRIn0.eyJqdGkiOiJjNGVlMGE3OC04ZWRjLTRjZmMtYWM5ZC1kMmIwOTNlODhlNjYiLCJleHAiOjE2NjM5NzY3NDEsIm5iZiI6MCwiaWF0IjoxNjYzOTc1ODQxLCJpc3MiOiJodHRwczovL25ldy1pYmlzYXV0aC5jb3JwLmliZXJpYS5lcy9hdXRoL3JlYWxtcy9jb21tZXJjaWFsX3BsYXRmb3JtIiwic3ViIjoiMDAxNEwwMDAwME9iWVJGUUEzIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaWJlcmlhX3dlYiIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjE3MjA1YmE0LTdlYWUtNGUxOC1hYjI1LWY5MmE5NmYzYmI3NyIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiUk9MRV9TQUwiLCJST0xFX0xPQyIsIlJPTEVfQlBNIiwiUk9MRV9BUElNIiwiUk9MRV9DVVNUIiwiUk9MRV9GTSIsIlJPTEVfRk9GRiIsIlJPTEVfT1JTIiwiUk9MRV9JQkVSSUFfWkVSTyIsIlJPTEVfT1JNIiwiUk9MRV9IT01FIiwiUk9MRV9VU0VSIiwiUk9MRV9QUk0iLCJvZmZsaW5lX2FjY2VzcyIsIlJPTEVfTUVNQkVSX1pFUk8iLCJST0xFX0FEVk0iLCJST0xFX1BBQ0MiLCJST0xFX0FWTSIsIlJPTEVfU1JWIiwiUk9MRV9QTVQiLCJST0xFX1NFQVRTIiwiUk9MRV9GQVNTIiwic29mdF91c2VyIl19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicHJlZmVycmVkX3VzZXJuYW1lIjoiMDAxNGwwMDAwMG9ieXJmcWEzIn0.dQL_2r-0TCEw2SCeo1RRqqVQ7mc4nzhpM9ENwpFQBMzLC7zDBuEgnRaWW1n95YWaF38FkX9jxMM5wZ4eKVs0spEv4SZUyIhZ7HWojNb7HuajCCbLlLRYUHijOTvDT7lU8oaY714uo3Hoe80p6kHM_EMkDha_gX3SSfg_PHqU_co0mlIcTw3NRg49KM0NmUPw4Wh2TzJL-yNe38qyGXlvBUDeZn8LhG4adonmNjtqwdqAp47FSXGk4ZSbEPTt7LXC8nHi2JbbtBNOpW5Hu5sfOEQSJYscPQtW-pQuLmKC7EVphE-AoelC8nyUkaPybnppe_TejLh_BMo0jz3Dr2MJYA",
              expires_in: 1000,
              refresh_expires_in: 1000,
              refresh_token: "asdasd",
            },
            { status: 200, statusText: "Not Found" },
          );
          tick();
          expect(tokenUtilsService.setKCAccessToken).toHaveBeenCalled();
          expect(tokenUtilsService.setKCRefreshToken).toHaveBeenCalled();
          expect(modalService.showGenericComponentModal).toHaveBeenCalled();
          const req = httpTestingController.expectOne(url);
          req.flush("", { status: 200, statusText: "Not Found" });
          tick();
          expect(req.request.method).toEqual("PATCH");
          flush();
        }));

        it("if in restricted area, should refresh token pass to soft user and redirect to login", fakeAsync(() => {
          spyOn(redirectionService, "redirectToLoginPage").and.callFake(
            () => {},
          );
          spyOn(userUtilsService, "isSoftUser").and.returnValue(false);

          const url = "/test";
          service
            .delete(url, {
              context: new HttpContext()
                .set(SOFT_RELOAD, false)
                .set(SERVICE_IN_RESTRICTED_AREA, true),
            })
            .catch((err) => {
              expect(err).toBeDefined();
            });

          const req21 = httpTestingController.expectOne(() => true);
          req21.flush({
            access_token: "FOUND",
          });
          tick();
          const req3 = httpTestingController.expectOne(
            CommonsHttpServicesConstants.SALESFORCE_TOKEN.tokenURI,
          );
          req3.flush({
            access_token: "FOUND",
          });
          tick();
          expect(tokenUtilsService.setSFAccessToken).toHaveBeenCalled();
          const req4 = httpTestingController.expectOne(
            CommonsHttpServicesConstants.SALESFORCE_TOKEN.introspectURI,
          );
          req4.flush({
            active: true,
          });
          tick();
          const req2 = httpTestingController.expectOne(
            CommonsHttpServicesConstants.tokenServiceURI,
          );
          req2.flush(
            {
              access_token:
                "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJNQnl5bzlwSWVqUG5vUzdFeEZxdk12WE41cWVfTy1FRnBRYUlMOUYyQjdRIn0.eyJqdGkiOiJjNGVlMGE3OC04ZWRjLTRjZmMtYWM5ZC1kMmIwOTNlODhlNjYiLCJleHAiOjE2NjM5NzY3NDEsIm5iZiI6MCwiaWF0IjoxNjYzOTc1ODQxLCJpc3MiOiJodHRwczovL25ldy1pYmlzYXV0aC5jb3JwLmliZXJpYS5lcy9hdXRoL3JlYWxtcy9jb21tZXJjaWFsX3BsYXRmb3JtIiwic3ViIjoiMDAxNEwwMDAwME9iWVJGUUEzIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaWJlcmlhX3dlYiIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjE3MjA1YmE0LTdlYWUtNGUxOC1hYjI1LWY5MmE5NmYzYmI3NyIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiUk9MRV9TQUwiLCJST0xFX0xPQyIsIlJPTEVfQlBNIiwiUk9MRV9BUElNIiwiUk9MRV9DVVNUIiwiUk9MRV9GTSIsIlJPTEVfRk9GRiIsIlJPTEVfT1JTIiwiUk9MRV9JQkVSSUFfWkVSTyIsIlJPTEVfT1JNIiwiUk9MRV9IT01FIiwiUk9MRV9VU0VSIiwiUk9MRV9QUk0iLCJvZmZsaW5lX2FjY2VzcyIsIlJPTEVfTUVNQkVSX1pFUk8iLCJST0xFX0FEVk0iLCJST0xFX1BBQ0MiLCJST0xFX0FWTSIsIlJPTEVfU1JWIiwiUk9MRV9QTVQiLCJST0xFX1NFQVRTIiwiUk9MRV9GQVNTIiwic29mdF91c2VyIl19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicHJlZmVycmVkX3VzZXJuYW1lIjoiMDAxNGwwMDAwMG9ieXJmcWEzIn0.dQL_2r-0TCEw2SCeo1RRqqVQ7mc4nzhpM9ENwpFQBMzLC7zDBuEgnRaWW1n95YWaF38FkX9jxMM5wZ4eKVs0spEv4SZUyIhZ7HWojNb7HuajCCbLlLRYUHijOTvDT7lU8oaY714uo3Hoe80p6kHM_EMkDha_gX3SSfg_PHqU_co0mlIcTw3NRg49KM0NmUPw4Wh2TzJL-yNe38qyGXlvBUDeZn8LhG4adonmNjtqwdqAp47FSXGk4ZSbEPTt7LXC8nHi2JbbtBNOpW5Hu5sfOEQSJYscPQtW-pQuLmKC7EVphE-AoelC8nyUkaPybnppe_TejLh_BMo0jz3Dr2MJYA",
              expires_in: 1000,
              refresh_expires_in: 1000,
              refresh_token: "asdasd",
            },
            { status: 200, statusText: "Not Found" },
          );
          tick();
          expect(tokenUtilsService.setKCAccessToken).toHaveBeenCalled();
          expect(tokenUtilsService.setKCRefreshToken).toHaveBeenCalled();
          expect(redirectionService.redirectToLoginPage).toHaveBeenCalled();
          const req = httpTestingController.expectOne(url);
          req.flush("", { status: 200, statusText: "Not Found" });
          tick();
          expect(req.request.method).toEqual("DELETE");
          flush();
        }));
      });

      afterEach(() => {
        httpTestingController.verify();
      });
    });

    describe("and service throws controlled error", () => {
      beforeEach(() => {
        spyOn(userUtilsService, "isUserLoggedNotONB").and.returnValue(true);
        spyOn(userUtilsService, "isUserLoggedONB").and.returnValue(false);
        spyOn(userUtilsService, "setUserRole").and.returnValue(false);
        spyOn(tokenUtilsService, "setSFAccessToken").and.returnValue(null);
        spyOn(tokenUtilsService, "getSFAccessToken").and.returnValue(
          "SF FOUND",
        );
        spyOn(tokenUtilsService, "getKCAccessToken").and.returnValue("FOUND");
        spyOn(tokenUtilsService, "setKCAccessToken").and.returnValue(null);
        spyOn(tokenUtilsService, "setKCRefreshToken").and.returnValue(null);
        spyOn(redirectionService, "redirectToLoginPage").and.callFake(() => {});
        spyOn(modalService, "showGenericComponentModal").and.returnValue({
          closed: of(true),
          dismissed: of(true),
        } as any);
        spyOn(userUtilsService, "isSoftUser").and.returnValue(false);
        fakeIbCUserStoreRepositoryService.logoutUser.and.stub();
        fakeIbCUserStoreRepositoryService.updateToPermanentUser.and.stub();
      });

      describe("and does the refresh token", () => {
        it("if token refreshed has to do service call with new token", fakeAsync(() => {
          const url = "/test";
          service
            .delete(url, {
              context: new HttpContext().set(SOFT_RELOAD, false),
            })
            .catch((err) => {
              expect(err).toBeDefined();
            });
          const req = httpTestingController.expectOne(url);
          req.flush("", { status: 401, statusText: "Not Found" });
          tick();
          expect(req.request.method).toEqual("DELETE");
          const req2 = httpTestingController.expectOne(
            CommonsHttpServicesConstants.tokenServiceURI,
          );
          req2.flush(
            {
              access_token:
                "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJNQnl5bzlwSWVqUG5vUzdFeEZxdk12WE41cWVfTy1FRnBRYUlMOUYyQjdRIn0.eyJqdGkiOiJjNGVlMGE3OC04ZWRjLTRjZmMtYWM5ZC1kMmIwOTNlODhlNjYiLCJleHAiOjE2NjM5NzY3NDEsIm5iZiI6MCwiaWF0IjoxNjYzOTc1ODQxLCJpc3MiOiJodHRwczovL25ldy1pYmlzYXV0aC5jb3JwLmliZXJpYS5lcy9hdXRoL3JlYWxtcy9jb21tZXJjaWFsX3BsYXRmb3JtIiwic3ViIjoiMDAxNEwwMDAwME9iWVJGUUEzIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaWJlcmlhX3dlYiIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjE3MjA1YmE0LTdlYWUtNGUxOC1hYjI1LWY5MmE5NmYzYmI3NyIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiUk9MRV9TQUwiLCJST0xFX0xPQyIsIlJPTEVfQlBNIiwiUk9MRV9BUElNIiwiUk9MRV9DVVNUIiwiUk9MRV9GTSIsIlJPTEVfRk9GRiIsIlJPTEVfT1JTIiwiUk9MRV9JQkVSSUFfWkVSTyIsIlJPTEVfT1JNIiwiUk9MRV9IT01FIiwiUk9MRV9VU0VSIiwiUk9MRV9QUk0iLCJvZmZsaW5lX2FjY2VzcyIsIlJPTEVfTUVNQkVSX1pFUk8iLCJST0xFX0FEVk0iLCJST0xFX1BBQ0MiLCJST0xFX0FWTSIsIlJPTEVfU1JWIiwiUk9MRV9QTVQiLCJST0xFX1NFQVRTIiwiUk9MRV9GQVNTIiwic29mdF91c2VyIl19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicHJlZmVycmVkX3VzZXJuYW1lIjoiMDAxNGwwMDAwMG9ieXJmcWEzIn0.dQL_2r-0TCEw2SCeo1RRqqVQ7mc4nzhpM9ENwpFQBMzLC7zDBuEgnRaWW1n95YWaF38FkX9jxMM5wZ4eKVs0spEv4SZUyIhZ7HWojNb7HuajCCbLlLRYUHijOTvDT7lU8oaY714uo3Hoe80p6kHM_EMkDha_gX3SSfg_PHqU_co0mlIcTw3NRg49KM0NmUPw4Wh2TzJL-yNe38qyGXlvBUDeZn8LhG4adonmNjtqwdqAp47FSXGk4ZSbEPTt7LXC8nHi2JbbtBNOpW5Hu5sfOEQSJYscPQtW-pQuLmKC7EVphE-AoelC8nyUkaPybnppe_TejLh_BMo0jz3Dr2MJYA",
              expires_in: 1000,
              refresh_expires_in: 1000,
              refresh_token: "asdasd",
            },
            { status: 200, statusText: "Not Found" },
          );
          tick();
          expect(tokenUtilsService.setKCAccessToken).toHaveBeenCalled();
          expect(tokenUtilsService.setKCRefreshToken).toHaveBeenCalled();
          const req5 = httpTestingController.expectOne(url);
          req5.flush("", { status: 200, statusText: "Not Found" });
          tick();
          flush();
        }));

        describe("if token refresh fails", () => {
          beforeEach(() => {
            spyOn(authService, "revokeNecessaryToken").and.returnValue(
              of(null),
            );
            fakeIbCUserStoreRepositoryService.getUserState.and.returnValue(
              of({ isLoading: false, value: {} as any }),
            );
          });

          it("if in restricted area should logout and redirect to login", fakeAsync(() => {
            const url = "/test";
            service
              .delete(url, {
                context: new HttpContext()
                  .set(SOFT_RELOAD, false)
                  .set(SERVICE_IN_RESTRICTED_AREA, true),
              })
              .catch((err) => {
                expect(err).toBeDefined();
              });
            const req = httpTestingController.expectOne(url);
            req.flush("", { status: 401, statusText: "Not Found" });
            tick();
            expect(req.request.method).toEqual("DELETE");
            const req2 = httpTestingController.expectOne(
              CommonsHttpServicesConstants.tokenServiceURI,
            );
            req2.flush("", { status: 400, statusText: "Not Found" });
            tick(1000);
            const req3 = httpTestingController.expectOne(
              CommonsHttpServicesConstants.tokenServiceURI,
            );
            req3.flush("", { status: 400, statusText: "Not Found" });
            tick();
            expect(
              fakeIbCUserStoreRepositoryService.logoutUser,
            ).toHaveBeenCalled();
            expect(redirectionService.redirectToLoginPage).toHaveBeenCalled();
          }));

          it("if in logged flow blocking should logout and redirect to login", fakeAsync(() => {
            const url = "/test";
            service
              .delete(url, {
                context: new HttpContext()
                  .set(SOFT_RELOAD, false)
                  .set(LOGGED_FLOW_BLOCKING, true),
              })
              .catch((err) => {
                expect(err).toBeDefined();
              });
            const req = httpTestingController.expectOne(url);
            req.flush("", { status: 401, statusText: "Not Found" });
            tick();
            expect(req.request.method).toEqual("DELETE");
            const req2 = httpTestingController.expectOne(
              CommonsHttpServicesConstants.tokenServiceURI,
            );
            req2.flush("", { status: 400, statusText: "Not Found" });
            tick(1000);
            const req3 = httpTestingController.expectOne(
              CommonsHttpServicesConstants.tokenServiceURI,
            );
            req3.flush("", { status: 400, statusText: "Not Found" });
            tick();
            expect(
              fakeIbCUserStoreRepositoryService.logoutUser,
            ).toHaveBeenCalled();
            expect(redirectionService.redirectToLoginPage).toHaveBeenCalled();
          }));

          it("if normal flow should logout, get anonymous token and do the service call", fakeAsync(() => {
            const url = "/test";
            service
              .delete(url, {
                context: new HttpContext().set(SOFT_RELOAD, false),
              })
              .catch((err) => {
                expect(err).toBeDefined();
              });
            const req = httpTestingController.expectOne(url);
            req.flush("", { status: 401, statusText: "Not Found" });
            tick();
            expect(req.request.method).toEqual("DELETE");
            const req2 = httpTestingController.expectOne(
              CommonsHttpServicesConstants.tokenServiceURI,
            );
            req2.flush("", { status: 400, statusText: "Not Found" });
            tick(1000);
            const req3 = httpTestingController.expectOne(
              CommonsHttpServicesConstants.tokenServiceURI,
            );
            req3.flush("", { status: 400, statusText: "Not Found" });
            tick();
            expect(
              fakeIbCUserStoreRepositoryService.logoutUser,
            ).toHaveBeenCalled();
            const req4 = httpTestingController.expectOne(
              CommonsHttpServicesConstants.tokenServiceURI,
            );
            req4.flush("", { status: 200, statusText: "Not Found" });
            tick();
            const req5 = httpTestingController.expectOne(url);
            req5.flush("", { status: 200, statusText: "Not Found" });
            tick();
          }));
        });
      });

      afterEach(() => {
        httpTestingController.verify();
      });
    });

    it("and service throws error not controlled, should continue error", fakeAsync(() => {
      spyOn(tokenUtilsService, "getSFAccessToken").and.returnValue("SF FOUND");
      spyOn(tokenUtilsService, "getKCAccessToken").and.returnValue("FOUND");
      spyOn(userUtilsService, "isUserLoggedNotONB").and.returnValue(true);
      const url = "/test";
      service.post(url).catch((err) => {
        expect(err).toBeDefined();
      });
      const req = httpTestingController.expectOne(url);
      req.flush("", { status: 400, statusText: "Not Found" });
      tick();
      expect(req.request.method).toEqual("POST");
    }));
  });

  afterEach(() => {
    sessionStorage.clear();
  });
});
