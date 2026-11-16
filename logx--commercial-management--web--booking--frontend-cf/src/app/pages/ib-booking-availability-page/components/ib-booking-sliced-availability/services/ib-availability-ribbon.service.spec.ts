import { TestBed } from '@angular/core/testing';
import { IbAvailabilityRibbonService } from './ib-availability-ribbon.service';
import { CallPriceMatrixService } from '@shared/http-services/sse-avm/ib-call-booking-price-matrix-service.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { AJSBookingAvailabilityTransformer } from '@shared/services/ib-booking-availability/transformers/ajs-upgrade/ib-booking-availability-transformer-bridge.service';
import { of, throwError } from 'rxjs';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';

class CallPriceMatrixServiceMock {
    getPriceMatrixRx = jasmine.createSpy('getPriceMatrixRx').and.callFake(() =>
        of({
            data: {
                outbound: [{ date: '2026-06-20', flights: [] }],
                inbound: [{ date: '2026-06-27', flights: [] }]
            }
        })
    );
}

class AJSBookingAvailabilityTransformerMock {
    generateInitialCalendarRequest = jasmine.createSpy('generateInitialCalendarRequest').and.returnValue({
        originDestination: [],
        flexible: true
    });
}

describe('Test IbAvailabilityRibbonService', () => {
    let service: IbAvailabilityRibbonService;
    let fakeCommonsSessionStorageService: StorageServiceMock;
    let fakeCallPriceMatrixService: CallPriceMatrixServiceMock;
    let fakeAJSBookingAvailabilityTransformer: AJSBookingAvailabilityTransformerMock;

    const buildRequestData = (sliceDates: string[]): AvailabilityTransformerModel.ItineraryRequestData => ({
        slices: sliceDates.map((date) => ({ date }))
    } as any);

    const getIsoDateByOffset = (days: number): string => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    };

    beforeEach(() => {
        fakeCommonsSessionStorageService = new StorageServiceMock();
        fakeCallPriceMatrixService = new CallPriceMatrixServiceMock();
        fakeAJSBookingAvailabilityTransformer = new AJSBookingAvailabilityTransformerMock();

        TestBed.configureTestingModule({
            providers: [
                IbAvailabilityRibbonService,
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: CallPriceMatrixService, useValue: fakeCallPriceMatrixService },
                { provide: AJSBookingAvailabilityTransformer, useValue: fakeAJSBookingAvailabilityTransformer }
            ]
        });
        service = TestBed.inject(IbAvailabilityRibbonService);
    });

    describe('Test getRibbonAvailability', () => {
        it('should return calendar data when getCalendarFlightsDates succeeds', (done) => {
            const requestData = buildRequestData(['2026-06-20']);

            fakeCommonsSessionStorageService.set('isFlexibleDates', true);

            service.getRibbonAvailability(requestData).subscribe((result) => {
                expect(result).toEqual(jasmine.objectContaining({
                    outbound: jasmine.any(Array),
                    inbound: jasmine.any(Array)
                }));
                done();
            });
        });

        it('should return null when getCalendarFlightsDates throws error', (done) => {
            const requestData = buildRequestData(['2026-06-20']);

            fakeCallPriceMatrixService.getPriceMatrixRx.and.returnValue(
                throwError(() => new Error('Test error'))
            );
            fakeCommonsSessionStorageService.set('isFlexibleDates', true);

            service.getRibbonAvailability(requestData).subscribe((result) => {
                expect(result).toBeNull();
                done();
            });
        });
    });

    describe('Test getCalendarFlightsDates', () => {
        const calendarFlightsDatesScenarios = [
            {
                description: 'should call getPriceMatrixRx when flexible dates and 2 or fewer slices',
                requestData: buildRequestData(['2026-06-20', '2026-06-27']),
                isFlexibleDates: true,
                commercialData: null,
                shouldCallPriceMatrix: true
            },
            {
                description: 'should not call getPriceMatrixRx when flexible dates is false',
                requestData: buildRequestData(['2026-06-20']),
                isFlexibleDates: false,
                commercialData: null,
                shouldCallPriceMatrix: false
            },
            {
                description: 'should not call getPriceMatrixRx when slices length > 2',
                requestData: buildRequestData(['2026-06-20', '2026-06-25', '2026-06-27']),
                isFlexibleDates: true,
                commercialData: null,
                shouldCallPriceMatrix: false
            },
            {
                description: 'should not call getPriceMatrixRx when search date exceeds maxSearchTime',
                requestData: buildRequestData([getIsoDateByOffset(100)]),
                isFlexibleDates: true,
                commercialData: { maxSearchTime: 30 },
                shouldCallPriceMatrix: false
            }
        ];

        calendarFlightsDatesScenarios.forEach((scenario) => {
            it(scenario.description, (done) => {
                fakeCommonsSessionStorageService.set('isFlexibleDates', scenario.isFlexibleDates);
                if (scenario.commercialData) {
                    fakeCommonsSessionStorageService.set('commercialData', scenario.commercialData as any);
                }

                service.getCalendarFlightsDates(scenario.requestData).subscribe(() => {
                    if (scenario.shouldCallPriceMatrix) {
                        expect(fakeCallPriceMatrixService.getPriceMatrixRx).toHaveBeenCalledWith(jasmine.any(Object), true);
                    } else {
                        expect(fakeCallPriceMatrixService.getPriceMatrixRx).not.toHaveBeenCalled();
                    }
                    done();
                });
            });
        });

        it('should remove calditMode from storage', (done) => {
            const requestData = buildRequestData(['2026-06-20']);

            const removeSpy = spyOn(fakeCommonsSessionStorageService, 'remove');

            service.getCalendarFlightsDates(requestData).subscribe(() => {
                expect(removeSpy).toHaveBeenCalledWith('calditMode');
                done();
            });
        });
    });

    describe('Test shouldCallPriceMatrix (private method)', () => {
        const shouldCallPriceMatrixScenarios = [
            {
                description: 'should return true when all conditions are met',
                originDestination: [{ segment: 'MAD-NYC' }, { segment: 'NYC-MAD' }],
                isFlexibleDates: true,
                isAfterSearch: false,
                expectedResult: true
            },
            {
                description: 'should return false when isFlexibleDates is false',
                originDestination: [{ segment: 'MAD-NYC' }],
                isFlexibleDates: false,
                isAfterSearch: false,
                expectedResult: false
            },
            {
                description: 'should return false when originDestination has more than 2 items',
                originDestination: [{ segment: 'MAD-NYC' }, { segment: 'NYC-LON' }, { segment: 'LON-MAD' }],
                isFlexibleDates: true,
                isAfterSearch: false,
                expectedResult: false
            },
            {
                description: 'should return false when isAfterSearch is true',
                originDestination: [{ segment: 'MAD-NYC' }],
                isFlexibleDates: true,
                isAfterSearch: true,
                expectedResult: false
            },
            {
                description: 'should return true when originDestination is empty',
                originDestination: [],
                isFlexibleDates: true,
                isAfterSearch: false,
                expectedResult: true
            }
        ];

        shouldCallPriceMatrixScenarios.forEach((scenario) => {
            it(scenario.description, () => {
                const result = (service as any).shouldCallPriceMatrix(
                    scenario.originDestination,
                    scenario.isFlexibleDates,
                    scenario.isAfterSearch
                );
                expect(result).toBe(scenario.expectedResult);
            });
        });
    });

    describe('Test isSearchAfterMaxSearchTime (private method)', () => {
        const maxSearchTimeScenarios = [
            {
                description: 'should return false when no commercial data',
                requestData: buildRequestData(['2026-06-20']),
                commercialData: null,
                expectedResult: false
            },
            {
                description: 'should return false when search date is within maxSearchTime',
                requestData: buildRequestData([getIsoDateByOffset(15)]),
                commercialData: { maxSearchTime: 30 },
                expectedResult: false
            },
            {
                description: 'should return true when search date exceeds maxSearchTime',
                requestData: buildRequestData([getIsoDateByOffset(100)]),
                commercialData: { maxSearchTime: 30 },
                expectedResult: true
            },
            {
                description: 'should return false when slices is empty',
                requestData: buildRequestData([]),
                commercialData: { maxSearchTime: 30 },
                expectedResult: false
            }
        ];

        maxSearchTimeScenarios.forEach((scenario) => {
            it(scenario.description, () => {
                if (scenario.commercialData) {
                    fakeCommonsSessionStorageService.set('commercialData', scenario.commercialData as any);
                }

                const result = (service as any).isSearchAfterMaxSearchTime(scenario.requestData);
                expect(result).toBe(scenario.expectedResult);
            });
        });
    });
});
