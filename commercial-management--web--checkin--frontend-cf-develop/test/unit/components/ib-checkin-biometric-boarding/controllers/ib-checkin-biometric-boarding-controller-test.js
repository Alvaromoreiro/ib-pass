/* global angular, jasmine */

describe('CheckinBiometricBoardingController', function () {
    'use strict';

    var $controller;
    var $rootScope;
    var $scope;
    var $localStorageService;
    var $q;
    var $timeout;
    var $location;
    var controller;

    var fakeModalService;
    var fakeGetBiometricAllowedDataService;
    var fakeCheckinBiometricBoardingService;
    var IbAncillariesPaymentUtilsService;
    var fakeBoardingCardsService;
    var fakeCkiDatalayerUtilsService;
    var fakeCkiDataLayerService;
    var fakeIbSessionConfigService;

    var initBiometricBoardingDeferred;
    var searchFlightsDeferred;
    var boardingCardsDeferred;
    var checkBiometricBoardingDeferred;

    var fakeCheckinAppConstants = require('/test/constants/ib-check-in-constants.json');
    var fakeCkiDatalayerConstants = require('test/constants/datalayer-cki-constants.json');
    var fakeDigitalDataInfo = require('test/constants/datalayer-general-constants.json');

    var mockBoardingCardsInformation = {
        test: 'test'
    };

    function getInitBiometricBoardingData(passengers) {
        return {
            countriesList: [],
            documentsByCountry: '',
            segmentsPassengersInfo: {
                passengers: angular.isDefined(passengers) ? passengers : [{
                    id: 1,
                    isSelected: true,
                    fieldStatus: {
                        contactData: {
                            show: true
                        },
                        emergencyData: {
                            available: true
                        }
                    }
                }],
                activeFields: {
                    additionalInfoUseForAllCheck: {
                        status: true
                    },
                    emergencyDataUseForAllCheck: {
                        status: true
                    }
                },
                segments: [{
                    passengersStatus: [{
                        name: ''
                    }]
                }]
            }
        };
    }

    function getFlightsPassengersData(passengers) {
        return {
            flightsPassengersInfo: {
                passengers: angular.isDefined(passengers) ? passengers : [{
                    id: 1,
                    contactData: {
                        email: 'example@example.com'
                    },
                    type: 'ADULT',
                    infant: {},
                    gender: [{
                        male: true
                    }]
                }, {
                    id: 2,
                    contactData: null,
                    type: 'ADULT',
                    infant: {},
                    gender: null
                }, {
                    id: 3,
                    contactData: null,
                    type: null,
                    infant: null,
                    gender: null
                }]
            }
        };
    }

    function createFakes() {
        fakeModalService = {
            isWaiting: jasmine.createSpy('isWaiting').and.returnValue(true),
            showGenericModal: jasmine.createSpy('showGenericModal').and.returnValue({
                result: {
                    then: angular.noop
                }
            })
        };

        fakeGetBiometricAllowedDataService = {
            getBiometricalAllowedDocuments: jasmine.createSpy('getBiometricalAllowedDocuments')
        };

        fakeCheckinBiometricBoardingService = {
            initBiometricBoardingPage: jasmine.createSpy('initBiometricBoardingPage'),
            searchFlightsAndPassengers: jasmine.createSpy('searchFlightsAndPassengers'),
            checkBiometricBoardingInfo: jasmine.createSpy('checkBiometricBoardingInfo'),
            getBoardingDocuments: jasmine.createSpy('getBoardingDocuments')
        };

        IbAncillariesPaymentUtilsService = {
            getInfoHeader: jasmine.createSpy('getInfoHeader').and.returnValue(true)
        };

        fakeBoardingCardsService = {
            searchBoardingCardsInformation: jasmine.createSpy('searchBoardingCardsInformation')
        };

        fakeCkiDatalayerUtilsService = {
            updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
            sendDatalayerEvent: jasmine.createSpy('sendDatalayerEvent').and.callFake(angular.noop),
            updateDigitalDataWithQuadrigam: jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(angular.noop),
            updateDatalayerViewEvent: jasmine.createSpy('updateDatalayerViewEvent').and.callFake(angular.noop)
        };

        fakeCkiDataLayerService = {
            setProcessAndStep: jasmine.createSpy('setProcessAndStep').and.callFake(angular.noop)
        };

        fakeIbSessionConfigService = {
            isUserLogged: jasmine.createSpy('isUserLogged').and.returnValue(true)
        };
    }

    function configurePromises() {
        initBiometricBoardingDeferred = $q.defer();
        searchFlightsDeferred = $q.defer();
        boardingCardsDeferred = $q.defer();
        checkBiometricBoardingDeferred = $q.defer();

        fakeCheckinBiometricBoardingService.initBiometricBoardingPage.and.returnValue(
            initBiometricBoardingDeferred.promise
        );

        fakeCheckinBiometricBoardingService.searchFlightsAndPassengers.and.returnValue(
            searchFlightsDeferred.promise
        );

        fakeCheckinBiometricBoardingService.checkBiometricBoardingInfo.and.returnValue(
            checkBiometricBoardingDeferred.promise
        );

        fakeCheckinBiometricBoardingService.getBoardingDocuments.and.returnValue(
            $q.when({})
        );

        fakeGetBiometricAllowedDataService.getBiometricalAllowedDocuments.and.returnValue(
            $q.when({})
        );

        fakeBoardingCardsService.searchBoardingCardsInformation.and.returnValue(
            boardingCardsDeferred.promise
        );
    }

    function setBiometricStorage() {
        $localStorageService.set('biometricStatusPassengers', {
            passengersList: [{
                id: 1,
                type: 'ADULT',
                biometricBoardingStatus: true,
                email: null,
                biometricDocument: {}
            }, {
                id: 2,
                type: 'ADULT',
                biometricBoardingStatus: true,
                email: [{}],
                biometricDocument: null
            }]
        });

        $localStorageService.set('biometricModel', {
            expirationDate: [{}]
        });
    }

    function flushAsync() {
        $rootScope.$digest();

        try {
            $timeout.flush();
        } catch (error) {
            // There are no pending timeouts.
        }

        $rootScope.$digest();
    }

    function resolveActivation(initData, flightsData) {
        initBiometricBoardingDeferred.resolve(initData || getInitBiometricBoardingData());
        searchFlightsDeferred.resolve(flightsData || getFlightsPassengersData());
        boardingCardsDeferred.resolve(mockBoardingCardsInformation);

        flushAsync();
    }

    function createController() {
        controller = $controller('CheckinBiometricBoardingController', {
            $scope: $scope,
            $rootScope: $rootScope,
            $localStorageService: $localStorageService
        });

        controller.data = {
            segmentsPassengersInfo: {}
        };
    }

    beforeEach(function () {
        createFakes();

        angular.mock.module(
            'ib-checkin-biometric-boarding-module',
            'LocalStorageModule',
            function ($provide) {
                $provide.value('BiometricTransformer', {});
                $provide.value('FlightsPassengersTransformer', {});
                $provide.value('PassengerAdditionalInfoService', {});
                $provide.value('FlightsPassengersUtils', {});
                $provide.value('GetFrequentFlyersService', {});
                $provide.value('GetAirlinesService', {});
                $provide.value('GetPhoneCodesService', {});
                $provide.value('GetFlightInfoPassenger', {});
                $provide.value('GetBiometricDataService', {});
                $provide.value('RedirectionService', {});
                $provide.value('GetBiometricCardPassengerAssociationService', {});
                $provide.value('IBCGdprService', {});
                $provide.value('CommonsAncillariesService', {});
                $provide.value('GetCKICachedInformationService', {});
                $provide.value('CallBoardingCardsService', {});
                $provide.value('IbAncillariesPaymentUtilsService', IbAncillariesPaymentUtilsService);
                $provide.value('ModalService', fakeModalService);
                $provide.value('GetBiometricAllowedDataService', fakeGetBiometricAllowedDataService);
                $provide.value('CheckinBiometricBoardingService', fakeCheckinBiometricBoardingService);
                $provide.value('BoardingCardsService', fakeBoardingCardsService);
                $provide.value('CheckinAppConstants', fakeCheckinAppConstants);
                $provide.value('CkiDatalayerConstants', fakeCkiDatalayerConstants);
                $provide.value('DigitalDataInfo', fakeDigitalDataInfo);
                $provide.value('CkiDatalayerUtilsService', fakeCkiDatalayerUtilsService);
                $provide.value('CkiDataLayerService', fakeCkiDataLayerService);
                $provide.value('IbSessionConfigService', fakeIbSessionConfigService);
            }
        );
    });

    beforeEach(inject(function (
        _$controller_,
        _$rootScope_,
        _localStorageService_,
        _$q_,
        _$timeout_,
        _$location_
    ) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $localStorageService = _localStorageService_;
        $q = _$q_;
        $timeout = _$timeout_;
        $location = _$location_;

        configurePromises();
        setBiometricStorage();
        createController();
    }));

    describe('initialization', function () {
        it('should initialize biometric indicators as false', function () {
            expect(controller.biometricBoardingAssociation).toBeFalse();
            expect(controller.biometricNotActivated).toBeFalse();
        });

        it('should load biometric information and update the data layer when promises are resolved', function () {
            resolveActivation();

            expect(
                fakeCheckinBiometricBoardingService.initBiometricBoardingPage
            ).toHaveBeenCalled();

            expect(
                fakeCheckinBiometricBoardingService.searchFlightsAndPassengers
            ).toHaveBeenCalled();

            expect(
                fakeBoardingCardsService.searchBoardingCardsInformation
            ).toHaveBeenCalled();

            expect(
                fakeCkiDatalayerUtilsService.updateDatalayerWithQuadrigam
            ).toHaveBeenCalled();

            expect(
                fakeCkiDatalayerUtilsService.sendDatalayerEvent
            ).toHaveBeenCalled();

            expect(
                fakeCkiDataLayerService.setProcessAndStep
            ).toHaveBeenCalled();

            expect(
                fakeCkiDatalayerUtilsService.updateDigitalDataWithQuadrigam
            ).toHaveBeenCalled();

            expect(
                fakeCkiDatalayerUtilsService.updateDatalayerViewEvent
            ).toHaveBeenCalled();
        });

        it('should resolve initialization when there are no passengers', function () {
            resolveActivation(
                getInitBiometricBoardingData([]),
                getFlightsPassengersData([])
            );

            expect(
                fakeCheckinBiometricBoardingService.initBiometricBoardingPage
            ).toHaveBeenCalled();

            expect(
                fakeCheckinBiometricBoardingService.searchFlightsAndPassengers
            ).toHaveBeenCalled();

            expect(controller.biometricBoardingAssociation).toBeFalse();
        });

        it('should handle initBiometricBoardingPage rejection without leaving pending promises', function () {
            initBiometricBoardingDeferred.reject({
                countriesList: [],
                documentsByCountry: ''
            });

            flushAsync();

            expect(
                fakeCheckinBiometricBoardingService.initBiometricBoardingPage
            ).toHaveBeenCalled();

            expect(controller.model).toBeUndefined();
        });
    });

    describe('goToConfirmation', function () {
        it('should redirect to the confirmation page', function () {
            spyOn($location, 'path');

            controller.goToConfirmation();

            expect($location.path).toHaveBeenCalled();
        });
    });

    describe('biometricBoardingFormComplete', function () {
        beforeEach(function () {
            resolveActivation();
        });

        it('should save biometric association when the service resolves successfully', function () {
            checkBiometricBoardingDeferred.resolve({});

            $rootScope.$broadcast('biometricBoardingFormComplete', '');
            flushAsync();

            expect(
                fakeCheckinBiometricBoardingService.checkBiometricBoardingInfo
            ).toHaveBeenCalled();

            expect(controller.biometricBoardingAssociation).toBeTrue();

            expect(
                $localStorageService.get('biometricBoardingAssociationSuccess')
            ).toBeTrue();
        });
    });

    describe('documentError', function () {
        it('should mark the form and document_number field as invalid', function () {
            controller.bioPassInfoForm = {
                $valid: null,
                document_number: {
                    $error: {
                        new_document: null
                    },
                    $invalid: null
                }
            };

            $rootScope.$broadcast('documentError', '');
            flushAsync();

            expect(controller.bioPassInfoForm.$valid).toBeFalse();

            expect(
                controller.bioPassInfoForm.document_number.$error.new_document
            ).toBeTrue();

            expect(
                controller.bioPassInfoForm.document_number.$invalid
            ).toBeTrue();
        });
    });
});
