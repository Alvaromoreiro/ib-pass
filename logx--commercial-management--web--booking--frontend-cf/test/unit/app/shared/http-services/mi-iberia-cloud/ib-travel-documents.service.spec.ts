import { TestBed } from "@angular/core/testing";
import { IbBookingErrorHandlerService } from "@src/app/shared/http-services/error";
import { IbTravelDocumentsService } from "@src/app/shared/http-services/mi-iberia-cloud/ib-travel-documents.service";
import { BookingSalesforceRxProxy } from "@src/app/shared/http-services/proxy/ib-booking-salesforce-rx-proxy.service";
import { catchError, of, throwError } from "rxjs";

class IbBookingErrorHandlerServiceMock {
    public handleErrorOperator = jasmine.createSpy('handleErrorOperator').and.callFake(()=> (source) => source.pipe(
        catchError((error: unknown) => {
            return throwError(() => error);
        })
    ));
}

class BookingSalesforceRxProxyMock {
    public static response;
    public static throwedError;
    public post = () => BookingSalesforceRxProxyMock.throwedError? throwError(()=> BookingSalesforceRxProxyMock.throwedError) : of(BookingSalesforceRxProxyMock.response);
    public get = () => BookingSalesforceRxProxyMock.throwedError? throwError(()=> BookingSalesforceRxProxyMock.throwedError) : of(BookingSalesforceRxProxyMock.response);
};
describe('IbTravelDocumentsService Test', () => {
    let service: IbTravelDocumentsService;
    let mockError = {
        'errorCode': 404,
        'data': {
            'errors': [{ 'reason': 'error' }]
        }
    }
    beforeEach(() => {
        BookingSalesforceRxProxyMock.response = {};
        BookingSalesforceRxProxyMock.throwedError = null;
        TestBed.configureTestingModule( {
            imports: [  ],
            providers: [
                {provide: BookingSalesforceRxProxy, useClass: BookingSalesforceRxProxyMock},
                {provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock}
            ]
        });
        service = TestBed.inject( IbTravelDocumentsService );
    })

    it( 'should be created', () => {
        expect( service ).toBeTruthy();
    } );

    describe('when getTravelDocuments is called', () => {
        beforeEach(() => {
            BookingSalesforceRxProxyMock.throwedError = null;
        })
        it('and service return 200',(done)=>{
            service.getTravelDocuments().then((msg) => {
                expect(msg).toEqual({});
                done()
            }, done.fail);
        })
        it('and service return 404',(done)=>{
            BookingSalesforceRxProxyMock.throwedError = mockError;
            service.getTravelDocuments().then(() => {}, (responseError)=> {
                expect(responseError).toEqual({ errorCode: 404, data: {
                    errors: [{ reason: 'error' }]
                } });
                done();
        });
        })
    })

})
