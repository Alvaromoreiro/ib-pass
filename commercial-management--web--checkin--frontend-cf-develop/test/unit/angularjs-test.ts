import 'core-js/stable';
import 'src/polyfills';

/** DEPENDENCIES LEGACY */
import jQuery from 'jquery';
declare global {
    interface Window {
        $: any;
        humanizeDuration: any;
        RecoglobickActivitiesWidget: any;
        RecoglobickTransfersWidget: any;
    }
}
// FIxes an error with ibdc in local
window.RecoglobickActivitiesWidget;
window.RecoglobickTransfersWidget;
window.$ = jQuery;
import 'bootstrap/dist/js/bootstrap.js';
import 'angular';
import 'angular-animate';
import 'angular-aria';
import 'angular-bind-html-compile';
import 'angular-cookies';
import 'angular-credit-cards';
import 'angular-local-storage';
import 'angular-messages';
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
import 'dayjs';
import 'ng-device-detector';
import 'ng-infinite-scroll/build/ng-infinite-scroll';
import 'malihu-custom-scrollbar-plugin';
import 'ng-scrollbars'; //depends on malihu-scrollbar-plugin
import 'rx-angular';
import 'sticky-kit/dist/sticky-kit';
import 'ui-select';


/** LIBRARIES */
import 'src/decorators';
import 'ib-web-commons';
import 'ib-menus';
import 'ib-web-payments';
import 'ib-web-ancillaries';


/** APP */
import 'src/ib-checkin-templates';
import '@pages/ib-web-ancillaries';
import '@core/constants';
import '@shared/http-services';
import '@shared/services';
import 'src/components/routing';
import 'src/components/filters';
import 'src/components/services';
import 'src/components/ib-reusable-components';
import 'src/components/ib-check-in-boarding-cards';
import 'src/components/ib-check-in-flight-now';
import 'src/components/ib-check-in-flights-des-invoice';
import 'src/components/ib-check-in-flights-passengers';
import 'src/components/ib-check-in-fly-now-confirmation-pa';
import 'src/components/ib-check-in-ib-plus';
import 'src/components/ib-check-in-search';
import 'src/components/ib-check-in-upgrade';
import 'src/components/ib-checkin-biometric-boarding';


/** TESTS */
import 'angular-mocks';


// Then we find all the tests.
const context = import.meta.webpackContext(
    './',
    { recursive: true, regExp: /-test\.[jt]s$/ }
);
// And load the modules.
context.keys().map(context);
