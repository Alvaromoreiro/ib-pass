import { CkiDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service';
import { IbSessionConfigService } from '@src/app/core/services/ib-session-config.service';

@Service('ib-http-services-module', [
    '$q',
    'HttpServicesConstants',
    'IbSessionConfigService',
    'CkiDatalayerUtilsService',
    'CommonsGenericProxy',
    'CommonsHttpUtilsErrorService'
])
class GetBiometricDataService {
    attemp: number;
    request: object;

    constructor (
        private $q: ng.IQService,
        private HttpServicesConstants,
        private IbSessionConfigService: IbSessionConfigService,
        private CkiDatalayerUtilsService: CkiDatalayerUtilsService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilsErrorService
    ) {
        this.attemp = 0;
    }

    getBiometricalData = (request: object): angular.IPromise<unknown> => {
        let endpoint = this.IbSessionConfigService.getEndpoint('cust-bio-rs');
        const defer = this.$q.defer();
        const getBiometricalDataSucces = (data: unknown) => {
            defer.resolve(data);
        };
        const getBiometricalDataCallback = () => {
            this.attemp++;
            this.getBiometricalData(this.request);
        };
        const getBiometricalDataError = (error: unknown) => {
            /* INIT DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDatalayerErrorEvent(error);
            /* FIN DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDigitalDataErrorEvent(error);
            this.CommonsHttpUtilsErrorService.controlError(error, this.attemp, getBiometricalDataCallback, defer);
        };

        this.request = request;
        endpoint = endpoint
            ? endpoint + this.HttpServicesConstants.URI.getBiometricalData
            : this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.getBiometricalData;
        this.CommonsGenericProxy.postGeneric(endpoint, request)
            .then(getBiometricalDataSucces)
            .catch(getBiometricalDataError);

        return defer.promise;
    };
}
