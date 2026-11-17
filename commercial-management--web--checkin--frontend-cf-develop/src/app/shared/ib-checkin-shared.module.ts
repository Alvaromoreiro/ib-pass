
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { AJSCommonsHttpUtilServiceProvider } from './services/ib-utils/ib-check-in-http-utils.service';
import { LiteralFormatterPipe } from './pipes/literalFormatter.pipe';
import { IbLotusOtpModalModule } from './components/ib-lotus-otp-modal/ib-lotus-otp-modal.module';
import { IbModalSBYModule } from './components/ib-modal-sby/ib-modal-sby.module';
import { IbButtonModule } from './components/ib-button/ib-button.module';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { IbAlertBannerModule } from './components/ib-alert-banner/ib-alert-banner.module';
import { IbGenderSelectorTooltipModule } from './components/ib-gender-selector-tooltip/ib-gender-selector-tooltip.module';

const downgradedComponents = [
    
];
const components = [
    LiteralFormatterPipe,
    DateFormatPipe,
    ...downgradedComponents
];
@NgModule({
    imports: [
        TranslateModule,
        FormsModule,
        CommonModule,
        TitleCasePipe,
        IbLotusOtpModalModule,
        IbModalSBYModule,
        IbButtonModule,
        IbAlertBannerModule,
        IbGenderSelectorTooltipModule
    ],
    exports: [
        ...components,
        IbButtonModule,
        IbGenderSelectorTooltipModule
    ],
    declarations: components,
    providers: [
        ...components,
        AJSCommonsHttpUtilServiceProvider
    ]
})
export class IbCheckinSharedModule {
    static components = downgradedComponents;
}
