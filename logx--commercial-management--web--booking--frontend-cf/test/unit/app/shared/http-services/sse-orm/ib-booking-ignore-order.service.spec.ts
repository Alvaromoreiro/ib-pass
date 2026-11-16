import { TestBed } from '@angular/core/testing';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';
import { IgnoreOrderService } from '@src/app/shared/http-services/sse-orm/ib-booking-ignore-order.service';
import { Observable } from 'rxjs';
import { BookingRXProxyMock } from 'test/mocks/Services/BookingRXProxyMock';
import { IbBookingErrorHandlerServiceMock } from 'test/mocks/Services/IbBookingErrorHandlerServiceMock';

// @ts-ignore
interface TestService extends IgnoreOrderService {
    BookingRxProxy: BookingRXProxyMock;
    IbBookingErrorHandlerService: IbBookingErrorHandlerServiceMock;
}

describe('IgnoreOrderService Test', () => {
    let service: TestService;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                IgnoreOrderService,
                { provide: BookingRxProxy, useClass: BookingRXProxyMock },
                { provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock }
            ],
        });
        service = TestBed.inject( IgnoreOrderService ) as any;
    } );
    
    describe( 'When IgnoreOrderService is called', () => {
        it( 'it should return the data', async () => {
            service.BookingRxProxy.getResponse = { data: 'deleted order' };
            const response = await service.ignoreOrder( '#' );
            expect( response ).toEqual( 'deleted order' as any );
        } );
        it( 'it should handle error', async () => {
            service.BookingRxProxy.delete = jasmine.createSpy( 'delete' ).and.callFake( () => new Observable( observer => { observer.error( new Error( 'error deleting order' ) ); } ) )
            try {
                await service.ignoreOrder( '#' );
            } catch {
                expect( service.IbBookingErrorHandlerService.handleErrorOperator ).toHaveBeenCalled();
            }
        } );
    });
});