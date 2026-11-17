import { AdditonalInfoBody, DisruptionContact, FilterPassengerAdditionalInfo, FrequentFlyer, PassengerAdditionalInfo } from '@src/app/core/models/ib-checkin-apis/services/additional-info-model';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';
import { IDeferred, IPromise } from 'angular';

@Service('ib-http-services-module', [
    '$q',
    'CommonsGenericProxy',
    'CommonsHttpUtilsErrorService',
    'HttpServicesConstants',
    'CommonsSessionStorageService',
    '$filter',
    'IbUtilsService'
])
export class PassengerAdditionalInfoService {
    private counterAttemps = 0;

    constructor (
        private $q: ng.IQService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
        private HttpServicesConstants: HttpServicesConstantsNamespace.HttpServicesConstants,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private $filter: angular.IFilterService,
        private IbUtilsService: IbUtilsService
    ) {}

    updateAdditionalInfo = (additionalInfo: PassengerAdditionalInfo[]) => {
        let defer = this.$q.defer();
        const { validAdditionalInfo, hasAllIncompleteData }: FilterPassengerAdditionalInfo = this.filterValidaData(additionalInfo);
        
        if (hasAllIncompleteData) {
            defer.reject({ message: this.$filter('translate')('REST_SERVICE_ERROR_GENERAL') });
            return defer.promise;
        }

        const updateAdditionalInfoSuccess = (data): void => {
            defer.resolve(data.data);
            defer = null;
            this.counterAttemps = 0;
        };
        const updateAdditionalInfoCallback = (): void => {
            this.counterAttemps++;
            this.updateAdditionalInfo(additionalInfo);
        };
        const updateAdditionalInfoError = (err: any) => {
            this.CommonsHttpUtilsErrorService.controlError(err, this.counterAttemps, updateAdditionalInfoCallback, defer);
        };
        const checkinId = this.getCheckinIdOrReject(defer);
        const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.passengerAdditionalInfoURI + checkinId + '/additional-info';
        this.CommonsGenericProxy.putGeneric(endpoint, validAdditionalInfo).then(updateAdditionalInfoSuccess, updateAdditionalInfoError);
        return defer.promise;
    };

    updateEmergencyInfo = (emergencyInfo) => {
        let defer = this.$q.defer();
        const updateEmergencyInfoSuccess = (data): void => {
            defer.resolve(data.data);
            defer = null;
            this.counterAttemps = 0;
        }; 
        const updateEmergencyInfoCallback = (): void => {
            this.counterAttemps++;
            this.updateEmergencyInfo(emergencyInfo);
        };
        const checkinId = this.getCheckinIdOrReject(defer);
        const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.passengerAdditionalInfoURI + checkinId + '/emergency';
        this.CommonsGenericProxy.putGeneric(endpoint, emergencyInfo).then(updateEmergencyInfoSuccess, (err: any) =>
            this.CommonsHttpUtilsErrorService.controlError(err, this.counterAttemps, updateEmergencyInfoCallback, defer)
        );
        return defer.promise;
    };

    getAdditionalInfo = (passengersId): IPromise<AdditonalInfoBody> =>
        this.getInfoByPassengers(passengersId, '/additional-info', () => this.getAdditionalInfo(passengersId)) as IPromise<AdditonalInfoBody>;

    getEmergencyInfo = (passengersId) =>
        this.getInfoByPassengers(passengersId, '/emergency', () => this.getEmergencyInfo(passengersId));

    private getInfoByPassengers = (passengersId = [], uriSuffix: string, retry: () => void): IPromise<unknown> => {
        let defer = this.$q.defer();
        const success = (data): void => {
            defer.resolve(data.data);
            defer = null;
            this.counterAttemps = 0;
        };
        const retryCallback = (): void => {
            this.counterAttemps++;
            retry();
        };
        const checkinId = this.getCheckinIdOrReject(defer);
        if (passengersId.length > 0) {
            const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.passengerAdditionalInfoURI + checkinId + uriSuffix + this.IbUtilsService.generatePassengersQueryString(passengersId);
            this.CommonsGenericProxy.getGeneric(endpoint).then(success, (err: any) =>
                this.CommonsHttpUtilsErrorService.controlError(err, this.counterAttemps, retryCallback, defer)
            );
        } else {
            success([]);
        }
        return defer.promise;
    };

    private getCheckinIdOrReject = (defer: IDeferred<unknown>) => {
        return this.CommonsSessionStorageService.get('flowId') || this.checkinIdError(defer);
    };

    private checkinIdError = (defer: IDeferred<unknown>): void => {
        defer.reject({ errorCode: 'IB_00002', message: this.$filter('translate')('SESSION_EXPIRED'), internalErrorCode: 'IB_00002' });
        defer = null;
        this.counterAttemps = 0;
    };

    private isNotEmpty = (value: unknown): boolean => {
        if (value === null || value === undefined) {
            return false;
        }

        return typeof value !== 'string' || value.trim().length > 0;
    };

    private hasValidId = (id: unknown): boolean =>
        id !== null && id !== undefined;

    private checkContact = (contact?: DisruptionContact | null): boolean =>
        !contact || [contact.email, contact.language, contact.phone?.number].every(this.isNotEmpty);

    private checkFrequentFlyer = (frequentFlyer?: FrequentFlyer | null): boolean =>
        !frequentFlyer || [frequentFlyer.number, frequentFlyer.iataCompanyCode].every(this.isNotEmpty);

    private hasAllTheData = (info: PassengerAdditionalInfo): boolean => {
        if (!info || !this.hasValidId(info.id)) {
            return false;
        }

        const { disruptionContact, frequentFlyer } = info;
        const hasPayload = Boolean(disruptionContact || frequentFlyer);

        return hasPayload && this.checkContact(disruptionContact) && this.checkFrequentFlyer(frequentFlyer);
    };

    private filterValidaData = (passengerAdditionalInfo: PassengerAdditionalInfo[]): FilterPassengerAdditionalInfo => {
        const totalStart = passengerAdditionalInfo.length;
        const validAdditionalInfo = passengerAdditionalInfo.filter(this.hasAllTheData) || [];
        const totalValid = validAdditionalInfo.length;
        const totalDeleted = totalStart - totalValid;
        const hasAllIncompleteData = totalStart === totalDeleted;
        
        return {
            validAdditionalInfo,
            hasAllIncompleteData
        };
    };
}
