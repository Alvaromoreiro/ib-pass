import { Component, Input } from '@angular/core';

@Component({
    selector: 'ib-activity-more-info',
    templateUrl: 'ib-activity-more-info.component.html',
    styleUrls: ['ib-activity-more-info.component.scss']
})

export class IbActivityMoreInfoComponent {
    @Input() travelInfo: any;
    @Input() isMultiCity: boolean;
    @Input() isPaOpen: boolean;
    @Input() showPassengers: boolean;
    @Input() showClaim: boolean;
    @Input() modifier: string;
    
    constructor (
        
    ) { }

}