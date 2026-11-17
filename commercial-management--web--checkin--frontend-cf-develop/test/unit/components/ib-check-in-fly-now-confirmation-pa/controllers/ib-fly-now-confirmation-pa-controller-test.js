import dayjs from 'dayjs';
describe('FlyNowConfirmationPAController test', () => {

    let controller;
    const fake ={
        ModalService: {
            isWaiting: jasmine.createSpy("isWaiting").and.callFake(angular.noop),
            isNotWaiting: jasmine.createSpy("isNotWaiting").and.callFake(angular.noop),
            setErrorMessage: jasmine.createSpy(),
            setErrorCode: jasmine.createSpy(),
            isError: jasmine.createSpy("isError").and.callFake(() => {
                return { result: { then: angular.noop } };
            }),
            openGenericModal: jasmine.createSpy(),
        },
        FlyNowConfirmationPAService: {
            getFlyNowConfirmationInfo: jasmine.createSpy("getFlyNowConfirmationInfo"),
            confirmChangeFlight: jasmine.createSpy("confirmChangeFlight")
        },
        FlyNowCoPAModel: {
            initializeModel: jasmine.createSpy().and.callFake(angular.noop)
        },
        CkiDatalayerUtilsService: {
            updateDatalayerWithQuadrigam: jasmine.createSpy().and.callFake(angular.noop),
            sendDatalayerEvent: jasmine.createSpy().and.callFake(angular.noop),
            addDataLayerInfo: jasmine.createSpy().and.callFake(angular.noop),
            updateDatalayerInfo: jasmine.createSpy().and.callFake(angular.noop),
            updateDatalayerViewEvent: jasmine.createSpy().and.callFake(angular.noop),
            updateDatalayerInfo: jasmine.createSpy().and.callFake(angular.noop),
            updateDatalayerInfo: jasmine.createSpy().and.callFake(angular.noop),
            updateDatalayerInfo: jasmine.createSpy().and.callFake(angular.noop),
            updateDatalayerInfo: jasmine.createSpy().and.callFake(angular.noop),
            updateDatalayerInitType: jasmine.createSpy().and.callFake(angular.noop),
            updateDigitalDataWithQuadrigam: jasmine.createSpy().and.callFake(angular.noop)
        },
        IbSessionConfigService: {
            isUserLogged: jasmine.createSpy('isUserLogged'),
        },
        CheckinAppConstants: require('test/constants/ib-check-in-constants.json'),
        MonetateUtilsService: {
            updateMonetateWithQuadrigam: jasmine.createSpy("updateMonetateWithQuadrigam"),
        },
        MonetateConstants: {
            MONETATE_INFO: {
                SETPAGETYPE: 'testPageType'
            }
        },
        CkiDataLayerService: {
            setProcessAndStep: jasmine.createSpy().and.callFake(angular.noop)
        },
        CkiDatalayerConstants: require('test/constants/datalayer-cki-constants.json')
    };
    const controllerDependencies = {
        $scope: {},
        $rootScope: {},
        $timeout: {},
        $location: {},
        localStorageService: {},
    };
    const mock = {
        BookingInfo: require('test/mocks/localStorage/booking-info-pa.json'),
        SelectedBlockPa: require('test/mocks/localStorage/selected-block-pa.json'),
        getFlyNowConfirmationInfo: {
            "segmentInfo": {
                "departure": {
                    "cityDescription": "",
                    "cityCode": "",
                    "airportDescription": "AIRPORT",
                    "airportCode": "BCN",
                    "terminal": null,
                    "originalDate": null,
                    "date": "",
                    "hour": ""
                },
                "arrival": {
                    "cityDescription": "",
                    "cityCode": "",
                    "airportDescription": "BARAJAS",
                    "airportCode": "MAD",
                    "terminal": null,
                    "originalDate": null,
                    "date": "",
                    "hour": ""
                },
                "typeOfTransport": "FLIGHT",
                "type": "OPEN"
            },
            "newSegmentInfo": {
                "weekDay": "WEEKDAY_MONDAY",
                "date": "16/10/2023",
                "departureHour": "21:05",
                "arrivalHour": "22:30",
                "cabinClass": {
                    "code": "J",
                    "type": "BUSINESS",
                    "description": "Business",
                    "fareFamily": "BPA",
                    "mainClass": "J"
                },
                "companyImg": "/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg",
                "company": "Iberia"
            }
        },
        TimeSession: {
            'startTime': dayjs(),
            'openedModal': false,
            'failedKeepAliveService': false,
            'timerActivate': true
        }
    }

    beforeEach(() => {
        angular.mock.module('ib-fly-now-confirmation-module', 'LocalStorageModule', ($provide) => {
            $provide.value('ModalService', fake.ModalService);
            $provide.value('FlyNowConfirmationPAService', fake.FlyNowConfirmationPAService);
            $provide.value('FlyNowCoPAModel', fake.FlyNowCoPAModel);
            $provide.value('CkiDatalayerUtilsService', fake.CkiDatalayerUtilsService);
            $provide.value('CkiDatalayerConstants', fake.CkiDatalayerConstants);
            $provide.value('CheckinAppConstants', fake.CheckinAppConstants);
            $provide.value('MonetateUtilsService', fake.MonetateUtilsService);
            $provide.value('MonetateConstants', fake.MonetateConstants);
            $provide.value('CkiDataLayerService', fake.CkiDataLayerService);
            $provide.value('IbSessionConfigService', fake.IbSessionConfigService);
        });
        inject((_$rootScope_, _$controller_, _$location_, _localStorageService_, _$timeout_, $q) => {
            controllerDependencies.$rootScope = _$rootScope_;
            controllerDependencies.$scope = controllerDependencies.$rootScope.$new();
            controllerDependencies.localStorageService = _localStorageService_;
            controllerDependencies.$timeout = _$timeout_;
            controllerDependencies.$location = _$location_;

            controllerDependencies.$rootScope.timeSession = mock.TimeSession;

            fake.FlyNowConfirmationPAService.getFlyNowConfirmationInfo = jasmine.createSpy('getFlyNowConfirmationInfo').and.callFake(function () {
                var defer = $q.defer();
                defer.resolve(mock.getFlyNowConfirmationInfo);
                return defer.promise;
            });


            controller = _$controller_("FlyNowConfirmationPAController", controllerDependencies);
            controllerDependencies.$scope.$digest();
            controllerDependencies.$timeout.flush();


            controllerDependencies.localStorageService.set('selectedBlockPa', mock.SelectedBlockPa);
            controllerDependencies.localStorageService.set('bookingInfo', mock.BookingInfo);
        });
    });

    describe("When activate is called", () => {
        it("FlyNowConfirmationPAService getFlyNowConfirmationInfo should be called", (done) => {
            expect(fake.FlyNowConfirmationPAService.getFlyNowConfirmationInfo).toHaveBeenCalled();
            done();
        });
    });
});
