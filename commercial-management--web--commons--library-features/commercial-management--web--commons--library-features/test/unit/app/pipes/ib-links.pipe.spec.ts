import { TestBed } from "@angular/core/testing";
import { IbCLinkPipe } from "ib-web-commons/pipes";
import {
  AJSRootScope,
  CommonsRootScope,
  CommonsSessionStorageService,
} from "ib-web-commons/utils";

describe("IbCLinkPipe ", () => {
  let spyRootScope: jasmine.SpyObj<CommonsRootScope>;
  let spyCommonsSessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
  let mockRootScope: CommonsRootScope;
  let mockCommonsSessionStorageService: CommonsSessionStorageService;

  let pipe = new IbCLinkPipe(mockCommonsSessionStorageService, mockRootScope);

  beforeEach(() => {
    mockCommonsSessionStorageService = jasmine.createSpyObj(
      "CommonsSessionStorageService",
      ["get"],
    );
    mockRootScope = jasmine.createSpyObj("AJSRootScope", ["$broadcast"]);
    pipe = new IbCLinkPipe(mockCommonsSessionStorageService, mockRootScope);
    TestBed.configureTestingModule({
      providers: [
        { provide: AJSRootScope, useValue: mockRootScope },
        {
          provide: CommonsSessionStorageService,
          useValue: mockCommonsSessionStorageService,
        },
      ],
    });
    spyRootScope = TestBed.inject(
      AJSRootScope,
    ) as jasmine.SpyObj<CommonsRootScope>;
    spyCommonsSessionStorageService = TestBed.inject(
      CommonsSessionStorageService,
    ) as jasmine.SpyObj<CommonsSessionStorageService>;
  });

  it("should exist", () => {
    expect(pipe).toBeTruthy();
  });

  it("should return /example link", () => {
    spyCommonsSessionStorageService.get.and.returnValue({
      "1": {
        needsMarket: false,
        needsOrigin: false,
        uri: "/example",
      },
    });
    const link = "1";
    expect(pipe.transform(link)).toBe("/example");
  });

  it("should return /example link with origin and market", () => {
    spyRootScope.appMarket = "ES";
    spyCommonsSessionStorageService.get.and.returnValue({
      "1": {
        needsMarket: true,
        needsOrigin: true,
        uri: "/example",
      },
    });
    const link = "1";
    expect(pipe.transform(link, { withMarket: true, withOrigin: true })).toBe(
      "http://" +
        location.host +
        "/" +
        spyRootScope.appMarket.toLowerCase() +
        "/example",
    );
  });
});
