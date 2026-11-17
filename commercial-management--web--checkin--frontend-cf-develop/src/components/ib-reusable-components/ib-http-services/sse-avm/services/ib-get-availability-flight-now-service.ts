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
class GetAvailabilityFlightNowService {
    flyNowRequest: object;
    attemp: number;
    isLogged: boolean;
    urlSuffix: string;

    constructor (
        private $q: ng.IQService,
        private HttpServicesConstants,
        private IbSessionConfigService: IbSessionConfigService,
        private CkiDatalayerUtilsService: CkiDatalayerUtilsService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService
    ) { }

    getAvailabilityFlightNow = (flyNowRequest): angular.IPromise<unknown> => {
        let endpoint = this.IbSessionConfigService.getEndpoint('sse-avm-rs');
        const defer = this.$q.defer();
        const getAvailabilityFlightNowSuccess = (data) => {
            defer.resolve(data.data);
        };
        const getAvailabilityFlightNowCallback = () => {
            this.attemp++;
            this.getAvailabilityFlightNow(this.flyNowRequest);
        };
        const getAvailabilityFlightNowError = (error) => {
            /* INIT DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDatalayerErrorEvent(error);
            /* FIN DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDigitalDataErrorEvent(error);
            this.CommonsHttpUtilsErrorService.controlError(error, this.attemp, getAvailabilityFlightNowCallback, defer);
        };

        this.flyNowRequest = flyNowRequest;
        endpoint = endpoint
            ? endpoint + this.HttpServicesConstants.URI.availabilityFlightNowURI
            : this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.availabilityFlightNowURI;
        this.CommonsGenericProxy.postGeneric(endpoint, flyNowRequest)
            .then(getAvailabilityFlightNowSuccess)
            .catch(getAvailabilityFlightNowError);

        return defer.promise;
    };
}
