import { NgModule } from '@angular/core';
import { MainFooterComponent } from './ib-main-footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { IbCPipeModule } from 'ib-web-commons/pipes';
import { CommonModule } from '@angular/common';


@NgModule({

    declarations:[
        MainFooterComponent
    ],
    exports:[
        MainFooterComponent
    ],
    imports:[
        TranslateModule,
        IbCPipeModule,
        CommonModule
    ]


})


export class IbMainFooterModule { }
