describe('BoardingCardsService test', function () {

    var BoardingCardsService, rootScope;
    var mockResponse = 'Ok';
    var mockTransformerResponse = 'transformedData';
    var mockError = {
        'internalErrorCode': 400,
        'message': 'error'
    };

    var fakeBoardingCardsTransformer = {
        transformBoardingCardsView: jasmine.createSpy(),
        createAskForBoardingCardsRequest: jasmine.createSpy(),
        transformPrintedBoardingCards: jasmine.createSpy(),
        getSelectedChannels: jasmine.createSpy(),
        transformInfoInhibitCards: jasmine.createSpy()
    };

    var fakeCallBoardingCardsService = {
        updateBoardingCards: jasmine.createSpy(),
        getBoardingCards: jasmine.createSpy()
    };

    var fakeGetPhoneCodesService = {
        getPrefixes: jasmine.createSpy()
    };

    var fakeIbUtilsService = {
        'saveLocation': jasmine.createSpy(),
        'saveHeaderModel': jasmine.createSpy()
    };

    var CheckinAppConstants = require('test/constants/ib-check-in-constants.json');


    var fakeModalService = {
        isWaiting: jasmine.createSpy('isWaiting').and.callFake(function () { }),
        isNotWaiting: jasmine.createSpy('isNotWaiting').and.callFake(function () { }),
        setErrorMessage: jasmine.createSpy(),
        setErrorCode: jasmine.createSpy(),
        showGenericModal: jasmine.createSpy('showGenericModal'),
        closeAllCurrentModals: jasmine.createSpy('closeAllCurrentModals').and.callFake(function () { }),
        isError: jasmine.createSpy('isError').and.callFake(function () {
            return { 'result': { 'then': function () { } } };
        })
    };
    var fakeGetFlightInfoPassenger = {
        'getFlightInfoPassenger': jasmine.createSpy()
    };
    var fakeGetBiometricDataService = {
        'getBiometricalData': jasmine.createSpy()
    };
    var fakeGetBiometricCardPassengerAssociationService = {
        'getBiometricCardPassengerData': jasmine.createSpy()
    };
    var fakeBiometricTransformer = {
        'transformDataForGetBiometricalData': jasmine.createSpy(),
        'transformBiometricDataResponse': jasmine.createSpy(),
        'transformFlightInfoPassengerRequest': jasmine.createSpy(),
        'transformAssociateBoardingCardRequest': jasmine.createSpy()
    };
    var fakeBoardingCardsModel = {
        boardingInfo : {
            passengersList : [
                {
                    'id': '1',
                    'type': 'ADULT',
                    'name': 'PATO',
                    'surname': 'DONALD',
                    'phone': {
                        'countryCode': {
                            'code': '34',
                            'description': 'Espana / +34'
                        }
                    },
                    'infant': {
                        'id': '1_1',
                        'type': 'INFANT',
                        'name': 'PATITO',
                        'surname': 'DONALD'
                    },
                    'email': 'ma@ma.com'
                },
                {
                    'id': '2',
                    'type': 'ADULT',
                    'name': 'MORENO',
                    'surname': 'DONALD',
                    'phone': {
                        'countryCode': {
                            'code': '34',
                            'description': 'Espana / +34'
                        }
                    }
                }
            ]
        }
    }
    var fakeCookies = {
        'get': jasmine.createSpy()
    }

    const fakeIbBoardingCardsModalService = {
        'showGoogleWalletModal': jasmine.createSpy('showGoogleWalletModal')
    }

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-boarding-cards-module', function ($provide) {
            $provide.value('BoardingCardsTransformer', fakeBoardingCardsTransformer);
            $provide.value('CallBoardingCardsService', fakeCallBoardingCardsService);
            $provide.value('GetPhoneCodesService', fakeGetPhoneCodesService);
            $provide.value('ModalService', fakeModalService);
            $provide.value('IbUtilsService', fakeIbUtilsService);
            $provide.value('CheckinAppConstants', CheckinAppConstants);
            $provide.value('GetBiometricDataService', fakeGetBiometricDataService);
            $provide.value('GetFlightInfoPassenger', fakeGetFlightInfoPassenger);
            $provide.value('GetBiometricCardPassengerAssociationService', fakeGetBiometricCardPassengerAssociationService);
            $provide.value('BiometricTransformer', fakeBiometricTransformer);
            $provide.value('$cookies', fakeCookies);
            $provide.value('IbBoardingCardsModalService', fakeIbBoardingCardsModalService);
        });
        inject(function ($rootScope, _BoardingCardsService_) {
            BoardingCardsService = _BoardingCardsService_;
            rootScope = $rootScope;
        });
    });

    describe('when searchBoardingCardsInformation is called and CallBoardingCardsService and GetPhoneCodesService resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeCallBoardingCardsService.getBoardingCards = jasmine.createSpy('getBoardingCards').and.callFake(function () {
                var deferred = $q.defer();
                var response = deferred.promise;
                deferred.resolve(mockResponse);
                return response;
            });
            fakeGetPhoneCodesService.getPhoneCodesList = jasmine.createSpy('getPrefixes').and.callFake(function () {
                var deferred = $q.defer();
                var response = deferred.promise;
                deferred.resolve(mockResponse);
                return response;
            });
            fakeBoardingCardsTransformer.transformBoardingCardsView = jasmine.createSpy('transformBoardingCardsView').and.callFake(function () {
                return mockTransformerResponse;
            });
        }));
        it('transformed results should be returned', function (done) {
            BoardingCardsService.searchBoardingCardsInformation().then(function (responseData) {
                expect(responseData).toEqual('transformedData');
                done();
            }, angular.noop);
            rootScope.$digest();
        });
    });

    describe('when searchBoardingCardsInformation is called and CallBoardingCardsService rejects the promise', function () {
        beforeEach(inject(function ($q) {
            var mockError = {
                'internalErrorCode': 400,
                'message': 'test'
            };
            fakeCallBoardingCardsService.getBoardingCards = jasmine.createSpy('getBoardingCards').and.callFake(function () {
                var deferred = $q.defer();
                var response = deferred.promise;
                deferred.reject(mockError);
                return response;
            });
        }));

        it('an error should be returned', function (done) {
            BoardingCardsService.searchBoardingCardsInformation().then(function (responseData) {
            }, function (responseError) {
                expect(responseError.message).toEqual('test');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when searchBoardingCardsInformation is called and GetPhoneCodesService rejects the promise', function () {
        beforeEach(inject(function ($q) {
            fakeCallBoardingCardsService.getBoardingCards = jasmine.createSpy('getBoardingCards').and.callFake(function () {
                var deferred = $q.defer();
                var response = deferred.promise;
                deferred.resolve(mockResponse);
                return response;
            });
            fakeGetPhoneCodesService.getPhoneCodesList = jasmine.createSpy('getPrefixes').and.callFake(function () {
                var deferred = $q.defer();
                var response = deferred.promise;
                deferred.reject(mockError);
                return response;
            });
            fakeBoardingCardsTransformer.transformBoardingCardsView = jasmine.createSpy('transformBoardingCardsView').and.callFake(function () {
                return mockTransformerResponse;
            });
        }));

        it('an error should be returned', function (done) {
            BoardingCardsService.searchBoardingCardsInformation().then(function (responseData) {
                expect(responseData).toEqual('transformedData');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when askForBoardingCards is called and CallBoardingCardsService resolve the promise', function () {
        beforeEach(inject(function ($q) {
            fakeBoardingCardsTransformer.createAskForBoardingCardsRequest = jasmine.createSpy('transformUpdateBoardingCards').and.callFake(function () {
                return mockTransformerResponse;
            });
            fakeBoardingCardsTransformer.transformPrintedBoardingCards = jasmine.createSpy('transformPrintedBoardingCards').and.callFake(function () {
                return mockTransformerResponse;
            });
            fakeBoardingCardsTransformer.getSelectedChannels = jasmine.createSpy('getSelectedChannels').and.callFake(function () {
                return mockTransformerResponse;
            });
            fakeCallBoardingCardsService.updateBoardingCards = jasmine.createSpy('updateBoardingCards').and.callFake(function () {
                var deferred = $q.defer();
                var response = deferred.promise;
                deferred.resolve(mockResponse);
                return response;
            });
        }));
        it('askForBoardingCards resolve the promise and returns selectedChannels', function (done) {
            BoardingCardsService.askForBoardingCards({}).then(function (responseData) {
                expect(responseData).toEqual('transformedData');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('when askForBoardingCards is called and CallBoardingCardsService reject the promise', function () {
        beforeEach(inject(function ($q) {
            fakeBoardingCardsTransformer.createAskForBoardingCardsRequest = jasmine.createSpy('createAskForBoardingCardsRequest').and.callFake(function () {
                return mockTransformerResponse;
            });
            fakeCallBoardingCardsService.updateBoardingCards = jasmine.createSpy('updateBoardingCards').and.callFake(function () {
                var deferred = $q.defer();
                var response = deferred.promise;
                deferred.reject(mockError);
                return response;
            });
        }));
        it('ModalService.setErrorMessage should be called with test value', function (done) {
            BoardingCardsService.askForBoardingCards({}).then(angular.noop, function (responseData) {
                expect(responseData.message).toEqual('error');
                done();
            });
            rootScope.$digest();
        });
    });

    describe('openGoogleWalletModal', () => {
        let mockDocuments, mockCallback, mockResult;

        beforeEach(() => {
            mockCallback = jasmine.createSpy('callback');
            mockDocuments = [];
            mockResult = 'success';
            fakeIbBoardingCardsModalService.showGoogleWalletModal.and.returnValue(Promise.resolve(mockResult));
        });

        it('should open the google wallet modal with the correct model', () => {
            mockDocuments = [{
                segments: {}
            }];

            BoardingCardsService.openGoogleWalletModal(mockDocuments, mockCallback);

            expect(fakeIbBoardingCardsModalService.showGoogleWalletModal).toHaveBeenCalledWith({
                segments: mockDocuments[0].segments
            });
        });

        it('should open the google wallet modal with the empty array if the model is incorrect', () => {
            BoardingCardsService.openGoogleWalletModal(mockDocuments, mockCallback);

            expect(fakeIbBoardingCardsModalService.showGoogleWalletModal).toHaveBeenCalledWith({
                segments: []
            });
        });

        it('should execute the callback if promise is sucessfully', async () => {
            BoardingCardsService.openGoogleWalletModal(mockDocuments, mockCallback);

            await Promise.resolve();

            expect(mockCallback).toHaveBeenCalledWith(mockResult);
        });
    });

    describe('when checkBiometricFlow receives completed passengers', function () {
        var $q;

        beforeEach(inject(function (_$q_) {
            $q = _$q_;
            fakeBoardingCardsTransformer.createAskForBoardingCardsRequest.and.returnValue([{ sharings: [] }]);
            fakeBoardingCardsTransformer.transformPrintedBoardingCards.and.returnValue([]);
            fakeBoardingCardsTransformer.getSelectedChannels.and.returnValue({});
            fakeBoardingCardsTransformer.transformInfoInhibitCards.and.returnValue({});
            fakeCallBoardingCardsService.updateBoardingCards.and.returnValue($q.resolve({}));
            fakeModalService.isNotWaiting.calls.reset();
            fakeModalService.showGenericModal.calls.reset();
        }));

        it('shows the automatic biometric modal and records the summary module', function () {
            var status = CheckinAppConstants.BIOMETRIC.STATUS.COMPLETE;
            var model = {
                boardingInfo: {
                    passengersList: [{ biometricBoardingStatus: status }],
                    passengersStatusBySegment: []
                }
            };

            BoardingCardsService.checkBiometricFlow(model);
            rootScope.$digest();

            expect(fakeModalService.isWaiting).toHaveBeenCalled();
            expect(fakeModalService.isNotWaiting).toHaveBeenCalled();
            expect(fakeModalService.showGenericModal).toHaveBeenCalledWith(
                { biometricBoardingSelected: true },
                true,
                'ib-modal-biometric-boarding-automatic'
            );
        });
    });
});
