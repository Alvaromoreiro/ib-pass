import { TestBed } from "@angular/core/testing";
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import { DatalayerUniqueKeysService } from "src/app/core/ib-datalayer/services/ib-datalayer-unique-keys.service";

describe("Test DatalayerUniqueKeysService", () => {
  let service: DatalayerUniqueKeysService;

  const STORAGE_KEY = "datalayerUniqueKeys";

  const mockCommonsSessionStorageService = jasmine.createSpyObj(
    "CommonsSessionStorageService",
    ["set", "get", "remove"],
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatalayerUniqueKeysService,
        {
          provide: CommonsSessionStorageService,
          useValue: mockCommonsSessionStorageService,
        },
      ],
    });
    service = TestBed.inject(DatalayerUniqueKeysService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("should not exist value by empty", () => {
    it("by empty value", () => {
      mockCommonsSessionStorageService.get.and.returnValue(null);

      expect(service.exists("value", "key")).toBeFalse();
    });

    it("by nonexistent key", () => {
      mockCommonsSessionStorageService.get.and.returnValue({
        UNUSED: ["value"],
      });

      expect(service.exists("value", "ANCILLARIES")).toBeFalse();
    });

    it("by existent key and missing subkey", () => {
      mockCommonsSessionStorageService.get.and.returnValue({
        ANCILLARIES: {
          CO2_FOOTPRINT: ["value"],
        },
      });

      expect(service.exists("value", "ANCILLARIES")).toBeFalse();
    });

    it("by existent key and nonexistent subkey", () => {
      mockCommonsSessionStorageService.get.and.returnValue({
        ANCILLARIES: {
          CO2_FOOTPRINT: ["value"],
        },
      });

      expect(service.exists("value", "ANCILLARIES", "BOB")).toBeFalse();
    });

    it("by existent key and existent subkey and unexistent value", () => {
      mockCommonsSessionStorageService.get.and.returnValue({
        ANCILLARIES: {
          CO2_FOOTPRINT: ["valueA"],
        },
      });

      expect(
        service.exists("valueB", "ANCILLARIES", "CO2_FOOTPRINT"),
      ).toBeFalse();
    });
  });

  describe("should exist value", () => {
    it("by key", () => {
      mockCommonsSessionStorageService.get.and.returnValue({
        ANCILLARIES: ["value"],
      });

      expect(service.exists("value", "ANCILLARIES")).toBeTrue();
    });

    it("by key and subkey", () => {
      mockCommonsSessionStorageService.get.and.returnValue({
        ANCILLARIES: {
          CO2_FOOTPRINT: ["value"],
        },
      });

      expect(
        service.exists("value", "ANCILLARIES", "CO2_FOOTPRINT"),
      ).toBeTrue();
    });
  });

  describe("should set value with storage cleared", () => {
    beforeEach(() => {
      mockCommonsSessionStorageService.get.and.returnValue(null);
    });

    it("by key", () => {
      const expectedValue = {
        ANCILLARIES: ["value"],
      };

      service.setValue("value", "ANCILLARIES");

      expect(mockCommonsSessionStorageService.set).toHaveBeenCalledWith(
        STORAGE_KEY,
        expectedValue,
      );
    });

    it("by key and subkey", () => {
      const expectedValue = {
        ANCILLARIES: {
          CO2_FOOTPRINT: ["value"],
        },
      };

      service.setValue("value", "ANCILLARIES", "CO2_FOOTPRINT");

      expect(mockCommonsSessionStorageService.set).toHaveBeenCalledWith(
        STORAGE_KEY,
        expectedValue,
      );
    });
  });

  describe("should set value with existing storage", () => {
    it("by key and unregistered key", () => {
      mockCommonsSessionStorageService.get.and.returnValue({
        UNUSED: ["unusedValue"],
      });

      const expectedValue = {
        UNUSED: ["unusedValue"],
        ANCILLARIES: ["value"],
      };

      service.setValue("value", "ANCILLARIES");

      expect(mockCommonsSessionStorageService.set).toHaveBeenCalledWith(
        STORAGE_KEY,
        expectedValue,
      );
    });

    it("by key and registered key", () => {
      mockCommonsSessionStorageService.get.and.returnValue({
        UNUSED: ["unusedValue"],
        ANCILLARIES: ["valueA"],
      });

      const expectedValue = {
        UNUSED: ["unusedValue"],
        ANCILLARIES: ["valueA", "valueB"],
      };

      service.setValue("valueB", "ANCILLARIES");

      expect(mockCommonsSessionStorageService.set).toHaveBeenCalledWith(
        STORAGE_KEY,
        expectedValue,
      );
    });

    it("by key and registered key and unrepeated value", () => {
      mockCommonsSessionStorageService.get.and.returnValue({
        UNUSED: ["unusedValue"],
        ANCILLARIES: ["valueA"],
      });

      const expectedValue = {
        UNUSED: ["unusedValue"],
        ANCILLARIES: ["valueA", "valueB"],
      };

      service.setValue("valueB", "ANCILLARIES");

      expect(mockCommonsSessionStorageService.set).toHaveBeenCalledWith(
        STORAGE_KEY,
        expectedValue,
      );
    });

    it("by key and registered key and repeated value", () => {
      mockCommonsSessionStorageService.get.and.returnValue({
        UNUSED: ["unusedValue"],
        ANCILLARIES: ["value"],
      });

      const expectedValue = {
        UNUSED: ["unusedValue"],
        ANCILLARIES: ["value"],
      };

      service.setValue("value", "ANCILLARIES");

      expect(mockCommonsSessionStorageService.set).toHaveBeenCalledWith(
        STORAGE_KEY,
        expectedValue,
      );
    });

    it("by key and subkey, and unregistered key", () => {
      mockCommonsSessionStorageService.get.and.returnValue({
        UNUSED: ["unusedValue"],
      });

      const expectedValue = {
        UNUSED: ["unusedValue"],
        ANCILLARIES: {
          CO2_FOOTPRINT: ["value"],
        },
      };

      service.setValue("value", "ANCILLARIES", "CO2_FOOTPRINT");

      expect(mockCommonsSessionStorageService.set).toHaveBeenCalledWith(
        STORAGE_KEY,
        expectedValue,
      );
    });

    it("by key and subkey, and registered key and unregistered subkey", () => {
      mockCommonsSessionStorageService.get.and.returnValue({
        UNUSED: ["unusedValue"],
        ANCILLARIES: {
          CO2_FOOTPRINT: ["valueCO2"],
        },
      });

      const expectedValue = {
        UNUSED: ["unusedValue"],
        ANCILLARIES: {
          CO2_FOOTPRINT: ["valueCO2"],
          BOB: ["valueBOB"],
        },
      };

      service.setValue("valueBOB", "ANCILLARIES", "BOB");

      expect(mockCommonsSessionStorageService.set).toHaveBeenCalledWith(
        STORAGE_KEY,
        expectedValue,
      );
    });

    it("by key and subkey, and registered key and registered subkey, and unrepeated value", () => {
      mockCommonsSessionStorageService.get.and.returnValue({
        UNUSED: ["unusedValue"],
        ANCILLARIES: {
          CO2_FOOTPRINT: ["valueCO2"],
          BOB: ["valueBOBA"],
        },
      });

      const expectedValue = {
        UNUSED: ["unusedValue"],
        ANCILLARIES: {
          CO2_FOOTPRINT: ["valueCO2"],
          BOB: ["valueBOBA", "valueBOBB"],
        },
      };

      service.setValue("valueBOBB", "ANCILLARIES", "BOB");

      expect(mockCommonsSessionStorageService.set).toHaveBeenCalledWith(
        STORAGE_KEY,
        expectedValue,
      );
    });

    it("by key and subkey, and registered key and registered subkey, and repeated value", () => {
      mockCommonsSessionStorageService.get.and.returnValue({
        UNUSED: ["unusedValue"],
        ANCILLARIES: {
          CO2_FOOTPRINT: ["valueCO2"],
          BOB: ["valueBOB"],
        },
      });

      const expectedValue = {
        UNUSED: ["unusedValue"],
        ANCILLARIES: {
          CO2_FOOTPRINT: ["valueCO2"],
          BOB: ["valueBOB"],
        },
      };

      service.setValue("valueBOB", "ANCILLARIES", "BOB");

      expect(mockCommonsSessionStorageService.set).toHaveBeenCalledWith(
        STORAGE_KEY,
        expectedValue,
      );
    });
  });

  it("should clear storage", () => {
    service.clear();

    expect(mockCommonsSessionStorageService.remove).toHaveBeenCalled();
  });
});
