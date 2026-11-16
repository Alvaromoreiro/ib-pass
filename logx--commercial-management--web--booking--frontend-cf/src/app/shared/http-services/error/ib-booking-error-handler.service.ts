import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IbCHttpErrorHandlerService } from 'ib-web-commons/http-services';
import { Observable, throwError } from 'rxjs';
import { BookingHttpErrorModel, BookingHttpErrorModelData } from '@src/app/core/models/generic-models/generic-models';
import { ErrorHandlerUtilsService } from './ib-booking-error-handler-utils.service';
@Injectable({
    providedIn: 'root'
})
export class IbBookingErrorHandlerService extends IbCHttpErrorHandlerService {
    constructor (
        private ErrorHandlerUtilsService: ErrorHandlerUtilsService
    ) {
        super();
    }

    protected override handleGenericError (error: HttpErrorResponse): Observable<never> {
        return throwError(()=> this.getLegacyErrorMessage(error));
    }
    private getLegacyErrorMessage (angularError: HttpErrorResponse): CommonsErrorsModel.CommonsErrorsResponseGeneral {
        const error: BookingHttpErrorModel = super.getErrorMessage( angularError )[ 0 ] as unknown as BookingHttpErrorModel;
        
        error.errorCode = angularError.status;
        error.requestURL = angularError.url;
        error.data = this.getDataFromAngularError( angularError );
        return this.ErrorHandlerUtilsService.controlError( error );
    }
    
    private getDataFromAngularError = ( err: any ): BookingHttpErrorModelData => {
        if ( !err.error ) return;
        return err.error.errors ? { errors: err.error.errors } : { error: err.error };
    };

}

