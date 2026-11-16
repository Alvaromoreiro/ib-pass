import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { IbMmbSearchNewComponent } from './ib-MmB-search-new.component';
import { AJSBookingSearchServiceProvider } from '../services/upgraded/ib-booking-search-service-bridge.service';
import { AJSCommonsCheckLoginWCSServiceProvider } from '../services/upgraded/ib-commons-check-login-wcs-bridge.service';
import { AJSMmBSearchServiceProvider } from '../ib-MmB-search/services/upgraded/ib-MmB-search-service-bridge.service';

const downgradedComponents = [
    IbMmbSearchNewComponent
];

@NgModule({
    imports: [
        BrowserModule,
        TranslateModule,
    ],
    declarations: [
        ...downgradedComponents,
    ],
    exports: [

    ],
    providers: [
        AJSBookingSearchServiceProvider,
        AJSCommonsCheckLoginWCSServiceProvider,
        AJSMmBSearchServiceProvider
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class IbMmbSearchNewModule  {
	static components = [...downgradedComponents];
}
