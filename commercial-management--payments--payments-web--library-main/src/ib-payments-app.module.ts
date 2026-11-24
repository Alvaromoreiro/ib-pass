import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbPmtNemuruModule } from './app/feature/components/ib-pmt-nemuru-afop/ib-pmt-nemuru-module';
import { IbPmtRiskifiedModule } from './components/ib-payments/cmpnts/ib-pmt-reusable/ib-risk-field/ib-risk-field.module';
import { IbPmtTelephoneModule } from './components/ib-payments/cmpnts/utils/ib-pmt-telephone/ib-pmt-telephone.module';
import { IbPmtTabNewModule } from './app/feature/components/ib-pmt-tab-new/ib-pmt-tab-new.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IbCDirectivesModule } from 'ib-web-commons/directives';
import { IbPmtSummaryCarbonFootprintModule } from './components/ib-payments/cmpnts/ib-pmt/cmpnts/ib-pmt-summary/cmpnts/ib-pmt-summary-carbon-footprint/ib-pmt-summary-carbon-footprint-module';
import { IbPmtSummaryBundleModule } from './components/ib-payments/cmpnts/ib-pmt/cmpnts/ib-pmt-summary/cmpnts/ib-pmt-summary-bundle/ib-pmt-summary-bundle.module';
import { IbPmtConfirmationCarbonFootprintModule } from './components/ib-payments/cmpnts/ib-pmt-confirmation/cmpnts/ib-pmt-confirmation-carbon-footprint/ib-pmt-confirmation-carbon-footprint-module';
import { IbPmtSummaryGlobickActivitiesModule } from './components/ib-payments/cmpnts/ib-pmt/cmpnts/ib-pmt-summary/cmpnts/ib-pmt-summary-globick-activities/ib-pmt-summary-globick-activities-module';
import { IbPmtSummaryGlobickTransfersModule } from './components/ib-payments/cmpnts/ib-pmt/cmpnts/ib-pmt-summary/cmpnts/ib-pmt-summary-globick-transfers/ib-pmt-summary-globick-transfers-module';
import { IbPmtBkiSummaryPassengersModule } from './components/ib-payments/cmpnts/ib-pmt/cmpnts/ib-pmt-summary/cmpnts/ib-pmt-bki-summary-passengers/ib-pmt-bki-summary-passengers.module';
import { IbPmtVoucherOtpModalModule } from './app/feature/components/ib-pmt-voucher-otp-modal/ib-pmt-voucher-otp-modal.module';
import { SharedModule } from './app/shared/shared.module';
import { IbCkiConfirmationModule } from './app/feature/components/ib-pmt-cki-confirmation/ib-check-in-confirmation.module';
import { IbPmtConfirmationOnholdAlertComponent } from './app/feature/components/ib-pmt-confirmation-onhold-alert/ib-pmt-confirmation-onhold-alert.component';
import { IbPriceDetailModalComponent } from './app/feature/components/ib-pmt-price-details-modal/ib-price-detail-modal.component';
import { AJSCurrencyServiceProvider } from 'ib-web-commons/utils';
import { AJSNewMainHeaderFacadeProvider } from './components/ib-payments/cmpnts/ib-pmt/service/ib-header-facade-bridge.service';

import { IbPmtPetsWarningModule } from './components/ib-payments/cmpnts/ib-pmt-confirmation/cmpnts/ib-pmt-pets-warning/ib-pmt-pets-warning.module';
import { IbPmtBkiSummaryPetsModule } from './components/ib-payments/cmpnts/ib-pmt/cmpnts/ib-pmt-summary/cmpnts/ib-pmt-bki-summary-pets/ib-pmt-bki-summary-pets.module';
const downgradedComponents = [
    IbPmtConfirmationOnholdAlertComponent,
    IbPriceDetailModalComponent
];
@NgModule({
    declarations: [
        ...downgradedComponents
    ],
    exports: [],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        IbCDirectivesModule,
        AutoCompleteModule,
        CommonModule,
        TranslateModule,
        IbPmtTelephoneModule,
        IbPmtTabNewModule,
        IbPmtSummaryCarbonFootprintModule,
        IbPmtSummaryBundleModule,
        IbPmtNemuruModule,
        IbPmtRiskifiedModule,
        IbPmtConfirmationCarbonFootprintModule,
        IbPmtBkiSummaryPassengersModule,
        IbPmtBkiSummaryPetsModule,
        IbPmtSummaryGlobickActivitiesModule,
        IbPmtSummaryGlobickTransfersModule,
        IbPmtVoucherOtpModalModule,
        SharedModule,
        IbCkiConfirmationModule,
        IbPmtPetsWarningModule
    ],
    providers: [
        AJSNewMainHeaderFacadeProvider,
        AJSCurrencyServiceProvider
    ]
})
export class IbPaymentsAppModule { }

