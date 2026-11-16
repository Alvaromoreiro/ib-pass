import { TestBed } from "@angular/core/testing";
import { IbCUserSuffixPipe } from "ib-web-commons/pipes";
import { IbCUserUtilsService } from "ib-web-commons/utils";

describe("IbCUserSuffixPipe ", () => {
  let spyIbCUserUtilsService: jasmine.SpyObj<IbCUserUtilsService>;
  let mockIbCUserUtilsService: IbCUserUtilsService;

  let pipe = new IbCUserSuffixPipe(mockIbCUserUtilsService);

  beforeEach(() => {
    mockIbCUserUtilsService = jasmine.createSpyObj("IbCUserUtilsService", [
      "isIbPlus",
      "isIbZero",
    ]);
    pipe = new IbCUserSuffixPipe(mockIbCUserUtilsService);
    TestBed.configureTestingModule({
      providers: [
        { provide: IbCUserUtilsService, useValue: mockIbCUserUtilsService },
      ],
    });
    spyIbCUserUtilsService = TestBed.inject(
      IbCUserUtilsService,
    ) as jasmine.SpyObj<IbCUserUtilsService>;
  });

  it("should exist", () => {
    expect(pipe).toBeTruthy();
  });

  it("should return EXAMPLE_IB_PLUS because user is IBPLUS", () => {
    spyIbCUserUtilsService.isIbPlus.and.returnValue(true);
    expect(pipe.transform("EXAMPLE")).toBe("EXAMPLE_IB_PLUS");
  });

  it("should return EXAMPLE_IB_ZERO because user is IBZERO", () => {
    spyIbCUserUtilsService.isIbZero.and.returnValue(true);
    expect(pipe.transform("EXAMPLE")).toBe("EXAMPLE_IB_ZERO");
  });

  it("should return same string because user isnt IBPLUS or IBZERO ", () => {
    spyIbCUserUtilsService.isIbZero.and.returnValue(false);
    spyIbCUserUtilsService.isIbPlus.and.returnValue(false);
    expect(pipe.transform("EXAMPLE")).toBe("EXAMPLE");
  });
});
