import './lazyImports';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IbBookingRedirectionMarketLegacyDirective, IbBookingRedirectionMarketUpgradedComponent } from './ib-booking-redirection-market.directive';
import { IbBookingRedirectionMarketRoutingModule } from '@src/app/core/routing/modules/ib-booking-redirection-market-routing.module';

@NgModule({
    declarations: [
        IbBookingRedirectionMarketLegacyDirective,
        IbBookingRedirectionMarketUpgradedComponent
    ],
    imports: [
        CommonModule,
        IbBookingRedirectionMarketRoutingModule
    ],
    providers: [
    ]
})
export class IbBookingRedirectionMarketModule {
    constructor (){
      
        
        
    }
}