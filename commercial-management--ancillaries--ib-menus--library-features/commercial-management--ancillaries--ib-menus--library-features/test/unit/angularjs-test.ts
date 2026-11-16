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

/** ANGULARJS */
import 'angular';
import 'angular-translate';
import 'angular-cookies';
import 'angular-local-storage';
import 'angular-aria';
import 'angular-ui-bootstrap';
import 'angular-messages';
import 'angular-sanitize';
import 'rx-angular';
import 'rxjs';
import 'src/decorators';
import 'src/app/core';
import 'src/app/features';
import 'src/components';
import 'src/app/shared';
import 'src/ib-web-menus-module';

/** ANGULAR **/
export * from 'src/ib-menus-app.module';

/** COMMONS TEST DOUBLE */
import 'ib-web-commons';

/** TESTS */
import 'angular-mocks';


// Then we find all the tests.
const context = require.context('./app/', true, /-test\.js$/);
// And load the modules.
context.keys().map(context);
