import 'angular';
import './app/core/store/ib-booking-root.store';
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

import 'dayjs';
import 'ng-device-detector';
import 'rx-angular';
import 'ui-select';
import 'ng-infinite-scroll/build/ng-infinite-scroll';
import 'lodash-es';
import 'oclazyload';



/** LIBRARIES */
import './decorators';
import 'ib-web-commons';
// import 'ib-web-payments';
// import 'ib-web-ancillaries';

/** APP */
import './ib-booking-templates';
import './ib-booking-app';
import './app/core/config/ib-booking-app-config';
import './app/core/constants/ib-booking-constants';
import './app/pages';
import './app/core';
import './app/shared';

