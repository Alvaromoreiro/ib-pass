import { AdvancedSearchTransformer } from '../../services/ib-advanced-search-services/ib-advanced-search-transformer';
import angular from 'angular';

export class AdvancedHeaderSearchService {
    constructor (
        private CabinTypesService: CabinTypesService,
        private getDestinationsService: GetDestinationsService,
        private AdvancedSearchTransformer: AdvancedSearchTransformer,
        private getSpecialPassengerOriginDestinationListService: getSpecialPassengerOriginDestinationListService,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) { }

    getCabinTypes = (): Promise<MenusModel.CabinModel[]> => {
        return new Promise ((resolve, reject) => {
            this.CabinTypesService.getCabinTypes().then((cabinsData: any) => {
                resolve(this.AdvancedSearchTransformer.initializeCabinsModel(cabinsData));
            }, reject);
        });
    };

    getDestinationAreas = (originCode: string, destinyCode: string): Promise<MenusModel.AreasModel> => {
        return new Promise ((resolve, reject) => {
            this.getDestinationsService.getDestinationAreasCitiesList().then((destinations: any) => {
                resolve(
                    this.AdvancedSearchTransformer.initializeAreasModel(destinations, originCode, destinyCode)
                );
            }, reject);
        });
    };

    createRequestNewAdvancedSearch = (advancedSearchData: any) =>
        this.AdvancedSearchTransformer.createNewAdvancedSearch(advancedSearchData);


    getSpecialPassengerOriginDestination = (market: string) => {
        const promiseOne = this.getSpecialPassengerOriginDestinationListService.getSpecialPassengerOriginDestinationList('SENIOR'),
            promiseTwo = this.getSpecialPassengerOriginDestinationListService.getSpecialPassengerOriginDestinationList('YOUNG'),
            promiseThree = this.getSpecialPassengerOriginDestinationListService.getSpecialPassengerOriginDestinationList('TEENAGER');
        let localSpecialPassengerList: any = {};
        const specialPassengersByMarketList = {
            SENIOR: [],
            YOUNG: [],
            TEENAGER: [],
            specialPassengerMarket: market
        };
        return new Promise ((resolve, reject) => {
            localSpecialPassengerList  = this.localStorageService.get('specialPassengersByMarketList');
            if (localSpecialPassengerList && localSpecialPassengerList.specialPassengerMarket && localSpecialPassengerList.specialPassengerMarket === market) {
                resolve(localSpecialPassengerList);
            } else {
                Promise.all([promiseOne, promiseTwo, promiseThree]).then((specialPassengerListResponse: any) => {
                    if (specialPassengerListResponse && specialPassengerListResponse.length > 0) {
                        specialPassengersByMarketList.SENIOR = specialPassengerListResponse[0];
                        specialPassengersByMarketList.YOUNG = specialPassengerListResponse[1];
                        specialPassengersByMarketList.TEENAGER = specialPassengerListResponse[2];
                        specialPassengersByMarketList.specialPassengerMarket = market;
                        this.localStorageService.set('specialPassengersByMarketList', specialPassengersByMarketList);
                        resolve(specialPassengersByMarketList);
                    }
                }, (error: any) => {
                    reject(error);
                });
            }
        });

    };
}
AdvancedHeaderSearchService.$inject = [
    'CabinTypesService',
    'GetDestinationsService',
    'AdvancedSearchTransformer',
    'getSpecialPassengerOriginDestinationListService',
    'localStorageService'
];
try {
    const mod = angular.module('ib-header-advanced-search-module');
    mod.service(
        'AdvancedHeaderSearchService',
        AdvancedHeaderSearchService
    );
} catch (error) {
    const mod = angular.module('ib-header-advanced-search-module', []);
    mod.service(
        'AdvancedHeaderSearchService',
        AdvancedHeaderSearchService
    );
}