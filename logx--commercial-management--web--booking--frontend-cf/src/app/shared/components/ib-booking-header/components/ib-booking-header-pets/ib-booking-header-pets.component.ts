import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-booking-header-pets',
    templateUrl: './ib-booking-header-pets.component.html',
    styleUrls: ['./ib-booking-header-pets.component.scss']
})
export class IbBookingHeaderPetsComponent implements OnChanges{

    @Input() enabled:boolean = false;
    @Input() disabledByTime: boolean;
    @Output() petsChange = new EventEmitter<boolean>();

    public isTooltipHovered = false;
    public isTooltipPinned = false;

    onMouseEnter (): void {
        this.isTooltipHovered = true;
    }

    onMouseLeave (): void {
        this.isTooltipHovered = false;
    }

    onInfoClick (event: Event): void {
        event.stopPropagation();
        this.isTooltipPinned = true;
    }

    closeTooltip (event: Event): void {
        event.stopPropagation();
        this.isTooltipPinned = false;
        this.isTooltipHovered = false;
    }

    get showTooltip (): boolean {
        return this.isTooltipHovered || this.isTooltipPinned;
    }

    togglePets (): void {

        if (this.disabledByTime) return;
        this.petsChange.emit(!this.enabled);
    }

    ngOnChanges (changes: SimpleChanges): void {
        if (changes['enabled']) {
        }
    }
}

downgradeToAJSComponent(
    'ibBookingHeaderPets',
    {
        component: IbBookingHeaderPetsComponent,
        inputs: ['enabled'],
        outputs: ['petsChange']
    },
    'ib-booking-header-module'
);