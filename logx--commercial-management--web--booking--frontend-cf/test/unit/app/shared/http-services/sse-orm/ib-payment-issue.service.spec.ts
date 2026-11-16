import { TestBed } from "@angular/core/testing";
import { IbBookingErrorHandlerService } from "@src/app/shared/http-services/error";
import { BookingRxProxy } from "@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service";
import { IbPaymentsIssuesService } from "@src/app/shared/http-services/sse-orm/ib-payment-issues.service";
import { throwError } from "rxjs";
import { BookingRXProxyMock } from '../../../../../mocks/Services/BookingRXProxyMock';
import { IbBookingErrorHandlerServiceMock } from '../../../../../mocks/Services/IbBookingErrorHandlerServiceMock';


// @ts-ignore
interface TestService extends IbPaymentsIssuesService {
    BookingRxProxy: BookingRXProxyMock;
    IbBookingErrorHandlerService: IbBookingErrorHandlerServiceMock;
}



describe ('Test ib-payment-issue.service.spec.ts', () => {  
    let service: TestService;
    beforeEach(() => {
           
        TestBed.configureTestingModule( {
            imports: [  ],
            providers: [
                IbPaymentsIssuesService,
                {provide: BookingRxProxy, useClass: BookingRXProxyMock},
                {provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock},
            ]
        });
        service = TestBed.inject(IbPaymentsIssuesService) as any;
    });


    it("should return the data from the response", async() => {
        service.BookingRxProxy.getResponse = {data: 'some data'};
        const response = await service.getPaymentIssue({flowId: 'flowId', status: 'status', error: 'error', contextId: 'contextId'});
        expect(response).toEqual('some data' as any);
    });
    it("should handle error", async() => {
        service.BookingRxProxy.get = jasmine.createSpy('get').and.callFake(()=> throwError('error'));
        try {
            await service.getPaymentIssue({flowId: 'flowId', status: 'status', error: 'error', contextId: 'contextId'});
        } catch (error) {
            expect(service.IbBookingErrorHandlerService.handleErrorOperator).toHaveBeenCalled();
        }
        
    });
});