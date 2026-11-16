import { IbCCapitalizePipe } from "ib-web-commons/pipes";

describe("IbCCapitalizePipe", () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new IbCCapitalizePipe();

  it("should create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("should return capitalized word", () => {
    expect(pipe.transform("example")).toBe("Example");
  });

  it("should return capitalized large string", () => {
    expect(pipe.transform("this is an example")).toBe("This is an example");
  });

  it("should return same if undefined input", () => {
    expect(pipe.transform(undefined)).toBe(undefined);
  });
});
