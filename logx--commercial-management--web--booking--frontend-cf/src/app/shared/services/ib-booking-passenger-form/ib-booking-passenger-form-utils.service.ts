import { Injectable } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';


@Injectable({
    providedIn: 'root'
})
export class IbBookingPassengerFormUtilsService {

    constructor () { }

    getOptionalDocsArray (passenger: any): any[] {
        const rawDocs = passenger?.optionalDocs;

        if (Array.isArray(rawDocs)) {
            return rawDocs;
        }
        if (rawDocs && typeof rawDocs === 'object') {
            return Object.values(rawDocs);
        }
        return [];
    }

    cleanEdgeChars (value: string): string {
        if (!value) return value;
        return value.replace(/^[\s'-]+|[\s'-]+$/g, '');
    }

    filterByProperty (query: string, items: any[], propertyName: string): any[] {
        if (!Array.isArray(items)) {
            return [];
        }
        const lowerCaseQuery = query.toLowerCase();
        return items.filter(item =>
            item && typeof item[propertyName] === 'string' && item[propertyName].toLowerCase().includes(lowerCaseQuery)
        );
    }

    filterStringArray (query: string, items: string[]): any[] {
        if (!Array.isArray(items)) {
            return [];
        }
        const lowerCaseQuery = query.toLowerCase();
        return items.filter(item =>
            typeof item === 'string' && item.toLowerCase().includes(lowerCaseQuery)
        );
    }

    getMaxLengthMandatoryDocNumber (mandatoryDocCode: string): number {
        switch (mandatoryDocCode) {
                case 'RUC':
                    return BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_MANDATORY_DOC_RUC;
                case 'DN':
                    return BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_DNI;
                default:
                    return BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_MANDATORY_DOC;
        }
    }

    getMandatoryDocCleaner (code: string): string {
        const cleaners = BookingAppConstants.bookingPatterns;
        switch (code) {
                case 'RUC':
                    return cleaners.RUC_CLEANER;
                case 'NI':
                    return cleaners.NI_CLEANER;
                default:
                    return cleaners.DOCS_CLEANER;
        }
    }

    isDniCode (code?: string): boolean {
        const documentCodeInput = (code || '').toUpperCase();
        return documentCodeInput === 'DN' || documentCodeInput === 'DNI' || documentCodeInput === 'NIF';
    }

}