import { Inject, Injectable } from '@angular/core';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { downgradeToAJSService } from 'ib-web-commons/utils/';

@Injectable({providedIn: 'root'})
export class UrlUtilsService {
    constructor (
        @Inject(WINDOW_TOKEN) private Window: Window
    ) { }
    
    /**
     * Returns the value of the first param found
     * @param  {string[]} paramsName - An array with the possible names of an URL param
     * @returns {string} - The value of the first param found in the array
     */
    public getURLFirstParameterByName = ( paramsName: string[] | string ): string  | null => {
        const searchParamsMap = new URLSearchParams( this.Window.location.search );
        if ( Array.isArray( paramsName ) ) {
            const validParams = paramsName.filter( paramName => this.isString( paramName ) );
            const passengerCount = this.extractPassengerCount( validParams, searchParamsMap );
            if ( passengerCount !== null ) {
                return passengerCount;
            }
            return this.findParamValue( validParams, searchParamsMap );
        }
        if ( this.isString( paramsName ) ) {
            return this.getParameterByName( paramsName, searchParamsMap );
        }
        return null;
    };
    

    private getParameterByName = ( name: string, params: URLSearchParams ): string | null => {
        const result = params.get( name ) ?? '';
        if ( result.length === 0 ) return null;
        return result;
    };

    private extractPassengerCount = ( paramsName: string[], params: URLSearchParams ): string | null => {
        let countPassenger = null;
        for ( const paramName of paramsName ) {
            if ( this.isPassengerParam( paramName ) ) {
                countPassenger = countPassenger || 0;
                const paramValue = this.getParameterByName( paramName, params );
                if ( paramValue ) {
                    countPassenger += parseInt( paramValue, 10 );
                }
            }
        }
        return countPassenger !== null ? countPassenger.toString() : null;
    };

    private isPassengerParam = ( paramName: string ): boolean => {
        return BookingAppConstants.BOOKING_PARAMS_NAMES.ADULT.indexOf( paramName ) !== -1 ||
            BookingAppConstants.BOOKING_PARAMS_NAMES.CHILD.indexOf( paramName ) !== -1 ||
            BookingAppConstants.BOOKING_PARAMS_NAMES.INFANT.indexOf( paramName ) !== -1 ||
            BookingAppConstants.BOOKING_PARAMS_NAMES.SENIOR.indexOf( paramName ) !== -1 ||
            BookingAppConstants.BOOKING_PARAMS_NAMES.YOUNG.indexOf( paramName ) !== -1 ||
            BookingAppConstants.BOOKING_PARAMS_NAMES.TEENAGER.indexOf( paramName ) !== -1;
    };

    private findParamValue = ( paramsName: string[], params: URLSearchParams ): string | null => {
        for ( const paramName of paramsName ) {
            const paramValue = this.getParameterByName( paramName, params );
            if ( paramValue ) {
                return paramValue;
            }
        }
        return null;
    };
    
    private isString = ( value: unknown ): value is string => {
        return typeof value === 'string';
    };
}
downgradeToAJSService('UrlUtilsService', UrlUtilsService, 'ib-booking-services-module');