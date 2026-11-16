import { Directive, ElementRef, Injector, Component } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';
const selectorBase = 'ib-booking-price-matrix-page';
const dirSelector = selectorBase+'-legacy';
const compSelector = selectorBase+'-upgraded';
const angularJSCompSelector = 'ibBookingPriceMatrixPage';





@Directive({selector: dirSelector})
export class IbBookingPriceMatrixLegacyDirective extends UpgradeComponent {

    constructor (elementRef: ElementRef, injector: Injector) {
        // We must pass the name of the directive as used by AngularJS to the super

        super(angularJSCompSelector, elementRef, injector);
    }
}


@Component({
    selector: compSelector,
    template: `<${dirSelector}/>`
})
export class IbBookingPriceMatrixUpgradedComponent {}
