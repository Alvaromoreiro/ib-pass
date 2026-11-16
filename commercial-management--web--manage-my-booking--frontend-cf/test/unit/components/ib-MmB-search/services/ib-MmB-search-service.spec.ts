describe("MmBSearchService test", () => {
  var mmBSearchService, rootScope, $q, testLocation, localStorageService;

  var fakeMmBModalService = {
    showGenericModal: jasmine.createSpy("showGenericModal").and.callFake(() => {
      return {
        result: $q.when(),
      };
    }),
    showWaitingModal: jasmine
      .createSpy("showWaitingModal")
      .and.callFake(() => { }),
    finishWaiting: jasmine
      .createSpy("finishWaiting")
      .and.callFake(angular.noop),
    showGenericError: jasmine.createSpy("showGenericError").and.callFake(() => {
      return {
        result: $q.when(),
      };
    }),
  };
  var fakeMmBUtilService = {
    initStorage: jasmine.createSpy(),
    getParameterByName: jasmine
      .createSpy("getParameterByName")
      .and.callFake(() => {
        return "test";
      }),
    getOldManageAppErrorMessage: jasmine
      .createSpy("getOldManageAppErrorMessage")
      .and.callFake(function () {
        return true;
      }),
    getURLFirstParameterByName: jasmine.createSpy().and.callFake(function () {
      return "TEST";
    }),
    getDeviceType: jasmine.createSpy(),
  };
  var fakeFrequentFlyersCompaniesService = {
    getFrequentFlyersCompaniesPromised: jasmine
      .createSpy("getFrequentFlyersCompaniesPromised")
      .and.callFake(() => {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      }),
  };
  var fakeBookingSearchService = {
    searchFlightsPassengers: jasmine
      .createSpy("searchFlightsPassengers")
      .and.callFake(function () {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      }),
    retrieveOrderComplete: jasmine
      .createSpy("retrieveOrderComplete")
      .and.callFake(angular.noop),
  };
  var fakeMmBAppConstants = {
    PAGE_TYPE_CHANNEL: {
      MOBI: "mobi",
    },
    OPEN_JBA_LINK: true,
    market: "es",
    lang: "es",
    PAGES_URL: {
      BOOKINGS_LIST: "/mytrps",
      TRIP_LIST: '/mytrpsnew'
    },
    URL_PARAMETERS: {
      LOCATOR: "pnr",
      SURNAME: "surname",
      MARKET: "market",
      LANGUAGE: "language",
      CHANNEL: "channel",
      DEVICE: "device",
      ERROR_CODE: "errorCode",
      AIR_SHUTTLE: "airshuttle",
      PREORDER: "preorder",
      DEEP_LINK_SOURCE: "link",
      DEEP_LINK_CODE: "code",
      DEEP_LINK_RETURN_URL: "url",
      QUADRIGAM: "quadrigam",
      IS_STOPOVER: "isStopOver",
      VOUCHER_FROM_EMAIL: "voucherFromEmail",
      FLIGHT_CHANGE_FROM_EMAIL: "flightChangeFromEmail",
      SEAT: "seat",
      BAGGAGE: "baggage",
      SPEQ: "speq",
      PRIORITY: "priority",
      INSURANCE: "insurance",
      UPGRADING_BID: "bid",
      FLOWBOB: "flowBob",
    },
    COOKIES: {
      PERSONALIZATION: "IBERIACOM_PERSONALIZATION",
      LOGGED_TOKEN: "IBERIACOM_SSO_ACCESS",
      LOGGED_TOKEN_EXPIRATION: "IBERIACOM_SSO_ACCESS_TO",
      LOGGED_REFRESH_TOKEN: "IBERIACOM_SSO_REFRESH",
      LOGGED_REFRESH_TOKEN_EXPIRATION: "IBERIACOM_SSO_REFRESH_TO",
    },
    NEWMMB_TRIPLIST_MARKETS: ['FI']
  };
  var fakeRedirectionService = {
    externalRedirect: jasmine
      .createSpy("externalRedirect")
      .and.callFake(angular.noop),
  };

  var fakeDatalayerConstants = {
    DATALAYER_MODAL_ID: {
      PRIVATE_BROWSER_ERROR: "PRIVATE_BROWSER_ERROR",
    },
  };

  var promisedDataCommercialInfo = {
    currency: {
      code: "EUR",
      description: "Euro",
      symbol: "€",
      alignment: "R",
      groupingSeparator: ".",
      decimalSeparator: ",",
      decimals: 2,
      recommendedDisplay: "symbol",
    },
    languages: [
      {
        dateFormat: {
          long: "dd MMMM yyyy",
          medium: "dd-MMM-yyyy",
          short: "dd/MM/yy",
        },
        code: "en",
        description: "English",
      },
      {
        dateFormat: {
          long: 'd" de "MMMM" de "yyyy',
          medium: "dd-MMM-yyyy",
          short: "d/MM/yy",
        },
        code: "es",
        description: "Español",
      },
    ],
    market: {
      code: "IE",
      description: "Irlanda",
    },
    sessionTimeLifeInMinutes: 15,
    maxSearchTime: 361,
    minSearchTime: 10,
    passengerTypes: [
      {
        passengerType: "ADULT",
        description: "Adulto",
      },
      {
        passengerType: "INFANT",
        description: "Bebé",
      },
      {
        passengerType: "CHILD",
        description: "Niño",
      },
    ],
    discounts: [],
    defaultValues: {
      defaultPaxType: "ADULT",
      defaultPaxTypeNumbers: [
        {
          passengerType: "ADULT",
          number: 1,
        },
        {
          passengerType: "CHILD",
          number: 0,
        },
        {
          passengerType: "INFANT",
          number: 0,
        },
      ],
      maxPaxNumber: 9,
      defaultPhonePrefix: {
        code: "353",
        description: "Irlanda / +353",
        countryCode: "IE",
      },
    },
    roundingPolicy: "HALF_ROUND_DOWN",
    availabilityPriceShowPolicy: "ADULT_PRICE_WITH_TAXES_AND_EMISSION",
    mainCities: {
      normal: {
        code: "DUB",
        description: "Dublín",
        timezone: "Europe/London",
        country: {
          code: "IE",
          description: "Irlanda",
        },
      },
      redemption: null,
    },
  };
  var fakeCommercialInfobyMarketService = {
    getCommercialInfo: jasmine
      .createSpy("getCommercialInfo")
      .and.callFake(() => {
        var deferred = $q.defer();
        deferred.resolve(promisedDataCommercialInfo);
        return deferred.promise;
      }),
  };

  var PromiseDataUserLoggedToken = {};
  var fakeMmBTokenService = {
    refreshUserLoggedToken: jasmine
      .createSpy("refreshUserLoggedToken")
      .and.callFake(() => {
        var deferred = $q.defer();
        deferred.resolve(PromiseDataUserLoggedToken);
        return deferred.promise;
      }),
    getAnonymousToken: jasmine
      .createSpy("getAnonymousToken")
      .and.callFake(() => {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      }),
  };

  var PromiseDataCustomerData = {
    otherStatuses: {
      isRedemptionEnabled: true,
    },
  };
  var fakeCommonsCheckLoginWCSService = {
    generateSSOInfo: jasmine.createSpy("generateSSOInfo").and.callFake(() => {
      return {
        isLogged: "userLogged",
        loggedToken: "adsdsfaf",
        refreshToken: "asdfasd",
        needsRefreshToken: false,
        error: null,
      };
    }),
    getCustomerData: jasmine.createSpy("getCustomerData").and.callFake(() => {
      var deferred = $q.defer();
      deferred.resolve(PromiseDataCustomerData);
      return deferred.promise;
    }),
  };
  var fakeCommonsGetLoginInfoService = {
    checkCustomerStatus: jasmine
      .createSpy("checkCustomerStatus")
      .and.callFake(() => {
        var deferred = $q.defer();
        deferred.resolve(PromiseDataCustomerData);
        return deferred.promise;
      }),
  };
  var fakeCommonsLoginUtilsService = {
    updateStateToAnonymous: jasmine
      .createSpy("updateStateToAnonymous")
      .and.callFake(function () {
        return true;
      }),
  };

  var fakeLinksFilter = function (id) {
    return id;
  };

  let fakeCommonsCommercialInfobyMarketService = {
    getCommercialInfo: jasmine.createSpy(),
  };

  let fakeCommonsUserUtilsService = {
    isSoftUser: jasmine.createSpy(),
    isUserLoggedONB: jasmine.createSpy(),
  };

  let fakeMmBDatalayerUtilsService = {
    initializeDatalayer: jasmine.createSpy(),
    updateLoggedDatalayer: jasmine.createSpy('updateLoggedDatalayer'),

  };

  let fakeLoadingSpinnerService = {
        'show': jasmine.createSpy('show'),
        'hide': jasmine.createSpy('hide'),
        'isLoading': jasmine.createSpy('isLoading').and.returnValue(false)
    };

  let fakeIbCCustomerDataService = {
    getCustomerData: jasmine.createSpy('getCustomerData').and.callFake(() => {
      var deferred = $q.defer();
      deferred.resolve({ category: 'SILVER' });
      return deferred.promise;
    }),
  };

  beforeEach(() => {
    angular.mock.module(
      "ngCookies",
      "ib-MmB-search-module",
      "ib-MmB-services-module",
      "ib-MmB-filters-module",
      "LocalStorageModule",
      ($provide) => {
        $provide.value("MmBModalService", fakeMmBModalService);
        $provide.value("MmBUtilService", fakeMmBUtilService);
        $provide.value("IbCAuthTokenService", fakeMmBTokenService);
        $provide.value(
          "CommonsGetLoginInfoService",
          fakeCommonsGetLoginInfoService,
        );
        $provide.value(
          "FrequentFlyersCompaniesService",
          fakeFrequentFlyersCompaniesService,
        );
        $provide.value("BookingSearchService", fakeBookingSearchService);
        $provide.value("MmBAppConstants", fakeMmBAppConstants);
        $provide.value("RedirectionService", fakeRedirectionService);
        $provide.value("MMBDatalayerConstants", fakeDatalayerConstants);
        $provide.value(
          "CommercialInfobyMarketService",
          fakeCommercialInfobyMarketService,
        );
        $provide.value("LinksFilterFilter", fakeLinksFilter);
        $provide.value(
          "CommonsCheckLoginWCSService",
          fakeCommonsCheckLoginWCSService,
        );
        $provide.value(
          "CommonsLoginUtilsService",
          fakeCommonsLoginUtilsService,
        );
        $provide.value(
          "CommonsCommercialInfobyMarketService",
          fakeCommonsCommercialInfobyMarketService,
        );
        $provide.value("CommonsUserUtilsService", fakeCommonsUserUtilsService);
        $provide.value(
          "MmBDatalayerUtilsService",
          fakeMmBDatalayerUtilsService,
        );
        $provide.value('LoadingSpinnerService', fakeLoadingSpinnerService);
        $provide.value('IbCCustomerDataService', fakeIbCCustomerDataService);
      },
    );
    inject(
      function (
        _MmBSearchService_,
        $rootScope,
        _$location_,
        _$q_,
        _localStorageService_,
      ) {
        mmBSearchService = _MmBSearchService_;
        rootScope = $rootScope;
        testLocation = _$location_;
        $q = _$q_;
        localStorageService = _localStorageService_;
        spyOn(testLocation, "path");
      },
    );
  });

  describe("When initializeFlow() is called with user Logged", () => {
    beforeEach(inject(() => {
      fakeMmBUtilService.getURLFirstParameterByName = jasmine
        .createSpy()
        .and.callFake(() => {
          return false;
        });
      fakeMmBUtilService.getParameterByName = jasmine
        .createSpy("getParameterByName")
        .and.callFake((paramName) => {
          var supportedParameters = ["quadrigam", "airshuttle"];
          return supportedParameters.indexOf(paramName) !== -1 ? "test" : null;
        });
      fakeMmBModalService.showGenericError = jasmine
        .createSpy("showGenericError")
        .and.callFake(() => {
          return {
            result: $q.when(),
          };
        });
      fakeCommonsCheckLoginWCSService.generateSSOInfo = jasmine
        .createSpy("generateSSOInfo")
        .and.callFake(() => {
          return {
            isLogged: "userLogged",
            loggedToken: "adsdsfaf",
            refreshToken: "asdfasd",
            needsRefreshToken: false,
            error: null,
          };
        });
      fakeCommonsGetLoginInfoService.checkCustomerStatus = jasmine
        .createSpy("checkCustomerStatus")
        .and.callFake(() => {
          var deferred = $q.defer();
          deferred.resolve(PromiseDataCustomerData);
          return deferred.promise;
        });
    }));
    it("1. and localStorage is not supported,showGenericModal should be called", (done) => {
      localStorageService.isSupported = false;
      localStorageService.set("deepLinkParams", false);
      mmBSearchService.initializeFlow();
      rootScope.$digest();
      expect(fakeMmBModalService.showGenericError).toHaveBeenCalled();
      done();
    });

    it("2. and localStorage isSupport true and quadrigam is test", (done) => {
      localStorageService.isSupported = true;
      localStorageService.set("deepLinkParams", false);
      mmBSearchService.initializeFlow();
      rootScope.$digest();
      expect(localStorageService.get("quadrigam")).toEqual("test");
      done();
    });

    it('3. and airShuttle and errorCode is "false"', (done) => {
      inject(() => {
        fakeMmBUtilService.getURLFirstParameterByName = jasmine
          .createSpy()
          .and.callFake(() => {
            return false;
          });
        fakeMmBUtilService.getParameterByName = jasmine
          .createSpy("getParameterByName")
          .and.callFake((paramName) => {
            var supportedParameters = ["airshuttle", "errorCode"];
            return supportedParameters[0].indexOf(paramName) !== -1
              ? "false"
              : supportedParameters[1].indexOf(paramName) !== -1
                ? null
                : "test";
          });
      });
      localStorageService.isSupported = true;
      localStorageService.set("deepLinkParams", false);
      mmBSearchService.initializeFlow();
      rootScope.$digest();
      // expect(fakeMmBModalService.showGenericError).toHaveBeenCalled();
      done();
    });

    it('4. and airShuttle and errorCode is "false"', (done) => {
      inject(() => {
        fakeMmBUtilService.getURLFirstParameterByName = jasmine
          .createSpy()
          .and.callFake(() => {
            return false;
          });
        fakeMmBUtilService.getParameterByName = jasmine
          .createSpy("getParameterByName")
          .and.callFake((paramName) => {
            var supportedParameters = ["airshuttle", "errorCode"];
            return supportedParameters[0].indexOf(paramName) !== -1
              ? "false"
              : supportedParameters[1].indexOf(paramName) !== -1
                ? 606
                : "test";
          });
        fakeCommonsUserUtilsService.isSoftUser = jasmine
          .createSpy()
          .and.callFake(() => {
            return false;
          });
        fakeCommonsUserUtilsService.isUserLoggedONB = jasmine
          .createSpy()
          .and.callFake(() => {
            return false;
          });
      });
      localStorageService.isSupported = true;
      localStorageService.set("deepLinkParams", false);
      localStorageService.set("externalRedirect", true);
      mmBSearchService.initializeFlow();
      rootScope.$digest();
      expect(fakeRedirectionService.externalRedirect).toHaveBeenCalled();
      done();
    });

    it("5. and error code is 606", (done) => {
      inject(() => {
        fakeMmBUtilService.getURLFirstParameterByName = jasmine
          .createSpy()
          .and.callFake(() => {
            return false;
          });
        fakeMmBUtilService.getParameterByName = jasmine
          .createSpy("getParameterByName")
          .and.callFake((paramName) => {
            var supportedParameters = ["errorCode"];
            return supportedParameters.indexOf(paramName) !== -1 ? 606 : null;
          });
        fakeCommonsUserUtilsService.isSoftUser = jasmine
          .createSpy()
          .and.callFake(() => {
            return true;
          });
      });
      localStorageService.isSupported = true;
      localStorageService.set("deepLinkParams", false);
      mmBSearchService.initializeFlow();
      rootScope.$digest();
      expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
      done();
    });

    describe("and continueCheckinFlow goes through datalayer path", () => {
      beforeEach(() => {
        fakeCommonsUserUtilsService.isSoftUser = jasmine.createSpy().and.returnValue(false);
        fakeCommonsUserUtilsService.isUserLoggedONB = jasmine.createSpy().and.returnValue(false);
        fakeMmBUtilService.getParameterByName = jasmine.createSpy().and.returnValue(null);
        localStorageService.set('deepLinkParams', false);
      });

      it("customerData in localStorage, updateLoggedDatalayer called with it", (done) => {
        localStorageService.set('customerData', { category: 'GOLD' });
        mmBSearchService.initializeFlow();
        rootScope.$digest();
        setTimeout(() => {
          expect(fakeMmBDatalayerUtilsService.updateLoggedDatalayer).toHaveBeenCalledWith({ category: 'GOLD' });
          done();
        }, 100);
      });

      it("no customerData in localStorage, getCustomerData and updateLoggedDatalayer called", (done) => {
        localStorageService.remove('customerData');
        mmBSearchService.initializeFlow();
        rootScope.$digest();
        setTimeout(() => {
          rootScope.$digest();
          setTimeout(() => {
            expect(fakeIbCCustomerDataService.getCustomerData).toHaveBeenCalled();
            expect(fakeMmBDatalayerUtilsService.updateLoggedDatalayer).toHaveBeenCalledWith({ category: 'SILVER' });
            done();
          }, 100);
        }, 100);
      });

      it("market in NEWMMB_TRIPLIST_MARKETS, navigate to TRIP_LIST", (done) => {
        localStorageService.set('customerData', { category: 'GOLD' });
        rootScope.appMarket = 'FI';
        mmBSearchService.initializeFlow();
        rootScope.$digest();
        setTimeout(() => {
          expect(testLocation.path).toHaveBeenCalledWith(fakeMmBAppConstants.PAGES_URL.TRIP_LIST);
          done();
        }, 100);
      });

      it("isSoftUser true, LoadingSpinnerService.hide called", (done) => {
        fakeCommonsUserUtilsService.isSoftUser = jasmine.createSpy().and.returnValue(true);
        mmBSearchService.initializeFlow();
        rootScope.$digest();
        setTimeout(() => {
          expect(fakeLoadingSpinnerService.hide).toHaveBeenCalled();
          done();
        }, 100);
      });

      it("checkCustomerStatus rejected, LoadingSpinnerService.hide called", (done) => {
        fakeCommonsGetLoginInfoService.checkCustomerStatus = jasmine.createSpy().and.callFake(() => {
          return Promise.reject({});
        });
        mmBSearchService.initializeFlow();
        rootScope.$digest();
        setTimeout(() => {
          expect(fakeLoadingSpinnerService.hide).toHaveBeenCalled();
          done();
        }, 100);
      });
    });
  });

  describe("When initializeFlow() is called with user Logged", () => {
    beforeEach(inject(() => {
      fakeBookingSearchService.searchFlightsPassengers = jasmine
        .createSpy("searchFlightsPassengers")
        .and.callFake(() => {
          var deferred = $q.defer();
          deferred.resolve("test");
          return deferred.promise;
        });
      fakeBookingSearchService.retrieveOrderComplete = jasmine
        .createSpy("retrieveOrderComplete")
        .and.callFake(() => {
          var deferred = $q.defer();
          deferred.resolve({});
          return deferred.promise;
        });

      fakeMmBUtilService.getURLFirstParameterByName = jasmine
        .createSpy()
        .and.callFake(() => {
          return false;
        });
      fakeMmBUtilService.getParameterByName = jasmine
        .createSpy("getParameterByName")
        .and.callFake((paramName) => {
          var supportedParameters = ["errorCode"];
          return supportedParameters.indexOf(paramName) !== -1 ? null : "test";
        });
    }));
    it("6. and continueCheckinFlow in to condition this.params.pnr && this.params.surname && !this.params.errorCode and searchFlightsPassengers resolve", (done) => {
      fakeBookingSearchService.searchFlightsPassengers.and.callFake(() => {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      });
      localStorageService.isSupported = true;
      localStorageService.set("deepLinkParams", false);
      rootScope.$digest();
      mmBSearchService.initializeFlow();
      rootScope.$digest();

      // expect(fakeBookingSearchService.searchFlightsPassengers).toHaveBeenCalled();
      done();
    });
  });

  describe("When initializeFlow() is called without user Logged", () => {
    beforeEach(inject(() => {
      fakeCommonsCheckLoginWCSService.generateSSOInfo = jasmine
        .createSpy("generateSSOInfo")
        .and.callFake(() => {
          return {
            isLogged: false,
          };
        });
      fakeBookingSearchService.searchFlightsPassengers = jasmine
        .createSpy("searchFlightsPassengers")
        .and.callFake(() => {
          var deferred = $q.defer();
          deferred.resolve({});
          return deferred.promise;
        });
      fakeBookingSearchService.retrieveOrderComplete = jasmine
        .createSpy("retrieveOrderComplete")
        .and.callFake(() => {
          var deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        });
      fakeMmBUtilService.getURLFirstParameterByName = jasmine
        .createSpy()
        .and.callFake(() => {
          return false;
        });
      fakeMmBUtilService.getParameterByName = jasmine
        .createSpy("getParameterByName")
        .and.callFake((paramName) => {
          var supportedParameters = ["errorCode"];
          return supportedParameters.indexOf(paramName) !== -1 ? null : "test";
        });
      fakeMmBModalService.showGenericError = jasmine
        .createSpy("showGenericError")
        .and.callFake(() => {
          return {
            result: $q.when(),
          };
        });
      fakeCommonsGetLoginInfoService.checkCustomerStatus = jasmine
        .createSpy("checkCustomerStatus")
        .and.callFake(() => {
          var deferred = $q.defer();
          deferred.resolve(PromiseDataCustomerData);
          return deferred.promise;
        });
    }));
    it("8. and localStorage is not supported,showGenericModal should be called", (done) => {
      localStorageService.isSupported = true;
      mmBSearchService.initializeFlow();
      rootScope.$digest();
      expect(fakeMmBModalService.showWaitingModal).toHaveBeenCalled();
      done();
    });

    it("9.1. and showOldWebError enter if when getOldManageAppErrorMessage is true", (done) => {
      inject(() => {
        fakeMmBUtilService.getParameterByName = jasmine
          .createSpy("getParameterByName")
          .and.callFake((paramName) => {
            var supportedParameters = ["pnr", "surname", "errorCode"];
            return supportedParameters.indexOf(paramName) !== -1
              ? "606"
              : supportedParameters.indexOf("errorCode") === -1
                ? "606"
                : null;
          });
        fakeMmBUtilService.getOldManageAppErrorMessage = jasmine
          .createSpy("getOldManageAppErrorMessage")
          .and.callFake(() => {
            return true;
          });
      });
      localStorageService.set("externalRedirect", true);
      mmBSearchService.initializeFlow();
      rootScope.$digest();
      expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
      done();
    });

    it("9.2. and showOldWebError enter else when getOldManageAppErrorMessage is false", (done) => {
      inject(() => {
        fakeMmBUtilService.getParameterByName = jasmine
          .createSpy("getParameterByName")
          .and.callFake((paramName) => {
            var supportedParameters = ["pnr", "surname", "errorCode"];
            return supportedParameters.indexOf(paramName) !== -1
              ? "444"
              : supportedParameters.indexOf("errorCode") === -1
                ? "444"
                : null;
          });
        fakeMmBUtilService.getOldManageAppErrorMessage = jasmine
          .createSpy("getOldManageAppErrorMessage")
          .and.callFake(() => {
            return false;
          });
      });
      localStorageService.isSupported = true;
      mmBSearchService.initializeFlow();
      rootScope.$digest();
      expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
      done();
    });

    it("10. and showOldWebError with getOldManageAppErrorMessage false", (done) => {
      inject(() => {
        fakeMmBUtilService.getParameterByName = jasmine
          .createSpy("getParameterByName")
          .and.callFake((paramName) => {
            var supportedParameters = ["pnr", "surname"];
            return supportedParameters.indexOf(paramName) !== -1
              ? null
              : "test";
          });
        fakeMmBUtilService.getOldManageAppErrorMessage = jasmine
          .createSpy("getParameterByName")
          .and.callFake((paramName) => {
            return false;
          });
      });
      localStorageService.isSupported = true;
      mmBSearchService.initializeFlow();
      rootScope.$digest();
      expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
      done();
    });
  });

  describe("When initializeFlow() with deeplink", () => {
    beforeEach(inject(() => {
      fakeCommonsCheckLoginWCSService.generateSSOInfo = jasmine
        .createSpy("generateSSOInfo")
        .and.callFake(() => {
          return {
            isLogged: false,
          };
        });
      fakeBookingSearchService.searchFlightsPassengers = jasmine
        .createSpy("searchFlightsPassengers")
        .and.callFake(() => {
          var deferred = $q.defer();
          deferred.resolve({});
          return deferred.promise;
        });
      fakeBookingSearchService.retrieveOrderComplete = jasmine
        .createSpy("retrieveOrderComplete")
        .and.callFake(() => {
          var deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        });
      fakeMmBUtilService.getURLFirstParameterByName = jasmine
        .createSpy()
        .and.callFake(() => {
          return true;
        });
      fakeMmBUtilService.getParameterByName = jasmine
        .createSpy("getParameterByName")
        .and.callFake((paramName) => {
          var supportedParameters = ["errorCode"];
          return supportedParameters.indexOf(paramName) !== -1 ? null : "test";
        });
      fakeMmBModalService.showGenericError = jasmine
        .createSpy("showGenericError")
        .and.callFake(() => {
          return {
            result: $q.when(),
          };
        });
      fakeCommonsGetLoginInfoService.checkCustomerStatus = jasmine
        .createSpy("checkCustomerStatus")
        .and.callFake(() => {
          var deferred = $q.defer();
          deferred.resolve(PromiseDataCustomerData);
          return deferred.promise;
        });
    }));
    it("11. and deeplink enter", (done) => {
      localStorageService.isSupported = true;
      mmBSearchService.initializeFlow();
      rootScope.$digest();
      expect(localStorageService.get("deepLinkParams")).toEqual({
        link: true,
        code: "true",
        url: "true",
      });
      done();
    });
  });

  describe("When initializeFlow() and checkCustomerStatus promise is rejected", () => {
    beforeEach(inject(() => {
      fakeCommonsCheckLoginWCSService.generateSSOInfo = jasmine
        .createSpy("generateSSOInfo")
        .and.callFake(() => {
          return {
            isLogged: false,
          };
        });
      fakeBookingSearchService.searchFlightsPassengers = jasmine
        .createSpy("searchFlightsPassengers")
        .and.callFake(() => {
          var deferred = $q.defer();
          deferred.resolve({});
          return deferred.promise;
        });
      fakeBookingSearchService.retrieveOrderComplete = jasmine
        .createSpy("retrieveOrderComplete")
        .and.callFake(() => {
          var deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        });
      fakeMmBUtilService.getURLFirstParameterByName = jasmine
        .createSpy()
        .and.callFake(() => {
          return false;
        });
      fakeMmBUtilService.getParameterByName = jasmine
        .createSpy("getParameterByName")
        .and.callFake((paramName) => {
          var supportedParameters = ["errorCode"];
          return supportedParameters.indexOf(paramName) !== -1 ? null : "test";
        });
      fakeMmBModalService.showGenericError = jasmine
        .createSpy("showGenericError")
        .and.callFake(() => {
          return {
            result: $q.when(),
          };
        });
      fakeCommonsGetLoginInfoService.checkCustomerStatus = jasmine
        .createSpy("checkCustomerStatus")
        .and.callFake(() => {
          var deferred = $q.defer();
          deferred.reject({});
          return deferred.promise;
        });
    }));
    it("12. checkCustomerStatus", (done) => {
      mmBSearchService.initializeFlow();
      rootScope.$digest();
      expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
      done();
    });
  });
});
