import {
    associateBoardingCardsRequest,
    associateBoardingCardsResponse
} from '@src/app/core/models/biometrics/biometrics-model';
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
class GetBiometricCardPassengerAssociationService {
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

    getBiometricCardPassengerData = (request: object): angular.IPromise<unknown> => {
        let endpoint = this.IbSessionConfigService.getEndpoint('cust-bio-rs');
        const defer = this.$q.defer();
        const getBiometricCardPassengerDataSucces = (data: unknown) => {
            defer.resolve(data);
        };
        const getBiometricCardPassengerDataCallback = () => {
            this.attemp++;
            this.getBiometricCardPassengerData(this.request);
        };
        const getBiometricCardPassengerDataError = (error: unknown) => {
            /* INIT DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDatalayerErrorEvent(error);
            /* FIN DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDigitalDataErrorEvent(error);
            this.CommonsHttpUtilsErrorService.controlError(error, this.attemp, getBiometricCardPassengerDataCallback, defer);
        };

        this.request = request;
        endpoint = endpoint
            ? endpoint + this.HttpServicesConstants.URI.getBiometricCardPassengerAssociation
            : this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.getBiometricCardPassengerAssociation;
        this.CommonsGenericProxy.postGeneric(endpoint, request)
            .then(getBiometricCardPassengerDataSucces)
            .catch(getBiometricCardPassengerDataError);

        return defer.promise;
    };

    associateBoardingCardsOrchestrator = (request: associateBoardingCardsRequest) => {
        const defer = this.$q.defer();

        const associateBoardingCardsOrchestratorSuccess = (data: associateBoardingCardsResponse) => {
            defer.resolve(data);
        };

        const associateBoardingCardsOrchCallBack = () => {
            this.attemp++;
            this.associateBoardingCardsOrchestrator(request);
        };

        const associateBoardingCardsOrchestratorError = (error) => {
            /* INIT DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDatalayerErrorEvent(error);
            /* FIN DELETE GA4 MIGRATION*/
            this.CkiDatalayerUtilsService.sendDigitalDataErrorEvent(error);
            this.CommonsHttpUtilsErrorService.controlError(error, this.attemp, associateBoardingCardsOrchCallBack, defer);
        };

        const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.associateBoardingCardsOrchestrator;
        this.CommonsGenericProxy.postGeneric(endpoint, request)
            .then(associateBoardingCardsOrchestratorSuccess)
            .catch(associateBoardingCardsOrchestratorError);

        return defer.promise;
    };
}
