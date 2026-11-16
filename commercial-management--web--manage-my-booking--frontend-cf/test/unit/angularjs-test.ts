import 'core-js/stable';
import 'src/polyfills';

/** DEPENDENCIES LEGACY */
import jQuery from 'jquery';
declare global {
    interface Window {
        $: any;
        humanizeDuration: any;
        RecoglobickActivitiesMmbWidget: any;
        RecoglobickTransfersMmbWidget: any;
    }
}
window.RecoglobickActivitiesMmbWidget;
window.RecoglobickTransfersMmbWidget;
// FIxes an error with ibdc in local
window.$ = jQuery;
import 'bootstrap/dist/js/bootstrap.js';
import 'angular';
import 'angular-aria';
import 'angular-animate';
import 'angular-bind-html-compile';
import 'angular-cookies';
import 'angular-credit-cards';
import 'angular-dynamic-locale';
import 'angular-local-storage';
import 'angular-messages';
import 'angular-recaptcha';
import 'angular-route';
import 'angular-sanitize';
import 'angular-scroll';
import 'slick-carousel';
import 'angular-slick-carousel'; //depends on slick-carousel
import 'angular-translate';
import 'angular-translate-loader-partial';
import 'angular-translate-loader-static-files';
import 'angular-ui-bootstrap';
import 'angular-utf8-base64';
import 'angularjs-slider';
import 'bootstrap-tabdrop/build/js/bootstrap-tabdrop.min.js';
import humanizeDuration from 'humanize-duration';
window.humanizeDuration = humanizeDuration;
import 'jquery-placeholder';
import 'jquery.cookie';
import 'jquery.ioslist/dist/js/jquery.ioslist';
import 'dayjs';
import 'ng-combo-date-picker';
import 'ng-device-detector';
import 'ng-infinite-scroll/build/ng-infinite-scroll';
import 'malihu-custom-scrollbar-plugin';
import 'ng-scrollbars'; //depends on malihu-scrollbar-plugin
import 'rx-angular';
//import 'selectize/dist/js/standalone/selectize';
import 'ui-select';


/** LIBRARIES */
import 'src/decorators';
import 'ib-web-commons';
import 'ib-menus';
import 'ib-web-payments';
import 'ib-web-ancillaries';


/** APP */
import 'src/ib-MmB-templates';
import 'src/app/core';
import 'src/ib-MmB-app';
import 'src/ib-MmB-constants';
import 'src/components/decorators';
import 'src/ib-MmB-app-config';
import 'src/components/filters';
import 'src/components/utils';
import 'src/components/ib-MmB-booking-dashboard';
import 'src/components/ib-MmB-booking-management';
import 'src/components/ib-MmB-bookings-list';
import 'src/components/ib-MmB-change-flight';
import 'src/components/ib-MmB-communication-lost';
import 'src/components/ib-MmB-flexibilization';
import 'src/components/ib-MmB-flight-confirmation';
import 'src/components/ib-MmB-passengers-info';
import 'src/components/ib-MmB-search';
import 'src/components/ib-Mmb-rebook-error';
import 'src/components/ib-disruption-main';
import 'src/components/ib-reusable-components';
import 'src/components/routing';
import 'src/components/services';
import 'src/components/transformers';

/** TESTS */
import 'angular-mocks';
import angular from 'angular';


// Then we find all the tests.
const context = import.meta.webpackContext(
    'src/app/',
    { recursive: true, regExp: /-test\.[jt]s$/ }
);
// And load the modules.
context.keys().map(context);
