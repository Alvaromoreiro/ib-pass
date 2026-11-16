import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { IbFlexibilizationInfoVoucherDigitalComponent } from './ib-flexibilization-info-voucher-digital.component';
import { SharedModule } from '@src/app/shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		BrowserModule,
		TranslateModule,
		NgbModule,
		NgbAccordionModule,
		SharedModule
	],
	declarations: [
		IbFlexibilizationInfoVoucherDigitalComponent
	],
	exports: [
		IbFlexibilizationInfoVoucherDigitalComponent
	]
})

export class IbFlexibilizationInfoVoucherDigitalModule { }
export { IbFlexibilizationInfoVoucherDigitalComponent } from './ib-flexibilization-info-voucher-digital.component';
