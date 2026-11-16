describe("CitySelectorComponentController test", () => {
  let controller, scope;
  let controllerDependencies = {
    $scope: {
      $emit: jasmine.createSpy("$emit"),
    },
    $timeout: {},
  };
  let bindings = {};
  let fakeWindow = {
    innerWidth: 1024,
  };
  let fakeElement = [{
    addEventListener: jasmine.createSpy("addEventListener"),
    removeEventListener: jasmine.createSpy("removeEventListener"),
  }];

  const fakeCitySelectorConstants = {
    ORIGIN: "origin",
    DESTINY: "destiny",
  };

  beforeEach(() => {
    angular.mock.module("ib-ui-city-selector-component-module", ($provide) => {
      $provide.value("CitySelectorConstants", fakeCitySelectorConstants);
      $provide.value("$window", fakeWindow);
      $provide.value("$element", fakeElement);
    });
    inject(($rootScope, $componentController, $timeout) => {
      scope = $rootScope.$new();
      controllerDependencies.$scope = scope;
      controllerDependencies.$timeout = $timeout;
      controller = $componentController(
        "ibUiCitySelectorComponent",
        controllerDependencies,
        bindings,
      );
      scope.$digest();
    });
  });

  describe("When controller is called ", () => {
    it(", it will be defined", () => {
      controller.$onInit();
      expect(controller).toBeDefined();
    });
  });
  describe("When enableFocus is called ", () => {
    it(", input will be focused", () => {
      controller.enableFocus();
      expect(controller.focused).toBeTrue();
    });
  });
  describe("When disableFocus is called ", () => {
    it(", input will be focused", () => {
      controller.disableFocus();
      expect(controller.focused).toBeFalse();
    });
  });
  describe("When updateSelection is called ", () => {
    it(", it will update city selected ", () => {
      spyOn(controllerDependencies.$scope, "$emit");
      controller.isOrigin = true;
      controller.citySelected = "MAD";
      controller.index = 0;
      controller.updateSelection();
      expect(controllerDependencies.$scope.$emit).toHaveBeenCalledWith(
        "updateSelectedCity",
        "MAD",
        0,
      );
    });
  });
  describe("When changeLetter is called", () => {
    it(", it will be set letterSelected ", () => {
      controller.changeLetter("uno");
      expect(controller.letterSelected).toEqual("uno");
    });
  });
  describe("When validatorInput is called", () => {
    beforeEach(() => {
      controller.index = 0;
      controller.containerForm = ["selector_city_0", "selector_city_1"];
      controller.containerForm["selector_city_0"] = {
        $submitted: false,
        $setValidity: () => {},
      };
    });
    it("and it is not city selected, it will be invalid", () => {
      spyOn(controller.containerForm["selector_city_0"], "$setValidity");
      controller.citySelected = null;
      controller.validatorInput();
      expect(
        controller.containerForm["selector_city_0"].$setValidity,
      ).toHaveBeenCalledWith("invalid", false);
    });
    it("and it is city selected, it will be valid", () => {
      spyOn(controller.containerForm["selector_city_0"], "$setValidity");
      controller.citySelected = { origin: "MAD", destiny: "PAR" };
      controller.validatorInput();
      expect(
        controller.containerForm["selector_city_0"].$setValidity,
      ).toHaveBeenCalledWith("invalid", true);
    });
  });
  describe("When changeGroup is called", () => {
    it(", it will be set group ", () => {
      controller.changeGroup(new Event("event"), "group");
      expect(controller.group).toEqual("group");
    });
  });
  describe("When filterGroup is called", () => {
    it(" and group is defined, it will be filtered by group ", () => {
      controller.group = "Europe";
      let returnData = controller.filterGroup({ group: "Europe" });
      expect(returnData).toBeTrue();
    });
    it(" and group is undefined, it will be filtered by selected group ", () => {
      controller.group = undefined;
      let returnData = controller.filterGroup({ group: "Europe" });
      expect(returnData).toEqual({ group: undefined });
    });
  });
  describe("When onSelect is called", () => {
    it(", it will update selected city", () => {
      controller.citySelected = {
        code: "MAD",
      };
      controller.search = () => {};
      controller.onSelect();
      expect(controller.active).toBeTrue();
    });
  });
  describe("When selectCity is called", () => {
    it(", it will update selected city", () => {
      const citySelected = {
        code: "BCN",
      };
      controller.citySelected = {
        code: "MAD",
      };
      controller.index = 0;
      controller.containerForm = ["selector_city_0", "selector_city_1"];
      controller.containerForm["selector_city_0"] = {
        $submitted: false,
        $setValidity: () => {},
      };
      controller.search = () => {};
      controller.selectCity(new Event("event"), citySelected);
      expect(controller.isOpen).toBeFalse();
    });
  });
  describe("When openCollapse is called", () => {
    it(", it will open collapse ", () => {
      fakeWindow.innerWidth = 600;
      controller.openCollapse();
      expect(controller.loadingFilter).toBeTrue();
    });
  });
  describe("When changeCountry is called", () => {
    it(", it will open collapse ", () => {
      const group = "group";
      controller.changeCountry(group, new Event("event"));
      expect(controller.loadingFilter).toBeFalse();
    });
  });
  describe("When checkSpecialCharacters is called", () => {
    it(", it will open collapse ", () => {
      const returnData = controller.checkSpecialCharacters("tíldés", "tildes");
      expect(returnData).toBeTrue();
    });
  });
  describe("When filterValue is called", () => {
    it(", it will return a boolean if city is equal than citySelected", () => {
      controller.citySelected = "MAD";
      const returnData = controller.filterValue({
        description: "Madrid",
        code: "MAD",
      });
      expect(returnData).toBeTrue();
    });
  });
  describe("When onChange is called", () => {
    it(", it will return a boolean if city is equal than citySelected", () => {
      controller.citySelected = undefined;
      controller.search = jasmine.createSpy("search").and.callFake(() => {});
      controller.onChange();
      expect(controller.search).toBeDefined();
    });
  });
});
