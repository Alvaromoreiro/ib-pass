import { TestBed } from '@angular/core/testing';
import { ErrorHandlerUtilsService } from '@src/app/shared/http-services/error';
import OneError from './mocks/OneErrorOnData-mock.json';
import TwoError400 from './mocks/TwoErrorsOnData400-mock.json';
import OneError400 from './mocks/OneErrorOnData400-mock.json';
import OneErrorOnData from './mocks/OneErrorOnDataError-mock.json';
import FareNotFound from './mocks/FareNotFoundError-mock.json';
import JsonMappingError from './mocks/JsonMappingError-mock.json';
import UnexpectedException from './mocks/UnexpectedExceptionError-mock.json';
import PacUtilsError from './mocks/PacUtilsError-mock.json';
import { BkiServiceErrorMessages } from '@src/app/core/models/generic-models/general-errors-model';
describe('ErrorHandlerUtilsService Test', () => {
    let service: ErrorHandlerUtilsService;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [],
        });
        service = TestBed.inject(ErrorHandlerUtilsService) as unknown as any;
    });
    describe( 'When controlError is called', () => {
        it( 'It should return case error 500 with errors length = 1', () => {
            const error = service.controlError( OneError );
            expect( error.errorCode ).toEqual( 500 )
        } );
        it( 'It should return case error 400 with errors length > 1', () => {
            const error = service.controlError( TwoError400 );
            expect( error.errorCode ).toEqual( 400 )
        } );
        it( 'It should return case error 400 with errors length = 1', () => {
            const error = service.controlError( OneError400 );
            expect( error.errorCode ).toEqual( 400 )
        } );
        it( 'It should return case error one error on data with no reason', () => {
            const error = service.controlError( OneErrorOnData );
            expect( error.errorCode ).toEqual( 500 )
        } );
        it( 'It should return fare not found', () => {
            const error = service.controlError( FareNotFound );
            expect( error.message ).toEqual( BkiServiceErrorMessages.FARE_NOT_FOUND );
        } );
        it( 'It should return json mapping error', () => {
            const error = service.controlError( JsonMappingError );
            expect( error.message ).toEqual( BkiServiceErrorMessages.JSON_MAPPING_EXCEPTION );
        } );
        it( 'It should return unexpected exception', () => {
            const error = service.controlError( UnexpectedException );
            expect( error.message ).toEqual( BkiServiceErrorMessages.UNEXPECTED_TECHNICAL_EXCEPTION );
        } );
        it( 'It should return unexpected exception', () => {
            const error = service.controlError( PacUtilsError );
            expect( error.message ).toEqual( BkiServiceErrorMessages.SERVICEGENERALERROR );
        } );
    } );
});