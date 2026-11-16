import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { IbManageCarbonFootprintComponent } from './ib-MmB-manage-carbonFootprint-info.component';

@NgModule({
    imports:[
        CommonModule,
        BrowserModule,
        TranslateModule
    ],
    declarations:[
        IbManageCarbonFootprintComponent
    ],
    exports:[
        IbManageCarbonFootprintComponent
    ]
})

export class IbManageCarbonFootprintModule { }
export { IbManageCarbonFootprintComponent } from './ib-MmB-manage-carbonFootprint-info.component';
