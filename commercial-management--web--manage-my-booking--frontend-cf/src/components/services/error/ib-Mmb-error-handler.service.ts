import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IbCHttpErrorHandlerService } from 'ib-web-commons/http-services';
import { Observable, throwError } from 'rxjs';
import { MmbHttpErrorModel, MmbHttpErrorModelData } from '@src/app/core/models/generic-models';
import { IbMmbErrorHandlerUtilsService } from './ib-Mmb-error-handler-utils.service';
import { MmbCommonsErrorsResponseGeneral } from '@src/app/core/models/general-errors-model';
@Injectable({
    providedIn: 'root'
})
export class IbMmbErrorHandlerService extends IbCHttpErrorHandlerService {
    constructor (
        private IbMmbErrorHandlerUtilsService: IbMmbErrorHandlerUtilsService
    ) {
        super();
    }

    protected override handleGenericError (error: HttpErrorResponse): Observable<never> {
        return throwError(()=> this.getLegacyErrorMessage(error));
    }
    private getLegacyErrorMessage (angularError: HttpErrorResponse): MmbCommonsErrorsResponseGeneral {
        const error: MmbHttpErrorModel = super.getErrorMessage( angularError )[ 0 ] as unknown as MmbHttpErrorModel;
        
        error.errorCode = angularError.status;
        error.requestURL = angularError.url;
        error.data = this.getDataFromAngularError( angularError );
        return this.IbMmbErrorHandlerUtilsService.controlError( error );
    }
    
    private getDataFromAngularError = ( err: any ): MmbHttpErrorModelData => {
        if ( !err.error ) return;
        const data = err.error as MmbHttpErrorModelData;
        
        return err.error.errors ? data : { error: err.error };
    };

}

