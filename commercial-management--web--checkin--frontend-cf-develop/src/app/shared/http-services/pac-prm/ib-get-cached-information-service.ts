import * as angular from 'angular';
import { CommonsBrowserStorageService } from 'ib-web-commons/utils';
import { CkiAncillariesUtilsService } from '@pages/ib-web-ancillaries/services/ib-ckeckin-ancillaries-utils';

export class AncGetCachedInformationService {
    constructor (
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private CommonsBrowserStorageService: CommonsBrowserStorageService,
        private CkiAncillariesUtilsService: CkiAncillariesUtilsService,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private $filter: angular.IFilterService,
        private $timeout: ng.ITimeoutService
    ) {}

    private getEndpointURI (checkinId: string, endpoint: string = ''): string {
        const baseUrl = this.getCachedInformationBaseUrl();
        return `${baseUrl}${checkinId}${endpoint}`;
    }

    private getCachedInformationBaseUrl (): string {
        const endpoint = this.CkiAncillariesUtilsService.getEndpoint('pac-prm-rs');
        return endpoint
            ? `${endpoint}${this.CheckinAncillariesConstants.cachedInformationURI}`
            : this.CheckinAncillariesConstants.DEFAULT_ENDPOINTS.cachedInformationURI;
    }

    private rejectSessionExpiredInto (reject?: any): void {
        this.$timeout(() => {
            reject({
                errorCode: 'IB_00002',
                message: this.$filter('translate')('SESSION_EXPIRED'),
                internalErrorCode: 'IB_00002'
            } as any);
        });
    }

    private handleRequestError (error, reject) {
        this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
    }

    getCachedInformation = () => {
        const checkinId: string | null = this.CommonsBrowserStorageService.get('flowId');
        const endpoint = this.getEndpointURI(checkinId, '/cached');
        return new Promise((resolve, reject) => {
            if (!checkinId) {
                this.rejectSessionExpiredInto(reject);
            }

            this.CommonsGenericProxy.getGeneric(endpoint)
                .then(
                    (data) => resolve(data.data),
                    (error) => this.handleRequestError(error, reject)
                )
                .catch((error) => this.handleRequestError(error, reject));
        });
    };
}

AncGetCachedInformationService.$inject = [
    'CheckinAncillariesConstants',
    'localStorageService',
    'CkiAncillariesUtilsService',
    'CommonsNewHttpUtilsErrorService',
    'CommonsGenericProxy'
];
try {
    const mod = angular.module('ib-checkin-ancillaries-module');
    mod.service('AncGetCachedInformationService', AncGetCachedInformationService);
} catch (error) {
    const mod = angular.module('ib-checkin-ancillaries-module', []);
    mod.service('AncGetCachedInformationService', AncGetCachedInformationService);
}
