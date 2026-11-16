import angular from 'angular';

@Service('ib-MmB-services-module', [
    'localStorageService',
    'MmBModalService',
    'MmBAppConstants',
    'CommonsNewHttpUtilsErrorService',
    'CommonsGenericProxy'
], [])
export class VoluntaryChangesService {
    requestAvailability: any = {};
    updateAvailability: any;

    constructor(
        private localStorageService: angular.local.storage.ILocalStorageService,
        private MmBModalService: any,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy: CommonsGenericProxy
    ) { }

    getAvailability = (data: any, update: any) => {
        return new Promise((resolve, reject) => {
            this.requestAvailability = data || this.requestAvailability;
            this.updateAvailability = update;

            if (!update) {
                this.MmBModalService.showWaitingModal();
            }

            const getAvailabilitySuccess = (data: any) => {
                const dataStorage = angular.copy(data.data);

                if (data.data && data.data.fareFamilyConditions.length !== 0) {
                    if (dataStorage.offers && dataStorage.offers.length > 1000) {
                        dataStorage.offers = dataStorage.offers.slice(0, 1000);
                    }
                    const vcAvailability = { responseId: dataStorage.responseId, contextMetadata: dataStorage.contextMetadata, originDestinations: dataStorage.originDestinations };
                    this.localStorageService.set('vcAvailability', vcAvailability);
                    resolve(data.data);
                    //this.deferred = null;
                } else {
                    getAvailabilityError({
                        data: {
                            errors: [{
                                code: 'noFares'
                            }]
                        }
                    });
                }
            };

            const getAvailabilityError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);


                this.MmBModalService.finishWaiting();
            };

            this.CommonsGenericProxy.postGeneric(this.MmBAppConstants.reshopAvailabilityURI, this.requestAvailability).then(getAvailabilitySuccess, getAvailabilityError);
        });
    };
}
