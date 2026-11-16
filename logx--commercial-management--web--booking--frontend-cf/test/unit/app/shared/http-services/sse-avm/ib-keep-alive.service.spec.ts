import { TestBed } from '@angular/core/testing';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';
import { KeepAliveService } from '@src/app/shared/http-services/sse-avm/ib-keep-alive.service';
import { Observable } from 'rxjs';
import { BookingRXProxyMock } from 'test/mocks/Services/BookingRXProxyMock';
import { IbBookingErrorHandlerServiceMock } from 'test/mocks/Services/IbBookingErrorHandlerServiceMock';


// @ts-ignore
interface TestService extends KeepAliveService {
    BookingRxProxy: BookingRXProxyMock;
    IbBookingErrorHandlerService: IbBookingErrorHandlerServiceMock;
}

describe('KeepAliveService Test', () => {
    let service: TestService;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                KeepAliveService,
                { provide: BookingRxProxy, useClass: BookingRXProxyMock },
                { provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock }
            ],
        });
        service = TestBed.inject( KeepAliveService ) as any;
    });
    describe( 'When keepAliveAvm is called', () => {
        it( 'it should return de data from the response', async() => {
            service.BookingRxProxy.getResponse = { data: 'dataAvm' };
            const response = await service.keepAliveAvm( '' );
            expect( response ).toEqual( 'dataAvm' as any );
        } );
        it( 'it should handle error', async () => {
            service.BookingRxProxy.get = jasmine.createSpy( 'get' ).and.callFake( () => new Observable( observer => { observer.error( new Error( 'errorAvm' ) ); } ) )
            try {
                await service.keepAliveAvm( '' );
            } catch {
                expect( service.IbBookingErrorHandlerService.handleErrorOperator ).toHaveBeenCalled();
            }
        } );
    } );
    describe( 'When keepAliveOrm is called', () => {
        it( 'it should return the data from the response', async () => {
            service.BookingRxProxy.getResponse = { data: 'dataOrm' };
            const response = await service.keepAliveOrm( '' );
            expect( response ).toEqual( 'dataOrm' as any );
        } );
        it( 'it should handle error', async () => {
            service.BookingRxProxy.get = jasmine.createSpy( 'get' ).and.callFake( () => new Observable( observer => { observer.error( new Error( 'errorOrm' ) ); } ) )
            try {
                await service.keepAliveAvm( '' );
            } catch {
                expect( service.IbBookingErrorHandlerService.handleErrorOperator ).toHaveBeenCalled();
            }
        });
    } );
});