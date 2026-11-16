import { TestBed } from "@angular/core/testing";
import { IbBookingErrorHandlerService } from "@src/app/shared/http-services/error";
import { BookingRxProxy } from "@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service";
import { IbPaymentOnholdOrderService } from "@src/app/shared/http-services/sse-orm/ib-payment-onhold-order.service";
import { cloneDeep } from "lodash-es";
import { catchError, of, throwError } from "rxjs";

class BookingRXProxyMock {
    public postResponse = {};
    public post = jasmine.createSpy('post').and.callFake(() => of(cloneDeep(this.postResponse)));
}
class IbBookingErrorHandlerServiceMock {
    public handleErrorOperator = jasmine.createSpy('handleErrorOperator').and.callFake(() => (source) => source.pipe(
        catchError((error: unknown) => {
            return throwError(() => error);
        })
    ));
}
// @ts-ignore
interface TestService extends IbPaymentOnholdOrderService {
    BookingRxProxy: BookingRXProxyMock;
    IbBookingErrorHandlerService: IbBookingErrorHandlerServiceMock;
}

describe('Test ib-payment-onhold-order.service.spec.ts', () => {
    let service: TestService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                IbPaymentOnholdOrderService,
                { provide: BookingRxProxy, useClass: BookingRXProxyMock },
                { provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock },
            ]
        });
        service = TestBed.inject(IbPaymentOnholdOrderService) as any;
    });

    it("should return the data from the response", async () => {
        service.BookingRxProxy.postResponse = { data: 'on hold data' };
        const response = await service.freeOnHoldOrder({
            orderId: 'orderId',
            orderItemsId: ['item1', 'item2'],
            onHoldOptionId: 'optionId',
            phone: '+1234567890'
        });
        expect(response.data).toEqual('on hold data' as any);
    });

    it("should handle error", async () => {
        service.BookingRxProxy.post = jasmine.createSpy('post').and.callFake(() => throwError('error'));
        try {
            await service.freeOnHoldOrder({
                orderId: 'orderId',
                orderItemsId: ['item1', 'item2'],
                onHoldOptionId: 'optionId',
                phone: '+1234567890'
            });
        } catch (error) {
            expect(service.IbBookingErrorHandlerService.handleErrorOperator).toHaveBeenCalled();
        }
    });
});
