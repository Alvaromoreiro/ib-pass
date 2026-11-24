import jQuery from 'jquery';
declare global {
    interface Window {
        $: any;
    }
}
//@ts-ignore
//window.jQuery = jQuery;

// FIxes an error with ibdc in local
window.$ = jQuery;

import 'angular';
import 'angular-local-storage';
import 'angular-route';

import 'angular-cookies';

import 'angular-translate';
import 'bootstrap-tabdrop/build/js/bootstrap-tabdrop.min.js';
import 'dayjs';
import 'ib-web-commons';

/** ANGULARJS */
import 'src/decorators';
import 'src/styles/ib-pmt-styles-host';
import 'src/ib-pmt-app-module';
import 'src/components/ib-payments/cmpnts';
import 'src/app/core';
import 'src/app/feature';
import 'src/app/shared';

/** ANGULAR **/
export * from 'src/ib-payments-app.module';

/** TESTS */
import 'angular-mocks';
