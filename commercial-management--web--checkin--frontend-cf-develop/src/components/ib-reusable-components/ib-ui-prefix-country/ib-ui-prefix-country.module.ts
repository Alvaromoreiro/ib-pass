import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IbUiPrefixCountryComponent } from './ib-ui-prefix-country.component';

@NgModule({
    declarations: [
        IbUiPrefixCountryComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        NgbModule,
        FormsModule
    ]
})
export class IbUiPrefixCountryModule {
}
