import './lazyImports';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IbNotAvailabilityLegacyDirective, IbNotAvailabilityUpgradedComponent } from './ib-not-availability-legacy.directive';
import { IbNotAvailabilityPageRoutingModule } from '@src/app/core/routing/modules/ib-not-availability-page-routing.module';
import { IbBackgroundComponent } from '@src/app/shared/components/ib-background/ib-background.component';

@NgModule({
    declarations: [
        IbNotAvailabilityLegacyDirective,
        IbNotAvailabilityUpgradedComponent
    ],
    imports: [
        CommonModule,
        IbNotAvailabilityPageRoutingModule,
        IbBackgroundComponent
    ],
    providers: [
    ]
})
export class IbNotAvailabilityModule {
    constructor (){
      
        
        
    }
}
