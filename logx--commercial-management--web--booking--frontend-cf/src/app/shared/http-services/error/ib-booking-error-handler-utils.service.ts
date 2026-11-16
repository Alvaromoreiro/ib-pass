import { Injectable } from '@angular/core';
import { BkiServiceErrorMessages, BkiServiceErrorPatterns } from '../../../core/models/generic-models/general-errors-model';
import { merge } from 'lodash-es';
import { BookingErrorHandlerControl } from '@src/app/core/models/generic-models/generic-models';

@Injectable({providedIn: 'root'})
export class ErrorHandlerUtilsService {
    constructor () { }
    
    public controlError = ( error: CommonsErrorsModel.ErrorDataGeneral ): BookingErrorHandlerControl => {
        let serviceError = <BookingErrorHandlerControl> {};
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
    
    private returnProcessedErrorSeparateParameters = ( responseError: CommonsErrorsModel.CommonsErrorsResponseGeneral, error?: CommonsErrorsModel.ErrorDataGeneral
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
                case BkiServiceErrorMessages.JSON_MAPPING_EXCEPTION:
                    message = BkiServiceErrorMessages.JSON_MAPPING_EXCEPTION;
                    break;
                case BkiServiceErrorMessages.UNEXPECTED_TECHNICAL_EXCEPTION:
                    message = BkiServiceErrorMessages.UNEXPECTED_TECHNICAL_EXCEPTION;
                    break;
                case BkiServiceErrorMessages.FARE_NOT_FOUND:
                    message = BkiServiceErrorMessages.FARE_NOT_FOUND;
                    break;
                case BkiServiceErrorMessages.PAC_UTILS_E0001:
                    message = BkiServiceErrorMessages.SERVICEGENERALERROR;
                    break;
                default:
                    message = reason;
        }
        return message;
    };
    
    
    private processGeneralError = ( error: CommonsErrorsModel.ErrorDataGeneral ): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
        let processedResponse = this.getProcessedErrorResponseModel( error );
        const hasReason = this.getHasReason( error );
        processedResponse.message = hasReason ?
            this.processGeneralMessageError( error.data.errors[ 0 ].reason ) : BkiServiceErrorMessages.SERVICEGENERALERROR;
        processedResponse.needsTranslate = this.getNeedsTranslate( hasReason, processedResponse, error );
        processedResponse.internalErrorCode = this.getInternaErrorCode( hasReason, error );
        return processedResponse;
    };
    
    private getHasReason = ( error: CommonsErrorsModel.ErrorDataGeneral ): boolean => {
        return error.data && error.data.errors && error.data.errors.length > 0;
    };
    
    private getNeedsTranslate = ( hasReason: boolean, processedResponse: CommonsErrorsModel.CommonsErrorsResponseGeneral, error: CommonsErrorsModel.ErrorDataGeneral ): boolean => {
        return !hasReason || processedResponse.message !== error.data.errors[ 0 ].reason;
    };
    
    private getInternaErrorCode = ( hasReason: boolean, error: CommonsErrorsModel.ErrorDataGeneral ) => {
        return hasReason ? error.data.errors[0].code : (error.data?.error?.code ? error.data.error.code : '');
    };
    
    private processGeneralErrorWithProperties = ( error: CommonsErrorsModel.ErrorDataGeneral ): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
        let processedResponse = <CommonsErrorsModel.CommonsErrorsResponseGeneral> {};
        const hasReason = this.getHasReason( error );
        const ERROR_PATTERN = BkiServiceErrorPatterns.ERROR_PATTERN_WITH_PROPERTIES;
        if (hasReason && error.data.errors.length === 1) {
            processedResponse = this.getUniqueErrorWithReason( ERROR_PATTERN, error );
        } else {
            processedResponse = this.getMultipleErrorResponse( ERROR_PATTERN, hasReason, error );
        }
        return processedResponse;
    };
    
    private getProcessedErrorResponseModel = ( error: CommonsErrorsModel.ErrorDataGeneral ): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
        return <CommonsErrorsModel.CommonsErrorsResponseGeneral> {
            message: '',
            needsTranslate: false,
            errorCode: error.errorCode,
            internalErrorCode: '',
            requestURL: error.requestURL
        };
    };
    
    private getUniqueErrorWithReason = ( pattern: RegExp, error: CommonsErrorsModel.ErrorDataGeneral ): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
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
    
    private getMultipleErrorWithReason = ( pattern: RegExp, error: CommonsErrorsModel.ErrorDataGeneral ): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
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
    
    private getListMessage = ( index: number, error: CommonsErrorsModel.ErrorDataGeneral ) => {
        return {
            message: error.data.errors[ index ].reason,
            internalErrorCode: error.data.errors[ index ].code
        };
    };
    
    private getMultipleErrorResponse = ( pattern: RegExp, hasReason: boolean, error: CommonsErrorsModel.ErrorDataGeneral ): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
        if ( hasReason ) {
            return this.getMultipleErrorWithReason( pattern, error );
        } else {
            return this.processGeneralError( error );
        }
    };
}