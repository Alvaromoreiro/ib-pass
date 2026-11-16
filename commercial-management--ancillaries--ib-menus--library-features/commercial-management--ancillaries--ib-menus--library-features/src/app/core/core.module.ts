import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';
import {IbCPipeModule} from 'ib-web-commons/pipes';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        TranslateModule,
        HttpClientModule,
        IbCPipeModule
    ],
    providers: [],
    exports: []
})
export class CoreModule {}