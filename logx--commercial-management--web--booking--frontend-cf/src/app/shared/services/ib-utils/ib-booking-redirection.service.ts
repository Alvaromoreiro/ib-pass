import { downgradeToAJSService, RedirectionService, AJSRootScope, CommonsRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BookingNavigationService } from './ib-booking-navigation.service';


export const angularjsLocation = new InjectionToken('$location');

function angularjsLocationFactory (i: { get: (a: string) => unknown }) {
    return i.get('$location');
}

export const angularjsLocationProvider = {
    provide: angularjsLocation,
    useFactory: angularjsLocationFactory,
    deps: ['$injector']
};

@Injectable({
    providedIn: 'root'
})
export class BookingRedirectionService extends RedirectionService {


    constructor (
    @Inject(AJSRootScope) rootScope: CommonsRootScope, 
        sessionStorageService: CommonsSessionStorageService,
        private BookingNavigationService: BookingNavigationService
    ) {
        super(rootScope, sessionStorageService);
    }

    /**
     * Returns current path of angularJS location
     */
    /**
     * Expose Booking Navigation Service Function to avoid injecting the service directly in AngularJS components
     */
    path  = this.BookingNavigationService.navigateTo;


}

downgradeToAJSService('BookingRedirectionService', BookingRedirectionService, 'ib-booking-services-module');
