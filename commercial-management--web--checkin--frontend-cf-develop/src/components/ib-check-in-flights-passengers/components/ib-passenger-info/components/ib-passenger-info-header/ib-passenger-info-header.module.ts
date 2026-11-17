import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { IbPassengerInfoHeaderComponent } from './ib-passenger-info-header.component';
import { IbCheckinSharedModule } from '@src/app/shared/ib-checkin-shared.module';

const downgradedComponents = [
    IbPassengerInfoHeaderComponent
];

@NgModule({
    declarations: [
        IbPassengerInfoHeaderComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        NgbPopoverModule,
        IbCheckinSharedModule
    ]
})
export class IbPassengerInfoHeaderModule {
    static components = [...downgradedComponents];
}
