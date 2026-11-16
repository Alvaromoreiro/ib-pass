@Service('ib-MmB-services-module',
    ['CommonsGenericProxy', 'CommonsNewHttpUtilsErrorService', 'MmBAppConstants', 'localStorageService'])

export class CallAvailabilityUnifiedService {

    constructor(
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private MmBAppConstants: any,
        private localStorageService: angular.local.storage.ILocalStorageService) { }

    getAvailabilityUnified = (request): angular.IPromise<any> => {
        return new Promise((resolve, reject) => {
            const getAvailabilityUnifiedSuccess = (data): void => {
                const vcAvailability = { responseId: data.data.responseId, contextMetadata: data.data.contextMetadata, originDestinations: data.data.originDestinations };
                this.localStorageService.set('availabilityUnified', data.data);
                this.localStorageService.set('vcAvailability', vcAvailability);
                resolve(data.data);
            };

            const getAvailabilityUnifiedError = (error): void => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };

            const endpoint = this.MmBAppConstants.AvailabilityUnifiedURI;
            this.CommonsGenericProxy.postGeneric(endpoint, request).then(getAvailabilityUnifiedSuccess, getAvailabilityUnifiedError);
        });
    };
}
