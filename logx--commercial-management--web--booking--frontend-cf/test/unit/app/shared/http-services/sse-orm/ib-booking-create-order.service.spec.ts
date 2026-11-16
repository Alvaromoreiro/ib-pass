import { TestBed } from '@angular/core/testing';
import { CreateOrderRequestData } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { BookingSalesforceRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-salesforce-rx-proxy.service';
import { CreateOrderService } from '@src/app/shared/http-services/sse-orm/ib-booking-create-order.service';
import { Observable } from 'rxjs';
import { IbBookingErrorHandlerServiceMock } from 'test/mocks/Services/IbBookingErrorHandlerServiceMock';
import { BookingSalesforceRxProxyMock } from '../../../../../mocks/Services/BookingSalesforceRxProxyMock';
// @ts-ignore
interface TestService extends CreateOrderService {
    BookingSalesforceRxProxy: BookingSalesforceRxProxyMock;
    IbBookingErrorHandlerService: IbBookingErrorHandlerServiceMock;
}

describe('BookingCreateOrderService Test', () => {
    let service: TestService;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                CreateOrderService,
                { provide: BookingSalesforceRxProxy, useClass: BookingSalesforceRxProxyMock },
                { provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock }
            ],
        });
        service = TestBed.inject( CreateOrderService ) as any;
    } );
    
    describe( 'When CreateOrderService is called', () => {
        it( 'it should return the data', async () => {
            service.BookingSalesforceRxProxy.getResponse = { data: 'order created' };
            const response = await service.createOrderCall( {} as CreateOrderRequestData );
            expect( response ).toEqual( 'order created' as any );
        } );
        it( 'it should handle error', async () => {
            service.BookingSalesforceRxProxy.post = jasmine.createSpy( 'post' ).and.callFake( () => new Observable( observer => { observer.error( new Error( 'error creating order' ) ); } ) )
            try {
                await service.createOrderCall( {} as CreateOrderRequestData );
            } catch {
                expect( service.IbBookingErrorHandlerService.handleErrorOperator ).toHaveBeenCalled();
            }
        } );
    });
});