import {CommonsUtilService} from '../../utils/ib-commons-utils-service';
import {DatalayerUtilsService} from '../../ib-datalayer/services/ib-datalayer-utils-service';
import {CommonsHttpUtilService} from '../../utils/http-utils-services/ib-commons-http-utils-service';
import {CommonsHttpUtilsErrorService} from '../../utils/http-utils-services/ib-commons-http-utils-error-service';
import {CommonsGenericProxy} from '../../proxies/ib-commons-generic-proxy';
import {CommonsHttpServicesConstantsType} from '../../constants/ib-commons-http-service-constants';
import { CommonsConstantsType } from '../../constants/ib-commons-constants';
import { isUndefined } from 'lodash';


@Service('ib-commons-http-service-module',
    ['$q', 'CommonsHttpServicesConstants', 'localStorageService', 'CommonsUtilService',
        '$timeout', '$filter', 'DatalayerUtilsService', 'CommonsGenericProxy', 'CommonsHttpUtilService', 'CommonsHttpUtilsErrorService', 'CommonsConstants'])
export class CommonsAncillariesService {
    public counterAttemps: number;
    public reCallService: boolean;
    public headerConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'accept': '*/*'
        }
    };

    constructor (private $q: ng.IQService,
        private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
        private localStorageService: ng.local.storage.ILocalStorageService,
        private CommonsUtilService: CommonsUtilService,
        private $timeout: ng.ITimeoutService,
        private $filter: ng.IFilterService,
        private DatalayerUtilsService: DatalayerUtilsService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilService: CommonsHttpUtilService,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
        private CommonsConstants: CommonsConstantsType) {
        this.counterAttemps = 0;
        this.reCallService = false;
    }
    ////////////////

    deleteAllAncillaries = (deferredRecall?: any): ng.IPromise<any> => {
        const checkinId: string = this.localStorageService.get('flowId');
        const flowApp = this.localStorageService.get('flowApp');
        const endpoint = flowApp === this.CommonsConstants.APP_TYPES.CHECKIN ? this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.ancillariesURI + checkinId + '/ancillaries/delete/all' : this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.ancillariesURICloud + checkinId;
        let deferred = deferredRecall || this.$q.defer();

        const deleteAllAncillariesSuccess = (data): void => {
            deferred.resolve(data.data);
            deferred = null;
        };
        const deleteAncillaryCallback = (): void => {
            this.counterAttemps++;
            this.deleteAllAncillaries();
        };
        const deleteAllAncillariesError = (error: CommonsErrorsModel.ErrorDataGeneral): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, deleteAncillaryCallback, deferred);
        };

        this.CommonsGenericProxy.deleteGeneric(endpoint, this.headerConfig).then(deleteAllAncillariesSuccess, deleteAllAncillariesError);

        return deferred.promise;
    };

    /**
     *
     * @param {*} data
     */
    deleteAncillarie = (request, deferredRecall?: any): angular.IPromise<any> => {
        const flowId = this.localStorageService.get('flowId');
        const endpoint = this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.ancillariesURICloud + 'delete/';
        const uri = endpoint + flowId;
        let deferred = deferredRecall || this.$q.defer();

        const deleteAllAncillariesSuccess = (data): void => {
            deferred.resolve(data.data);
            deferred = null;
        };
        const deleteAncillaryCallback = (): void => {
            this.counterAttemps++;
            this.deleteAllAncillaries();
        };
        const deleteAllAncillariesError = (error: CommonsErrorsModel.ErrorDataGeneral): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, deleteAncillaryCallback, deferred);
        };

        this.CommonsGenericProxy.putGeneric(uri, request, this.headerConfig).then(deleteAllAncillariesSuccess, deleteAllAncillariesError);

        return deferred.promise;
    };

    /**
         * This function call ancillaries serviceURI to get all availability.
         * If the ancillaries service response ok, the function resolve  promise and return it with the data.
         * If the ancillaries service response ko, the function reject promise and return at error according to code.
         * @returns {promise}
         *  */
    getAncillaries = (recalDeferred?: any, locator?: string): angular.IPromise<any> => {
        let deferred = recalDeferred || this.$q.defer();
        const flowId = this.localStorageService.get('flowId'), deepLinkFlow = this.localStorageService.get('deepLinkParams') || null;
        let endpoint = this.CommonsUtilService.getEndpoint('ass-fass-rs');
        if (isUndefined(locator)) {
            locator = this.localStorageService.get('PNR');
        }
        endpoint = endpoint ? (endpoint + this.CommonsHttpServicesConstants.ancillariesURI) : this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.ancillariesURI;
        const getAncillariesSuccess = (data) => {
            deferred.resolve(data.data);
            deferred = null;
        };
        const getAncillariesCallback = () => {
            this.counterAttemps++;
            this.getAncillaries();
        };
        const getAncillariesError = (error: CommonsErrorsModel.ErrorDataGeneral) => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, getAncillariesCallback, deferred);
        };
        if (flowId === null) {
            this.$timeout(() => {
                deferred.reject({
                    errorCode: 'IB_00002',
                    message: this.$filter('translate')('SESSION_EXPIRED'),
                    internalErrorCode: 'IB_00002'
                });
                deferred = null;
            });
        } else {
            if (deepLinkFlow) {
                endpoint = endpoint + flowId + '/ancillaries?ancillaryType=SEAT';
            } else {
                endpoint = endpoint + flowId + '/ancillaries';
            }
            if (!isUndefined(locator)) endpoint = this.addLocator(endpoint, locator, deepLinkFlow);
            this.CommonsGenericProxy.getGeneric(endpoint).then(getAncillariesSuccess, getAncillariesError);
        }
        return deferred.promise;
    };

    addLocator = (endpoint: string, locator: string, deepLinkFlow) => {
        const typeConcat: string = deepLinkFlow ? '&' : '?';
        endpoint = endpoint + typeConcat + 'locator=' + locator;
        return endpoint;
    };

    /**
         * This function call to insurance service to get all information neccesary about the insurance.
         * If the insurance service response ok, the function resolve the promise and return at promise with all data.
         * If the insurance service response ko, the function reject the promise and return at error according to code error.
         * @returns {Promise}
         **/
    getInsurance = (country, recalDeferred?: any): angular.IPromise<any> => {

        let deferred = recalDeferred || this.$q.defer();
        const flowId = this.localStorageService.get('flowId');
        let endpoint = this.CommonsUtilService.getEndpoint('ass-fass-rs');
        endpoint = endpoint ? (endpoint + this.CommonsHttpServicesConstants.ancillariesURI) : this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.ancillariesURI;

        const getInsuranceSuccess = (data): void => {
            deferred.resolve(data.data);
            deferred = null;
        };
        const getInsuranceCallback = () => {
            this.counterAttemps++;
            this.getInsurance(country, recalDeferred);
        };
        const getInsuranceError = (error: CommonsErrorsModel.ErrorDataGeneral) => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, getInsuranceCallback, deferred);
        };
        if (flowId === null) {
            this.$timeout(() => {
                deferred.reject({
                    errorCode: 'IB_00002',
                    message: this.$filter('translate')('SESSION_EXPIRED'),
                    internalErrorCode: 'IB_00002'
                });
                deferred = null;
            });
        } else {
            endpoint = endpoint + flowId + '/ancillaries' + '?ancillaryType=INSURANCE&residenceCountry=' + country;
            this.CommonsGenericProxy.getGeneric(endpoint).then(getInsuranceSuccess, getInsuranceError);
        }

        return deferred.promise;
    };


    /**
    * This function call at ancillariesSummary service. Its neccesary call after  each delete ancillaries to update
    * the breakdownInfo data.
    */
    getAncillarieSummary = (deferredRecall?: any, isRefreshCall?: boolean, locator?: string): angular.IPromise<any> => {
        let deferred = deferredRecall || this.$q.defer();
        const checkinId = this.localStorageService.get('flowId');
        if (isUndefined(locator)) {
            locator = this.localStorageService.get('PNR');
        }
        let endpoint: string, refresh = '';

        const getAncillarieSummarySuccess = (data): void => {
            deferred.resolve(data.data);
            deferred = null;
        };
        const getAncillarieSummaryCallback = () => {
            this.counterAttemps++;
            this.getInsurance(deferred);
        };

        const getAncillarieSummaryError = (error: CommonsErrorsModel.ErrorDataGeneral): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, getAncillarieSummaryCallback, deferred);
        };

        if (checkinId === null) {
            this.$timeout(() => {
                deferred.reject({
                    errorCode: 'IB_00002',
                    message: this.$filter('translate')('SESSION_EXPIRED'),
                    internalErrorCode: 'IB_00002'
                });
                deferred = null;
            });
        } else {
            if (!isUndefined(locator)) {
                refresh = '?locator=' + locator;
            }
            if (isRefreshCall === true && isUndefined(locator)) {
                refresh = refresh + '?refresh=true';
            }
            if (isRefreshCall === true && !isUndefined(locator)) {
                refresh = refresh + '&refresh=true';
            }
            endpoint = this.CommonsUtilService.getEndpoint('ass-fass-rs');
            endpoint = endpoint ? (endpoint + this.CommonsHttpServicesConstants.getAncillariesSummaryURI) : this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.getAncillariesSummaryURI;
            this.CommonsGenericProxy.getGeneric(endpoint + checkinId + '/ancillaries-summary' + refresh).then(getAncillarieSummarySuccess, getAncillarieSummaryError).catch(getAncillarieSummaryError);
        }

        return deferred.promise;
    };

    /**
         * This function send the ancillariesInfo data to update the information.
         * If the service response ok, the function resolve the promise and return at promise with all data.
         * If the service response ko, the function reject the promise and return at error according to code error.
         * @param {Object} ancillariesInfo all data neccesary to send at ancillaries services.
         * @returns {promise}
         *  */
    updateAncillaries = (ancillariesInfo: any, recalDeferred?: any): angular.IPromise<any> => {

        let deferred = recalDeferred || this.$q.defer();
        const flowId = this.localStorageService.get('flowId');
        const endpoint = this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.ancillariesURICloud;
        const uri = endpoint + flowId;

        const updateAncillariesSuccess = (data): void => {
            deferred.resolve(data.data);
            deferred = null;
        };
        const updateAncillariesCallback = () => {
            this.counterAttemps++;
            this.updateAncillaries(ancillariesInfo, deferred);
        };

        const updateAncillariesError = (error: CommonsErrorsModel.ErrorDataGeneral): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, updateAncillariesCallback, deferred);
        };
        if (flowId === null) {
            this.$timeout(() => {
                deferred.reject({
                    errorCode: 'IB_00002',
                    message: this.$filter('translate')('SESSION_EXPIRED'),
                    internalErrorCode: 'IB_00002'
                });
                deferred = null;
            });
        } else {
            this.CommonsGenericProxy.putGeneric(uri, ancillariesInfo).then(updateAncillariesSuccess, updateAncillariesError);
        }

        return deferred.promise;

    };

    deleteBundleService = (deferredRecall?: any): ng.IPromise<any> => {
        const flowId: string = this.localStorageService.get('flowId');
        const bundleId: any = this.localStorageService.get('selectedBundle');
        const endpoint = this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.deleteBundleURI + flowId + '/' + bundleId.id;
        let deferred = deferredRecall || this.$q.defer();

        const deleteBundleServiceSuccess = (data): void => {
            deferred.resolve(data);
            deferred = null;
        };
        const deleteBundleServiceCallback = (): void => {
            this.counterAttemps++;
            this.deleteAllAncillaries();
        };
        const deleteBundleServiceError = (error: CommonsErrorsModel.ErrorDataGeneral): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, deleteBundleServiceCallback, deferred);
        };

        this.CommonsGenericProxy.deleteGeneric(endpoint, this.headerConfig).then(deleteBundleServiceSuccess, deleteBundleServiceError);

        return deferred.promise;
    };
    
    registerClickGlobickProduct = (product: any, deferredRecall?: any): ng.IPromise<any> => {
        
        let deferred = deferredRecall || this.$q.defer();
        const flowId = this.localStorageService.get('flowId');
        const uri = this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.defaultGlobickURI + flowId + '/click/' + product;

        const registerClickGlobickSuccess = (data): void => {
            deferred.resolve(data.data);
            deferred = null;
        };
        const registerClickGlobickCallback = () => {
            this.counterAttemps++;
        };

        const registerClickGlobickError = (error: CommonsErrorsModel.ErrorDataGeneral): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, registerClickGlobickCallback, deferred);
        };
        if (flowId === null) {
            this.$timeout(() => {
                deferred.reject({
                    errorCode: 'IB_00002',
                    message: this.$filter('translate')('SESSION_EXPIRED'),
                    internalErrorCode: 'IB_00002'
                });
                deferred = null;
            });
        } else {
            this.CommonsGenericProxy.postGeneric(uri, null).then(registerClickGlobickSuccess, registerClickGlobickError);
        }

        return deferred.promise;
    };
}