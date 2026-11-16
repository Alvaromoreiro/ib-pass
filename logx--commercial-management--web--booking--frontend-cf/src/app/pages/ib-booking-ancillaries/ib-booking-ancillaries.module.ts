import './lazyImports';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IbBookingAncillariesLegacyDirective, IbBookingAncillariesUpgradedComponent } from './ib-booking-ancillaries-legacy.directive';
import { IbBookingAncillariesPageRoutingModule } from '@src/app/core/routing/modules/ib-booking-ancillaries-page-routing.module';
import { IbAncillariesAppModule } from 'ib-web-ancillaries';



@NgModule({
    declarations: [
        IbBookingAncillariesLegacyDirective,
        IbBookingAncillariesUpgradedComponent
    ],
    imports: [
        CommonModule,
        IbAncillariesAppModule,
        IbBookingAncillariesPageRoutingModule
    ],
    providers: []
})
export class IbBookingAncillariesModule {
    constructor (){
      
        
        
    }
}