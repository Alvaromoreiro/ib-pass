import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IbBookingAvailabilityPageComponent } from './ib-booking-availability-page.component';
import { IbBookingAvailabilityLegacyDirective } from './components/ib-booking-availability-legacy/ib-booking-availability-legacy.component';
import { AJSIbBookingAvailabilityPageServiceProvider } from './services/ib-booking-availability-page-utils-bridge.service';
import { IbBookingSlicedAvailabilityComponent } from './components/ib-booking-sliced-availability/ib-booking-sliced-availability.component';
import { IbBookingSelectedOutboundFlightComponent } from './components/ib-booking-sliced-availability/components/ib-booking-selected-outbound-flight/ib-booking-selected-outbound-flight.component';
import { IbBookingLocalDiscountSelectorDirective } from './components/ib-booking-availability-legacy/components/ib-booking-local-discunts-selector/ib-booking-local-discount-selector.component';
import { AJSBookingAvailabilityTransformerProvider } from '@shared/services/ib-booking-availability/transformers/ajs-upgrade/ib-booking-availability-transformer-bridge.service';
import { AJSSlicedAvailabilityDataTransformerProvider } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/services/ib-availability-data-transformer-bridge.service';
import { AJSIbBookingAvailabilityUtilsServiceProvider } from '@src/app/shared/services/ib-booking-availability/ib-booking-availability-utils.service.bridge';
import { AJSIbOriginDestinationInfoUtilsServiceProvider } from '@src/app/shared/services/ib-booking-availability/upgraded/ib-origin-destination-info-utils-service-bridge.service';
import { IbBookingAvailabilitySliceInfoLegacyDirective } from './components/ib-booking-availability-legacy/components/ib-booking-slice-info/upgraded/ib-booking-slice-info-legacy.component';
import { IbBookingSlicedUpsellingComponent } from './components/ib-booking-sliced-availability/components/ib-booking-sliced-upselling/ib-booking-sliced-upselling-fare.component';
import { IbBookingSharedModule } from '@shared/ib-booking-shared.module';
import { IbPartnersAccordionComponent } from './components/ib-booking-sliced-availability/components/ib-partners-accordion/ib-partners-accordion.component';
import { IbBookingMobileRibbonModule } from './components/ib-booking-sliced-availability/components/ib-booking-mobile-ribbon/ib-mobile-ribbon.module';
import { IbBookingMobileSliceInfoModule } from './components/ib-booking-sliced-availability/components/ib-booking-mobile-slice-info/ib-booking-mobile-slice-info.module';
import { IbBookingAvailabilityCommonModule } from './components/ib-booking-sliced-availability/components/common/ib-booking-availability-common.module';
import { IbMainFooterModule } from '@src/app/shared/components/ib-main-footer/ib-main-footer.module';
import { IbBookingSlicedAvailabilityTripComponent } from './components/ib-booking-sliced-availability/components/ib-booking-sliced-availability-trip/ib-booking-sliced-availability-trip.component';
import { IbBookingTripInfoLegacyDirective } from './components/ib-booking-availability-legacy/components/ib-booking-trip-info/upgrade/ib-booking-trip-info-legacy.component';
const downgradedComponents = [
    IbPartnersAccordionComponent
];
const upgradedProviders = [
    AJSIbBookingAvailabilityPageServiceProvider,
    AJSBookingAvailabilityTransformerProvider,
    AJSSlicedAvailabilityDataTransformerProvider,
    AJSIbBookingAvailabilityUtilsServiceProvider,

    AJSIbOriginDestinationInfoUtilsServiceProvider
];
@NgModule({
    declarations: [
        ...downgradedComponents,
        IbBookingAvailabilityPageComponent,
        IbBookingAvailabilityLegacyDirective,
        IbBookingSlicedAvailabilityComponent,
        IbBookingSelectedOutboundFlightComponent,
        IbBookingLocalDiscountSelectorDirective,
        IbBookingAvailabilitySliceInfoLegacyDirective,
        IbBookingSlicedUpsellingComponent,
        IbBookingSlicedAvailabilityTripComponent,
        IbBookingTripInfoLegacyDirective
    ],
    imports: [
        IbMainFooterModule,
        TranslateModule,
        FormsModule,
        CommonModule,
        IbBookingSharedModule,
        IbBookingMobileRibbonModule,
        IbBookingAvailabilityCommonModule,
        IbBookingMobileSliceInfoModule
    ],
    providers: [
        ...upgradedProviders
    ]
})
export class IbBookingAvailabilityPageModule{
    static components = [...downgradedComponents];
}

