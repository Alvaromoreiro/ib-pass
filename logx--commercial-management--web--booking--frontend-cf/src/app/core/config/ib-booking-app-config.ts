
import { IB_BOOKING_TRANSLATIONS } from '@src/app/core/services/ib-booking-translate-factory.service';
import * as angular from 'angular';

    
angular.module('ib-booking-app').factory('literalBridgeProvider', ()=> {
    return  (options)=> {
        const translations =IB_BOOKING_TRANSLATIONS[options.key];
        return Promise.resolve(translations); 
           
    };
});
    

angular.module('ib-booking-app').config(BookingAppConfig);

BookingAppConfig.$inject = ['BookingAppConstants', '$translateProvider', '$httpProvider', 'uiSelectConfig', '$compileProvider', '$qProvider', 'tmhDynamicLocaleProvider'];
function BookingAppConfig () {
    const [BookingAppConstants, $translateProvider, $httpProvider, uiSelectConfig, $compileProvider, $qProvider, tmhDynamicLocaleProvider ] = arguments;
    $translateProvider.useLoader('literalBridgeProvider');
    $translateProvider.useSanitizeValueStrategy('escaped');

    tmhDynamicLocaleProvider.localeLocationPattern(BookingAppConstants.localeRoute + '/locale_{{locale}}.js');

    $httpProvider.interceptors.push('IbHttpInterceptor');
    uiSelectConfig.theme = 'bootstrap';
    $compileProvider.debugInfoEnabled(!BookingAppConstants.production);
    $qProvider.errorOnUnhandledRejections(!BookingAppConstants.production);
    $httpProvider.defaults.withCredentials = true;
}
