import { Component, ElementRef, Input } from '@angular/core';

@Component({
    selector: 'ib-booking-accordion',
    templateUrl: './ib-booking-accordion.component.html',
    styleUrls: ['./ib-booking-accordion.component.scss']
})
export class IbBookingAccordionComponent {
    @Input() title:string;
    public opened = false;

    constructor (private elementRef: ElementRef){}

    toogleAccordion = () =>{
        const collapsable = this.elementRef.nativeElement.querySelector('.content') as HTMLElement;

        if (!this.opened) {
            collapsable.style.height = collapsable.scrollHeight + 'px';
            setTimeout(() => collapsable.style.height = 'auto', 300);
        } else {
            collapsable.style.height = collapsable.scrollHeight + 'px';
            setTimeout(() => collapsable.style.height = '0px');
        }
        this.opened = !this.opened;
    };
}
