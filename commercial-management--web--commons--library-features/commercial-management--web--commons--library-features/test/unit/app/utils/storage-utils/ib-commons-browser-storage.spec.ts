import { TestBed } from "@angular/core/testing";
import { CommonsBrowserStorageService } from "ib-web-commons/utils";

describe("CommonsBrowserStorageService", () => {
  it("#get should call localStorage.getItem() and return item", () => {
    spyOn(localStorage, "getItem").and.callFake(() => {
      return "item";
    });

    const service = TestBed.inject(CommonsBrowserStorageService);
    const result = service.get("test");
    expect(result).toBe("item");
    expect(localStorage.getItem).toHaveBeenCalledWith("test");
  });

  it("#set should call localStorage.setItem() ", () => {
    spyOn(localStorage, "setItem").and.callFake(() => {});

    const service = TestBed.inject(CommonsBrowserStorageService);
    service.set("key", "test");
    expect(localStorage.setItem).toHaveBeenCalledWith("key", "test");
  });

  it("#getObject should call localStorage.getItem(), JSON.parse() and return item", () => {
    spyOn(localStorage, "getItem").and.callFake(() => {
      return '"item"';
    });
    spyOn(JSON, "parse").and.callThrough();

    const service = TestBed.inject(CommonsBrowserStorageService);
    service.getObject("key");
    expect(JSON.parse).toHaveBeenCalledWith('"item"');
    expect(localStorage.getItem).toHaveBeenCalledWith("key");
  });

  it("#setObject should call localStorage.getItem() and JSON.stringify()", () => {
    spyOn(localStorage, "setItem").and.callFake(() => {});
    spyOn(JSON, "stringify").and.callThrough();

    const service = TestBed.inject(CommonsBrowserStorageService);
    service.setObject("key", "test");
    expect(JSON.stringify).toHaveBeenCalledWith("test");
    expect(localStorage.setItem).toHaveBeenCalledWith("key", '"test"');
  });

  it("#remove should call localStorage.removeItem()", () => {
    spyOn(localStorage, "removeItem").and.callFake(() => {});

    const service = TestBed.inject(CommonsBrowserStorageService);
    service.remove("test");
    expect(localStorage.removeItem).toHaveBeenCalledWith("test");
  });

  it("#clearAll should call localStorage.remove()", () => {
    localStorage.setItem("test", "test");
    spyOn(localStorage, "removeItem").and.callFake(() => {});

    const service = TestBed.inject(CommonsBrowserStorageService);
    service.clearAll();
    expect(localStorage.removeItem).toHaveBeenCalledWith("test");
  });
  it("#clear should call localStorage.clear()", () => {
    spyOn(localStorage, "clear").and.callFake(() => {});
    const service = TestBed.inject(CommonsBrowserStorageService);
    service.clear();
    expect(localStorage.clear).toHaveBeenCalled();
  });
});
