import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error/ib-booking-error-handler.service';
import { IbCHttpErrorHandlerService } from 'ib-web-commons/http-services';
import { lastValueFrom } from 'rxjs';

class BookingRedirectionServiceMock {
    public externalRedirect = jasmine.createSpy('externalRedirect');
}


// @ts-ignore
interface TestService extends IbBookingErrorHandlerService {
    getLegacyErrorMessage: IbBookingErrorHandlerService['getLegacyErrorMessage'];
    handleGenericError: IbBookingErrorHandlerService['handleGenericError'];
}

describe('IbBookingErrorHandlerService', () => {
    let service: TestService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IbBookingErrorHandlerService,
            ]
        });
        service = TestBed.inject(IbBookingErrorHandlerService) as any;
        // Mockea métodos específicos
        spyOn(IbCHttpErrorHandlerService.prototype as any, 'handleGenericError');
        spyOn(IbCHttpErrorHandlerService.prototype as any, 'getErrorMessage')
        .and.returnValue([{ errorCode: 500, requestURL: 'test-url' }]);
   
    });



    describe('handleGenericError', () => {
        it('should throw an error with legacy error message', () => {
            const error = new HttpErrorResponse( { status: 500, url: 'test-url', error: { errors: [] } } );
            const legacyErrorMessage = service.getLegacyErrorMessage(error);

            expect( legacyErrorMessage.errorCode ).toEqual( 500 );
            expect( legacyErrorMessage.requestURL ).toEqual( 'test-url' );
        });

        it('should handle error using operator', async () => {
            const error = new HttpErrorResponse( { status: 500, url: 'test-url', error: { errors: [] } } );
            try{
                await lastValueFrom(service.handleGenericError(error));
            } catch (error) {
                expect(error).toEqual({ errorCode: 500, requestURL: 'test-url', message: 'REST_SERVICE_ERROR_GENERAL', needsTranslate: true, internalErrorCode: '' });
            }
            
        });
    });
});
