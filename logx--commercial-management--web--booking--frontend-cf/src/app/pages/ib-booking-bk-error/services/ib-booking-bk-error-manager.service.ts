import { Injectable } from '@angular/core';
import { BookingErrorPageStore, ErrorType } from '@src/app/core/store/ib-booking-error-page.store';



export interface BookingErrorPageConfiguration {
    message?: string;
    background?: string;
    internalErrorCode?: string;
    errorCode?: string | number;
    requestURL?: string;
    button?: string;
}

export interface BkErrorPageModel {
    [key: string]: BookingErrorPageConfiguration;
}

export interface IBkErrorPageHandler {
    type: ErrorType;
    canResolve(): boolean;
    resolve(): BkErrorPageModel;
}

@Injectable({ providedIn: 'root' })
export class BookingBkErrorPageManagerService {
    
    constructor (
        private bookingErrorPageStore: BookingErrorPageStore
    ) {}
    
    private handlers: IBkErrorPageHandler[] = [
        {
            type: ErrorType.SECURITY_AKAMAI,
            canResolve: () => this.bookingErrorPageStore.getErrorByType(ErrorType.SECURITY_AKAMAI) !== null,
            resolve: () => {
                const error = this.bookingErrorPageStore.getErrorByType(ErrorType.SECURITY_AKAMAI);
                return { [ErrorType.SECURITY_AKAMAI]: { message: 'IBBKERROR_TEXT_NAVIGATION_INTERRUPTED', button: 'IBBKERROR_TEXT_BUTTON_TITLE_RETURN', internalErrorCode: error.internalErrorCode, errorCode: error.errorCode, requestURL: error.requestURL, background: '/background/generico/403_error_default.jpg' } };
            }
        },
        {
            type: ErrorType.RIBBON,
            canResolve: () => this.bookingErrorPageStore.getErrorByType(ErrorType.RIBBON) !== null,
            resolve: () => {
                const error = this.bookingErrorPageStore.getErrorByType(ErrorType.RIBBON);
                return { [ErrorType.RIBBON]: { message: error.message, internalErrorCode: error.internalErrorCode, errorCode: error.errorCode, requestURL: error.requestURL } };
            }  
        },
        {
            type: ErrorType.AVAILABILITY,
            canResolve: () => this.bookingErrorPageStore.getErrorByType(ErrorType.AVAILABILITY) !== null,
            resolve: () => {
                const error = this.bookingErrorPageStore.getErrorByType(ErrorType.AVAILABILITY);
                return { [ErrorType.AVAILABILITY]: { message: error.message, internalErrorCode: error.internalErrorCode, errorCode: error.errorCode, requestURL: error.requestURL } };
            }
        }
       
    ];

    public registerHandler (handler: IBkErrorPageHandler): void {
        this.handlers.push(handler);
    }

    public getError (): BkErrorPageModel | null {
        
        const handler = this.handlers.find(h => h.canResolve());

        return handler ? handler.resolve() : null;
    }
}
