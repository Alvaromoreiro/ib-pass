import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { IbCGenericModalComponent } from './components/generic-modal/ib-commons-generic-modal.component';
import { IbCGenericErrorModalComponent } from './components/generic-error-modal/ib-commons-generic-error-modal.component';
import { IbCModalService } from './services/ib-commons-modal.service';
import {
    IbCChangeStatusUserModalComponent
} from './components/change-status-user-modal/ib-commons-change-status-user-modal.component';
import { DatalayerUtilsProvider } from 'ib-web-commons/ib-datalayer';
import { IbCDirectivesModule } from 'ib-web-commons/directives';
import { IbCOtpErrorModalComponent } from './components/otp-error-modal/ib-otp-error-modal.component';

@NgModule({
    declarations: [
    IbCGenericModalComponent,
    IbCGenericErrorModalComponent,
    IbCChangeStatusUserModalComponent,
    IbCOtpErrorModalComponent
    ],
    exports: [
    IbCGenericModalComponent,
    IbCGenericErrorModalComponent,
    IbCChangeStatusUserModalComponent,
    IbCOtpErrorModalComponent
    ],
    imports: [
    CommonModule,
    TranslateModule,
    NgbModalModule,
    IbCDirectivesModule
    ],
    providers: [
    IbCModalService,
    DatalayerUtilsProvider
    ]
    })
export class IbCModalModule {}
export {
    IbCChangeStatusUserModalComponent,
    IbCGenericErrorModalComponent,
    IbCGenericModalComponent,
    IbCOtpErrorModalComponent
};
