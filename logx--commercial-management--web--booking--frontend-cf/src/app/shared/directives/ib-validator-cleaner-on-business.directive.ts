import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[ibValidatorCleanerOnBusiness]'
})
export class IbValidatorCleanerOnBusinessDirective {
    @Input('ibValidatorCleanerOnBusiness') prefix: string = '';

    private readonly cleanerPattern = /[^0-9]/g;

    constructor (private el: ElementRef, private control: NgControl) {}

    @HostListener('input', ['$event'])
    onInput (event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value || '';

        let cleaned = value.replace(this.cleanerPattern, '');

        if (this.prefix) {
            cleaned = this.prefix + cleaned;
        }

        if (cleaned !== value) {
            this.control.control?.setValue(cleaned, { emitEvent: false });
            input.value = cleaned;
        }
    }
}