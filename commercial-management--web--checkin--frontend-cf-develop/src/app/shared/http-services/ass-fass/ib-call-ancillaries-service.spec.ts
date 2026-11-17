import angular from 'angular';
import { FakeStorage } from 'test/mocks/Services/StorageServiceMock';
import { CheckinAncillariesConstants } from '@src/app/core/constants/ib-ancillaries-constants';
import { IbSessionConfigService } from '@src/app/core/services/ib-session-config.service';
import { CallAncillariesService } from './ib-call-ancillaries-service';

describe('CallAncillariesService test', () => {
    let callAncillariesService: CallAncillariesService;
    let commonsSessionStorageService: FakeStorage;
    let sessionConfigService: jasmine.SpyObj<IbSessionConfigService>;

    const fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake((error, reject) => reject(error))
    };

    const fakeCommonsGenericProxy = {
        getGeneric: jasmine.createSpy('getGeneric')
    };

    beforeEach(() => {
        commonsSessionStorageService = new FakeStorage();
        sessionConfigService = jasmine.createSpyObj<IbSessionConfigService>('IbSessionConfigService', ['getFlowId', 'setPNR']);
        sessionConfigService.getFlowId.and.callFake(() => commonsSessionStorageService.get('flowId'));

        angular.mock.module('ib-shared-services-module', ($provide, $filterProvider) => {
            $provide.value('CommonsSessionStorageService', commonsSessionStorageService);
            $provide.value('IbSessionConfigService', sessionConfigService);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);

            $filterProvider.register('translate', () => (key: string) => key);
        });

        angular.mock.inject((_CallAncillariesService_: CallAncillariesService) => {
            callAncillariesService = _CallAncillariesService_;
        });

        fakeCommonsGenericProxy.getGeneric.calls.reset();
        fakeCommonsNewHttpUtilsErrorService.controlError.calls.reset();
    });

    it('should create the service', () => {
        expect(callAncillariesService).toBeDefined();
    });

    describe('getAncillaries', () => {
        it('should request ancillaries with the stored PNR and configured timeout', async () => {
            const flowId = 'CHECKIN_001';
            const locator = 'ABC123';
            const timeout = 15000;
            const responseData = { ancillaries: [{ type: 'BAGGAGE' }] };
            const endpoint =
                `${CheckinAncillariesConstants.DEFAULT_ENDPOINTS.ancillariesURI}${flowId}/ancillaries?locator=${locator}`;

            commonsSessionStorageService.set('flowId', flowId);
            commonsSessionStorageService.set('PNR', locator);
            commonsSessionStorageService.set('ancillariesServiceTimeoutValue', timeout);

            fakeCommonsGenericProxy.getGeneric.and.returnValue(
                Promise.resolve({ data: responseData })
            );
            const result = await callAncillariesService.getAncillaries();

            expect(fakeCommonsGenericProxy.getGeneric).toHaveBeenCalledWith(
                endpoint,
                null,
                timeout
            );
            expect(result).toEqual(responseData);
        });

        it('should use the PNR already stored in session', async () => {
            const flowId = 'CHECKIN_002';
            const locator = 'GDS456';

            commonsSessionStorageService.set('flowId', flowId);
            commonsSessionStorageService.set('PNR', locator);

            fakeCommonsGenericProxy.getGeneric.and.returnValue(
                Promise.resolve({ data: {} })
            );

            await callAncillariesService.getAncillaries();

            expect(fakeCommonsGenericProxy.getGeneric).toHaveBeenCalledWith(
                `${CheckinAncillariesConstants.DEFAULT_ENDPOINTS.ancillariesURI}${flowId}/ancillaries?locator=${locator}`,
                null,
                null
            );
            expect(sessionConfigService.setPNR).not.toHaveBeenCalled();
        });

        it('should reject with SESSION_EXPIRED when flowId is null', async () => {
            commonsSessionStorageService.set('flowId', null);
            commonsSessionStorageService.set('bookingInfo', null);

            await expectAsync(callAncillariesService.getAncillaries()).toBeRejectedWith(
                jasmine.objectContaining({
                    errorCode: 'IB_00002',
                    internalErrorCode: 'IB_00002',
                    message: 'SESSION_EXPIRED'
                })
            );

            expect(fakeCommonsGenericProxy.getGeneric).not.toHaveBeenCalled();
        });
    });

    describe('ancillary requests', () => {
        interface AncillaryRequestTestCase {
            description: string;
            flowId: string;
            expectedUri: string;
            callService: () => Promise<unknown>;
        }

        const createRequestCases = (): AncillaryRequestTestCase[] => {
            const endpoint = CheckinAncillariesConstants.DEFAULT_ENDPOINTS.ancillariesURI;

            return [
                {
                    description: 'insurance',
                    flowId: 'CHECKIN_003',
                    expectedUri: `${endpoint}CHECKIN_003/ancillaries?ancillaryType=INSURANCE&residenceCountry=ES`,
                    callService: () => callAncillariesService.getInsurance('ES')
                },
                {
                    description: 'upgrading bid',
                    flowId: 'CHECKIN_004',
                    expectedUri: `${endpoint}CHECKIN_004/ancillaries?ancillaryType=UPGRADING_BID`,
                    callService: () => callAncillariesService.getUpgradingBidAncillarie()
                },
                {
                    description: 'upgrading',
                    flowId: 'CHECKIN_005',
                    expectedUri: `${endpoint}CHECKIN_005/ancillaries?ancillaryType=UPGRADING`,
                    callService: () => callAncillariesService.getUpgradingAncillarie()
                }
            ];
        };

        createRequestCases().forEach((testCase) => {
            it(`should obtain ${testCase.description} ancillary data`, async () => {
                const responseData = {
                    ancillaries: [{ type: testCase.description }]
                };

                commonsSessionStorageService.set('flowId', testCase.flowId);
                fakeCommonsGenericProxy.getGeneric.and.returnValue(
                    Promise.resolve({ data: responseData })
                );

                const result = await testCase.callService();

                expect(fakeCommonsGenericProxy.getGeneric).toHaveBeenCalledWith(
                    testCase.expectedUri
                );
                expect(result).toEqual(responseData);
            });

            it(`should delegate ${testCase.description} request errors`, async () => {
                const error = {
                    status: 500,
                    message: `${testCase.description} service error`
                };

                commonsSessionStorageService.set('flowId', testCase.flowId);
                fakeCommonsGenericProxy.getGeneric.and.returnValue(Promise.reject(error));

                await expectAsync(testCase.callService()).toBeRejectedWith(error);

                expect(fakeCommonsNewHttpUtilsErrorService.controlError).toHaveBeenCalledWith(
                    error,
                    jasmine.any(Function)
                );
            });
        });
    });

    describe('getPromise', () => {
        it('should return response data when request succeeds', async () => {
            const flowId = 'CHECKIN_006';
            const endpoint = '/test-endpoint';
            const timeout = 5000;
            const responseData = { result: 'success' };

            fakeCommonsGenericProxy.getGeneric.and.returnValue(
                Promise.resolve({ data: responseData })
            );

            const result = await callAncillariesService.getPromise(
                flowId,
                endpoint,
                timeout
            );

            expect(fakeCommonsGenericProxy.getGeneric).toHaveBeenCalledWith(
                endpoint,
                null,
                timeout
            );
            expect(result).toEqual(responseData);
        });

        it('should delegate request errors to CommonsNewHttpUtilsErrorService', async () => {
            const error = { status: 500, message: 'Internal server error' };

            fakeCommonsGenericProxy.getGeneric.and.returnValue(Promise.reject(error));

            await expectAsync(
                callAncillariesService.getPromise('CHECKIN_007', '/test-endpoint', null)
            ).toBeRejectedWith(error);

            expect(fakeCommonsNewHttpUtilsErrorService.controlError).toHaveBeenCalledWith(
                error,
                jasmine.any(Function)
            );
        });
    });
});