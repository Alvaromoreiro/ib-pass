import {
  AJSRootScope,
  CommonsRootScope,
} from "src/app/core/utils/ajs-upgrade/ib-commons-root-scope-bridge";
import { IbCAviosFormatPipe } from "src/app/core/pipes/ib-commons-avios-format.pipe";
import { IbCIntlNumberFormatPipe } from "src/app/core/pipes/ib-intl-number-format.pipe";
import { TestBed } from "@angular/core/testing";

describe("IbCAviosFormatPipe tests", () => {
  let spyRootScope: jasmine.SpyObj<CommonsRootScope>;
  let fakeRootScope: CommonsRootScope;
  let pipe: IbCAviosFormatPipe;

  beforeEach(() => {
    fakeRootScope = jasmine.createSpyObj("AJSRootScope", ["$broadcast"]);
    TestBed.configureTestingModule({
      providers: [
        IbCAviosFormatPipe,
        IbCIntlNumberFormatPipe,
        { provide: AJSRootScope, useValue: fakeRootScope },
      ],
    });
    pipe = TestBed.inject(IbCAviosFormatPipe);
    spyRootScope = TestBed.inject(
      AJSRootScope,
    ) as jasmine.SpyObj<CommonsRootScope>;
  });

  it("should exist", () => {
    expect(pipe).toBeTruthy();
  });

  it("and not avios, should return empty", () => {
    spyRootScope.appLang = "es";
    spyRootScope.appMarket = "ES";
    expect(pipe.transform(null)).toBe("");
  });

  it("should return number of avios correctly es-ES as string", () => {
    spyRootScope.appLang = "es";
    spyRootScope.appMarket = "ES";
    expect(pipe.transform(15000)).toBe("15.000");
  });

  it("should return number of avios correctly en-US as string", () => {
    spyRootScope.appLang = "en";
    spyRootScope.appMarket = "US";
    expect(pipe.transform(15000)).toBe("15,000");
  });

  it("and not integer string as input, should return input", () => {
    spyRootScope.appLang = "en";
    spyRootScope.appMarket = "US";
    expect(pipe.transform("!15")).toBe("!15");
  });
});
