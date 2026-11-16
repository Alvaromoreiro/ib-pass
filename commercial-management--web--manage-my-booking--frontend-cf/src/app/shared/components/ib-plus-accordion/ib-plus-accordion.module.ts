import { NgModule } from '@angular/core';
import { IbPlusAccordionComponent } from './ib-plus-accordion/ib-plus-accordion.component';
import {
    IbPlusAccordionTabComponent, IbPlusAccordionTabContentDirective,
    IbPlusAccordionTabHeaderDirective
} from './ib-plus-accordion-tab/ib-plus-accordion-tab.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    declarations: [
        IbPlusAccordionComponent,
        IbPlusAccordionTabComponent,
        IbPlusAccordionTabHeaderDirective,
        IbPlusAccordionTabContentDirective
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [
        IbPlusAccordionComponent,
        IbPlusAccordionTabComponent,
        IbPlusAccordionTabHeaderDirective,
        IbPlusAccordionTabContentDirective
    ]
})
export class IbPlusAccordionModule { }
