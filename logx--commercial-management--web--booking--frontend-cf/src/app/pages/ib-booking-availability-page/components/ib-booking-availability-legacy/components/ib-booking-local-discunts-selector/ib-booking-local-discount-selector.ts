import angular from 'angular';
import { BookingLocalDiscountsService } from '@shared/services/ib-booking-availability/ib-booking-utils-local-discounts.service';
import { BookingLocalDiscountSelectorService } from './ib-booking-local-discount-selector.service';

@Component( 'ib-booking-local-discount-selector-module', 'ibBookingLocalDiscountSelector', {
    bindings: {
        originCity: '<',
        destinationCity: '<',
        showTooltip: '<',
        familyCodeSelected:'=?',
        residentCodeSelected: '=?'
    },
    controllerAs: 'ibBookingLocalDiscountSelectorCtrl',
    templateUrl: ['BookingAppConstants', ( bkiConstants: BookingAppConstants ): string => bkiConstants.templatesRoute + 'ib-booking-local-discount-selector.html']
}, ['BookingLocalDiscountsService', 'BookingLocalDiscountSelectorService',  '$rootScope'], [] )
export class ibBookingLocalDiscountSelector implements ng.IController {
    public originCity: string;
    public destinationCity: string;
    public residentDiscounts: AvailabilityModels.residentDiscountSelector;
    public familyDiscounts: AvailabilityModels.largeFamilyDiscountSelector;
    public showSelectResident: boolean ;
    public isResident: boolean ;
    public showTooltip: boolean;
    public availableResidentDisc: boolean;
    public familyCodeSelected: string;
    public residentCodeSelected: string;

    constructor ( 
        private BookingLocalDiscountsService: BookingLocalDiscountsService,
        private BookingLocalDiscountSelectorService: BookingLocalDiscountSelectorService,
        private $rootScope: CommonsRootScope) {
        this.isResident = true;
        this.showSelectResident = false;
        this.availableResidentDisc = false;
    }

    $onInit () {
        // initialize optional params
        this.familyCodeSelected = (angular.isDefined(this.familyCodeSelected))? this.familyCodeSelected : '';
        this.residentCodeSelected = (angular.isDefined(this.residentCodeSelected))? this.residentCodeSelected : '';
        this.initModuleInputs();
    }

    private updateResidentInput = (selected: string) :void => {
        const residentConfig: any = this.BookingLocalDiscountsService.getDiscountsConfig().resident;
        const availableDiscounts: Array<string>  =  this.BookingLocalDiscountsService.getResidentsDiscountsForRoute(this.originCity, this.destinationCity);
        if (availableDiscounts.length > 1 ) {
            this.residentDiscounts.items = residentConfig.items.filter((element:any) :boolean => (element.value=== ''|| availableDiscounts.indexOf(element.value) >= 0));
            this.isResident = true;
            this.residentDiscounts.selected = this.residentDiscounts.items.filter((element:any) :boolean => (element.value === selected))[0];
            if (!angular.isDefined(this.residentDiscounts.selected)) {
                this.residentDiscounts.selected = this.residentDiscounts.items[0];
                this.isResident = false;
            }
            this.residentCodeSelected = this.residentDiscounts.selected.value || '';
            this.availableResidentDisc = true;
            this.showSelectResident = true;
        } else if (availableDiscounts.length > 0) {
            this.availableResidentDisc= true;
            this.showSelectResident = false;
            this.isResident = availableDiscounts.length === 1 && selected === availableDiscounts[0];
            this.residentCodeSelected = this.isResident? availableDiscounts[0] : '';
        } else {
            this.availableResidentDisc = false;
            this.residentCodeSelected = '';
        }
    };
    private updateFamilyInput = (selected: string): void => {
        this.familyDiscounts.selected = this.familyDiscounts.items.filter((element:any) :boolean => (element.value === selected))[0];
        if (!angular.isDefined(this.familyDiscounts)) {
            this.familyDiscounts.selected = this.familyDiscounts.items[0];
        }
        this.familyCodeSelected = this.familyDiscounts.selected.value || '';
    };
    private initModuleInputs = (): void => {
        const discountConfig: any = this.BookingLocalDiscountsService.getDiscountsConfig();
        this.residentDiscounts = discountConfig.resident;
        this.familyDiscounts = discountConfig.largeFamily;
        this.residentDiscounts.title = 'RESIDENT_DISCONT_TITLE';
        this.familyDiscounts.title = 'LARGE_FAMILY_DISCONT_TITLE';
        this.familyDiscounts.selected = this.familyDiscounts.items[0];
        this.familyCodeSelected = angular.isDefined(this.familyCodeSelected)? this.familyCodeSelected: this.familyDiscounts.selected.value;
        this.residentDiscounts.selected = this.residentDiscounts.items[0];
        this.residentCodeSelected = angular.isDefined(this.residentCodeSelected)? this.residentCodeSelected : this.residentDiscounts.selected.value;
        this.updateResidentInput(this.residentCodeSelected);
        this.updateFamilyInput(this.familyCodeSelected);

    };

    private updateAvailabilitySearch = (residentValue: string = '', largeFamValue: string = ''): void => {
        const specialDiscounts: AvailabilityModels.DomesticDiscountChangeEvent = {
            resident: residentValue,
            largeFamilyType: largeFamValue
        };
        this.$rootScope.$broadcast('discountChange', specialDiscounts);
    };

    public residentDiscountsChange = (residentDiscount: string | boolean): void => {
        if(residentDiscount !== this.residentCodeSelected) {
            const availableDiscounts: Array<string> = this.BookingLocalDiscountsService.getResidentsDiscountsForRoute(this.originCity, this.destinationCity);
            if (typeof residentDiscount === 'string') {
                this.residentCodeSelected = residentDiscount;
                this.updateAvailabilitySearch (this.residentCodeSelected, this.familyDiscounts.selected.value);
            } else {
                this.residentCodeSelected = residentDiscount === true ? availableDiscounts[0] : '';
                this.updateAvailabilitySearch (this.residentCodeSelected, this.familyCodeSelected);
            }
        }
        this.BookingLocalDiscountSelectorService.updateResidentDiscountCookie(this.residentCodeSelected);
        this.BookingLocalDiscountSelectorService.updateURLWithDiscounts(this.residentCodeSelected, this.familyCodeSelected);
    };
    public familyDiscountsChange = (familyDiscount: string): void => {
        if (familyDiscount !== this.familyCodeSelected) {
            const availableDiscounts: Array<string> =  this.BookingLocalDiscountsService.getResidentsDiscountsForRoute(this.originCity, this.destinationCity);
            this.familyCodeSelected = familyDiscount;
            this.updateAvailabilitySearch ( !this.showSelectResident && this.availableResidentDisc && this.isResident ?
                availableDiscounts[0] : this.residentCodeSelected, this.familyCodeSelected);
        }
        this.BookingLocalDiscountSelectorService.updateFamilyDiscountCookie(this.familyCodeSelected);
        this.BookingLocalDiscountSelectorService.updateURLWithDiscounts(this.residentCodeSelected, this.familyCodeSelected);
    };
    
}
