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
class GetFlightInfoPassenger {
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

    getFlightInfoPassenger = (request: object): angular.IPromise<unknown> => {
        let endpoint = this.IbSessionConfigService.getEndpoint('cust-bio-rs');
        this.request = request;
        const defer = this.$q.defer();
        const getFlightInfoPassengerSucces = (data: unknown) => {
            defer.resolve(data);
        };
        const getFlightInfoPassengerCallback = () => {
            this.attemp++;
            this.getFlightInfoPassenger(this.request);
        };
        const getFlightInfoPassengerError = (error: unknown) => {
            /* INIT DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDatalayerErrorEvent(error);
            /* FIN DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDigitalDataErrorEvent(error);
            this.CommonsHttpUtilsErrorService.controlError(error, this.attemp, getFlightInfoPassengerCallback, defer);
        };

        endpoint = endpoint
            ? endpoint + this.HttpServicesConstants.URI.getFlightInfoPassenger
            : this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.getFlightInfoPassenger;
        this.CommonsGenericProxy.postGeneric(endpoint, request)
            .then(getFlightInfoPassengerSucces)
            .catch(getFlightInfoPassengerError);

        return defer.promise;
    };
}
