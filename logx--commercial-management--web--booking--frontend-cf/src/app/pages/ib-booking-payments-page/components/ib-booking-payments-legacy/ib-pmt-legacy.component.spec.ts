import { UpgradeComponent } from '@angular/upgrade/static';

import { IbPmtComponentLegacyDirective } from './ib-pmt-legacy.component';

describe('IbPmtComponentLegacyDirective', () => {
    let directive: IbPmtComponentLegacyDirective;

    beforeEach(() => {
        // Avoid running UpgradeComponent constructor internals in a unit test.
        directive = Object.create(IbPmtComponentLegacyDirective.prototype) as IbPmtComponentLegacyDirective;
    });

    it('should create', () => {
        expect(directive).toBeTruthy();
    });

    it('should extend UpgradeComponent', () => {
        expect(IbPmtComponentLegacyDirective.prototype instanceof UpgradeComponent).toBeTrue();
    });

    it('should allow setting asComponent input', () => {
        directive.asComponent = true;

        expect(directive.asComponent).toBeTrue();
    });
});
