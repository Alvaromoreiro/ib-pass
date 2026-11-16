import { Component, Input, SimpleChanges } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';
import { IbMmbManageCarbonFootprintInfoService } from './service/ib-MmB-manage-carbonFootprint-info.service';

@Component({
    selector: 'ib-manage-carbon-footprint-info',
    templateUrl: './ib-MmB-manage-carbonFootprint-info-view.component.html'
})
export class IbManageCarbonFootprintComponent {

    @Input() public model;

    constructor(public IbMmbManageCarbonFootprintInfoService: IbMmbManageCarbonFootprintInfoService) {

    }

    navigateCO2Modal() {
        this.IbMmbManageCarbonFootprintInfoService.submitOpenTab(true);
    }
}

downgradeToAJSComponent('ibManageCarbonFootprintInfo', {
    component: IbManageCarbonFootprintComponent,
    inputs: ['model']
}, 'ib-MmB-manage-carbonFootprint-info-module');

