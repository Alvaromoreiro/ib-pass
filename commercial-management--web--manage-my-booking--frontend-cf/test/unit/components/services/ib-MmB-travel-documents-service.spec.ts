import { TravelDocumentsModel } from './../../../../src/app/core/models/travel-documents/travel-documents-model';
import { IbMmbTravelDocumentsService } from './../../../../src/components/services/ib-MmB-travel-documents.service';
import { TestBed } from "@angular/core/testing";
import { catchError, of, throwError } from 'rxjs';
import { MmBSalesforceRxProxy } from './../../../../src/components/services/proxy/ib-MmB-salesforce-rx-proxy.service';

class MmBSalesforceRxProxyMock {
    public static response;
    public static throwedError;
    public post = () => MmBSalesforceRxProxyMock.throwedError? throwError(()=> MmBSalesforceRxProxyMock.throwedError) : of(MmBSalesforceRxProxyMock.response);
    public get = () => MmBSalesforceRxProxyMock.throwedError? throwError(()=> MmBSalesforceRxProxyMock.throwedError) : of(MmBSalesforceRxProxyMock.response);
};
class IbCHttpErrorHandlerService {
    public handleErrorOperator = jasmine.createSpy('handleErrorOperator').and.callFake(()=> (source) => source.pipe(
        catchError((error: unknown) => {
            return throwError(() => error);
        })
    ));
};


describe('Test IbMmbTravelDocumentsService', () => {
    let service: IbMmbTravelDocumentsService;
    let fakeMmBSalesforceRxProxy: MmBSalesforceRxProxyMock = new MmBSalesforceRxProxyMock();
    let fakeIbCHttpErrorHandlerService: IbCHttpErrorHandlerService = new IbCHttpErrorHandlerService();
    let mockResponse:TravelDocumentsModel = {
        code: 234,
        data: {
            documents: [{
                document_type: 'DNI',
                document_number: '35345E',
                expiry_date: '2050-12-25',
                id: 'asdasd',
                country: 'ES'
            }],
            meta: {
                additional_info: '',
                timestamp: ''
            }
        }

    }

    let mockError = {}

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: MmBSalesforceRxProxy, useValue: fakeMmBSalesforceRxProxy },
                { provide: IbCHttpErrorHandlerService, useValue: fakeIbCHttpErrorHandlerService },
            ]
        });
        service = TestBed.inject(IbMmbTravelDocumentsService);


    });

    it( 'should be created', () => {
        expect( service ).toBeTruthy();
    } );

    describe('when travelDocumentsService Proxy get resolves the promise', () => {
        beforeEach(() => {
            MmBSalesforceRxProxyMock.throwedError = null;
        })
        it('phoneCodeList are not in localstorage', (done) => {
            service.getTravelDocuments().then((responseData) => {
                expect(responseData).toEqual(undefined);
                done()
            }, done.fail);
        })
    });
    describe('when travelDocumentsService Proxy get rejects the promise', () => {
        beforeEach(inject(() => {
            MmBSalesforceRxProxyMock.throwedError = {errorCode: 408};
        }));
        it('with error code 408, should be returned error data', () => {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            service.getTravelDocuments().then(() => {}, (responseError) => {
                expect(responseError.errorCode).toEqual(408);
            });
        });
    });

    describe('when travelDocumentsService Proxy post resolves the promise', () => {
        beforeEach(inject(() => {
            MmBSalesforceRxProxyMock.throwedError = null;
        }));
        it('phoneCodeList are not in localstorage', (done) => {
            service.postTravelDocuments().then((responseData) => {
                expect(responseData).toEqual(undefined);
                done();
            }).catch(() => {
                done.fail();
            });;
        });
    });
    describe('when travelDocumentsService Proxy post rejects the promise', () => {
        beforeEach(inject(() => {
            MmBSalesforceRxProxyMock.throwedError = {errorCode: 408};
        }));
        it('with error code 408, should be returned error data', () => {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            service.postTravelDocuments().then(() => {}, (responseError) => {
                expect(responseError.errorCode).toEqual(408);
            });
        });
    });


});

