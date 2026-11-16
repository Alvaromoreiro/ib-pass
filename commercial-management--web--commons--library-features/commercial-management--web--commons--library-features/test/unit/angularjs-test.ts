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
import 'angular-aria';
import 'angular-local-storage';
import 'angular-cookies';
import 'angular-ui-bootstrap';
import 'angular-translate';
import 'angular-messages';
import 'angular-sanitize';
import 'src/decorators';
import 'ib-web-commons/constants';
import 'src/app/core/ib-content-parser';
import 'src/app/core/ib-datalayer';
import 'src/app/core/proxies';
import 'ib-web-commons/proxies';
import 'src/app/core/ib-modal';
import 'src/app/core/directives';
import 'src/app/core/filters';
import 'src/app/core/utils';
import 'ib-web-commons/utils';
import 'src/app/core/http-services';
import 'src/app/core/interceptor';
import 'src/app/core/ib-keep-alive';
import 'src/app/core/ib-login';
import 'src/app/core/ib-monetate';
import 'src/app/core/preconditions';
import 'src/app/core/ui-components';
import 'src/app/core/models';

/** TESTS */
import 'angular-mocks';

// Then we find all the tests.
const context = import.meta.webpackContext(
    './',
    { recursive: true, regExp: /-test\.[jt]s$/ }
);// And load the modules.
context.keys().map(context);
