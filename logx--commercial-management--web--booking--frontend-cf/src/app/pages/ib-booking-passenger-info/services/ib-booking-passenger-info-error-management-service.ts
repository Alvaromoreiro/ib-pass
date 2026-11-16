
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingPassengerInfoService } from './ib-booking-passenger-info-service';
import { BookingAppConstants } from '../../../core/constants/ib-booking-constants';
import angular from 'angular';


export class BookingPassengerInfoErrorManager {
    constructor (
        private $rootScope: CommonsRootScope,
        private BookingPassengerInfoService: BookingPassengerInfoService,
        private BookingModalService,
        private $location: angular.ILocationService,
        private CommonsSessionStorageService : CommonsSessionStorageService,
        private BookingAppConstants: BookingAppConstants

    ) { }
    private defaultError = (errorData: CommonsErrorsModel.CommonsErrorsResponseGeneral) => {
        return this.BookingModalService.showGenericError(errorData).result.then(angular.noop, angular.noop);
    };

    private residentError = (errorData: CommonsErrorsModel.CommonsErrorsResponseGeneral) => {
        this.$rootScope.$broadcast('updateResidentErrors', errorData);
    };
    private unexpectedTechnicalError = () => {
        return this.BookingModalService.showGenericError({
            title: 'PASSENGERS_INTERNAL_ERROR_TITLE',
            message: 'PASSENGERS_INTERNAL_ERROR_MESSAGE',
            needsTranslate: true
        }).result.then(() => { }, () => { });
    };
    private extendedDirectOptionWarning = (errorData: CommonsErrorsModel.CommonsErrorsResponseGeneral) => {
        this.BookingModalService.showGenericModal(true, 'generic-complete-modal', {
            title: 'MODAL_ERROR_TITLE',
            body: errorData.message,
            accept: 'CHOOSE_OTHER_FARE_BUTTON_TEXT',
            cancel: 'KEEP_ALIVE_BACK_BUTTON'
        }).result
            .then(this.BookingPassengerInfoService.goToRecoveryFlow)
            .catch(() => {
                this.$rootScope.$broadcast('backToMainRoot', true);
            });
    };
    private availabilityOptionWarning = (errorData: CommonsErrorsModel.CommonsErrorsResponseGeneral) => {
        const modalData = {
            title: 'MODAL_ERROR_TITLE',
            body : errorData.message,
            accept : 'KEEP_ALIVE_RELOAD_SEARCH',
            cancel: 'KEEP_ALIVE_BACK_BUTTON'
        };
        this.BookingModalService.showGenericModal(true, 'generic-complete-modal', modalData).result.then(() => {
            if (this.CommonsSessionStorageService.get('searchFlightType') === this.BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH || this.CommonsSessionStorageService.get('openJaw')) {
                this.CommonsSessionStorageService.set('metasearchOrderError', true);
            }
            if ( this.CommonsSessionStorageService.get( 'searchFlightType' ) === this.BookingAppConstants.SEARCH_FLIGHT_TYPE.PAOPEN ) {
                this.$location.path( '/ibshuttle' );
                return;
            }
            this.$location.path('/availability');
        }, () => {
            this.$rootScope.$broadcast('backToMainRoot', true);
        });
    };


    public processError = (errorData: CommonsErrorsModel.CommonsErrorsResponseGeneral): Promise<any> => {
        const errorKey = `${errorData?.errorCode}-${errorData?.internalErrorCode}`;
        return (this.warningConfig[errorKey] ?? this.warningConfig.default)(errorData);
    };

    private warningConfig = {
        'default': this.defaultError,
        '400-PAC_UTILS_E0005': this.residentError,
        '500-FRAM_B0006': this.unexpectedTechnicalError,
        '410-SSE_ORM_9122': this.extendedDirectOptionWarning,
        '409-SSE_ORM_9002': this.availabilityOptionWarning,
        '409-SSE_ORM_9007': this.availabilityOptionWarning,
        '409-SSE_ORM_9017': this.availabilityOptionWarning,
        '409-SSE_ORM_900702': this.availabilityOptionWarning
    };
}
BookingPassengerInfoErrorManager.$inject = ['$rootScope', 'BookingPassengerInfoService', 'BookingModalService', '$location', 'CommonsSessionStorageService', 'BookingAppConstants'];
try {
    const mod = angular.module('ib-booking-passenger-info-module');
    mod.service(
        'BookingPassengerInfoErrorManager',
        BookingPassengerInfoErrorManager
    );
} catch (error) {
    const mod = angular.module('ib-booking-passenger-info-module', []);
    mod.service(
        'BookingPassengerInfoErrorManager',
        BookingPassengerInfoErrorManager
    );
}
