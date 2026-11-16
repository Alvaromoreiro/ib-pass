import { NgModule } from '@angular/core';
import { NgbAccordionBody, NgbAccordionCollapse, NgbAccordionHeader, NgbAccordionItem, NgbAccordionModule, NgbAccordionToggle, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { IbPlusAccordionModule } from './components/ib-plus-accordion/ib-plus-accordion.module';
import { IbMmbCollapseDirective } from './components/ib-mmb-collapse-directive/ib-mmb-collapse.directive';
import { LiteralFormatterPipe } from './pipes/literalFormatter.pipe';
import { IbAviosFormatPipe } from './pipes/ib-avios-format.pipe';
import { IbIntlNumberFormatPipe } from './pipes/ib-intl-number-format.pipe';
import { MmbLayoutComponent } from '../../app/layouts/mmb-layout/mmb-layout.component';
import { IbMmbAviosSummaryComponent } from './components/ib-MmB-avios-summary/ib-MmB-avios-summary.component';
import { LoadingSpinnerModule } from './components/loading-spinner/loading-spinner.module';
import { LoadingSpinnerService } from './components/loading-spinner/loading-spinner.service';
import { IbLotusOtpModalModule } from './components/ib-lotus-otp-modal/ib-lotus-otp-modal.module';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        IbMmbCollapseDirective,
        LiteralFormatterPipe,
        IbAviosFormatPipe,
        IbIntlNumberFormatPipe,
        MmbLayoutComponent,
        IbMmbAviosSummaryComponent
    ],
    imports: [
        NgbModule,
        TranslateModule,
        IbPlusAccordionModule,
        CommonModule,
        NgbAccordionModule,
        NgbAccordionItem,
        NgbAccordionHeader,
        NgbAccordionCollapse,
        NgbAccordionBody,
        NgbAccordionToggle,
        LoadingSpinnerModule,
        IbLotusOtpModalModule
    ],
    providers: [
        LiteralFormatterPipe,
        IbAviosFormatPipe,
        IbIntlNumberFormatPipe,
        MmbLayoutComponent,
        IbMmbAviosSummaryComponent,
        LoadingSpinnerService,
        
    ],
    exports: [
        IbPlusAccordionModule,
        IbMmbCollapseDirective,
        LiteralFormatterPipe,
        IbAviosFormatPipe,
        IbIntlNumberFormatPipe,
        MmbLayoutComponent,
        IbMmbAviosSummaryComponent,
        LoadingSpinnerModule,
        IbLotusOtpModalModule
    ]
})

export class SharedModule { }
