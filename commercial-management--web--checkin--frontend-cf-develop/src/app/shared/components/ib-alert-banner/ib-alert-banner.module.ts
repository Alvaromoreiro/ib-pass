import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbAlertBannerComponent } from './ib-alert-banner.component';

const downgradedComponents = [
    IbAlertBannerComponent
];

@NgModule({
    declarations: [
        IbAlertBannerComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [
        IbAlertBannerComponent
    ],
    providers: [
    ]
})
export class IbAlertBannerModule {
    static components = [...downgradedComponents];
}