import { Inject, Injectable } from '@angular/core';
import { SeekerAdvancedSearchModel, SeekerAreasModel, SeekerCabinModel, SeekerCitiesModel, SeekerCityModel } from '@src/app/core/models/ib-booking-availability/header-seeker-model';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import dayjs from 'dayjs';
import { AJSRootScope, CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { IbBookingPetsFlowService } from '@shared/services/ib-utils/ib-bookig-pets-flow.service';

@Injectable({
    providedIn: 'root'
})
export class IbBookingHeaderSeekerTransformerService {
    private readonly PASSENGER_TYPE_MAP = {
        [ BookingAppConstants.PASSENGER_TYPES.SENIOR ]: 'YCD',
        [ BookingAppConstants.PASSENGER_TYPES.ADULT ]: 'ADT',
        [ BookingAppConstants.PASSENGER_TYPES.YOUTH ]: 'YTH',
        [ BookingAppConstants.PASSENGER_TYPES.YOUNG ]: 'BNN',
        [ BookingAppConstants.PASSENGER_TYPES.CHILD ]: 'CHD',
        [ BookingAppConstants.PASSENGER_TYPES.INFANT ]: 'INF'
    };

    constructor (
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        @Inject( WINDOW_TOKEN ) private window: Window,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbBookingPetsFlowService: IbBookingPetsFlowService
    ) { }


    initializeAreasModel = ( areas: Array<any>, originCode: string, desintyCode: string ): SeekerAreasModel => {
        let origin: SeekerCityModel = null, destiny: SeekerCityModel = null;
        const citiesModel: SeekerCitiesModel = {
            listGroups: [],
            listCities: []
        };
        for ( const currentArea of areas ) {
            citiesModel.listGroups.push( currentArea.description );
            citiesModel.listCities = citiesModel.listCities.concat( currentArea.cities.map(
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                ( currentCity: any ) => {
                    const city: SeekerCityModel = {
                        code: currentCity.code,
                        description: currentCity.description,
                        country: currentCity.country.code,
                        countryLong: currentCity.country.description,
                        group: currentArea.description,
                        selected: false
                    };
                    if ( originCode === city.code ) {
                        origin = city;
                    }
                    if ( desintyCode === city.code ) {
                        destiny = city;
                    }
                    return city;
                }));
        }

        return {
            cities: citiesModel,
            origin,
            destiny
        };
    };

    initializeCabinsModel = ( cabinsModel: SeekerCabinModel[] ) => cabinsModel;

   
    private setSearchQuadrigam = (paramsMap: Map<string, string>) => {
        const isShuttleFlow = this.CommonsSessionStorageService.get('isRedemptionShuttleFlow');
        if(isShuttleFlow) {
            paramsMap.set('quadrigam', 'PAHMPA');
            return;
        }
        paramsMap.set('quadrigam', 'IBHMPA');
    };
    private setBasicSearchParameters = (paramsMap: Map<string, string>) => {
        paramsMap.set('market', this.rootScope.appMarket);
        paramsMap.set('language', this.rootScope.appLang);
        paramsMap.set('appliesOMB', 'false');
        paramsMap.set('splitEndCity', 'false');
        paramsMap.set('initializedOMB', 'true');
        paramsMap.set('BV_UseBVCookie', 'no');
        paramsMap.set('boton', 'Buscar');
        paramsMap.set('bookingMarket', this.rootScope.appMarket);
    };
    private setSearchDomesticDiscounts = (paramsMap: Map<string, string>, advancedSearchData: SeekerAdvancedSearchModel) => {
        const largeFamily = advancedSearchData.discountFamily?.value ?? '';
        const resident = advancedSearchData.discountResident?.value ?? '';
        resident && paramsMap.set('residentCode', resident);
        largeFamily && paramsMap.set('familianumerosa', largeFamily);
    };
    private setSearchOutBoundCriteria = (paramsMap: Map<string, string>, advancedSearchData: SeekerAdvancedSearchModel) => {
        paramsMap.set('TRIP_TYPE', advancedSearchData.tripOptionSelected.code.toString());
        paramsMap.set('flexible', advancedSearchData.flexDates.toString());
        paramsMap.set('FARE_TYPE', advancedSearchData.cabinSelected.code);
        paramsMap.set('BEGIN_CITY_01', advancedSearchData.cityOrigin.code);
        paramsMap.set('END_CITY_01', advancedSearchData.cityDestiny.code);
        paramsMap.set('BEGIN_DAY_01', dayjs( advancedSearchData.selectedOutbondDate ).format( 'DD' ));
        paramsMap.set('BEGIN_MONTH_01', dayjs( advancedSearchData.selectedOutbondDate ).format( 'YYYYMM' ));
        paramsMap.set('BEGIN_YEAR_01', dayjs( advancedSearchData.selectedOutbondDate ).format( 'YYYY' ));
    };
    private setSearchReturnCriteria = (paramsMap: Map<string, string>, advancedSearchData: SeekerAdvancedSearchModel) => {
        if(advancedSearchData.tripOptionSelected.code === 2) {
            paramsMap.set('BEGIN_CITY_02', advancedSearchData.cityOrigin.code);
            paramsMap.set('END_CITY_02', advancedSearchData.cityDestiny.code);
            paramsMap.set('END_DAY_01', dayjs( advancedSearchData.selectedReturnDate ).format( 'DD' ));
            paramsMap.set('END_MONTH_01', dayjs( advancedSearchData.selectedReturnDate ).format( 'YYYYMM' ));
            paramsMap.set('END_YEAR_01', dayjs( advancedSearchData.selectedReturnDate ).format( 'YYYY' ));
        }
    };

    private setSearchPassengers = (paramsMap: Map<string, string>, advancedSearchData: SeekerAdvancedSearchModel) => {
        const passengers = advancedSearchData.passengersSelected;
        passengers.forEach(passenger => {
            const passengerTypeCode = this.PASSENGER_TYPE_MAP[passenger.passengerType];
            if(passengerTypeCode) {
                paramsMap.set(passengerTypeCode, (passenger.count ?? 0).toString());
            }
        });
    };

    private setSearhRedemptionsParams = (paramsMap: Map<string, string>, advancedSearchData: SeekerAdvancedSearchModel) => {
        if(advancedSearchData.payWithAvios) {
            paramsMap.set('pagoAvios', 'true');
        }
        if(advancedSearchData.payWithPoints) {
            paramsMap.set('pagoPuntos', 'true');
        }
    };
    private setSearchCugsParams = (paramsMap: Map<string, string>) => {
        const bookingUrlParams: any = this.CommonsSessionStorageService.get( 'bookingUrlParams' );
        if ( bookingUrlParams.ibGroup ) {
            paramsMap.set('IB_GROUP', bookingUrlParams.ibGroup);
        }
        if ( bookingUrlParams.codeTracking ) {
            paramsMap.set('codeTracking', bookingUrlParams.codeTracking);
        }
    };

    private setSeachPetsParams = (paramsMap: Map<string, string>, advancedSearchData:SeekerAdvancedSearchModel ) => {
        if (  advancedSearchData.isPetFlight ) {
            paramsMap.set( BookingAppConstants.BOOKING_PARAMS_NAMES.PETS_FLIGHT[0], 'true' );
        }
    };

    private setBackToURL = (paramsMap: Map<string, string>) => {
        const bookingUrlParams: any = this.CommonsSessionStorageService.get( 'bookingUrlParams' );
        if ( bookingUrlParams?.backtourl ) {
            paramsMap.set('backtourl', bookingUrlParams.backtourl);
        }
    };



    createNewAdvancedSearch = (advancedSearchData: SeekerAdvancedSearchModel) => {
        const paramsMap = new Map<string, string>();
        this.setBasicSearchParameters(paramsMap);
        this.setSearchQuadrigam(paramsMap);
        this.setSearchDomesticDiscounts(paramsMap, advancedSearchData);
        this.setSearchOutBoundCriteria(paramsMap, advancedSearchData);
        this.setSearchReturnCriteria(paramsMap, advancedSearchData);
        this.setSearchPassengers(paramsMap, advancedSearchData);
        this.setSearhRedemptionsParams(paramsMap, advancedSearchData);
        this.setSearchCugsParams(paramsMap);
        this.setSeachPetsParams(paramsMap, advancedSearchData);
        this.setBackToURL(paramsMap);
        this.CommonsSessionStorageService.remove('bookingUrlParams');
        this.CommonsSessionStorageService.remove('availabilityRequestData');
        let url = this.window.location.origin + this.window.location.pathname + '?' + new URLSearchParams(Object.fromEntries(paramsMap)).toString();
        return url;
    };

    private isCityInRegion = (cityCode, region) => {
        return region.cities.find((city) => city.code === cityCode);
    };
    
    private addNights = (date, nights) => {
        if(typeof nights !== 'number') nights = 0;
        var result = new Date(date);
        result.setDate(result.getDate() + nights);
        return result;
    };
    
    private getMADInfo = () => {
        const destinationList : any = this.CommonsSessionStorageService.get('destinationAreasCitiesList');
        return destinationList.flatMap((region) => { 
            return region.cities.find((city)=>{
                if(city.code === ('MAD')) return city;
            });
        }).find((element) => element !== undefined);
    };

    private generateCookie = (data, passengersCount, dateFormatOptions) => {
        let checkedIyV = data.tripOptionSelected.code === 2;
        let stopOverIda = data.stopOptionSelected.code === 1;
        let nightsCookie = data.nightOptionSelected.code;
        let date1 = data.selectedOutbondDate.toLocaleDateString('es-ES', dateFormatOptions);
        let date3 = data.selectedReturnDate?.toLocaleDateString('es-ES', dateFormatOptions);
        let passengers = Object.values(passengersCount).reduce((acum:any, val:any) => acum + val);
        return `${data.cityOrigin.code}|${data.cityDestiny.code}|${checkedIyV}|${stopOverIda}|${nightsCookie}|${date1}|${date3}|${passengers}|${passengersCount.ADT}|${passengersCount.CHD}|${passengersCount.INF}|${this.rootScope.appLang.toLowerCase()}|`;
    };
    
    private getAreaForCity = (cityCode) =>{
        const destinationList : any = this.CommonsSessionStorageService.get('destinationAreasCitiesList');
        return destinationList.flatMap((region) => {
            if(this.isCityInRegion(cityCode, region)){
                return region.code;
            }
        }).find((element) => element !== undefined);
    };

    private calculateNightsForOriginAmerica = (advancedSearchData, nights) => {
        const area = this.getAreaForCity(advancedSearchData.stopOptionSelected.code === 1 ? advancedSearchData.cityOrigin.code : advancedSearchData.cityDestiny.code);
        if( area === 'ES_COMM_AREA_AMERICA' ) nights++;
        return nights;
    };
    
    private getPassengerCount = (advancedSearchData) => {
        let ADT = 0, CHD = 0, INF = 0;
        advancedSearchData.passengersSelected.forEach( element => {
            if( element.count !== 0 ) {
                switch (element.passengerType) {
                        case BookingAppConstants.PASSENGER_TYPES.CHILD:
                            CHD += element.count;
                            break;
                        case BookingAppConstants.PASSENGER_TYPES.INFANT:
                            INF += element.count;
                            break;
                        default:
                            ADT += element.count;
                            
                }
            }
        });
        return {
            ADT, 
            CHD,
            INF
        };
    };
    
    private calculateDates = (advancedSearchData, returnSelected, nights) => {
        const date1 = advancedSearchData.selectedOutbondDate; // The date of the first journey is the same in all cases
        let date2; let date3;
        if (!returnSelected || advancedSearchData.stopOptionSelected.code === 1) { // Case: On outbound journey
            date2 = this.addNights(date1, nights);
            date3 = advancedSearchData.selectedReturnDate;
        } else if(returnSelected){ // Case: On return journey
            date3 = advancedSearchData.selectedReturnDate;
            date2 = this.addNights(date3, (-1*nights));
        }
        return [date1, date2, date3];
    };
    
    private generateStops = (returnSelected, advancedSearchData, cityOrigin1) => {
        let cityOrigin2; let cityOrigin3;
        let madStop = this.getMADInfo();
        if (!returnSelected || advancedSearchData.stopOptionSelected.code === 1) { // Case: On outbound journey
            cityOrigin2 = madStop; // City second journey
            cityOrigin3 = advancedSearchData.cityDestiny; // City third journey
        } else if(returnSelected){ // Case: On return journey
            cityOrigin2 = advancedSearchData.cityDestiny; // City second journey
            cityOrigin3 = madStop; // City third journey
        }
        
        const cityOrigin = [cityOrigin1, cityOrigin2, cityOrigin3];
        const cityDestiny = [cityOrigin2, cityOrigin3, cityOrigin1];
        return {
            cityOrigin,
            cityDestiny
        };
    };
    
    createNewAdvancedSearchHMad = ( advancedSearchData: SeekerAdvancedSearchModel ): any => {
        const returnSelected = advancedSearchData.tripOptionSelected.code === 2; // code for return
        const cityOrigin1 = advancedSearchData.cityOrigin; // City of the first journey the same for all cases
        const dateFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' } as Intl.DateTimeFormatOptions;
        let numjourneys = 0;
        let parameters = `?bookingMarket=${this.rootScope.appMarket}&TRIP_TYPE=3`;
        let nights = advancedSearchData.nightOptionSelected.code;
        nights = this.calculateNightsForOriginAmerica(advancedSearchData, nights);
        const dateInit = this.calculateDates(advancedSearchData, returnSelected, nights);
        const stops = this.generateStops( returnSelected, advancedSearchData, cityOrigin1 );
        
        for (let num = 0; num <= 2; num += 1) {
            let numsum = num + 1;
            numjourneys += 1;
            let BEGIN_CITY = stops.cityOrigin[num].code;
            let END_CITY = stops.cityDestiny[num].code;
            let BEGIN_DAY = ('0'+new Date(dateInit[num]).getDate().toString()).slice(-2);
            let BEGIN_MONTH = ('0'+(new Date(dateInit[num]).getMonth() + 1).toString()).slice(-2);
            let BEGIN_YEAR = new Date(dateInit[num]).getFullYear().toString();
            parameters += `&text-from${numsum}-visible=${stops.cityOrigin[num].description + '%20(' + stops.cityOrigin[num].code + ')'
            }&BEGIN_CITY_0${[num + 1]}=${BEGIN_CITY
            }&text-to${numsum}-visible=${stops.cityDestiny[num].description + '%20(' + stops.cityDestiny[num].code + ')'
            }&END_CITY_0${[num + 1]}=${END_CITY
            }&text-date-from${numsum}=${new Date(dateInit[num]).toLocaleDateString('es-ES', dateFormatOptions)
            }&BEGIN_DAY_0${[num + 1]}=${BEGIN_DAY
            }&BEGIN_MONTH_0${[num + 1]}=${BEGIN_YEAR}${BEGIN_MONTH
            }&BEGIN_YEAR${numsum}_01=${BEGIN_YEAR
            }&BEGIN_HOUR_0${[num + 1]}=0000`;
            if (num === 1 && !returnSelected) { break; }
        }

        const passengersCount = this.getPassengerCount(advancedSearchData);
        parameters += `&numTrayectos=${numjourneys
        }&FARE_TYPE=R`
            + `&ADT=${passengersCount.ADT
            }&CHD=${passengersCount.CHD
            }&INF=${passengersCount.INF
            }&quadrigam=HMADVS&backtourl=/${this.rootScope.appMarket.toLowerCase()}/${this.rootScope.appLang.toLowerCase()}/stopover-in-madrid/#!/availability`;
        const host = this.window.location.origin;

        const url = host + this.window.location.pathname + parameters;

        return {
            url,
            cookie: this.generateCookie(advancedSearchData, passengersCount, dateFormatOptions)
        };
    };
}



downgradeToAJSService('IbBookingHeaderSeekerTransformerService', IbBookingHeaderSeekerTransformerService, 'ib-header-seeker-module', ['ib-commons-modal-service-module', 'ib-commons-http-service-module', 'ib-booking-city-selector-module']);
