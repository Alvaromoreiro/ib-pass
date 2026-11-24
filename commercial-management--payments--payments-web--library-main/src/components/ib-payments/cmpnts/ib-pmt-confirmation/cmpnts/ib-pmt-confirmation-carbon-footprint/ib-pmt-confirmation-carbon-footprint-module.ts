import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbPmtConfirmationCarbonFootprintComponent } from './ib-pmt-confirmation-carbon-footprint.component';
import { IbCPipeModule } from 'ib-web-commons/pipes';

@NgModule({
    imports:[
        CommonModule,
        TranslateModule,
        IbCPipeModule
    ],
    declarations:[
        IbPmtConfirmationCarbonFootprintComponent
    ],
    exports:[
        IbPmtConfirmationCarbonFootprintComponent
    ]
})

export class IbPmtConfirmationCarbonFootprintModule { }
export { IbPmtConfirmationCarbonFootprintComponent } from './ib-pmt-confirmation-carbon-footprint.component';