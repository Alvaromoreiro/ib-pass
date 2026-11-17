import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { IbTicketSelectionComponent } from './ib-ticket-selection.component';
import { FormsModule } from '@angular/forms';

const downgradedComponents = [
    IbTicketSelectionComponent
];

@NgModule({
    declarations: [
        IbTicketSelectionComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule
    ]
})
export class IbTicketSelectionModule {
    static components = [...downgradedComponents];
}
