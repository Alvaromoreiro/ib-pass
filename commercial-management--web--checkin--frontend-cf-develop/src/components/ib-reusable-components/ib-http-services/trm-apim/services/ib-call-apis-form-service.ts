import { SecurityResponse } from '@src/app/core/models/ib-checkin-apis/services/security-model';
import { CkiDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service';
import { IbSessionConfigService } from '@src/app/core/services/ib-session-config.service';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';

@Service('ib-http-services-module', [
    '$q',
    'HttpServicesConstants',
    'localStorageService',
    'IbUtilsService',
    '$timeout',
    '$filter',
    'CkiDatalayerUtilsService',
    'CommonsGenericProxy',
    'CommonsHttpUtilsErrorService',
    'CheckinAppConstants',
    'IbSessionConfigService'
])
export class CallApisFormService {
    pasengersId: string;
    apisInfo: string;
    attemp: number;
    isLogged: boolean;
    urlSuffix: string;

    constructor (
        private $q: ng.IQService,
        private HttpServicesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private IbUtilsService: IbUtilsService,
        private $timeout: ng.ITimeoutService,
        private $filter: ng.IFilterFunction,
        private CkiDatalayerUtilsService: CkiDatalayerUtilsService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
        private CheckinAppConstants: CheckinAppConstants,
        private IbSessionConfigService: IbSessionConfigService
    ) {
        this.urlSuffix = '/security';
    }

    getApisInfo = (passengersId): angular.IPromise<SecurityResponse> => {
        const checkinId = this.localStorageService.get('flowId');
        const defer = this.$q.defer();
        const apisInfoSuccess = (data) => {
            defer.resolve(data.data);
        };
        const getApiInfoCallback = () => {
            this.attemp++;
            this.getApisInfo(this.pasengersId);
        };
        const getApisInfoError = (error) => {
            /* INIT DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDatalayerErrorEvent(error);
            /* FIN DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDigitalDataErrorEvent(error);
            this.CommonsHttpUtilsErrorService.controlError(error, this.attemp, getApiInfoCallback, defer);
        };
        let apisFormateError: TpmServiceModel.IApisInfoError;
        let endpoint;
        let url;

        this.isLogged = this.localStorageService.get('userLogged');
        this.pasengersId = passengersId;

        if (checkinId !== null) {
            endpoint = this.IbSessionConfigService.getEndpoint('trm-apim-rs');
            endpoint = endpoint
                ? endpoint + this.HttpServicesConstants.URI.apisPassengerInfoURI
                : this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.apisPassengerInfoURI;
            url =
                endpoint +
                checkinId +
                this.urlSuffix +
                this.IbUtilsService.generateQueryString({
                    passengersId: passengersId,
                    ocrEnabled: this.CheckinAppConstants.TOGGLE.ocrEnable
                });
            this.CommonsGenericProxy.getGeneric(url).then(apisInfoSuccess).catch(getApisInfoError);
        } else {
            apisFormateError = {
                errorCode: 'IB_00002',
                message: this.$filter('translate')('SESSION_EXPIRED'),
                internalErrorCode: 'IB_00002'
            };
            this.$timeout(() => {
                defer.reject(apisFormateError);
            });
        }
        return defer.promise;
    };

    updateApisInfo = (apisInfo) => {
        let endpoint = this.IbSessionConfigService.getEndpoint('trm-apim-rs');
        const checkinId = this.localStorageService.get('flowId');
        const defer = this.$q.defer();
        const updateApisInfoSuccess = (data) => {
            defer.resolve(data.data);
        };
        const updateApiInfoCallback = () => {
            this.attemp++;
            this.updateApisInfo(this.apisInfo);
        };
        const updateApisInfoError = (error) => {
            /* INIT DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDatalayerErrorEvent(error);
            /* FIN DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDigitalDataErrorEvent(error);
            this.CommonsHttpUtilsErrorService.controlError(error, this.attemp, updateApiInfoCallback, defer);
        };
        let url;
        let apisFormateError: TpmServiceModel.IApisInfoError;

        this.apisInfo = apisInfo;
        if (checkinId !== null) {
            endpoint = endpoint
                ? endpoint + this.HttpServicesConstants.apisPassengerInfoURI
                : this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.apisPassengerInfoURI;
            url = endpoint + checkinId + this.urlSuffix;
            this.CommonsGenericProxy.putGeneric(url, apisInfo).then(updateApisInfoSuccess).catch(updateApisInfoError);
        } else {
            apisFormateError = {
                errorCode: 'IB_00002',
                message: this.$filter('translate')('SESSION_EXPIRED'),
                internalErrorCode: 'IB_00002'
            };
            this.$timeout(() => {
                defer.reject(apisFormateError);
            });
        }
        return defer.promise;
    };
}
