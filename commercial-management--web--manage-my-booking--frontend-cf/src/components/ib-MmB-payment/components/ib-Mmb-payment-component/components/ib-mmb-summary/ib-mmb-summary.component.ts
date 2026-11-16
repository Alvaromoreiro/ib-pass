import { Component, OnInit } from '@angular/core';
import { Summary, SummaryProps } from 'commercial-management--digital--web-components-design--library';
import { IbMmbPaymentFormService } from '../../services/ib-Mmb-payment-form.service';
import { PriceSubscriptionModel } from '@src/components/ib-MmB-payment/models/ib-Mmb-payments-component-model';
import { IbMmbSummaryService } from './services/ib-Mmb-summary.service';

@Component({
    selector: 'ib-mmb-summary',
    template: '<ng-react [component]="Summary" [props]="props"></ng-react>'
})
export class IbMmbSummaryComponent implements OnInit {
    protected readonly Summary = Summary;
    constructor (
        private IbMmBPmtFormService: IbMmbPaymentFormService,
        private IbMmbSummaryService: IbMmbSummaryService
    ) {}

    public props: SummaryProps = {
        ...this.IbMmbSummaryService.getSummaryInfo(),
        isMultiTrip: false,
        upgradingBid: false,
        collapsed: false
    };

    ngOnInit () {
        this.IbMmBPmtFormService.priceUpdateEmitter.subscribe((data: PriceSubscriptionModel) => {
            this.updateSummaryInfo(data);
        });
    }

    private updateSummaryInfo (data: PriceSubscriptionModel): void {
        this.props = this.IbMmbSummaryService.updateSummaryInfo(this.props, data);
    }
}

