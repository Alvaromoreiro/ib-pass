import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { IbBookingHeaderBasketComponent } from './ib-booking-header-basket.component';
import { IbBasketTransformerService } from './services/ib-booking-header-basket-transformer.service';
import { ShoppingBasketViewModelService } from './shared/services/ib-booking-header-basket-view-model.service';
import { OthersFeesViewModelService } from './shared/services/ib-booking-header-other-fees-view-model.service';
import { IbBasketSectionTransformerService } from './shared/services/ib-booking-header-basket-section-transformer.service';
import { IbBookingHeaderBasketBaggagesComponent } from './shared/components/ib-booking-header-basket-baggages/ib-booking-header-basket-baggages.component';
import { IbBookingHeaderBasketSectionComponent } from './shared/components/ib-booking-header-basket-section/ib-booking-header-basket-section.component';
import { DatalayerBasketService } from './shared/services/ib-booking-header-basket-datalayer.service';
import { IbBookingHeaderBasketBundleComponent } from './shared/components/ib-booking-header-basket-bundle/ib-booking-header-basket-bundle.component';
import { IbBookingHeaderBasketCarbonFootprintComponent } from './shared/components/ib-booking-header-basket-carbon-footprint/ib-booking-header-basket-carbon-footprint.component';
import { IbBookingHeaderBasketDiscountsComponent } from './shared/components/ib-booking-header-basket-discounts/ib-booking-header-basket-discounts.component';
import { IbBookingHeaderBasketInsurancesComponent } from './shared/components/ib-booking-header-basket-insurances/ib-booking-header-basket-insurances.component';
import { IbBookingHeaderBasketOtherFeesComponent } from './shared/components/ib-booking-header-basket-other-fees/ib-booking-header-basket-other-fees.component';
import { IbBookingHeaderBasketPetcComponent } from './shared/components/ib-booking-header-basket-petc/ib-booking-header-basket-petc.component';
import { IbBookingHeaderBasketPriorityComponent } from './shared/components/ib-booking-header-basket-priority/ib-booking-header-basket-priority.component';
import { IbBookingHeaderBasketSeatsComponent } from './shared/components/ib-booking-header-basket-seats/ib-booking-header-basket-seats.component';
import { IbBookingHeaderBasketSpeqsComponent } from './shared/components/ib-booking-header-basket-speqs/ib-booking-header-basket-speqs.component';
import { IbBookingHeaderBasketTripsComponent } from './shared/components/ib-booking-header-basket-trips/ib-booking-header-basket-trips.component';
import { IbBookingHeaderBasketUpgradingComponent } from './shared/components/ib-booking-header-basket-upgrading/ib-booking-header-basket-upgrading.component';
import { IbBookingHeaderBasketTransfersGlobickComponent } from './shared/components/ib-booking-header-basket-transfers-globick/ib-booking-header-basket-transfers-globick.component';
import { IbBookingHeaderBasketInsurancesAllianzFusionComponent } from './shared/components/ib-booking-header-basket-insurances-allianz-fusion/ib-booking-header-basket-insurances-allianz-fusion.component';
import { IbBookingSharedModule } from '@shared/ib-booking-shared.module';
import { IbBookingHeaderBasketAssistCardComponent } from './shared/components/ib-booking-header-basket-assist-card/ib-booking-header-basket-assist-card.component';

const exportableComponents = [
    IbBookingHeaderBasketComponent
];

@NgModule({
    imports: [
        TranslateModule,
        FormsModule,
        CommonModule,
        IbBookingSharedModule
    ],
    exports: [
        ...exportableComponents
    ],
    declarations: [
        ...exportableComponents,
        IbBookingHeaderBasketBaggagesComponent,
        IbBookingHeaderBasketSectionComponent,
        IbBookingHeaderBasketBundleComponent,
        IbBookingHeaderBasketCarbonFootprintComponent,
        IbBookingHeaderBasketDiscountsComponent,
        IbBookingHeaderBasketInsurancesComponent,
        IbBookingHeaderBasketOtherFeesComponent,
        IbBookingHeaderBasketPetcComponent,
        IbBookingHeaderBasketPriorityComponent,
        IbBookingHeaderBasketSeatsComponent,
        IbBookingHeaderBasketSpeqsComponent,
        IbBookingHeaderBasketTripsComponent,
        IbBookingHeaderBasketUpgradingComponent,
        IbBookingHeaderBasketTransfersGlobickComponent,
        IbBookingHeaderBasketInsurancesAllianzFusionComponent,
        IbBookingHeaderBasketAssistCardComponent
    ],
    providers: [
        IbBasketTransformerService,
        ShoppingBasketViewModelService,
        OthersFeesViewModelService,
        IbBasketSectionTransformerService,
        DatalayerBasketService
    ]
})
export class IbBookingHeaderBasketModule {}
