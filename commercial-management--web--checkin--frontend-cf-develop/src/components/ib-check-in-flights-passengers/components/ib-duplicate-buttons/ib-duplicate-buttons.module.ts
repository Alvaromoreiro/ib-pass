import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { IbDuplicateButtonsComponent } from './ib-duplicate-buttons.component';
import { IbCheckinSharedModule } from '@src/app/shared/ib-checkin-shared.module';

const downgradedComponents = [
    IbDuplicateButtonsComponent
];

@NgModule({
    declarations: [
        IbDuplicateButtonsComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IbCheckinSharedModule
    ]

})
export class IbDuplicateButtonsModule {
    static components = [...downgradedComponents];
}
