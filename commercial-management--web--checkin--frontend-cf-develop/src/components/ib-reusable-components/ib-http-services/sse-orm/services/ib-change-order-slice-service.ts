import { CkiDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service';
import { IbSessionConfigService } from '@src/app/core/services/ib-session-config.service';
@Service('ib-http-services-module', [
    '$q',
    'HttpServicesConstants',
    'CkiDatalayerUtilsService',
    'CommonsGenericProxy',
    'CommonsHttpUtilsErrorService',
    'IbSessionConfigService'
])
class ChangeOrderSliceService {
    orderId: string;
    sliceId: string;
    changeData: object;
    attemp: number;
    isLogged: boolean;

    constructor (
        private $q: ng.IQService,
        private HttpServicesConstants,
        private CkiDatalayerUtilsService: CkiDatalayerUtilsService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilsErrorService,
        private IbSessionConfigService: IbSessionConfigService
    ) {
        this.attemp = 0;
    }

    changeOrderSlice = (orderId: string, sliceId: string, changeData: object): angular.IPromise<unknown> => {
        const defer = this.$q.defer();
        let endpoint: string = this.IbSessionConfigService.getEndpoint('sse-orm-rs');
        const changeOrderSliceSuccess = (data: unknown) => {
            defer.resolve(data);
        };
        const changeOrderSliceCallback = () => {
            this.attemp++;
            this.changeOrderSlice(this.orderId, this.sliceId, this.changeData);
        };
        const changeOrderSliceError = (error: unknown) => {
            /* INIT DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDatalayerErrorEvent(error);
            /* FIN DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDigitalDataErrorEvent(error);
            this.CommonsHttpUtilsErrorService.controlError(
                error,
                this.attemp,
                changeOrderSliceCallback,
                defer,
                this.isLogged
            );
        };

        this.orderId = orderId;
        this.sliceId = sliceId;
        this.changeData = changeData;
        endpoint = endpoint
            ? endpoint + this.HttpServicesConstants.URI.changeOrderSliceURI
            : this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.changeOrderSliceURI;
        this.CommonsGenericProxy.putGeneric(this.buildUrl(endpoint, orderId, sliceId), changeData)
            .then(changeOrderSliceSuccess)
            .catch(changeOrderSliceError);

        return defer.promise;
    };

    private buildUrl = (endpoint: string, orderId: string, sliceId: string): string => {
        return endpoint + '/' + orderId + '/slice/' + sliceId;
    };
}
