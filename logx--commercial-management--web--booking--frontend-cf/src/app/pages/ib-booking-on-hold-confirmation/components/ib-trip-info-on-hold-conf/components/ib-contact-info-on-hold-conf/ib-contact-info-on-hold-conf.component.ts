import { Component, Input } from '@angular/core';
@Component({
    selector: 'ib-contact-info-on-hold-conf',
    templateUrl: './ib-contact-info-on-hold-conf.component.html',
    styleUrls: ['./ib-contact-info-on-hold-conf.component.scss']
})

export class IbContactInfoOnHoldConfComponent {
    @Input() contactInfo;
}
