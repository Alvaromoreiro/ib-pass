describe('ibMmbSearchComponent test', () => {
    var scope, localStorageService, controller, rootScope, filter, $q, $timeout;

    var fakeMmBModalService = {
        showWaitingModal: jasmine.createSpy('showWaitingModal').and.callFake(() => { }),
        finishWaiting: jasmine.createSpy('finishWaiting').and.callFake(() => { }),
        showGenericError: jasmine.createSpy('showGenericError').and.callFake(() => {
            return { 'result': { 'then': () => { } } };
        }),
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(() => {
            return { 'result': { 'then': () => { } } };
        }),
    };

    var fakeMmBAppConstants = {
        'PAGES_URL': { 'BOOKING_MANAGE': '/ibmtdt' },
        'QUADRIGAM': { 'PASSENGER_INFO': 'test' },
        'DATALAYER_EVENT_TYPES': { 'VIEW': 'view' },
        'WCS': {
            'PHONE_TYPES': { 'SALES': 'RESERVAS', 'IBHOLIDAYS': 'ATTBAH' },
            'URL_PARAMETERS': { 'DEEP_LINK_SOURCE': 'source' }
        },
        'URL_PARAMETERS': { 'DEEP_LINK_SOURCE': 'deepLinkSource', 'DEEP_LINK_CODE': 'deepLinkCode', 'DEEP_LINK_RETURN_URL': 'deepLinkReturnUrl' },
        'lang': 'es',
        'market': 'ES',
        'NEWMMB_TRIPLIST_MARKETS': ['FI']
    };

    var fakeMmBUtilService = {
        'isUserLogged': jasmine.createSpy('isUserLogged').and.callFake(angular.noop),
        'getURLFirstParameterByName': jasmine.createSpy('getURLFirstParameterByName').and.callFake(() => {
            return true;
        })
    };

    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: { 'VIEW': 'view' },
        DATALAYER_MODAL_ID: { 'BACK_MODAL': 'BACK_MODAL', 'WHERE_IS_PNR': 'WHERE_IS_PNR' }
    };


    var fakeMmBSearchService = {
        initializeFlow: jasmine.createSpy('initializeFlow').and.callFake(() => { }),

    };
    var fakeBookingSearchService = {
    searchFlightsPassengers: jasmine.createSpy('searchFlightsPassengers').and.callFake(() => Promise.resolve({})),
        retrieveOrderComplete: jasmine.createSpy('retrieveOrderComplete').and.callFake(() => { }),
        searchFlightsPassengersEvent: jasmine.createSpy('searchFlightsPassengersEvent').and.callFake(() => { }),
        checkOrderInfo: jasmine.createSpy('checkOrderInfo').and.callFake(() => { }),
    };

    var fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        'sendDatalayerEvent': jasmine.createSpy('sendDatalayerEvent').and.callFake(angular.noop),
        'updateDatalayerInfo': jasmine.createSpy('updateDatalayerInfo'),
        'updateDatalayerViewEvent': jasmine.createSpy('updateDatalayerViewEvent'),
    };
    var fakeGetWcsPhonesIBVService = {
        getPhoneByCode: jasmine.createSpy('getPhoneByCode').and.callFake(angular.noop)
    };
    var fakeNewMainHeaderFacade = {
        'initHeader': jasmine.createSpy('initHeader').and.callFake(angular.noop),
        'updateHeader': jasmine.createSpy('updateHeader').and.callFake(angular.noop),
        'updateSteps': jasmine.createSpy('updateSteps').and.callFake(angular.noop),
        'setLogin': jasmine.createSpy('setLogin').and.callFake(angular.noop),
        'updateTrips': jasmine.createSpy('updateTrips').and.callFake(angular.noop),
        'updateBasketDiscounts': jasmine.createSpy('updateBasketDiscounts').and.callFake(angular.noop),
        'updateBasketOthers': jasmine.createSpy('updateBasketOthers').and.callFake(angular.noop),
        'updateTripsFromOrder': jasmine.createSpy('updateTripsFromOrder').and.callFake(angular.noop),
        'showLogin': jasmine.createSpy('showLogin').and.callFake(angular.noop),
        'updateLogin': jasmine.createSpy('updateLogin').and.callFake(angular.noop),
        'updateBasketFlexibilization': jasmine.createSpy('updateBasketFlexibilization').and.callFake(angular.noop),
        'initHeaderModel': jasmine.createSpy('initHeaderModel').and.callFake(angular.noop),
        'updateBasketUpgrading': jasmine.createSpy('updateBasketUpgrading').and.callFake(angular.noop)
    };
    var fakeRedirectionService = {
        'externalRedirect': jasmine.createSpy('externalRedirect').and.callFake(angular.noop)
    };
    var fakeTranslateFilter = function (input) {
        var ob = {
            'translate': function (input) {
                return input;
            }
        }
        return ob;
    };

    var fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy()
    };

    let fakeComponentsUtils = {
        equalHeight: jasmine.createSpy()
    };

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-search-module', 'ib-MmB-services-module', ($provide) => {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBSearchService', fakeMmBSearchService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('BookingSearchService', fakeBookingSearchService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('CommonsGetWcsPhonesService', fakeGetWcsPhonesIBVService);
            $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
            $provide.value('RedirectionService', fakeRedirectionService);
            $provide.value('translateFilter', fakeTranslateFilter);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('ComponentsUtils', fakeComponentsUtils);
        });
        inject(function ($rootScope, $componentController, _localStorageService_, $filter, _$q_, _$timeout_) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            filter = $filter;
            $q = _$q_;
            $timeout = _$timeout_;

            controller = $componentController('ibMmbSearchComponent', {
                'localStorageService': _localStorageService_,
                '$scope': scope
            });
            scope.$digest();
        });
    });


    describe('when activate is called', () => {
        it('rootScope.showHeaders should be true', (done) => {
            controller.$onInit();
            expect(rootScope.showHeaders).toEqual(true);
            done();
        });

        it('main else and timeout called', (done)=>{
            fakeMmBUtilService.getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(() => {
                return false;
            });
            localStorageService.set('deepLinkParams', true)
            rootScope.$digest();
            done();
        })
    });

    describe('When modalDeepLinkErrorEvent is launched', () => {
        beforeEach(inject(() => {
            var mockDeepLinkInformation = { 'airline': { 'name': 'PRUEBA' }, 'returnUrl': 'url/prueba' }
            localStorageService.set('bookingInfo', { 'deepLinkInformation': mockDeepLinkInformation });
            fakeMmBModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() => {
                return {
                    result: $q.when({})
                }
            });
        }));
        it('modalDeepLinkError function should be executed', (done) => {
            scope.$broadcast('modalDeepLinkErrorEvent');
            scope.$digest();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        })
    });

    describe('When openGenericModal is called', () => {
        it('call function openGenericModal from modal service', (done) => {
            var fakeEvent = { 'preventDefault': () => {}};
            var data = {
                'isBlocked': true,
                'template': 'ib-show-baggages-modal.html'
            };
            controller.openGenericModal(fakeEvent, data);
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            done();
        });
    });

    describe('When showWaitingModal is called', () => {
        it('call function showGenericModal from modal service', (done) => {
            controller.showWaitingModal();
            expect(fakeMmBModalService.showWaitingModal).toHaveBeenCalled();
            done();
        });
    });


    describe('When afterLogin is called', () => {
        it('call function afterLogin from modal service', (done) => {
            controller.afterLogin();
            done();
        });
    });
    describe('When afterLogin is called', () => {
        it('call function afterLogin from modal service', (done) => {
            controller.onError();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });
    });

    describe('When bannerRenderedEvent is launched', () => {
        it('bannerRenderedEvent function should be executed', (done) => {
            rootScope.$broadcast('bannerRenderedEvent');
            scope.$digest();
            $timeout.flush();
            // expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        })
    });

    describe('When initializeIsAddOnEvent is launched', () => {
        it('initializeIsAddOnEvent function should be executed', (done) => {
            rootScope.$broadcast('initializeIsAddOnEvent');
            scope.$digest();
            // expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        })
    });

});
