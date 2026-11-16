import '../ib-booking-payments-page/ajs-templates-module';
import { NgModule } from '@angular/core';
import { IbPaymentsAppModule } from 'ib-web-payments';
import { IbBookingPmtConfirmationLegacyDirective, IbBookingPmtConfirmationComponent } from './ib-booking-confirmation-upgraded.directive';
import { IbBookingConfirmationRoutingModule } from '@src/app/core/routing/modules/ib-confirmation-page-routing.module';
const upgradedProviders = [
];
@NgModule({
    declarations: [
        IbBookingPmtConfirmationLegacyDirective,
        IbBookingPmtConfirmationComponent
    ],
    imports: [
        IbPaymentsAppModule,
        IbBookingConfirmationRoutingModule
        
    ],
    providers: [
        ...upgradedProviders
    ]
})
export class IbBookingConfirmationModule {


}