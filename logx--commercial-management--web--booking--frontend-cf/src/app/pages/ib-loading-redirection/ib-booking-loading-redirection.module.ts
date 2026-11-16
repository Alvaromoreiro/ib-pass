import './lazyImports';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IbBookingLoadingRedirectionLegacyDirective, IbBookingLoadingRedirectioUpgradedComponent } from './ib-booking-loading-redirectionr-legacy.directive';
import { IbBookingLoadingRedirectionPageRoutingModule } from '@src/app/core/routing/modules/ib-booking-loading-redirection-page-routing.module';

@NgModule({
    declarations: [
        IbBookingLoadingRedirectionLegacyDirective,
        IbBookingLoadingRedirectioUpgradedComponent
    ],
    imports: [
        CommonModule,
        IbBookingLoadingRedirectionPageRoutingModule
    ],
    providers: [
    ]
})
export class IbBookingLoadingRedirectionModule {
    constructor (){
      
        
        
    }
}