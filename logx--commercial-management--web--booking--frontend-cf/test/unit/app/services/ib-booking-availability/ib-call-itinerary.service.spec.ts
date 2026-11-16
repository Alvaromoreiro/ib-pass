import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { CallItineraryService } from '@shared/http-services/sse-avm/ib-call-itinerary.service';
import {HttpServicesConstants} from '@src/app/core/constants/ib-http-services-constants';
import { ItineraryRequestData } from '../../shared/http-services/mocks/IbBookingItineraryRequestData';
import { BookingSalesforceRxProxy } from '@shared/http-services/proxy/ib-booking-salesforce-rx-proxy.service';
import { IbBookingErrorHandlerService } from '@shared/http-services/error/ib-booking-error-handler.service';
import { catchError, Observable, throwError } from 'rxjs';
import { AJSRootScope } from 'ib-web-commons/utils';
class IbBookingErrorHandlerServiceMock {
    handleErrorOperator() {
        return (source: Observable<any>) => source.pipe(catchError((error) => throwError(error)))
    }
}


describe( 'CallItineraryService tests', () => {
    let service: CallItineraryService;
    let httpMock: HttpTestingController;
    let handleError = new IbBookingErrorHandlerServiceMock()

    beforeEach( () => {
        TestBed.configureTestingModule( {
            imports: [ HttpClientTestingModule ],
            providers: [
                CallItineraryService,
                BookingSalesforceRxProxy,
                { provide: IbBookingErrorHandlerService, useValue: handleError },
                {provide: AJSRootScope, useValue: {}}
            ]
        } );
        service = TestBed.inject( CallItineraryService );
        httpMock = TestBed.inject( HttpTestingController );
    } );

    afterEach( () => {
        httpMock.verify();
    } );


    it( 'should be created', () => {
        expect( service ).toBeTruthy();
    } );

    describe( 'when #getOutboundItinerary is called', () => {
        const url = HttpServicesConstants.DEFAULT_ENDPOINTS.availabilityItineraryOutboundServiceURI;
        it( 'it should be POST and return body if code 200', fakeAsync( () => {
            const mockedResp: any  = { code: 200, data: {fareFamilyConditions: ['a']} }

            const sub = service.getOutboundItinerary(ItineraryRequestData).subscribe(
            {
                next: (res) => {
                    expect(res).toEqual(mockedResp)
                },
                complete: () =>{
                    sub.unsubscribe();
                },
            }
            );
            const req = httpMock.expectOne(url);
            expect(req.request.method).toEqual('POST');
            req.flush(mockedResp.data, { status: 200, statusText: 'OK', });
            flush();
        } ) );

        it('and #getOutboundItinerary called, should be POST and return errors', fakeAsync(() => {
            const mockedResp = null;

            const sub = service.getOutboundItinerary( ItineraryRequestData ).subscribe({
                error: (err) => {
                    expect(err.error).toEqual(null);
                    expect(err.status).toEqual(400);
                    sub.unsubscribe();
                }
            });

            const req = httpMock.expectOne(url);
            expect(req.request.method).toEqual('POST');
            req.flush(mockedResp, { status: 400, statusText: 'Bad Request' });
            flush();
            
        }));
    } );

    describe( 'when #getReturnItinerary is called', () => {
        const responseId = 'Qm9va2luZ0BHVy0xNjkwNTM0OTU2MjMzLVExbFZn';
        const offerId = 'IB642d125dbc834cd783d73878f0ace46bOP';
        const sliceId= 2;
        const url = HttpServicesConstants.DEFAULT_ENDPOINTS.availabilityItineraryReturnServiceURI
            .replace('{{responseId}}', responseId)
            .replace('{{offerId}}', offerId)
            .replace('{{sliceId}}', ''+sliceId);
        it( 'it should be GET and return body if code 200', fakeAsync( () => {
            const mockedResp: any  = { code: 200, data: {fareFamilyConditions: ['a']} }
            const sub = service.getReturnItinerary( responseId, offerId, sliceId ).subscribe((res) =>{
                expect(res).toEqual(mockedResp);
                sub.unsubscribe();
            });
            const req = httpMock.expectOne(url);
            expect(req.request.method).toEqual('GET');
            req.flush(mockedResp.data, { status: 200, statusText: 'OK' });
            flush();
        } ) );
        it('and #getReturnItinerary called, should be POST and return errors', fakeAsync(() => {
            const mockedResp = null;
            const sub = service.getReturnItinerary( responseId, offerId, sliceId ).subscribe({
                error: (err) => {
                    expect(err.error).toEqual(null);
                    expect(err.status).toEqual(410);
                    sub.unsubscribe();
                }
            });
            const req = httpMock.expectOne(url);
            expect(req.request.method).toEqual('GET');
            req.flush(mockedResp, { status: 410, statusText: 'Bad Request'});
            flush();
        }));
    } );
} );

