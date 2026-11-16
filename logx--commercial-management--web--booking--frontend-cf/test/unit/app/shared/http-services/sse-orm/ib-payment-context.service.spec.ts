import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { IbPaymentContextService, GetContextResponse, GetContextResponseWarningCodes } from '@src/app/shared/http-services/sse-orm/ib-payment-context.service';
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';

describe('IbPaymentContextService', () => {
    let service: IbPaymentContextService;
    let bookingRxProxySpy: jasmine.SpyObj<BookingRxProxy>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('BookingRxProxy', ['get']);

        TestBed.configureTestingModule({
            providers: [
                IbPaymentContextService,
                { provide: BookingRxProxy, useValue: spy }
            ]
        });

        service = TestBed.inject(IbPaymentContextService);
        bookingRxProxySpy = TestBed.inject(BookingRxProxy) as jasmine.SpyObj<BookingRxProxy>;
    });
    it('should return contextId and warnings when getPaymentContextId is called', fakeAsync(() => {
        const mockResponse: GetContextResponse = {
            contextId: 'test-context-id',
            warnings: [
                {
                    code: 'PMT_CTX_RESIDENT_NOT_VERIFIED' as keyof typeof GetContextResponseWarningCodes,
                    description: 'Resident not verified'
                }
            ]
        };

        bookingRxProxySpy.get.and.returnValue(of({ data: mockResponse }) as any);
        service.getPaymentContextId({ flowId: 'test-flow-id' }).then((result)=> {
            expect(result.contextId).toBe('test-context-id');
            expect(result.warnings.length).toBe(1);
            expect(result.warnings[0].code).toBe('PMT_CTX_RESIDENT_NOT_VERIFIED');
            expect(result.warnings[0].description).toBe('Resident not verified');
            expect(bookingRxProxySpy.get).toHaveBeenCalledWith(
                jasmine.stringMatching(/test-flow-id/));
        });
        flushMicrotasks();
    }));

    it('should handle onHoldId when getPaymentContextId is called', fakeAsync( () => {
        const mockResponse: GetContextResponse = {
            contextId: 'test-context-id',
            warnings: []
        };

        bookingRxProxySpy.get.and.returnValue(of({ data: mockResponse }) as any );
        service.getPaymentContextId({ flowId: 'test-flow-id', onHoldId: 'test-on-hold-id' }).then((result)=> {
            expect(result.contextId).toBe('test-context-id');
            expect(result.warnings.length).toBe(0);
            expect(bookingRxProxySpy.get).toHaveBeenCalledWith(
                jasmine.stringMatching(/test-flow-id.*test-on-hold-id/)
            );
        });
        flushMicrotasks();
        
    }));
});