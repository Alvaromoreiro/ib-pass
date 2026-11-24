import { Component, Inject, Input, OnInit } from '@angular/core';
import { downgradeToAJSComponent, CommonsSessionStorageService, AJSRootScope } from 'ib-web-commons/utils';
import { Passengers } from 'src/app/core/models/ib-pmt-summary-model';

@Component({
    selector: 'ib-pmt-bki-summary-passengers',
    templateUrl: './ib-pmt-bki-summary-passengers.component.html',
    styleUrls: ['./ib-pmt-bki-summary-passengers.component.scss']
})
export class IbPmtBkiSummaryPassengersComponent implements OnInit{

    @Input() showPassengersName: boolean;
    @Input() passengers: Passengers;

    public flowApp:string;
    public bookingInfo;
    public flows;

    constructor (private CommonsSessionStorageService: CommonsSessionStorageService, @Inject(AJSRootScope) private $rootScope: CommonsRootScope) { }

    ngOnInit (){
        this.flowApp = this.CommonsSessionStorageService.get('flowApp') || null;
        this.bookingInfo = this.CommonsSessionStorageService.get('bookingInfo');
        this.flows = {
            isRedemptionFlow: this.$rootScope.isRedemptionFlow,
            isPointsOBFlow: this.$rootScope.isPointsOBFlow
        };
    }

    openTaxesModal = (breakdownTaxes) => {
        this.$rootScope.$broadcast('openSummaryModalTaxesEvent', 'ib-modal-payment-taxes.html', breakdownTaxes);
    };

    trackByFn = (index:number) => {
        return index;
    };

}

downgradeToAJSComponent('ibPmtBkiSummaryPassengers', { component: IbPmtBkiSummaryPassengersComponent, inputs: ['showPassengersName', 'passengers']}, 'ib-pmt-summary-module');
