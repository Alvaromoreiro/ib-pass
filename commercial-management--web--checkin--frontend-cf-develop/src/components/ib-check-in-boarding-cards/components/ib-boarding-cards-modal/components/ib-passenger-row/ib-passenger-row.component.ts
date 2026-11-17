import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { AJSRootScope } from 'ib-web-commons/utils';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';

@Component({
    selector: 'ib-passenger-row',
    templateUrl: './ib-passenger-row.component.html',
    styleUrls: ['./ib-passenger-row.component.scss']
})
export class IbPassengerRowComponent {
    googleWalletImg: string;

    @Input() passengerInfo: CkiBoardingCardModal.PassengerMap;
    @Output() downloadGWEvent: EventEmitter<CkiBoardingCardModal.DownloadGWEvent> = new EventEmitter();

    constructor (
        @Inject(AJSRootScope) protected rootScope: CommonsRootScope
    ) {
        const lang = this.rootScope.appLang;
        this.googleWalletImg = `${CheckinAppConstants.imagesRoute}/google-wallet/${lang}_google_wallet.svg`;
    }

    download () {
        this.downloadGWEvent.emit({ passengerId: this.passengerInfo.id });
    }
}

