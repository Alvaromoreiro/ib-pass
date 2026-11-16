import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'ib-booking-header-info-tooltip',
    templateUrl: './ib-booking-header-info-tooltip.component.html',
    styleUrls: ['./ib-booking-header-info-tooltip.component.scss']
})
export class IbBookingHeaderInfoTooltipComponent {
    @Input() public trips;
    @Input() public flightType;
    @Input() public advancedSearch;
    @Input() public isMultiFlight;
    @Input() public isHMad;
    @Output() openSearch = new EventEmitter();
    @Output() backToMulti = new EventEmitter();

    public openAdvancedSearch () {
        this.advancedSearch = true;
        this.openSearch.emit( );
    }

    public backToMultiFlightSearch ( goToHome ) {
        this.backToMulti.emit( goToHome );
    }
}
