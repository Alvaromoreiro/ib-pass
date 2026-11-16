import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils'; 

@Service('ib-booking-services-module', [
    'IbCommonsNewHttpUtilService', '$injector'
], [])
export class BookingHttpUtilsServiceLegacy {
    constructor (
        private IbCommonsNewHttpUtilService,
        private $injector: ng.auto.IInjectorService){ }

    public refreshToken = async () => {
        return this.IbCommonsNewHttpUtilService.refreshToken(this.$injector);
    };
}
export const AJSBookingHttpUtilsServiceLegacy= new InjectionToken('BookingHttpUtilsServiceLegacy');
export const AJSBookingHttpUtilsServiceLegacyProvider = upgradeAJSServiceProvider('BookingHttpUtilsServiceLegacy', AJSBookingHttpUtilsServiceLegacy);