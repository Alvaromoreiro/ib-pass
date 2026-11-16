import { Directive, ElementRef, Injector, Input } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({selector: 'ib-booking-fare-details-legacy'})
export class IbBookingFareDetailsLegacyDirective extends UpgradeComponent {
    //Legacy bindings
    @Input() sliceDetailsInfoModel:  AvailabilityTransformerModel.Slice;
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
    @Input() isLastFare;
    @Input() flightRatio;
    @Input() marketingCarrier;
    constructor (elementRef: ElementRef, injector: Injector) {
        super('ibBookingFareDetails', elementRef, injector);
    }
    // We must pass the name of the directive as used by AngularJS to the super
}