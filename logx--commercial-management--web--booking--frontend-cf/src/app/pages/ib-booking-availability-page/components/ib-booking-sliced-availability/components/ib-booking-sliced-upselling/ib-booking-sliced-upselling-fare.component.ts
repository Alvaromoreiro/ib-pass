import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FareFamily } from '@src/app/core/models/ib-booking-availability/slice-by-slice-selected-slice.model';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { IbBookingUpsellingUtilsService } from './services/ib-booking-upselling-utils.service';
import { AJSCurrencyService } from 'ib-web-commons/utils';
@Component({
    selector: 'ib-booking-sliced-upselling-component',
    templateUrl: './ib-booking-sliced-upselling-fare.component.html',
    styleUrls: ['./ib-booking-sliced-upselling-fare.component.scss']
})
export class IbBookingSlicedUpsellingComponent implements OnChanges {
    @Input() selectedSlice: AvailabilityTransformerModel.SelectedSlice;
    @Input() selectedFareFamily: AvailabilityTransformerModel.FareFamilyCondition;
    @Input() currencies: AvailabilityTransformerModel.CurrenciesObject;
    @Output() selectUpselling = new EventEmitter<AvailabilityTransformerModel.FareFamilyCondition>();
    public showUpselling = false;
    public mark1: string;
    public mark2: string;
    public mark3: string;
    public nextUpsellFare: FareFamily;
    public fareExtrasToShow: {
        icon: string,
        icon1?: string,
        icon2?: string,
        description: string,
        subdescription: string
    }[];
    public diffPrice: string;
    public imgToshow: string;
    public upsellFare: AvailabilityTransformerModel.FareFamilyCondition;
    public upsellRadio = false;
    public styleImgBackground: string;
    constructor (
        @Inject(AJSCurrencyService) private CurrencyService: CurrencyService,
        private IbBookingUpsellingUtilsService : IbBookingUpsellingUtilsService

    ) {
        this.fareExtrasToShow = BookingAppConstants.UPSELLING.FARE.OPTIMA;
    }
    ngOnChanges (changes: SimpleChanges) {
        if (changes?.selectedFareFamily?.currentValue && this.selectedSlice) {
            this.activate();
        }
    }

    public activate = () => {
        this.showUpselling = false;
        this.upsellRadio = false;
        // Stop if airline not valid
        if (!this.IbBookingUpsellingUtilsService.isAnyValidOperator(this.selectedSlice.info.allOperatedByCodes)) { return null; }
        this.initContent();

    };

    private getNextUpsellFare = () : AvailabilityTransformerModel.FareFamilyCondition => {
        const selectedCabin: string = this.selectedSlice.info.showedCabin;
        const cabinFares: AvailabilityTransformerModel.FareFamilyCondition[] = this.selectedSlice.info.cabins[selectedCabin]?.fareFamilies ?? [] ;
        const upsellFare = cabinFares.find(fare => fare.priority < this.selectedFareFamily.priority);
        if (upsellFare == null) { return null; }
        //  Filter unavailable upselling fares
        if (!this.IbBookingUpsellingUtilsService.checkUpsellingAvailableFares(upsellFare.commercialNameES)) { return null; }
        // Filter forbifden upsellling combinations
        if ( this.IbBookingUpsellingUtilsService.isForbiddenUpsell(this.selectedFareFamily.commercialNameES, upsellFare.commercialNameES)) {
            return null;
        }
        return upsellFare;
    };

    private initContent = async () => {
        this.upsellFare = this.getNextUpsellFare();
        const model = await this.IbBookingUpsellingUtilsService.getInfoToShow(this.selectedSlice);
        if (this.upsellFare != null && model != null) {
            Object.assign(this, model);
            this.setPriceDifference();
            this.showUpselling = true;
            this.styleImgBackground = `background-image: url(${this.imgToshow})`;
        }
    };

    private setPriceDifference = () => {
        const priceNext = this.upsellFare.farePriceToCalculate ?? 0;
        const priceCurrent = this.selectedFareFamily.farePriceToCalculate ?? 0;
        let diffPrice = priceNext - priceCurrent;
        this.diffPrice =  this.CurrencyService.formatPrice(
            this.currencies[this.selectedFareFamily.fareCurrency], diffPrice, false, true);

    };


    public selectUpsellFare = () => {
        this.upsellRadio = !this.upsellRadio;
        this.selectUpselling.emit(this.upsellFare);
    };
}
