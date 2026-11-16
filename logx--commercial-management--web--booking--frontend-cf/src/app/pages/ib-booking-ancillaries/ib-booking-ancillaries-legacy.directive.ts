import { Directive, ElementRef, Injector, Component } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

const selectorBase = 'ib-booking-ancillaries-page';
const dirSelector = selectorBase+'-legacy';
const compSelector = selectorBase+'-upgraded';

@Directive({selector: dirSelector})
export class IbBookingAncillariesLegacyDirective extends UpgradeComponent {
    constructor (elementRef: ElementRef, injector: Injector) {
        // We must pass the name of the directive as used by AngularJS to the super

        super('ibBookingAncillaries', elementRef, injector);
    }
}


@Component({
    selector: compSelector,
    template: `<${dirSelector}/>`
})
export class IbBookingAncillariesUpgradedComponent {}
