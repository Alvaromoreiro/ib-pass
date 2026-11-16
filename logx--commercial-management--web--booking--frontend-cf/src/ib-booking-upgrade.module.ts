import { NgModule, Provider } from '@angular/core';
import { AJSCurrencyServiceProvider } from 'ib-web-commons/utils';
import { AJSBookingAvailabilityServiceProvider } from './app/pages/ib-booking-availability-page/services/ib-booking-availability-service.bride.service';
import { AJSBookingPassengerInfoServiceProvider } from './app/pages/ib-booking-passenger-info/services/ib-booking-passenger-info-service-bridge.service';
import { AJSBookingModalServiceProvider } from './app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { AJSDatalayerBKIServiceProvider } from './app/shared/services/ib-datalayer/services/ib-datalayer-bki-service-bridge.service';
import { AJSDatalayerUtilsServiceProvider } from './app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { AJSMonetateUtilsProvider } from './app/shared/services/ib-monetate/upgraded/ib-monetate-utils-bridge.service';
import { angularjsLocationProvider } from './app/shared/services/ib-utils/ib-booking-redirection.service';
import { AJSBookingPassengerInfoTransformerProvider } from './app/pages/ib-booking-passenger-info/transformers/ib-booking-passenger-info-transfomer-bridge.service';
import { AJSBookingAvailabilityTransformerProvider } from './app/shared/services/ib-booking-availability/transformers/ajs-upgrade/ib-booking-availability-transformer-bridge.service';
import { AJSCommonsAncillariesServiceProvider } from './app/shared/components/ib-booking-header/services/upgraded/ib-commons-ancillaries-bridge.service';
import { AJSModalServiceAncillariesProvider } from './app/pages/ib-booking-ancillaries/services/upgraded/ib-modal-ancillaries-bridge.service';
import { AJSBookingAncillariesServiceProvider } from './app/pages/ib-booking-ancillaries/services/upgraded/ib-booking-ancillaries-service-bridge.service';

const upgradedProviders: Provider[] = [
    AJSDatalayerUtilsServiceProvider,
    AJSBookingModalServiceProvider,
    AJSCurrencyServiceProvider,
    AJSBookingAvailabilityServiceProvider,
    angularjsLocationProvider,
    AJSDatalayerBKIServiceProvider,
    AJSMonetateUtilsProvider,
    AJSBookingPassengerInfoServiceProvider,
    AJSBookingPassengerInfoTransformerProvider,
    AJSBookingAvailabilityTransformerProvider,
    AJSCommonsAncillariesServiceProvider,
    AJSModalServiceAncillariesProvider,
    AJSBookingAncillariesServiceProvider
];
@NgModule({
    providers: upgradedProviders
})
export class IbBookingUpgradeModule { 
   
}
