import { NotAvaibilityModel } from '@src/app/core/models/not-availability/not-availability-model';
import ng, * as angular from 'angular';
import dayjs from 'dayjs';
import { NotAvaibilityService } from '../services/ib-not-avaibility-service';
import { DatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service';
import { DigitalDataService } from '@shared/services/ib-datalayer/services/ib-digital-data.service';
import { DatalayerConstants } from '@shared/services/ib-datalayer/constants/ib-datalayer-constants';
import { BookingRedirectionService } from '@shared/services/ib-utils/ib-booking-redirection.service';
import { RouterPathsConstants } from '@core/constants/ib-booking-router-paths-constants';

@Component('ib-not-avaibility-module', 'ibNotAvailability', {
    controllerAs: 'NotAvaibilityCtlr',
    templateUrl: ['BookingAppConstants', ( bkiConstants: BookingAppConstants ): string => bkiConstants.templatesRoute + 'ib-not-avaibility-view.html']
},
[
    '$window',
    '$scope',
    '$document',
    'NotAvaibilityService',
    'NotAvaibilityTransformer',
    'CommonsModalService',
    'DatalayerUtilsService',
    'DigitalDataService',
    'localStorageService',
    '$rootScope',
    'BookingRedirectionService',
    '$filter',
    'BookingUtilService',
    'BookingAppConstants',
    '$location'
], [])

export class NotAvaibilityController implements ng.IController {
    public sending: boolean;
    public generalError: boolean;
    public generatedAlert: boolean;
    public searchRequest;
    public email: string;
    public letMeKnowRequest: NotAvaibilityModel.LetMeKnowRequest;
    public digitalData: object;
    public currentModel;

    constructor (
        private $window: ng.IWindowService,
        private $scope: any,
        private $document: ng.IDocumentService,
        private NotAvaibilityService: NotAvaibilityService,
        private NotAvaibilityTransformer: NotAvaibilityTransformer,
        private CommonsModalService: CommonsModalService,
        private DatalayerUtilsService: DatalayerUtilsService,
        private DigitalDataService: DigitalDataService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $rootScope,
        private BookingRedirectionService: BookingRedirectionService,
        private $filter,
        private BookingUtilService,
        private BookingAppConstants,
        private $location
    ) {
        this.digitalData = this.DigitalDataService.getDigitalData();
    }

    sendLetMeKnowAlert = (): void => {
        let element;
        this.sending = true;
        this.generalError = false;
        this.letMeKnowRequest = this.NotAvaibilityTransformer.generateRequest();
        this.DatalayerUtilsService.updateDatalayerWithEvents(DatalayerConstants.DATALAYER_VALUES.NOT_AVAIBILITY_ALERT, DatalayerConstants.DATALAYER_VALUES.LET_ME_KNOW_PAGE, DatalayerConstants.DATALAYER_VALUES.CLICK_ON_MAIL);
        this.DigitalDataService.emitEvent(DatalayerConstants.DATALAYER_EVENT_TYPES.LINK, this.digitalData);
        this.NotAvaibilityService.sendAlertLetMeKnow(this.letMeKnowRequest).then(
            (response:any) => {
                if (response.code === 200) {
                    this.sending = false;
                    this.generatedAlert = true;
                    this.DatalayerUtilsService.updateDatalayerWithEvents(DatalayerConstants.DATALAYER_VALUES.NOT_AVAIBILITY_ALERT, DatalayerConstants.DATALAYER_VALUES.LET_ME_KNOW_PAGE, DatalayerConstants.DATALAYER_VALUES.ALERT_EMAIL_OK);
                    this.DigitalDataService.emitEvent(DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW, this.digitalData);
                } else if (response.code === 408 || response.code === 412 || response.code === 502 || response.code === 504) {
                    this.sending = false;
                    if (this.$document[0]) {
                        element = this.$document[0].body;
                        element.style.overflow = 'hidden';
                    }
                    this.DatalayerUtilsService.updateDatalayerWithEvents(DatalayerConstants.DATALAYER_VALUES.NOT_AVAIBILITY_ALERT, DatalayerConstants.DATALAYER_VALUES.LET_ME_KNOW_PAGE, DatalayerConstants.DATALAYER_VALUES.ALERT_EMAIL_ERROR + ' ' + response.code);
                    this.DigitalDataService.emitEvent(DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW, this.digitalData);
                    this.CommonsModalService.showGenericDynamicModal(true, 'ib-not-avaibility-modal-error-soft-view.html', {}, 'NotAvaibilityModalErrorHardController').result.then(angular.noop, angular.noop);
                } else {
                    this.sending = false;
                    this.$scope.$emit('isFixedSearch', false);
                    if (this.$document[0]) {
                        element = this.$document[0].body;
                        element.style.overflow = 'hidden';
                    }
                    this.DatalayerUtilsService.updateDatalayerWithEvents(DatalayerConstants.DATALAYER_VALUES.NOT_AVAIBILITY_ALERT, DatalayerConstants.DATALAYER_VALUES.LET_ME_KNOW_PAGE, DatalayerConstants.DATALAYER_VALUES.ALERT_EMAIL_ERROR + ' ' + response.code);
                    this.DigitalDataService.emitEvent(DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW, this.digitalData);
                    this.CommonsModalService.showGenericDynamicModal(true, 'ib-not-avaibility-modal-error-hard-view.html', {}, 'NotAvaibilityModalErrorHardController').result.then(angular.noop, angular.noop);
                }
            },
            (error) => {
                this.sending = false;
                this.$scope.$emit('isFixedSearch', false);
                if (this.$document[0]) {
                    element = this.$document[0].body;
                    element.style.overflow = 'hidden';
                }
                this.DatalayerUtilsService.updateDatalayerWithEvents(DatalayerConstants.DATALAYER_VALUES.NOT_AVAIBILITY_ALERT, DatalayerConstants.DATALAYER_VALUES.LET_ME_KNOW_PAGE, DatalayerConstants.DATALAYER_VALUES.ALERT_EMAIL_ERROR + ' ' + error.code);
                this.DigitalDataService.emitEvent(DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW, this.digitalData);
                this.$scope.$emit('closeModalError');
                this.CommonsModalService.showGenericDynamicModal(true, 'ib-not-avaibility-modal-error-hard-view.html', {}, 'NotAvaibilityModalErrorHardController').result.then(angular.noop, angular.noop);
            }
        );
    };

    updateSendingState = (): void => {
        this.sending = false;
        this.generatedAlert = false;
    };

    close = (): void => {
        this.CommonsModalService.closeAllCurrentModals();
        if (this.$document[0]) {
            const element = this.$document[0].body;
            element.style.overflow = '';
        }
        this.CommonsModalService.closeAllCurrentModals();
    };

    activate = (): any => {
        this.$scope.$on('sending', this.updateSendingState);
        this.sending = false;
        this.generatedAlert = false;
        this.searchRequest = this.NotAvaibilityTransformer.generateRequest();
        this.getMailLocalStorage();
        this.letMeKnowRequest = <NotAvaibilityModel.LetMeKnowRequest>{};
        this.DatalayerUtilsService.updateDatalayerWithEvents(DatalayerConstants.DATALAYER_VALUES.NOT_AVAIBILITY_ALERT, DatalayerConstants.DATALAYER_VALUES.LET_ME_KNOW_PAGE, DatalayerConstants.DATALAYER_VALUES.PRINTS);
        this.DigitalDataService.emitEvent(DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW, this.digitalData);
    };


    getCurrentURL = () => {
        const currentUrl = new URL(this.$location.absUrl());

        currentUrl.searchParams.delete('pagoAvios');
        currentUrl.hash = currentUrl.hash.replace(RouterPathsConstants.ibAviosAlert, RouterPathsConstants.availability);

        this.BookingRedirectionService.externalRedirect(currentUrl.toString());
    };

    goToBooking = () => {
        let currentModel:any = this.localStorageService.get('bookingUrlParams');

        let params = '', auxDate, redemptionBookingUrl, fromMarket = '', fromLanguage = '',
            market = this.$rootScope.appMarket, language = this.$rootScope.appLang;
        params += this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.LANGUAGE + '=' + language + '&' + this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.MARKET +
            '=' + market;
        params += '&' + this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.TRIP_TYPE[1] + '=' + (currentModel.tripType === this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.ROUND_TRIP ? 2 : 1);
        params += '&' + this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.ORIGIN[1] + '=' + (this.searchRequest.departureAirport ? this.searchRequest.departureAirport : currentModel.departure)  + '&' + this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.DESTINATION[1] + '=' + (this.searchRequest.arrivalAirport? this.searchRequest.arrivalAirport : this.searchRequest.arrivalAirport);
        params += '&' + 'nombreOrigen' + '=' + (this.searchRequest.departure ? this.searchRequest.departure : currentModel.departure)  + '&' + 'nombreDestino' + '=' + (this.searchRequest.arrivalArrival? this.searchRequest.arrival : this.searchRequest.arrival);

        auxDate = dayjs(this.searchRequest.departureDate);
        params += '&' + this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.DEPARTURE_DATE[1] + '=' + auxDate.format('DD') + '&' + this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.DEPARTURE_DATE[2] + '=' + auxDate.format('YYYYMM') +
            '&' + this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.DEPARTURE_DATE[3] + '=' + auxDate.format('YYYY');
        if (currentModel.tripType === this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.ROUND_TRIP) {
            auxDate = dayjs(this.searchRequest.returnDate);
            params += '&' + this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.INBOUND_DATE[1] + '=' + auxDate.format('DD') + '&' + this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.INBOUND_DATE[2] + '=' + auxDate.format('YYYYMM') +
                '&' + this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.INBOUND_DATE[3] + '=' + auxDate.format('YYYY');
        }
        params += '&' + this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.ADULT[1] + '=' + (currentModel.adult === null ? 0 : currentModel.adult);
        params += '&' + this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.CHILD[1] + '=' + (currentModel.child === null ? 0 : currentModel.child);
        params += '&' + this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.INFANT[1] + '=' + (currentModel.infant === null ? 0 : currentModel.infant);      // if (tripItemInfo.AviosPay !== 'false' ) {
        //     params += '&' + this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.AVIOS_PAY + '=' + (tripItemInfo.AviosPay ? tripItemInfo.AviosPay : 'true');
        // }
        if (fromMarket.length > 0) {
            params += '&' + this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.MARKET_FROM + '=' + fromMarket;
        }
        if (fromLanguage.length > 0) {
            params += '&' + this.BookingAppConstants.REDEMPTION_PARAMS_NAMES.LANGUAGE_FROM + '=' + fromLanguage;
        }
        redemptionBookingUrl = this.$filter('LinksFilter')('flights/') + '?' + params;
    };

    getMailLocalStorage = () => {
        const customerData: any = this.localStorageService.get('customerData');
        this.email = customerData.personalInfo.contactEmail;
    };

    redirectToNewRedemptionSearchEngine = (): void => {
        let redemptionSearchEngineUrl;
        //redemptionSearchEngineUrl = this.$filter('LinksFilter')('IBERIA_NEW_REDEMPTION_SEARCH_ENGINE', this.$rootScope.appLang );
        //this.BookingRedirectionService.externalRedirect(redemptionSearchEngineUrl); //deleted second parameter 'false'
        redemptionSearchEngineUrl = this.$window.location.origin + '/?market=' + this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.MARKET[1]) + '&language=' + this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.LANGUAGE[1]) + '&flexible=' + this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.FLEXIBLE_DATES[1]) + '&TRIP_TYPE=' + this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.TRIP_TYPE[1]) + '&BEGIN_CITY_01=' + this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_CITY[0]) + '&END_CITY_01=' + this.BookingUtilService.getURLFirstParameterByName(this.BookingAppConstants.BOOKING_PARAMS_NAMES.END_CITY[0]);
        this.BookingRedirectionService.externalRedirect(redemptionSearchEngineUrl); //deleted second parameter 'false'

    };

    goRedemptionSearchEnginePage () {
        this.BookingRedirectionService.externalRedirect(this.$filter('LinksFilter')('IBERIA_NEW_REDEMPTION_SEARCH_ENGINE'));
    }

    redirectToIberiaPurchaseFlightsAvios = (): void => {
        this.BookingRedirectionService.externalRedirect(this.$filter('LinksFilter')('IBERIA_PURCHASE_FLIGHTS_AVIOS'));
    };

    $onInit = this.activate();
}
