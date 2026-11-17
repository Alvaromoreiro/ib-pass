import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSFlightsPassengersServiceToken = new InjectionToken<any> ('FlightsPassengersService');
export const AJSFlightsPassengersServiceTokenProvider = upgradeAJSServiceProvider( 'FlightsPassengersService', AJSFlightsPassengersServiceToken );

export interface FlightsPassengersServiceType {
    searchFlightsAndPassengers: () => any;
    checkAvailabilitySeatsPassengers: () => angular.IPromise<boolean>;
    getWCSPhones: () => any;
    getAlternativeContactData: () => any;
    updateContactDetails: ( reqContactData ) => any;
    updateMember: ( reqContactData ) => any;
    updateAlternativeContact: ( reqContactData ) => any;
    getContactData: () => any;
}
