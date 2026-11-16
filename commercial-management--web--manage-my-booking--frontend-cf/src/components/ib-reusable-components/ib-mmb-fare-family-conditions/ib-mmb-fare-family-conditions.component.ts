import { MmBAppConstants } from '@src/ib-MmB-constants';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { AJSMmbModalService, MmbModalServiceType } from '@src/components/ib-reusable-components/ib-MmB-modal/services/upgraded/ib-Mmb-modal-service-bridge.service';

@Component({
  selector: 'ib-mmb-fare-family-conditions',
  templateUrl: './ib-mmb-fare-family-conditions.component.html',
})

export class IbMmbFareFamilyConditionsComponent implements OnInit {
    @Input() public segment;
    conditionItems = [];
    isOnbLogged: boolean;

    constructor (
        @Inject(AJSMmbModalService) private MmBModalService: MmbModalServiceType,
        private CommonsSessionStorageService: CommonsSessionStorageService,
    ) {}

    ngOnInit() {
        this.checkCondition(this.segment.fareFamilyConditions, this.segment);
    }

    getFareFamilyIcon = (code) =>{
        return MmBAppConstants.FARE_FAMILY_ICON_PROPERTY_CODE[code];
    }

    checkCondition = (fareFamilyConditions, segment): any[] => {
        const userLogged = this.CommonsSessionStorageService.get('userLogged');
        this.isOnbLogged = userLogged === MmBAppConstants.LOGIN_ONB;
        fareFamilyConditions.forEach(condition => {
            if (this.isOnbLogged && condition.code === 'AVIO') return;
            if (condition.title && condition.code && !(condition.code === 'ASIENTOXL' && segment.upgradingBids)) this.conditionItems.push(condition);
        });
        return this.conditionItems;
    }

    openModalConditions = (event, segmentSelected) => {
        event.preventDefault();
        segmentSelected.forEach((condition) => {
            condition.icon = MmBAppConstants.FARE_FAMILY_ICON_PROPERTY_CODE[condition.code];
        });
        this.openFareWindowModal(segmentSelected)
    }

    openFareWindowModal = (selectedFareInfo) => {
        Object.assign(selectedFareInfo,{idModal: 'ib-compare-fares-modal'});
        this.MmBModalService.showGenericModal(false, 'ib-compare-fares-modal.html', { 'selectedFareInfo': selectedFareInfo }, null).result.then(()=>{}, ()=>{});
    }

    trackByFn = (index:number) => {
        return index; // or item.id
    };

}

downgradeToAJSComponent('ibMmbFareFamilyConditions', {
    component: IbMmbFareFamilyConditionsComponent,
    inputs: ['segment']
}, 'ib-reusable-components-module');
