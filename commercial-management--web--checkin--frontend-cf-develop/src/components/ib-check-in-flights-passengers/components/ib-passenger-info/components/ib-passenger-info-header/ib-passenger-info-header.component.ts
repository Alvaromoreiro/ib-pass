import { Component, Inject, Input } from '@angular/core';
import { AJSRootScope, downgradeToAJSComponent } from 'ib-web-commons/utils';

import { IbPassengerInfo } from '@src/app/core/models/ib-check-in-flights-passengers/ib-passenger-info.model';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';

@Component({
    selector: 'ib-passenger-info-header',
    templateUrl: './ib-passenger-info-header.component.html',
    styleUrls: ['./ib-passenger-info-header.component.scss']
})
export class IbPassengerInfoHeaderComponent {
    @Input() passengerInfo: IbPassengerInfo;
    @Input() index: number;
    @Input() isOpen: boolean;

    isBpSubscriptionMode: boolean = false;
    tooltipTemplate: string = '';

    constructor (
        private IbUtilsService: IbUtilsService,
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope
    ) {
        this.isBpSubscriptionMode = this.IbUtilsService.getBpSubscriptionMode();
        this.tooltipTemplate = `${this.$rootScope.routes.templates}gender-selector-view.html`;
    }
}

downgradeToAJSComponent(
    'ibPassengerInfoHeader',
    {
        component: IbPassengerInfoHeaderComponent
    },
    'ib-passenger-info-module'
);
