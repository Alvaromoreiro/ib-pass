'use strict';

function createPassengerServiceMocks() {
    return {
        localStorageService: {
            get: jasmine.createSpy('get'),
            set: jasmine.createSpy('set')
        },
        GetCKICachedInformationService: {
            getCachedInformation: jasmine.createSpy('getCachedInformation')
        },
        GetPhoneCodesService: {
            getPhoneCodesList: jasmine.createSpy('getPhoneCodesList'),
        },
        FlightsPassengersTransformer: {
            transformSegmentsPassengersInfo: jasmine.createSpy('transformSegmentsPassengersInfo').and.returnValue({}),
            generateUpdataContactDetails: jasmine.createSpy('generateUpdataContactDetails').and.returnValue({ contact: true }),
            updateEmergencyAlternativeDetails: jasmine.createSpy('updateEmergencyAlternativeDetails').and.returnValue({ emergency: true }),
        },
        GetFrequentFlyersService: {
            getFrequentFlyers: jasmine.createSpy('getFrequentFlyers'),
        },
        FlightsPassengersUtils: {
            getPassengerAdditionalInfo: jasmine.createSpy('getPassengerAdditionalInfo').and.returnValue([0]),
            getPassengerEmergencyInfo: jasmine.createSpy('getPassengerEmergencyInfo').and.returnValue([0]),
        },
        PassengerAdditionalInfoService: {
            getAdditionalInfo: jasmine.createSpy('getAdditionalInfo'),
            getEmergencyInfo: jasmine.createSpy('getEmergencyInfo'),
        },
        IbSessionConfigService: {
            isUserLogged: jasmine.createSpy('isUserLogged').and.returnValue(false)
        },
        GetAirlinesService: {
            getAirlines: jasmine.createSpy('getAirlines'),
        },
        IBCGdprService: {
            getGdprInfo: jasmine.createSpy('getGdprInfo'),
        },
    };
}

function createModalServiceMocks() {
    return {
        ModalService: {
            isNotWaiting: jasmine.createSpy('isNotWaiting'),
            isWaiting: jasmine.createSpy('isWaiting'),
            showGenericError: jasmine.createSpy('showGenericError'),
            showGenericModal: jasmine.createSpy('showGenericModal'),
            setErrorMessage: jasmine.createSpy('setErrorMessage'),
            isError: jasmine.createSpy('isError'),
            setErrorCode: jasmine.createSpy('setErrorCode')
        },
    };
}

function createAncillaryServiceMocks() {
    return {
        CheckAncillariesService: {},
        CommonsAncillariesService: {
            getAncillarieSummary: jasmine.createSpy('getAncillarieSummary'),
            deleteAllAncillaries: jasmine.createSpy('deleteAllAncillaries'),
        },
        IbAncillariesPaymentUtilsService: {
            checkPendingPayments: jasmine.createSpy('checkPendingPayments').and.returnValue(false),
            checkFailedPendingPayments: jasmine.createSpy('checkFailedPendingPayments').and.returnValue(null),
        },
    };
}

function createContactServiceMocks() {
    return {
        CommonsGetWcsPhonesService: {
            getPhoneByCode: jasmine.createSpy('getPhoneByCode')
        },
        IBCContactDataService: {
            getContactData: jasmine.createSpy('getContactData'),
            updateContactData: jasmine.createSpy('updateContactData')
        },
        IBCContactDetailsZeroService: {
            getContactDetailsData: jasmine.createSpy('getContactDetailsData'),
            updateContactDetailsData: jasmine.createSpy('updateContactDetailsData')
        },
        IBCAlternativeContactDataService: {
            getAlternativeContactData: jasmine.createSpy('getAlternativeContactData'),
            updateAlternativeContactData: jasmine.createSpy('updateAlternativeContactData')
        },
        UpdateMemberService: {
            updateMember: jasmine.createSpy('updateMember')
        },
        CommonsUtilService: {},
        CommonsUserUtilsService: {
            isIbPlus: jasmine.createSpy('isIbPlus').and.returnValue(false)
        },
    };
}

function createServiceMocks() {
    return {
        ...createPassengerServiceMocks(),
        ...createModalServiceMocks(),
        ...createAncillaryServiceMocks(),
        ...createContactServiceMocks(),
        CkiDatalayerConstants: require('test/constants/datalayer-cki-constants.json'),
        CheckinAppConstants: require('test/constants/ib-check-in-constants.json'),
    };
}

describe('Service: FlightsPassengersService', () => {
    let service;
    let $rootScope;
    let $q;
    let $location;

    const externalServicesMock = createServiceMocks();

    beforeEach(() => {
        angular.mock.module('ib-checkin-flights-passengers-module', ($provide) => {
            Object.entries(externalServicesMock).forEach(([serviceName, mock]) => {
                $provide.value(serviceName, mock);
            });
        });

        inject((FlightsPassengersService, _$rootScope_, _$q_, _$location_) => {
            $q = _$q_;
            $rootScope = _$rootScope_;
            $location = _$location_;
            service = FlightsPassengersService;
        });

        spyOn($location, 'path').and.callThrough();
        externalServicesMock.GetCKICachedInformationService.getCachedInformation.calls.reset();
    });

    function resolveServiceCall(promise) {
        let result;
        promise.then((value) => { result = value; });
        $rootScope.$digest();
        return result;
    }

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('searchFlightsAndPassengers', () => {
        beforeEach(() => {
            externalServicesMock.localStorageService.get.and.returnValue({});
            externalServicesMock.GetPhoneCodesService.getPhoneCodesList.and.returnValue($q.resolve(true));
            externalServicesMock.GetAirlinesService.getAirlines.and.returnValue($q.resolve(true));
            externalServicesMock.IBCGdprService.getGdprInfo.and.returnValue($q.resolve(true));
            externalServicesMock.GetFrequentFlyersService.getFrequentFlyers.and.returnValue($q.resolve(true));
            externalServicesMock.PassengerAdditionalInfoService.getAdditionalInfo.and.returnValue($q.resolve([]));
            externalServicesMock.PassengerAdditionalInfoService.getEmergencyInfo.and.returnValue($q.resolve([]));
            externalServicesMock.IbAncillariesPaymentUtilsService.checkPendingPayments.and.returnValue(false);
            externalServicesMock.IbAncillariesPaymentUtilsService.checkFailedPendingPayments.and.returnValue(null);
        });

        function mockPendingPaymentsCancellationFlow(refreshBookingInfoPromise) {
            externalServicesMock.localStorageService.get.and.callFake((key) => {
                const map = {
                    bookingInfo: { some: 'booking' },
                    urlParams: {},
                    PNR: 'ABC123'
                };
                return map[key];
            });

            externalServicesMock.IbAncillariesPaymentUtilsService.checkPendingPayments.and.returnValue(true);

            externalServicesMock.ModalService.showGenericModal.and.returnValue({
                result: $q.resolve()
            });

            externalServicesMock.CommonsAncillariesService.deleteAllAncillaries.and.returnValue($q.resolve({}));
            externalServicesMock.GetCKICachedInformationService.getCachedInformation.and.returnValue(refreshBookingInfoPromise);
        }

        function executePendingPaymentsCancellationFlow(refreshBookingInfoPromise, onSuccess, onError) {
            mockPendingPaymentsCancellationFlow(refreshBookingInfoPromise);
            service.searchFlightsAndPassengers().then(onSuccess, onError);
            $rootScope.$digest();
        }

        function expectRefreshErrorModal(error) {
            expect(externalServicesMock.ModalService.isNotWaiting).toHaveBeenCalled();
            expect(externalServicesMock.ModalService.setErrorCode).toHaveBeenCalledWith(error.internalErrorCode);
            expect(externalServicesMock.ModalService.setErrorMessage).toHaveBeenCalledWith(error.message);
            expect(externalServicesMock.ModalService.isError).toHaveBeenCalledWith(error);
        }

        it('should refreshBookingInfo if not have cached data', (done) => {
            externalServicesMock.localStorageService.get.and.returnValue(undefined);
            externalServicesMock.GetCKICachedInformationService.getCachedInformation.and.returnValue($q.resolve(true));

            service.searchFlightsAndPassengers()
                .then(() => {
                    expect(externalServicesMock.GetCKICachedInformationService.getCachedInformation).toHaveBeenCalled();
                    expect(externalServicesMock.localStorageService.set).toHaveBeenCalled();
                    done();
                }, (error) => done.fail(error));

            $rootScope.$digest();
        });

        it('should refreshBookingInfo but up error modal', () => {
            const errorMock = { message: 'error', internalErrorCode: 'ERROR_CODE' };

            externalServicesMock.localStorageService.get.and.returnValue(undefined);
            externalServicesMock.GetCKICachedInformationService.getCachedInformation.and.returnValue($q.reject(errorMock));

            service.searchFlightsAndPassengers();
            $rootScope.$digest();

            expectRefreshErrorModal(errorMock);
        });

        it('should not call refreshBookingInfo if exists cached data', (done) => {
            externalServicesMock.localStorageService.get.and.returnValue({});

            service.searchFlightsAndPassengers()
                .then(() => {
                    expect(externalServicesMock.GetCKICachedInformationService.getCachedInformation).not.toHaveBeenCalled();
                    done();
                }, (error) => done.fail(error));

            $rootScope.$digest();
        });

        it('should execute all the catch routes if the external services failed', (done) => {
            externalServicesMock.GetPhoneCodesService.getPhoneCodesList.and.returnValue($q.reject(true));
            externalServicesMock.GetAirlinesService.getAirlines.and.returnValue($q.reject(true));
            externalServicesMock.IBCGdprService.getGdprInfo.and.returnValue($q.reject(true));
            externalServicesMock.GetFrequentFlyersService.getFrequentFlyers.and.returnValue($q.reject(true));
            externalServicesMock.PassengerAdditionalInfoService.getAdditionalInfo.and.returnValue($q.reject('error'));

            service.searchFlightsAndPassengers()
                .then(() => {
                    expect(externalServicesMock.localStorageService.set).toHaveBeenCalledWith('disruptionContactApis', []);
                    expect(externalServicesMock.IbAncillariesPaymentUtilsService.checkPendingPayments).toHaveBeenCalled();
                    expect(externalServicesMock.localStorageService.get).toHaveBeenCalledWith('urlParams');
                    expect(externalServicesMock.FlightsPassengersTransformer.transformSegmentsPassengersInfo).toHaveBeenCalled();
                    done();
                }, (error) => done.fail(error));

            $rootScope.$digest();
        });

        it('should refresh booking info after cancelling pending payments and resolve with formatted info', (done) => {
            const refreshedBookingInfo = { refreshed: true };

            executePendingPaymentsCancellationFlow($q.resolve(refreshedBookingInfo), () => {
                expect(externalServicesMock.CommonsAncillariesService.deleteAllAncillaries).toHaveBeenCalled();
                expect(externalServicesMock.GetCKICachedInformationService.getCachedInformation).toHaveBeenCalled();
                expect(externalServicesMock.localStorageService.set).toHaveBeenCalledWith('bookingInfo', refreshedBookingInfo);
                expect(externalServicesMock.ModalService.isNotWaiting).toHaveBeenCalled();
                expect(externalServicesMock.FlightsPassengersTransformer.transformSegmentsPassengersInfo).toHaveBeenCalled();
                done();
            }, (error) => done.fail(error));
        });

        it('should reject when refreshBookingInfo fails after cancelling pending payments', (done) => {
            const errorMock = { message: 'error', internalErrorCode: 'ERROR_CODE' };

            executePendingPaymentsCancellationFlow($q.reject(errorMock), () => {
                done.fail('Expected promise to be rejected');
            }, (error) => {
                expect(error).toEqual(errorMock);
                expectRefreshErrorModal(errorMock);
                done();
            });
        });

        describe('contact and phone operations', () => {
            it('loads standard contact data when the user is not an Iberia Plus member', () => {
                const response = { phone: '12345' };
                externalServicesMock.CommonsUserUtilsService.isIbPlus.and.returnValue(false);
                externalServicesMock.IBCContactDetailsZeroService.getContactDetailsData.and.returnValue($q.resolve(response));

                const result = resolveServiceCall(service.getContactData());

                expect(externalServicesMock.IBCContactDetailsZeroService.getContactDetailsData).toHaveBeenCalled();
                expect(externalServicesMock.IBCContactDataService.getContactData).not.toHaveBeenCalled();
                expect(result).toEqual(response);
            });

            it('loads Iberia Plus contact data when the user is a member', () => {
                const response = { phone: '67890' };
                externalServicesMock.CommonsUserUtilsService.isIbPlus.and.returnValue(true);
                externalServicesMock.IBCContactDataService.getContactData.and.returnValue($q.resolve(response));

                const result = resolveServiceCall(service.getContactData());

                expect(externalServicesMock.IBCContactDataService.getContactData).toHaveBeenCalled();
                expect(result).toEqual(response);
            });

            it('loads alternative contact data', () => {
                const response = { email: 'alternative@example.test' };
                externalServicesMock.IBCAlternativeContactDataService.getAlternativeContactData.and.returnValue($q.resolve(response));

                const result = resolveServiceCall(service.getAlternativeContactData());

                expect(externalServicesMock.IBCAlternativeContactDataService.getAlternativeContactData).toHaveBeenCalled();
                expect(result).toEqual(response);
            });

            it('updates standard contact details with the transformed request', () => {
                const input = { phone: '12345' };
                const response = { updated: true };
                externalServicesMock.CommonsUserUtilsService.isIbPlus.and.returnValue(false);
                externalServicesMock.FlightsPassengersTransformer.generateUpdataContactDetails.and.returnValue({ phone: '54321' });
                externalServicesMock.IBCContactDetailsZeroService.updateContactDetailsData.and.returnValue($q.resolve(response));

                const result = resolveServiceCall(service.updateContactDetails(input));

                expect(externalServicesMock.FlightsPassengersTransformer.generateUpdataContactDetails).toHaveBeenCalledWith(input);
                expect(externalServicesMock.IBCContactDetailsZeroService.updateContactDetailsData).toHaveBeenCalledWith({ phone: '54321' });
                expect(result).toEqual(response);
            });

            it('updates Iberia Plus contact details through the member endpoint', () => {
                const input = { phone: '12345' };
                externalServicesMock.CommonsUserUtilsService.isIbPlus.and.returnValue(true);
                externalServicesMock.FlightsPassengersTransformer.generateUpdataContactDetails.and.returnValue({ phone: '54321' });
                externalServicesMock.IBCContactDataService.updateContactData.and.returnValue($q.resolve({ updated: true }));
                externalServicesMock.UpdateMemberService.updateMember.and.returnValue($q.resolve({ memberUpdated: true }));
                const contactResult = resolveServiceCall(service.updateContactDetails(input));
                const memberResult = resolveServiceCall(service.updateMember(input));

                expect(externalServicesMock.IBCContactDataService.updateContactData).toHaveBeenCalledWith({ phone: '54321' });
                expect(contactResult).toEqual({ updated: true });
                expect(externalServicesMock.UpdateMemberService.updateMember).toHaveBeenCalledWith({ phone: '54321' });
                expect(memberResult).toEqual({ memberUpdated: true });
            });

            it('updates alternative contact data with the transformed emergency details', () => {
                const input = { email: 'alternative@example.test' };
                externalServicesMock.FlightsPassengersTransformer.updateEmergencyAlternativeDetails.and.returnValue({ email: 'updated@example.test' });
                externalServicesMock.IBCAlternativeContactDataService.updateAlternativeContactData.and.returnValue($q.resolve({ updated: true }));

                const result = resolveServiceCall(service.updateAlternativeContact(input));

                expect(externalServicesMock.FlightsPassengersTransformer.updateEmergencyAlternativeDetails).toHaveBeenCalledWith(input);
                expect(externalServicesMock.IBCAlternativeContactDataService.updateAlternativeContactData).toHaveBeenCalledWith({ email: 'updated@example.test' });
                expect(result).toEqual({ updated: true });
            });

            it('resolves with an empty phone list when the WCS phone lookup fails', () => {
                externalServicesMock.CommonsGetWcsPhonesService.getPhoneByCode.and.returnValue($q.reject(new Error('unavailable')));

                const result = resolveServiceCall(service.getWCSPhones());

                expect(result).toEqual({});
            });
        });
    });
});