import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IbMmbManagePetcInfoComponent } from './ib-MmB-manage-petc-info.component';
import { IbMmbManagePetcInfoModalComponent } from './components/ib-MmB-manage-petc-info-modal/ib-MmB-manage-petc-info-modal.component';
import { IbMmbManagePetcInfoTransformerService } from './transformer/ib-MmB-manage-petc-info-transformer.service';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        NgbModule
    ],
    declarations: [
        IbMmbManagePetcInfoComponent,
        IbMmbManagePetcInfoModalComponent
    ],
    exports: [
        IbMmbManagePetcInfoComponent,
        IbMmbManagePetcInfoModalComponent 
    ],
    providers: [
        IbMmbManagePetcInfoTransformerService
    ]
})
export class IbMmbManagePetcInfoModule {}
export { IbMmbManagePetcInfoComponent } from './ib-MmB-manage-petc-info.component';