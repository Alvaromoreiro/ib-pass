
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IbBookingHeaderComponent } from './ib-booking-header.component';
import { IbBookingGreyBarComponent } from './components/ib-booking-grey-bar/ib-booking-grey-bar.component';
import { IbUserInfoHeaderComponent } from './components/ib-user-info-header/ib-user-info-header.component';
import { IbCPipeModule } from 'ib-web-commons/pipes';
import { IbUiLoginIframeComponentDirective } from './components/upgraded/ib-ui-login-iframe.component';
import { IbBookingHeaderMainComponent } from './components/ib-booking-header-main/ib-booking-header-main.component';
import { IbBookingHeaderSimpleComponent } from './components/ib-booking-header-simple/ib-booking-header-simple.component';
import { IbBookingHeaderCompleteComponent } from './components/ib-booking-header-complete/ib-booking-header-complete.component';
import { IbBookingHeaderPassengersComponent } from './components/ib-booking-header-passengers/ib-booking-header-passengers.component';
import { IbBookingHeaderTripComponent } from './components/ib-booking-header-trip/ib-booking-header-trip.component';
import { IbBookingHeaderMultitripComponent } from './components/ib-booking-header-multitrip/ib-booking-header-multitrip.component';
import { IbBookingHeaderMultitripTooltipComponent } from './components/ib-booking-header-multitrip-tooltip/ib-booking-header-multitrip-tooltip.component';
import { IbBookingHeaderInfoTooltipComponent } from './components/ib-booking-header-flightinfo-tooltip/ib-booking-header-info-tooltip.component';
import { IbBookingHeaderUserTooltipComponent } from './components/ib-booking-header-user-tooltip/ib-booking-header-user-tooltip.component';
import { IbBookingHeaderLoginMobileComponent } from './components/ib-booking-header-login-mobile/ib-booking-header-login-mobile.component';
import { IbBookingHeaderBasketModule } from './components/ib-booking-header-basket/ib-booking-header-basket.module';
import { AJSCabinTypesServiceProvider } from './services/upgraded/ib-cabing-types-bridge.service';
import { AJSGetSpecialPassengerOriginDestinationListServiceProvider } from './services/upgraded/ib-get-special-passenger-origin-destination-list-bridge.service';
import { AJSCommonsAncillariesServiceProvider } from './services/upgraded/ib-commons-ancillaries-bridge.service';
import { IbBookingCitySelectorModule } from './components/ib-booking-header-seeker/components/ib-boking-city-selector/ib-booking-city-selector.module';
import { ibHeaderSeekerComponentDirective } from './components/ib-booking-header-seeker/ib-header-seeker-legacy.component';
import { IbBookingHeaderMobileComponent } from './components/ib-booking-header-mobile/ib-booking-header-mobile.component';
import { IbBookingSharedModule } from '../../ib-booking-shared.module';
import { IbBookingHeaderStepsModule } from './components/ib-booking-steps/ib-booking-steps.module';
import { IbBookingHeaderPassengerSelectorComponent } from './components/ib-booking-header-passenger-selector/ib-booking-header-passenger-selector.component';
import { IbBookingHeaderPetsComponent } from './components/ib-booking-header-pets/ib-booking-header-pets.component';
const downgradedComponents = [
    IbBookingHeaderComponent,
    IbBookingHeaderPassengerSelectorComponent
    
];
const upgradedProviders = [
    AJSCabinTypesServiceProvider,
    AJSGetSpecialPassengerOriginDestinationListServiceProvider,
    AJSCommonsAncillariesServiceProvider
];
const upgradedComponents = [
    IbUiLoginIframeComponentDirective,
    ibHeaderSeekerComponentDirective
];
@NgModule({
    imports: [
        TranslateModule,
        FormsModule,
        CommonModule,
        IbBookingSharedModule,
        IbCPipeModule,
        IbBookingHeaderBasketModule,
        IbBookingHeaderStepsModule,
        IbBookingCitySelectorModule
    ],
    exports: [
        IbBookingHeaderComponent,
        IbBookingHeaderSimpleComponent
    ],
    declarations: [
        ...downgradedComponents,
        ...upgradedComponents,
        IbBookingGreyBarComponent,
        IbUserInfoHeaderComponent,
        IbBookingHeaderMainComponent,
        IbBookingHeaderSimpleComponent,
        IbBookingHeaderCompleteComponent,
        IbBookingHeaderPassengersComponent,
        IbBookingHeaderTripComponent,
        IbBookingHeaderMultitripComponent,
        IbBookingHeaderMultitripTooltipComponent,
        IbBookingHeaderInfoTooltipComponent,
        IbBookingHeaderUserTooltipComponent,
        IbBookingHeaderLoginMobileComponent,
        IbBookingHeaderMobileComponent,
        IbBookingHeaderPassengerSelectorComponent,
        IbBookingHeaderPetsComponent
    ],
    providers: [
        ...upgradedProviders
    ]
})
export class IbBookingHeaderModule {
    static components = [...downgradedComponents];
}
