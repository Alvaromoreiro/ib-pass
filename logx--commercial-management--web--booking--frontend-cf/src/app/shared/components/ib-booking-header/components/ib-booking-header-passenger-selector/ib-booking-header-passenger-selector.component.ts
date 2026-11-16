import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PassengerSelectorCondition, SeekerPassengerModel } from '@src/app/core/models/ib-booking-availability/header-seeker-model';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-booking-header-passenger-selector',
    templateUrl: './ib-booking-header-passenger-selector.component.html',
    styleUrls: ['./ib-booking-header-passenger-selector.component.scss']
})
export class IbBookingHeaderPassengerSelectorComponent implements OnChanges {

    
    @Input() passengersTypes: SeekerPassengerModel[] = [];
    @Input() noInputLabel = false;
    @Input() modifier?: string;
    @Input() specialPassengerHasError: boolean = false;
    @Input() numPassengerHasError: boolean = false;
    @Input() isPetsSelected: boolean = false;
    @Input() petsDisabledByTime: boolean = false;
    @Output() petsChange = new EventEmitter<boolean>();
    @Output() passengersChange = new EventEmitter<SeekerPassengerModel[]>();


    public isOpen = false;
    public isCollapsed = true;

    private passengerCondition: PassengerSelectorCondition = {
        passengersCount: 0,
        passengersWithInfants: 0,
        totalAdults: 0,
        maxChilds: 0
    };

    private _onlyTeenager = false;

    ngOnChanges (changes: SimpleChanges): void {
        if (changes['passengersTypes']) {
            this.recalculatePassengersState();
        }
    }

    toggle (): void {
        this.isOpen = !this.isOpen;
        this.isCollapsed = !this.isCollapsed;
    }

    controlCollapse (event: KeyboardEvent): void {
        if (event.key === 'Escape' || event.keyCode === 27) {
            this.isOpen = false;
        }
    }

    onFocusIn (): void {}

    @HostListener('document:click', ['$event'])
    onDocumentClick (event: MouseEvent): void {
        const target = event.target as HTMLElement;
        const clickedInside = target.closest('.ib-passenger--selector');

        if (!clickedInside && this.isOpen) {
            this.isOpen = false;
        }
    }

    @HostListener('document:keydown', ['$event'])
    onDocumentKeydown (event: KeyboardEvent): void {
        if (event.key === 'Escape' && this.isOpen) {
            this.isOpen = false;
        }
    }

    get ariaText (): string {
        return this.isOpen
            ? 'HEADER_ADVANCED_SEARCH_PASSENGERS_OPENED'
            : 'HEADER_ADVANCED_SEARCH_PASSENGERS_CLOSED';
    }

    get totalPassengers (): number {
        return this.passengerCondition.passengersWithInfants;
    }

    get passengersCount (): number {
        return this.passengerCondition.passengersCount;
    }

    get maxChilds (): number {
        return this.passengerCondition.maxChilds;
    }

    get maxInfants (): number {
        return this.passengerCondition.totalAdults;
    }

    get maxTotalPassengers (): number {
        const adult = this.passengersTypes.find(
            p => p.passengerType === 'ADULT'
        );
        return adult?.maxPassengers ?? 9;
    }

    get onlyTeenager (): boolean {
        return this._onlyTeenager;
    }

   
    addPassenger (passenger: any): void {
        if ( passenger.maxPassengers !== undefined && passenger.count >= passenger.maxPassengers) {
            return;
        }

        if ( passenger.passengerType === 'CHILD' && passenger.count >= this.maxChilds) {
            return;
        }

        if ( passenger.passengerType === 'INFANT' && passenger.count >= this.maxInfants) {
            return;
        }

        passenger.count = (passenger.count ?? 0) + 1;
        this.recalculatePassengersState();
        this.emitPassengersChange();
    }



    removePassenger (passenger: SeekerPassengerModel): void {
        if (passenger.minPassenger !== undefined && passenger.count <= passenger.minPassenger) {
            return;
        }

        passenger.count--;
        this.recalculatePassengersState();
        this.emitPassengersChange();
    }
 
    private recalculatePassengersState (): void {
        if (this.isPassengersEmpty()) {
            this.resetPassengerCondition();
            return;
        }

        const adults = this.getAdultsCount();
        const teenagers = this.getTeenagersCount();

        this.normalizePassengerByType('INFANT', adults);

        const totals = this.calculateTotals();
        const maxChilds = this.calculateMaxChilds(adults);

        this.normalizePassengerByType('CHILD', maxChilds);

        this.updatePassengerCondition({
            passengersCount: totals.passengersCount,
            passengersWithInfants: totals.passengersWithInfants,
            totalAdults: adults,
            maxChilds
        });

        this.updateOnlyTeenagerFlag(teenagers, adults);
    }

    private isPassengersEmpty (): boolean {
        return !this.passengersTypes || this.passengersTypes.length === 0;
    }

    private resetPassengerCondition (): void {
        this.passengerCondition = {
            passengersCount: 0,
            passengersWithInfants: 0,
            totalAdults: 0,
            maxChilds: 0
        };
        this._onlyTeenager = false;
    }


    private getAdultsCount (): number {
        return this.passengersTypes.find(
            p => p.passengerType === 'ADULT'
        )?.count ?? 0;
    }

    private getTeenagersCount (): number {
        return this.passengersTypes.find(
            p => p.passengerType === 'YOUNG'
        )?.count ?? 0;
    }

    private calculateTotals (): {
        passengersWithInfants: number;
        passengersCount: number;
    } {
        let passengersWithInfants = 0;
        let passengersCount = 0;

        this.passengersTypes.forEach(p => {
            const count = p.count ?? 0;
            passengersWithInfants += count;

            if (p.passengerType !== 'INFANT') {
                passengersCount += count;
            }
        });

        return { passengersWithInfants, passengersCount };
    }


    private calculateMaxChilds (adults: number): number {
        return adults * 2;
    }

    private normalizePassengerByType (
        passengerType: string,
        maxAllowed: number
    ): void {
        const passenger = this.passengersTypes.find(
            p => p.passengerType === passengerType
        );

        if (passenger && passenger.count > maxAllowed) {
            passenger.count = maxAllowed;
        }
    }


    private updatePassengerCondition (
        condition: PassengerSelectorCondition
    ): void {
        this.passengerCondition = condition;
    }


    private updateOnlyTeenagerFlag (
        teenagers: number,
        adults: number
    ): void {
        this._onlyTeenager = teenagers > 0 && adults === 0;
    }


    private emitPassengersChange (): void {
        this.passengersChange.emit([...this.passengersTypes]);
    }

}
downgradeToAJSComponent(
    'ibBookingHeaderPassengerSelector',
    {
        component: IbBookingHeaderPassengerSelectorComponent,
        inputs: ['passengersTypes',
            'noInputLabel',
            'modifier',
            'isPetsSelected' 
        ],
        outputs: ['passengersChange', 'petsChange']
    },
    'ib-header-seeker-module', ['ib-commons-modal-service-module', 'ib-commons-http-service-module', 'ib-booking-city-selector-module']
);
