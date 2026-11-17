import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbCheckinApisComponent } from './ib-checkin-apis.component';
import { IbAccordionContainerComponent } from './components/ib-accordion-container/ib-accordion-container.component';
import { NgReactModule } from '../../react/wrapper/ng-react.module';
import { IbCheckinFormApisComponent } from './components/ib-checkin-form-apis/ib-checkin-form-apis.component';
import { IbOverlayComponent } from './components/ib-overlay/ib-overlay.component';
import { AJSFlightsPassengersUtilsServiceTokenProvider } from '@src/components/services/Utils/bridges/ib-flights-passengers-utils-bridge.service';
import { AJSAcceptObjectsPolicyServiceTokenProvider } from '@src/app/shared/http-services/pacc-pacc/bridges/ib-accept-objects-bridge.service';
import { AJSCheckAncillariesServiceTokenProvider } from '@src/app/shared/services/bridges/ib-check-ancillaries-bridge.service';
import { AJSModalServiceProvider } from '@src/app/shared/services/ib-modal/ib-modal-service-bridge.service';
import { AJSFlightsPassengersServiceTokenProvider } from '@src/components/ib-check-in-flights-passengers/services/bridges/ib-flights-and-passengers-bridge.service';
import { AJSCheckPaymentsServiceTokenProvider } from '@src/components/services/Utils/bridges/ib-check-payments-bridge.service';
import { AJSCommonsAncillariesServiceTokenProvider } from '@src/components/services/Utils/bridges/ib-common-ancillaries-bridge.service';
import { AJSCallAncillariesServiceTokenProvider } from '@src/app/shared/http-services/ass-fass/bridges/ib-call-ancillaries-bridge.service';
import { AJSLocationProvider, AJSRouteProvider, IbCheckinRedirectionUtilsService } from '@src/app/shared/services/ib-utils/ib-checkin-redirection-utils.service';
import { AJSGetCKICachedInformationServiceProvider } from '@src/app/shared/http-services/pac-prm/bridges/ib-get-cached-information-bridge.service';
import { AJSUpgradingAncillaryToUpgradeInfoMapperServiceTokenProvider } from '@src/app/shared/services/ib-upgrading/bridges/ib-upgrading-ancillary-to-upgrade-info-mapper-bridge.service';

const downgradedComponents = [IbCheckinApisComponent];

const upgradedProviders = [
    AJSFlightsPassengersUtilsServiceTokenProvider,
    AJSAcceptObjectsPolicyServiceTokenProvider,
    AJSModalServiceProvider,
    AJSGetCKICachedInformationServiceProvider,
    AJSCheckAncillariesServiceTokenProvider,
    AJSCheckPaymentsServiceTokenProvider,
    AJSFlightsPassengersServiceTokenProvider,
    AJSCommonsAncillariesServiceTokenProvider,
    AJSCallAncillariesServiceTokenProvider,
    AJSLocationProvider,
    AJSRouteProvider,
    AJSUpgradingAncillaryToUpgradeInfoMapperServiceTokenProvider
];
@NgModule({
    declarations: [...downgradedComponents, IbAccordionContainerComponent, IbCheckinFormApisComponent, IbOverlayComponent],
    imports: [CommonModule, TranslateModule, NgReactModule],
    providers: [
        ...upgradedProviders,
        IbCheckinRedirectionUtilsService
    ]
} )

export class IbCheckinApisModule {
    static components = [...downgradedComponents];
}
