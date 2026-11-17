import { Component, OnInit } from '@angular/core';
import { PriceSubscriptionModel } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-component.model';
import { Summary, SummaryProps } from 'commercial-management--digital--web-components-design--library';
import { IbCheckInPmtFormService } from '../../services/ib-checkin-pmt-form.service';
import { IbCheckinSummaryService } from './ib-checkin-summary.service';

@Component({
    selector: 'ib-checkin-summary',
    template: '<ng-react [component]="Summary" [props]="props"></ng-react>'
})
export class IbCheckinSummaryComponent implements OnInit {
    protected readonly Summary = Summary;

    public props: SummaryProps;

    constructor (
        private checkInPmtFormService: IbCheckInPmtFormService,
        private summaryTransformerService: IbCheckinSummaryService
    ) {}

    ngOnInit () {
        this.props = {
            ...this.summaryTransformerService.getSummaryInfo(),
            isMultiTrip: false,
            upgradingBid: false
        };

        this.checkInPmtFormService.priceUpdateEmitter.subscribe((data: PriceSubscriptionModel) => {
            this.updateSummaryInfo(data);
        });
    }

    private updateSummaryInfo (data: PriceSubscriptionModel): void {
        this.props = this.summaryTransformerService.updateSummaryInfo(this.props, data);
    }
}
