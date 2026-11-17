@Service('ib-http-services-module', ['$q', 'HttpServicesConstants', 'localStorageService', '$filter', '$timeout', 'CommonsGenericProxy', 'CommonsHttpUtilsErrorService'])
export class CallBoardingCardsService {
    attemp: number;
    urlSuffix: string;
    updateInfo: object;

    constructor (
        private $q: ng.IQService, 
        private HttpServicesConstants, 
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $filter: ng.IFilterFunction, 
        private $timeout: ng.ITimeoutService, 
        private CommonsGenericProxy: CommonsGenericProxy, 
        private CommonsHttpUtilsErrorService
    ) {
        this.attemp = 0;
        this.urlSuffix = '/boarding-document/print';
    }

    updateBoardingCards = (updateInfo: object): angular.IPromise<unknown> => {
        const checkinId: string = this.localStorageService.get('flowId');
        this.updateInfo = updateInfo;
        const defer = this.$q.defer();
        const updateBoardingCardsSuccess = (data: any) => {
            defer.resolve(data.data);
        };
        const updateBoardingCardsError = (error: unknown) => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.attemp, this.updateBoardingCardsCallback, defer);
        };

        if (checkinId !== null) {
            const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.boardingCardsURI;
            this.CommonsGenericProxy.postGeneric(this.buildUrl(endpoint, checkinId), updateInfo).then(updateBoardingCardsSuccess).catch(updateBoardingCardsError);
        } else {
            this.processSessionExpiredError(defer);
        }

        return defer.promise;
    };

    updateBoardingCardsCallback = () => {
        this.attemp++;
        this.updateBoardingCards(this.updateInfo);
    };

    getBoardingCards = (): angular.IPromise<any> => {
        const checkinId = this.localStorageService.get('flowId');
        const defer = this.$q.defer();
        const boardingCardsSuccess = (data: any) => {
            defer.resolve(data.data);
        };
        const getBoardingCardsError = (error) => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.attemp, this.getBoardingCardsErrorCallback, defer);
        };

        if (checkinId !== null) {
            let endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.getBoardingDocument;
            endpoint = endpoint + checkinId + '/boarding-document';
            this.CommonsGenericProxy.getGeneric(endpoint).then(boardingCardsSuccess).catch(getBoardingCardsError);
        } else {
            this.processSessionExpiredError(defer);
        }
        return defer.promise;
    };

    getBoardingCardsErrorCallback = () => {
        this.attemp++;
        this.getBoardingCards();
    };

    processSessionExpiredError = (defer: angular.IDeferred<unknown>) => {
        const apisFormateError: TpmServiceModel.IApisInfoError = {
            errorCode: 'IB_00002',
            message: this.$filter('translate')('SESSION_EXPIRED'),
            internalErrorCode: 'IB_00002'
        };
        this.$timeout(() => {
            defer.reject(apisFormateError);
            defer = null;
        });
    };

    private buildUrl = (uri: string, checkinId: string): string => {
        return uri + checkinId + this.urlSuffix;
    };
}