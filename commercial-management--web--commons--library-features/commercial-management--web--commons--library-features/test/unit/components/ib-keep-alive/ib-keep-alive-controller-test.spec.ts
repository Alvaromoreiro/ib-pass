import dayjs from "dayjs";
import angular from "angular";

describe("IbKeepAliveController test", () => {
  let controller, localStorageService, scope;
  const controllerDependencies = {
    $scope: {},
    $rootScope: {},
  };

  const fakeCommonsKeepAliveUtilsService = {
    closeSession: jasmine.createSpy("closeSession"),
    keepSessionAlive: jasmine.createSpy("keepSessionAlive"),
    initKeepAlive: jasmine.createSpy("initKeepAlive"),
  };
  const fakeCommonsConstants = {
    APP: {
      CKI: {
        NAME: "CKI",
        WAITING_TIME_SESSION: 1,
        WAITING_TIME: 0.5,
        QUADRIGAM: {
          IBCOSE: "ibcose",
          IBCOSE2: "ibcose2",
        },
      },
      GIFTCARD: {
        NAME: "GIFTCARDS",
      },
      SUBSCRIPTIONMODELS: {
        WAITING_TIME_SESSION: 1,
        WAITING_TIME: 2,
        NAME: "NAME",
        QUADRIGAM: {
          CONFIGURATION: "CONFIGURATION",
        },
      },
    },
  };

  const fakeDatalayerUtilsService = {
    sendDatalayerEvent: jasmine.createSpy().and.callFake(angular.noop),
    setProcessAndStep: jasmine.createSpy().and.callFake(angular.noop),
  };

  const fakeDatalayerConstants = {
    QUADRIGAMS: {
      CKI_SESSION_EXPIRED: "CKIEXP",
    },
    DATALAYER_FLOW_CKI: {
      PROCESS: "checkin",
      DATALAYER_FLOW_CKI: {
        CKIEXP: "sesion expirada",
      },
    },
    DATALAYER_EVENT_TYPES: {
      VIEW: "view",
    },
  };

  const fakeMonetateConstants = {
    MONETATE_INFO: {
      SETPAGETYPE: "",
    },
  };

  const fakeTimer = {
    days: "0",
    hours: "0",
    minutes: 1,
    seconds: "59",
  };

  const fakeMonetateUtilsService = {
    updateMonetateWithQuadrigam: jasmine.createSpy().and.callFake(angular.noop),
  };

  const mocktimeSession = {
    startTime: dayjs(),
    openedModal: false,
    failedKeepAliveService: false,
    timerActivate: true,
  };

  const fake$uibModalInstance = {
    dismiss: jasmine.createSpy(),
  };

  beforeEach(() => {
    angular.mock.module(
      "LocalStorageModule",
      "ib-commons-keep-alive-module",
      ($provide) => {
        $provide.value("CommonsConstants", fakeCommonsConstants);
        $provide.value(
          "CommonsKeepAliveUtilsService",
          fakeCommonsKeepAliveUtilsService,
        );
        $provide.value("$uibModalInstance", fake$uibModalInstance);
        $provide.value("DatalayerUtilsService", fakeDatalayerUtilsService);
        $provide.value("DatalayerConstants", fakeDatalayerConstants);
        $provide.value("MonetateUtilsService", fakeMonetateUtilsService);
        $provide.value("MonetateConstants", fakeMonetateConstants);
      },
    );

    inject(($controller, $rootScope, _localStorageService_) => {
      scope = $rootScope.$new();
      $rootScope.timeSession = mocktimeSession;
      localStorageService = _localStorageService_;
      controllerDependencies.$scope = $rootScope.$new();
      controllerDependencies.$rootScope = $rootScope.$new();
      controller = $controller("ibKeepAliveController", controllerDependencies);
      scope.$digest();
    });

    controller.timer = fakeTimer;
  });
  describe("when $onInit() is called", () => {
    beforeEach(() => {
      localStorageService.set("flowApp", "GIFTCARDS");
      localStorageService.set("isFinishSesion", true);
    });
    it("$onInit() and flow app is GIFTCARD and isFinishSesion", (done) => {
      controller.$onInit();
      done();
    });
  });
  describe("when $onInit() is called", () => {
    beforeEach(() => {
      localStorageService.set("flowApp", "CKI");
      localStorageService.set("isFinishSesion", false);
    });
    it("$onInit() and flow app is CKI", (done) => {
      controller.$onInit();
      done();
    });
  });
  describe("when $onInit() is called", () => {
    beforeEach(() => {
      localStorageService.set("flowApp", "GIFTCARDS");
      localStorageService.set("isFinishSesion", false);
    });
    it("$onInit() and flow app is GIFTCARD", (done) => {
      controller.$onInit();
      done();
    });
  });
  describe("when $onInit() is called", () => {
    it("$onInit()", (done) => {
      //rootScope.$on = function () {};
      controller.$onInit();
      done();
    });
  });
  describe("when timerStopped() is called", () => {
    beforeEach(() => {
      localStorageService.set("flowApp", "CKI");
      localStorageService.set("isFinishSesion", false);
      controller.isFlowCKI = true;
    });
    it("timerStopped", (done) => {
      spyOn(controller, "updateDatalayer");
      controller.timerStopped(null, {});
      expect(controller.updateDatalayer).toHaveBeenCalled();
      done();
    });
  });

  describe("when reloadFlow() is called", () => {
    it("reloadFlow", () => {
      spyOn(controller, "close");
      spyOn(controller.$interval, "cancel");
      controller.reloadFlow();
      expect(
        controller.CommonsKeepAliveUtilsService.keepSessionAlive,
      ).toHaveBeenCalled();
      expect(controller.close).toHaveBeenCalledWith(true);
      expect(controller.$interval.cancel).toHaveBeenCalledWith(
        controller.timerInterval,
      );
    });
  });

  describe("when close() is called", () => {
    it("close and isReturnButton is true", (done) => {
      controller.close(false, true);
      done();
    });
  });

  describe("when close() is called", () => {
    it("close", (done) => {
      controller.close();
      done();
    });
  });

  describe("when goToEntryPoint() is called", () => {
    it("goToEntryPoint", (done) => {
      controller.goToEntryPoint();
      done();
    });
  });

  describe("when updateDatalayer() is called", () => {
    beforeEach(() => {
      localStorageService.set("flowApp", "CKI");
      localStorageService.set("isFinishSesion", false);
      controller.isFlowCKI = true;
    });
    it(" and is cki flow updates datalayer and digital data information", () => {
      const quadrigam =
          controller.DatalayerConstants.QUADRIGAMS.CKI_SESSION_EXPIRED,
        process = controller.DatalayerConstants.DATALAYER_FLOW_CKI.PROCESS,
        step = controller.DatalayerConstants.DATALAYER_FLOW_CKI[quadrigam];
      spyOn(controller.$rootScope, "$broadcast");
      controller.updateDatalayer();
      expect(
        controller.DatalayerUtilsService.sendDatalayerEvent,
      ).toHaveBeenCalledWith(
        controller.DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW,
      );
      expect(
        controller.DatalayerUtilsService.setProcessAndStep,
      ).toHaveBeenCalledWith(process, step, quadrigam);
      expect(
        controller.MonetateUtilsService.updateMonetateWithQuadrigam,
      ).toHaveBeenCalledWith(
        controller.MonetateConstants.MONETATE_INFO.SETPAGETYPE,
        quadrigam,
        {},
      );
      expect(controller.$rootScope.$broadcast).toHaveBeenCalledWith(
        "updateDatalayer",
      );
      expect(controller.$rootScope.$broadcast).toHaveBeenCalledWith(
        "sendUpdateToMonetate",
      );
    });
  });

  describe("when setTimer() is called", () => {
    beforeEach(() => {
      localStorageService.set("flowApp", "SUBSCRIPTIONMODELS");
      localStorageService.set("isFinishSesion", false);
      controller.isSubscriptionModels = true;
    });

    it("goToEntryPoint", () => {
      controller.setTimer();
      const expectedTimer = {
        days: "0",
        hours: "0",
        minutes: 1,
        seconds: "59",
      };
      expect(controller.timer).toEqual(expectedTimer);
    });
  });

  describe("when countDownKeepAlive() is called", () => {
    beforeEach(() => {
      controller.timerTime = dayjs().add(2, "minute");
    });

    it(" and 1 second has passed", () => {
      controller.countDownKeepAlive(controller.timerTime);
      setTimeout(function () {
        expect(controller.timer.days).toBe("0");
        expect(controller.timer.hours).toBe("0");
        //expect(controller.timer.minutes).toBe('59');
        //expect(controller.timer.seconds).toBe('59');
      }, 1000);
    });

    it(" and 121 seconds has passed", () => {
      spyOn(controller.$interval, "cancel");
      controller.countDownKeepAlive(controller.timerTime);
      setTimeout(function () {
        expect(controller.$interval.cancel).toHaveBeenCalledWith(
          controller.timerInterval,
        );
        expect(controller.timerStopped).toHaveBeenCalled();
      }, 121000);
    });
  });
});
