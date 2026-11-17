describe('CheckinBiometricBoardingService focused behavior', function () {
    var service;
    var $rootScope;
    var $q;
    var mocks;

    function resolveWithDigest (promise) {
        var result;
        promise.then(function (data) {
            result = data;
        });
        $rootScope.$digest();
        return result;
    }

    beforeEach(function () {
        mocks = {
            BiometricTransformer: {
                transformInitServiceResponse: jasmine.createSpy('transformInitServiceResponse'),
                transformBiometricBoardingInfoRequest: jasmine.createSpy('transformBiometricBoardingInfoRequest')
            },
            FlightsPassengersTransformer: {
                transformSegmentsPassengersInfo: jasmine.createSpy('transformSegmentsPassengersInfo')
            },
            PassengerAdditionalInfoService: {},
            FlightsPassengersUtils: {
                getPassengerAdditionalInfo: jasmine.createSpy('getPassengerAdditionalInfo').and.returnValue([]),
                getPassengerEmergencyInfo: jasmine.createSpy('getPassengerEmergencyInfo').and.returnValue([])
            },
            GetFrequentFlyersService: { getFrequentFlyers: jasmine.createSpy('getFrequentFlyers') },
            IbUtilsService: {
                removeParameterURL: jasmine.createSpy('removeParameterURL')
            },
            GetAirlinesService: { getAirlines: jasmine.createSpy('getAirlines') },
            GetPhoneCodesService: { getPhoneCodesList: jasmine.createSpy('getPhoneCodesList') },
            localStorageService: {
                get: jasmine.createSpy('get').and.returnValue(null),
                set: jasmine.createSpy('set')
            },
            ModalService: {
                isWaiting: jasmine.createSpy('isWaiting'),
                isNotWaiting: jasmine.createSpy('isNotWaiting'),
                isWaitingGeneric: jasmine.createSpy('isWaitingGeneric'),
                finishWaiting: jasmine.createSpy('finishWaiting')
            },
            GetBiometricAllowedDataService: { getBiometricalAllowedDocuments: jasmine.createSpy('getBiometricalAllowedDocuments') },
            BiometricErrorFilter: { errorHandlerManagement: jasmine.createSpy('errorHandlerManagement') },
            GetBiometricCardPassengerAssociationService: { associateBoardingCardsOrchestrator: jasmine.createSpy('associateBoardingCardsOrchestrator') },
            IBCGdprService: { getGdprInfo: jasmine.createSpy('getGdprInfo') },
            CkiDatalayerConstants: { DATALAYER_MODAL_ID: {} },
            CommonsAncillariesService: {},
            GetCKICachedInformationService: {},
            CallBoardingCardsService: { getBoardingCards: jasmine.createSpy('getBoardingCards') },
            IbSessionConfigService: { isUserLogged: jasmine.createSpy('isUserLogged').and.returnValue(false) },
            IbAncillariesPaymentUtilsService: { checkPendingPayments: jasmine.createSpy('checkPendingPayments').and.returnValue(false) }
        };

        angular.mock.module('ib-checkin-biometric-boarding-module', 'ib-http-services-module', 'LocalStorageModule', function ($provide) {
            angular.forEach(mocks, function (dependency, name) {
                $provide.value(name, dependency);
            });
        });
    });

    beforeEach(angular.mock.inject(function (_CheckinBiometricBoardingService_, _$rootScope_, _$q_) {
        service = _CheckinBiometricBoardingService_;
        $rootScope = _$rootScope_;
        $q = _$q_;
    }));

    it('initializes biometric data and resolves the transformed response', function () {
        var allowedData = { documents: ['passport'] };
        var gdprData = { accepted: true };
        var transformedData = { documents: ['passport'], gdpr: gdprData };
        mocks.GetBiometricAllowedDataService.getBiometricalAllowedDocuments.and.returnValue($q.when(allowedData));
        mocks.IBCGdprService.getGdprInfo.and.returnValue($q.when(gdprData));
        mocks.BiometricTransformer.transformInitServiceResponse.and.returnValue(transformedData);

        var result = resolveWithDigest(service.initBiometricBoardingPage());

        expect(mocks.ModalService.isWaiting).toHaveBeenCalled();
        expect(mocks.IBCGdprService.getGdprInfo).toHaveBeenCalledWith('DIGTRABIO');
        expect(mocks.BiometricTransformer.transformInitServiceResponse).toHaveBeenCalledWith(allowedData, gdprData);
        expect(mocks.ModalService.isNotWaiting).toHaveBeenCalled();
        expect(result).toBe(transformedData);
    });

    it('associates boarding cards and updates the biometric model', function () {
        var model = { id: 'passenger-1' };
        var request = { passengerId: 'passenger-1' };
        var response = { associated: true };
        mocks.BiometricTransformer.transformBiometricBoardingInfoRequest.and.returnValue(request);
        mocks.GetBiometricCardPassengerAssociationService.associateBoardingCardsOrchestrator.and.returnValue($q.when(response));

        var result = resolveWithDigest(service.checkBiometricBoardingInfo(model));

        expect(mocks.BiometricTransformer.transformBiometricBoardingInfoRequest).toHaveBeenCalledWith(model);
        expect(mocks.GetBiometricCardPassengerAssociationService.associateBoardingCardsOrchestrator).toHaveBeenCalledWith(request);
        expect(model.associated).toBe(true);
        expect(mocks.ModalService.isWaitingGeneric).toHaveBeenCalledWith('ib-biometric-boarding-form-loading.html');
        expect(mocks.ModalService.isNotWaiting).toHaveBeenCalled();
        expect(result).toBe(response);
    });

    it('returns the boarding cards and closes the waiting state', function () {
        var cards = [{ id: 'card-1' }];
        mocks.CallBoardingCardsService.getBoardingCards.and.returnValue($q.when(cards));

        var result = resolveWithDigest(service.getBoardingDocuments());

        expect(mocks.ModalService.isWaiting).toHaveBeenCalled();
        expect(mocks.CallBoardingCardsService.getBoardingCards).toHaveBeenCalled();
        expect(mocks.ModalService.isNotWaiting).toHaveBeenCalled();
        expect(result).toBe(cards);
    });

    it('loads the required data and resolves formatted flight information', function () {
        var bookingInfo = { segments: [], passengers: [], outwardSegments: [], returnSegments: [] };
        var prefixes = [{ code: 'ES' }];
        var airlines = [{ code: 'IB' }];
        var gdprInfo = { accepted: true };
        var frequentFlyers = [{ code: 'IB' }];
        var formattedInfo = { passengers: [] };

        mocks.localStorageService.get.and.callFake(function (key) {
            if (key === 'bookingInfo') {
                return bookingInfo;
            }
            if (key === 'urlParams') {
                return {};
            }
            return null;
        });
        mocks.GetPhoneCodesService.getPhoneCodesList.and.returnValue($q.when(prefixes));
        mocks.GetAirlinesService.getAirlines.and.returnValue($q.when(airlines));
        mocks.IBCGdprService.getGdprInfo.and.returnValue($q.when(gdprInfo));
        mocks.GetFrequentFlyersService.getFrequentFlyers.and.returnValue($q.when(frequentFlyers));
        mocks.FlightsPassengersTransformer.transformSegmentsPassengersInfo.and.returnValue(formattedInfo);

        var result = resolveWithDigest(service.searchFlightsAndPassengers());

        expect(mocks.GetPhoneCodesService.getPhoneCodesList).toHaveBeenCalled();
        expect(mocks.GetAirlinesService.getAirlines).toHaveBeenCalled();
        expect(mocks.IBCGdprService.getGdprInfo).toHaveBeenCalledWith('IBPRIVAC');
        expect(mocks.GetFrequentFlyersService.getFrequentFlyers).toHaveBeenCalled();
        expect(mocks.FlightsPassengersTransformer.transformSegmentsPassengersInfo).toHaveBeenCalledWith(
            bookingInfo,
            prefixes,
            frequentFlyers,
            [],
            [],
            gdprInfo,
            undefined
        );
        expect(mocks.localStorageService.set).toHaveBeenCalledWith('disruptionContactApis', []);
        expect(mocks.localStorageService.set).toHaveBeenCalledWith('pendingPayments', false);
        expect(result).toBe(formattedInfo);
    });
});
