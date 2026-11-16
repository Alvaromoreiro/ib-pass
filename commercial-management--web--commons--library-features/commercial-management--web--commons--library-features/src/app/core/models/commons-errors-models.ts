namespace CommonsErrorsModel {
    export type ErrorDataGeneral = {
        errorCode?: number;
        data?: ErrorDataGeneralData;
        requestURL?: string;
        config?:any;
    };
    export type ErrorDataGeneralData = {
        errors?: ErrorDataGeneralDataErrors[];
        error?: ErrorDataGeneralDataErrors;
        paymentOptions?: string;
        newMmBMarket?: string;
        newBookingMarket?: string;
        checkinId?: string;
        id?: number;
    };
    export type ErrorDataGeneralDataErrors = {
        reason: string;
        code: string;
        errorDescription?: string;
        errorCode?: string;
    };
    export type ErrorDataGeneralResponse = {
        errorCode: number;
        message: string;
        needsTranslate: boolean;
        internalErrorCode: string;
    };
    export type CommonsNewMarketError = {
        errorCode: number;
        internalErrorCode: string;
        data: {
            error: {
                errorDescription: string;
                errorCode: string;
            }
            newBookingMarket: string;
        };
    };
    export type CommonsNerMarketErrorResponse = {
        errorCode: number;
        message: string;
        needsTranslate: boolean
        internalErrorCode: string;
        newBookingMarket: string;
    };
    export type CommonsErrorsResponseGeneral = {
        message?: string;
        needsTranslate: boolean;
        paymentStatus?: boolean;
        internalErrorCode?: string;
        paymentOptions?: string;
        errorCode: number;
        data?: ErrorDataGeneralData;
        status?: number;
        messageList?: CommonsErrorMessageList[];
        requestURL?: string;
        config?:any;
        ids?: any[];
    };
    export type CommonsErrorsDataGeneral = {
        message: string;
        needsTranslate: boolean;
        paymentStatus?: boolean;
        internalErrorCode?: string;
        paymentOptions?: string;
        errorCode?: number;
    };
    export type CommonsErrorsPaymentData = {
        errorCode?: number
        data: CommonsErrorsPaymentDataErrors
    };
    export type CommonsErrorsPaymentDataErrors = {
        error: ErrorDataGeneralDataErrors;
    };
    export type CommonsErrorMessageList = {
        message: string;
        internalErrorCode: string;
    };

    export interface IManageError {
        action(error: ErrorDataGeneralDataErrors): void;
    }

    export class CommonsManageError implements IManageError {
        action = (error: ErrorDataGeneralDataErrors) => {
            throw Error(error.reason);
        };
    }
    export interface CommonsErrorsResponseMarket extends CommonsErrorsResponseGeneral {
        newMmBMarket?: string;
        newBookingMarket?: string
    }

    export type ErrorResponseSF = {
        errors: GenericErrorSF[];
    };

    export type GenericErrorSF = {
        code: string;
        reason: string;
        timeStamp: string;
    };
    
    export type ErrorCheckFF = {
        status: boolean;
        internalErrorCode?: string;
        message?: string;
        passengerIDs: number[];
    };
}