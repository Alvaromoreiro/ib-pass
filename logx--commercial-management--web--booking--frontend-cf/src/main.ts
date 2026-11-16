import { environment } from '../config/angular-environments/environment';

/** DEPENDENCIES LEGACY */
import jQuery from 'jquery';
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

/** INIT ANGULAR PROJECT */
import './js-application';

import { IbBookingAppModule } from './ib-booking-app.module';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


if (environment.production) {
    enableProdMode();
}


platformBrowserDynamic().bootstrapModule(IbBookingAppModule);
