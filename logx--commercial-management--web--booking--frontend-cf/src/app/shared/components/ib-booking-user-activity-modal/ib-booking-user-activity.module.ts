import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { UserActivityModalComponent } from './ib-booking-user-activity-modal.component';
import { IbActivityMoreInfoComponent } from './components/ib-activity-more-info/ib-activity-more-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { UserActivityModalUtilsService } from './services/ib-user-activity-modal-utils.service';


const components = [
    UserActivityModalComponent,
    IbActivityMoreInfoComponent
];

@NgModule({
    declarations: components,
    imports: [
        TranslateModule,
        CommonModule
    ],
    exports: components,
    providers: [
        UserActivityModalUtilsService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserActivityModule { }
