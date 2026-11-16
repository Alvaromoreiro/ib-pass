import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbUiTimerComponent } from './ib-ui-timer.component';

@NgModule({
    imports: [CommonModule, TranslateModule],
    declarations: [
        IbUiTimerComponent
    ],
    exports: [
        IbUiTimerComponent
    ]
})
export class IbUiTimerModule {}
export { IbUiTimerComponent } from "./ib-ui-timer.component";
export { IbUiTimerTemplateType } from "./ib-ui-timer.model";
