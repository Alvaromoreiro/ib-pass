import * as angular from 'angular';
import { mock } from '@test/unit/app/pages/ib-web-ancillaries/ib-checkin-ancillaries-service-mock';
import { FakeStorage, StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';

 describe('AncillariesService', () => {
    let AncillariesService, localStorageService, scope, rootScope, $q, $location;

    const fakeAncillariesConstants = {
        APPLICATION_FLOW: {
            CHECKIN: 'CKI'
        }
    };
    const fakeCommonsSessionStorageService = new StorageServiceMock();

    const configureSearchAncillariesMocks = () => {
        const summaryResponse = () => Promise.resolve().then(() => mock.req.summaryInfo);
        mock.dep.fakeAncillariesSummaryService.getAncillarieSummary = jasmine.createSpy('getAncillarieSummary').and.callFake(summaryResponse);
        mock.dep.fakeCommonsAncillariesService.getAncillarieSummary = jasmine.createSpy('getAncillarieSummary').and.callFake(summaryResponse);
        mock.dep.fakeCurrencyService.getCurrencyObject = jasmine.createSpy('getCurrencyObject').and.returnValue(mock.req.currency);
        mock.dep.fakeAncillariesTransformer.generateInfoCommon = jasmine.createSpy('generateInfoCommon').and.returnValue(mock.req.transformedInfo);
        mock.dep.fakeAncillariesTransformer.countSeatsTotal = jasmine.createSpy('countSeatsTotal').and.returnValue(0);
        mock.dep.fakeAncillariesTransformer.transformAncillariesView = jasmine.createSpy('transformAncillariesView').and.returnValue(mock.req.transformedAncillariesInfo);
        AncillariesService.checkPreorder = jasmine.createSpy('checkPreorder').and.returnValue(mock.req.summaryInfo);
    };

    const configureCarbonFootprintDependencies = () => {
        mock.dep.fakeModalServiceAncillaries.showWaitingModal = jasmine.createSpy('showWaitingModal');
        mock.dep.fakeModalServiceAncillaries.isNotWaiting = jasmine.createSpy('isNotWaiting');
        mock.dep.fakeModalServiceAncillaries.showGenericError = jasmine.createSpy('showGenericError').and.returnValue({
            result: { then: function () {}, finally: function () {} }
        });
    };

    const getCarbonFootprintUpdateRequest = () => [{
        type: 'CO2_FOOTPRINT',
        kilosCo2Equivalent: 50.8,
        price: 1.08
    }];

    const expectPaymentError = (error: { data?: { errors: Array<{ reason: string }> }; message?: string; errorCode: number }, expectedMessage: string) => {
        mock.dep.fakeModalServiceAncillaries.isNotWaiting = jasmine.createSpy('isNotWaiting').and.callFake(() => {});
        mock.dep.fakeModalServiceAncillaries.isError = jasmine.createSpy('isError').and.callFake(() => {});
        mock.dep.fakeModalServiceAncillaries.setErrorMessage = jasmine.createSpy('setErrorMessage').and.callFake(() => {});

        AncillariesService.showPaymentError(error);

        expect(mock.dep.fakeModalServiceAncillaries.setErrorMessage).toHaveBeenCalledWith(expectedMessage);
        expect(mock.dep.fakeModalServiceAncillaries.isError).toHaveBeenCalledWith(error.errorCode, null, null);
    };

    const expectCarbonFootprintOutcome = async (options: {
        operation: Promise<void>;
        requestSpy: jasmine.Spy;
        request: object[];
        isRejected: boolean;
        showError: boolean;
    }) => {
        if (options.isRejected) {
            await expectAsync(options.operation).toBeRejected();
        } else {
            await expectAsync(options.operation).toBeResolved();
        }
        expect(options.requestSpy).toHaveBeenCalledWith(options.request);
        expect(mock.dep.fakeModalServiceAncillaries.showWaitingModal).toHaveBeenCalled();
        expect(mock.dep.fakeModalServiceAncillaries.isNotWaiting).toHaveBeenCalled();
        if (options.showError) {
            expect(mock.dep.fakeModalServiceAncillaries.showGenericError).toHaveBeenCalled();
        } else {
            expect(mock.dep.fakeModalServiceAncillaries.showGenericError).not.toHaveBeenCalled();
        }
    };

    const expectGlobickTransferAdded = (addTransfer: (typeQuadrigam: string) => void, transferPayload: object) => {
        const typeQuadrigam = 'IBCOSE';
        addTransfer(typeQuadrigam);

        expect(localStorageService.set).toHaveBeenCalledWith('close', typeQuadrigam);
        expect(localStorageService.set).toHaveBeenCalledWith('ancillariesAction', 'click');
        expect(localStorageService.set).toHaveBeenCalledWith('ancillariesAction', 'addtocart');
        expect(rootScope.$broadcast).toHaveBeenCalledWith('setConfirmed');
        expect(rootScope.$broadcast).toHaveBeenCalledWith('updateHeaderGlobickTransfers', transferPayload);
        expect(mock.dep.fakeDatalayerUtilsService.setAncillariesDatalayer).toHaveBeenCalled();
    };

    beforeEach(function () {
        localStorageService = new FakeStorage();
        angular.mock.module('ib-checkin-ancillaries-module', function ($provide) {
            $provide.value('CallAncillariesPageService', mock.dep.fakeCallAncillariesPageService);
            $provide.value('AncGetCachedInformationService', mock.dep.fakeAncGetCachedInformationService);
            $provide.value('AncillariesCallPaymentsService', mock.dep.fakeAncillariesCallPaymentsService);
            $provide.value('CommonsAncillariesService', mock.dep.fakeCommonsAncillariesService);
            $provide.value('localStorageService', localStorageService);
            $provide.value('CurrencyService', mock.dep.fakeCurrencyService);
            $provide.value('ModalServiceAncillaries', mock.dep.fakeModalServiceAncillaries);
            $provide.value('AncillariesConstants', fakeAncillariesConstants);
            $provide.value('AncillariesSummaryService', mock.dep.fakeAncillariesSummaryService);
            $provide.value('AncillariesUtilsService', mock.dep.fakeAncillariesUtilsService);
            $provide.value('CommonsModalService', mock.dep.fakeCommonsModalService);
            $provide.value('AncillariesTransformer', mock.dep.fakeAncillariesTransformer);
            $provide.value('CkiDatalayerUtilsService', mock.dep.fakeDatalayerUtilsService);
            $provide.value('CommonsGetLoginInfoService', mock.dep.fakeCommonsGetLoginInfoService);
            $provide.value('IbCPermanentUserService', mock.dep.fakeIbCPermanentUserService);
            $provide.value('CommonsLoginUtilsService', mock.dep.fakeCommonsLoginUtilsService);
            $provide.value('NewMainHeaderFacade', mock.dep.fakeNewMainHeaderFacade);
            $provide.value('DatalayerMenusService', mock.dep.fakeDatalayerMenusService);
            $provide.value('CallBundleService', mock.dep.fakeCallBundleService);
            $provide.value('CommonsSessionStorageService', fakeCommonsSessionStorageService);
        });

        angular.mock.inject(($rootScope, _AncillariesService_, _$q_, _$location_) => {
            AncillariesService = _AncillariesService_;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            $q = _$q_;
            $location = _$location_;
            $rootScope.$apply();
        });
    });

    it('AncillariesService should create', () => {
        expect(AncillariesService).toBeTruthy();
    });

    describe('Ancillaries requests', () => {
        it('call searchAncillariesInfo and update ancillaries with cached info', async function () {
            localStorageService.set('bookingInfo', mock.req.bookingInfo);
            localStorageService.set('ancillariesInfo', mock.req.ancillariesInfo);
            localStorageService.set('flightAviosInfo', undefined);
            localStorageService.set('ancillariesTransformedInfo', 'random');
            localStorageService.set('flowApp', 'CKI');

            configureSearchAncillariesMocks();
            mock.dep.fakeAncillariesTransformer.passengerTransformData = jasmine.createSpy('passengerTransformData').and.callFake(function () {
                return mock.req.cachedDataInfo;
            });
            mock.dep.fakeAncillariesTransformer.genCalAviosFligthReq = jasmine.createSpy('genCalAviosFligthReq').and.callFake(() => {
                return 'flightAviosInfoResponse';
            });
            mock.dep.fakeAncillariesTransformer.transformFromLocalStorage = jasmine.createSpy('transformFromLocalStorage').and.callFake(() => {
                return 'transformedAncillariesInfoResponse';
            });

            await AncillariesService.searchAncillariesInfo()
                .then(() => {
                    expect(localStorageService.get('flightAviosInfo')).toEqual('flightAviosInfoResponse');
                    expect(localStorageService.get('ancillariesTransformedInfo')).toEqual('transformedAncillariesInfoResponse');
                    expect(mock.dep.fakeCommonsModalService.finishWaiting).toHaveBeenCalled();
                    expect(mock.dep.fakeModalServiceAncillaries.isNotWaiting).toHaveBeenCalled();
                })
                .catch(() => {});

            expect(AncillariesService).toBeDefined();
        });

        it('call searchAncillariesInfo and update ancillaries with no cached info', async function () {
            localStorageService.set('ancillariesInfo', mock.req.ancillariesInfo);
            localStorageService.set('flowApp', 'CKI');

            configureSearchAncillariesMocks();
            mock.dep.fakeAncGetCachedInformationService.getCachedInformation = jasmine.createSpy('getCachedInformation').and.callFake(() => {
                return Promise.resolve().then(() => {
                    return mock.req.cachedDataInfo;
                });
            });

            await AncillariesService.searchAncillariesInfo()
                .then(() => {
                    expect(mock.dep.fakeCommonsModalService.finishWaiting).toHaveBeenCalled();
                    expect(mock.dep.fakeModalServiceAncillaries.isNotWaiting).toHaveBeenCalled();
                })
                .catch(() => {});

            expect(AncillariesService).toBeDefined();
        });

        it('call generateRequestAncillaries and cancelInsuranceSuccess with parameters and no update', async function () {
            localStorageService.set('flowApp', 'CKI');
            mock.dep.fakeAncillariesUtilsService.isCheckinFlow = jasmine.createSpy('isCheckinFlow').and.callFake(function () {
                return true;
            });
            mock.dep.fakeAncillariesUtilsService.isWaiting = jasmine.createSpy('isWaiting').and.callFake(function () {});
            mock.dep.fakeAncillariesCallPaymentsService.getPayments = jasmine.createSpy('getPayments').and.callFake(function (detailRequest) {
                return Promise.resolve({});
            });
            mock.dep.fakeAncillariesSummaryService.getAncillarieSummary = jasmine.createSpy('getAncillarieSummary').and.callFake(async () => {
                return Promise.resolve().then(() => {});
            });
            AncillariesService.updateAncillariesSuccess = jasmine.createSpy('updateAncillariesSuccess').and.callFake(() => {});
            AncillariesService.checkPreorder = jasmine.createSpy('checkPreorder').and.callFake(() => {
                return mock.req.summaryInfo;
            });

            await AncillariesService.generateRequestAncillaries(mock.req.baggagesTrips, mock.req.speqsTrips, mock.req.insuranceInfo);

            expect(AncillariesService.updateAncillariesSuccess).toHaveBeenCalled();
            expect(AncillariesService).toBeDefined();
        });

        it('call generateRequestAncillaries and cancelInsuranceSuccess with parameters and then updateAncillaries', function () {
            localStorageService.set('flowApp', 'BKI');
            mock.dep.fakeAncillariesUtilsService.isCheckinFlow = jasmine.createSpy('isCheckinFlow').and.callFake(function () {
                return true;
            });
            mock.dep.fakeAncillariesUtilsService.isWaiting = jasmine.createSpy('isWaiting').and.callFake(function () {});
            mock.dep.fakeAncillariesTransformer.buildAncillariesRequest = jasmine.createSpy('buildAncillariesRequest').and.callFake(function () {
                return [{}];
            });
            mock.dep.fakeCommonsAncillariesService.updateAncillaries = jasmine.createSpy('updateAncillaries').and.callFake(function (detailRequest) {
                return Promise.resolve({});
            });

            AncillariesService.generateRequestAncillaries(mock.req.baggagesTrips, mock.req.speqsTrips, mock.req.insuranceInfo);

            expect(AncillariesService).toBeDefined();
            expect(mock.dep.fakeCommonsAncillariesService.updateAncillaries).toHaveBeenCalled();
            mock.dep.fakeCommonsAncillariesService
                .updateAncillaries()
                .then(function (response) {
                    expect(AncillariesService.updateAncillariesSuccess).toHaveBeenCalled();
                })
                .catch(() => {});
        });

        it('call generateRequestAncillaries and cancelInsuranceSuccess with NULL parameters and no update', function () {
            mock.dep.fakeAncillariesUtilsService.isCheckinFlow = jasmine.createSpy('isCheckinFlow').and.callFake(function () {
                return true;
            });
            mock.dep.fakeAncillariesUtilsService.isWaiting = jasmine.createSpy('isWaiting').and.callFake(function () {});
            spyOn(AncillariesService, 'updateAncillariesSuccess');

            AncillariesService.generateRequestAncillaries([], [], null);

            expect(AncillariesService).toBeDefined();
            expect(AncillariesService.updateAncillariesSuccess).toHaveBeenCalled();
        });

        it('shows the ancillary error when insurance deletion fails', async function () {
            localStorageService.set('hasSelectedInsurance', true);
            localStorageService.set('flowApp', 'BBKI');

            mock.dep.fakeAncillariesUtilsService.isCheckinFlow = jasmine.createSpy('isCheckinFlow').and.callFake(function () {
                return true;
            });
            mock.dep.fakeAncillariesUtilsService.isWaiting = jasmine.createSpy('isWaiting').and.callFake(function () {});
            mock.dep.fakeCommonsAncillariesService.deleteAncillarie = jasmine.createSpy('deleteAncillarie').and.callFake(function () {
                return Promise.resolve({
                    failedToDelete: [
                        { ancillarie: 'ancillarie1', error: { description: 'Delete failed', code: 'ERR-1' } },
                        { ancillarie: 'ancillarie2', error: { description: 'Another failure', code: 'ERR-2' } }
                    ]
                });
            });
            const showErrorSpy = spyOn(AncillariesService, 'showError');

            AncillariesService.generateRequestAncillaries([], [], null);
            await Promise.resolve();

            expect(showErrorSpy).toHaveBeenCalledWith({ message: 'Delete failed', internalErrorCode: 'ERR-1' });
        });

        it('updateAncillariesError', () => {
            const error = { errorCode: 500, message: 'Ancillaries update failed' };
            const showServiceErrorSpy = spyOn(AncillariesService, 'showServiceError');

            AncillariesService.updateAncillariesError(error);

            expect(showServiceErrorSpy).toHaveBeenCalledWith(error);
        });

        it('updateAncillariesError and cleanSessionAncillaries', () => {
            localStorageService.set('headerModel', mock.localStorage.headerModel);
            localStorageService.set('addToCart', mock.localStorage.addToCart);

            AncillariesService.cleanSessionAncillaries();

            expect(mock.dep.fakeDatalayerMenusService.updateDataLayer).toHaveBeenCalledWith(mock.resp.reqDatalayer);
        });

        it('getPaymentsSuccess with paymentMethods data and call checkPermanentUserAndGoPayment on BBKI flow', async () => {
            localStorageService.set('flowApp', 'BBKI');
            const param = { paymentMethods: [{ total: 1 }] };
            spyOn($location, 'path');

            mock.dep.fakeIbCPermanentUserService.checkPermanentUserFlow = jasmine.createSpy('checkPermanentUserFlow').and.callFake(async () => {
                return Promise.resolve({}).then(() => {});
            });

            AncillariesService.getPaymentsSuccess(param);
            await mock.dep.fakeIbCPermanentUserService.checkPermanentUserFlow.calls.mostRecent().returnValue;

            expect(AncillariesService).toBeDefined();
            expect($location.path).toHaveBeenCalledWith('/ibpurc');
        });

        it('getPaymentsSuccess with paymentMethods data and call checkPermanentUserAndGoPayment and no BBKI flow', () => {
            localStorageService.set('flowApp', 'CKI');
            const param = { paymentMethods: [] };
            spyOn($location, 'path');

            AncillariesService.getPaymentsSuccess(param);

            expect(AncillariesService).toBeDefined();
            expect($location.path).toHaveBeenCalled();
        });

        it('redirectAfterLoginSoftUser on CKI flow and customer status ok', async () => {
            localStorageService.set('flowApp', 'CKI');

            mock.dep.fakeIbCPermanentUserService.isAfterLoginPermanentUser = jasmine.createSpy('isAfterLoginPermanentUser').and.callFake(() => {
                return true;
            });
            mock.dep.fakeCommonsGetLoginInfoService.checkCustomerStatus = jasmine.createSpy('checkCustomerStatus').and.callFake(() => {
                return Promise.resolve({}).then(() => {});
            });
            mock.dep.fakeCommonsModalService.closeAllCurrentModals = jasmine.createSpy('closeAllCurrentModals').and.callFake(() => {});

            const res = AncillariesService.redirectAfterLoginSoftUser();
            await mock.dep.fakeCommonsGetLoginInfoService
                .checkCustomerStatus()
                .then(() => {
                    expect(mock.dep.fakeCommonsModalService.closeAllCurrentModals).toHaveBeenCalled();
                })
                .catch(() => {});

            expect(AncillariesService).toBeDefined();
            expect(res).toBeTrue();
        });

        it('redirectAfterLoginSoftUser on CKI flow and customer status expired', async () => {
            localStorageService.set('flowApp', 'CKI');
            spyOn($location, 'path');

            mock.dep.fakeIbCPermanentUserService.isAfterLoginPermanentUser = jasmine.createSpy('isAfterLoginPermanentUser').and.callFake(() => {
                return true;
            });
            mock.dep.fakeCommonsGetLoginInfoService.checkCustomerStatus = jasmine.createSpy('checkCustomerStatus').and.callFake(async () => {
                return Promise.reject({}).then(() => {});
            });
            mock.dep.fakeCommonsModalService.closeAllCurrentModals = jasmine.createSpy('closeAllCurrentModals').and.callFake(() => {});
            mock.dep.fakeCommonsLoginUtilsService.updateStateToAnonymous = jasmine.createSpy('updateStateToAnonymous').and.callFake(() => {});
            mock.dep.fakeIbCPermanentUserService.removeParamsAfterLogin = jasmine.createSpy('removeParamsAfterLogin').and.callFake(() => {});

            const res = AncillariesService.redirectAfterLoginSoftUser();
            await mock.dep.fakeCommonsGetLoginInfoService
                .checkCustomerStatus()
                .then(() => {
                    expect(mock.dep.fakeCommonsModalService.closeAllCurrentModals).toHaveBeenCalled();
                    expect(mock.dep.fakeIbCPermanentUserService.removeParamsAfterLogin).toHaveBeenCalled();
                    expect($location.path).toHaveBeenCalled();
                })
                .catch(() => {});

            expect(AncillariesService).toBeDefined();
            expect(res).toBeTrue();
        });

        it('showServiceError with data', () => {
            const error = { data: { errors: ['PMT_PPM_800'] }, errorCode: 410 };
            spyOn($location, 'path');

            AncillariesService.showServiceError(error);

            expect(AncillariesService).toBeDefined();
            expect(localStorageService.get('nextStepAllowed')).toBeFalse();
            expect($location.path).toHaveBeenCalled();
        });

        it('showServiceError with no data', () => {
            const error = {};
            AncillariesService.showPaymentError = jasmine.createSpy('showPaymentError').and.callFake(() => {});

            AncillariesService.showServiceError(error);

            expect(AncillariesService).toBeDefined();
            expect(AncillariesService.showPaymentError).toHaveBeenCalled();
        });

        it('modifiedSeats', () => {
            spyOn($location, 'path');
            const seatMapSegment = { segmentId: 1, pasId: 1 };

            AncillariesService.modifiedSeats(seatMapSegment.segmentId, seatMapSegment.pasId, 'ancillariesModel');

            expect(AncillariesService).toBeDefined();
            expect(localStorageService.get('ancillariesTransformedInfo')).toBe('ancillariesModel');
            expect(localStorageService.get('seatMapSegment')).toEqual(seatMapSegment);
            expect($location.path).toHaveBeenCalled();
        });

        it('cancelSeat resolve ok', async () => {
            const transformDeleteResponse = { error: 'error', data: 'data' };

            mock.dep.fakeCommonsAncillariesService.deleteAncillarie = jasmine.createSpy('deleteAncillarie').and.callFake(() => {
                return Promise.resolve();
            });
            mock.dep.fakeAncillariesTransformer.transformDeleteResponse = jasmine.createSpy('transformDeleteResponse').and.callFake(() => {
                return transformDeleteResponse;
            });
            mock.dep.fakeModalServiceAncillaries.isNotWaiting = jasmine.createSpy('isNotWaiting').and.callFake(() => {});
            AncillariesService.showError = jasmine.createSpy('showError').and.callFake(() => {});

            expect(AncillariesService).toBeDefined();
            await AncillariesService.cancelSeat().then((res) => {
                expect(AncillariesService.showError).toHaveBeenCalled();
                expect(res).toEqual(transformDeleteResponse.data);
            });
        });

        it('showError with BBKI flow', () => {
            localStorageService.set('flowApp', 'BBKI');
            mock.dep.fakeModalServiceAncillaries.isNotWaiting = jasmine.createSpy('isNotWaiting').and.callFake(() => {});
            mock.dep.fakeCommonsModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(function () {
                return { result: { finally: function () {} } };
            });

            const error = { message: 'Payment failed', internalErrorCode: 'ERR-1' };
            AncillariesService.showError(error);

            expect(mock.dep.fakeModalServiceAncillaries.isError).toHaveBeenCalledWith(error, null, null);
        });

        it('showError with no BBKI flow', () => {
            localStorageService.set('flowApp', 'CKI');
            mock.dep.fakeModalServiceAncillaries.isNotWaiting = jasmine.createSpy('isNotWaiting').and.callFake(() => {});
            mock.dep.fakeCommonsModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() => {
                return { result: { finally: function () {} } };
            });
            mock.dep.fakeModalServiceAncillaries.setErrorMessage = jasmine.createSpy('setErrorMessage').and.callFake(() => {});
            mock.dep.fakeModalServiceAncillaries.setErrorCode = jasmine.createSpy('setErrorCode').and.callFake(() => {});
            mock.dep.fakeModalServiceAncillaries.isError = jasmine.createSpy('isError').and.callFake(() => {});

            AncillariesService.showError({ message: 'message', internalErrorCode: 404 });

            expect(AncillariesService).toBeDefined();
            expect(mock.dep.fakeModalServiceAncillaries.isError).toHaveBeenCalled();
        });

        it('showPaymentError with information', () => {
            const error = { data: { errors: [{ reason: 'reason' }] }, errorCode: 404 };
            expectPaymentError(error, error.data.errors[0].reason);
        });

        it('showPaymentError without information', () => {
            const error = { message: 'message', errorCode: 404 };
            expectPaymentError(error, error.message);
        });

        it('updateCarbonFootprint ok', async () => {
            configureCarbonFootprintDependencies();
            mock.dep.fakeCommonsAncillariesService.updateAncillaries = jasmine.createSpy('updateAncillaries').and.callFake(() => Promise.resolve());

            await expectCarbonFootprintOutcome({
                operation: AncillariesService.updateCarbonFootprint(50.8, 1.08),
                requestSpy: mock.dep.fakeCommonsAncillariesService.updateAncillaries,
                request: getCarbonFootprintUpdateRequest(),
                isRejected: false,
                showError: false
            });
        });

        it('deleteCarbonFootprint ok', async () => {
            configureCarbonFootprintDependencies();
            mock.dep.fakeCommonsAncillariesService.deleteAncillarie = jasmine.createSpy('deleteAncillarie').and.callFake(() => Promise.resolve());

            await expectCarbonFootprintOutcome({
                operation: AncillariesService.deleteCarbonFootprint(),
                requestSpy: mock.dep.fakeCommonsAncillariesService.deleteAncillarie,
                request: [{ type: 'CO2_FOOTPRINT' }],
                isRejected: false,
                showError: false
            });
        });

        it('updateCarbonFootprint ko', async () => {
            configureCarbonFootprintDependencies();
            const error = { message: 'message', errorCode: 404 };
            mock.dep.fakeCommonsAncillariesService.updateAncillaries = jasmine.createSpy('updateAncillaries').and.callFake(async () => {
                return Promise.reject(error).then(() => {});
            });

            await expectCarbonFootprintOutcome({
                operation: AncillariesService.updateCarbonFootprint(50.8, 1.08),
                requestSpy: mock.dep.fakeCommonsAncillariesService.updateAncillaries,
                request: getCarbonFootprintUpdateRequest(),
                isRejected: true,
                showError: true
            });
        });

        it('deleteCarbonFootprint ko', async () => {
            configureCarbonFootprintDependencies();
            const error = { message: 'message', errorCode: 404 };
            mock.dep.fakeCommonsAncillariesService.deleteAncillarie = jasmine.createSpy('deleteAncillarie').and.callFake(async () => {
                return Promise.reject(error).then(() => {});
            });

            await expectCarbonFootprintOutcome({
                operation: AncillariesService.deleteCarbonFootprint(),
                requestSpy: mock.dep.fakeCommonsAncillariesService.deleteAncillarie,
                request: [{ type: 'CO2_FOOTPRINT' }],
                isRejected: false,
                showError: true
            });
        });
    });

    describe('gen avios ancillaries ', () => {
        it('genTripsAncillaries', () => {
            AncillariesService.genTripsAncillaries();

            expect(mock.dep.fakeAncillariesTransformer.genStructureForAncillaries).toHaveBeenCalled();
        });

        it('getReqAviosAncillariesPriorityBoarding', () => {
            mock.dep.fakeAncillariesTransformer.genAviosPriorityReq = jasmine.createSpy('genAviosPriorityReq').and.callFake(() => {
                return 'aviosPriorityRes';
            });

            const res = AncillariesService.getReqAviosAncillariesPriorityBoarding();

            expect(AncillariesService).toBeDefined();
            expect(localStorageService.get('genAviosAncillariesPriority')).toEqual('aviosPriorityRes');
            expect(res).toEqual('aviosPriorityRes');
        });

        it('getReqAviosAncillariesBaggages', () => {
            mock.dep.fakeAncillariesTransformer.genReqAviosAncillariesBaggages = jasmine.createSpy('genReqAviosAncillariesBaggages').and.callFake(() => {
                return 'aviosAncillariesBaggagesRes';
            });

            const res = AncillariesService.getReqAviosAncillariesBaggages();

            expect(AncillariesService).toBeDefined();
            expect(localStorageService.get('genAviosAncillariesBaggages')).toEqual('aviosAncillariesBaggagesRes');
            expect(res).toEqual('aviosAncillariesBaggagesRes');
        });

        it('getReqAviosAncillariesSpeq', () => {
            mock.dep.fakeAncillariesTransformer.genAviosSpeqReq = jasmine.createSpy('genAviosSpeqReq').and.callFake(() => {
                return 'aviosAncillariesSpeqRes';
            });

            const res = AncillariesService.getReqAviosAncillariesSpeq();

            expect(AncillariesService).toBeDefined();
            expect(localStorageService.get('genAviosAncillariesSpeq')).toEqual('aviosAncillariesSpeqRes');
            expect(res).toEqual('aviosAncillariesSpeqRes');
        });

        it('getAviosAncillariesSummaryReq', () => {
            AncillariesService.getAviosAncillariesSummaryReq();

            expect(mock.dep.fakeAncillariesTransformer.genAviosAncillariesSummaryReq).toHaveBeenCalled();
            expect(AncillariesService).toBeDefined();
        });

        it('getAviosAncillariesFlex', () => {
            mock.dep.fakeAncillariesTransformer.genAviosFlexOnDemandReq = jasmine.createSpy('genAviosFlexOnDemandReq').and.callFake(() => {
                return 'aviosFlexOnDemandReq';
            });

            const res = AncillariesService.getAviosAncillariesFlex();

            expect(AncillariesService).toBeDefined();
            expect(localStorageService.get('genAviosAncillariesFlex')).toEqual('aviosFlexOnDemandReq');
            expect(res).toEqual('aviosFlexOnDemandReq');
        });
    });

    describe('manage Avios modal', () => {
        it(' and resolve promise', () => {
            const modalObject = { aviosAncillariesReq: 'aviosAncillariesReqResponse', passenger: mock.req.bookingInfo };
            localStorageService.set('bookingInfo', mock.req.bookingInfo);
            mock.dep.fakeAncillariesTransformer.genAviosAncillariesReq = jasmine.createSpy('genAviosAncillariesReq').and.callFake(() => {
                return 'aviosAncillariesReqResponse';
            });
            mock.dep.fakeModalServiceAncillaries.openAviosAccumulatedModal = jasmine.createSpy('openAviosAccumulatedModal').and.callFake(() => {
                return { result: Promise.resolve({}) };
            });

            AncillariesService.manageAviosModal(mock.req.manageAviosModal);

            expect(mock.dep.fakeModalServiceAncillaries.openAviosAccumulatedModal).toHaveBeenCalledWith(modalObject);
        });
    });

    describe('ancillaries basket functions', () => {
        it('should add carbon footprint to basket', () => {
            spyOn(rootScope, '$broadcast').and.callThrough();

            expect(AncillariesService).toBeDefined();

            AncillariesService.addCarbonFootprintToBasket('quadrigam', 50.8, 1.08);

            expect(localStorageService.get('close')).toBe('quadrigam');
            expect(localStorageService.get('ancillariesAction')).toBe('addtocart');
            expect(rootScope.$broadcast).toHaveBeenCalledWith('updateHeaderCarbonFootprint', {
                kilosCo2Equivalent: 50.8,
                price: 1.08
            });
        });

        it('should remove carbon footprint from basket', () => {
            spyOn(rootScope, '$broadcast').and.callThrough();

            expect(AncillariesService).toBeDefined();

            AncillariesService.deleteCarbonFootprintFromBasket();

            expect(rootScope.$broadcast).toHaveBeenCalledWith('updateHeaderCarbonFootprint', null);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('basketUpdateCommonHeader');
        });

        describe('AncillariesService > addGlobickTransfersToBasket*', () => {
    beforeEach(() => {
        // Solo espía si aún no es spy
        if (!jasmine.isSpy(mock.dep.fakeDatalayerUtilsService.setAncillariesDatalayer)) {
            spyOn(mock.dep.fakeDatalayerUtilsService, 'setAncillariesDatalayer');
        } else {
            mock.dep.fakeDatalayerUtilsService.setAncillariesDatalayer.calls.reset(); // Limpia llamadas anteriores
        }

        spyOn(localStorageService, 'set');
        spyOn(rootScope, '$broadcast');
    });

    it('should set localStorage, broadcast events, and call setAncillariesDatalayer for return transfer', () => {
        const dateGoingTrip = '2025-08-01';
        const dateReturnTrip = '2025-08-10';
        const transferCar = 'Van';
        const priceGoing = 100;
        const priceReturn = 120;

        expectGlobickTransferAdded(
            (typeQuadrigam) => AncillariesService.addGlobickTransfersToBasketReturn(
                typeQuadrigam, dateGoingTrip, dateReturnTrip, transferCar, priceGoing, priceReturn
            ),
            { dateGoingTrip, dateReturnTrip, transferCar, priceGoing, priceReturn }
        );
    });

    it('should set localStorage, broadcast events, and call setAncillariesDatalayer for one-way transfer', () => {
        const dateGoingTrip = '2025-08-01';
        const transferCar = 'Van';
        const price = 100;

        expectGlobickTransferAdded(
            (typeQuadrigam) => AncillariesService.addGlobickTransfersToBasket(
                typeQuadrigam, dateGoingTrip, transferCar, price
            ),
            { dateGoingTrip, transferCar, price }
        );
    });
});


    });
});
