import { TestBed } from '@angular/core/testing';
import { BookingErrorPageStore, ErrorType, BookingError } from '@core/store/ib-booking-error-page.store';
import { RootStore } from '@core/store/ib-booking-root.store';

class RootStoreMock {
    private store = new Map<string, any>();
    
    get = jasmine.createSpy('get').and.callFake((key: string) => {
        return this.store.get(key) ?? null;
    });
    
    set = jasmine.createSpy('set').and.callFake((key: string, value: any) => {
        this.store.set(key, value);
    });

    // Helper method to setup test data
    setTestData (data: Record<string, any>): void {
        Object.entries(data).forEach(([key, value]) => {
            this.store.set(key, value);
        });
    }
}

// @ts-ignore
interface ServiceTest extends BookingErrorPageStore {
    rootStore: RootStoreMock;
}

describe('BookingErrorPageStore Test', () => {
    let service: ServiceTest;
    let rootStoreMock: RootStoreMock;

    // Test data factory
    const createTestError = (type: ErrorType, overrides: Partial<BookingError> = {}): Partial<BookingError> => ({
        message: `Test ${type} error`,
        internalErrorCode: `TEST_${type.toUpperCase()}_001`,
        errorCode: 400,
        visible: true,
        ...overrides
    });



    beforeEach(() => {
        rootStoreMock = new RootStoreMock();
        
        TestBed.configureTestingModule({
            providers: [
                BookingErrorPageStore,
                { provide: RootStore, useValue: rootStoreMock }
            ]
        });

        service = TestBed.inject(BookingErrorPageStore) as unknown as ServiceTest;
    });

    it('should be created and initialize flow on construction', () => {
        expect(service).toBeTruthy();
    });


    describe('Error Management', () => {
        describe('Generic setError method', () => {

            it('should clear error when null passed', () => {
                // Set an error first
                service.setError(ErrorType.AVAILABILITY, createTestError(ErrorType.AVAILABILITY));
                expect(service.getErrorByType(ErrorType.AVAILABILITY)).toBeTruthy();
                
                // Clear it
                service.setError(ErrorType.AVAILABILITY, null);
                expect(service.getErrorByType(ErrorType.AVAILABILITY)).toBeNull();
            });
        });

        describe('Getter methods', () => {
            beforeEach(() => {
                const setupErrors = () => {
                    service.setError(ErrorType.AVAILABILITY, createTestError(ErrorType.AVAILABILITY));
                    service.setError(ErrorType.RIBBON, createTestError(ErrorType.RIBBON));
                };
                setupErrors();
            });

            it('should get errors by type', () => {
                expect(service.getErrorByType(ErrorType.AVAILABILITY)).toBeTruthy();
                expect(service.getErrorByType(ErrorType.RIBBON)).toBeTruthy();
                expect(service.getErrorByType(ErrorType.AVAILABILITY)?.type).toBe(ErrorType.AVAILABILITY);
            });

            it('should return all errors as array', () => {
                const allErrors = service.getAllErrors();
                expect(allErrors.length).toBe(2);
                expect(allErrors.some(e => e.type === ErrorType.AVAILABILITY)).toBe(true);
                expect(allErrors.some(e => e.type === ErrorType.RIBBON)).toBe(true);
            });
        });

        describe('Clear methods', () => {
            beforeEach(() => {
                const setupErrors = () => {
                    service.setError(ErrorType.AVAILABILITY, createTestError(ErrorType.AVAILABILITY));
                    service.setError(ErrorType.RIBBON, createTestError(ErrorType.RIBBON));
                };
                setupErrors();
            });

            it('should clear specific error type', () => {
                service.clearError(ErrorType.AVAILABILITY);
                expect(service.getErrorByType(ErrorType.AVAILABILITY)).toBeNull();
                expect(service.getErrorByType(ErrorType.RIBBON)).toBeTruthy(); // Should remain
            });


        });

        describe('Utility methods', () => {
            it('should detect any error existence', () => {
                expect(service.hasAnyError()).toBe(false);
                
                service.setError(ErrorType.AVAILABILITY, createTestError(ErrorType.AVAILABILITY));
                expect(service.hasAnyError()).toBe(true);
            });

            it('should detect specific error type existence', () => {
                service.setError(ErrorType.RIBBON, createTestError(ErrorType.RIBBON));
                expect(service.hasErrorOfType(ErrorType.RIBBON)).toBe(true);
                expect(service.hasErrorOfType(ErrorType.AVAILABILITY)).toBe(false);
            });


        });
    });


});
