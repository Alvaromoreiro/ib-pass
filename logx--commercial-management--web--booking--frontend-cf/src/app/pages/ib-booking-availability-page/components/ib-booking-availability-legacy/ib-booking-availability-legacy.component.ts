import { Directive, ElementRef, EventEmitter, Inject, Injector, Output} from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';
import { AvailabilityTypes } from '@src/app/core/models/ib-booking-availability/slice-by-slice-availability.models';
import { AJSRootScope } from 'ib-web-commons/utils';

@Directive({selector: 'ib-booking-availability-legacy'})
export class IbBookingAvailabilityLegacyDirective extends UpgradeComponent {
    @Output() public redirectToViewType: EventEmitter<AvailabilityTypes> = new EventEmitter<AvailabilityTypes>();
    public onBroadcast;
    constructor (
        elementRef: ElementRef,
        injector: Injector,
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope
    ) {
        // We must pass the name of the directive as used by AngularJS to the super
        super('ibBookingAvailabilityComponent', elementRef, injector);
        this.$rootScope.$on('forceSlicedAvailability', () => {
            this.redirectToViewType.emit(AvailabilityTypes.SLICE_BY_SLICE);
        });
    }

}
