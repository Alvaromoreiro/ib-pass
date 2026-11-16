import { Component, Input } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-booking-passenger-warning-message',
    templateUrl: './ib-booking-passenger-warning-message.component.html'
})
export class IbBookingPassengerWarningMessageComponent {
    @Input() warningMessageInfo;
}

downgradeToAJSComponent(
    'ibBookingPassengerWarningMessage',
    { component: IbBookingPassengerWarningMessageComponent,
        inputs: ['warningMessageInfo'] },
    'ib-booking-passenger-info-module'
);
