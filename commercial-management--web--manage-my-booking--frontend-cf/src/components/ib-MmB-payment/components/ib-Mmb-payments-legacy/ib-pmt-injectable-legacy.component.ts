import { Directive, ElementRef, Injector, Input } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({selector: 'ib-mmb-pmt-injectable-component-legacy'})
export class IbPmtInjectableComponentLegacyDirective extends UpgradeComponent {
    //Legacy bindings
    @Input() asComponent?: boolean;

    constructor (elementRef: ElementRef, injector: Injector) {
        // We must pass the name of the directive as used by AngularJS to the super
        super('ibPmtInjectable', elementRef, injector);
    }
}
