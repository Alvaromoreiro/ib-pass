import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[ibBookingValidatorCleaner]'
})
export class IbBookingValidatorCleanerDirective {

    @Input('ibBookingValidatorCleaner') regex!: string;

    constructor (private ngControl: NgControl) {}

    @HostListener('input', ['$event.target.value'])
    onInputChange (value: string): void {
        const cleanedValue = value.replace(new RegExp(this.regex, 'gi'), '');
        if (cleanedValue !== value) {
            this.ngControl.control?.setValue(cleanedValue);
        }
    }

}
