import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'ib-booking-fare-recap',
    templateUrl: 'ib-booking-fare-recap.component.html',
    styleUrls: ['./ib-booking-fare-recap.component.scss']
})
export class IbBookingFareRecapComponent implements OnInit{
    public isOpen = false;
    public showColapseContent = false;
    public collapseTitle =  'REVIEW_FARE_SELECTION';
    public renderConditionsSet: Set<string> = new Set<string>();
    
    private defaultConditionsSet: Set<string> = new Set<string>(
        ['EQMANO', 'EQBODEGA', 'ASIENTO', 'COMIDA', 'CAMBIO', 'EMBARQUE', 'REEMBOLSO']);

    private shortRadiusConditionsSet: Set<string> = new Set<string>(
        ['EQMANO', 'EQBODEGA', 'ASIENTO', 'CAMBIO', 'EMBARQUE', 'REEMBOLSO']);
    

    @Input() fareFamilies : AvailabilityTransformerModel.FareFamilyCondition[] = [];
    @Input() slicesInfo?: AvailabilityTransformerModel.SelectedSlice[] = [];
    @Input() flightRatio?: string;

    public orderedFareFamilies: AvailabilityTransformerModel.FareFamilyCondition[] = [];


    constructor (
        private TranslateService: TranslateService
    ) {}
    ngOnInit (): void {
        this.orderFareFamiliesBySlice();
        this.setCollapseTitle();
        this.getConditionsSet(this.flightRatio);
    }

    private setCollapseTitle = () => {
        let literal = this.TranslateService.instant('REVIEW_FARE_SELECTION');

        this.orderedFareFamilies.forEach((fareFamily, index) => {
            literal += ` ${fareFamily.commercialName}`;
            const length = this.fareFamilies.length;
            if(length > 1) {
                if (index < length - 2) {
                    literal += ',';
                } else if (index === length - 2) {
                    literal += this.TranslateService.instant('REVIEW_FARE_SELECTION_AND');
                }
            }
            this.collapseTitle = literal;
        });

    };

    public toggleOpen () {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.showColapseContent = true;
        } else {
            // Delay content dispose
            setTimeout(() => {
                this.showColapseContent = false;
            }, 350);
        }
    }

    private getConditionsSet = (flightRatio: 'Largo Radio'| 'Medio radio' | 'Corto radio' | string = 'Largo Radio')=> {
        switch (flightRatio) {
                case 'Corto radio':
                case 'Medio radio':
                    this.renderConditionsSet = this.shortRadiusConditionsSet;
                    break;
                default:
                    this.renderConditionsSet = this.defaultConditionsSet;
                    break;
        }
    };

    private orderFareFamiliesBySlice = () : void => {
        if (this.fareFamilies.length === 1) {
            this.orderedFareFamilies = this.fareFamilies;
            return;
        }
        this.orderedFareFamilies = [];
        const commercialCodes  =  this.slicesInfo?.map(slice => slice.info.selectedFareFamily.commercialCode) ?? [];
        this.orderedFareFamilies = commercialCodes.map((code) => this.fareFamilies.find(fareFamily => fareFamily.commercialCode === code));
    };


}