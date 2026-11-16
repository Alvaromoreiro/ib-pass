describe("CommonsKeepAliveService test", () => {
  let rootScope, localStorageService, CommonsKeepAliveService;

    const fakeCommonsConstants = {
        DEFAULT_ENDPOINTS: {
            ignoreOrderServiceURI: '/sse-orm/rs/v2/order/ignore',
            keepAliveServiceURI: '/sse-orm/rs/v2/mmb/{flowId}/keep-alive/',
            closeSessionURI: '/pac-prm/rs/checkin/v2'
        },
        APP: {
            GIFTCARD: {
                NAME: 'NAME'
            },
            SUBSCRIPTIONMODELS: {
                NAME: 'NAME',
                QUADRIGAM: {
                    CONFIGURATION: 'CONFIGURATION'
                }
            }
        },
        APP_TYPES: {
            BOOKING: 'BBKI',
            MANAGEMYBOOKING: 'MMB',
            MANAGEMYBOOKING_ONHOLD: 'MMBOH',
            MANAGEMYBOOKING_ANCILLARIES: 'MMBANC',
            MANAGEMYBOOKING_VOLUNTARY_CHANGE: 'MMBVC',
            MANAGEMYBOOKING_BIDS: 'MMBBID',
            ONHOLD: 'BBKIOH',
            CHECKIN: 'CKI',
            SHUTTLE_OPEN: 'PAOB',
            SHUTTLE_OPEN_ONB: 'PAOBONB',
            SHUTTLE_REDEMPTION: 'PARE',
            SHUTTLE_REDEMPTION_ONB: 'PAREONB',
            GIFTCARDS: 'GIFTCARDS'
        }
    };
    const fakeCommonsGenericProxy = {
        getGeneric: jasmine.createSpy(),
        deleteGeneric: jasmine.createSpy(),
        postGeneric: jasmine.createSpy()
    };

    const fakeCommonsNewHttpUtilsErrorService = {
        processPaymentsError: jasmine.createSpy(),
        timeOutError: jasmine.createSpy(),
        unauthorizedError: jasmine.createSpy(),
        internalServerError: jasmine.createSpy(),
        processGeneralError: jasmine.createSpy(),
        controlError: jasmine.createSpy()
    };

  let mockError = { errorCode: 401, data: { errors: [{ reason: "error" }] } };

    beforeEach(() => {
        angular.mock.module('ib-commons-keep-alive-module', 'LocalStorageModule', ($provide) => {
            $provide.value('CommonsConstants', fakeCommonsConstants);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
        });

    inject(($rootScope, _localStorageService_, _CommonsKeepAliveService_) => {
      rootScope = $rootScope;
      localStorageService = _localStorageService_;
      CommonsKeepAliveService = _CommonsKeepAliveService_;
    });
  });

  describe("when keepAlive() is called", () => {
    it("and resolve promise", (done) => {
      inject(($q) => {
        fakeCommonsGenericProxy.getGeneric = jasmine
          .createSpy("getGeneric")
          .and.callFake(() => {
            const deferred = $q.defer();
            deferred.resolve(mockError);
            return deferred.promise;
          });
      });
      CommonsKeepAliveService.keepAlive(null, {});
      done();
    });
    it("and reject promise", (done) => {
      inject(($q) => {
        mockError = { errorCode: 401, data: { errors: [{ reason: "error" }] } };
        fakeCommonsGenericProxy.getGeneric = jasmine
          .createSpy("getGeneric")
          .and.callFake(() => {
            const deferred = $q.defer();
            deferred.reject({});
            return deferred.promise;
          });
      });
      CommonsKeepAliveService.keepAlive("flowId");
      done();
    });
  });

  describe("when closeSession() is called", () => {
    beforeEach(() => {
      localStorageService.remove("userLogged");
      localStorageService.set("anonymousToken", "anonymousToken");
    });
    it(" and sync is true", (done) => {
      CommonsKeepAliveService.closeSession("flowId", true);
      done();
    });
    it(" and sync is true", (done) => {
      CommonsKeepAliveService.closeSession("flowId", true);
      done();
    });
    it(" and sync is false", (done) => {
      CommonsKeepAliveService.closeSession("flowId");
      done();
    });
  });
});
