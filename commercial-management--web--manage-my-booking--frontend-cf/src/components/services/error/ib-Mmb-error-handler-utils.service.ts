import { Injectable } from '@angular/core';
import { merge } from 'lodash-es';
import { MmbErrorHandlerControl } from '@src/app/core/models/generic-models';
import { MmbCommonsErrorDataGeneral, MmbCommonsErrorsResponseGeneral, MmbServiceErrorMessages, MmbServiceErrorPatterns } from '@src/app/core/models/general-errors-model';

@Injectable({providedIn: 'root'})
export class IbMmbErrorHandlerUtilsService {
    constructor () { }
    
    public controlError = ( error: MmbCommonsErrorDataGeneral ): MmbErrorHandlerControl => {
        let serviceError = <MmbErrorHandlerControl> {};
        switch ( error.errorCode ) {
                case 400:
                    if ( error.data?.errors?.length > 1 ) {
                        serviceError = this.returnProcessedErrorSeparateParameters( this.processGeneralErrorWithProperties( error ), error );
                    } else {
                        serviceError = this.returnProcessedErrorSeparateParameters( this.processGeneralError( error ) );
                    }
                    break;
                default:
                    serviceError = this.returnProcessedErrorSeparateParameters( this.processGeneralError( error ) );
                    break;
        }
        return serviceError;
    };
    
    private returnProcessedErrorSeparateParameters = ( responseError: MmbCommonsErrorsResponseGeneral, error?: MmbCommonsErrorDataGeneral
    ) => {
        if ( error ) {
            merge( responseError, {
                serviceError: error.data
            } );
        }
        return responseError;
    };
    
    private processGeneralMessageError = ( reason: string ): string => {
        let message: string = '';
        switch ( reason ) {
                case MmbServiceErrorMessages.JSON_MAPPING_EXCEPTION:
                    message = MmbServiceErrorMessages.JSON_MAPPING_EXCEPTION;
                    break;
                case MmbServiceErrorMessages.UNEXPECTED_TECHNICAL_EXCEPTION:
                    message = MmbServiceErrorMessages.UNEXPECTED_TECHNICAL_EXCEPTION;
                    break;
                case MmbServiceErrorMessages.FARE_NOT_FOUND:
                    message = MmbServiceErrorMessages.FARE_NOT_FOUND;
                    break;
                case MmbServiceErrorMessages.PAC_UTILS_E0001:
                    message = MmbServiceErrorMessages.SERVICEGENERALERROR;
                    break;
                default:
                    message = reason;
        }
        return message;
    };
    
    
    private processGeneralError = ( error: MmbCommonsErrorDataGeneral ): MmbCommonsErrorsResponseGeneral => {
        let processedResponse = this.getProcessedErrorResponseModel( error );
        const hasReason = this.getHasReason( error );
        processedResponse.message = hasReason ?
            this.processGeneralMessageError( error.data.errors[ 0 ].reason ) : MmbServiceErrorMessages.SERVICEGENERALERROR;
        processedResponse.needsTranslate = this.getNeedsTranslate( hasReason, processedResponse, error );
        processedResponse.internalErrorCode = this.getInternaErrorCode( hasReason, error );
        return processedResponse;
    };
    
    private getHasReason = ( error: MmbCommonsErrorDataGeneral ): boolean => {
        return error.data && error.data.errors && error.data.errors.length > 0;
    };
    
    private getNeedsTranslate = ( hasReason: boolean, processedResponse: MmbCommonsErrorsResponseGeneral, error: MmbCommonsErrorDataGeneral ): boolean => {
        return !hasReason || processedResponse.message !== error.data.errors[ 0 ].reason;
    };
    
    private getInternaErrorCode = ( hasReason: boolean, error: MmbCommonsErrorDataGeneral ) => {
        return hasReason ? error.data.errors[0].code : (error.data?.error?.code ? error.data.error.code : this.getInternalErrorCodeDouble(error));
    };

    private getInternalErrorCodeDouble = (error) => {
        return (error.data?.error?.error?.code ? error.data.error.error.code : '')
    };
    
    private processGeneralErrorWithProperties = ( error: MmbCommonsErrorDataGeneral ): MmbCommonsErrorsResponseGeneral => {
        let processedResponse = <MmbCommonsErrorsResponseGeneral> {};
        const hasReason = this.getHasReason( error );
        const ERROR_PATTERN = MmbServiceErrorPatterns.ERROR_PATTERN_WITH_PROPERTIES;
        if (hasReason && error.data.errors.length === 1) {
            processedResponse = this.getUniqueErrorWithReason( ERROR_PATTERN, error );
        } else {
            processedResponse = this.getMultipleErrorResponse( ERROR_PATTERN, hasReason, error );
        }
        return processedResponse;
    };
    
    private getProcessedErrorResponseModel = ( error: MmbCommonsErrorDataGeneral ): MmbCommonsErrorsResponseGeneral => {
        let flowId = error?.data?.flowId ? error.data.flowId : this.isDataErrorFlowId(error);
        let otp = (error?.data?.otp);
        let objectError: MmbCommonsErrorsResponseGeneral = {        
            message: '',
            needsTranslate: false,
            errorCode: error.errorCode,
            internalErrorCode: '',
            requestURL: error.requestURL
        };
        if (flowId) objectError = {...objectError,  flowId};
        if (otp) objectError = {...objectError, otp };
        return objectError;
    };

    private isDataErrorFlowId = (error) => {
        return (error?.data?.error?.flowId ? error.data.error.flowId : null);
    };
    
    private getUniqueErrorWithReason = ( pattern: RegExp, error: MmbCommonsErrorDataGeneral ): MmbCommonsErrorsResponseGeneral => {
        let processedResponse = this.getProcessedErrorResponseModel( error );
        if (pattern.test(error.data.errors[0].reason)) {
            const reasonParameters = error.data.errors[0].reason.split('|');
            processedResponse.message = reasonParameters[1].split(':')[1];
            processedResponse.internalErrorCode = error.data.errors[0].code;
        } else {
            processedResponse = this.processGeneralError(error);
        }
        return processedResponse;
    };
    
    private getMultipleErrorWithReason = ( pattern: RegExp, error: MmbCommonsErrorDataGeneral ): MmbCommonsErrorsResponseGeneral => {
        let processedResponse = this.getProcessedErrorResponseModel( error );
        processedResponse.messageList = [];
        processedResponse.internalErrorCode = error.data.errors[ 0 ].code;
        for ( let i = 0; i < error.data.errors.length; i++ ) {
            if ( pattern.test( error.data.errors[ i ].reason ) ) {
                const reasonParameters = error.data.errors[ i ].reason.split( '|' );
                processedResponse.messageList.push( {
                    message: reasonParameters[ 1 ].split( ':' )[ 1 ],
                    internalErrorCode: error.data.errors[ i ].code
                } );
            } else {
                processedResponse.messageList.push( this.getListMessage( i, error ) );
            }
        }
        return processedResponse;
    };
    
    private getListMessage = ( index: number, error: MmbCommonsErrorDataGeneral ) => {
        return {
            message: error.data.errors[ index ].reason,
            internalErrorCode: error.data.errors[ index ].code
        };
    };
    
    private getMultipleErrorResponse = ( pattern: RegExp, hasReason: boolean, error: MmbCommonsErrorDataGeneral ): MmbCommonsErrorsResponseGeneral => {
        if ( hasReason ) {
            return this.getMultipleErrorWithReason( pattern, error );
        } else {
            return this.processGeneralError( error );
        }
    };
}