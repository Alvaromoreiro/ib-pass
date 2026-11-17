describe('FlyNowConfirmationPAService test', function () {

    let rootScope, location, localStorageService, flyNowConfirmationPAService;

    const fakeModalService = {
        'isWaiting': jasmine.createSpy()
    };
    const fakeFlyNowConfirmationPATransformer = {
        'createRequestChangeOrder': jasmine.createSpy(),
        'transformFlyNowConfirmationInfo': jasmine.createSpy()
    };
    const fakeChangeOrderSliceService = {
        'changeOrderSlice': jasmine.createSpy()
    };
    const fakePassengerAdditionalInfoService = {
        'updateAdditionalInfo': jasmine.createSpy()
    };
    const fakeGetCKICachedInformationService = {
        'getCachedInformation': jasmine.createSpy()
    };
    const fakeAcceptObjectsPolicyService = {
        'acceptForbiddenObjectsPolicy': jasmine.createSpy()
    };
    const fakeCheckAncillariesService = {
        'checkAncillaries': jasmine.createSpy()
    };
    const fakeUpdateSelectedSegments = {
        "isAllowed": true,
        "newSegmentsId": [
            1
        ],
        "checkablePassengers": [
            1
        ]
    };
    const fakeIbUtilsService = {
        'goIbCose': jasmine.createSpy(),
    };
    const fakePassengerBookingService = {
        'updateCachedInfo': jasmine.createSpy().and.callFake(function () {
            return []
        }),
        'updateLanguageAdditionalInfo': jasmine.createSpy(),
        'updateSelectedSegments': jasmine.createSpy().and.callFake(function () {
            return fakeUpdateSelectedSegments
        }),
        'filterAdditionalInfo': jasmine.createSpy().and.callFake(function () {
            return {
                "additionalInfo": [],
                "needsUpdate": false
            }
        })
    };
    const fakeIbAncillariesPaymentUtilsService = {
        'generateHeaderTripsInfo': jasmine.createSpy(),
        'setAncillariesCurrency': jasmine.createSpy()
    };
    const fakeCommonsAncillariesService = {
        'getAncillarieSummary': jasmine.createSpy()
    };
    const fakeBookingInfo = require('test/mocks/localStorage/booking-info-pa.json');
    const fakeSelectedBlockPa = require('test/mocks/localStorage/selected-block-pa.json');
    const fakeAcceptForbiddenObjectsPolicy = require('test/mocks/responses/accept-forbidden-objects-policy.json');
    const mockAncillariesSummary = require('test/mocks/responses/ancillaries-summary.json');
    const mockAncillaries = {
        'ancillaries': [
            { 'type': 'BAGGAGE', 'status': { 'code': 'AVAILABLE' }, 'segments':['id', 'pruebas', 'prueba2','prueba2'] },
            { 'type': 'INSURANCE', 'status': { 'code': 'AVAILABLE' }, 'segments':['id', 'pruebas', 'prueba2','prueba2'] },
            { 'type': 'BOB', 'status': { 'code': 'AVAILABLE' }, 'segments':['id', 'pruebas', 'prueba2','prueba2'] },
            { 'type': 'SEAT', 'status': { 'code': 'AVAILABLE' }, 'segments':['id', 'pruebas', 'prueba2','prueba2'] },
            { 'type': 'PREORDER', 'status': { 'code': 'AVAILABLE' }, 'segments':['id', 'pruebas', 'prueba2','prueba2'] },
            { 'type': 'PRIORITY_BOARDING', 'status': { 'code': 'AVAILABLE' }, 'segments':['id', 'pruebas', 'prueba2','prueba2'] }
        ]
    };

    beforeEach(function () {
        angular.mock.module('ib-fly-now-confirmation-module', 'LocalStorageModule', 'ngRoute', function ($provide) {
            $provide.value('ModalService', fakeModalService);
            $provide.value('FlyNowConfirmationPATransformer', fakeFlyNowConfirmationPATransformer);
            $provide.value('ChangeOrderSliceService', fakeChangeOrderSliceService);
            $provide.value('PassengerAdditionalInfoService', fakePassengerAdditionalInfoService);
            $provide.value('GetCKICachedInformationService', fakeGetCKICachedInformationService);
            $provide.value('AcceptObjectsPolicyService', fakeAcceptObjectsPolicyService);
            $provide.value('CheckAncillariesService', fakeCheckAncillariesService);
            $provide.value('IbUtilsService', fakeIbUtilsService);
            $provide.value('IbPassengerBookingUtilsService', fakePassengerBookingService);
            $provide.value('CommonsAncillariesService', fakeCommonsAncillariesService);
            $provide.value('IbAncillariesPaymentUtilsService', fakeIbAncillariesPaymentUtilsService);
        });
        inject(function ($rootScope, $location, _localStorageService_, _FlyNowConfirmationPAService_) {
            rootScope = $rootScope;
            location = $location;
            localStorageService = _localStorageService_;
            flyNowConfirmationPAService = _FlyNowConfirmationPAService_;
        });
    });

    describe('When init Change Flight', function () {
        beforeEach(
            inject(function ($q) {
                fakeChangeOrderSliceService.changeOrderSlice = jasmine.createSpy('changeOrderSlice').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                });
                fakeFlyNowConfirmationPATransformer.createRequestChangeOrder = jasmine.createSpy('createRequestChangeOrder').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                });
                fakeGetCKICachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve(fakeBookingInfo);
                    return defer.promise;
                });
                fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve(fakeAcceptForbiddenObjectsPolicy);
                    return defer.promise;
                });

                localStorageService.set('seatMapSegment', {segmentId: '1'});
                localStorageService.set('availableSegments', ['2']);
                localStorageService.set('passengersSelected', ['1']);
                fakeBookingInfo.ancillariesDisabled = true;
                localStorageService.set('bookingInfo', fakeBookingInfo);
            })
        );
        it(' init FlyNowConfirmationPAController', () => {
            flyNowConfirmationPAService.getFlyNowConfirmationInfo();
            rootScope.$digest();
        });
        it(' and ancillariesDisabled in bookingInfo is true redirect to boarding pass', () => {
            localStorageService.set('selectedBlockPa', fakeSelectedBlockPa);
            flyNowConfirmationPAService.confirmChangeFlight();
            rootScope.$digest();
            expect(location.path()).toBe('/ibecbp');
        });
    });

    describe('', function () {
        beforeEach(
            inject(function ($q) {
                fakeChangeOrderSliceService.changeOrderSlice = jasmine.createSpy('changeOrderSlice').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                });
                fakeFlyNowConfirmationPATransformer.createRequestChangeOrder = jasmine.createSpy('createRequestChangeOrder').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                });
                fakeGetCKICachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve(fakeBookingInfo);
                    return defer.promise;
                });
                fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve(fakeAcceptForbiddenObjectsPolicy);
                    return defer.promise;
                });
                fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getAncillarieSummary').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve(mockAncillariesSummary);
                    return defer.promise;
                });
                fakeCheckAncillariesService.checkAncillaries = jasmine.createSpy('getAncillarieSummary').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve(mockAncillaries);
                    return defer.promise;
                });

                fakeBookingInfo.ancillariesDisabled = false;
                localStorageService.set('bookingInfo', fakeBookingInfo);
                localStorageService.set('seatMapSegment', {segmentId: '1'});
                localStorageService.set('availableSegments', ['1']);
                localStorageService.set('passengersSelected', ['1']);
            })
        );
        it(' init FlyNowConfirmationPAController', () => {
            flyNowConfirmationPAService.getFlyNowConfirmationInfo();
            rootScope.$digest();
        });
        it(' and ancillariesDisabled in bookingInfo is true redirect to boarding pass', () => {
            localStorageService.set('selectedBlockPa', fakeSelectedBlockPa);
            flyNowConfirmationPAService.confirmChangeFlight();
            rootScope.$digest();
            //expect(location.path()).toBe('/ibecbp');
        });
    });

});
