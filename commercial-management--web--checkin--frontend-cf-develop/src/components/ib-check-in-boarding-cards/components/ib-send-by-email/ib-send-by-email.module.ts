import { IbSendByEmailComponent } from './ib-send-by-email.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        IbSendByEmailComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        NgbNavModule
    ]

})
export class IbSendByEmailModule {
}
