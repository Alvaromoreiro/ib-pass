import { TestBed } from "@angular/core/testing";
import { IbBookingErrorHandlerService } from "@src/app/shared/http-services/error";
import { BookingRxProxy } from "@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service";
import { IbBookingOrderModifyPartnerDiscount } from "@src/app/shared/http-services/sse-orm/ib-booking-order-modify-partner-discount.service";
import { catchError, of, throwError } from "rxjs";

class BookingRxProxyMock {
    public get = jasmine.createSpy('get').and.callFake((url)=> of(url));
    public delete = jasmine.createSpy('delete').and.callFake((url)=> of(url));
}
class IbBookingErrorHandlerServiceMock {
    public handleErrorOperator = jasmine.createSpy('handleErrorOperator').and.callFake(()=> (source) => source.pipe(
        catchError((error: unknown) => {
            return throwError(() => error);
        })
    ));
}

describe('Test IbBookingOrderModifyPartnerDiscount', ()=> {
    let fakeBookingRxProxyMock;
    describe('Testing positive scenarios', ()=> {
        let service: IbBookingOrderModifyPartnerDiscount;
        beforeEach(() => { 
            fakeBookingRxProxyMock = new BookingRxProxyMock();
            TestBed.configureTestingModule( {
                imports: [  ],
                providers: [
                    {provide: BookingRxProxy, useValue: fakeBookingRxProxyMock},
                    {provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock},
                ]
            });
            service = TestBed.inject( IbBookingOrderModifyPartnerDiscount );
        })

        it('and testing add and delete', (done)=> {
            Promise.all([service.addPartnerDiscount('SAN', '01234'), service.deletePartnerDiscount('SAN', '01234')])
                .then((data)=> {
                    expect (data[0]as any).toEqual(`undefined/sse-orm/rs/v1/order/01234/discount/partner/SAN`);
                    expect (data[1] as any).toEqual((`undefined/sse-orm/rs/v1/order/01234/discount/partner/SAN`));
                    expect(fakeBookingRxProxyMock.get).toHaveBeenCalled();
                    expect(fakeBookingRxProxyMock.delete).toHaveBeenCalled();
                    done();
                })
                .catch(()=> done.fail())
        })

    })
    
})