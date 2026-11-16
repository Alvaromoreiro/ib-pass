import angular, { IController } from 'angular';
import dayjs from 'dayjs';
import { RedirectionService, CommonsCookiesService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbBookingHeaderSeekerModelService } from './services/ib-booking-header-seeker-model.service';
import { IbBookingHeaderSeekerService } from './services/ib-booking-header-seeker.service';
import { IbLastSearchStorageService } from './services/ib-last-search-storage.service';
import { BookingLocalDiscountsService } from '@shared/services/ib-booking-availability/ib-booking-utils-local-discounts.service';
import { LocalDiscountConfigItem, SeekerAdvancedSearchModel, SeekerCabinModel, SeekerCityModel, SeekerPassengerInfoModel, SeekerPassengerModel, SeekerStorageSearch } from '@src/app/core/models/ib-booking-availability/header-seeker-model';
import { HeaderCompleteOriginDestinationResponse, PassengersTypesNumber } from '@src/app/core/models/ib-booking-availability/header-model';
import { lastSearchStopoverModel } from '@src/app/core/models/stopover/lastSearchStopover-model';
import { IbBookingPetsFlowService } from '@shared/services/ib-utils/ib-bookig-pets-flow.service';
import { IbBookingCitySeekerCityService } from './services/ib-booking-seeker-city-helper';
import { IbBookingSeekerPassengerService } from './services/ib-booking-seeker-passenger';
import { IB_HEADER_SEEKER_CONSTANTS } from './ib-header-seeker-constants';
import { BkiStorageConstants } from '@core/constants/ib-booking-storage-constants';

export interface CityUpdateEvent {
    city: SeekerCityModel;
    index: number;
    containerForm: {
        submitted: boolean;
        hasError: boolean;
        errors: { [key: string]: boolean };
    };
}

export interface AngularJsComponentOptions {
    bindings: { [key: string]: string };
    controller: any;
    controllerAs: string;
    templateUrl: string | any[];
}
export interface ComponentInfo {
    module: string;
    selector: string;
    inject: string[];
    required: string[];
}

const componentOptions: AngularJsComponentOptions = {
    bindings: {
        trips: '<',
        passengers: '<',
        redemption: '<',
        isOnbusiness: '<',
        isHMad: '<',
        openCalendar:'<?'
    },
    controller: 'AdvancedHeaderSearchController',
    controllerAs: 'advHeaSerCtrl', templateUrl: ['$rootScope', ($rootScope) =>
        $rootScope.routes.templates + 'ib-header-seeker-component.html'
    ]
};
const componentInfo: ComponentInfo = {
    module: 'ib-header-seeker-module',
    selector: 'ibHeaderSeekerComponent',
    inject:['IbBookingHeaderSeekerModelService', 'IbBookingHeaderSeekerService', 'CommonsModalService',
        'BookingLocalDiscountsService', '$rootScope', 'CommonsSessionStorageService', '$scope',
        'RedirectionService', '$filter', '$window', '$timeout',
        'IbLastSearchStorageService', 'IbUiPassengerSelectorConstants', 'CommonsCookiesService', 'IbBookingPetsFlowService'],
    required: ['ib-commons-modal-service-module', 'ib-commons-http-service-module', 'ib-booking-city-selector-module']
};
export class AdvancedHeaderSearchController implements IController {
    private day: number = 60 * 60 * 24 * 1000;
    public trips: HeaderCompleteOriginDestinationResponse[];
    public passengers :PassengersTypesNumber = {numAdults: 0, numChilds: 0, numInfants: 0, numSeniors: 0, numYouth: 0, numTeenager: 0, numberPassengers: 0};
    public redemption: boolean;
    public isOnbusiness: boolean;
    public isHMad: boolean;
    public loadingAdvancedSearch : boolean = true;
    public nightOptionChanged : boolean = false;
    public stopOptionChanged : boolean = false;
    public marketDescription: string = '';
    public containerForm;
    public seniorTypeAvailable: boolean = false;
    public youngTypeAvailable: boolean = false;
    public teenagerTypeAvailable: boolean = false;
    public isOpen: boolean = false;
    public isCollapsed: boolean = true;
    public ariaText: string;
    public discountResident: LocalDiscountConfig;
    public discountFamily: LocalDiscountConfig;
    public showOriginDestinyFieldsLoading: boolean = true;
    public model : SeekerAdvancedSearchModel;
    public openCalendar: string;
    public showStopOption: boolean;
    private citiesOutsideSpain: any;

    private isPetFlight: boolean = false;
    public isPetsSelected: boolean = false;
    public isPetsInitialized: boolean = false;
    public isToggleDisabledByTime: boolean = false;
    private hasEnteredDisabledByTime;
    private ibBookingCitySeekerCityService: IbBookingCitySeekerCityService;
    private ibBookingSeekerPassengerService: IbBookingSeekerPassengerService = new IbBookingSeekerPassengerService();
    //public passengers;

    constructor (
        private IbBookingHeaderSeekerModelService: IbBookingHeaderSeekerModelService,
        private IbBookingHeaderSeekerService: IbBookingHeaderSeekerService,
        private CommonsModalService: CommonsModalService,
        private BookingLocalDiscountsService: BookingLocalDiscountsService,
        private $rootScope : CommonsRootScope,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private $scope: angular.IScope,
        private RedirectionService: RedirectionService,
        private $filter: ng.FilterFactory,
        private $window: ng.IWindowService,
        private $timeout: ng.ITimeoutService,
        private IbLastSearchStorageService: IbLastSearchStorageService,
        private IbUiPassengerSelectorConstants: IbUiPassengerSelectorConstantsNamespace.IbUiPassengerSelectorConstants,
        private CommonsCookiesService:CommonsCookiesService,
        private IbBookingPetsFlowService: IbBookingPetsFlowService

    ) {
        //Constructor
        this.$scope.$on('updateSelectedPassengers', this.updateSelectedPassengers);
        this.$scope.$on('national-discount-collapse', this.clickoutCollapse);
        this.$rootScope.$on('updatedDateDeparture', this.onDateUpdated);
        this.$rootScope.$on('updatedDateReturn', this.onDateUpdated);
        this.discountResident = this.BookingLocalDiscountsService.getDiscountsConfig().resident;
        this.discountFamily = this.BookingLocalDiscountsService.getDiscountsConfig().largeFamily;
        this.model = this.IbBookingHeaderSeekerModelService.initializeModel();
    }

    $onInit = () => {
        this.loadingAdvancedSearch = true;
        this.ibBookingCitySeekerCityService = new IbBookingCitySeekerCityService(this.isHMad, this.trips, this.CommonsSessionStorageService.get(BkiStorageConstants.DESTINATION_AREAS_CITIES_LIST));
        if ((typeof(this.marketDescription)!== 'string')|| this.marketDescription === '') {
            this.marketDescription = this.CommonsSessionStorageService.get(BkiStorageConstants.COMMERCIAL_DATA) && this.CommonsSessionStorageService.get<any>(BkiStorageConstants.COMMERCIAL_DATA).market ? this.CommonsSessionStorageService.get<any>(BkiStorageConstants.COMMERCIAL_DATA).market.code : '';
        }
        this.getAdvancedSearchModel();
    };

    private onDateUpdated = () => {
        this.calculatePetsDisabledByTime();
        this.checkMaximumNights();
    };
    onPassengersChange (updatedPassengers) {
        this.model.passengersSelected = updatedPassengers;
        this.CommonsSessionStorageService.set(BkiStorageConstants.ADVANCED_SEARCH_PASSENGERS_MODEL, updatedPassengers);
    }

    onPetsChange (selected: boolean): void {
        this.isPetsSelected = selected;
        // Using native sessionStorage to avoid setting the key with the application prefix
        window.sessionStorage.setItem(IB_HEADER_SEEKER_CONSTANTS.PETS_CHECKED_KEY, JSON.stringify(this.isPetsSelected));
    }


    private calculatePetsDisabledByTime (): void {
        const departureDate = this.model?.selectedOutbondDate;

        if (!departureDate) {
            this.isToggleDisabledByTime = false;
            return;
        }

        const todayStart = dayjs().startOf('day');
        const departureStart = dayjs(departureDate).startOf('day');
        const diffDays = departureStart.diff(todayStart, 'day');

        const isNowDisabled = diffDays < 2;

        if (isNowDisabled && !this.hasEnteredDisabledByTime) {
            this.hasEnteredDisabledByTime = true;
            this.isPetsSelected = false;
        }

        if (!isNowDisabled && this.hasEnteredDisabledByTime) {
            this.hasEnteredDisabledByTime = false;

            if (this.isPetFlight) {
                this.isPetsSelected = true;
            }
        }

        this.isToggleDisabledByTime = isNowDisabled;
    }



    checkMaximumNights = () =>{
        if(!this.isHMad) return;
        let nightsBetween;
        if(this.model.tripOptionSelected.code === 1){
            nightsBetween = this.model.nights.length;
        }else {
            let timeDiff = Math.abs(this.model.selectedOutbondDate.getTime() - this.model.selectedReturnDate.getTime());
            nightsBetween = Math.ceil(timeDiff/(1000*3600*24));
        } 
        for(let i = 0; i < this.model.nights.length; i++){
            this.model.nights[i].allowed = i < nightsBetween;
        }
        if(nightsBetween < this.model.nights.length && this.model.nightOptionSelected.code >= this.model.nights[nightsBetween].code){
            this.model.nightOptionSelected = this.model.nights[nightsBetween-1];
        }
    };

    updatePassengersModel = (passengers: SeekerPassengerInfoModel) => {
        this.model.passengersConditions.totalAdults = 0;
        this.model.passengersConditions.maxChilds = 0;
        this.model.passengersConditions.passengersCount = 0;
        this.model.passengersConditions.passengersWithInfants = passengers.numberPassengers;
        
        this.model.passengersSelected.forEach((passenger) => {
            passenger.count = this.ibBookingSeekerPassengerService.getPassengerCount(passenger.passengerType, passengers);
            this.updatePassengerConditions(passenger);
        });
    };

    private updatePassengerConditions (passenger: SeekerPassengerModel): void {
        if (passenger.count <= 0) return;

        const isInfant = passenger.passengerType === this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT;
        const isChild = passenger.passengerType === this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.CHILD;

        if (!isInfant) {
            this.model.passengersConditions.passengersCount += passenger.count;
        }

        if (!isInfant && !isChild) {
            this.model.passengersConditions.totalAdults += passenger.count;
            this.model.passengersConditions.maxChilds += 2 * passenger.count;
        }
    }

    close  = ()=> {
        this.$rootScope.$broadcast('toggleAdvancedSearch', false);
    };

    private initializePetsFromFlow (): void {
        this.isPetFlight = this.IbBookingPetsFlowService.isPetsFlow;
        this.isPetsSelected = this.isPetFlight;
        this.isPetsInitialized = true;
    }

    getAdvancedSearchModel = (): void => {
        this.restorePassengersFromLastSearch();

        if (!this.isPetsInitialized) {
            this.initializePetsFromFlow();
        }
        
        const advancedSearchModel =
        this.CommonsSessionStorageService.get<SeekerAdvancedSearchModel>(
            BkiStorageConstants.INITIAL_ADVANCED_SEARCH_MODEL
        );

        if (!advancedSearchModel) {
            this.initializeAdvancedSearchFromScratch();
            return;
        }

        if (this.model !== advancedSearchModel) {
            this.restoreAdvancedSearchFromStorage(advancedSearchModel);
        }
    };

    private restorePassengersFromLastSearch (): void {
        const passengersFromLastSearch =
        this.CommonsSessionStorageService.get<SeekerPassengerModel[]>(
            BkiStorageConstants.ADVANCED_SEARCH_PASSENGERS_MODEL
        );

        if (Array.isArray(passengersFromLastSearch)) {
            this.model.passengersSelected = passengersFromLastSearch;
        }
    }


    private initializeAdvancedSearchFromScratch (): void {
        this.model =this.IbBookingHeaderSeekerModelService.initializeModel(
            this.discountResident,
            this.discountFamily
        );

        const cabinsPromise =this.IbBookingHeaderSeekerService.getCabinTypes().then((data) => this.buildCabinsModel(data));

        const citiesPromise =this.IbBookingHeaderSeekerService
            .getDestinationAreas(
                this.trips[0].originCode,
                this.trips[0].destinyCode
            )
            .then((data) =>{
                const resolvedTransform = this.ibBookingCitySeekerCityService.buildCitiesModel(data);
                this.CommonsSessionStorageService.set(BkiStorageConstants.INITIAL_ADVANCED_SEARCH_MODEL, this.model);
                this.showOriginDestinyFieldsLoading = false;
                
                this.model.cities = resolvedTransform.cities;
                this.citiesOutsideSpain = resolvedTransform.citiesOutsideSpain;
                this.model.cityOrigin = resolvedTransform.cityOrigin;
                this.model.cityDestiny = resolvedTransform.cityDestiny;
                
                this.model.originAllowedCities =this.model.cityDestiny.country === 'ES' ? this.citiesOutsideSpain : this.model.cities;
                this.model.destinationAllowedCities = this.model.cityOrigin.country === 'ES' ? this.citiesOutsideSpain : this.model.cities;
            } );

        const specialPassengersPromise =
        this.IbBookingHeaderSeekerService
            .getSpecialPassengerOriginDestination(this.$rootScope.appMarket)
            .then(() => this.buildSpecialPassengerTypes());

        Promise.all([
            cabinsPromise,
            citiesPromise,
            specialPassengersPromise
        ])
            .then(() => this.applyTripDataToModel())
            .catch((error) => this.handleAdvancedSearchError(error));
    }

    private applyTripDataToModel (): void {
        const bookingUrlParams =
        this.CommonsSessionStorageService.get(BkiStorageConstants.BOOKING_URL_PARAMS) as { flexDates?: string };

        this.applyOutboundDateFromTrips();
        this.applyReturnDateFromTrips();
        this.applyHmadConfigurationIfNeeded();

        this.updateDateValueModel();
        this.model.showDatepicker = true;

        this.calculatePetsDisabledByTime();

        const hasStopOver =
        this.trips[0].tripType === '2' || this.showStopOption;

        this.model.tripOptionSelected = hasStopOver
            ? this.model.tripOptions[1]
            : this.model.tripOptions[0];

        this.model.flexDates = bookingUrlParams?.flexDates === 'true';

        this.applyAviosRedemptionIfNeeded();

        this.CommonsSessionStorageService.set(BkiStorageConstants.INITIAL_ADVANCED_SEARCH_MODEL, this.model);

        const datePickerGo =
        angular.element('.ib-input-range-date__start') as any;
        const datePickerReturn =
        angular.element('.ib-input-range-date__end') as any;

        datePickerGo?.datepicker('refresh');
        datePickerReturn?.datepicker('refresh');
                
        this.$timeout(() => {
            this.loadingAdvancedSearch = false;
        });

        this.$timeout(() => {
            this.openCalendarAction();
        }, 150);

        this.checkMaximumNights();
        
    }

    private applyOutboundDateFromTrips (): void {
        if (this.trips[0].dateFlight) {
            this.model.selectedOutbondDate =
            new Date(dayjs(this.trips[0].dateFlight, 'DD/MM/YYYY').toDate());
        }
    }

    private applyReturnDateFromTrips (): void {
        if (this.trips[0].returnFlight && !this.isHMad) {
            this.model.selectedReturnDate =
            new Date(dayjs(this.trips[0].returnFlight, 'DD/MM/YYYY').toDate());
        }
    }

    private applyHmadConfigurationIfNeeded (): void {
        if (!this.isHMad) return;

        const stopOverCookie =
        (this.CommonsCookiesService.get(
            'IBERIACOM_LAST_SEARCH_SO'
        ) as string)?.split('|') || [];

        const nightsSelected = parseInt(stopOverCookie[4], 10) || 1;
        const stopSelected = stopOverCookie[3] === 'false' ? 1 : 0;

        this.model.nightOptionSelected =
        this.model.nights[nightsSelected - 1];
        this.model.stopOptionSelected =
        this.model.stops[stopSelected];

        if (this.trips.length === 3) {
            this.showStopOption = true;
            this.model.selectedReturnDate =
            new Date(dayjs(this.trips[2].dateFlight, 'DD/MM/YYYY').toDate());
        }
    }

    private applyAviosRedemptionIfNeeded (): void {
        if (this.redemption && !this.isOnbusiness) {
            this.model.payWithAvios = true;
            this.checkAviosSpecialPassengerToAdults(true);
        }
    }


    private restoreAdvancedSearchFromStorage (
        advancedSearchModel: SeekerAdvancedSearchModel
    ): void {
        this.extendModelFromStorage(advancedSearchModel);
        this.restorePassengersBackupIfNeeded();
        this.updateModelAfterRestore();
        this.applyDatesFromStoredModel(advancedSearchModel);
        this.finalizeRestoreState();
    }


    private extendModelFromStorage (
        advancedSearchModel: SeekerAdvancedSearchModel
    ): void {
        angular.extend(this.model, advancedSearchModel);
    }

    private restorePassengersBackupIfNeeded (): void {
        const passengersBackup = this.model.passengersSelected;

        if (passengersBackup?.some(p => p.count > 0)) {
            this.model.passengersSelected = passengersBackup;
        }
    }

    private updateModelAfterRestore (): void {
        const bookingUrlParams =
        this.CommonsSessionStorageService.get(BkiStorageConstants.BOOKING_URL_PARAMS) as { flexDates?: string };

        this.updatePassengersModel(this.model.passengers);

        this.IbBookingHeaderSeekerModelService.updateDiscountsData(
            this.model,
            this.discountResident,
            this.discountFamily
        );

        this.model.flexDates = bookingUrlParams?.flexDates === 'true';

        this.buildSpecialPassengerTypes();
    }

    private applyDatesFromStoredModel (advancedSearchModel: SeekerAdvancedSearchModel): void {
        if (advancedSearchModel.selectedOutbondDate) {
            this.model.selectedOutbondDate =
            new Date(advancedSearchModel.selectedOutbondDate);
        }

        this.calculatePetsDisabledByTime();

        if (advancedSearchModel.selectedReturnDate && !this.isHMad) {
            this.model.selectedReturnDate =
            new Date(advancedSearchModel.selectedReturnDate);
        }

        this.updateDateValueModel();
        this.normalizePassengersIfNeeded();
    }

    private finalizeRestoreState (): void {
        this.model.showDatepicker = true;

        if (this.isHMad && this.trips.length === 3) {
            this.showStopOption = true;
            this.model.selectedReturnDate =
            new Date(
                dayjs(this.trips[2].dateFlight, 'DD/MM/YYYY').toDate()
            );
        }

        this.loadingAdvancedSearch = false;

        this.$timeout(() => {
            this.openCalendarAction();
        });
    }

    private normalizePassengersIfNeeded (): void {
        const passengersChanged =
        this.model.passengers.numAdults !== this.passengers.numAdults ||
        this.model.passengers.numChilds !== this.passengers.numChilds ||
        this.model.passengers.numInfants !== this.passengers.numInfants;

        if (!passengersChanged) return;

        this.model.passengers = { ...this.passengers };
        this.model.passengersConditions.totalAdults = 0;
        this.model.passengersConditions.maxChilds = 0;
        this.model.passengersConditions.passengersCount = 0;
        this.updatePassengersModel(this.model.passengers);
    }

    private buildCabinsModel (cabinsData: SeekerCabinModel[]): void {
        const bookingUrlParams =
        this.CommonsSessionStorageService.get(BkiStorageConstants.BOOKING_URL_PARAMS) as { preferredCabin?: string };

        this.model.typeCabins = cabinsData;
        this.model.cabinSelected =
        this.model.typeCabins.find(
            cabin => cabin.code === bookingUrlParams.preferredCabin
        ) ?? this.model.typeCabins[0];

        this.CommonsSessionStorageService.set(BkiStorageConstants.INITIAL_ADVANCED_SEARCH_MODEL, this.model);
    }

    private buildSpecialPassengerTypes (): void {
        const specialPassengerOriginDestinationList = this.CommonsSessionStorageService.get(BkiStorageConstants.SPECIAL_PASSENGERS_BY_MARKET_LIST) || [];

        this.seniorTypeAvailable =
        this.ibBookingSeekerPassengerService.checkSpecialPassengerOriginDestination(
            'SENIOR',
            this.trips[0].originCode,
            this.trips[0].destinyCode,
            specialPassengerOriginDestinationList
        );

        this.youngTypeAvailable =
        this.ibBookingSeekerPassengerService.checkSpecialPassengerOriginDestination(
            'YOUNG',
            this.trips[0].originCode,
            this.trips[0].destinyCode,
            specialPassengerOriginDestinationList
        );

        this.teenagerTypeAvailable =
        this.ibBookingSeekerPassengerService.checkSpecialPassengerOriginDestination(
            'TEENAGER',
            this.trips[0].originCode,
            this.trips[0].destinyCode,
            specialPassengerOriginDestinationList
        );

        this.setAdvancedSearchPassengers();
        this.CommonsSessionStorageService.set(BkiStorageConstants.INITIAL_ADVANCED_SEARCH_MODEL, this.model);
    }

    private handleAdvancedSearchError (error: any): void {
        this.close();
        this.loadingAdvancedSearch = false;
        this.CommonsModalService
            .showGenericError(error)
            .result.then(angular.noop, angular.noop);
    }

    setAdvancedSearchPassengers = (): void => {
        if (this.model.passengersSelected && this.model.passengersSelected.some(p => p.count > 0)) return;

        this.model.passengers = (this.model.passengers !== null && typeof (this.model.passengers) === 'object') ? this.model.passengers : { ...this.passengers };

        const { adults, senior, young, teenager, child, infant } = this.ibBookingSeekerPassengerService.buildDefaultPassengers();

        this.applyUnavailableSpecialPassenger(senior, this.seniorTypeAvailable, 'numSeniors');
        this.applyUnavailableSpecialPassenger(young, this.youngTypeAvailable, 'numYouth');
        this.applyUnavailableSpecialPassenger(teenager, this.teenagerTypeAvailable, 'numTeenager');

        const isAviosChecked = this.model.aviosChecked;
        infant.isActive = !isAviosChecked;
        if (isAviosChecked) this.model.passengers.numInfants = 0;

        this.model.specialPassengerTypeHasError = this.computeSpecialPassengerTypeError(senior, young, teenager);

        this.model.resetToggleCounter = true;
        adults.infoAge = this.resolveAdultInfoAgeLiteral();

        this.model.passengersSelected = [senior, adults, young, teenager, child, infant];
        this.updatePassengersModel(this.model.passengers);
        this.CommonsSessionStorageService.set(BkiStorageConstants.ADVANCED_SEARCH_PASSENGERS_MODEL, this.model.passengersSelected);
    };
    

    private applyUnavailableSpecialPassenger (
        passenger: SeekerPassengerModel,
        isAvailable: boolean,
        countKey: 'numSeniors' | 'numYouth' | 'numTeenager'
    ): void {
        if (isAvailable) return;

        passenger.isActive = false;
        passenger.isHidden = true;

        if (this.model.passengers[countKey] > 0) {
            passenger.isHidden = false;
            passenger.showMessage = true;
        }

        this.model.passengers.numAdults += this.model.passengers[countKey];
        this.model.passengers[countKey] = 0;
    }


    private computeSpecialPassengerTypeError (
        senior: SeekerPassengerModel,
        young: SeekerPassengerModel,
        teenager: SeekerPassengerModel
    ): boolean {
        return senior.showMessage || young.showMessage || (teenager.showMessage && this.model.specialTypeAvailableLastSearch);
    }


    updateSelectedPassengers = (event, updatedPassengers: SeekerPassengerModel[]) => {
        this.model.passengers.numberPassengers = 0;
        updatedPassengers.forEach(passengerElement => {
            switch (passengerElement.passengerType) {
                    case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.SENIOR:
                        this.model.passengers.numSeniors = passengerElement.count;
                        break;
                    case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.ADULT:
                        this.model.passengers.numAdults = passengerElement.count;
                        break;
                    case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.YOUTH:
                        this.model.passengers.numYouth = passengerElement.count;
                        break;
                    case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.YOUNG:
                        this.model.passengers.numTeenager = passengerElement.count;
                        break;
                    case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.CHILD:
                        this.model.passengers.numChilds = passengerElement.count;
                        break;
                    case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT:
                        this.model.passengers.numInfants = passengerElement.count;
                        break;
            }
            this.model.passengers.numberPassengers += passengerElement.count;
        });

        this.updatePassengersModel(this.model.passengers);
    };
    changeNightOption = () => {
        this.nightOptionChanged = true;
    };
    changeStopOption = () => {
        this.stopOptionChanged = true;
    };
    updateDateOptionsOutbount = () => {
        this.$scope.$broadcast('updateDateOptionsOutbount', this.model.tripOptionSelected.code);
        if (this.model.tripOptionSelected.code === 3) {
            this.goMultipleTracksSearchEnginePage();
        } else if (this.model.tripOptionSelected.code === 1) {
            this.model.selectedReturnDate = null;
            this.showStopOption = false;
        } else {
            this.model.selectedReturnDate = new Date(this.model.selectedOutbondDate.getTime() + this.day);
            this.$scope.$broadcast('updateDateValueModel', this.model.selectedOutbondDate, this.model.selectedReturnDate);
            this.showStopOption = true;
            this.model.stopOptionSelected = this.model.stops[0];
        }
        this.checkMaximumNights();
    };
    updateDateValueModel = () => {
        this.$scope.$broadcast('updateDateValueModel', this.model.selectedOutbondDate, this.model.selectedReturnDate);
    };
    transformLastSearchList = (searchData: SeekerAdvancedSearchModel) : SeekerStorageSearch => {
        this.clearReturnDateIfOneWay();

        return {
            iataOrigen: searchData.cityOrigin.code,
            iataDestino: searchData.cityDestiny.code,
            fechaIda: this.buildDateObject(searchData.selectedOutbondDate),
            fechaVuelta: this.buildDateObject(searchData.selectedReturnDate),
            adultos: this.getPassengerCountAt(searchData.passengersSelected, 1),
            niños: this.getPassengerCountAt(searchData.passengersSelected, 4),
            bebes: this.getPassengerCountAt(searchData.passengersSelected, 5),
            senior: this.getPassengerCountAt(searchData.passengersSelected, 0),
            joven: this.calculateYouthValue(searchData.passengersSelected),
            tarifa: searchData.cabinSelected?.code || 'R',
            fechasFlexibles: true,
            residentes: searchData.discountResident.value || '',
            familia: searchData.discountFamily.value || '',
            pagoAvios: searchData.payWithAvios,
            pagoPuntos: searchData.payWithPoints,
            youngType: this.determineYoungType(searchData.passengersSelected)
        };
    };

    private clearReturnDateIfOneWay (): void {
        if (this.model.tripOptionSelected.code === 1) {
            this.model.selectedReturnDate = null;
        }
    }

    private buildDateObject (date: Date | null): { day: string; month: string; year: string } {
        if (!date) {
            return { day: '', month: '', year: '' };
        }
        return {
            day: this.zeroInDate(date.getDate()),
            month: this.zeroInDate(date.getMonth() + 1),
            year: date.getFullYear().toString()
        };
    }

    private getPassengerCountAt (passengers: SeekerPassengerModel[], index: number): number {
        return passengers[index]?.count ?? 0;
    }

    private calculateYouthValue (passengers: SeekerPassengerModel[]): number {
        const youngPassenger = passengers[2];
        const teenPassenger = passengers[3];

        if (youngPassenger?.count > 0) {
            return youngPassenger.count;
        }
        if (teenPassenger?.count > 0) {
            return teenPassenger.count;
        }
        return 0;
    }

    private determineYoungType (passengers: SeekerPassengerModel[]): string {
        const isYouthType = passengers[2]?.passengerType === 'YOUTH';
        return isYouthType ? 'YTH' : 'BNN';
    }

    updateLastSearchList = (searchData: SeekerAdvancedSearchModel) => {
        const lastSearchElement = this.transformLastSearchList (searchData);
        this.IbLastSearchStorageService.pushSearch(lastSearchElement);
    };

    generateLastSearchStopover = (lastSearchElement: SeekerStorageSearch) => {        
        let lastSearchSO: lastSearchStopoverModel = {
            adultos: lastSearchElement.adultos,
            bebes: lastSearchElement.bebes,
            checkIdaYVuelta: lastSearchElement.fechaVuelta.day.length > 0 ? true : false,
            expirationTimestamp: new Date().setDate( new Date().getDate() + 90 ),
            fechaIda: lastSearchElement.fechaIda.year + '/' + lastSearchElement.fechaIda.month + '/' + lastSearchElement.fechaIda.day,
            fechaVuelta: lastSearchElement.fechaVuelta.year + '/' + lastSearchElement.fechaVuelta.month + '/' + lastSearchElement.fechaVuelta.day,
            locale: this.$rootScope.appLang,
            nights: this.model?.nightOptionSelected.code,
            niños: lastSearchElement.niños,
            iataDestino: lastSearchElement.iataDestino,
            iataOrigen: lastSearchElement.iataOrigen,
            nombreDestino: lastSearchElement.iataDestino,
            nombreOrigen: lastSearchElement.iataOrigen,
            pasajeros: this.model?.passengers?.numberPassengers.toString(),
            stopOverIda: this.model?.stopOptionSelected.code === 1
        };
        const lastSearch = this.IbLastSearchStorageService.pushSearchSO(lastSearchElement, lastSearchSO);
        this.CommonsSessionStorageService.set(BkiStorageConstants.LAST_SEARCH_STOP_OVER, lastSearch);

    };

    private zeroInDate = (n: number):string  => {
        return String('00' + n).slice(-2);
    };
    newSearch = () => {
        const advancedSearchModel : SeekerAdvancedSearchModel = this.CommonsSessionStorageService.get(BkiStorageConstants.INITIAL_ADVANCED_SEARCH_MODEL), passengersModel:SeekerPassengerModel[] = this.CommonsSessionStorageService.get(BkiStorageConstants.ADVANCED_SEARCH_PASSENGERS_MODEL);
        const actualStepFlow: string = this.CommonsSessionStorageService.get(BkiStorageConstants.ACTUAL_STEP_FLOW) || '';
        const ignoreOrderBKI: boolean =  (actualStepFlow.toUpperCase() === 'IBCMTV' || actualStepFlow.toUpperCase() === 'IBPURC');


        if (passengersModel) this.model.passengersSelected = passengersModel;
        
        advancedSearchModel.selectedOutbondDate = new Date(advancedSearchModel.selectedOutbondDate);
        advancedSearchModel.selectedReturnDate = new Date(advancedSearchModel.selectedReturnDate);
        this.containerForm.$submitted = true;
        if (this.containerForm.$valid && !this.model.specialPassengerTypeHasError) {
            this.close();
            this.CommonsSessionStorageService.remove(BkiStorageConstants.INITIAL_ADVANCED_SEARCH_MODEL);
            this.CommonsSessionStorageService.remove(BkiStorageConstants.IGNORE_ORDER_BKI);
            this.updateLastSearchList(this.model);
            if(ignoreOrderBKI) {
                this.CommonsSessionStorageService.set(BkiStorageConstants.IGNORE_ORDER_BKI, ignoreOrderBKI);
            }
            this.model.isPetFlight = this.isPetsSelected;
            const url = this.IbBookingHeaderSeekerService.createRequestNewAdvancedSearch(this.model);
            this.CommonsSessionStorageService.remove(BkiStorageConstants.HEADER_MODEL);
            this.RedirectionService.externalRedirect(url);
        }
        
    };
    updateHMadCookie = (cookie) => this.CommonsCookiesService.set('IBERIACOM_LAST_SEARCH_SO', cookie);

    newHMadSearch = () => {
        this.containerForm.$submitted = true;
        if (this.containerForm.$valid && !this.model.specialPassengerTypeHasError) {
            const hMadSearch = this.IbBookingHeaderSeekerService.createRequestNewAdvancedSearchHMad(this.model);
            this.updateHMadCookie(hMadSearch.cookie);
            const lastSearchSO = this.transformLastSearchList(this.model);
            this.generateLastSearchStopover(lastSearchSO);
            this.RedirectionService.externalRedirect(hMadSearch.url);
        }
    };
    updateSelectedCity = (cityUpdateEvent: CityUpdateEvent): void => {
        const { city, index, containerForm } = cityUpdateEvent;
        const currentSelectorKey = `selector_city_${index}`;

        this.containerForm[currentSelectorKey] = containerForm;

        if (!city) {
            return;
        }

        if (index === 0) {
            this.model.cityOrigin = city;
        } else {
            this.model.cityDestiny = city;
        }
        
        this.updateAllowedCities(city, index);
        this.validateSameCityError(city, index);

        this.$timeout(() => {
            this.updateSpecialPassengerAvailable(
                this.model.cityOrigin?.code,
                this.model.cityDestiny?.code
            );
            this.updateDiscount(city);
        }, 500);
    };

    private saveCityToModel (city: SeekerCityModel, index: number): void {
       
    }

    private validateSameCityError (city: SeekerCityModel, index: number): void {
        const isOrigin = index === 0;
        const currentSelectorKey = `selector_city_${index}`;
        const otherSelectorKey = `selector_city_${isOrigin ? 1 : 0}`;
        const otherCity = isOrigin ? this.model.cityDestiny : this.model.cityOrigin;

        const isSameCity = otherCity?.code === city.code;

        if (isSameCity) {
            this.setSameCityError(currentSelectorKey, true);
        } else {
            this.clearSameCityError(currentSelectorKey);
            this.clearSameCityError(otherSelectorKey);
        }
    }

    private setSameCityError (selectorKey: string, hasError: boolean): void {
        this.containerForm[selectorKey].errors['sameCity'] = hasError;

        if (hasError) {
            this.containerForm[selectorKey].hasError = true;
        } else {
            this.containerForm[selectorKey].submitted = false;
            this.containerForm[selectorKey].hasError = this.hasAnyError(selectorKey);
        }
    }

    private clearSameCityError (selectorKey: string): void {
        if (this.containerForm[selectorKey] !== undefined) {
            this.containerForm[selectorKey].errors['sameCity'] = false;
            this.containerForm[selectorKey].submitted = false;
            this.containerForm[selectorKey].hasError = this.hasAnyError(selectorKey);
        }
    }

    private hasAnyError (selectorKey: string): boolean {
        const errors = this.containerForm[selectorKey]?.errors;
        if (!errors) {
            return false;
        }
        return Object.values(errors).some((value) => value === true);
    }
    
    updateAllowedCities = (city: SeekerCityModel, index: number) => {
        if(index === 1) {
            this.model.originAllowedCities = city.country === 'ES' ? this.citiesOutsideSpain : this.model.cities;
        }else if(index === 0) {
            this.model.destinationAllowedCities = city.country === 'ES' ? this.citiesOutsideSpain : this.model.cities;
        }
    };
    updateDiscount = (city: SeekerCityModel) => {
        const desFamilyConfig: LocalDiscountConfig = this.discountFamily;
        const desResiConfig: LocalDiscountConfig = this.discountResident;
        const selected: LocalDiscountConfig['items'][0] = this.model.discountResident;

        if (city.country !== 'ES') {
            this.model.discountFamily = desFamilyConfig.items[0];
            this.model.discountResident = desResiConfig.items[0];
        }

        const origin = this.getCityCode(this.model.cityOrigin);
        const destination = this.getCityCode(this.model.cityDestiny);
        const discounts: string[] = this.BookingLocalDiscountsService.getResidentsDiscountsForRoute(origin, destination);
        this.applyResidentDiscount(selected, discounts, desResiConfig);
    };

    private getCityCode (city: SeekerCityModel | undefined): string {
        return city ? city.code : '';
    }

    private applyResidentDiscount (
        selected: LocalDiscountConfig['items'][0],
        discounts: string[],
        desResiConfig: LocalDiscountConfig
    ): void {
        const currentValue = this.model.discountResident.value;
        if (typeof currentValue !== 'string' || currentValue.length === 0 || discounts.includes(selected.value)) {
            return;
        }

        const equivalent = desResiConfig.items.find(
            item => discounts.includes(item.value) && item.description === selected.description
        );
        this.model.discountResident = equivalent ?? desResiConfig.items[0];
    }
    goMultipleTracksSearchEnginePage = () => {
        this.RedirectionService.externalRedirect(this.$filter('LinksFilter')('IBERIA_MULTIPLE_TRACKS_SEARCH_ENGINE'));
    };

    selectPayWithAvios = (checkPayWithAvios: boolean) => {
        this.model.aviosChecked = checkPayWithAvios;

        if (checkPayWithAvios) {
            this.clearInfantPassengerForAvios();
            this.model.discountFamily = this.model.desFamilyConfig.items[0];
            this.model.discountResident = this.model.desResiConfig.items[0];
        } else {
            this.restoreInfantPassengerActivity();
        }

        this.checkAviosSpecialPassengerToAdults(checkPayWithAvios);
    };

    private clearInfantPassengerForAvios (): void {
        const infantPassenger = this.model.passengersSelected.find(
            p => p.passengerType === this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT
        );

        if (!infantPassenger) return;

        this.model.passengersConditions.passengersWithInfants -= infantPassenger.count;
        infantPassenger.count = 0;
        this.model.passengers.numberPassengers -= this.model.passengers.numInfants;
        this.model.passengers.numInfants = 0;
    }

    private restoreInfantPassengerActivity (): void {
        this.model.passengersSelected
            .filter(p => p.passengerType === this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT)
            .forEach(passenger => { passenger.isActive = true; });
    }
    checkAviosSpecialPassengerToAdults = (checked: boolean) => {
        const adultTypeElement = this.findPassengerByType(this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.ADULT);
        const seniorTypeElement = this.findPassengerByType(this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.SENIOR);
        const youngTypeElement = this.findPassengerByType(this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.YOUTH);
        const teenTypeElement = this.findPassengerByType(this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.YOUNG);

        if (checked) {
            this.convertSpecialPassengersToAdults(adultTypeElement, seniorTypeElement, youngTypeElement, teenTypeElement);
        } else {
            this.restoreSpecialPassengersFromAdults(adultTypeElement, seniorTypeElement, youngTypeElement, teenTypeElement);
        }
    };

    private findPassengerByType (passengerType: string): SeekerPassengerModel | undefined {
        return this.model.passengersSelected.find(
            passenger => passenger.passengerType === passengerType
        );
    }

    private convertSpecialPassengersToAdults (
        adultTypeElement: SeekerPassengerModel,
        seniorTypeElement: SeekerPassengerModel | undefined,
        youngTypeElement: SeekerPassengerModel | undefined,
        teenTypeElement: SeekerPassengerModel | undefined
    ): void {
        const specialTypes = [
            this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.SENIOR,
            this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.YOUTH,
            this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.YOUNG
        ];

        const adultsTypeToAdd = this.model.passengersSelected
            .filter(p => specialTypes.includes(p.passengerType) && p.count > 0)
            .reduce((sum, p) => sum + p.count, 0);

        adultTypeElement.count += adultsTypeToAdd;

        this.hideSpecialPassenger(seniorTypeElement);
        this.hideSpecialPassenger(youngTypeElement);
        this.hideSpecialPassenger(teenTypeElement);
    }

    private restoreSpecialPassengersFromAdults (
        adultTypeElement: SeekerPassengerModel,
        seniorTypeElement: SeekerPassengerModel | undefined,
        youngTypeElement: SeekerPassengerModel | undefined,
        teenTypeElement: SeekerPassengerModel | undefined
    ): void {
        const adultsTypeToRemove =
            this.model.passengers.numSeniors +
            this.model.passengers.numTeenager +
            this.model.passengers.numYouth;

        adultTypeElement.count -= adultsTypeToRemove;

        this.restoreSpecialPassenger(seniorTypeElement, this.model.passengers.numSeniors);
        this.restoreSpecialPassenger(youngTypeElement, this.model.passengers.numYouth);
        this.restoreSpecialPassenger(teenTypeElement, this.model.passengers.numTeenager);
    }

    private hideSpecialPassenger (passenger: SeekerPassengerModel | undefined): void {
        if (!passenger) return;
        passenger.count = 0;
        passenger.isHidden = true;
    }

    private restoreSpecialPassenger (passenger: SeekerPassengerModel | undefined, count: number): void {
        if (!passenger || !passenger.isActive) return;
        passenger.count = count;
        passenger.isHidden = false;
    }
    triggerCollapse = () => {
        let clickedElement, clickedParent;
        this.toggle();
        this.accesibility();
        if (this.isOpen) {
            this.$window.onclick = (event) =>{
                clickedElement = event.target;
                clickedParent = clickedElement.closest('.ib-radio-select');
                if (clickedParent === null) {
                    this.isOpen = false;
                    this.isCollapsed = true;
                }
            };
        } else {
            this.isOpen = false;
            this.isCollapsed = true;
            this.$window.onclick = null;
        }
    };
    controlCollapse = (event) => {
        if (event.keyCode === 27) {
            this.isOpen = false;
            this.accesibility();
        }
    };
    toggle = () => {
        this.isOpen = !this.isOpen;
        this.isCollapsed = !this.isCollapsed;
    };
    accesibility = () => {
        this.isOpen ? this.ariaText = 'HEADER_ADVANCED_SEARCH_PASSENGERS_OPENED' : this.ariaText = 'HEADER_ADVANCED_SEARCH_PASSENGERS_CLOSED';
        return this.ariaText;
    };
    validateRadioResident = (radio: LocalDiscountConfigItem) : boolean => {
        let flag = false;
        const origin = (this.model.cityOrigin && (typeof(this.model.cityOrigin.code) === 'string')) ? this.model.cityOrigin.code : '';
        const destination = (this.model.cityDestiny && (typeof(this.model.cityDestiny.code) === 'string')) ? this.model.cityDestiny.code : '';
        if (radio && (typeof(radio.value) === 'string')) {
            flag = (radio.value !== '') ? this.BookingLocalDiscountsService.getResidentsDiscountsForRoute(origin, destination).indexOf(radio.value) >= 0 : true;
        }
        return flag;
    };
    showDiscountResident = (): boolean => {
        const origin = (this.model.cityOrigin && (typeof(this.model.cityOrigin.code) === 'string' )) ? this.model.cityOrigin.code : '';
        const destination = (this.model.cityDestiny && (typeof(this.model.cityDestiny.code) === 'string')) ? this.model.cityDestiny.code : '';
        return this.BookingLocalDiscountsService.isResidentAvailable(origin, destination);
    };
    backToMain = (goToHome) => {
        this.$rootScope.$broadcast('backToMain', goToHome);
    };


    updateSpecialPassengerAvailable = (originCode: string, destinationCode: string) => {
        this.model.specialTypeAvailableLastSearch = [this.seniorTypeAvailable, this.youngTypeAvailable, this.teenagerTypeAvailable].some(typeAvailable => typeAvailable);
        
        if(this.model.aviosChecked) {
            this.seniorTypeAvailable = false;
            this.youngTypeAvailable = false;
            this.teenagerTypeAvailable = false;
        }else{
            const specialPassengerOriginDestinationList = this.CommonsSessionStorageService.get(BkiStorageConstants.SPECIAL_PASSENGERS_BY_MARKET_LIST);
            this.seniorTypeAvailable = this.ibBookingSeekerPassengerService.checkSpecialPassengerOriginDestination('SENIOR', originCode, destinationCode, specialPassengerOriginDestinationList);
            this.youngTypeAvailable = this.ibBookingSeekerPassengerService.checkSpecialPassengerOriginDestination('YOUNG', originCode, destinationCode, specialPassengerOriginDestinationList);
            this.teenagerTypeAvailable = this.ibBookingSeekerPassengerService.checkSpecialPassengerOriginDestination('TEENAGER', originCode, destinationCode, specialPassengerOriginDestinationList);
        }
        this.setAdvancedSearchPassengers();
    };



    private resolveAdultInfoAgeLiteral (): string {
        const s = this.seniorTypeAvailable;
        const t = this.teenagerTypeAvailable;
        const y = this.youngTypeAvailable;
        const key = `${s ? 'S' : ''}${t ? 'T' : ''}${y ? 'Y' : ''}`;
        const literals: Record<string, string> = {
            'T':   'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_TEEN_AGE_TEXT',
            'TY':  'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_TEEN_AGE_TEXT',
            'Y':   'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_YOUNG_AGE_TEXT',
            'S':   'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_SENIOR_AGE_TEXT',
            'ST':  'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_SENIOR_AND_TEEN_AGE_TEXT',
            'STY': 'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_SENIOR_AND_TEEN_AGE_TEXT',
            'SY':  'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_SENIOR_AND_YOUNG_AGE_TEXT'
        };
        return literals[key] ?? 'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_AGE_TEXT';
    }

    clickoutCollapse = () => {
        if (this.isOpen && !this.isCollapsed) {
            this.isOpen = false;
            this.isCollapsed = true;
            this.accesibility();
        }
    };

    openCalendarAction = () => {
        if (this.openCalendar) {
            this.$timeout(() => {
                this.$scope.$broadcast('openCalendar', this.openCalendar==='RETURN');
            });
        }
    };

}

try {
    const mod = angular.module(componentInfo.module);
    AdvancedHeaderSearchController.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: AdvancedHeaderSearchController })
    );
} catch (error) {
    const mod = angular.module(componentInfo.module, componentInfo.required);
    AdvancedHeaderSearchController.$inject = componentInfo.inject;
    mod.component(
        componentInfo.selector,
        angular.extend(componentOptions, { controller: AdvancedHeaderSearchController })
    );
}
