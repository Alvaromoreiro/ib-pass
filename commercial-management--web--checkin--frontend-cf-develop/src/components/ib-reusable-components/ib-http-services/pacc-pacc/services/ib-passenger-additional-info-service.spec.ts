import angular from 'angular';
import { PassengerAdditionalInfoService } from './ib-passenger-additional-info-service';
import type { PassengerAdditionalInfo } from '@src/app/core/models/ib-checkin-apis/services/additional-info-model';
import type { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';

type SpyMap<Names extends string> = Record<Names, jasmine.Spy>;

describe('PassengerAdditionalInfoService', () => {
    let service: PassengerAdditionalInfoService;
    let $q: ng.IQService;
    let $rootScope: ng.IRootScopeService;

    let commonsGenericProxy: SpyMap<'putGeneric' | 'getGeneric'>;
    let commonsHttpUtilsErrorService: SpyMap<'controlError'>;
    let httpServicesConstants: Record<string, unknown>;
    let commonsSessionStorageService: SpyMap<'get'>;
    let translateFilter: jasmine.Spy;
    let filterService: jasmine.Spy;
    let ibUtilsService: SpyMap<'generatePassengersQueryString'>;

    const flowId = 'flow-id-123';
    const baseUrl = '/passenger/';
    const additionalInfoEndpoint = `${baseUrl}${flowId}/additional-info`;
    const emergencyEndpoint = `${baseUrl}${flowId}/emergency`;
    const passengersId = ['passenger-1'];

    const getCounterAttempts = (): number => (service as unknown as { counterAttemps: number }).counterAttemps;

    const expectErrorHandlerToHaveBeenCalled = (error: unknown): void => {
        expect(commonsHttpUtilsErrorService.controlError).toHaveBeenCalled();

        const args = commonsHttpUtilsErrorService.controlError.calls.mostRecent().args;

        expect(args[0]).toEqual(error);
        expect(args[1]).toBe(0);
        expect(typeof args[2]).toBe('function');
        expect(args[3]).toBeDefined();
    };

    beforeEach(inject((_$q_: ng.IQService, _$rootScope_: ng.IRootScopeService) => {
        $q = _$q_;
        $rootScope = _$rootScope_;

        commonsGenericProxy = {
            putGeneric: jasmine.createSpy('putGeneric'),
            getGeneric: jasmine.createSpy('getGeneric')
        };

        commonsHttpUtilsErrorService = {
            controlError: jasmine.createSpy('controlError')
        };

        httpServicesConstants = {
            URI: {
                DEFAULT_ENDPOINTS: {
                    passengerAdditionalInfoURI: baseUrl
                }
            }
        };

        commonsSessionStorageService = {
            get: jasmine.createSpy('get').and.returnValue(flowId)
        };

        translateFilter = jasmine
            .createSpy('translate')
            .and.callFake((key: string) => `translated-${key}`);

        filterService = jasmine.createSpy('$filter').and.callFake((filterName: string) => {
            return filterName === 'translate' ? translateFilter : angular.noop;
        });

        ibUtilsService = {
            generatePassengersQueryString: jasmine
                .createSpy('generatePassengersQueryString')
                .and.returnValue('?passengerIds=passenger-1')
        };

        service = new PassengerAdditionalInfoService(
            $q,
            commonsGenericProxy as unknown as CommonsGenericProxy,
            commonsHttpUtilsErrorService as unknown as CommonsHttpUtilsErrorService,
            httpServicesConstants as unknown as HttpServicesConstantsNamespace.HttpServicesConstants,
            commonsSessionStorageService as unknown as CommonsSessionStorageService,
            filterService as unknown as angular.IFilterService,
            ibUtilsService as unknown as IbUtilsService
        );
    }));

    describe('when updating passenger information', () => {
        describe('when additional information has no contact details', () => {
            it('should reject the request without calling the API', () => {
                const invalidAdditionalInfo = [{
                    disruptionContact: {
                        email: '',
                        phone: {
                            number: ''
                        }
                    }
                }] as unknown as PassengerAdditionalInfo[];

                let rejectedError: unknown;

                service.updateAdditionalInfo(invalidAdditionalInfo).catch((error) => {
                    rejectedError = error;
                });

                $rootScope.$digest();

                expect(filterService).toHaveBeenCalledWith('translate');
                expect(translateFilter).toHaveBeenCalledWith('REST_SERVICE_ERROR_GENERAL');
                expect(rejectedError).toEqual({
                    message: 'translated-REST_SERVICE_ERROR_GENERAL'
                });
                expect(commonsGenericProxy.putGeneric).not.toHaveBeenCalled();
            });
        });
    });

    describe('when retrieving passenger information', () => {
        const getOperations = [
            {
                name: 'additional information',
                endpoint: `${additionalInfoEndpoint}?passengerIds=passenger-1`,
                request: () => service.getAdditionalInfo(passengersId),
                response: [{
                    passengerId: 'passenger-1',
                    disruptionContact: {
                        email: 'test@email.com'
                    }
                }]
            },
            {
                name: 'emergency information',
                endpoint: `${emergencyEndpoint}?passengerIds=passenger-1`,
                request: () => service.getEmergencyInfo(passengersId),
                response: [{
                    passengerId: 'passenger-1',
                    name: 'Emergency contact'
                }]
            }
        ];

        getOperations.forEach((operation) => {
            describe(`when retrieving ${operation.name}`, () => {
                it('should send a GET request and resolve with the response data', () => {
                    const response = { data: operation.response };
                    let result: unknown;

                    commonsGenericProxy.getGeneric.and.returnValue($q.when(response));

                    operation.request().then((data) => {
                        result = data;
                    });

                    $rootScope.$digest();

                    expect(ibUtilsService.generatePassengersQueryString).toHaveBeenCalledWith(passengersId);
                    expect(commonsGenericProxy.getGeneric).toHaveBeenCalledWith(operation.endpoint);
                    expect(result).toEqual(response.data);
                    expect(getCounterAttempts()).toBe(0);
                });

                it('should delegate request errors to the error handler', () => {
                    const error = { status: 500 };

                    commonsGenericProxy.getGeneric.and.returnValue($q.reject(error));

                    operation.request();
                    $rootScope.$digest();

                    expectErrorHandlerToHaveBeenCalled(error);
                });
            });
        });
    });
});
