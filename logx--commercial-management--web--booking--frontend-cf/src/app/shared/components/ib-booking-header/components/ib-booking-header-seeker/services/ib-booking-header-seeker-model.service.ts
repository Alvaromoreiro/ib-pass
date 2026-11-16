import { Injectable } from '@angular/core';
import { LocalDiscountConfigModel, SeekerAdvancedSearchModel } from '@src/app/core/models/ib-booking-availability/header-seeker-model';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';

@Injectable({
    providedIn: 'root'
})
export class IbBookingHeaderSeekerModelService {
    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) { }

    initializeModel = ( residentDiscountSelection?: LocalDiscountConfigModel, familyDiscountSelection?: LocalDiscountConfigModel ): SeekerAdvancedSearchModel => {
        const model: SeekerAdvancedSearchModel ={
            showDatepicker: false,
            tripOptions: [ { description: 'HEADER_ADVANCED_SEARCH_ONE_WAY', code: 1 }, { description: 'HEADER_ADVANCED_SEARCH_ROUND_TRIP', code: 2 }, { description: 'HEADER_ADVANCED_SEARCH_MULTICITY', code: 3 } ],
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
            originAllowedCities: null,
            destinationAllowedCities: null,
            cityDestiny: null,
            cabinSelected: null,
            passengers: null,
            passengersConditions: { passengersCount: 0, maxChilds: 0, totalAdults: 0, passengersWithInfants: 0 },
            selectedOutbondDate: new Date(),
            selectedReturnDate: new Date(),
            flexDates: true,
            discountResident: null,
            discountFamily: null,
            desResiConfig: null,
            desFamilyConfig: null,
            typeCabins:[],
            stops: [
                {description: 'STOP_OVER_ON_GO', code: 1},
                {description: 'STOP_OVER_ON_RETURN', code: 2}
            ],
            stopOptionSelected: {description: 'STOP_OVER_STOPS'}, 
            nights: [
                {description: '1', code: 1, allowed: true},
                {description: '2', code: 2, allowed: true},
                {description: '3', code: 3, allowed: true},
                {description: '4', code: 4, allowed: true},
                {description: '5', code: 5, allowed: true},
                {description: '6', code: 6, allowed: true},
                {description: '7', code: 7, allowed: true},
                {description: '8', code: 8, allowed: true},
                {description: '9', code: 9, allowed: true}
            ],
            nightOptionSelected: {description:'STOP_OVER_NIGHTS'}
        };
        if ( residentDiscountSelection && familyDiscountSelection ) {
            this.updateDiscountsData( model, residentDiscountSelection, familyDiscountSelection );
        }
        return model;
    };
    updateDiscountsData = ( model: SeekerAdvancedSearchModel, residentConfig: LocalDiscountConfigModel, largeFamily: LocalDiscountConfigModel ): SeekerAdvancedSearchModel => {
        model.desFamilyConfig = largeFamily;
        model.desResiConfig = residentConfig;
        const urlParameters: any = this.CommonsSessionStorageService.get( 'bookingUrlParams' );

        model.discountResident = urlParameters && urlParameters.resident ? model.desResiConfig.items.find( ( discountResindent ) => {
            return String( urlParameters.resident ) === String( discountResindent.value );
        } ) : model.desResiConfig.items[ 0 ];
        model.discountFamily = urlParameters && urlParameters.largeFamilyType ? model.desFamilyConfig.items.find( ( discountFamily ) => {
            return String( urlParameters.largeFamilyType ) === String( discountFamily.value );
        } ) : model.desFamilyConfig.items[ 0 ];
        return model;
    };
}

downgradeToAJSService('IbBookingHeaderSeekerModelService', IbBookingHeaderSeekerModelService, 'ib-header-seeker-module', ['ib-commons-modal-service-module', 'ib-commons-http-service-module', 'ib-booking-city-selector-module']);
