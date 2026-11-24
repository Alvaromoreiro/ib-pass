namespace httpErrorManagment {
    export type errorObject = {
        errorCode: number,
        actualAttemps: number,
        paymentMethodCallback: (n: any) => any,
        message: string,
        needsTranslate: boolean,
        internalErrorCode: string,
        url?: string,
        submessage?: string
    };
    export type newPaymentOptionsInfo = {
        title: string,
        subtitle: string,
        message: string,
        showbuttons: showbuttonsType,
        idModal?: string,
        submessage?: string
    };
    export type showbuttonsType = {
        accept?: buttonsType,
        cancel?: buttonsType,
        onHold?: buttonsType
    };
    export type buttonsType = {
        status?:  boolean,
        text?: string,
        accessibleText?: string
    };
    export type formData = {
        type: string,
        baseVersion: string,
        provider: string,
        target: string,
        redirectURL?: string,
        redirectUrl ?: string,
        component?: {
            token?: string,
            type?: string,
            url?: string
        }
    };
}