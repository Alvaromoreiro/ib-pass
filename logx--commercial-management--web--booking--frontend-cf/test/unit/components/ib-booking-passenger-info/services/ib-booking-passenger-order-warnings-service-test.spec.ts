import { TestBed } from '@angular/core/testing';
import { IbBookingPassengerOrderWarningsService } from '@src/app/pages/ib-booking-passenger-info/ib-booking-passenger-order-warnings.service';
import { WarningsOrder } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';
import { AJSBookingModalService, BookingModalServiceType } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { BookingHeaderConstants } from '@src/app/shared/components/ib-booking-header/ib-booking-header-constants';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';

describe('IbBookingPassengerOrderWarningsService', () => {
    let service: IbBookingPassengerOrderWarningsService;
    let mockNewMainHeaderFacade: jasmine.SpyObj<IbBookingHeaderFacadeService>;
    let mockBookingModalService: jasmine.SpyObj<BookingModalServiceType>;

    const createMockModalResult = () => ({
        result: Promise.resolve(),
        close: jasmine.createSpy('close'),
        dismiss: jasmine.createSpy('dismiss'),
        opened: Promise.resolve(),
        rendered: Promise.resolve(),
        closed: Promise.resolve()
    });

    const createWarnings = (warnings: Partial<WarningsOrder>[]): WarningsOrder[] => 
        warnings.map(w => ({ code: '', description: '', ...w }));

    const createSSEWarning = (description: string = 'Test description') => 
        createWarnings([{ code: 'SSE_ORM_30003', description }]);

    const expectNoServiceCalls = () => {
        expect(mockNewMainHeaderFacade.deleteDiscountFromBasket).not.toHaveBeenCalled();
        expect(mockBookingModalService.showGenericError).not.toHaveBeenCalled();
    };

    const expectSSEWarningHandled = (description: string, times: number = 1) => {
        expect(mockNewMainHeaderFacade.deleteDiscountFromBasket).toHaveBeenCalledTimes(times);
        expect(mockNewMainHeaderFacade.deleteDiscountFromBasket).toHaveBeenCalledWith(
            BookingHeaderConstants.DISCOUNT_TYPES.PARTNER
        );
        expect(mockBookingModalService.showGenericError).toHaveBeenCalledTimes(times);
        if (times === 1) {
            expect(mockBookingModalService.showGenericError).toHaveBeenCalledWith(
                { message: description },
                true
            );
        }
    };

    beforeEach(() => {
        mockNewMainHeaderFacade = jasmine.createSpyObj('NewMainHeaderFacade', ['deleteDiscountFromBasket']);
        mockBookingModalService = jasmine.createSpyObj('BookingModalService', ['showGenericError']);
        
        mockBookingModalService.showGenericError.and.returnValue(createMockModalResult());

        TestBed.configureTestingModule({
            providers: [
                IbBookingPassengerOrderWarningsService,
                { 
                    provide: IbBookingHeaderFacadeService, 
                    useValue: mockNewMainHeaderFacade 
                },
                {
                    provide: AJSBookingModalService,
                    useValue: mockBookingModalService
                }
            ]
        });

        service = TestBed.inject(IbBookingPassengerOrderWarningsService);
    });

    describe('manageWarnings', () => {
        it('should be created', () => {
            expect(service).toBeTruthy();
        });

        describe('when no warnings to process', () => {
            it('should handle empty array gracefully', async () => {
                const result = await service.manageWarnings([]);
                
                expect(result).toBeUndefined();
                expectNoServiceCalls();
            });

            it('should handle null value gracefully', async () => {
                const result = await service.manageWarnings(null);
                
                expect(result).toBeUndefined();
                expectNoServiceCalls();
            });

            it('should handle undefined value gracefully', async () => {
                const result = await service.manageWarnings(undefined);
                
                expect(result).toBeUndefined();
                expectNoServiceCalls();
            });
        });

        describe('when processing SSE_ORM_30003 warnings', () => {
            it('should execute rule and call both services', async () => {
                const warnings = createSSEWarning('Test warning description');
                const result = await service.manageWarnings(warnings);

                expect(result).toBeUndefined();
                expectSSEWarningHandled('Test warning description');
            });

            it('should handle edge case with empty description', async () => {
                const warnings = createSSEWarning('');
                const result = await service.manageWarnings(warnings);

                expect(result).toBeUndefined();
                expectSSEWarningHandled('');
            });

            it('should handle edge case with null description', async () => {
                const warnings = createSSEWarning(null);
                const result = await service.manageWarnings(warnings);

                expect(result).toBeUndefined();
                expectSSEWarningHandled(null);
            });
        });

        describe('when processing mixed warning types', () => {
            it('should handle mixed known and unknown warning codes', async () => {
                const warnings = createWarnings([
                    { code: 'UNKNOWN_CODE', description: 'Unknown warning' },
                    { code: 'SSE_ORM_30003', description: 'Known warning' },
                    { code: 'ANOTHER_UNKNOWN', description: 'Another unknown warning' }
                ]);

                const result = await service.manageWarnings(warnings);

                expect(result).toBeUndefined();
                expectSSEWarningHandled('Known warning');
            });

            it('should ignore warnings with unknown codes only', async () => {
                const warnings = createWarnings([
                    { code: 'UNKNOWN_CODE_1', description: 'Unknown warning 1' },
                    { code: 'UNKNOWN_CODE_2', description: 'Unknown warning 2' }
                ]);

                const result = await service.manageWarnings(warnings);

                expect(result).toBeUndefined();
                expectNoServiceCalls();
            });
        });

        describe('error handling', () => {
            it('should handle modal error gracefully when showGenericError rejects', async () => {
                const modalError = createMockModalResult();
                modalError.result = Promise.reject(new Error('Modal error'));
                mockBookingModalService.showGenericError.and.returnValue(modalError);

                const warnings = createSSEWarning('Test description');
                const result = await service.manageWarnings(warnings);

                expect(result).toBeUndefined();
                expectSSEWarningHandled('Test description');
            });

            it('should process warnings sequentially, not in parallel', async () => {
                const callOrder: string[] = [];
                let callCount = 0;

                mockNewMainHeaderFacade.deleteDiscountFromBasket.and.callFake(() => {
                    callOrder.push(`deleteDiscount_${++callCount}`);
                });

                mockBookingModalService.showGenericError.and.callFake(() => {
                    callOrder.push(`showError_${callCount}`);
                    return createMockModalResult();
                });

                const warnings = createWarnings([
                    { code: 'SSE_ORM_30003', description: 'First warning' },
                    { code: 'SSE_ORM_30003', description: 'Second warning' }
                ]);

                await service.manageWarnings(warnings);

                expect(callOrder).toEqual([
                    'deleteDiscount_1', 'showError_1',
                    'deleteDiscount_2', 'showError_2'
                ]);
            });
        });
    });
});
