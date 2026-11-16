@Service('ib-MmB-services-module', [
    'CommonsGenericProxy',
    'MmBAppConstants',
    'CommonsNewHttpUtilsErrorService',
    'localStorageService'
], [])
export class ResetMmbService {
    resetMmbURI: any;

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) {}

    deleteVolatileOffers = (): any => {
        const flowId = this.localStorageService.get('flowId');
        const replacedURI = this.MmBAppConstants.resetMmbURI.replace('{flowId}', flowId);
        return new Promise((resolve, reject) => {
            const getDeleteVolatileOffersSuccess = (data: any) => {
                resolve(data.data);
            };

            const getDeleteVolatileOffersError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };

            this.CommonsGenericProxy.deleteGeneric(replacedURI).then(getDeleteVolatileOffersSuccess, getDeleteVolatileOffersError);
        });
    }
}
