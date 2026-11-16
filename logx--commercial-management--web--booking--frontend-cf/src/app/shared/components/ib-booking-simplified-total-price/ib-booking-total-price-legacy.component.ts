import { Directive, ElementRef, EventEmitter, Injector, Input, Output } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';
import './ib-booking-simpified-total-price';

@Directive({selector: 'ib-booking-total-price-legacy'})
export class IbBookingTotalPriceDirective extends UpgradeComponent {
    //Legacy bindings
    @Input() aviosToEarn?: string;
    @Input() changePassengers?: boolean;
    @Input() conditionsText?: any;
    @Input() conditionsTextOffers?: string;
    @Input() elitePointsToEarn?: string;
    @Input() explanationText?: string;
    @Input() fareRate?: any;
    @Input() isChecked?: boolean;
    @Input() noDiscountObPrice?: boolean;
    @Input() obDiscount?: string;
    @Input() obPoints?: string;
    @Input() redemption?: boolean;
    @Input() selectedLargefamDiscount?: string;
    @Input() selectedResidentDiscount?: string;
    @Input() showDiscount?: boolean;
    @Input() showLocaldiscountWarn?: boolean;
    @Input() showObpoints?: boolean;
    @Input() totalPointsNeeded?: boolean;
    @Input() totalPrice?: string;
    @Input() continueText?: string;
    @Input() withoutAviosMoney?: boolean;
    @Input() isAncillaries?: boolean;
    @Output() continueEvent = new EventEmitter<string>();
    constructor (elementRef: ElementRef, injector: Injector) {
        // We must pass the name of the directive as used by AngularJS to the super
        super('ibBookingSimplifiedTotalPrice', elementRef, injector);
        elementRef.nativeElement.addEventListener('continueEventFlow', (event: CustomEvent) => {
            event.stopPropagation();
            this.continueEvent.emit();
        });
    }

}
