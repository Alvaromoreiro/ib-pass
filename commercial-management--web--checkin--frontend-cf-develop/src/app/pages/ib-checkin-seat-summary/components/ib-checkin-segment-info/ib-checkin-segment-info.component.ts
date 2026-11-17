import { Component, Inject, Input } from '@angular/core';
import { IRootScopeExt } from '@src/app/core/models/generic-models/generic-models';
import { AJSRootScope, downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-checkin-segment-info',
    templateUrl: './ib-checkin-segment-info.component.html',
    styleUrls: ['./ib-checkin-segment-info.scss']
})
export class IbCheckinSegmentInfoComponent {
    @Input() segmentInfo: CkiSeatSummary.ISegment;
    lang: string;
    market: string;

    constructor (
        @Inject(AJSRootScope) private $rootScope: IRootScopeExt
    ) {
        this.lang = this.$rootScope.appLang ?? 'es';
        this.market = this.$rootScope.appMarket ?? 'es';
    }

    getFormatDate (dateString: string) {
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const day = date.getUTCDate();
        const formatDateConfig = new Intl.DateTimeFormat(this.lang, {
            month: 'short'
        });

        if (this.market === 'US') {
            return `${formatDateConfig.format(new Date(date))} ${day} ${year}`;
        }

        return `${day} ${formatDateConfig.format(new Date(date))} ${year}`;
    }
}

downgradeToAJSComponent(
    'ibCheckinSegmentInfo',
    {
        component: IbCheckinSegmentInfoComponent
    },
    'ib-checkin-seat-summary-page-module',
    []
);
