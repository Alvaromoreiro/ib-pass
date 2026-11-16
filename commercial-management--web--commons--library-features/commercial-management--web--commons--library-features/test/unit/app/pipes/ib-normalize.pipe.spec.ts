import { IbCNormalizePipe } from "ib-web-commons/pipes";

describe("IbCNormalizePipe", () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new IbCNormalizePipe();

  it("should create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("should return normalized letters", () => {
    expect(pipe.transform("àáâãäå")).toBe("aaaaaa");
  });

  it("should return normalized vocals", () => {
    expect(pipe.transform("èéêëìíîïòóôõöùúûü")).toBe("eeeeiiiiooooouuuu");
  });

  it("should return same if no accents/diacritics input", () => {
    expect(pipe.transform("This is an example")).toBe("This is an example");
  });
});
