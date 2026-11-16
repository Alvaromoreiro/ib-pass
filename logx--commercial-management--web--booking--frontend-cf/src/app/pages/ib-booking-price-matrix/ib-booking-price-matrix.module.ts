import './lazyImports';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IbBookingPriceMatrixLegacyDirective, IbBookingPriceMatrixUpgradedComponent } from './ib-booking-price-matrix.directive';
import { IbBookingPriceMatrixRoutingModule } from '@src/app/core/routing/modules/ib-booking-price-matrix-routing.module';

@NgModule({
    declarations: [
        IbBookingPriceMatrixLegacyDirective,
        IbBookingPriceMatrixUpgradedComponent
    ],
    imports: [
        CommonModule,
        IbBookingPriceMatrixRoutingModule
    ],
    providers: [
    ]
})
export class IbBookingPriceMatrixModule {
    constructor (){
      
        
        
    }
}