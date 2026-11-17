import { environment } from '../config/angular-environments/environment';

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
import './lazy-loading/js-application';

/** INIT ANGULAR PROJECT */

import { IbCheckinAppModule } from './ib-checkin-app.module';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


if (environment.production) {
    enableProdMode();
}


platformBrowserDynamic().bootstrapModule(IbCheckinAppModule);
