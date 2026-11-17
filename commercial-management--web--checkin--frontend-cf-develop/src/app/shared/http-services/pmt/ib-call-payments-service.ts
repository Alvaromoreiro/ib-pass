import * as angular from 'angular';
import { IbSessionConfigService } from '@src/app/core/services/ib-session-config.service';

export class AncillariesCallPaymentsService {

    constructor (
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private IbSessionConfigService: IbSessionConfigService,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy: CommonsGenericProxy
    ) {}

    getPayments = (): angular.IPromise<any> => {
        const checkinId = this.localStorageService.get('flowId');
        return new Promise((resolve, reject) => {
            if (checkinId !== null) {
                const endpoint = this.IbSessionConfigService.getEndpoint('pmt-ppm-rs') || this.CheckinAncillariesConstants.DEFAULT_ENDPOINTS.paymentsURI;
                const uri = endpoint + checkinId + '/payment-methods';
                this.CommonsGenericProxy.getGeneric(uri).then(
                    (response) => {
                        resolve(response.data);
                    },
                    (error) => {
                        this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                    });
            }
        });
    };
}
AncillariesCallPaymentsService.$inject = ['CheckinAncillariesConstants', 'localStorageService', 'IbSessionConfigService', 'AncillariesPaymentTransformer', 'CommonsNewHttpUtilsErrorService', 'CommonsGenericProxy'];

try {
    const mod = angular.module('ib-Checkin-ancillaries-module');
    mod.service(
        'AncillariesCallPaymentsService',
        AncillariesCallPaymentsService
    );
} catch (error) {
    const mod = angular.module('ib-Checkin-ancillaries-module', []);
    mod.service(
        'AncillariesCallPaymentsService',
        AncillariesCallPaymentsService
    );
}
