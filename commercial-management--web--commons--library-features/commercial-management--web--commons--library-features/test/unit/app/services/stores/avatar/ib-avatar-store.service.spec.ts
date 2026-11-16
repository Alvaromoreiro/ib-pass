import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AJSRootScope } from "ib-web-commons/utils";
import { IbAvatarStoreService } from "ib-web-commons/services";
import { IbAvatarService } from "ib-web-commons/http-services";
import { of } from "rxjs";

const fakeRootScope = jasmine.createSpyObj("AJSRootScope", ["$broadcast"]);

describe("IbAvatarStoreService test", () => {
  let service: IbAvatarStoreService;
  let httpService: IbAvatarService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        IbAvatarStoreService,
        IbAvatarService,
        { provide: AJSRootScope, useValue: fakeRootScope },
      ],
    });
    service = TestBed.inject(IbAvatarStoreService);
    httpService = TestBed.inject(IbAvatarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("[CPA-229] should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("[CPA-229] #getAvatar call", () => {
    beforeEach(() => {
      spyOn<any>(service, "transformBlobToSrc").and.callThrough();
      spyOn(service, "deleteAvatarURL").and.callThrough();
    });

    it("and no cached avatar, should request server avatar and cache it", fakeAsync(() => {
      localStorage.setItem("ib-avatar-cache", null);
      service.getAvatar().subscribe({
        next: (res) => {
          expect(res).toBeDefined();
          expect(localStorage.getItem("ib-avatar-cache")).toEqual(
            "data:image/png;base64,MTIzNDU=",
          );
        },
      });
      const req = httpMock.expectOne(() => true);

      expect(req.request.method).toEqual("GET");

      req.flush(new Blob(["12345"], { type: "image/png" }));
      tick();
    }));

    it("and no cached avatar and server returns similar to default avatar but different, should request server avatar and cache it", fakeAsync(() => {
      localStorage.setItem("ib-avatar-cache", null);
      service.getAvatar().subscribe({
        next: (res) => {
          expect(res).toBeDefined();
          expect(localStorage.getItem("ib-avatar-cache")).toEqual(
            "data:application/octet-stream;base64,MTIzNDU=",
          );
        },
      });
      const req = httpMock.expectOne(() => true);

      expect(req.request.method).toEqual("GET");
      const blob = new Blob(["12345"]);
      Object.defineProperty(blob, "size", { value: 2207 });
      Object.defineProperty(blob, "type", { value: "image/jpg" });

      req.flush(blob, { status: 204, statusText: "NO_CONTENT" });
      tick();
    }));

    it("and no cached avatar and server returns similar to default avatar but different, should request server avatar and cache EMPTY", fakeAsync(() => {
      localStorage.setItem("ib-avatar-cache", null);
      spyOn<IbAvatarStoreService, any>(
        service,
        "transformBlobToBase64",
      ).and.returnValue(
        of(
          "data:image/jpg;base64,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",
        ),
      );
      service.getAvatar().subscribe({
        next: (res) => {
          expect(res).toBeDefined();
          expect(localStorage.getItem("ib-avatar-cache")).toEqual("EMPTY");
        },
      });
      const req = httpMock.expectOne(() => true);

      expect(req.request.method).toEqual("GET");
      const blob = new Blob(["12345"]);
      Object.defineProperty(blob, "size", { value: 2207 });
      Object.defineProperty(blob, "type", { value: "image/jpg" });

      req.flush(blob, { status: 204, statusText: "NO_CONTENT" });
      tick();
    }));

    it("and no cached avatar and server returns no content, should request server avatar, cache EMPTY and complete without next", fakeAsync(() => {
      localStorage.setItem("ib-avatar-cache", null);
      service.getAvatar().subscribe({
        next: (res) => {
          expect(res).toBeDefined();
          expect(localStorage.getItem("ib-avatar-cache")).toEqual("EMPTY");
        },
      });
      const req = httpMock.expectOne(() => true);

      expect(req.request.method).toEqual("GET");

      req.flush(null, { status: 204, statusText: "NO_CONTENT" });
      tick();
    }));

    /**
     * Making test async because fakeAsync does not work well with promises
     */
    it("and cached avatar image, should return the cached avatar without requesting", (done: DoneFn) => {
      localStorage.setItem("ib-avatar-cache", "data:image/png;base64,MTIzNDU=");
      spyOn<any>(service, "transformBase64ToBlob").and.callThrough();

      service.getAvatar().subscribe({
        next: (res) => {
          httpMock.expectNone(() => true);
          expect(service["transformBase64ToBlob"]).toHaveBeenCalled();
          expect(service["transformBlobToSrc"]).toHaveBeenCalled();
          expect(service.deleteAvatarURL).toHaveBeenCalled();
          expect(res).toBeDefined();
          done();
        },
      });
    });

    it("and cached avatar empty, should not return a value", fakeAsync(() => {
      localStorage.setItem("ib-avatar-cache", "EMPTY");
      spyOn<any>(service, "transformBase64ToBlob").and.callThrough();
      spyOn(window.URL, "createObjectURL").and.callThrough();

      service.getAvatar().subscribe();
      httpMock.expectNone(() => true);
      tick();
      expect(service["transformBase64ToBlob"]).not.toHaveBeenCalled();
      expect(window.URL.createObjectURL).not.toHaveBeenCalled();
    }));

    it("and cached avatar throws error decodifyng, should call to server to new value", fakeAsync(() => {
      spyOn<any>(service, "transformBase64ToBlob").and.throwError(
        "ERROR_PROVOKED",
      );
      localStorage.setItem("ib-avatar-cache", "TESTING_ERROR");

      service.getAvatar().subscribe({
        next: (res) => {
          expect(res).toBeDefined();
          expect(localStorage.getItem("ib-avatar-cache")).toEqual(
            "data:image/png;base64,MTIzNDU=",
          );
        },
      });
      const req = httpMock.expectOne(() => true);

      expect(req.request.method).toEqual("GET");

      req.flush(new Blob(["12345"], { type: "image/png" }));
      tick();
    }));
  });

  describe("[CPA-229] #removeAvatarCache called", () => {
    it("and cache server image, should clear cache", () => {
      localStorage.setItem("ib-avatar-cache", "EMPTY");
      service.removeAvatarCache();

      expect(localStorage.getItem("ib-avatar-cache")).toBeNull();
    });

    it("and cache server image and url link, should clear cache and clean url link", () => {
      localStorage.setItem("ib-avatar-cache", "EMPTY");
      spyOn(window.URL, "revokeObjectURL").and.callThrough();
      service["objectUrl"] = "HAS_URL";
      service.removeAvatarCache();

      expect(localStorage.getItem("ib-avatar-cache")).toBeNull();
      expect(service["objectUrl"]).not.toBeDefined();
      expect(window.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  describe("[CPA-229] #updateAvatar called", () => {
    beforeEach(() => {
      spyOn(document, "dispatchEvent").and.callThrough();
    });

    it("and new Image to update and the server response is ok, should emit event and return new url", (done: DoneFn) => {
      const mockedEvent = {
        target: {
          files: [new File(["FOO"], "mocked_file"), { type: "image/png" }],
        },
      } as unknown as Event;

      service.updateAvatar(mockedEvent).subscribe((res) => {
        expect(document.dispatchEvent).toHaveBeenCalled();
        expect(res).toBeDefined();
        done();
      });
      const req = httpMock.expectOne(() => true);

      expect(req.request.method).toEqual("POST");
      req.flush("");
    });

    it("and no image and the server response is ok, should emit event and return new url with empty blob", (done: DoneFn) => {
      const mockedEvent = {
        target: {
          files: [],
        },
      } as unknown as Event;

      service.updateAvatar(mockedEvent).subscribe((res) => {
        expect(document.dispatchEvent).toHaveBeenCalled();
        expect(res).toBeDefined();
        done();
      });
      const req = httpMock.expectOne(() => true);

      expect(req.request.method).toEqual("POST");
      req.flush("");
    });

    it("and no files, should emit event and return new url with empty blob", (done: DoneFn) => {
      const mockedEvent = {
        target: {},
      } as unknown as Event;

      service.updateAvatar(mockedEvent).subscribe((res) => {
        expect(document.dispatchEvent).toHaveBeenCalled();
        expect(res).toBeDefined();
        done();
      });
      const req = httpMock.expectOne(() => true);

      expect(req.request.method).toEqual("POST");
      req.flush("");
    });
  });
});
