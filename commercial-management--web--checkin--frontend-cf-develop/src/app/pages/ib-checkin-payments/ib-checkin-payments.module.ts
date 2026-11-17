import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbPmtComponentLegacyDirective } from './components/ib-checkin-payments-legacy/ib-pmt-legacy.component';
import { IbCheckinOverlayComponent } from './components/ib-checkin-pmt-component/components/ib-checkin-overlay/ib-checkin-overlay.component';
import { IbCheckinPmtComponent } from './components/ib-checkin-pmt-component/ib-checkin-pmt.component';
import { IbCheckinPaymentsPageComponent } from './ib-checkin-payments-page.component';
import { NgReactModule } from '../../react/wrapper/ng-react.module';
import { IbCheckinVoucherComponent } from './components/ib-checkin-pmt-component/components/ib-checkin-voucher/ib-checkin-voucher.component';
import { IbCheckinSummaryComponent } from './components/ib-checkin-pmt-component/components/ib-checkin-summary/ib-checkin-summary.component';
import { IbPmtVoucherOtpModalModule } from './components/ib-pmt-voucher-otp-modal/ib-pmt-voucher-otp-modal.module';

const downgradedComponents = [
    IbCheckinPaymentsPageComponent
];
@NgModule({
    declarations: [
        ...downgradedComponents,
        IbPmtComponentLegacyDirective,
        IbCheckinPmtComponent,
        IbCheckinVoucherComponent,
        IbCheckinSummaryComponent,
        IbCheckinOverlayComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        NgReactModule,
        IbPmtVoucherOtpModalModule
    ]
})

export class IbCheckinPaymentsModule {
    static components = [...downgradedComponents];
}
