import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'ib-accordion-container',
    templateUrl: './ib-accordion-container.component.html',
    styleUrls: ['./ib-accordion-container.component.scss']
})
export class IbAccordionContainerComponent {
    @Input() iconPassenger: string;
    @Input() passengerName: string;
    @Input() passengerStatus: string;
    @Input() isOpen!: boolean;
    @Input() isNOAPI: boolean = false;
    @Output() toggle = new EventEmitter<void>();

    constructor (private TranslateService: TranslateService) {}

    getStatus () {
        return this.TranslateService.instant(this.passengerStatus);
    }
}
