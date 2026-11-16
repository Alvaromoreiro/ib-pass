import angular from 'angular';
export class ibAdvancedSearchServiceModel {
    constructor (public localStorageService: angular.local.storage.ILocalStorageService) {

    }
    initializeModel = (residentDiscountSelection?: LocalDiscountConfig,  familyDiscountSelection?:LocalDiscountConfig) : MenusModel.AdvancedSearchModel => {
        const model: MenusModel.AdvancedSearchModel ={
            showDatepicker: false,
            tripOptions: [{ description: 'HEADER_ADVANCED_SEARCH_ONE_WAY', code: 1 }, { description: 'HEADER_ADVANCED_SEARCH_ROUND_TRIP', code: 2 }, { description: 'HEADER_ADVANCED_SEARCH_MULTICITY', code: 3 }],
            passengersSelected: [],
            payWithAvios: false,
            payWithPoints: false,
            aviosChecked: false,
            resetToggleCounter: false,
            tripOptionSelected: null,
            specialPassengerTypeHasError: false,
            specialTypeAvailableLastSearch: false,
            cityOrigin: null,
            cities: null,
            cityDestiny: null,
            cabinSelected: null,
            passengers: null,
            passengersConditions:  { passengersCount: 0, maxChilds: 0, totalAdults: 0, passengersWithInfants: 0 },
            selectedOutbondDate: new Date(),
            selectedReturnDate: new Date(),
            flexDates: true,
            discountResident: null,
            discountFamily: null,
            desResiConfig: null,
            desFamilyConfig: null,
            typeCabins:[]
        };
        if (residentDiscountSelection && familyDiscountSelection) {
            this.updateDiscountsData(model, residentDiscountSelection, familyDiscountSelection);
        }
        return model;
    };
    updateDiscountsData = (model: MenusModel.AdvancedSearchModel, residentConfig :LocalDiscountConfig, largeFamily: LocalDiscountConfig) => {
        model.desFamilyConfig = largeFamily;
        model.desResiConfig = residentConfig;
        const urlParameters: any = this.localStorageService.get('bookingUrlParams');

        model.discountResident = urlParameters && urlParameters.resident ? model.desResiConfig.items.find((discountResindent) => {
            return String(urlParameters.resident) === String(discountResindent.value);
        }) : model.desResiConfig.items[0];
        model.discountFamily = urlParameters && urlParameters.largeFamilyType ? model.desFamilyConfig.items.find((discountFamily) => {
            return String(urlParameters.largeFamilyType) === String(discountFamily.value);
        }) :model.desFamilyConfig.items[0];
        return model;
    };
}
ibAdvancedSearchServiceModel.$inject = ['localStorageService'];
try {
    const mod = angular.module('ib-header-advanced-search-module');
    mod.service(
        'ibAdvancedSearchServiceModel',
        ibAdvancedSearchServiceModel
    );
} catch (error) {
    const mod = angular.module('ib-header-advanced-search-module', []);
    mod.service(
        'ibAdvancedSearchServiceModel',
        ibAdvancedSearchServiceModel
    );
}
