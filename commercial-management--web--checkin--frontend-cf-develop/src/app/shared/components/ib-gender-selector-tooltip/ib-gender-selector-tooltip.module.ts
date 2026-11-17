import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { IbGenderSelectorTooltipComponent } from './ib-gender-selector-tooltip.component';

const downgradedComponents = [
    IbGenderSelectorTooltipComponent
];

@NgModule({
    declarations: [
        IbGenderSelectorTooltipComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule
    ],
    exports: [
        IbGenderSelectorTooltipComponent
    ]
})
export class IbGenderSelectorTooltipModule {
    static components = [...downgradedComponents];
}
