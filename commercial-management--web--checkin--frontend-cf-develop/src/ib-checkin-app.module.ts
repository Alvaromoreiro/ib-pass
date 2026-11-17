import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { setAngularJSGlobal, UpgradeModule } from '@angular/upgrade/static';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import angular from 'angular';
import { AJSCurrencyServiceProvider, commonsTranslateLoader, rootScopeProvider } from 'ib-web-commons/utils';
import { AJSCheckinModalServiceProvider } from './app/shared/services/ib-modal/ib-checkin-modal-service-bridge.service';
import { CheckinAppConstants } from './components/routing/ib-check-in-constants';
import { IbCPipeModule } from 'ib-web-commons/pipes';
import { IbCModalModule } from 'ib-web-commons/ib-modal';
import { IbCDirectivesModule } from 'ib-web-commons/directives';
import { DatalayerUtilsProvider, IbCDatalayerUtilsService } from 'ib-web-commons/ib-datalayer';
import { IbCommonGenericInterceptorProvider } from 'ib-web-commons/interceptor';
import { IbMenusAppModule } from 'ib-menus';
import { IbCheckinAppRoutingModule } from './ib-checkin-app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IbCheckinPaymentsModule } from './app/pages/ib-checkin-payments/ib-checkin-payments.module';
import { NgReactModule } from './app/react/wrapper/ng-react.module';
import { AJSCommonsHttpUtilServiceProvider } from './app/shared/services/ib-utils/ib-check-in-http-utils.service';
import { AJSCommonsGenericProxyProvider } from './app/shared/services/ib-proxy/commons-proxy-bridge.service';
import { AJSNewMainHeaderFacadeProvider } from './app/shared/services/ib-header/ib-NewMainHeaderFacade-bridge.service';
import { AJSLocationProvider, AJSRouteProvider } from './app/shared/services/ib-utils/ib-checkin-redirection-utils.service';
import { AJSDigitalDataServiceProvider } from './app/shared/services/ib-datalayer/services/ib-cki-digital-data-service-bridge.service';
import { AJSDatalayerUtilsServiceProvider } from './app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service-bridge.service';
import { AJSDatalayerServiceProvider } from './app/shared/services/ib-datalayer/services/ib-cki-datalayer-service-bridge.service';
import { AJSUpdateFlightsPassengerInfoServiceProvider } from './app/shared/services/ib-apis/ib-update-flights_passenger-info-service-bridge.service';
import { AJSApisFormServiceProvider } from './app/shared/services/ib-apis/ib-apis-form-service-bridge.service';
import { AJSGetPhoneCodesServiceProvider } from './app/shared/services/ib-apis/ib-get-phone-codes-service-bridge.service';
import { AJSTravelInfoServiceProvider } from './app/shared/services/ib-apis/ib-travel-info-service-bridge.service';
import { AJSPassengerAdditionalInfoServiceProvider } from './app/shared/services/ib-apis/ib-passenger-additional-info-service-bridge.service';
import { AJSNewslettersServiceProvider } from './app/shared/services/ib-apis/ib-newsletters-service-bridge.service';
import { AJSGetStatesListServiceProvider } from './app/shared/services/ib-apis/ib-get-states-list-service-bridge.service';
import { AJSGetFrequentFlyersServiceProvider } from './app/shared/services/ib-apis/ib-get-frequent-flyers-service-bridge.service';
import { AJSGetCountriesListServiceProvider } from './app/shared/services/ib-apis/ib-get-countries-list-service-bridge.service';
import { AJSGetCKICachedInformationServiceProvider } from './app/shared/http-services/pac-prm/bridges/ib-get-cached-information-bridge.service';
import { AJSCallApisFormServiceProvider } from './app/shared/services/ib-apis/ib-call-apis-form-service-bridge.service';
import { AJSModalServiceProvider } from './app/shared/services/ib-modal/ib-modal-service-bridge.service';
import { IbAncillariesAppModule } from 'ib-web-ancillaries';
import { IbCheckinSharedModule } from './app/shared/ib-checkin-shared.module';
import { AJSWindow } from './app/core/config/ib-checkin-app-tokens';
import { AJSFlightsPassengersUtilsServiceTokenProvider } from './components/services/Utils/bridges/ib-flights-passengers-utils-bridge.service';
import { AJSAcceptObjectsPolicyServiceTokenProvider } from './app/shared/http-services/pacc-pacc/bridges/ib-accept-objects-bridge.service';
import { AJSCheckAncillariesServiceTokenProvider } from './app/shared/services/bridges/ib-check-ancillaries-bridge.service';
import { AJSCheckPaymentsServiceTokenProvider } from './components/services/Utils/bridges/ib-check-payments-bridge.service';
import { AJSFlightsPassengersServiceTokenProvider } from './components/ib-check-in-flights-passengers/services/bridges/ib-flights-and-passengers-bridge.service';
import { AJSCommonsAncillariesServiceTokenProvider } from './components/services/Utils/bridges/ib-common-ancillaries-bridge.service';
import { IbCheckinSeatSummaryService } from './app/pages/ib-checkin-seat-summary/services/ib-checkin-seat-summary.service';
import { AJSCallAncillariesServiceTokenProvider } from '@src/app/shared/http-services/ass-fass/bridges/ib-call-ancillaries-bridge.service';
import { AJSUpgradingAncillaryToUpgradeInfoMapperServiceTokenProvider } from './app/shared/services/ib-upgrading/bridges/ib-upgrading-ancillary-to-upgrade-info-mapper-bridge.service';
import { IbSessionConfigService } from './app/core/services/ib-session-config.service';
import { AJSCommonsUtilServiceProvider } from './app/shared/services/bridges/ib-commons-util-bridge.service';
import { AJSCheckForDeepLinkProvider } from './app/shared/services/bridges/ib-check-for-deeplink-bridge.service';
import { AJSCloseSessionServiceProvider } from './app/shared/services/checkin-flow.service';

export function createTranslateLoader (http: HttpClient) {
    return commonsTranslateLoader(http, [CheckinAppConstants.i18nRoute, CheckinAppConstants.generalI18nRoute]);
}
setAngularJSGlobal(angular);

// Fixes ivy aot compilation: https://github.com/angular/angular/issues/37102
const downgradedCKIComponents = [];

@NgModule({
    declarations: [AppComponent, ...downgradedCKIComponents],
    imports: [
        BrowserModule,
        UpgradeModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            },
            defaultLanguage: 'es'
        }),
        IbCPipeModule,
        IbCModalModule,
        IbCDirectivesModule,
        IbMenusAppModule,
        IbCheckinAppRoutingModule,
        ReactiveFormsModule,
        NgReactModule,
        IbCheckinPaymentsModule,
        IbAncillariesAppModule,
        IbCheckinSharedModule
    ],
    providers: [
        AJSUpdateFlightsPassengerInfoServiceProvider,
        AJSDatalayerServiceProvider,
        AJSDigitalDataServiceProvider,
        AJSDatalayerUtilsServiceProvider,
        AJSApisFormServiceProvider,
        AJSGetPhoneCodesServiceProvider,
        AJSTravelInfoServiceProvider,
        AJSPassengerAdditionalInfoServiceProvider,
        AJSNewslettersServiceProvider,
        AJSGetStatesListServiceProvider,
        AJSGetFrequentFlyersServiceProvider,
        AJSGetCountriesListServiceProvider,
        AJSGetCKICachedInformationServiceProvider,
        AJSCallApisFormServiceProvider,
        AJSModalServiceProvider,
        AJSCloseSessionServiceProvider,
        AJSDigitalDataServiceProvider,
        AJSDatalayerUtilsServiceProvider,
        AJSDatalayerServiceProvider,
        AJSLocationProvider,
        AJSNewMainHeaderFacadeProvider,
        AJSCurrencyServiceProvider,
        AJSCommonsGenericProxyProvider,
        rootScopeProvider,
        DatalayerUtilsProvider,
        ...IbCommonGenericInterceptorProvider,
        IbCDatalayerUtilsService,
        AJSCheckinModalServiceProvider,
        AJSCommonsHttpUtilServiceProvider,
        { provide: AJSWindow, useValue: window },
        AJSRouteProvider,
        AJSFlightsPassengersUtilsServiceTokenProvider,
        AJSAcceptObjectsPolicyServiceTokenProvider,
        AJSCheckAncillariesServiceTokenProvider,
        AJSCheckPaymentsServiceTokenProvider,
        AJSFlightsPassengersServiceTokenProvider,
        AJSCommonsAncillariesServiceTokenProvider,
        IbCheckinSeatSummaryService,
        AJSCallAncillariesServiceTokenProvider,
        AJSUpgradingAncillaryToUpgradeInfoMapperServiceTokenProvider,
        IbSessionConfigService,
        AJSCommonsUtilServiceProvider,
        AJSCheckForDeepLinkProvider
    ],
    bootstrap: [AppComponent],
    exports: [NgReactModule]
})
export class IbCheckinAppModule {
    static downgradedComponent = [...downgradedCKIComponents];
}
