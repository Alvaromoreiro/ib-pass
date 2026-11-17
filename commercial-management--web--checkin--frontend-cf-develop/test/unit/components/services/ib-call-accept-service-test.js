describe('CallAcceptService test', function () {
    const openSplitModalResponse = {
        data: { locator: 'test' }
    };

    var callAcceptService, localStorageService, rootScope, timeout, route, isEarly,location, $q,
        mockResponse = {
            'code': 201,
            'data': {
                'locator': 'locator'
            }
        },
        mockSuccessResponsePolicy = require('test/mocks/responses/policy.json'),
        mockSuccessResponsePolicySeatNull = require('test/mocks/responses/policy-seat-null.json'),
        mockSuccessResponsePolicy201 = require('test/mocks/responses/policy-201.json'),
        mockGetCached = {
            'passengers': []
        },
        mockPassengers = [
            {},
            {}
        ],
        mockAncillariesSummary = require('test/mocks/responses/ancillaries-summary.json'),
        mockPassengersData = [1, 2],
        mockNextSteps = {
            'SEATS_MAP': 'seatsMap',
            'BOARDING_CARDS': 'boardingCards',
            'FLY_NOW': 'flyNow',
            'FLIGHT_PASSENGER': 'flightPas',
            'GDR': 'gdr'
        },
        fakeFlightsPassengersUtils = {
            'getAcceptUpdateInformation': jasmine.createSpy(),
            'updateSelectedSegments': jasmine.createSpy(),
            'updateSelectedPassengers': jasmine.createSpy('updateSelectedPassengers').and.callFake(function () {
                return [{ 'segment': 'segment' }];
            })
        },
        fakeIbUtilsService = {
            'goIbCose': jasmine.createSpy('goIbcose'),
        },
        fakeIbPassengerBookingUtilsService = {
            'updateCachedInfo': jasmine.createSpy(),
        },
        fakeIbAncillariesPaymentUtilsService = {
            'setAncillariesCurrency': jasmine.createSpy('setAncillariesCurrency').and.callFake(angular.noop),
            'setAncillariesBob': jasmine.createSpy('setAncillariesBob').and.callFake(angular.noop)
        },
        fakeAcceptObjectsPolicyService = {
            'acceptForbiddenObjectsPolicy': jasmine.createSpy()
        },
        fakeModalService = {
            isWaiting: jasmine.createSpy('isWaiting').and.callFake(angular.noop),
            isNotWaiting: jasmine.createSpy('isNotWaiting').and.callFake(angular.noop),
            finishWaiting : jasmine.createSpy('finishWaiting').and.callFake(angular.noop),
            setErrorMessage: jasmine.createSpy(),
            showGenericError: jasmine.createSpy('showGenericError').and.callFake(function () {
                return { 'result': { 'then': function (callback) { callback?.() } } };
            }),
            setErrorCode: jasmine.createSpy(),
            isError: jasmine.createSpy('isError').and.callFake(function () {
                return { 'result': { 'then': angular.noop } };
            }),
            openPendingAQQErrorModal: jasmine.createSpy(),
            openApisUncheckableErrorModal: jasmine.createSpy(),
            openSplitModal: jasmine.createSpy('openSplitModal').and.callFake(function () {
                return { 'result': { 'then': (success) => success?.(openSplitModalResponse) } };
            }),
            showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(function () {
                return { 'result': { 'then': function (callback) { callback?.() } } };
            }),
        },
        fakeBookingInfo = require('test/mocks/localStorage/booking-info.json');
        var mockUncheckableSegments = [{ 'segment': 'segment' }],
        fakeGetCachedInformationService = { 'getCachedInformation': jasmine.createSpy() },
        fakeCheckAncillariesService = { 'checkAncillaries': jasmine.createSpy() },
        fakeCheckPaymentsService = { 'checkPayments': jasmine.createSpy() },
        fakeConfig = { 'SHUTTLE_NEXT_STEPS': { 'SEATS_MAP': 'seatsMap' }, 'FLIGHT_PASSENGERS_STATUS': { 'STANDBY': 'STANDBY' } },
        fakeCkiDatalayerConstants = require('test/constants/datalayer-cki-constants.json'),
        mockFilter = function (input) {
            return {
                'translate': function (input) {
                    return input;
                }
            };
        },
        fakeFlightsPassengersService = { 'checkAvailabilityPassengers': jasmine.createSpy() },
        fakeCommonsAncillariesService = { 'getSummary': jasmine.createSpy(), 'getAncillarieSummary': jasmine.createSpy('getAncillarieSummary') },
        fakeCallAncillariesService = { 'getUpgradingAncillarie': jasmine.createSpy('getUpgradingAncillarie') },
        fakeUpgradingAncillaryToUpgradeInfoMapperService = { 'map': jasmine.createSpy('map') },
        fakeCommonsSessionStorage = { get: jasmine.createSpy('fakeCommonsStorage.get'), set: jasmine.createSpy('fakeCommonsStorage.set') },
        fakeIbCheckinSeatSummaryService = { sendSeatSummaryEventToMonetate: jasmine.createSpy('sendSeatSummaryEventToMonetate'), checkRedirectionPage: jasmine.createSpy('checkRedirectionPage') },
        fakeIbBoardingCardsPrintTransformer = { getPrintedInformation: jasmine.createSpy('getPrintedInformation') };

    beforeEach(function () {
        angular.mock.module('ib-checkin-services-module', 'LocalStorageModule', 'ngRoute', function ($provide) {
            $provide.value('FlightsPassengersUtils', fakeFlightsPassengersUtils);
            $provide.value('IbUtilsService', fakeIbUtilsService);
            $provide.value('IbPassengerBookingUtilsService', fakeIbPassengerBookingUtilsService);
            $provide.value('AcceptObjectsPolicyService', fakeAcceptObjectsPolicyService);
            $provide.value('ModalService', fakeModalService);
            $provide.value('GetCKICachedInformationService', fakeGetCachedInformationService);
            $provide.value('CheckAncillariesService', fakeCheckAncillariesService);
            $provide.value('CheckPaymentsService', fakeCheckPaymentsService);
            $provide.value('CheckinAppConstants', fakeConfig);
            $provide.value('CkiDatalayerConstants', fakeCkiDatalayerConstants);
            $provide.value('translateFilter', mockFilter);
            $provide.value('FlightsPassengersService', fakeFlightsPassengersService);
            $provide.value('CommonsAncillariesService', fakeCommonsAncillariesService);
            $provide.value('CallAncillariesService', fakeCallAncillariesService);
            $provide.value('UpgradingAncillaryToUpgradeInfoMapperService', fakeUpgradingAncillaryToUpgradeInfoMapperService);
            $provide.value('CommonsSessionStorageService', fakeCommonsSessionStorage);
            $provide.value('IbCheckinSeatSummaryService', fakeIbCheckinSeatSummaryService);
            $provide.value('IbAncillariesPaymentUtilsService', fakeIbAncillariesPaymentUtilsService);
            $provide.value('IbBoardingCardsPrintTransformer', fakeIbBoardingCardsPrintTransformer);
        });
        inject(function ($rootScope, _CallAcceptService_, _localStorageService_, $timeout, _$route_, $location, _$q_) {
            rootScope = $rootScope;
            callAcceptService = _CallAcceptService_;
            timeout = $timeout;
            localStorageService = _localStorageService_;
            route = _$route_;
            location = $location;
            $q = _$q_;
        });

        localStorageService.clearAll();
        fakeCallAncillariesService.getUpgradingAncillarie = jasmine.createSpy('getUpgradingAncillarie').and.callFake(function () {
            var defer = $q.defer();
            defer.resolve({ ancillaries: [] });
            return defer.promise;
        });
        fakeUpgradingAncillaryToUpgradeInfoMapperService.map = jasmine.createSpy('map').and.returnValue(null);
    });


    describe('When callAccept() is called', function () {
        describe('When acceptPolicySuccess is called', function () {

            describe('When uncheckableSegments have data', function () {
                beforeEach(inject(function () {
                    isEarly = true;
                }));
                it('and response code is 201, not have uncheckableSegments', function (done) {
                    localStorageService.set('availableSegments', 'availableSegments');
                    localStorageService.set('checkinSurname', 'checkinSurname');
                    inject(function ($q) {
                        fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                            var defer = $q.defer();
                            defer.resolve(mockResponse);
                            return defer.promise;
                        });

                        fakeGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                            var defer = $q.defer();
                            defer.resolve(mockGetCached);
                            return defer.promise;
                        });

                        fakeIbPassengerBookingUtilsService.updateCachedInfo = jasmine.createSpy('updatedCachedInfo').and.callFake(function () {
                            return mockUncheckableSegments;
                        });
                        fakeFlightsPassengersUtils.updateSelectedSegments.and.returnValue($q.resolve(mockUncheckableSegments));
                    });
                    callAcceptService.callAccept(mockPassengers, false, mockNextSteps, isEarly);
                    rootScope.$digest();
                    expect(fakeModalService.showGenericError).toHaveBeenCalled();
                    done();
                });
            });

            describe('When uncheckableSegments doesnt has data', function () {
                describe('when isEarly is false', function () {

                    describe('when bookingInfo have ancillariesDisabled activated', function() {
                        it('redirect to download checkin page', function (done) {
                            localStorageService.set('bookingInfo', fakeBookingInfo);
                            callAcceptService.nextViewAfterAccept(false, mockNextSteps, false);
                            rootScope.$digest();
                            expect(fakeIbCheckinSeatSummaryService.checkRedirectionPage).toHaveBeenCalledWith('ibecbp');
                            done();

                        });
                    })

                    it('calls getPrintedInformation and stores the result with the confirmationInfo key', function () {
                        const printedInformation = { boardingPass: 'printed-information' };
                        fakeIbBoardingCardsPrintTransformer.getPrintedInformation.calls.reset();
                        fakeIbBoardingCardsPrintTransformer.getPrintedInformation.and.returnValue(printedInformation);
                        localStorageService.set('bookingInfo', { ancillariesDisabled: true });

                        callAcceptService.nextViewAfterAccept(false, mockNextSteps, { code: 200, data: {} });

                        expect(fakeIbBoardingCardsPrintTransformer.getPrintedInformation).toHaveBeenCalled();
                        expect(localStorageService.get('confirmationInfo')).toEqual(printedInformation);
                    });

                    describe('when acceptInfo.code === 201 && acceptInfo.data.locator != null', function () {

                        describe('when getCachedInformation is success', function () {
                            beforeEach(
                                inject(function ($q) {
                                    fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                                        var defer = $q.defer();
                                        defer.resolve(mockSuccessResponsePolicy201);
                                        return defer.promise;
                                    });

                                    fakeGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                                        var defer = $q.defer();
                                        defer.resolve(mockPassengersData);
                                        return defer.promise;
                                    });

                                    fakeIbPassengerBookingUtilsService.updateCachedInfo = jasmine.createSpy('updateCachedInfo').and.callFake(function () {
                                        return [];
                                    });

                                    fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getSummary').and.callFake(function () {
                                        var defer = $q.defer();
                                        defer.resolve(mockAncillariesSummary);
                                        return defer.promise;
                                    });
                                    fakeCheckAncillariesService.checkAncillaries = jasmine.createSpy('checkAncillaries').and.callFake(function () {
                                        var defer = $q.defer();
                                        defer.resolve();
                                        return defer.promise;
                                    });
                                })
                            );
                            it('Open SplitModal', function (done) {
                                callAcceptService.callAccept(mockPassengersData, false, mockNextSteps, false);
                                rootScope.$digest();
                                expect(fakeModalService.openSplitModal).toHaveBeenCalled();
                                expect(fakeIbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
                                expect(location.path()).toBe('/ibcose');
                                done();

                            });
                        });

                        describe('when getCachedInformation is failed', function () {
                            beforeEach(
                                inject(function ($q) {
                                    fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                                        var defer = $q.defer();
                                        defer.resolve(mockSuccessResponsePolicy201);
                                        return defer.promise;
                                    });

                                    fakeGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                                        var defer = $q.defer();
                                        defer.reject(mockPassengersData);
                                        return defer.promise;
                                    });

                                    fakeIbPassengerBookingUtilsService.updateCachedInfo = jasmine.createSpy('updateCachedInfo').and.callFake(function () {
                                        return [];
                                    });

                                    fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getSummary').and.callFake(function () {
                                        var defer = $q.defer();
                                        defer.resolve(mockAncillariesSummary);
                                        return defer.promise;
                                    });
                                    fakeCheckAncillariesService.checkAncillaries = jasmine.createSpy('checkAncillaries').and.callFake(function () {
                                        var defer = $q.defer();
                                        defer.resolve();
                                        return defer.promise;
                                    });
                                })
                            );
                            it('Open showGenericError', function (done) {
                                callAcceptService.callAccept(mockPassengersData, false, mockNextSteps, false);
                                rootScope.$digest();
                                expect(fakeModalService.showGenericError).toHaveBeenCalled();
                                expect(fakeIbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
                                done();

                            });
                        });
                    });

                    describe('when acceptInfo.code === 200', function () {
                        describe('when checkAncillaries', function () {

                            describe('when printBoardingCard is true', function () {

                                describe('when pendingPayments is true', function () {
                                    beforeEach(
                                        inject(function ($q) {
                                            fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                                                var defer = $q.defer();
                                                defer.resolve(mockSuccessResponsePolicy);
                                                return defer.promise;
                                            });

                                            fakeGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                                                var defer = $q.defer();
                                                defer.resolve(mockPassengersData);
                                                return defer.promise;
                                            });

                                            fakeIbPassengerBookingUtilsService.updateCachedInfo = jasmine.createSpy('updateCachedInfo').and.callFake(function () {
                                                return [];
                                            });

                                            fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getSummary').and.callFake(function () {
                                                var defer = $q.defer();
                                                defer.resolve(mockAncillariesSummary);
                                                return defer.promise;
                                            });
                                            fakeCheckAncillariesService.checkAncillaries = jasmine.createSpy('checkAncillaries').and.callFake(function () {
                                                var defer = $q.defer();
                                                defer.resolve();
                                                return defer.promise;
                                            });
                                        })
                                    );

                                    it('and Call checkpaymentservice', function (done) {
                                        localStorageService.set('pendingPayments', true);
                                        callAcceptService.callAccept(mockPassengersData, true, mockNextSteps, false);
                                        rootScope.$digest();
                                        expect(fakeCheckPaymentsService.checkPayments).toHaveBeenCalled();
                                        expect(fakeIbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
                                        done();

                                    });
                                });

                                describe('when pendingPayments is false', function () {

                                    describe('when checkAncillaries is success', function () {
                                        beforeEach(
                                            inject(function ($q) {
                                                fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                                                    var defer = $q.defer();
                                                    defer.resolve(mockSuccessResponsePolicy);
                                                    return defer.promise;
                                                });

                                                fakeGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                                                    var defer = $q.defer();
                                                    defer.resolve(mockPassengersData);
                                                    return defer.promise;
                                                });

                                                fakeIbPassengerBookingUtilsService.updateCachedInfo = jasmine.createSpy('updateCachedInfo').and.callFake(function () {
                                                    return [];
                                                });

                                                fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getSummary').and.callFake(function () {
                                                    var defer = $q.defer();
                                                    defer.resolve(mockAncillariesSummary);
                                                    return defer.promise;
                                                });
                                                fakeCheckAncillariesService.checkAncillaries = jasmine.createSpy('checkAncillaries').and.callFake(function () {
                                                    var defer = $q.defer();
                                                    defer.resolve();
                                                    return defer.promise;
                                                });
                                            })
                                        );

                                        it('and redirect to ibecbp', function (done) {
                                            localStorageService.set('pendingPayments', false);
                                            callAcceptService.callAccept(mockPassengersData, true, mockNextSteps, false);
                                            rootScope.$digest();
                                            expect(fakeCheckPaymentsService.checkPayments).toHaveBeenCalled();
                                            expect(fakeIbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
                                            expect(location.path()).toBe('/ibecbp');
                                            done();

                                        });
                                    });

                                    describe('when checkAncillaries failed', function () {
                                        beforeEach(
                                            inject(function ($q) {
                                                fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                                                    var defer = $q.defer();
                                                    defer.resolve(mockSuccessResponsePolicy);
                                                    return defer.promise;
                                                });

                                                fakeGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                                                    var defer = $q.defer();
                                                    defer.resolve(mockPassengersData);
                                                    return defer.promise;
                                                });

                                                fakeIbPassengerBookingUtilsService.updateCachedInfo = jasmine.createSpy('updateCachedInfo').and.callFake(function () {
                                                    return [];
                                                });

                                                fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getSummary').and.callFake(function () {
                                                    var defer = $q.defer();
                                                    defer.resolve(mockAncillariesSummary);
                                                    return defer.promise;
                                                });
                                                fakeCheckAncillariesService.checkAncillaries = jasmine.createSpy('checkAncillaries').and.callFake(function () {
                                                    var defer = $q.defer();
                                                    defer.reject();
                                                    return defer.promise;
                                                });
                                            })
                                        );

                                        it('check serviceError for next step', function (done) {
                                            localStorageService.set('pendingPayments', false);
                                            fakeCommonsAncillariesService.getAncillarieSummary.and.returnValue($q.reject());

                                            callAcceptService.callAccept(mockPassengersData, true, mockNextSteps, false);
                                            rootScope.$digest();

                                            expect(fakeModalService.isNotWaiting).toHaveBeenCalled();
                                            expect(fakeIbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
                                            expect(location.path()).toBe('/ibecbp');
                                            done();

                                        });
                                    });

                                });

                            });

                            describe('when printBoardingCard is false', function () {

                                describe('when UPGRADING partial ancillary is available', function () {
                                    var upgradingAncillarieResponse, mappedUpgradeInfo;

                                    beforeEach(
                                        inject(function ($q) {
                                            upgradingAncillarieResponse = {
                                                currencies: [{
                                                    code: 'EUR',
                                                    description: 'Euro',
                                                    symbol: '€',
                                                    alignment: 'R',
                                                    groupingSeparator: '.',
                                                    decimalSeparator: ',',
                                                    decimals: 2,
                                                    recommendedDisplay: 'symbol'
                                                }],
                                                ancillaries: [{
                                                    type: 'UPGRADING',
                                                    status: { code: 'AVAILABLE' },
                                                    currency: 'EUR',
                                                    offers: [{
                                                        id: 'FIRST',
                                                        offerSegmentsClass: [{
                                                            segmentId: '3',
                                                            cabinClass: { code: 'U', type: 'BUSINESS', description: 'Business' }
                                                        }]
                                                    }]
                                                }]
                                            };

                                            mappedUpgradeInfo = {
                                                type: 'UPGRADING',
                                                currency: {
                                                    code: 'EUR',
                                                    description: 'Euro',
                                                    symbol: '€',
                                                    alignment: 'R',
                                                    groupingSeparator: '.',
                                                    decimalSeparator: ',',
                                                    decimals: 2,
                                                    recommendedDisplay: 'symbol'
                                                },
                                                offers: [{
                                                    id: 'FIRST',
                                                    offerSegmentClasses: [{
                                                        segment: 3,
                                                        cabinClass: { code: 'U', type: 'BUSINESS', description: 'Business' }
                                                    }]
                                                }]
                                            };

                                            fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                                                var defer = $q.defer();
                                                mockSuccessResponsePolicy.data.upgrading = true;
                                                defer.resolve(mockSuccessResponsePolicy);
                                                return defer.promise;
                                            });

                                            fakeCallAncillariesService.getUpgradingAncillarie = jasmine.createSpy('getUpgradingAncillarie').and.callFake(function () {
                                                var defer = $q.defer();
                                                defer.resolve(upgradingAncillarieResponse);
                                                return defer.promise;
                                            });

                                            fakeUpgradingAncillaryToUpgradeInfoMapperService.map = jasmine.createSpy('map').and.returnValue(mappedUpgradeInfo);

                                            fakeGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                                                var defer = $q.defer();
                                                defer.resolve(mockPassengersData);
                                                return defer.promise;
                                            });

                                            fakeIbPassengerBookingUtilsService.updateCachedInfo = jasmine.createSpy('updateCachedInfo').and.callFake(function () {
                                                return [];
                                            });

                                            fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getSummary').and.callFake(function () {
                                                var defer = $q.defer();
                                                defer.resolve(mockAncillariesSummary);
                                                return defer.promise;
                                            });
                                            fakeCheckAncillariesService.checkAncillaries = jasmine.createSpy('checkAncillaries').and.callFake(function () {
                                                var defer = $q.defer();
                                                defer.resolve();
                                                return defer.promise;
                                            });
                                        })
                                    );

                                    it('and response code is 200, stores mapped upgradeInfo and redirects to /ckiancupp', function (done) {
                                        callAcceptService.callAccept(mockPassengersData, false, mockNextSteps, false);
                                        rootScope.$digest();

                                        expect(fakeCallAncillariesService.getUpgradingAncillarie).toHaveBeenCalled();
                                        expect(fakeUpgradingAncillaryToUpgradeInfoMapperService.map).toHaveBeenCalledWith(upgradingAncillarieResponse);
                                        expect(fakeCommonsAncillariesService.getAncillarieSummary).not.toHaveBeenCalled();
                                        expect(fakeIbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
                                        expect(location.path()).toBe('/ckiancupp');
                                        expect(localStorageService.get('upgradeInfo')).toEqual(mappedUpgradeInfo);

                                        done();

                                    });
                                });

                                describe('when UPGRADING partial ancillary request fails', function () {
                                    beforeEach(
                                        inject(function ($q) {
                                            fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                                                var defer = $q.defer();
                                                defer.resolve(mockSuccessResponsePolicy);
                                                return defer.promise;
                                            });

                                            fakeCallAncillariesService.getUpgradingAncillarie = jasmine.createSpy('getUpgradingAncillarie').and.callFake(function () {
                                                var defer = $q.defer();
                                                defer.reject({});
                                                return defer.promise;
                                            });

                                            fakeGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                                                var defer = $q.defer();
                                                defer.resolve(mockPassengersData);
                                                return defer.promise;
                                            });

                                            fakeIbPassengerBookingUtilsService.updateCachedInfo = jasmine.createSpy('updateCachedInfo').and.callFake(function () {
                                                return [];
                                            });

                                            fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getSummary').and.callFake(function () {
                                                var defer = $q.defer();
                                                defer.resolve(mockAncillariesSummary);
                                                return defer.promise;
                                            });
                                            fakeCheckAncillariesService.checkAncillaries = jasmine.createSpy('checkAncillaries').and.callFake(function () {
                                                var defer = $q.defer();
                                                defer.resolve();
                                                return defer.promise;
                                            });
                                        })
                                    );

                                    it('continues normal ancillary flow without invoking the mapper', function (done) {
                                        localStorageService.set('availableSegments', [1]);
                                        localStorageService.set('passengersSelected', [1]);

                                        callAcceptService.callAccept(mockPassengersData, false, 'seatsMap', false);
                                        rootScope.$digest();

                                        expect(fakeCallAncillariesService.getUpgradingAncillarie).toHaveBeenCalled();
                                        expect(fakeUpgradingAncillaryToUpgradeInfoMapperService.map).not.toHaveBeenCalled();
                                        expect(fakeCommonsAncillariesService.getAncillarieSummary).toHaveBeenCalled();
                                        expect(fakeIbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
                                        expect(location.path()).toBe('/ckianc');

                                        done();
                                    });
                                });

                                describe('when UPGRADING partial ancillary is not available', function () {

                                    describe('when CommonsAncillariesService.getAncillarieSummary is success', function () {
                                        describe('when continueFlow is called', function () {

                                            describe('when nextStep === CheckinAppConstants.SHUTTLE_NEXT_STEPS.SEATS_MAP', function () {
                                                beforeEach(
                                                    inject(function ($q) {
                                                        fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                                                            var defer = $q.defer();
                                                            mockSuccessResponsePolicy.data.upgrading = false;
                                                            defer.resolve(mockSuccessResponsePolicy);
                                                            return defer.promise;
                                                        });

                                                        fakeGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                                                            var defer = $q.defer();
                                                            defer.resolve(mockPassengersData);
                                                            return defer.promise;
                                                        });
                                                        fakeIbPassengerBookingUtilsService.updateCachedInfo = jasmine.createSpy('updateCachedInfo').and.callFake(function () {
                                                            return [];
                                                        });

                                                        fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getSummary').and.callFake(function () {
                                                            var defer = $q.defer();
                                                            defer.resolve(mockAncillariesSummary);
                                                            return defer.promise;
                                                        });
                                                        fakeCheckAncillariesService.checkAncillaries = jasmine.createSpy('checkAncillaries').and.callFake(function () {
                                                            var defer = $q.defer();
                                                            defer.resolve();
                                                            return defer.promise;
                                                        });
                                                    })
                                                );

                                                it('and redirect to ckianc', function (done) {
                                                    localStorageService.set('availableSegments', [1]);
                                                    localStorageService.set('passengersSelected', [1]);

                                                    callAcceptService.callAccept(mockPassengersData, false, 'seatsMap', false);
                                                    rootScope.$digest();

                                                    expect(fakeCallAncillariesService.getUpgradingAncillarie).toHaveBeenCalled();
                                                    expect(fakeUpgradingAncillaryToUpgradeInfoMapperService.map).toHaveBeenCalled();
                                                    expect(localStorageService.get('upgradeInfo')).toBeNull();
                                                    expect(fakeCommonsSessionStorage.set).toHaveBeenCalledWith('isPaFlow', true);
                                                    expect(fakeIbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
                                                    expect(location.path()).toBe('/ckianc');
                                                    done();

                                                });
                                            });

                                            describe('when nextStep !== CheckinAppConstants.SHUTTLE_NEXT_STEPS.SEATS_MAP', function () {
                                                beforeEach(
                                                    inject(function ($q) {
                                                        fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                                                            var defer = $q.defer();
                                                            mockSuccessResponsePolicy.data.upgrading = false;
                                                            defer.resolve(mockSuccessResponsePolicy);
                                                            return defer.promise;
                                                        });

                                                        fakeGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                                                            var defer = $q.defer();
                                                            defer.resolve(mockPassengersData);
                                                            return defer.promise;
                                                        });

                                                        fakeIbPassengerBookingUtilsService.updateCachedInfo = jasmine.createSpy('updateCachedInfo').and.callFake(function () {
                                                            return [];
                                                        });

                                                        fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getSummary').and.callFake(function () {
                                                            var defer = $q.defer();
                                                            defer.resolve(mockAncillariesSummary);
                                                            return defer.promise;
                                                        });
                                                        fakeCheckAncillariesService.checkAncillaries = jasmine.createSpy('checkAncillaries').and.callFake(function () {
                                                            var defer = $q.defer();
                                                            defer.resolve();
                                                            return defer.promise;
                                                        });
                                                    })
                                                );

                                                it('and response code is 200, not have uncheckableSegments', function (done) {
                                                    callAcceptService.callAccept(mockPassengersData, false, mockNextSteps, false);
                                                    rootScope.$digest();
                                                    expect(fakeModalService.showGenericError).toHaveBeenCalled();
                                                    done();

                                                });
                                            });
                                        });

                                        describe('when checkAncillaries failed', () => {
                                            it('and has pendingPayments', (done) => {
                                                localStorageService.set('pendingPayments', true);
                                                fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy.and.returnValue($q.resolve(mockSuccessResponsePolicy));
                                                fakeIbPassengerBookingUtilsService.updateCachedInfo.and.returnValue([]);
                                                fakeCommonsAncillariesService.getAncillarieSummary.and.returnValue($q.resolve(mockAncillariesSummary));
                                                fakeCheckAncillariesService.checkAncillaries.and.returnValue($q.reject('error'));

                                                callAcceptService.callAccept(mockPassengersData, false, mockNextSteps, false);
                                                rootScope.$digest();

                                                expect(fakeIbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
                                                expect(location.path()).toBe('/ibpurc');

                                                done();
                                            });
                                        });

                                    });
                                    describe('when CommonsAncillariesService.getAncillarieSummary failed', function () {
                                        beforeEach(
                                            inject(function ($q) {
                                                fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                                                    var defer = $q.defer();
                                                    mockSuccessResponsePolicy.data.upgrading = false;
                                                    defer.resolve(mockSuccessResponsePolicy);
                                                    return defer.promise;
                                                });

                                                fakeGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                                                    var defer = $q.defer();
                                                    defer.resolve(mockPassengersData);
                                                    return defer.promise;
                                                });

                                                fakeIbPassengerBookingUtilsService.updateCachedInfo = jasmine.createSpy('updateCachedInfo').and.callFake(function () {
                                                    return [];
                                                });

                                                fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getSummary').and.callFake(function () {
                                                    var defer = $q.defer();
                                                    defer.reject(mockAncillariesSummary);
                                                    return defer.promise;
                                                });
                                                fakeCheckAncillariesService.checkAncillaries = jasmine.createSpy('checkAncillaries').and.callFake(function () {
                                                    var defer = $q.defer();
                                                    defer.resolve();
                                                    return defer.promise;
                                                });
                                            })
                                        );

                                        it('and uncheckableSegments is true', function (done) {
                                            const acceptInfoClone = structuredClone(mockSuccessResponsePolicySeatNull);
                                            acceptInfoClone.data.acceptedSegments[0].passengers[0].purchaseSeatRequired = true;

                                            fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy.and.returnValue($q.resolve(acceptInfoClone));

                                            callAcceptService.callAccept(mockPassengersData, false, mockNextSteps, false);
                                            rootScope.$digest();

                                            expect(fakeModalService.showGenericError).toHaveBeenCalled();
                                            expect(fakeIbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
                                            expect(fakeIbUtilsService.goIbCose).toHaveBeenCalled();

                                            done();
                                        });

                                        it('and uncheckableSegments is false', function (done) {
                                            callAcceptService.callAccept(mockPassengersData, false, mockNextSteps, false);
                                            rootScope.$digest();
                                            expect(fakeModalService.isNotWaiting).toHaveBeenCalled();
                                            expect(fakeIbCheckinSeatSummaryService.checkRedirectionPage).toHaveBeenCalledWith('ibecbp');
                                            done();

                                        });
                                    });

                                });
                            });
                        });
                    });

                });

                describe('when isEarly is true', function () {
                    beforeEach(
                        inject(function ($q) {
                            fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                                var defer = $q.defer();
                                mockSuccessResponsePolicy.data.upgrading = false;
                                defer.resolve(mockSuccessResponsePolicySeatNull);
                                return defer.promise;
                            });

                            fakeGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                                var defer = $q.defer();
                                defer.resolve(mockPassengersData);
                                return defer.promise;
                            });

                            fakeIbPassengerBookingUtilsService.updateCachedInfo = jasmine.createSpy('updateCachedInfo').and.callFake(function () {
                                return [];
                            });

                            fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getSummary').and.callFake(function () {
                                var defer = $q.defer();
                                defer.resolve(mockAncillariesSummary);
                                return defer.promise;
                            });
                            fakeCheckAncillariesService.checkAncillaries = jasmine.createSpy('checkAncillaries').and.callFake(function () {
                                var defer = $q.defer();
                                defer.resolve();
                                return defer.promise;
                            });
                        })
                    );

                    describe('when FlightsPassengersService.checkAvailabilitySeatsPassengers is success', function () {
                        describe('when response exist', function () {
                            beforeEach(
                                inject(function ($q) {
                                    fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                                        var defer = $q.defer();
                                        mockSuccessResponsePolicy.data.upgrading = false;
                                        defer.resolve(mockSuccessResponsePolicy);
                                        return defer.promise;
                                    });

                                    fakeGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                                        var defer = $q.defer();
                                        defer.resolve(mockPassengersData);
                                        return defer.promise;
                                    });

                                    fakeIbPassengerBookingUtilsService.updateCachedInfo = jasmine.createSpy('updateCachedInfo').and.callFake(function () {
                                        return [];
                                    });

                                    fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getSummary').and.callFake(function () {
                                        var defer = $q.defer();
                                        defer.resolve(mockAncillariesSummary);
                                        return defer.promise;
                                    });
                                    fakeCheckAncillariesService.checkAncillaries = jasmine.createSpy('checkAncillaries').and.callFake(function () {
                                        var defer = $q.defer();
                                        defer.resolve();
                                        return defer.promise;
                                    });
                                    fakeFlightsPassengersService.checkAvailabilitySeatsPassengers = jasmine.createSpy('checkAvailabilitySeatsPassengers').and.callFake(function () {
                                        var defer = $q.defer();
                                        defer.resolve(true);
                                        return defer.promise;
                                    });
                                })
                            );

                            it('and go to checkAcceptResponse', function (done) {
                                callAcceptService.callAccept(mockPassengersData, false, mockNextSteps, true);
                                rootScope.$digest();
                                expect(fakeModalService.isNotWaiting).toHaveBeenCalled();
                                expect(fakeModalService.isWaiting).toHaveBeenCalled();
                                done();

                            });
                        });

                        describe('when response doesnt exist and seatsAssigned is false', function () {
                            beforeEach(
                                inject(function ($q) {
                                    fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                                        var defer = $q.defer();
                                        mockSuccessResponsePolicy.data.upgrading = false;
                                        defer.resolve(mockSuccessResponsePolicySeatNull);
                                        return defer.promise;
                                    });

                                    fakeGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                                        var defer = $q.defer();
                                        defer.resolve(mockPassengersData);
                                        return defer.promise;
                                    });

                                    fakeIbPassengerBookingUtilsService.updateCachedInfo = jasmine.createSpy('updateCachedInfo').and.callFake(function () {
                                        return [];
                                    });

                                    fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getSummary').and.callFake(function () {
                                        var defer = $q.defer();
                                        defer.resolve(mockAncillariesSummary);
                                        return defer.promise;
                                    });
                                    fakeCheckAncillariesService.checkAncillaries = jasmine.createSpy('checkAncillaries').and.callFake(function () {
                                        var defer = $q.defer();
                                        defer.resolve();
                                        return defer.promise;
                                    });
                                    fakeFlightsPassengersService.checkAvailabilitySeatsPassengers = jasmine.createSpy('checkAvailabilitySeatsPassengers').and.callFake(function () {
                                        var defer = $q.defer();
                                        defer.resolve();
                                        return defer.promise;
                                    });
                                })
                            );

                            it('and showgenericerror is called', function (done) {
                                callAcceptService.callAccept(mockPassengersData, false, mockNextSteps, true);
                                rootScope.$digest();
                                expect(fakeModalService.isNotWaiting).toHaveBeenCalled();
                                expect(fakeIbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
                                expect(fakeModalService.showGenericModal).toHaveBeenCalled();
                                expect(fakeIbUtilsService.goIbCose).toHaveBeenCalled();
                                done();

                            });
                        });
                    });

                    describe('when FlightsPassengersService.checkAvailabilitySeatsPassengers has error', function () {
                        beforeEach(
                            inject(function ($q) {
                                fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                                    var defer = $q.defer();
                                    mockSuccessResponsePolicy.data.upgrading = false;
                                    defer.resolve(mockSuccessResponsePolicy);
                                    return defer.promise;
                                });

                                fakeGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                                    var defer = $q.defer();
                                    defer.resolve(mockPassengersData);
                                    return defer.promise;
                                });

                                fakeIbPassengerBookingUtilsService.updateCachedInfo = jasmine.createSpy('updateCachedInfo').and.callFake(function () {
                                    return [];
                                });

                                fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getSummary').and.callFake(function () {
                                    var defer = $q.defer();
                                    defer.resolve(mockAncillariesSummary);
                                    return defer.promise;
                                });
                                fakeCheckAncillariesService.checkAncillaries = jasmine.createSpy('checkAncillaries').and.callFake(function () {
                                    var defer = $q.defer();
                                    defer.resolve();
                                    return defer.promise;
                                });
                                fakeFlightsPassengersService.checkAvailabilitySeatsPassengers = jasmine.createSpy('checkAvailabilitySeatsPassengers').and.callFake(function () {
                                    var defer = $q.defer();
                                    defer.reject();
                                    return defer.promise;
                                });
                            })
                        );

                        it('and showgenericerror', function (done) {
                            callAcceptService.callAccept(mockPassengersData, false, mockNextSteps, true);
                            rootScope.$digest();
                            expect(fakeIbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
                            expect(fakeModalService.showGenericError).toHaveBeenCalled();
                            expect(fakeIbUtilsService.goIbCose).toHaveBeenCalled();
                            done();

                        });
                    });
                });
            });

        });

        describe('When acceptPolicyError is called', () => {
            it('and internalErrorCode is different to IB_00002', function (done) {
                localStorageService.set('availableSegments', 'availableSegments');
                localStorageService.set('checkinSurname', 'checkinSurname');
                inject(function ($q) {
                    fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy = jasmine.createSpy('acceptForbiddenObjectsPolicy').and.callFake(function () {
                        var defer = $q.defer();
                        defer.reject(mockResponse);
                        return defer.promise;
                    });

                    fakeGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(function () {
                        var defer = $q.defer();
                        defer.resolve(mockGetCached);
                        return defer.promise;
                    });
                });

                callAcceptService.callAccept(mockPassengers, true, mockNextSteps, true);
                rootScope.$digest();

                expect(fakeModalService.showGenericError).toHaveBeenCalled();
                expect(fakeGetCachedInformationService.getCachedInformation).toHaveBeenCalled();
                expect(localStorageService.get('bookingInfo')).toEqual(mockGetCached);
                expect(fakeIbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
                expect(location.path()).toBe('/ibcoac');

                done();
            });

            it('and internalErrorCode is IB_00002', function (done) {
                localStorageService.set('availableSegments', 'availableSegments');
                localStorageService.set('checkinSurname', 'checkinSurname');
                localStorageService.set('bookingInfo', mockGetCached);
                fakeAcceptObjectsPolicyService.acceptForbiddenObjectsPolicy.and.returnValue($q.reject(mockResponse));
                fakeGetCachedInformationService.getCachedInformation.and.returnValue($q.reject());

                callAcceptService.callAccept(mockPassengers, true, mockNextSteps, true);
                rootScope.$digest();

                expect(fakeModalService.showGenericError).toHaveBeenCalled();
                expect(fakeGetCachedInformationService.getCachedInformation).toHaveBeenCalled();
                expect(localStorageService.get('bookingInfo')).toEqual(mockGetCached);
                expect(fakeIbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate).toHaveBeenCalledWith(false);
                expect(location.path()).toBe('/ibcoac');

                done();
            });
        });

    });



});
