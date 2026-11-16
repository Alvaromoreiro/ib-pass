import { TestBed } from "@angular/core/testing";
import { IbIntlDateFormatPipe } from "ib-web-commons/pipes";
import { AJSRootScope, CommonsRootScope } from "ib-web-commons/utils";

describe("IbIntlDateFormatPipe ", () => {
  let spyRootScope: jasmine.SpyObj<CommonsRootScope>;
  let mockRootScope: CommonsRootScope;

  let pipe = new IbIntlDateFormatPipe(mockRootScope);

  beforeEach(() => {
    mockRootScope = jasmine.createSpyObj("AJSRootScope", ["$broadcast"]);
    pipe = new IbIntlDateFormatPipe(mockRootScope);
    TestBed.configureTestingModule({
      providers: [{ provide: AJSRootScope, useValue: mockRootScope }],
    });
    spyRootScope = TestBed.inject(
      AJSRootScope,
    ) as jasmine.SpyObj<CommonsRootScope>;
  });

  it("should exist", () => {
    expect(pipe).toBeTruthy();
  });

  it("should return date correctrly es-ES as string", () => {
    spyRootScope.appLang = "es";
    spyRootScope.appMarket = "ES";
    const date = "1995-12-17";
    expect(pipe.transform(date)).toBe("17/12/1995");
  });

  it("should return date correctrly es-ES  as Date", () => {
    spyRootScope.appLang = "es";
    spyRootScope.appMarket = "ES";
    const dateEs = new Date("1995-12-17");
    expect(pipe.transform(dateEs)).toBe("17/12/1995");
  });

  it("should return date correctrly en-USA", () => {
    spyRootScope.appLang = "en";
    spyRootScope.appMarket = "US";
    const dateUsa = new Date("1995-12-17");
    expect(pipe.transform(dateUsa)).toBe("12/17/1995");
  });
});
