import { Directive, ElementRef, Injector, Input } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({
    selector: 'ib-biometric-boarding-box'
})
export class IbBiometricBoardingBoxUpgradeComponentDirective extends UpgradeComponent {
    @Input() icon: string;
    @Input() text: string;
    @Input() textStrong: string;
    @Input() iconModifier: string;
    @Input() modifier: string;
    @Input() hasButton: boolean;
    @Input() buttonText: string;
    @Input() buttonNagation: string;

    constructor (elementRef: ElementRef, injector: Injector) {
        super('ibBiometricBoardingBox', elementRef, injector);
    }
}