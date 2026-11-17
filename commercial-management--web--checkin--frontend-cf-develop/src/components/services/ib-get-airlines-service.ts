@Service('ib-checkin-services-module',
    ['$q', 'CommonsGenericProxy', 'CommonsHttpUtilsErrorService', 'CheckinAppConstants', 'localStorageService'])

class GetAirlinesService {

    private counterAttemps = 0;

    constructor (
        private $q: ng.IQService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
        private CheckinAppConstants: CheckinAppConstants,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) { }

    getAirlines = (): angular.IPromise<any> => {
        let defer = this.$q.defer();
        const airlines = this.localStorageService.get('airlinesList');

        const getAirlinesSuccess = (airlinesData): void => {
            this.localStorageService.set('airlinesList', airlinesData.data);
            defer.resolve(airlinesData.data);
            defer = null;
            this.counterAttemps = 0;
        };
        const getAirlinesCallback = (): void => {
            this.counterAttemps++;
            this.getAirlines();
        };
        const getAirlinesError = (error): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, getAirlinesCallback, defer);
        };

        if (airlines === null) {
            this.CommonsGenericProxy.getGeneric(this.CheckinAppConstants.airlinesJsonRoute)
                .then(getAirlinesSuccess, getAirlinesError).catch(getAirlinesError);
        } else {
            defer.resolve(airlines);
        }

        return defer.promise;
    };
}