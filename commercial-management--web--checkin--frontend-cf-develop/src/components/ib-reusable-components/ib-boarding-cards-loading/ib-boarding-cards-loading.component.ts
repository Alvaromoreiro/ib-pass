import { Component, Input } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';


@Component({
    selector: 'ib-boarding-cards-loading',
    templateUrl: './ib-boarding-cards-loading.component.html',
    styleUrls: ['./ib-boarding-cards-loading.component.scss']
})
export class IbBoardingCardsLoadingComponent  {

    @Input() sending;
    @Input() sendOk;
    @Input() sendError;

    constructor () {

    }
}
downgradeToAJSComponent('ibBoardingCardsLoading', { component: IbBoardingCardsLoadingComponent }, 'ib-boarding-cards-loading-module');
