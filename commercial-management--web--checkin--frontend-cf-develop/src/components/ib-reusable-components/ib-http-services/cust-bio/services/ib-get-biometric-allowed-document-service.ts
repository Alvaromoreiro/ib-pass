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
class GetBiometricAllowedDataService {
    attemp: number;

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

    getBiometricalAllowedDocuments = (): angular.IPromise<unknown> => {
        const defer = this.$q.defer();
        let endpoint = this.IbSessionConfigService.getEndpoint('cust-bio-rs');
        const getBiometricDocumentsSucces = (data: unknown) => {
            defer.resolve(data);
        };
        const getBiometricDocumentsCallback = () => {
            this.attemp++;
            this.getBiometricalAllowedDocuments();
        };
        const getBiometricDocumentsError = (error: unknown) => {
            /* INIT DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDatalayerErrorEvent(error);
            /* FIN DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDigitalDataErrorEvent(error);
            this.CommonsHttpUtilsErrorService.controlError(error, this.attemp, getBiometricDocumentsCallback, defer);
        };

        endpoint = endpoint
            ? endpoint + this.HttpServicesConstants.URI.getBiometricalAllowedDocuments
            : this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.getBiometricalAllowedDocuments;
        this.CommonsGenericProxy.getGeneric(endpoint).then(getBiometricDocumentsSucces).catch(getBiometricDocumentsError);
        return defer.promise;
    };
}
