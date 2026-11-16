import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import {
  AJSRootScope,
  CommonsRootScope,
  CommonsSessionStorageService,
  IbCTokenUtilsService,
} from "ib-web-commons/utils";
import { IbCHeadersInterceptorService } from "ib-web-commons/interceptor";
import { HTTP_INTERCEPTORS, HttpContext } from "@angular/common/http";
import {
  IbCBaseRestService,
  SKIP_HEADER_INTERCEPTOR,
} from "ib-web-commons/proxies";

describe("Header interceptor tests", () => {
  let httpTestingController: HttpTestingController;
  let spyRootScope: jasmine.SpyObj<CommonsRootScope>;
  let spyIbCTokenUtilsService: jasmine.SpyObj<IbCTokenUtilsService>;
  let service: IbCBaseRestService;
  let spyCommonsSessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;

  beforeEach(() => {
    const mockRootScope = jasmine.createSpyObj("AJSRootScope", ["$broadcast"]);
    const mockTokenUtilsService = jasmine.createSpyObj("TokenUtilsService", [
      "getAuthToken",
    ]);
    const mockCommonsSessionStorageService = jasmine.createSpyObj(
      "CommonsSessionStorageService",
      ["get"],
    );
    TestBed.configureTestingModule({
      providers: [
        IbCBaseRestService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: IbCHeadersInterceptorService,
          multi: true,
        },
        { provide: AJSRootScope, useValue: mockRootScope },
        { provide: IbCTokenUtilsService, useValue: mockTokenUtilsService },
        {
          provide: CommonsSessionStorageService,
          useValue: mockCommonsSessionStorageService,
        },
      ],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(IbCBaseRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
    spyRootScope = TestBed.inject(
      AJSRootScope,
    ) as jasmine.SpyObj<CommonsRootScope>;
    spyIbCTokenUtilsService = TestBed.inject(
      IbCTokenUtilsService,
    ) as jasmine.SpyObj<IbCTokenUtilsService>;
    spyCommonsSessionStorageService = TestBed.inject(
      CommonsSessionStorageService,
    ) as jasmine.SpyObj<CommonsSessionStorageService>;
  });

  describe("When a iberia response is send", () => {
    beforeEach(() => {
      spyRootScope.appLang = "ES";
      spyRootScope.appMarket = "ES";
    });

    describe("and skips interceptor", () => {
      it("should make the call as normal", fakeAsync(() => {
        spyRootScope.appLang = "ES";
        spyRootScope.appMarket = "ES";

        service
          .delete("/test", {
            headers: {
              "Accept-Language": "A",
            },
            context: new HttpContext().set(SKIP_HEADER_INTERCEPTOR, true),
          })
          .subscribe((res) => {
            expect(res).toBeDefined();
          });
        const req = httpTestingController.expectOne("/test");
        tick();
        expect(req.request.method).toEqual("DELETE");
        expect(req.request.headers.get("Accept-Language")).toEqual("A");
        expect(spyIbCTokenUtilsService.getAuthToken).not.toHaveBeenCalled();
      }));
      it("and url is iberia-web-content, should make the call as normal", fakeAsync(() => {
        spyRootScope.appLang = "ES";
        spyRootScope.appMarket = "ES";

        service
          .put("www.prueba.com/iberia-web-content/TEST")
          .subscribe((res) => {
            expect(res).toBeDefined();
          });
        const req = httpTestingController.expectOne(
          "www.prueba.com/iberia-web-content/TEST",
        );
        tick();
        expect(req.request.method).toEqual("PUT");
        expect(req.request.url).toEqual(
          "www.prueba.com/iberia-web-content/TEST",
        );
        expect(spyIbCTokenUtilsService.getAuthToken).not.toHaveBeenCalled();
      }));
    });

    describe("And the call is with headers", () => {
      it("should use call headers", fakeAsync(() => {
        spyRootScope.appLang = "ES";
        spyRootScope.appMarket = "ES";

        service
          .get("/test", {
            headers: {
              "Accept-Language": "A",
              Authorization: "B",
              "Cache-Control": "C",
              Pragma: "D",
              "X-Request-AppVersion": "E",
              "X-Request-OsVersion": "F",
              "X-Request-Device": "G",
            },
          })
          .subscribe((res) => {
            expect(res).toBeDefined();
          });
        const req = httpTestingController.expectOne("/test");
        tick();
        expect(req.request.method).toEqual("GET");
        expect(req.request.headers.get("Accept-Language")).toEqual("A");
        expect(req.request.headers.get("Authorization")).toEqual("B");
        expect(req.request.headers.get("Cache-Control")).toEqual("C");
      }));
    });

    describe("And needs to add headers", () => {
      it("should add headers", fakeAsync(() => {
        spyIbCTokenUtilsService.getAuthToken.and.returnValue("TESTING");
        spyCommonsSessionStorageService.get.and.returnValue("NEW");
        service.post("/test").subscribe((res) => {
          expect(res).toBeDefined();
        });
        const req = httpTestingController.expectOne("/test");
        tick();
        expect(req.request.method).toEqual("POST");
        expect(req.request.headers.get("Accept-Language")).toEqual("ES-ES");
        expect(req.request.headers.get("Authorization")).toEqual(
          "Bearer TESTING",
        );
        expect(req.request.headers.get("Cache-Control")).toEqual("no-cache");
        expect(req.request.headers.get("X-Observations-Current-Page")).toEqual(
          "NEW",
        );
      }));

      it("and token is null should add headers", fakeAsync(() => {
        spyIbCTokenUtilsService.getAuthToken.and.returnValue(null);
        spyOn(document, "getElementsByName").and.returnValue([
          { content: "TEST" },
        ] as unknown as NodeListOf<HTMLElement>);
        service.patch("/test").subscribe((res) => {
          expect(res).toBeDefined();
        });
        const req = httpTestingController.expectOne("/test");
        tick();
        expect(req.request.method).toEqual("PATCH");
        expect(req.request.headers.get("Accept-Language")).toEqual("ES-ES");
        expect(req.request.headers.get("Authorization")).toEqual(
          "Bearer not found",
        );
        expect(req.request.headers.get("Pragma")).toEqual("no-cache");
      }));
    });
  });
});
