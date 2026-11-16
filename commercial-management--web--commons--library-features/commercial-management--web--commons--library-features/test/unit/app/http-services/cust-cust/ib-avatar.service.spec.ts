import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AJSRootScope } from "ib-web-commons/utils";
import { IbAvatarService } from "ib-web-commons/http-services";
import { AvatarResponse } from "ib-web-commons/models";

const fakeRootScope = jasmine.createSpyObj("AJSRootScope", ["$broadcast"]);

describe("IbAvatarService", () => {
  let service: IbAvatarService;
  let httpMock: HttpTestingController;

  const createFakeFile = (fileName: string = "fileName"): FormData => {
    const blob = new Blob([""], { type: "image" });
    blob["lastModifiedDate"] = "";
    blob["name"] = fileName;
    const formData = new FormData();
    formData.append("fileUpload", blob, fileName);
    return formData;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        IbAvatarService,
        { provide: AJSRootScope, useValue: fakeRootScope },
      ],
    });
    service = TestBed.inject(IbAvatarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("#getAvatarImg should be GET and give 200 code with image as blob", fakeAsync(() => {
    const blob = new Blob([""], { type: "image" });

    const mockedResp: AvatarResponse = {
      image: blob,
      status: 200,
    };

    service.getAvatarImg().subscribe((res) => expect(res).toEqual(mockedResp));

    const req = httpMock.expectOne(() => true);

    expect(req.request.method).toEqual("GET");

    req.flush(blob);
  }));

  it("#getAvatarImg should be GET and give 204 code with no image", fakeAsync(() => {
    const mockedResp: AvatarResponse = {
      image: null,
      status: 204,
    };

    service.getAvatarImg().subscribe((res) => expect(res).toEqual(mockedResp));

    const req = httpMock.expectOne(() => true);

    expect(req.request.method).toEqual("GET");

    req.flush(null);
  }));

  it("#postAvatarImg should POST user file", fakeAsync(() => {
    service.postAvatarImg(createFakeFile()).subscribe((res) => tick());

    const req = httpMock.expectOne(() => true);

    expect(req.request.method).toEqual("POST");

    req.flush(null);
  }));
});
