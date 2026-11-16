import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { IbBookingMobileTotalPriceComponent } from './components/ib-booking-mobile-total-price/ib-booking-mobile-total-price.component';
import { ibSelectPartnerModalComponent } from './components/ib-booking-partners-modal/ib-booking-partners-modal.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { ShortDateFormatPipe } from './pipes/short-date-format.pipe';
import { ToCasePipe } from './pipes/toCase.pipe';
import { LimitToPipe } from './pipes/limit-to.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { DurationFormatPipe } from './pipes/duration-format.pipe';
import { LiteralFormatterPipe } from './pipes/literalFormatter.pipe';
import { EntriesArrayPipe } from './pipes/entries-array.pipe';
import { IbBookingCollapseDirective } from './directives/ib-booking-collapse.directive';
import { IbBookingPasswordValidatorDirective } from './directives/ib-booking-password-validator.directive';
import { IbBookingValidatorCleanerDirective } from './directives/ib-booking-validator-cleaner.directive';
import { IbValidatorCleanerOnBusinessDirective } from './directives/ib-validator-cleaner-on-business.directive';
import { IbBookingCalculatePositionDirective } from './directives/ib-booking-calculate-position.directive';
import { IbBookingLoadItemImageDirective } from './directives/ib-booking-load-item-image.directive';
import { AJSBookingHttpUtilsServiceLegacyProvider } from './services/ib-utils/ib-booking-http-utils-bridge.service';
import { AJSBookingUtilsServiceProvider } from './services/ib-utils/ib-booking-utils-service-bridge.service';
import { AJSIbCPermanentUserServiceProvider } from './services/ib-utils/ib-booking-permanent-user-bridge.service';
import { AJSCommonsGetLoginInfoServiceProvider } from './services/ib-login/ib-booking-get-login-info-bridge.service';
import { BookingLayoutComponent } from '../layouts/booking-layout/booking-layout.component';
import { IbSuggestLoginModalComponent } from './components/ib-suggest-login-modal/ib-suggest-login-modal.component';
import { IbBookingNoticeComponent } from '@src/app/shared/components/ib-booking-notice/ib-booking-notice.component';
import { IbBookingCommonTotalPriceComponent } from './components/ib-booking-common-total-price/ib-booking-common-total-price.component';
import { IbSoftLoginModalComponent } from './components/ib-soft-login-modal/ib-soft-login-modal.component';
import { IbBookingAccordionComponent } from './components/ib-booking-accordion/ib-booking-accordion.component';
import { IbBookingMobileConditionsComponent } from './components/ib-booking-mobile-conditions/ib-booking-mobile-conditions.component';
import { AJSGetDestinationsServiceProvider } from './http-services/rdu-loc/ib-booking-areas-cities-list-bridge.service';
import { IbBookingSliceDetailsInfoModule } from './components/ib-booking-slice-details-info/ib-booking-slice-details-info.module';
import { IbCPipeModule } from 'ib-web-commons/pipes';
import { NgReactComponent } from './components/react/ng-react.component';
import { IbBookingLinkContentParserDirective } from './directives/ib-booking-link-content-parser.directive';
import { UserActivityModule } from './components/ib-booking-user-activity-modal/ib-booking-user-activity.module';
import { StepsControlModalComponent } from './components/ib-booking-steps-control-modal/ib-booking-steps-control-modal.component';
import { IbBookingPriceDetailModalComponent } from './components/ib-booking-price-detail-modal/ib-booking-price-detail-modal.component';
import { ClearHyphenPipe } from './pipes/clear-hyphen.pipe';
import { IbBookingTotalPriceDirective } from './components/ib-booking-simplified-total-price/ib-booking-total-price-legacy.component';
import { IbBookingCrossedPricesComponent } from './components/ib-booking-crossed-prices/ib-booking-crossed-prices.component';
import { ShortenerFormatFilterPipe } from './pipes/shortener-format-filter.pipe';

const downgradedComponents = [
    IbBookingMobileTotalPriceComponent,
    IbSuggestLoginModalComponent,
    IbBookingNoticeComponent,
    IbSoftLoginModalComponent,
    IbBookingLinkContentParserDirective,
    IbBookingPriceDetailModalComponent,
    IbBookingCrossedPricesComponent
];
const components = [
    NgReactComponent,
    SafeHtmlPipe,
    SafeUrlPipe,
    TruncatePipe,
    ToCasePipe,
    LimitToPipe,
    LiteralFormatterPipe,
    EntriesArrayPipe,
    DateFormatPipe,
    DurationFormatPipe,
    ShortDateFormatPipe,
    ClearHyphenPipe,
    IbBookingCollapseDirective,
    IbBookingValidatorCleanerDirective,
    IbBookingPasswordValidatorDirective,
    IbBookingCalculatePositionDirective,
    IbValidatorCleanerOnBusinessDirective,
    IbBookingLoadItemImageDirective,
    ibSelectPartnerModalComponent,
    BookingLayoutComponent,
    IbBookingCommonTotalPriceComponent,
    IbBookingAccordionComponent,
    IbBookingMobileConditionsComponent,
    StepsControlModalComponent,
    IbBookingTotalPriceDirective,
    ShortenerFormatFilterPipe,
    ...downgradedComponents
];
@NgModule({
    imports: [
        TranslateModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        TitleCasePipe,
        IbCPipeModule,
        IbBookingSliceDetailsInfoModule,
        UserActivityModule
    ],
    exports: components,
    declarations: components,
    providers: [
        AJSBookingHttpUtilsServiceLegacyProvider,
        AJSBookingUtilsServiceProvider,
        AJSGetDestinationsServiceProvider,
        AJSCommonsGetLoginInfoServiceProvider,
        AJSIbCPermanentUserServiceProvider
    ]
})
export class IbBookingSharedModule {
    static components = downgradedComponents;
}
