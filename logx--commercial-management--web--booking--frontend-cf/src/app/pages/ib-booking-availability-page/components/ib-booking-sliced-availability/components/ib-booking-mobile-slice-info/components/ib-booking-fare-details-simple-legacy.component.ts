import { Directive, ElementRef, Injector, Input } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({selector: 'ib-booking-fare-details-simple-legacy'})
export class IbBookingFareDetailsSimpleLegacyDirective extends UpgradeComponent {
    //Legacy bindings
    @Input() fareInfo;
    @Input() isSelected;
    @Input() fareIndex;
    @Input() currencies;
    @Input() selectedFare;
    @Input() selectedCabin;
    @Input() selectedSliceIndex;
    @Input() selectedSegmentIndex;
    @Input() originDestinationId;
    @Input() metaSearchInfo;
    @Input() recommendedOfferId;
    @Input() multiCity;
    @Input() redemption;
    @Input() rateHighlighted;
    @Input() expensivePriceShown;
    @Input() flightRatio;
    constructor (elementRef: ElementRef, injector: Injector) {
        super('ibBookingFareDetailsSimple', elementRef, injector);
    }
    // We must pass the name of the directive as used by AngularJS to the super
}
