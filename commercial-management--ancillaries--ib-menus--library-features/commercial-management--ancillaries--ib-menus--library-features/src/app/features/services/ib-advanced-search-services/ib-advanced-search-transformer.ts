import angular from 'angular';
import dayjs from 'dayjs';

export class AdvancedSearchTransformer {
    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private IbUiPassengerSelectorConstants : IbUiPassengerSelectorConstantsNamespace.IbUiPassengerSelectorConstants,
        private $rootScope: CommonsRootScope,
        private $window: ng.IWindowService
    ) { }

    initializeAreasModel = (areas: Array<any>, originCode: string, desintyCode: string): MenusModel.AreasModel => {
        let origin: MenusModel.CityModel = null, destiny: MenusModel.CityModel  = null;
        const citiesModel: MenusModel.CitiesModel = {
            listGroups: [],
            listCities: []
        };
        for (const currentArea of areas) {
            citiesModel.listGroups.push(currentArea.description);
            citiesModel.listCities = citiesModel.listCities.concat(currentArea.cities.map(
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                (currentCity: any) =>{
                    const city: MenusModel.CityModel = {
                        code: currentCity.code,
                        description: currentCity.description,
                        country: currentCity.country.code,
                        countryLong: currentCity.country.description,
                        group: currentArea.description,
                        selected: false
                    };
                    if (originCode === city.code) {
                        origin = city;
                    }
                    if (desintyCode === city.code) {
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

    initializeCabinsModel = (cabinsModel: MenusModel.CabinModel[]) => cabinsModel;

    createNewAdvancedSearch = (advancedSearchData: MenusModel.AdvancedSearchModel): string => {
        const bookingUrlParams: any = this.localStorageService.get('bookingUrlParams'),
            newAvailabilityRequestData: any = this.localStorageService.get('availabilityRequestData');
        let i = 0,
            originDestination = {
                origin: '',
                destination: '',
                date: ''
            },
            dateOutbound = [], dateReturn = ['0', '0', '0'], url = null;

        const createUrlParams = () => {
            bookingUrlParams.tripType = advancedSearchData.tripOptionSelected.code;
            bookingUrlParams.preferredCabin = advancedSearchData.cabinSelected.code;
            originDestination.origin = advancedSearchData.cityOrigin.code;
            originDestination.destination = advancedSearchData.cityDestiny.code;
            originDestination.date = dayjs(advancedSearchData.selectedOutbondDate).format('YYYY-MM-DD');
            bookingUrlParams.flexDates = advancedSearchData.flexDates;
            bookingUrlParams.payWithAvios = advancedSearchData.payWithAvios || false;
            bookingUrlParams.payWithPoints = advancedSearchData.payWithPoints || false;
            bookingUrlParams.originDestinations = [];
            bookingUrlParams.originDestinations.push(originDestination);
            bookingUrlParams.largeFamilyType = advancedSearchData.discountFamily && advancedSearchData.discountFamily.value ? advancedSearchData.discountFamily.value : '';
            bookingUrlParams.resident = advancedSearchData.discountResident && advancedSearchData.discountResident.value ? advancedSearchData.discountResident.value : '';

            if (bookingUrlParams.tripType === 2) {
                originDestination = {
                    origin: '',
                    destination: '',
                    date: ''
                };

                originDestination.origin = advancedSearchData.cityDestiny.code;
                originDestination.destination = advancedSearchData.cityOrigin.code;
                originDestination.date = dayjs(advancedSearchData.selectedReturnDate).format('YYYY-MM-DD');
                bookingUrlParams.originDestinations.push(originDestination);
            }

            bookingUrlParams.senior = 0;
            bookingUrlParams.young = 0;
            bookingUrlParams.teenager = 0;

            for (i = 0; i < advancedSearchData.passengersSelected.length; i++) {
                switch (advancedSearchData.passengersSelected[i].passengerType) {
                        case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.SENIOR:
                            bookingUrlParams.senior = advancedSearchData.passengersSelected[i].count || 0;
                            break;
                        case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.ADULT:
                            bookingUrlParams.adult = advancedSearchData.passengersSelected[i].count || 0;
                            break;
                        case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.YOUTH:
                            bookingUrlParams.young = advancedSearchData.passengersSelected[i].count || 0;
                            break;
                        case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.YOUNG:
                            bookingUrlParams.teenager = advancedSearchData.passengersSelected[i].count || 0;
                            break;
                        case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.CHILD:
                            bookingUrlParams.child = advancedSearchData.passengersSelected[i].count || 0;
                            break;
                        case this.IbUiPassengerSelectorConstants.PASSENGER_TYPES.INFANT:
                            bookingUrlParams.infant = advancedSearchData.passengersSelected[i].count || 0;
                            break;
                }
            }
            this.localStorageService.set('bookingUrlParams', bookingUrlParams);
        };

        const createAvailabilityRequest = () => {
            newAvailabilityRequestData.slices = bookingUrlParams.originDestinations;

            newAvailabilityRequestData.passengers = advancedSearchData.passengersSelected.filter((passengers: any) =>
                passengers.count > 0
            );

            newAvailabilityRequestData.preferredCabin = advancedSearchData.cabinSelected.cabinClass;
            this.localStorageService.set('availabilityRequestData', newAvailabilityRequestData);
        };

        createUrlParams();
        createAvailabilityRequest();

        dateOutbound = newAvailabilityRequestData.slices[0].date.split('-');

        if (newAvailabilityRequestData.slices[1]) {
            dateReturn = newAvailabilityRequestData.slices[1].date.split('-');
        }

        const getMarketLocaleURLParams = () => {
            let result = 'market=' + this.$rootScope.appMarket + '&language=' + this.$rootScope.appLang;
            let redemptionRedirecionMap = null;

            if (advancedSearchData.payWithAvios) {
                redemptionRedirecionMap = this.localStorageService.get('newRedemptionMarketsRedirections');

                if (typeof(redemptionRedirecionMap) === 'object' && redemptionRedirecionMap !== null
                    && redemptionRedirecionMap[this.$rootScope.appMarket]
                    && typeof(redemptionRedirecionMap[this.$rootScope.appMarket].marketRedirect) === 'string'
                    && redemptionRedirecionMap[this.$rootScope.appMarket].marketRedirect.length > 0) {
                    result = 'market=' + redemptionRedirecionMap[this.$rootScope.appMarket].marketRedirect + '&fromMarket=' + this.$rootScope.appMarket;

                    if (typeof(redemptionRedirecionMap[this.$rootScope.appMarket].localesRedirect) === 'object'
                        &&redemptionRedirecionMap[this.$rootScope.appMarket].localesRedirect !== null
                        && typeof(redemptionRedirecionMap[this.$rootScope.appMarket].localesRedirect[this.$rootScope.appLang]) === 'string'
                        && redemptionRedirecionMap[this.$rootScope.appMarket].localesRedirect[this.$rootScope.appLang].length > 0) {
                        result += '&language=' + redemptionRedirecionMap[this.$rootScope.appMarket].localesRedirect[this.$rootScope.appLang] || this.$rootScope.appLang + '&fromLanguage=' + this.$rootScope.appLang;
                    }
                }
            }
            return result;
        };
        url = this.$window.location.origin + this.$window.location.pathname + '?' + getMarketLocaleURLParams() + '&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible='
         + bookingUrlParams.flexDates + '&TRIP_TYPE='
         + advancedSearchData.tripOptionSelected.code
         + '&BEGIN_CITY_01=' + advancedSearchData.cityOrigin.code
         + '&END_CITY_01=' + advancedSearchData.cityDestiny.code
         + '&BEGIN_DAY_01=' + dateOutbound[2]
         + '&BEGIN_MONTH_01=' + dateOutbound[0].concat(dateOutbound[1])
         + '&BEGIN_YEAR_01=' + dateOutbound[0]
         + '&END_DAY_01=' + dateReturn[2]
         + '&END_MONTH_01=' + dateReturn[0].concat(dateReturn[1])
         + '&END_YEAR_01=' + dateReturn[0]
         + '&FARE_TYPE=' + advancedSearchData.cabinSelected.code
         + '&quadrigam=IBHMPA&ADT='
         + bookingUrlParams.adult
         + '&CHD=' + bookingUrlParams.child
         + '&INF=' + bookingUrlParams.infant
         + '&BNN=' + bookingUrlParams.teenager
         + '&YTH=' + bookingUrlParams.young
         + '&YCD=' + bookingUrlParams.senior
         + '&residentCode=' + bookingUrlParams.resident
         + '&familianumerosa=' + bookingUrlParams.largeFamilyType;
        if (bookingUrlParams.ibGroup) {
            url += '&IB_GROUP=' + bookingUrlParams.ibGroup;
        }
        if (bookingUrlParams.codeTracking) {
            url += '&codeTracking=' + bookingUrlParams.codeTracking;
        }
        if (bookingUrlParams.backToUrl) {
            url += '&backtourl=' + bookingUrlParams.backToUrl;
        }
        url += '&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES';

        if (advancedSearchData.payWithAvios) {
            url += '&pagoAvios=true';
        }

        if (advancedSearchData.payWithPoints) {
            url += '&pagoPuntos=true';
        }
        return url;
    };
}
AdvancedSearchTransformer.$inject = ['localStorageService', 'IbUiPassengerSelectorConstants', '$rootScope', '$window'];
try {
    const mod = angular.module('ib-header-advanced-search-module');
    mod.service(
        'AdvancedSearchTransformer',
        AdvancedSearchTransformer
    );
} catch (error) {
    const mod = angular.module('ib-header-advanced-search-module', []);
    mod.service(
        'AdvancedSearchTransformer',
        AdvancedSearchTransformer
    );
}