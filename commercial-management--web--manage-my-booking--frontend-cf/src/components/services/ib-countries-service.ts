@Service('ib-MmB-services-module', [
    'localStorageService',
    'CommonsGenericProxy',
    'MmBAppConstants',
    'CommonsNewHttpUtilsErrorService'
], [])
export class CountriesListService {

    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    getCountriesList = () => {
        return new Promise((resolve, reject) => {
            const getCountriesListSuccess = (countries: any) => {
                if (countries) {
                    this.localStorageService.set('countriesList', countries.data);
                    resolve(countries.data);
                }
            };
    
            const getCountriesListError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.CommonsGenericProxy.getGeneric(this.MmBAppConstants.countriesListServiceApisURI).then(getCountriesListSuccess, getCountriesListError);
        });
    };
}