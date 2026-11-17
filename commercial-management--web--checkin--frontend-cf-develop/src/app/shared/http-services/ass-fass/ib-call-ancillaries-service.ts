import * as angular from 'angular';
import { CheckinAncillariesConstants } from '@src/app/core/constants/ib-ancillaries-constants';
import { IbSessionConfigService } from '@src/app/core/services/ib-session-config.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils/storage-utils/ib-commons-session-storage.service';
import { UpgradingAncillariesResponse } from '@src/app/shared/services/ib-upgrading/models/ib-upgrading-ancillary-to-upgrade-info-mapper.model';
export class CallAncillariesService {

    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbSessionConfigService: IbSessionConfigService,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private $filter: angular.IFilterService
    ) {}

    getAncillaries = () => {
        const locator = this.CommonsSessionStorageService.get('PNR');
        const flowId = this.IbSessionConfigService.getFlowId();
        const endpoint = `${CheckinAncillariesConstants.DEFAULT_ENDPOINTS.ancillariesURI}${flowId}/ancillaries?locator=${locator}`;

        const maxEditableTimeout :number = this.CommonsSessionStorageService.get('ancillariesServiceTimeoutValue')|| null;
        
        return this.getPromise(flowId, endpoint, maxEditableTimeout);
    };

    getPromise = (flowId, endpoint, maxEditableTimeout) => {
        return new Promise((resolve, reject) => {
            if (flowId !== null && flowId !== undefined) {
                this.CommonsGenericProxy.getGeneric(endpoint, null, maxEditableTimeout).then(
                    (response) => {
                        resolve(response.data);
                    },
                    (error) => {
                        this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                    });

            } else {
                reject({
                    errorCode: 'IB_00002',
                    message: this.$filter<any>('translate')('SESSION_EXPIRED'),
                    internalErrorCode: 'IB_00002'
                });
            }
        });
    };

    getInsurance = (country: string) => {
        const checkinId = this.CommonsSessionStorageService.get('flowId');
        const endpoint = CheckinAncillariesConstants.DEFAULT_ENDPOINTS.ancillariesURI;
        const uri = endpoint + checkinId + '/ancillaries' + '?ancillaryType=INSURANCE&residenceCountry=' + country;
        return new Promise((resolve, reject) => {
            this.CommonsGenericProxy.getGeneric(uri).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };

    getUpgradingBidAncillarie = ():Promise<UpgradingAncillariesResponse> => {
        const checkinId = this.CommonsSessionStorageService.get('flowId');
        const endpoint = CheckinAncillariesConstants.DEFAULT_ENDPOINTS.ancillariesURI;
        const uri = endpoint + checkinId + '/ancillaries' + '?ancillaryType=UPGRADING_BID';
        return new Promise((resolve, reject) => {
            this.CommonsGenericProxy.getGeneric(uri).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };

    getUpgradingAncillarie = () => {
        const checkinId = this.CommonsSessionStorageService.get('flowId');
        const endpoint = CheckinAncillariesConstants.DEFAULT_ENDPOINTS.ancillariesURI;
        const uri = endpoint + checkinId + '/ancillaries' + '?ancillaryType=UPGRADING';
        return new Promise((resolve, reject) => {
            this.CommonsGenericProxy.getGeneric(uri).then(
                (response) => {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };
}

CallAncillariesService.$inject = ['CommonsSessionStorageService', 'IbSessionConfigService', 'CommonsNewHttpUtilsErrorService', 'CommonsGenericProxy', '$filter'];
try {
    const mod = angular.module('ib-shared-services-module');
    mod.service(
        'CallAncillariesService',
        CallAncillariesService
    );
} catch (error) {
    const mod = angular.module('ib-shared-services-module', []);
    mod.service(
        'CallAncillariesService',
        CallAncillariesService
    );
}
