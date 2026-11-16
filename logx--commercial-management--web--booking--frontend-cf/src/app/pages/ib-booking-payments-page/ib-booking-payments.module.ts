import './ajs-templates-module';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IbBookingPaymentsPageComponent } from './ib-booking-payments-page.component';
import { IbPmtComponentLegacyDirective } from './components/ib-booking-payments-legacy/ib-pmt-legacy.component';
import { IbBookingPmtComponent } from './components/ib-booking-pmt-component/ib-booking-pmt.component';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';
import { IbBookingVoucherComponent } from './components/ib-booking-pmt-component/components/ib-booking-voucher/ib-booking-voucher.component';
import { IbPmtTaxesModalComponent } from './components/ib-booking-pmt-taxes-modal/ib-booking-pmt-taxes-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { IbPmtVoucherOtpModalModule } from './components/ib-booking-pmt-component/components/ib-pmt-voucher-otp-modal/ib-pmt-voucher-otp-modal.module';
import { IbBookingTotalOnholdFreeComponent } from './components/ib-booking-total-onhold-free/ib-booking-total-onhold-free.component';
import { BookingPaymentErrorModalComponent } from './components/ib-booking-payment-error-modal/ib-booking-payment-error-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IbBookingPaymentsRoutingModule } from '@src/app/core/routing/modules/ib-payments-page-routing.module';
import { IbPaymentsAppModule } from 'ib-web-payments';
import { IbPmtPayBlockComponent } from './components/ib-booking-pmt-component/components/ib-pmt-pay-block/ib-pmt-pay-block.component';
const upgradedProviders = [
];
@NgModule({
    declarations: [
        IbBookingPaymentsPageComponent,
        IbPmtComponentLegacyDirective,
        IbBookingPmtComponent,
        IbBookingVoucherComponent,
        IbPmtTaxesModalComponent,
        IbBookingTotalOnholdFreeComponent,
        BookingPaymentErrorModalComponent,
        IbPmtPayBlockComponent
    ],
    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IbBookingSharedModule,
        IbPmtVoucherOtpModalModule,
        IbBookingPaymentsRoutingModule,
        IbPaymentsAppModule
    ],
    providers: [
        ...upgradedProviders
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IbBookingPaymentsModule {


}

