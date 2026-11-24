import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { LiteralFormatterPipe } from './pipes/literalFormatter.pipe';
import { IbAccordionComponent } from './components/ib-accordion-component/ib-accordion.component';
import { CommonModule } from '@angular/common';

const components = [
    LiteralFormatterPipe,
    IbAccordionComponent
];
@NgModule({
    declarations: components,
    imports: [
        NgbModule,
        TranslateModule,
        CommonModule
    ],
    providers: [
        LiteralFormatterPipe
    ],
    exports: components
})

export class SharedModule { }
