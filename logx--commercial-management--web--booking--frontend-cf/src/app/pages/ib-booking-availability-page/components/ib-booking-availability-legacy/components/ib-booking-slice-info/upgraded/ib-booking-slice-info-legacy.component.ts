import { Directive, ElementRef, Injector, Input } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({selector: 'ib-booking-slice-info-legacy'})
export class IbBookingAvailabilitySliceInfoLegacyDirective extends UpgradeComponent {
    //Legacy bindings
    @Input() sliceInfoModel:  AvailabilityTransformerModel.Slice;
    @Input() selectedSliceIndex:  number;
    @Input() showFaresSelected:  boolean;
    @Input() origin:  string;
    @Input() destination:  string;
    @Input() originDestinationId:  string;
    @Input() currencies: AvailabilityTransformerModel.CurrenciesObject;
    @Input() currentOriginDestinationIndex:  number;
    @Input() selectedSlicesLength:  number;
    @Input() animationRun:  boolean;
    @Input() selectedSliceMode:  boolean;
    @Input() metaSearchInfo?:  boolean;
    @Input() recommendedOfferId?:  string;
    @Input() multiCity?:  boolean;
    @Input() redemption?: boolean;
    @Input() flightRatio:  string;
    constructor (elementRef: ElementRef, injector: Injector) {
        // We must pass the name of the directive as used by AngularJS to the super
        super('ibBookingSliceInfo', elementRef, injector);
    }
}
