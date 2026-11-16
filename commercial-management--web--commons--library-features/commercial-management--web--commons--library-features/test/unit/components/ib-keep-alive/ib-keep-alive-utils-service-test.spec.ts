import dayjs, { Dayjs } from "dayjs";
import angular from "angular";

describe("CommonsKeepAliveUtilsService test", () => {
  let CommonsKeepAliveUtilsService,
    rootScope,
    location,
    interval,
    localStorageService,
    q,
    CommonsKeepAliveService;

  const fakeCommonsModalService = {
    closeAllCurrentModals: jasmine
      .createSpy("closeAllCurrentModals")
      .and.callFake(angular.noop),
    showWaitingModal: jasmine
      .createSpy("showWaitingModal")
      .and.callFake(angular.noop),
    openBuildGenericModal: jasmine
      .createSpy("openBuildGenericModal")
      .and.callFake(angular.noop),
    finishWaiting: jasmine
      .createSpy("finishWaiting")
      .and.callFake(angular.noop),
  };
  const fakeCommonsConstants = {
    APP: {
      CKI: {
        NAME: "CKI",
        WAITING_TIME_SESSION: 2,
        WAITING_TIME: 2,
        QUADRIGAM: {
          IBCOSE: "ibcose",
          IBCOSE2: "ibcose2",
        },
      },
      GIFTCARD: {
        NAME: "NAME",
        QUADRIGAM: {
          CONFIGURATION: "CONFIGURATION",
        },
      },
      SUBSCRIPTIONMODELS: {
        NAME: "NAME",
        QUADRIGAM: {
          CONFIGURATION: "CONFIGURATION",
        },
      },
    },
    APP_TYPES: {
      BOOKING: "BBKI",
      MANAGEMYBOOKING: "MMB",
      MANAGEMYBOOKING_ONHOLD: "MMBOH",
      MANAGEMYBOOKING_ANCILLARIES: "MMBANC",
      MANAGEMYBOOKING_VOLUNTARY_CHANGE: "MMBVC",
      MANAGEMYBOOKING_BIDS: "MMBBID",
      ONHOLD: "BBKIOH",
      CHECKIN: "CKI",
      SHUTTLE_OPEN: "PAOB",
      SHUTTLE_OPEN_ONB: "PAOBONB",
      SHUTTLE_REDEMPTION: "PARE",
      SHUTTLE_REDEMPTION_ONB: "PAREONB",
      GIFTCARDS: "GIFTCARDS",
    },
  };
  const fakeCommonsKeepAliveService = {
    keepAlive: jasmine.createSpy("keepAlive"),
    closeSession: jasmine.createSpy("closeSession"),
  };
  const fakeDataLayerService = {
    getDatalayerGeneral: jasmine
      .createSpy("getDatalayerGeneral")
      .and.callFake(() => {
        return {};
      }),
  };

  beforeEach(() => {
    angular.mock.module(
      "ib-commons-keep-alive-module",
      "LocalStorageModule",
      ($provide) => {
        $provide.value("CommonsModalService", fakeCommonsModalService);
        $provide.value("CommonsConstants", fakeCommonsConstants);
        $provide.value("CommonsKeepAliveService", fakeCommonsKeepAliveService);
        $provide.value("DataLayerService", fakeDataLayerService);
      },
    );

    inject(
      (
        $rootScope,
        $location,
        $interval,
        _localStorageService_,
        _CommonsKeepAliveUtilsService_,
        $q,
      ) => {
        CommonsKeepAliveUtilsService = _CommonsKeepAliveUtilsService_;
        rootScope = $rootScope;
        location = $location;
        interval = $interval;
        localStorageService = _localStorageService_;
        q = $q;

        fakeCommonsKeepAliveService.keepAlive = jasmine
          .createSpy("keepAlive")
          .and.callFake(() => {
            const defer = $q.defer();
            defer.resolve("Data");
            return defer.promise;
          });
      },
    );
    rootScope.timeSession = {
      startTime: dayjs(),
      openedModal: false,
      failedKeepAliveService: false,
      timerActivate: true,
    };
    rootScope.keepAlive = "";
    localStorageService.set("flowApp", "CKI");
    localStorageService.set("actualStepFlow", "ibcose");
    localStorageService.set("flowId", "flowId");
  });

  describe("when initKeepAlive() is called", () => {
    describe("when evaluate flowApp", () => {
      it("switch case CKI", (done) => {
        CommonsKeepAliveUtilsService.initKeepAlive();
        interval.flush(100);
        done();
      });
    });
    describe("when evaluate flowApp", () => {
      beforeEach(() => {
        localStorageService.set("flowApp", "");
      });
      it("switch case DEFAULT", (done) => {
        CommonsKeepAliveUtilsService.initKeepAlive();
        done();
      });
    });
  });

  describe("when keepSessionAlive() is called", () => {
    describe("when CommonsKeepAliveUtilsService.keepAlive() is called", () => {
      it(" and resolve promise", (done) => {
        inject(($q, _CommonsKeepAliveUtilsService_) => {
          CommonsKeepAliveUtilsService = _CommonsKeepAliveUtilsService_;
          q = $q;

          fakeCommonsKeepAliveService.keepAlive = jasmine
            .createSpy("keepAlive")
            .and.callFake(() => {
              const defer = $q.defer();
              defer.resolve("Data");
              return defer.promise;
            });
        });
        CommonsKeepAliveUtilsService.keepSessionAlive();
        done();
      });
      it(" and reject promise", (done) => {
        inject(($q, _CommonsKeepAliveUtilsService_) => {
          CommonsKeepAliveUtilsService = _CommonsKeepAliveUtilsService_;
          q = $q;

          fakeCommonsKeepAliveService.keepAlive = jasmine
            .createSpy("keepAlive")
            .and.callFake(() => {
              const defer = $q.defer();
              defer.reject({});
              return defer.promise;
            });
        });
        CommonsKeepAliveUtilsService.keepSessionAlive();
        done();
      });
    });
  });

  describe("when closeSession is called", () => {
    it("closeSession", (done) => {
      inject(($q, _CommonsKeepAliveService_) => {
        CommonsKeepAliveService = _CommonsKeepAliveService_;
        q = $q;

        fakeCommonsKeepAliveService.closeSession = jasmine
          .createSpy("closeSession")
          .and.callFake(() => {
            const defer = $q.defer();
            defer.reject({});
            return defer.promise;
          });
      });
      CommonsKeepAliveUtilsService.closeSession();
      done();
    });
  });

  describe("when cancelSession is called", () => {
    it("cancelSession", (done) => {
      CommonsKeepAliveUtilsService.cancelSession();
      done();
    });
  });

  describe("when flowAppCKI is called", () => {
    xit("starts cki interval", () => {
      CommonsKeepAliveUtilsService.flowAppCKI();
      const expectedStartTime = dayjs().millisecond();
      const startTime: Dayjs =
        CommonsKeepAliveUtilsService.$rootScope.timeSession.startTime;
      expect(expectedStartTime).toBeCloseTo(startTime.millisecond(), 1);
    });
    it("and passed time is less than waiting time, should continue the interval", () => {
      CommonsKeepAliveUtilsService.flowAppCKI();
      setTimeout(function () {
        expect(
          CommonsKeepAliveUtilsService.$rootScope.timeSession.openedModal,
        ).toBeFalse();
      }, 60000);
    });
    describe("and passed time is greater than waiting time", () => {
      it("and step flow is valid, should open modal", () => {
        CommonsKeepAliveUtilsService.flowAppCKI();
        setTimeout(function () {
          expect(
            CommonsKeepAliveUtilsService.$rootScope.timeSession.openedModal,
          ).toBeTrue();
          expect(
            CommonsKeepAliveUtilsService.$rootScope.timeSession.timerActivate,
          ).toBeTrue();
        }, 122000);
      });
      it("and step flow is not valid, should not open the modal", () => {
        CommonsKeepAliveUtilsService.$location = "/ibcose";
        CommonsKeepAliveUtilsService.flowAppCKI();
        setTimeout(function () {
          expect(
            CommonsKeepAliveUtilsService.$rootScope.timeSession.openedModal,
          ).toBeFalse();
          expect(
            CommonsKeepAliveUtilsService.$rootScope.timeSession.timerActivate,
          ).toBeFalse();
        }, 122000);
      });
    });
  });
});
