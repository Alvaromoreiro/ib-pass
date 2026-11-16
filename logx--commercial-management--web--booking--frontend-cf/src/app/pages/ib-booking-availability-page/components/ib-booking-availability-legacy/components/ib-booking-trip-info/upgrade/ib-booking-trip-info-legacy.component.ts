import { Directive, ElementRef, Injector, Input } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({ selector: 'ib-booking-trip-info' })
export class IbBookingTripInfoLegacyDirective extends UpgradeComponent {
    @Input() tripInfoModel!: AvailabilityTransformerModel.OriginDestination;
    @Input() showAdaptativeMobileFlow?: boolean;
    @Input() currencies?: AvailabilityTransformerModel.CurrenciesObject;
    @Input() animationRun?: boolean;
    @Input() selectedSlicesLength?: number;
    @Input() currentOriginDestinationIndex?: number;
    @Input() redemption?: boolean;
    @Input() template?: string;

    constructor (elementRef: ElementRef, injector: Injector) {
        super('ibBookingTripInfo', elementRef, injector);
    }
}