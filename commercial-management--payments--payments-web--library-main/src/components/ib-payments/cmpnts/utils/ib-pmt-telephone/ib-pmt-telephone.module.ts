import { NgModule } from '@angular/core';
import { IbPmtTelephone} from './ib-pmt-telephone.components';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IbCDirectivesModule } from 'ib-web-commons/directives';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({

    imports:[
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        AutoCompleteModule,
        IbCDirectivesModule
    ],
    declarations:[
        IbPmtTelephone
    ],
    exports:[
        IbPmtTelephone
    ]
   


})


export class IbPmtTelephoneModule { }
export { IbPmtTelephone} from './ib-pmt-telephone.components';
