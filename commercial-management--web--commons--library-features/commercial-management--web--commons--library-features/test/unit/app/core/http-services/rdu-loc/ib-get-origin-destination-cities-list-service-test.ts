describe("CommonsOriginDestinationCitiesListService Test", () => {
  const mockResponse = "Ok";
  let CommonsOriginDestinationCitiesListService, rootScope;

  const fakeCommonsGenericProxy = { getGeneric: jasmine.createSpy() };
  const fakeCommonsHttpUtilsErrorService = {
    controlError: jasmine
      .createSpy("controlError")
      .and.callFake((errorInput, attempts, callback, defer, inputBool) => {
        defer.reject({
          errorCode: 400,
          message: "error",
          needsTranslate: false,
          internalErrorCode: "internal_error",
        });
      }),
  };

  const fakeCommonsHttpServicesConstants = {
    DEFAULT_ENDPOINTS: {
      COMMERCIAL_SELLING: "",
    },
  };

  beforeEach(() => {
    angular.mock.module("ib-commons-http-service-module", ($provide) => {
      $provide.value("CommonsGenericProxy", fakeCommonsGenericProxy);
      $provide.value(
        "CommonsHttpUtilsErrorService",
        fakeCommonsHttpUtilsErrorService,
      );
      $provide.value(
        "CommonsHttpServicesConstants",
        fakeCommonsHttpServicesConstants,
      );
    });
    inject(($rootScope, _CommonsOriginDestinationCitiesListService_) => {
      CommonsOriginDestinationCitiesListService =
        _CommonsOriginDestinationCitiesListService_;
      rootScope = $rootScope;
    });
  });

  xdescribe("when getOriginOrDestinationCitiesByTypeAndAreas() is called", () => {
    it("and DestinationCitiesListProxy resolve promise, should return data", (done) => {
      inject(($q) => {
        fakeCommonsGenericProxy.getGeneric = jasmine
          .createSpy("getDestinationCities")
          .and.callFake(() => {
            const deferred = $q.defer();
            deferred.resolve({ data: mockResponse });
            return deferred.promise;
          });
      });
      CommonsOriginDestinationCitiesListService.getOriginOrDestinationCitiesByTypeAndAreas().then(
        (responseData) => {
          expect(responseData).toEqual(mockResponse);
          done();
        },
        angular.noop,
      );
      rootScope.$digest();
    });
    describe("and DestinationCitiesListProxy reject promise, should return error object", () => {
      it("with 400 error code, should be returned error data", (done) => {
        const mockError = {
          errorCode: 400,
          data: { errors: [{ reason: "error" }] },
        };
        inject(($q) => {
          fakeCommonsGenericProxy.getGeneric = jasmine
            .createSpy("getDestinationCities")
            .and.callFake(() => {
              const deferred = $q.defer();
              deferred.reject(mockError);
              return deferred.promise;
            });
        });
        CommonsOriginDestinationCitiesListService.getOriginOrDestinationCitiesByTypeAndAreas().then(
          angular.noop,
          (responseError) => {
            expect(responseError.errorCode).toEqual(400);
            done();
          },
        );
        rootScope.$digest();
      });
    });
  });
});
