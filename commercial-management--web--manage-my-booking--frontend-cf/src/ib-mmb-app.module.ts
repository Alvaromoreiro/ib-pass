import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpBackend, HttpClient, HttpClientModule} from '@angular/common/http';
import { AJSCurrencyServiceProvider, commonsTranslateLoader, rootScopeProvider } from 'ib-web-commons/utils';
import { MmBAppConstants } from './ib-MmB-constants';
import { IbMenusAppModule } from 'ib-menus';
import { IbCPipeModule } from 'ib-web-commons/pipes';
import { IbCModalModule } from 'ib-web-commons/ib-modal';
import { IbUiOtpModalModule } from 'ib-web-commons/ui-components';
import { IbCDirectivesModule } from 'ib-web-commons/directives';
import { DatalayerUtilsProvider, IbCDatalayerUtilsService } from 'ib-web-commons/ib-datalayer';
import { IbCommonGenericInterceptorProvider } from 'ib-web-commons/interceptor';
import { IbMmBAppRoutingModule } from './ib-MmB-app-routing.module';
import { AppComponent } from './app.component';
import { IbManageCarbonFootprintModule } from "./components/ib-MmB-booking-dashboard/components/ib-MmB-management-tab/components/ib-MmB-manage-carbonFootprint-info/ib-MmB-manage-carbonFootprint-info-module";
import { IbMmbFareFamilyConditionsModule } from '@src/components/ib-reusable-components/ib-mmb-fare-family-conditions/ib-mmb-fare-family-conditions.module';
import { AJSMmbModalServiceProvider } from '@src/components/ib-reusable-components/ib-MmB-modal/services/upgraded/ib-Mmb-modal-service-bridge.service';
import { IbFlexibilizationInfoVoucherDigitalModule } from "./components/ib-MmB-flexibilization/components/ib-flexibilization-info-voucher-digital/ib-flexibilization-info-voucher-digital.module";
import { SharedModule } from "./app/shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AJSMmBDatalayerUtilsServiceProvider } from './components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service-bridge.service';
import { IbMmbManagePetcInfoModule } from './components/ib-MmB-booking-dashboard/components/ib-MmB-management-tab/components/ib-MmB-manage-petc-info/ib-MmB-manage-petc-info.module';
import { AJSCurrencyUtilsServiceProvider } from './components/services/Utils/ib-MmB-currency-utils-service-bridge.service';
import { WINDOW_TOKEN } from './ib-Mmb-app-tokens';
import { IbMmbPaymentModule } from './components/ib-MmB-payment/ib-MmB-payment.module';
import { NgReactModule } from './app/react/wrapper/ng-react.module';
import { CommonModule, DOCUMENT } from '@angular/common';
import { IbMmbConfirmationModule } from './components/ib-Mmb-confirmation/ib-mmb-confirmation.module';
import { AJSMmbUtilServiceProvider } from './components/services/Utils/ib-mmb-utils-bridge.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { IbCHeadersInterceptorService, IbCRetryInterceptorService } from 'ib-web-commons/interceptor';
import { IbMMBAuthInterceptorService } from './app/core/interceptor/ib-mmb-auth-interceptor.service';
import { IbMmbTripListModule } from './components/ib-MmB-trip-list/ib-MmB-trip-list.module';
import { IbMmbSearchNewModule } from './components/ib-MmB-search-new/ib-MmB-search-new.module';
import { IbMmbVcFareComparisonBannerModule } from './components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-changes/cmpnts/ib-MmB-vc-summary/components/ib-MmB-vc-fare-comparison-banner/ib-MmB-vc-fare-comparison-banner.module';
import { IbAncillariesAppModule } from 'ib-web-ancillaries';
import { IbMmBUmnrPassengersModule } from './components/ib-MmB-umnr-passengers/ib-Mmb-umnr-passengers.module';

export function createTranslateLoader (http: HttpClient) {
    return commonsTranslateLoader(http, [
        MmBAppConstants.i18nRoute,
        MmBAppConstants.generalI18nRoute
    ]);
}

export function BookingSearchServiceLegacyFactory(i: any) {
  return i.get('BookingSearchService');
}

const commonsModules = [
    IbCPipeModule,
    IbCModalModule,
    IbCDirectivesModule
];
const downgradedMMBComponents = [
];

const upgradedMMBProviders = [
    AJSCurrencyServiceProvider,
    AJSMmbUtilServiceProvider
]

const InterceptorProvider = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: IbCHeadersInterceptorService,
        multi: true
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: IbMMBAuthInterceptorService,
        multi: true
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: IbCRetryInterceptorService,
        multi: true
    }
];

@NgModule({
    declarations: [
        AppComponent,
        ...downgradedMMBComponents,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        UpgradeModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            },
            defaultLanguage: 'es'
        }),
        ...commonsModules,
        IbMmBAppRoutingModule,
        IbMenusAppModule,
        IbUiOtpModalModule,
        IbManageCarbonFootprintModule,
        IbMmbManagePetcInfoModule,
        IbMmbFareFamilyConditionsModule,
        IbFlexibilizationInfoVoucherDigitalModule,
        SharedModule,
        ReactiveFormsModule,
        NgReactModule,
        IbMmbPaymentModule,
        IbMmbConfirmationModule,
        IbAncillariesAppModule,
        IbMmbSearchNewModule,
        IbMmbTripListModule,
        IbMmBUmnrPassengersModule,
        IbMmbVcFareComparisonBannerModule,
        BrowserAnimationsModule
    ],
    providers: [
        rootScopeProvider,
        DatalayerUtilsProvider,
        ...InterceptorProvider,
        IbCDatalayerUtilsService,
        AJSMmbModalServiceProvider,
        AJSMmBDatalayerUtilsServiceProvider,
        AJSCurrencyUtilsServiceProvider,
        { provide: WINDOW_TOKEN, useValue: window },
        { provide: Document, useExisting: DOCUMENT },
        ...upgradedMMBProviders
    ],
    bootstrap: [
        AppComponent
    ],
    exports: [
        NgReactModule
    ]
})
export class IbMmbAppModule {
    static components = [ ...downgradedMMBComponents];
}