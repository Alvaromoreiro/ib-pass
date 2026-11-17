import { CkiDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';
import { GenericStorageKey } from '@src/app/core/constants/ib-storage-keys.constants';

@Service('ib-checkin-services-module', [
    '$q',
    'CheckinAppConstants',
    'IbUtilsService',
    'CkiDatalayerUtilsService',
    'CommonsGenericProxy',
    'CommonsHttpUtilsErrorService'
])
export class EndpointsService {
    attemp: number;

    constructor (
        private $q: ng.IQService,
        private CheckinAppConstants,
        private IbUtilsService: IbUtilsService,
        private CkiDatalayerUtilsService: CkiDatalayerUtilsService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilsErrorService
    ) {
        this.attemp = 0;
    }
    defer: angular.IDeferred<unknown> = null;

    getEndpoints = (): angular.IPromise<unknown> => {
        this.defer = this.defer === null ? this.$q.defer() : this.defer;
        const endpoint =
            this.CheckinAppConstants.endpointsServiceURI + this.IbUtilsService.getMetaTagValueByName(GenericStorageKey.buildNumber);
        const getEndpointsSucces = (data: unknown) => {
            this.defer.resolve(data);
            this.defer = null;
        };

        const getEndpointsError = (error: unknown) => {
            const getEndpointsCallback = (): void => {
                this.attemp++;
                this.getEndpoints();
            };
            /* INIT DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDatalayerErrorEvent(error);
            /* FIN DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDigitalDataErrorEvent(error);
            this.CommonsHttpUtilsErrorService.controlError(error, this.attemp, getEndpointsCallback, this.defer);
        };

        this.CommonsGenericProxy.getGeneric(endpoint).then(getEndpointsSucces).catch(getEndpointsError);
        return this.defer.promise;
    };
}
