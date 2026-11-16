/** DEPENDENCIES LEGACY */
import jQuery from 'jquery';
import angular from 'angular';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import 'angular-animate';
import 'angular-aria';
import 'angular-bind-html-compile';
import 'angular-cookies';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-daterangepicker/daterangepicker';
import 'angular-daterangepicker';
import 'angular-dynamic-locale';
import 'angular-local-storage';
import 'angular-messages';
import 'angular-route';
import 'angular-sanitize';
import 'angular-scroll';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'angular-ui-date'; // Can't resolve 'jquery-ui/datepicker' -> resolved in webpack alias
import 'angularjs-slider';
import 'bootstrap-tabdrop/build/js/bootstrap-tabdrop.min.js';
import 'components-jqueryui';

import dayjs from 'dayjs';
import 'ng-device-detector';
import 'rx-angular';
import 'ui-select';
import 'ng-infinite-scroll/build/ng-infinite-scroll';
import 'lodash-es';
import customParseFormat from 'dayjs/plugin/customParseFormat';
declare global {
    interface Window {
        $: any;
        jQuery: any;
        humanizeDuration: any;
        RecoglobickActivitiesWidget: any;
        RecoglobickTransfersWidget: any;
    }
}
window.RecoglobickActivitiesWidget;
window.RecoglobickTransfersWidget;

// FIxes an error with ibdc
window.$ = jQuery;

const storageService = new StorageServiceMock();
dayjs.extend(customParseFormat);

angular
    .module('ib-commons-utils-module')
    .factory('CommonsSessionStorageService', () => storageService)
    .factory('localStorageService', () => storageService);

beforeEach(() => {
    storageService.clearAll();
});




/** LIBRARIES */
import 'src/decorators';
import 'ib-web-commons';
//import 'ib-web-payments';
//import 'ib-web-ancillaries';


/** APP */
import 'src/ib-booking-templates';
import 'src/ib-booking-app';
import '@pages/ib-not-availability/lazyImports';
import '@pages/ib-booking-price-matrix/lazyImports';
import '@pages/ib-booking-passenger-info/lazyImports';
import '@pages/ib-booking-redirection-market/lazyImports';
import '@pages/ib-shuttle/lazyImports';
import '@pages/ib-loading-redirection/lazyImports';
import '@pages/ib-booking-ancillaries/lazyImports';
import '@src/app/core/constants/ib-ancillaries-constants';
import '@src/app/core/config/ib-booking-app-config';
import '@src/app/core/constants/ib-booking-constants';
import 'src/app/pages';
import 'src/app/core';
import 'src/app/shared';
import 'test/unit/components';

/** TESTS */
import 'angular-mocks';

