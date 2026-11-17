import { BaseServiceConfigJson } from 'ib-web-commons/proxies';

@Service('ib-http-services-module',
    [
        '$q',
        '$filter',
        'HttpServicesConstants',
        'localStorageService',
        'CommonsGenericProxy',
        'CommonsHttpUtilsErrorService',
        '$timeout',
        'CommonsCookiesService'
    ])
export class TravelInfoService {
    public counterAttemps: number;
    
    constructor (
        private $q: ng.IQService,
        private $filter: angular.IFilterService,
        private HttpServicesConstants: HttpServicesConstantsNamespace.HttpServicesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
        private $timeout: ng.ITimeoutService,
        private CommonsCookiesService: any
    ) {
        this.counterAttemps = 0;
    }

    private getConfig (): BaseServiceConfigJson {
        const salesforceToken = this.CommonsCookiesService.get('IBERIACOM_SSO_ACCESS_SALESFORCE') as string | null | '';
        return {
            headers: {
                'x-salesforce-token': salesforceToken
            },
            withCredentials: true
        };
    }

    /**
     * Send to service travel info the documents saved for user in form of APIS
     * @param {Object} passenger Passenger information with documents
     */
    putTravelDocument = (document: any, deferredRecall?: any): angular.IPromise<unknown> => {
        let defer = deferredRecall || this.$q.defer();
        const checkinId = this.localStorageService.get('flowId');
        const baseEndpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.travelDocumentServiceURI;
        const endpoint = `${baseEndpoint}/${encodeURIComponent(document.id)}`;

        const putTravelDocumentError = (error): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, putTravelDocumentCallback, defer);
        };
        const putTravelDocumentCallback = () => {
            this.counterAttemps++;
            this.putTravelDocument(document, defer);
        };
        const putTravelDocumentSuccess = (data) => {
            defer.resolve(data);
            defer = null;
        };
        if (checkinId !== null) {
            this.CommonsGenericProxy.putGeneric(endpoint, document, this.getConfig())
                .then(putTravelDocumentSuccess, putTravelDocumentError).catch(putTravelDocumentError);
        } else {
            this.$timeout(() => {
                defer.reject({ errorCode: 'IB_00002', message: this.$filter('translate')('SESSION_EXPIRED'), internalErrorCode: 'IB_00002' });
                defer = null;
            });
        }
        return defer.promise;
    };

    /**
     * Send to service travel document saved for user in form of APIS
     * @param {Object} document document
     */
    postTravelDocument = (document: any, deferredRecall?: any): angular.IPromise<unknown> => {
        let defer = deferredRecall || this.$q.defer();
        const checkinId = this.localStorageService.get('flowId');
        const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.travelDocumentServiceURI;

        const postTravelDocumentError = (error): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, postTravelDocumentCallback, defer);
        };
        const postTravelDocumentCallback = () => {
            this.counterAttemps++;
            this.postTravelDocument(document, defer);
        };
        const postTravelDocumentSuccess = (data) => {
            defer.resolve(data);
            defer = null;
        };
        if (checkinId !== null) {
            this.CommonsGenericProxy.postGeneric(endpoint, document, this.getConfig())
                .then(postTravelDocumentSuccess, postTravelDocumentError).catch(postTravelDocumentError);
        } else {
            this.$timeout(() => {
                defer.reject({ errorCode: 'IB_00002', message: this.$filter('translate')('SESSION_EXPIRED'), internalErrorCode: 'IB_00002' });
                defer = null;
            });
        }
        return defer.promise;
    };

    /**
     * Get the documents saved for the passenger
     */
    getTravelInfo = (deferredRecall?: any): angular.IPromise<unknown> => {
        let defer = deferredRecall || this.$q.defer();
        const checkinId = this.localStorageService.get('flowId');
        const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.travelDocumentServiceURI;

        const getTravelInfoError = (error): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, getTravelInfoCallback, defer);
        };
        const getTravelInfoCallback = () => {
            this.counterAttemps++;
            this.getTravelInfo(defer);
        };
        const getTravelInfoSuccess = (data) => {
            defer.resolve(data.data);
            defer = null;
        };
        if (checkinId !== null) {
            this.CommonsGenericProxy.getGeneric(endpoint, null, null, this.getConfig())
                .then(getTravelInfoSuccess, getTravelInfoError).catch(getTravelInfoError);
        } else {
            this.$timeout(() => {
                defer.reject({ errorCode: 'IB_00002', message: this.$filter('translate')('SESSION_EXPIRED'), internalErrorCode: 'IB_00002' });
                defer = null;
            });
        }
        return defer.promise;
    };

    /**
     * Get the documents saved for the passenger
     */
    deleteTravelInfo = (deferredRecall?: any): angular.IPromise<unknown> => {
        let defer = deferredRecall || this.$q.defer();
        const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.travelInfoServiceURI;

        const deleteTravelInfoError = (error): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, deleteTravelInfoCallback, defer);
        };
        const deleteTravelInfoCallback = () => {
            this.counterAttemps++;
            this.deleteTravelInfo(defer);
        };
        const deleteTravelInfoSuccess = (data) => {
            defer.resolve(data.data);
            defer = null;
        };
        this.CommonsGenericProxy.deleteGeneric(endpoint)
            .then(deleteTravelInfoSuccess, deleteTravelInfoError).catch(deleteTravelInfoError);
        return defer.promise;
    };
}