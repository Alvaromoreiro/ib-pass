import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IbCHttpErrorHandlerService } from 'ib-web-commons/http-services';
import { Observable, throwError } from 'rxjs';

export declare type ProcessedHttpErrorInfo = {
    message: string;
    needsTranslate: boolean;
    internalErrorCode: string;
};
export declare type ProcessedHttpError = {
    errorCode?: number;
    requestURL?: string;
    errorInfo?: ProcessedHttpErrorInfo[];
};
export type PmtHttpErrorModel = {
    errorCode: number;
    requestURL: string;
} | ProcessedHttpError;

@Injectable({
    providedIn: 'root'
})
export class IbPmtErrorHandlerService extends IbCHttpErrorHandlerService {
    constructor (
    ) {
        super();
    }

    protected override handleGenericError (error: HttpErrorResponse): Observable<never> {
        return throwError(()=> this.getLegacyErrorMessage(error));
    }
    private getLegacyErrorMessage (angularError: HttpErrorResponse): PmtHttpErrorModel {
        const error:PmtHttpErrorModel  = super.getErrorMessage(angularError)[0] as PmtHttpErrorModel;
        error.errorCode = angularError.status;
        error.requestURL = angularError.url;
        return error;
    }

}

