import { TestBed } from '@angular/core/testing';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { AvailabilitySearchDateFilterService } from '@src/app/pages/ib-booking-availability-page/services/ib-booking-availability-searchDate-filter.service';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { UrlUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-url-utils.service';
import { WindowMock } from '@test-mocks/class/WindowMock';
import { UrlUtilsServiceMock } from '@test-mocks/Services/UrlUtilsServiceMock';

class BookingRedirectionServiceTestMock {
    public externalRedirect = jasmine.createSpy('externalRedirect');
}

// @ts-ignore test-only private member access
interface AvailabilitySearchDateFilterServiceTest extends AvailabilitySearchDateFilterService {
    BookingRedirectionService: BookingRedirectionServiceTestMock;
    urlUtilsService: UrlUtilsServiceMock;
}

describe('AvailabilitySearchDateFilterService', () => {
    let service: AvailabilitySearchDateFilterServiceTest;

    const setupMetasearchParams = (paramsMap: Record<string, string | null>) => {
        service.urlUtilsService.getURLFirstParameterByName.and.callFake((param: string | string[]) => {
            if (Array.isArray(param)) {
                for (const key of param) {
                    if (paramsMap[key] !== undefined) {
                        return paramsMap[key];
                    }
                }
                return null;
            }
            return paramsMap[param as string] ?? null;
        });
    };

    const getLastRedirectUrl = (): URL => {
        expect(service.BookingRedirectionService.externalRedirect).toHaveBeenCalledOnceWith(jasmine.any(String));
        return new URL(service.BookingRedirectionService.externalRedirect.calls.mostRecent().args[0]);
    };

    beforeEach(() => {
        jasmine.clock().install();
        jasmine.clock().mockDate(new Date(2026, 2, 12, 10, 0, 0, 0));

        TestBed.configureTestingModule({
            providers: [
                AvailabilitySearchDateFilterService,
                { provide: UrlUtilsService, useClass: UrlUtilsServiceMock },
                { provide: BookingRedirectionService, useClass: BookingRedirectionServiceTestMock },
                { provide: WINDOW_TOKEN, useValue: new WindowMock() }
            ]
        });

        service = TestBed.inject(AvailabilitySearchDateFilterService) as unknown as AvailabilitySearchDateFilterServiceTest;
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    describe('pastDatesAvailabilityCheck', () => {
        const setupAvailabilityParams = (paramsMap: Record<string, string | null>) => {
            setupMetasearchParams(paramsMap);
        };

        const baseAvailabilityParams: Record<string, string | null> = {
            'market': 'ES',
            'language': 'es',
            'flexible': 'false',
            'TRIP_TYPE': '2',
            'BEGIN_CITY_01': 'MAD',
            'END_CITY_01': 'BCN',
            'FARE_TYPE': 'STANDARD',
            'ADT': '2',
            'CHD': 'abc',
            'INF': '0',
            'BNN': '0',
            'YTH': '0',
            'YCD': '0'
        };

        const nonRedirectCases: Array<{ title: string; paramsMap: Record<string, string | null> }> = [
            {
                title: 'should return false when one-way departure is not in the past',
                paramsMap: {
                    ...baseAvailabilityParams,
                    'BEGIN_MONTH_01': '202603',
                    'BEGIN_DAY_01': '13'
                }
            },
            {
                title: 'should return false when round-trip dates are not in the past',
                paramsMap: {
                    ...baseAvailabilityParams,
                    'BEGIN_MONTH_01': '202603',
                    'BEGIN_DAY_01': '13',
                    'END_MONTH_01': '202603',
                    'END_DAY_01': '14'
                }
            }
        ];

        const redirectCases: Array<{
            title: string;
            paramsMap: Record<string, string | null>;
            expectedDateParams: Record<string, string>;
        }> = [
            {
                title: 'should redirect and normalize passengers when one-way departure is in the past',
                paramsMap: {
                    ...baseAvailabilityParams,
                    'BEGIN_MONTH_01': '202603',
                    'BEGIN_DAY_01': '11'
                },
                expectedDateParams: {
                    'BEGIN_MONTH_01': '202603',
                    'BEGIN_DAY_01': '12',
                    'BEGIN_YEAR_01': '2026',
                    'END_MONTH_01': '',
                    'END_DAY_01': '',
                    'END_YEAR_01': ''
                }
            },
            {
                title: 'should redirect with adjusted arrival date when round-trip arrival is in the past',
                paramsMap: {
                    ...baseAvailabilityParams,
                    'BEGIN_MONTH_01': '202603',
                    'BEGIN_DAY_01': '13',
                    'END_MONTH_01': '202603',
                    'END_DAY_01': '11'
                },
                expectedDateParams: {
                    'BEGIN_MONTH_01': '202603',
                    'BEGIN_DAY_01': '13',
                    'BEGIN_YEAR_01': '2026',
                    'END_MONTH_01': '202603',
                    'END_DAY_01': '12',
                    'END_YEAR_01': '2026'
                }
            }
        ];

        nonRedirectCases.forEach((testCase) => {
            it(testCase.title, () => {
                setupAvailabilityParams(testCase.paramsMap);

                const result = service.pastDatesAvailabilityCheck();

                expect(result).toBeFalse();
                expect(service.BookingRedirectionService.externalRedirect).not.toHaveBeenCalled();
            });
        });

        redirectCases.forEach((testCase) => {
            it(testCase.title, () => {
                setupAvailabilityParams(testCase.paramsMap);

                const result = service.pastDatesAvailabilityCheck();

                expect(result).toBeTrue();
                const redirectUrl = getLastRedirectUrl();
                expect(redirectUrl.searchParams.get('market')).toBe('ES');
                expect(redirectUrl.searchParams.get('language')).toBe('es');
                expect(redirectUrl.searchParams.get('BEGIN_CITY_01')).toBe('MAD');
                expect(redirectUrl.searchParams.get('END_CITY_01')).toBe('BCN');
                expect(redirectUrl.searchParams.get('FARE_TYPE')).toBe('STANDARD');
                expect(redirectUrl.searchParams.get('ADT')).toBe('2');
                expect(redirectUrl.searchParams.get('CHD')).toBe('0');

                Object.entries(testCase.expectedDateParams).forEach(([key, value]) => {
                    expect(redirectUrl.searchParams.get(key)).toBe(value);
                });
            });
        });
    });

    describe('pastDatesMetasearchCheck', () => {
        const basePastMetasearchParams = {
            'DepartureDate1': '2026-03-10',
            'Slice1': 'MAD',
            'PointOfSaleCountry': 'ES',
            'UserLanguage': 'es',
            'OriginMAD': 'MAD',
            'DestinationMAD': 'BCN',
            'ADT': '2',
            'CHD': '1',
            'INF': '0',
            'BNN': '0',
            'YTH': '0',
            'YCD': '0'
        };

        const assertCommonRedirectParams = (redirectUrl: URL, tripType: string) => {
            expect(redirectUrl.searchParams.get('market')).toBe('ES');
            expect(redirectUrl.searchParams.get('language')).toBe('es');
            expect(redirectUrl.searchParams.get('TRIP_TYPE')).toBe(tripType);
            expect(redirectUrl.searchParams.get('flexible')).toBe('true');
            expect(redirectUrl.searchParams.get('BEGIN_CITY_01')).toBe('MAD');
            expect(redirectUrl.searchParams.get('END_CITY_01')).toBe('BCN');
            expect(redirectUrl.searchParams.get('BEGIN_MONTH_01')).toBe('202603');
            expect(redirectUrl.searchParams.get('BEGIN_DAY_01')).toBe('12');
            expect(redirectUrl.searchParams.get('BEGIN_YEAR_01')).toBe('2026');
            expect(redirectUrl.searchParams.get('ADT')).toBe('2');
        };

        const redirectCases: Array<{
            title: string;
            paramsMap: Record<string, string | null>;
            expectedTripType: string;
            validateEndDate: (redirectUrl: URL) => void;
        }> = [
            {
                title: 'should redirect and return true for an expired one-way departure',
                paramsMap: {
                    ...basePastMetasearchParams,
                    'TripType': 'OneWay'
                },
                expectedTripType: '1',
                validateEndDate: (redirectUrl: URL) => {
                    expect(redirectUrl.searchParams.get('END_MONTH_01')).toBe('');
                    expect(redirectUrl.searchParams.get('END_DAY_01')).toBe('');
                    expect(redirectUrl.searchParams.get('END_YEAR_01')).toBe('');
                }
            },
            {
                title: 'should redirect with return date for an expired round-trip departure',
                paramsMap: {
                    ...basePastMetasearchParams,
                    'TripType': 'RoundTrip',
                    'Slice2': 'BCN',
                    'DepartureDateBCN': '2026-04-20',
                    'CHD': '0'
                },
                expectedTripType: '2',
                validateEndDate: (redirectUrl: URL) => {
                    expect(redirectUrl.searchParams.get('END_MONTH_01')).toBe('202604');
                    expect(redirectUrl.searchParams.get('END_DAY_01')).toBe('20');
                    expect(redirectUrl.searchParams.get('END_YEAR_01')).toBe('2026');
                }
            }
        ];

        it('should return false when departure date is not in the past', () => {
            setupMetasearchParams({
                'DepartureDate1': '2026-03-13',
                'Slice1': 'MAD'
            });

            const result = service.pastDatesMetasearchCheck();

            expect(result).toBeFalse();
            expect(service.BookingRedirectionService.externalRedirect).not.toHaveBeenCalled();
        });

        redirectCases.forEach((testCase) => {
            it(testCase.title, () => {
                setupMetasearchParams(testCase.paramsMap);

                const result = service.pastDatesMetasearchCheck();

                expect(result).toBeTrue();
                const redirectUrl = getLastRedirectUrl();
                assertCommonRedirectParams(redirectUrl, testCase.expectedTripType);
                testCase.validateEndDate(redirectUrl);
            });
        });
    });
});
