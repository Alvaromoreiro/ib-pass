import { TestBed } from '@angular/core/testing';
import {
    BookingBkErrorPageManagerService,
    IBkErrorPageHandler
} from '@src/app/pages/ib-booking-bk-error/services/ib-booking-bk-error-manager.service';
import { BookingErrorPageStore, ErrorType } from '@src/app/core/store/ib-booking-error-page.store';

class BookingErrorPageStoreMock {
    getErrorByType = jasmine.createSpy('getErrorByType').and.returnValue(null);
}

// @ts-ignore
interface ServiceTest extends BookingBkErrorPageManagerService {
    handlers: IBkErrorPageHandler[];
    bookingErrorPageStore: BookingErrorPageStoreMock;
}

describe('BookingBkErrorPageManagerService', () => {
    let service: ServiceTest;
    let bookingErrorPageStore: BookingErrorPageStoreMock;

    const mockRibbonError = {
        message: 'Ribbon error',
        internalErrorCode: 'RIBBON_001',
        errorCode: 500,
        requestURL: 'https://example.com/ribbon'
    };

    const mockAvailabilityError = {
        message: 'Availability error',
        internalErrorCode: 'AVAIL_001',
        errorCode: 404,
        requestURL: 'https://example.com/availability'
    };

    const mockAkamaiError = {
        message: 'Akamai error',
        internalErrorCode: 'SECURITY_AKAMAI',
        errorCode: 403,
        requestURL: 'https://example.com/akamai'
    };

    beforeEach(() => {
        bookingErrorPageStore = new BookingErrorPageStoreMock();

        TestBed.configureTestingModule({
            providers: [
                BookingBkErrorPageManagerService,
                { provide: BookingErrorPageStore, useValue: bookingErrorPageStore }
            ]
        });

        service = TestBed.inject(BookingBkErrorPageManagerService) as unknown as ServiceTest;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('registerHandler', () => {
        it('should add a new handler to the handlers list', () => {
            const initialCount = service.handlers.length;
            const customHandler: IBkErrorPageHandler = {
                type: ErrorType.RIBBON,
                canResolve: () => false,
                resolve: () => ({})
            };

            service.registerHandler(customHandler);

            expect(service.handlers.length).toBe(initialCount + 1);
            expect(service.handlers[service.handlers.length - 1]).toBe(customHandler);
        });
    });

    describe('getError', () => {
        it('should return null when no handler can resolve', () => {
            bookingErrorPageStore.getErrorByType.and.returnValue(null);

            const result = service.getError();

            expect(result).toBeNull();
        });

        const standardErrorCases = [
            {
                description: 'RIBBON',
                type: ErrorType.RIBBON,
                mockError: mockRibbonError
            },
            {
                description: 'AVAILABILITY',
                type: ErrorType.AVAILABILITY,
                mockError: mockAvailabilityError
            }
        ];

        standardErrorCases.forEach(({ description, type, mockError }) => {
            it(`should return ${description} error model when ${description} handler can resolve`, () => {
                bookingErrorPageStore.getErrorByType.and.callFake((errorType: ErrorType) => {
                    return errorType === type ? mockError : null;
                });

                const result = service.getError();

                expect(result).toEqual({
                    [type]: {
                        message: mockError.message,
                        internalErrorCode: mockError.internalErrorCode,
                        errorCode: mockError.errorCode,
                        requestURL: mockError.requestURL
                    }
                });
            });
        });

        it('should return SECURITY_AKAMAI error model with fixed fields when SECURITY_AKAMAI handler can resolve', () => {
            bookingErrorPageStore.getErrorByType.and.callFake((type: ErrorType) => {
                return type === ErrorType.SECURITY_AKAMAI ? mockAkamaiError : null;
            });

            const result = service.getError();

            expect(result).toEqual({
                [ErrorType.SECURITY_AKAMAI]: {
                    message: 'IBBKERROR_TEXT_NAVIGATION_INTERRUPTED',
                    button: 'IBBKERROR_TEXT_BUTTON_TITLE_RETURN',
                    internalErrorCode: mockAkamaiError.internalErrorCode,
                    errorCode: mockAkamaiError.errorCode,
                    requestURL: mockAkamaiError.requestURL,
                    background: '/background/generico/403_error_default.jpg'
                }
            });
        });

        it('should resolve with RIBBON handler when both RIBBON and AVAILABILITY errors exist (first match wins)', () => {
            bookingErrorPageStore.getErrorByType.and.callFake((type: ErrorType) => {
                if (type === ErrorType.RIBBON) return mockRibbonError;
                if (type === ErrorType.AVAILABILITY) return mockAvailabilityError;
                return null;
            });

            const result = service.getError();

            expect(result).toEqual({
                [ErrorType.RIBBON]: jasmine.objectContaining({
                    message: mockRibbonError.message
                })
            });
        });

        it('should use a registered custom handler when it can resolve', () => {
            const customErrorModel = { custom: { message: 'Custom error' } };
            const customHandler: IBkErrorPageHandler = {
                type: ErrorType.RIBBON,
                canResolve: () => true,
                resolve: () => customErrorModel
            };
            bookingErrorPageStore.getErrorByType.and.returnValue(null);

            service.registerHandler(customHandler);
            const result = service.getError();

            expect(result).toEqual(customErrorModel);
        });
    });
});
