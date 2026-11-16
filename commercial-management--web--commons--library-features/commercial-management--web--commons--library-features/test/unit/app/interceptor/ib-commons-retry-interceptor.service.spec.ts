import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { IbCRetryInterceptorService } from "ib-web-commons/interceptor";
import { HTTP_INTERCEPTORS, HttpContext } from "@angular/common/http";
import {
  IbCPromiseBaseRestService,
  SKIP_RETRY_INTERCEPTOR,
} from "ib-web-commons/proxies";
import { AJSRootScope } from "ib-web-commons/utils";

describe("Retry interceptor tests", () => {
  let httpTestingController: HttpTestingController;
  let service: IbCPromiseBaseRestService;
  let interceptor: IbCRetryInterceptorService;

  beforeEach(() => {
    const mockRootScope = jasmine.createSpyObj("AJSRootScope", ["$broadcast"]);
    TestBed.configureTestingModule({
      providers: [
        IbCPromiseBaseRestService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: IbCRetryInterceptorService,
          multi: true,
        },
        { provide: AJSRootScope, useValue: mockRootScope },
      ],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(IbCPromiseBaseRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
    interceptor = TestBed.inject(IbCRetryInterceptorService);
  });

  describe("When a iberia response is send", () => {
    describe("and skips interceptor", () => {
      it("should make the call as normal", fakeAsync(() => {
        service
          .get("/test", {
            headers: {
              "Accept-Language": "A",
            },
            context: new HttpContext().set(SKIP_RETRY_INTERCEPTOR, true),
          })
          .catch((err) => {
            expect(err).toBeDefined();
          });
        const req = httpTestingController.expectOne("/test");
        req.flush("", { status: 408, statusText: "Not Found" });
        tick();
        expect(req.request.method).toEqual("GET");
      }));
    });

    describe("and throws error", () => {
      it("should retry the calls if error in includes", fakeAsync(() => {
        service.post("/test").catch((err) => {
          expect(err).toBeDefined();
        });
        const retryCount = 3;
        for (let i = 0; i < retryCount + 1; i++) {
          const req = httpTestingController.expectOne("/test");
          req.flush("", { status: 408, statusText: "Not Found" });
          tick(1000);
        }
      }));
      it("should continue the if error not in includes", fakeAsync(() => {
        service.put("/test").catch((err) => {
          expect(err).toBeDefined();
        });
        const req = httpTestingController.expectOne("/test");
        req.flush("", { status: 404, statusText: "Not Found" });
        tick();
      }));

      afterEach(() => {
        httpTestingController.verify();
      });
    });
  });
});
