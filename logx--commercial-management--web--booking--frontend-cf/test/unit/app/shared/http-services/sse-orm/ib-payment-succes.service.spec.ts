import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { IbPaymentSuccessService, GetPaymentSuccessRequest } from '@src/app/shared/http-services/sse-orm/ib-payment-succes.service';
import { BookingRxProxy } from '@shared/http-services/proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';

describe('IbPaymentSuccessService', () => {
    let service: IbPaymentSuccessService;
    let bookingRxProxySpy: jasmine.SpyObj<BookingRxProxy>;
    let errorHandlerSpy: jasmine.SpyObj<IbBookingErrorHandlerService>;

    beforeEach(() => {
        const bookingRxProxyMock = jasmine.createSpyObj('BookingRxProxy', ['post']);
        const errorHandlerMock = jasmine.createSpyObj('IbBookingErrorHandlerService', ['handleErrorOperator']);

        TestBed.configureTestingModule({
            providers: [
                IbPaymentSuccessService,
                { provide: BookingRxProxy, useValue: bookingRxProxyMock },
                { provide: IbBookingErrorHandlerService, useValue: errorHandlerMock }
            ]
        });

        service = TestBed.inject(IbPaymentSuccessService);
        bookingRxProxySpy = TestBed.inject(BookingRxProxy) as jasmine.SpyObj<BookingRxProxy>;
        errorHandlerSpy = TestBed.inject(IbBookingErrorHandlerService) as jasmine.SpyObj<IbBookingErrorHandlerService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call BookingRxProxy.post with correct parameters and handle success response', async () => {
        const mockRequest: GetPaymentSuccessRequest = { flowId: '123', contextId: '456' };
        const mockResponse = { data: 'success' } as any;
        bookingRxProxySpy.post.and.returnValue(of(mockResponse));
        errorHandlerSpy.handleErrorOperator.and.callFake(() => (source: any) => source);

        await service.postPaymentSuccess(mockRequest);

        expect(bookingRxProxySpy.post).toHaveBeenCalledWith(
            HttpServicesConstants.DEFAULT_ENDPOINTS.PAY_SUCCESS_ORM,
            mockRequest
        );
        expect(errorHandlerSpy.handleErrorOperator).toHaveBeenCalled();
    });

    it('should handle error when BookingRxProxy.post fails', async () => {
        const mockRequest: GetPaymentSuccessRequest = { flowId: '123', contextId: '456' };
        const mockError = new Error('Network error');
        bookingRxProxySpy.post.and.returnValue(throwError(() => mockError));
        errorHandlerSpy.handleErrorOperator.and.callFake(() => (source: any) => source);

        try {
            await service.postPaymentSuccess(mockRequest);
            fail('Expected error to be thrown');
        } catch (error) {
            expect(error).toBe(mockError);
        }

        expect(bookingRxProxySpy.post).toHaveBeenCalledWith(
            HttpServicesConstants.DEFAULT_ENDPOINTS.PAY_SUCCESS_ORM,
            mockRequest
        );
        expect(errorHandlerSpy.handleErrorOperator).toHaveBeenCalled();
    });
});