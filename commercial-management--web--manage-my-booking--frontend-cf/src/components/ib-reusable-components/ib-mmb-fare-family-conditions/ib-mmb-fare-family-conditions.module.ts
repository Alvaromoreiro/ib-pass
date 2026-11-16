import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UpgradeModule } from '@angular/upgrade/static';
import {IbMmbFareFamilyConditionsComponent} from './ib-mmb-fare-family-conditions.component';
import { IbCPipeModule } from 'ib-web-commons/pipes';

@NgModule({
  declarations: [
    IbMmbFareFamilyConditionsComponent
  ],
  exports:[
    IbMmbFareFamilyConditionsComponent
  ],
  imports: [
    CommonModule,
    UpgradeModule,
    TranslateModule,
    IbCPipeModule
  ]
})
export class IbMmbFareFamilyConditionsModule { }
export { IbMmbFareFamilyConditionsComponent } from './ib-mmb-fare-family-conditions.component';
