describe('FlightNowController test', function () {
    var rootScope, scope, location, controller, filter, timeout, localStorageService, cookies, config, window, monetateUtilsService;
    var mockAvailabilityFlight = {
        'departureCodeAirport': 'code',
        'arrivalCodeAirport': 'code',
        'originDestinations': [
            { 'slices': [{ 'data': 'data' }, { 'data2': 'data2' }] }
        ]
    }
    var fakeFlightNowService = {
        getAvailabilityFlightNow: jasmine.createSpy()
    };
    var fakeFlightNowModel = {
        'flightInfo': {},
        'selectedTab': 0,
        initializeModel: angular.noop

    };
    var fakeModalService = {
        isWaiting: angular.noop
    };
    var fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: angular.noop,
        updateDigitalDataWithQuadrigam: angular.noop,
        updateDatalayerViewEvent: angular.noop,
        sendDatalayerEvent: angular.noop
    };
    var fakeCkiDatalayerConstants = require('test/constants/datalayer-cki-constants.json');
    var fakeIbUtilsService = {
        setTitlePage: jasmine.createSpy('setTitlePage').and.callFake(function () {
            return 'TITLE'
        })
    };
    var fakeIbSessionConfigService = {
        isUserLogged: jasmine.createSpy('isUserLogged').and.callFake(function () {
            return true;
        })
    };
    var fakeConfig = {
        'QUADRIGAM': {
            'FLY_NOW': 'FLY_NOW'
        },
        'COOKIES': {
            'GDR_PA_INFO': 'GDR_PA_INFO'
        },
        'lang': 'data',
        'STEPS': {
            'GDR_CHANGE_FLIGHT': 'GDR_CHANGE_FLIGHT'
        },
        'market': {
            toLowerCase: angular.noop
        },
        'TITLE_PAGE': {
            'FLY_NOW': 'CKI_TITLE_PAGE_IBFNPA'
        }
    };
    var fakeWindow = {
        'location': {
            'href': jasmine.createSpy('href').and.callFake(function () {
                return 1;
            })
        }
    };
    var fakeMonetateUtilsService = {
        'updateMonetateWithQuadrigam' : jasmine.createSpy('updateMonetateWithQuadrigam')
    }
    const fakeDatalayerCKIService = {
        setProcessAndStep: jasmine.createSpy().and.callFake(angular.noop)
    };
    const fakeCheckinFlowService = {
        warnUserOnBackPressed: jasmine.createSpy('warnUserOnBackPressed')
    };

    beforeEach(function () {
        angular.mock.module('ib-flight-now-module', 'ngCookies', 'ui.bootstrap', 'ib-filter-module', 'LocalStorageModule', 'ib-monetate-module', 'ib-datalayer-module', function ($provide) {
            $provide.value('FlightNowService', fakeFlightNowService);
            $provide.value('FlightNowModel', fakeFlightNowModel);
            $provide.value('ModalService', fakeModalService);
            $provide.value('CkiDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('CkiDatalayerConstants', fakeCkiDatalayerConstants);
            $provide.value('IbUtilsService', fakeIbUtilsService);
            $provide.value('CheckinAppConstants', fakeConfig);
            $provide.value('CkiDataLayerService', fakeDatalayerCKIService);
            $provide.value('IbSessionConfigService', fakeIbSessionConfigService);
            $provide.value('CheckinFlowService', fakeCheckinFlowService);
        });
        inject(function ($rootScope, $timeout, $location, $filter, $cookies, _CheckinAppConstants_, _localStorageService_, $controller, $window, $q) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            rootScope.headerModel = {};
            location = $location;
            filter = $filter;
            cookies = $cookies;
            timeout = $timeout;
            config = _CheckinAppConstants_;
            window = fakeWindow;
            localStorageService = _localStorageService_;
            fakeFlightNowService.getAvailabilityFlightNow = jasmine.createSpy('getAvailabilityFlightNow').and.callFake(function () {
                var defer = $q.defer();
                defer.resolve(mockAvailabilityFlight);
                return defer.promise;
            });
            controller = $controller('FlightNowController', {
                '$rootScope': rootScope,
                '$scope': scope,
                '$location': location,
                '$timeout': $timeout,
                '$window': window,
                'FlightNowService': fakeFlightNowService,
                'FlightNowModel': fakeFlightNowModel,
                'ModalService': fakeModalService,
                'CkiDatalayerUtilsService': fakeDatalayerUtilsService,
                'CkiDatalayerConstants': fakeCkiDatalayerConstants,
                'IbUtilsService': fakeIbUtilsService,
                'MonetateUtilsService': fakeMonetateUtilsService,
                'CheckinFlowService': fakeCheckinFlowService
            });
        });
    });

    it('When activate() is called', function (done) {
        rootScope.$digest();
        expect(controller.model.flightInfo.departureCodeAirport).toEqual('code');
        expect(controller.model.flightInfo.arrivalCodeAirport).toEqual('code');
        done();
    });

    describe('When event selectSegment is received', function () {
        beforeEach(function () {
            spyOn(location, 'path').and.returnValue('/');
        });
        it('callUpdateServices() is called', function (done) {
            rootScope.$broadcast('selectSegment', 1);
            expect(localStorageService.get('newSelectedSegment')).toEqual(1);
            expect(location.path).toHaveBeenCalledWith('/ibfncopa');
            done();
        });
    });
    it('url should change', function (done) {
        localStorageService.set('flowId', 1);
        localStorageService.set('PNR', 'data');
        localStorageService.set('checkinSurname', 'surname');
        localStorageService.set('selectedBlockPa', { 'data': { 'id': 'id' } });
        controller.goToGdr();
        done();
    });
});
