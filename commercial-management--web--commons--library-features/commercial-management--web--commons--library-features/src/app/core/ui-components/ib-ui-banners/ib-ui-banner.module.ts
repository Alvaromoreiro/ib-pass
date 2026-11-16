import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbUiTimerModule } from '../ib-ui-timer/ib-ui-timer.module';
import { IbUiBannerComponent } from './ib-ui-banner.component';

@NgModule({
    declarations: [
        IbUiBannerComponent
    ],
    exports: [
        IbUiBannerComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IbUiTimerModule
    ]
})
export class IbUiBannerModule {}
export { IbUiBannerComponent } from "./ib-ui-banner.component";
