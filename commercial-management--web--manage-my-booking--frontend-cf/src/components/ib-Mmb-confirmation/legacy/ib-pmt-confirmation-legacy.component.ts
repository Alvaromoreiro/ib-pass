import { Directive, ElementRef, Injector, Input } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

// Legacy wrapper for AngularJS confirmation directive
// Mirrors the pattern used for payments legacy components
@Directive({ selector: 'ib-mmb-confirmation-component-legacy' })
export class IbMmbConfirmationLegacyDirective extends UpgradeComponent {
    // Allow passing legacy bindings if needed (kept for parity with payments legacy wrappers)
    @Input() asComponent?: boolean;

    constructor(elementRef: ElementRef, injector: Injector) {
        // Name of the AngularJS directive to upgrade
        super('ibPmtConfirmation', elementRef, injector);
    }
}
