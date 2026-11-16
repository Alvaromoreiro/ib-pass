import {NgModule} from '@angular/core';
import {CoreModule} from '../core/core.module';
import { IbUserInfoHeaderComponent } from './components/ib-user-info-header/ib-user-info-header.component';
import {TranslateModule} from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { IbCPipeModule } from 'ib-web-commons/pipes';


@NgModule({
    declarations: [
        IbUserInfoHeaderComponent
    ],
    exports: [
        IbUserInfoHeaderComponent
    ],
    imports: [
        CoreModule,
        TranslateModule,
        CommonModule,
        IbCPipeModule
    ],
    providers: []
})
export class SharedModule { }
