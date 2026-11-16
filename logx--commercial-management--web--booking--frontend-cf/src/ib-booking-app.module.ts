import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { setAngularJSGlobal, UpgradeModule } from '@angular/upgrade/static';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { commonsTranslateLoader, rootScopeProvider } from 'ib-web-commons/utils';
import { BookingAppConstants } from '@core/constants/ib-booking-constants';
import { IbCPipeModule } from 'ib-web-commons/pipes';
import { IbCModalModule } from 'ib-web-commons/ib-modal';
import { IbCDirectivesModule } from 'ib-web-commons/directives';
import { DatalayerUtilsProvider, IbCDatalayerUtilsService } from 'ib-web-commons/ib-datalayer';
import { IbCommonGenericInterceptorProvider } from 'ib-web-commons/interceptor';
import { IbUiAutomaticInvoiceModule } from 'ib-web-commons/ui-components';
import { CommonModule } from '@angular/common';
import { IbBookingAppRoutingModule } from '@core/routing/ib-booking-app-routing.module';
import { AppComponent } from '@src/app.component';
import { IbBookingAvailabilityPageModule } from '@pages/ib-booking-availability-page/ib-booking-availability-page.module';
import angular from 'angular';
import { WINDOW_TOKEN } from '@core/config/ib-booking-app-tokens';
import { IbBookingHeaderModule } from '@shared/components/ib-booking-header/ib-booking-header.module';
import { IbBookingSharedModule } from '@shared/ib-booking-shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IbAncillariesAppModule } from 'ib-web-ancillaries';
import { AJStranslateProvider, BookingTranslateFactoryService } from '@core/services/ib-booking-translate-factory.service';
import { IbBookingUpgradeModule } from './ib-booking-upgrade.module';
import { IbPaymentsAppModule } from 'ib-web-payments';
import { IbBookingBridgeModule } from './app/shared/components/ib-booking-bridge/ib-booking-bridge.module';
import { IbAkamaiHttpAngularInterceptor } from '@core/http/ib-akamai-http-interceptor';

export function createTranslateLoader (http: HttpClient) {
    return commonsTranslateLoader(http, [
        BookingAppConstants.i18nRoute,
        BookingAppConstants.generalI18nRoute
    ]);
}

const commonsModules = [
    IbCPipeModule,
    IbCModalModule,
    IbCDirectivesModule,
    IbUiAutomaticInvoiceModule
];





// Fixes ivy aot compilation: https://github.com/angular/angular/issues/37102
const downgradedBKIComponents = [
    // Components are now declared in their respective modules
];

@NgModule({
    declarations: [
        AppComponent,
        ...downgradedBKIComponents
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        UpgradeModule,
        IbBookingUpgradeModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            },
            useDefaultLang: false
        }),
        ...commonsModules,
        IbBookingAppRoutingModule,
        IbBookingAvailabilityPageModule,
        IbBookingSharedModule,
        IbBookingHeaderModule,
        IbBookingBridgeModule,
        IbAncillariesAppModule,
        IbPaymentsAppModule
    ],
    providers: [
        rootScopeProvider,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: IbAkamaiHttpAngularInterceptor,
            multi: true
        },
        ...IbCommonGenericInterceptorProvider,
        DatalayerUtilsProvider,
        IbCDatalayerUtilsService,
        AJStranslateProvider,
        BookingTranslateFactoryService,
        {provide: '$scope', useExisting: '$rootScope'},
        { provide: WINDOW_TOKEN, useValue: window }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class IbBookingAppModule{
    constructor (private upgrade: UpgradeModule){
        setAngularJSGlobal(angular);
        this.upgrade.bootstrap( document.body.querySelector('ng-app'), ['ib-booking-app'],  { strictDi: true });
    }
    static components = [ ...downgradedBKIComponents];
}
