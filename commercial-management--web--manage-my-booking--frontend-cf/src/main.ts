import { environment } from '../config/angular-environments/environment';

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
window.RecoglobickActivitiesMmbWidget = null;
window.RecoglobickTransfersMmbWidget = null;
// FIxes an error with ibdc in local
window.$ = jQuery;
import './lazy-loading/js-application';

/** INIT ANGULAR PROJECT */

import { IbMmbAppModule } from './ib-mmb-app.module';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
if (environment.production) {
    enableProdMode();
}
platformBrowserDynamic().bootstrapModule(IbMmbAppModule);
