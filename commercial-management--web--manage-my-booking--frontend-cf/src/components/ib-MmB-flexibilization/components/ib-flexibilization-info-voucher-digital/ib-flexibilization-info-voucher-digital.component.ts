import { Component, OnInit } from "@angular/core";
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
  selector: 'ib-flexibilization-info-voucher-digital',
  templateUrl: './ib-flexibilization-info-voucher-digital.component.html'
})

export class IbFlexibilizationInfoVoucherDigitalComponent implements OnInit {
  public openInfo: boolean = true;

  constructor() {}

  ngOnInit = (): void => {
    this.openInfo = true;
  };
}

downgradeToAJSComponent('ibFlexibilizationInfoVoucherDigital', {
  component: IbFlexibilizationInfoVoucherDigitalComponent,
  inputs: []
}, 'ib-flexibilization-info-voucher-digital-module');
