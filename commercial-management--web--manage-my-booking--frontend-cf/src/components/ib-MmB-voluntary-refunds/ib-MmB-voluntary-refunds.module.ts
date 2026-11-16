import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { IbMmBVoluntaryRefundsComponent } from './ib-MmB-voluntary-refunds.component';
import { IbMmbMainFooterDirective } from '../ib-reusable-components/ib-main-footer/components/ib-main-footer-legacy.component';
import { IbMmBVoluntaryRefundsConfirmationModalComponent } from './components/ib-MmB-voluntary-refunds-confirmation-modal/ib-MmB-voluntary-refunds-confirmation-modal.component';
import { IbMmBVoluntaryRefundsSummaryComponent } from './components/ib-MmB-voluntary-refunds-summary/ib-MmB-voluntary-refunds-summary.component';
import { IbMmBVoluntaryRefundsConfirmationComponent } from './components/ib-MmB-voluntary-refunds-confirmation/ib-MmB-voluntary-refunds-confirmation.component';
import { IbMmBVoluntaryRefundsCloseModalComponent } from './components/ib-MmB-voluntary-refunds-close-modal/ib-MmB-voluntary-refunds-close-modal.component';
import { IbBoxAnyQuestionsComponent } from './shared/box-any-questions/box-any-questions.component';
import { IbMmBVoluntaryRefundsErrorModalComponent } from './components/ib-MmB-voluntary-refunds-error-modal/ib-MmB-voluntary-refunds-error-modal.component';


const downgradedComponents = [
    IbMmBVoluntaryRefundsComponent
];

@NgModule({
	imports: [
		BrowserModule,
		TranslateModule
	],
	declarations: [
		...downgradedComponents,
        IbMmbMainFooterDirective,
        IbMmBVoluntaryRefundsConfirmationModalComponent,
        IbMmBVoluntaryRefundsErrorModalComponent,
		IbMmBVoluntaryRefundsSummaryComponent,
		IbMmBVoluntaryRefundsConfirmationComponent,
        IbMmBVoluntaryRefundsCloseModalComponent,
		IbBoxAnyQuestionsComponent
	],
    exports: [
        IbMmBVoluntaryRefundsConfirmationModalComponent,
        IbMmBVoluntaryRefundsErrorModalComponent,
		IbMmBVoluntaryRefundsSummaryComponent,
		IbMmBVoluntaryRefundsConfirmationComponent,
        IbMmBVoluntaryRefundsCloseModalComponent,
		IbBoxAnyQuestionsComponent
    ]
})

export class IbMmBVoluntaryRefundsModule { }
