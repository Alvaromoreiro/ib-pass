import '../ib-booking-payments-page/ajs-templates-module';
import { NgModule } from '@angular/core';
import { IbPaymentsAppModule } from 'ib-web-payments';
import { IbBookingPmtCommunicationLostComponent, IbBookingPmtCommunicationLostLegacyDirective } from './ib-booking-pmt-communication-lost.directive';
import { IbBookingPmtCommunicationLostRoutingModule } from '@src/app/core/routing/modules/ib-booking-pmt-communication-lost-routing.module';
const upgradedProviders = [
];
@NgModule({
    declarations: [
        IbBookingPmtCommunicationLostComponent,
        IbBookingPmtCommunicationLostLegacyDirective
    ],
    imports: [
        IbPaymentsAppModule,
        IbBookingPmtCommunicationLostRoutingModule
        
    ],
    providers: [
        ...upgradedProviders
    ]
})
export class IbBookingPmtCommunicationLostModule {


}