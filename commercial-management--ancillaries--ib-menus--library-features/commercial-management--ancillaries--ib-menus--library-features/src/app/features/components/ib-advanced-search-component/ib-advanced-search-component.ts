import {ibAdvancedSearchServiceModel} from '../../services/ib-advanced-search-services/ib-advanced-search-model';
import { AdvancedHeaderSearchService } from '../../services/ib-advanced-search-services/ib-advanced-search-service';
import { LastSearchStorageService } from '../../services/ib-advanced-search-services/ib-lastSearch-storage-service';
import angular from 'angular';
import dayjs from 'dayjs';


const componentOptions = {
    bindings: {
        //redBarModel: '<',
        //greyBarModel: '<',
        trips: '<',
        passengers: '<',
        redemption: '<',
        isOnbusiness: '<',
        openCalendar:'<?'
    },
    controller: 'AdvancedHeaderSearchController',
    controllerAs: 'advHeaSerCtrl', templateUrl: ['$rootScope', ($rootScope) =>
        $rootScope.routes.templates + 'ib-advanced-search-component.html'
    ]
};
const componentInfo = {
    module: 'ib-header-advanced-search-module',
    selector: 'ibAdvancedHeaderSearchComponent',
    inject:['ibAdvancedSearchServiceModel', 'AdvancedHeaderSearchService', 'CommonsModalService',
        'CommonLocalDiscountsService', '$rootScope', 'localStorageService', '$scope',
        'RedirectionService', '$filter', '$window', '$timeout',
        'LastSearchStorageService', 'IbUiPassengerSelectorConstants'],
    required: ['ib-commons-modal-service-module', 'ib-commons-http-service-module', 'ib-ui-city-selector-component-module', 'ib-ui-passenger-selector-module']
};
export class AdvancedHeaderSearchController implements ng.IController {
    private day: number = 60 * 60 * 24 * 1000;
    public trips: RedBarModel.originDestinationResponse[];
    public passengers :RedBarModel.PassengerInfo;
    public redemption: boolean;
    public isOnbusiness: boolean;
    public loadingAdvancedSearch : boolean = true;
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
    public model : MenusModel.AdvancedSearchModel;
    public openCalendar: string;

    //public passengers;

    constructor ( private ibAdvancedSearchServiceModel: ibAdvancedSearchServiceModel,
        private AdvancedHeaderSearchService: AdvancedHeaderSearchService,
        private CommonsModalService: CommonsModalService,
        private CommonLocalDiscountsService: CommonLocalDiscountsService,
        private $rootScope : CommonsRootScope,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $scope: angular.IScope,
        private RedirectionService: RedirectionService,
        private $filter: ng.FilterFactory,
        private $window: ng.IWindowService,
        private $timeout: ng.ITimeoutService,
        private LastSearchStorageService: LastSearchStorageService,
        private IbUiPassengerSelectorConstants: IbUiPassengerSelectorConstantsNamespace.IbUiPassengerSelectorConstants
    ) {
        //Constructor
        this.$scope.$on('updateSelectedCity', this.updateSelectedCity);
        this.$scope.$on('updateSelectedPassengers', this.updateSelectedPassengers);
        this.$scope.$on('national-discount-collapse', this.clickoutCollapse);
        this.discountResident = this.CommonLocalDiscountsService.getDiscountsConfig().resident;
        this.discountFamily = this.CommonLocalDiscountsService.getDiscountsConfig().largeFamily;
        this.model = this.ibAdvancedSearchServiceModel.initializeModel();
    }
    $onInit = () => {
        this.loadingAdvancedSearch = true;
        if ((typeof(this.marketDescription)!== 'string')|| this.marketDescription === '') {
            this.marketDescription = this.localStorageService.get('commercialData') && this.localStorageService.get<any>('commercialData').market ? this.localStorageService.get<any>('commercialData').market.code : '';
        }
        this.getAdvancedSearchModel();
    };

    updatePassengersModel = (passengers: MenusModel.AdvancedSearchModel['passengers']) => {
        let i = 0;
        this.model.passengersConditions.totalAdults = 0;
        this.model.passengersConditions.maxChilds = 0;
        this.model.passengersConditions.passengersCount = 0;
        this.model.passengersConditions.passengersWithInfants = passengers.numberPassengers;
        for (i = 0; i < this.model.passengersSelected.length; i++) {
            switch (this.model.passengersSelected[i].passengerType) {

                    case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.SENIOR:
                        this.model.passengersSelected[i].count = passengers.numSeniors || 0;
                        break;
                    case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.ADULT:
                        this.model.passengersSelected[i].count = passengers.numAdults || 0;
                        break;
                    case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.YOUTH:
                        this.model.passengersSelected[i].count = passengers.numYouth || 0;
                        break;
                    case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.YOUNG:
                        this.model.passengersSelected[i].count = passengers.numTeenager || 0;
                        break;
                    case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.CHILD:
                        this.model.passengersSelected[i].count = passengers.numChilds || 0;
                        break;
                    case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT:
                        this.model.passengersSelected[i].count = passengers.numInfants || 0;
                        break;
            }
            if (this.model.passengersSelected[i].count > 0) {
                if (this.model.passengersSelected[i].passengerType !== this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT)
                    this.model.passengersConditions.passengersCount += this.model.passengersSelected[i].count;
                if ((this.model.passengersSelected[i].passengerType !== this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT) &&
                    (this.model.passengersSelected[i].passengerType !== this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.CHILD)) {
                    this.model.passengersConditions.totalAdults += this.model.passengersSelected[i].count;
                    this.model.passengersConditions.maxChilds += (2 * this.model.passengersSelected[i].count);
                }
            }
        }
    };

    close  = ()=> {
        this.$rootScope.$broadcast('toggleAdvancedSearch', false);
    };

    getAdvancedSearchModel = () => {
        const advancedSearchModel: MenusModel.AdvancedSearchModel = this.localStorageService.get('InitialAdvancedSearchModel');
        const buildAdvancedSearch = () => {
            const bookingUrlParams: any = this.localStorageService.get('bookingUrlParams');
            if (this.trips[0].dateFlight) {
                this.model.selectedOutbondDate = new Date(dayjs(this.trips[0].dateFlight, 'DD/MM/YYYY').toDate());
            }
            if (this.trips[0].returnFlight) {
                this.model.selectedReturnDate = new Date(dayjs(this.trips[0].returnFlight, 'DD/MM/YYYY').toDate());
            }
            this.updateDateValueModel();
            this.model.showDatepicker = true;
            this.model.tripOptionSelected = this.trips[0].tripType === '2' ? this.model.tripOptions[1] : this.model.tripOptions[0];
            this.model.flexDates = !!(bookingUrlParams && bookingUrlParams.flexDates === 'true');
            if (this.redemption) {
                if (!this.isOnbusiness) {
                    this.model.payWithAvios = true;
                    this.checkAviosSpecialPassengerToAdults(true);
                } else {
                    this.model.payWithPoints = true;
                }
            }
            this.localStorageService.set('InitialAdvancedSearchModel', this.model);
            const datePickerGo: any = angular.element('.ib-input-range-date__start');
            const datePickerReturn: any = angular.element('.ib-input-range-date__end');
            if(datePickerGo?.datapicker) datePickerGo.datepicker('refresh');
            if(datePickerReturn?.datapicker) datePickerReturn.datepicker('refresh');
            this.$timeout(() => { 
                this.loadingAdvancedSearch = false;
            });
            this.$timeout(() => {
                this.openCalendarAction();
            }, 150);
            
        };
        const buildAdvancedSearchError =  (error) => {
            this.close();
            this.loadingAdvancedSearch = false;
            this.CommonsModalService.showGenericError(error).result.then(angular.noop, angular.noop);
        };
        const buildCitiesModel = (citiesData: MenusModel.AreasModel) => {
            this.model.cities = citiesData.cities;
            this.model.cityOrigin = citiesData.origin;
            this.model.cityDestiny = citiesData.destiny;
            this.localStorageService.set('InitialAdvancedSearchModel', this.model);
            this.showOriginDestinyFieldsLoading = false;  
        };
        const buildCabinsModel = (cabinsData: MenusModel.CabinModel[]) => {
            const bookingUrlParams: any = this.localStorageService.get('bookingUrlParams');
            this.model.typeCabins = cabinsData;
            this.model.cabinSelected = bookingUrlParams.preferredCabin ? this.model.typeCabins.find(cabin => cabin.code === bookingUrlParams.preferredCabin) : this.model.typeCabins[0];
            this.localStorageService.set('InitialAdvancedSearchModel', this.model);
            
        };
        const buildSpecialPassengerTypes = ()=> {
            this.seniorTypeAvailable = this.checkSpecialPassengerOriginDestination('SENIOR', this.trips[0].originCode, this.trips[0].destinyCode);
            this.youngTypeAvailable = this.checkSpecialPassengerOriginDestination('YOUNG', this.trips[0].originCode, this.trips[0].destinyCode);
            this.teenagerTypeAvailable = this.checkSpecialPassengerOriginDestination('TEENAGER', this.trips[0].originCode, this.trips[0].destinyCode);
            this.setAdvancedSearchPassengers();
            this.localStorageService.set('InitialAdvancedSearchModel', this.model);
        };
        const setAdvancedSearchModel = (advancedSearchModel: MenusModel.AdvancedSearchModel) => {
            const bookingUrlParams: any = this.localStorageService.get('bookingUrlParams');
            angular.extend(this.model, advancedSearchModel);
            this.ibAdvancedSearchServiceModel.updateDiscountsData(this.model, this.discountResident, this.discountFamily);
            this.model.flexDates  = !!(bookingUrlParams && bookingUrlParams.flexDates === 'true');
            buildSpecialPassengerTypes();
            if (advancedSearchModel.selectedOutbondDate) {
                this.model.selectedOutbondDate = new Date(advancedSearchModel.selectedOutbondDate);
            }
            if (advancedSearchModel.selectedReturnDate) {
                this.model.selectedReturnDate = new Date(advancedSearchModel.selectedReturnDate);
            }
            this.updateDateValueModel();
            if (this.model.passengers.numAdults !== this.passengers.numAdults ||
                this.model.passengers.numChilds !== this.passengers.numChilds ||
                this.model.passengers.numInfants !== this.passengers.numInfants) {
                this.model.passengers = {...this.passengers};
                this.model.passengersConditions.totalAdults = 0;
                this.model.passengersConditions.maxChilds = 0;
                this.model.passengersConditions.passengersCount = 0;
                this.updatePassengersModel(this.model.passengers);
            }
            this.model.showDatepicker = true;
            this.loadingAdvancedSearch = false;
            this.$timeout(() => { 
                this.openCalendarAction();
            });
        };


        if (!advancedSearchModel) {
            this.model= this.ibAdvancedSearchServiceModel.initializeModel(this.discountResident, this.discountFamily);
            const prom1 = this.AdvancedHeaderSearchService.getCabinTypes().then((cabinModelData) => { buildCabinsModel(cabinModelData); }, (error) => { Promise.reject(error); });
            const prom2 = this.AdvancedHeaderSearchService.getDestinationAreas(this.trips[0].originCode, this.trips[0].destinyCode).then((citiesModelData) => { buildCitiesModel(citiesModelData); }, (error) => { Promise.reject(error); });
            const prom3 = this.AdvancedHeaderSearchService.getSpecialPassengerOriginDestination(this.$rootScope.appMarket).then(() => { buildSpecialPassengerTypes(); }, (error) => { Promise.reject(error); });
            Promise.all([prom1, prom2, prom3]).then(buildAdvancedSearch, buildAdvancedSearchError);
        } else if (this.model !== advancedSearchModel) {
            setAdvancedSearchModel(advancedSearchModel);
        }
    };

    setAdvancedSearchPassengers = () => {

        const adults: MenusModel.PassengerModel = { passengerType: this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.ADULT, minPassenger: 1, maxPassengers: 9, infoAge: 'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_AGE_TEXT', count: 1, isActive: true, isHidden:false, showMessage:false };
        const senior: MenusModel.PassengerModel = { passengerType: this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.SENIOR, minPassenger: 0, maxPassengers: 9, infoAge: 'HEADER_ADVANCED_SEARCH_PASSENGER_SENIOR_AGE_TEXT', count: 0, isActive: true, isHidden:false, showMessage:false };
        const young: MenusModel.PassengerModel = { passengerType: this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.YOUTH, minPassenger: 0, maxPassengers: 9, infoAge: 'HEADER_ADVANCED_SEARCH_PASSENGER_YOUNG_AGE_TEXT', count: 0, isActive: true, isHidden:false, showMessage:false };
        const child: MenusModel.PassengerModel = { passengerType: this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.CHILD, minPassenger: 0, maxPassengers: 9, infoAge: 'HEADER_ADVANCED_SEARCH_PASSENGER_CHILD_AGE_TEXT', count: 0, isActive: true, isHidden:false, showMessage:false };
        const teenager: MenusModel.PassengerModel = { passengerType: this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.YOUNG, minPassenger: 0, maxPassengers: 9, infoAge: 'HEADER_ADVANCED_SEARCH_PASSENGER_TEENAGER_AGE_TEXT', count: 0, isActive: true, isHidden:false, showMessage:false };
        const infant: MenusModel.PassengerModel = { passengerType: this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT, minPassenger: 0, maxPassengers: 9, infoAge: 'HEADER_ADVANCED_SEARCH_PASSENGER_INFANT_AGE_TEXT', count: 0, isActive: true, isHidden:false, showMessage:false };
        this.model.passengers = (this.model.passengers !== null && typeof (this.model.passengers) === 'object')?  this.model.passengers : {...this.passengers};

        if(!this.seniorTypeAvailable) {
            senior.isActive = false;
            senior.isHidden = true;
            if(this.model.passengers.numSeniors > 0) {
                senior.isHidden = false;
                senior.showMessage = true;
            }
            this.model.passengers.numAdults += this.model.passengers.numSeniors;
            this.model.passengers.numSeniors = 0;

        }
        if(!this.youngTypeAvailable) {
            young.isActive = false;
            young.isHidden = true;
            if(this.model.passengers.numYouth > 0) {
                young.isHidden = false;
                young.showMessage = true;
            }
            this.model.passengers.numAdults += this.model.passengers.numYouth;
            this.model.passengers.numYouth = 0;

        }
        if(!this.teenagerTypeAvailable) {
            teenager.isActive = false;
            teenager.isHidden = true;
            if(this.model.passengers.numTeenager > 0) {
                teenager.isHidden = false;
                teenager.showMessage = true;
            }
            this.model.passengers.numAdults += this.model.passengers.numTeenager;
            this.model.passengers.numTeenager = 0;

        }
        if(this.model.aviosChecked) {
            this.model.passengers.numInfants = 0;
            infant.isActive = false;
        }else{
            infant.isActive = true;
        }

        if(senior.showMessage || young.showMessage || (teenager.showMessage && (this.model.specialTypeAvailableLastSearch))) {
            this.model.specialPassengerTypeHasError = true;
        }else{
            this.model.specialPassengerTypeHasError = false;
        }

        this.model.resetToggleCounter = true;
        adults.infoAge = this.setAdultInfoAgeLiteral(this.teenagerTypeAvailable, this.seniorTypeAvailable, this.youngTypeAvailable);
        this.model.passengersSelected = [senior, adults, young, teenager, child, infant];
        this.updatePassengersModel(this.model.passengers);
        this.localStorageService.set('AdvancedSearchPassengersModel', this.model.passengersSelected);
    };
    checkSpecialPassengerOriginDestination = (passengerType: string, originCode: string, destinationCode: string): boolean => {
        let specialPassengerOriginDestinationList: any = [], originMatchedElement: any = {}, destinationCodeMatches: boolean = false;
        specialPassengerOriginDestinationList = this.localStorageService.get('specialPassengersByMarketList');
        if(specialPassengerOriginDestinationList && specialPassengerOriginDestinationList[passengerType] && specialPassengerOriginDestinationList[passengerType].length > 0) {
            originMatchedElement = specialPassengerOriginDestinationList[passengerType].find( originCodeElement => originCodeElement.origin === originCode);
            if(!originMatchedElement) {
                originMatchedElement = specialPassengerOriginDestinationList[passengerType].find( originCodeElement => originCodeElement.origin === '*');
            }
            destinationCodeMatches = originMatchedElement ? originMatchedElement.destination.some( destinationCodeElement => destinationCodeElement === destinationCode || destinationCodeElement === '*' ) : false;
            if(destinationCodeMatches) {
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    };
    updateSelectedPassengers = (event, updatedPassengers: MenusModel.PassengerModel[]) => {
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
    updateDateOptionsOutbount = () => {
        this.$scope.$broadcast('updateDateOptionsOutbount', this.model.tripOptionSelected.code);
        if (this.model.tripOptionSelected.code === 3) {
            this.goMultipleTracksSearchEnginePage();
        } else if (this.model.tripOptionSelected.code === 1) {
            this.model.selectedReturnDate = null;
        } else {
            this.model.selectedReturnDate = new Date(this.model.selectedOutbondDate.getTime() + this.day);
            this.$scope.$broadcast('updateDateValueModel', this.model.selectedOutbondDate, this.model.selectedReturnDate);
        }
    };
    updateDateValueModel = () => {
        this.$scope.$broadcast('updateDateValueModel', this.model.selectedOutbondDate, this.model.selectedReturnDate);
    };
    /**
         * Return date adding two years
         */
    private getNextYear = () => {
        const date = new Date();
        return date.setFullYear(date.getFullYear() + 2);
    };
    updateLastSearchList = (searchData: MenusModel.AdvancedSearchModel) => {
        // eslint-disable-next-line no-nested-ternary
        const youthValue: number = (searchData.passengersSelected[2] && searchData.passengersSelected[2].count > 0) ? searchData.passengersSelected[2].count
            : (searchData.passengersSelected[3] && searchData.passengersSelected[3].count > 0) ? searchData.passengersSelected[3].count : 0;
        if (this.model.tripOptionSelected.code === 1) {
            this.model.selectedReturnDate = null;
        }
        const lastSearchElement: LastSearchStorageModel.search = {
            iataOrigen : searchData.cityOrigin.code,
            iataDestino : searchData.cityDestiny.code,
            fechaIda : {
                day: searchData.selectedOutbondDate ? this.zeroInDate(searchData.selectedOutbondDate.getDate()) : '',
                month: searchData.selectedOutbondDate ? this.zeroInDate(searchData.selectedOutbondDate.getMonth() + 1): '',
                year: searchData.selectedOutbondDate ? searchData.selectedOutbondDate.getFullYear().toString() : ''
            },
            fechaVuelta : {
                day: searchData.selectedReturnDate ? this.zeroInDate(searchData.selectedReturnDate.getDate()) : '',
                month: searchData.selectedReturnDate ? this.zeroInDate(searchData.selectedReturnDate.getMonth() + 1) : '',
                year: searchData.selectedReturnDate ? searchData.selectedReturnDate.getFullYear().toString() : ''
            },
            adultos : searchData.passengersSelected[1] ? searchData.passengersSelected[1].count : 0,
            niños : searchData.passengersSelected[4] ? searchData.passengersSelected[4].count : 0,
            bebes : searchData.passengersSelected[5] ? searchData.passengersSelected[5].count : 0,
            senior : searchData.passengersSelected[0]? searchData.passengersSelected[0].count : 0,
            joven : youthValue,
            tarifa : searchData.cabinSelected.code,
            fechasFlexibles : true,
            residentes : searchData.discountResident.value || '',
            familia : searchData.discountFamily.value || '',
            pagoAvios : searchData.payWithAvios,
            pagoPuntos : searchData.payWithPoints,
            youngType : (searchData.passengersSelected[2] && searchData.passengersSelected[2].passengerType === 'YOUTH') ? 'YTH' : 'BNN'
        };
        this.LastSearchStorageService.pushSearch(lastSearchElement);
    };
    private zeroInDate = (n: number):string  => {
        return String('00' + n).slice(-2);
    };
    newSearch = () => {
        const advancedSearchModel : MenusModel.AdvancedSearchModel = this.localStorageService.get('InitialAdvancedSearchModel'), passengersModel:MenusModel.PassengerModel[] = this.localStorageService.get('AdvancedSearchPassengersModel');
        const flowApp: string = this.localStorageService.get('flowApp') || '';
        const isFlowBKI: boolean = this.$rootScope.flowName.toUpperCase() === 'BKI' || flowApp.toUpperCase() === 'BBKI';
        const actualStepFlow: string = this.localStorageService.get('actualStepFlow') || '';
        const ignoreOrderBKI: boolean = isFlowBKI && (actualStepFlow.toUpperCase() === 'IBCMTV' || actualStepFlow.toUpperCase() === 'IBPURC');


        if (passengersModel) this.model.passengersSelected = passengersModel;
        advancedSearchModel.selectedOutbondDate = new Date(advancedSearchModel.selectedOutbondDate);
        advancedSearchModel.selectedReturnDate = new Date(advancedSearchModel.selectedReturnDate);
        this.containerForm.$submitted = true;
        if (this.containerForm.$valid && !this.model.specialPassengerTypeHasError) {
            this.close();
            this.localStorageService.remove('InitialAdvancedSearchModel');
            this.localStorageService.remove('ignoreOrderBKI');
            this.updateLastSearchList(this.model);
            if(ignoreOrderBKI) {
                this.localStorageService.set('ignoreOrderBKI', ignoreOrderBKI);
            }
            this.RedirectionService.externalRedirect(this.AdvancedHeaderSearchService.createRequestNewAdvancedSearch(this.model));
        }
    };
    updateSelectedCity = (evt, city, index) => {

        if (index === 0) {
            if (this.model.cityDestiny.code === city.code) {
                this.containerForm['selector_city_' + index].$setValidity('sameCity', false);
            } else {
                this.containerForm['selector_city_' + index].submitted = false;
                this.containerForm['selector_city_' + index].$setValidity('sameCity', true);
                this.containerForm['selector_city_' + index++].submitted = false;
                this.containerForm['selector_city_' + index++].$setValidity('sameCity', true);
            }
        } else {
            if (this.model.cityOrigin.code === city.code) {
                this.containerForm['selector_city_' + index].$setValidity('sameCity', false);
            } else {
                this.containerForm['selector_city_' + index].submitted = false;
                this.containerForm['selector_city_' + index].$setValidity('sameCity', true);
                this.containerForm['selector_city_' + index--].submitted = false;
                this.containerForm['selector_city_' + index--].$setValidity('sameCity', true);
            }
        }
        this.$timeout(() => {
            if(this.model.cityDestiny.code === city.code ) {
                this.updateSpecialPassengerAvailable(this.model.cityOrigin.code, city.code);
            }else if(this.model.cityOrigin.code === city.code) {
                this.updateSpecialPassengerAvailable(city.code, this.model.cityDestiny.code);
            }
            this.updateDiscount(city);
        }, 500);

    };
    updateDiscount = (city) => {
        const origin: string = (this.model.cityOrigin && (typeof (this.model.cityOrigin.code) === 'string')) ? this.model.cityOrigin.code : '';
        const destination: string = (this.model.cityDestiny && (typeof(this.model.cityDestiny.code) === 'string')) ? this.model.cityDestiny.code : '';
        const discounts: string[] = this.CommonLocalDiscountsService.getResidentsDiscountsForRoute(origin, destination);
        const selected: LocalDiscountConfig['items'][0] = this.model.discountResident;
        let equivalentDisc;

        const desFamilyConfig: LocalDiscountConfig = this.discountFamily;
        const desResiConfig: LocalDiscountConfig = this.discountResident;

        if (city.country !== 'ES') {
            this.model.discountFamily = desFamilyConfig.items[0];
            this.model.discountResident = desResiConfig.items[0];
        }

        if ((typeof(this.model.discountResident.value) === 'string') &&
            this.model.discountResident.value.length > 0 &&
            discounts.indexOf(selected.value) < 0) {
            equivalentDisc = discounts.length > 0 ? desResiConfig.items.filter((element) => {
                return discounts.indexOf(element.value) >= 0 && element.description === selected.description;
            }) : [];
            if (equivalentDisc.length > 0) {
                this.model.discountResident = equivalentDisc[0];
            } else {
                this.model.discountResident = desResiConfig.items[0];
            }
        }
    };
    goMultipleTracksSearchEnginePage = () => {
        this.RedirectionService.externalRedirect(this.$filter('LinksFilter')('IBERIA_MULTIPLE_TRACKS_SEARCH_ENGINE'));
    };

    selectPayWithAvios = (checkPayWithAvios : boolean) => {
        let i: number = 0, found: boolean = false;
        this.model.aviosChecked = checkPayWithAvios;
        if (checkPayWithAvios) {
            while (i < this.model.passengersSelected.length && !found) {
                if (this.model.passengersSelected[i].passengerType === this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT) {
                    this.model.passengersConditions.passengersWithInfants = this.model.passengersConditions.passengersWithInfants - this.model.passengersSelected[i].count;
                    this.model.passengersSelected[i].count = 0;
                    this.model.passengers.numberPassengers -= this.model.passengers.numInfants;
                    this.model.passengers.numInfants = 0;
                    found = true;
                }

                i++;
            }
            this.model.discountFamily = this.model.desFamilyConfig.items[0];
            this.model.discountResident = this.model.desResiConfig.items[0];
        }else{
            for(let i = 0; i < this.model.passengersSelected.length; i++) {
                if(this.model.passengersSelected[i].passengerType === this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT) {
                    this.model.passengersSelected[i].isActive = true;
                }
            }
        }
        this.checkAviosSpecialPassengerToAdults(checkPayWithAvios);
    };
    checkAviosSpecialPassengerToAdults = (checked: boolean) => {
        let adultsTypeToAdd: number = 0, adultsTypeToRemove: number = 0;
        const adultTypeElement = this.model.passengersSelected.find(passenger => passenger.passengerType === this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.ADULT);
        const seniorTypeElement = this.model.passengersSelected.find(passenger => passenger.passengerType === this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.SENIOR);
        const youngTypeElement = this.model.passengersSelected.find(passenger => passenger.passengerType === this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.YOUTH);
        const teenTypeElement = this.model.passengersSelected.find(passenger => passenger.passengerType === this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.YOUNG);

        if(checked) {
            for (let i = 0; i < this.model.passengersSelected.length; i++) {
                if(this.model.passengersSelected[i].passengerType === this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.SENIOR || this.model.passengersSelected[i].passengerType === this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.YOUTH || (this.model.passengersSelected[i].passengerType === this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.YOUNG && this.model.passengersSelected[i].count > 0)) {
                    adultsTypeToAdd += this.model.passengersSelected[i].count;
                }
            }
            adultTypeElement.count += adultsTypeToAdd;
            if(seniorTypeElement) {
                seniorTypeElement.count = 0;
                seniorTypeElement.isHidden = true;
            }
            if(youngTypeElement) {
                youngTypeElement.count = 0;
                youngTypeElement.isHidden = true;
            }
            if(teenTypeElement) {
                teenTypeElement.count = 0;
                teenTypeElement.isHidden = true;
            }
        }else{
            adultsTypeToRemove = this.model.passengers.numSeniors + this.model.passengers.numTeenager + this.model.passengers.numYouth;
            adultTypeElement.count -= adultsTypeToRemove;
            if(seniorTypeElement && seniorTypeElement.isActive) {
                seniorTypeElement.count = this.model.passengers.numSeniors;
                seniorTypeElement.isHidden = false;
            }
            if(youngTypeElement && youngTypeElement.isActive) {
                youngTypeElement.count = this.model.passengers.numYouth;
                youngTypeElement.isHidden = false;
            }
            if(teenTypeElement && teenTypeElement.isActive) {
                teenTypeElement.count = this.model.passengers.numTeenager;
                teenTypeElement.isHidden = false;
            }
        }
    };
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
    validateRadioResident = (radio: MenusModel.AdvancedSearchModel['discountResident']) : boolean => {
        let flag = false;
        const origin = (this.model.cityOrigin && (typeof(this.model.cityOrigin.code) === 'string')) ? this.model.cityOrigin.code : '';
        const destination = (this.model.cityDestiny && (typeof(this.model.cityDestiny.code) === 'string')) ? this.model.cityDestiny.code : '';
        if (radio && (typeof(radio.value) === 'string')) {
            flag = (radio.value !== '') ? this.CommonLocalDiscountsService.getResidentsDiscountsForRoute(origin, destination).indexOf(radio.value) >= 0 : true;
        }
        return flag;
    };
    showDiscountResident = (): boolean => {
        const origin = (this.model.cityOrigin && (typeof(this.model.cityOrigin.code) === 'string' )) ? this.model.cityOrigin.code : '';
        const destination = (this.model.cityDestiny && (typeof(this.model.cityDestiny.code) === 'string')) ? this.model.cityDestiny.code : '';
        return this.CommonLocalDiscountsService.isResidentAvailable(origin, destination);
    };
    backToMain = (goToHome) => {
        this.$rootScope.$broadcast('backToMain', goToHome);
    };


    updateSpecialPassengerAvailable = (originCode: string, destinationCode: string) => {
        this.model.specialTypeAvailableLastSearch = false;
        if(this.seniorTypeAvailable || this.youngTypeAvailable || this.teenagerTypeAvailable) {
            this.model.specialTypeAvailableLastSearch = true;
        }
        if(this.model.aviosChecked) {
            this.seniorTypeAvailable = false;
            this.youngTypeAvailable = false;
            this.teenagerTypeAvailable = false;
        }else{
            this.seniorTypeAvailable = this.checkSpecialPassengerOriginDestination('SENIOR', originCode, destinationCode);
            this.youngTypeAvailable = this.checkSpecialPassengerOriginDestination('YOUNG', originCode, destinationCode);
            this.teenagerTypeAvailable = this.checkSpecialPassengerOriginDestination('TEENAGER', originCode, destinationCode);
        }
        this.setAdvancedSearchPassengers();
    };


    setAdultInfoAgeLiteral = (teenagerAvailable: boolean, seniorAvailable: boolean, youngAvailable: boolean): string => {
        let infoAgeLiteral = '';
        if(teenagerAvailable && !seniorAvailable) {
            infoAgeLiteral = 'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_TEEN_AGE_TEXT';
        }else if(youngAvailable && !seniorAvailable) {
            infoAgeLiteral = 'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_YOUNG_AGE_TEXT';
        }else if(seniorAvailable && !youngAvailable && !teenagerAvailable) {
            infoAgeLiteral = 'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_SENIOR_AGE_TEXT';
        }else if(seniorAvailable && teenagerAvailable) {
            infoAgeLiteral = 'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_SENIOR_AND_TEEN_AGE_TEXT';
        }else if(seniorAvailable && youngAvailable) {
            infoAgeLiteral = 'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_WITH_SENIOR_AND_YOUNG_AGE_TEXT';
        }else{
            infoAgeLiteral = 'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_AGE_TEXT';
        }

        return infoAgeLiteral;
    };

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