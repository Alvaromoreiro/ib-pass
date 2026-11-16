@Service('ib-MmB-services-module', [
    'localStorageService',
    'MmBAppConstants',
    'CommonsNewHttpUtilsErrorService',
    'CommonsGenericProxy'
], [])
export class StatesListService {

    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy: CommonsGenericProxy
    ) {}

    getStatesList = (selectedCountry: any) => {
        return new Promise((resolve, reject) => {
            let endpoint = null;
            endpoint = this.MmBAppConstants.statesListServiceURI;
            endpoint = endpoint + (selectedCountry || this.MmBAppConstants.market) + '/states';
    
            const getStatesListSuccess = (statesList: any) => {
                if (statesList) {
                    this.localStorageService.set('statesList', statesList.data);
                    resolve(statesList.data);
                }
            };
    
            const getStatesListError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
    
            };
            if (this.localStorageService.get('statesList') && this.localStorageService.get('selectedAvios')) {
                resolve(this.localStorageService.get('statesList'));
            } else {
                this.CommonsGenericProxy.getGeneric(endpoint).then(getStatesListSuccess, getStatesListError);
            }
        });
    };
}