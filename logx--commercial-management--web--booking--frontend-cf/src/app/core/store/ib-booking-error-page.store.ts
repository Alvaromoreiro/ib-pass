import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { downgradeToAJSService } from 'ib-web-commons/utils';

/**
 * Enumeration defining the different types of errors that can occur in the booking process.
 * Used to categorize and differentiate error handling behavior.
 */
export enum ErrorType {
    /** Error related to flight availability or booking availability */
    AVAILABILITY = 'availability',
    /** Error related to ribbon or banner notifications */
    RIBBON = 'ribbon',
    /** Error related to Akamai security restrictions */
    SECURITY_AKAMAI = 'security_akamai'
}

/**
 * Interface representing a generic booking error with type discrimination.
 * Centralizes all error properties and uses the type field to differentiate between error categories.
 */
export interface BookingError {
    /** The type of error (availability or ribbon) */
    type: ErrorType;
    /** Optional error message to display to the user */
    message?: string;
    /** Internal system error code for debugging and logging */
    internalErrorCode?: string;
    /** HTTP or system error code */
    errorCode?: string | number;
    /** Whether the error should be visible in the UI */
    visible?: boolean;
    requestURL?: string;
    /** Structured error content provided by backend for UI rendering.*/
    details?: {
        title: string;
        body: string[];
    };
}
export type BookingErrorState ={
    [key in ErrorType]?: BookingError;
};
/**
 * Angular service that manages error states for the booking error page.
 * Provides reactive state management for availability and ribbon errors,
 * as well as current flow information retrieved from the root store.
 * 
 * @example
 * ```typescript
 * constructor(private errorStore: BookingErrorPageStore) {
 *   this.errorStore.availabilityError$.subscribe(error => {
 *     // Handle availability error changes
 *   });
 * }
 * ```
 */
@Injectable({
    providedIn: 'root'
})
export class BookingErrorPageStore {
    
    /** Private BehaviorSubject for managing availability error state */
    private bookingErrorSubject: BehaviorSubject<BookingErrorState | null> = new BehaviorSubject<BookingErrorState | null>(null);
    
    /** Observable stream of BookingErrors */
    public bookingErrors$: Observable<BookingErrorState | null> = this.bookingErrorSubject.asObservable();
    
    constructor () {
    }
 
        
    /**
     * Sets an error of the specified type.
     * If null is passed, clears the current error of that type.
     * @param type - The type of error to set (AVAILABILITY or RIBBON)
     * @param error - The error data (without type) or null to clear
     */
    public setError (type: ErrorType, error: Partial<BookingError> | null): void {

        if (error) {
            const typedError: BookingError = {
                ...error,
                type
            };
            const currentErrors = this.bookingErrorSubject.getValue() || {} as {[key in ErrorType]: BookingError};
            const updatedErrors = {
                ...currentErrors,
                [type]: typedError
            };
            this.bookingErrorSubject.next(updatedErrors);
        }
        if (error === null) {
            const currentErrors = this.bookingErrorSubject.getValue();
            if (currentErrors) {
                const { [type]: removed, ...remainingErrors } = currentErrors;
                const response =Object.keys(remainingErrors).length > 0 ? remainingErrors : null;
                this.bookingErrorSubject.next(response);
            }
        }
    }
    
    /**
     * Clears an error of the specified type by setting it to null.
     * @param type - The type of error to clear (AVAILABILITY or RIBBON)
     */
    public clearError (type: ErrorType): void {
        this.setError(type, null);
    }
        
    
    /**
     * Gets an error by its specific type.
     * @param type - The error type to retrieve
     * @returns The error of the specified type or null if none exists
     */
    public getErrorByType (type: ErrorType): BookingError | null {
        return this.bookingErrorSubject.getValue()?.[type] || null;
    }
    
    /**
     * Checks if there are any active errors (availability or ribbon).
     * @returns True if any error exists, false otherwise
     */
    public hasAnyError (): boolean {
        return !!this.bookingErrorSubject.getValue();
    }
    
    /**
     * Retrieves all current errors as an array.
     * @returns An array of all current BookingErrors
     */
    public getAllErrors (): BookingError[] {
        const errors = this.bookingErrorSubject.getValue();
        return errors ? Object.values(errors) : [];
    }
    
    /**
     * Checks if an error of a specific type exists.
     * @param type - The error type to check for
     * @returns True if an error of the specified type exists, false otherwise
     */
    public hasErrorOfType (type: ErrorType): boolean {
        return !!this.getErrorByType(type);
    }
    
    /**
     * Clears all errors (both availability and ribbon).
     * Convenient method to reset the error state completely.
     */
    public clearAllErrors (): void {
        this.clearError(ErrorType.AVAILABILITY);
        this.clearError(ErrorType.RIBBON);
    }
}

downgradeToAJSService('BookingErrorPageStore', BookingErrorPageStore, 'ib-booking-root-module', []);
