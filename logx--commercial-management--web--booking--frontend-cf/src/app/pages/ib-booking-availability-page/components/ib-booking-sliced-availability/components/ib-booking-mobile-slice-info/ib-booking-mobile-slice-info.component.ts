import { Component, ElementRef, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { AJSDatalayerBKIService, AJSDatalayerBKIServiceType } from '@shared/services/ib-datalayer/services/ib-datalayer-bki-service-bridge.service';
import { AJSRootScope, downgradeToAJSComponent } from 'ib-web-commons/utils';
import { cloneDeep } from 'lodash-es';
import { IbSliceDetailsComponentService } from '@shared/components/ib-booking-slice-details-info/ib-booking-slice-details.service';


@Component({
    selector: 'ib-booking-mobile-slice-info',
    templateUrl: './ib-booking-mobile-slice-info.component.html',
    styleUrls: ['./ib-booking-mobile-slice-info.component.scss']
})
export class IbBookingMobileSliceInfoComponent implements OnInit, OnDestroy {

    @Input()
    public sliceInfoModel: AvailabilityTransformerModel.Slice;
    @Input()
    public origin: string;
    @Input()
    public destination: string;
    @Input()
    public showFaresSelected: boolean = false;
    @Input()
    public originDestinationId: string;
    @Input()
    public currencies: any;

    @Input()
    public currentOriginDestinationIndex: number;
    @Input()
    public selectedSliceIndex: number;
    @Input()
    public selectedSlicesLength: number;
    @Input()
    public selectedSliceMode = false;


    public cabins: AvailabilityTransformerModel.SliceOffersByFareFamiliesSelectedCabins[];
    public showCompanyLogo = true;
    public collapsedCabins: boolean = true;
    public newFare;

    constructor (
        private IbSliceDetailsComponentService: IbSliceDetailsComponentService,
        @Inject(AJSDatalayerBKIService) private DatalayerBKIService: AJSDatalayerBKIServiceType,
        private elementRef: ElementRef,
        @Inject(AJSRootScope) private rootScope: any
    ) { }
    ngOnDestroy (): void {
        this.IbSliceDetailsComponentService.destroy();
    }

    ngOnInit (): void {
        this.cabins = this.showFaresSelected ? this.createCabins() : cloneDeep(this.sliceInfoModel.cabinsMobile);
        this.newFare = this.rootScope.newFare;
    }

    private getCabinStyle = (cabinType: string): string => {
        let cabinStyle = 'cabin-button';
        switch (cabinType) {
                case BookingAppConstants.FARE_CABIN_TYPE.BUSINESS_CLASS:
                    cabinStyle += '--business';
                    break;
                case BookingAppConstants.FARE_CABIN_TYPE.TURIST_PREMIUM:
                case BookingAppConstants.FARE_CABIN_TYPE.TURIST_PREMIUM_T:
                    cabinStyle += '--premium';
                    break;
                default: cabinStyle = ''; break;


        }
        return cabinStyle;

    };
    private createCabins = (): AvailabilityTransformerModel.SliceOffersByFareFamiliesSelectedCabins[] => {
        const renderedCabins: AvailabilityTransformerModel.SliceOffersByFareFamiliesSelectedCabins[] = [];
        for (let cabinK in this.sliceInfoModel.cabins) {
            const cabinInfo = this.sliceInfoModel.cabins[cabinK];
            cabinInfo.type = cabinK;
            cabinInfo.collapsed = this.isCabinInitCollapsed(cabinK);
            cabinInfo.cabinMobileStyleClass = this.getCabinStyle(cabinK);
            renderedCabins.push(cabinInfo);
        }
        return renderedCabins;

    };

    private isCabinInitCollapsed = (cabinType: string) => {
        return !this.showFaresSelected || this.sliceInfoModel?.showedCabin !== cabinType;
    };

    public handleCompanyLogoError = () => {
        this.showCompanyLogo = false;
    };

    public toggleCabins = (): void => {
        this.collapsedCabins = !this.collapsedCabins;
        this.collapseAllCabins();
    };
    public toggleDetails = (): void => {
        this.IbSliceDetailsComponentService.show(this.sliceInfoModel);
    };
    public toggleFareCabin = (index: number, isCollapsed: boolean): void => {
        this.collapseAllCabins();
        this.cabins[index].collapsed = !isCollapsed;
    };
    private collapseAllCabins = (): void => {
        this.cabins.forEach(cabin => {
            cabin.collapsed = true;
        });
    };
    public sendSelectedSlice = (cabin) => {
        this.sliceInfoModel.showedCabin = cabin;
        const selectedSlice = {
            selectedSliceIndex: this.selectedSliceIndex,
            selectedSlicesLength: this.selectedSlicesLength,
            cabin: cabin,
            originDestinationId: this.originDestinationId,
            origin: this.origin,
            destination: this.destination,
            info: this.sliceInfoModel
        };
        if (!this.showFaresSelected) {
            this.sliceInfoModel.selectedCabin = cabin;
            this.elementRef.nativeElement.dispatchEvent(new CustomEvent('selectedSliceEvent', {
                bubbles: true,
                composed: true,
                detail: {
                    selectedSlice,
                    checkSlides: true
                }

            }));

        }
        this.DatalayerBKIService.getDigitalDataEcommerce([selectedSlice], 'view_item_list');
    };
    public showAirlineName = () =>{
        return this.sliceInfoModel.allOperatedBy.length > 0 && this.sliceInfoModel.allOperatedBy.every(airline => airline === this.sliceInfoModel.allOperatedBy[0]);
    };


}
downgradeToAJSComponent(
    'ibBookingMobileSliceInfoDowngraded',
    {
        component: IbBookingMobileSliceInfoComponent,
        inputs: ['sliceInfoModel', 'selectedSlicesLength', 'selectedSliceIndex',
            'currentOriginDestinationIndex', 'currencies', 'originDestinationId',
            'showFaresSelected', 'destination', 'origin', 'sliceInfoModel'],
        outputs: []
    },
    'ib-booking-availability-module'
);

