import * as angular from 'angular';
import { MmBUtilService } from '@src/components/services/Utils/ib-MmB-utils';
import { FrequentFlyersCompaniesService } from '@src/components/services/ib-frequent-flyers-companies-service';
import { IUrlParams } from  '@src/components/ib-MmB-search/models/ib-MmB-search-model';
import { MmBDatalayerUtilsService } from '@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service';
import { LoadingSpinnerService } from '../../../app/shared/components/loading-spinner/loading-spinner.service';

@Service(
    'ib-MmB-search-module',
    ['MmBModalService', 'localStorageService', 'MmBUtilService', 'CommonsCheckLoginWCSService', 'IbCAuthTokenService', 'CommonsGetLoginInfoService', 'FrequentFlyersCompaniesService', '$location', 'BookingSearchService', 'MmBAppConstants', 'RedirectionService', '$filter', 'CommonsCommercialInfobyMarketService', 'CommonsLoginUtilsService', '$rootScope', 'CommonsUserUtilsService', '$cookies', 'MmBDatalayerUtilsService', 'LoadingSpinnerService', 'IbCCustomerDataService'],
    []
)
export class MmBSearchService {

    private params: IUrlParams;

    constructor (
        private MmBModalService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private MmBUtilService: MmBUtilService,
        private CommonsCheckLoginWCSService: CommonsCheckLoginWCSService,
        private IbCAuthTokenService: IbCAuthTokenService,
        private CommonsGetLoginInfoService: CommonsGetLoginInfoService,
        private FrequentFlyersCompaniesService: FrequentFlyersCompaniesService,
        private $location: angular.ILocationService,
        private BookingSearchService,
        private MmBAppConstants,
        private RedirectionService: RedirectionService,
        private $filter: ng.FilterFactory,
        private CommonsCommercialInfobyMarketService: CommonsCommercialInfobyMarketService,
        private CommonsLoginUtilsService: CommonsLoginUtilsService,
        private $rootScope: CommonsRootScope,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private $cookies: angular.cookies.ICookiesService,
        private MmBDatalayerUtilsService: MmBDatalayerUtilsService,
        private LoadingSpinnerService: LoadingSpinnerService,
        private IbCCustomerDataService,
    ) {}

    ////////////////
    initializeFlow = () => {
        const error = { message: 'REST_SERVICE_ERROR_GENERAL', needsTranslate: true };

        /**
        * This function  generate object with all deepLinks params and allow know if the flow is a deepLink.
        * In deeplink flow the user come from other company (AA,BA,AY) with special params in the url.
        * @returns void.
        */
        const isDeepLinkParams = () => {
            const deepLinkParams = {};
            const isDeepLinkFlow = (this.MmBUtilService.getURLFirstParameterByName(this.MmBAppConstants.URL_PARAMETERS.DEEP_LINK_SOURCE)
                && this.MmBUtilService.getURLFirstParameterByName(this.MmBAppConstants.URL_PARAMETERS.DEEP_LINK_CODE)
                && this.MmBUtilService.getURLFirstParameterByName(this.MmBAppConstants.URL_PARAMETERS.DEEP_LINK_RETURN_URL));

            if (isDeepLinkFlow) {
                deepLinkParams[this.MmBAppConstants.URL_PARAMETERS.DEEP_LINK_SOURCE] = this.MmBUtilService.getURLFirstParameterByName(this.MmBAppConstants.URL_PARAMETERS.DEEP_LINK_SOURCE);
                deepLinkParams[this.MmBAppConstants.URL_PARAMETERS.DEEP_LINK_CODE] = encodeURIComponent(this.MmBUtilService.getURLFirstParameterByName(this.MmBAppConstants.URL_PARAMETERS.DEEP_LINK_CODE));
                deepLinkParams[this.MmBAppConstants.URL_PARAMETERS.DEEP_LINK_RETURN_URL] = encodeURIComponent(this.MmBUtilService.getURLFirstParameterByName(this.MmBAppConstants.URL_PARAMETERS.DEEP_LINK_RETURN_URL));
                this.localStorageService.set('deepLinkParams', deepLinkParams);
            }
        };

        this.MmBModalService.finishWaiting();
        this.MmBDatalayerUtilsService.initializeDatalayer(this.$rootScope.appLang, this.$rootScope.appMarket, this.MmBUtilService.getDeviceType());
        if (this.localStorageService.isSupported) {
            this.params = this.getInitialParameters();
            this.localStorageService.remove('isStopOverFromMail');
            this.localStorageService.remove('voucherFromEmail');
            this.localStorageService.remove('flightChangeFromEmail');
            this.localStorageService.remove('newSisterCitiesModelData');
            this.localStorageService.remove('sisterCitiesRawModel');
            this.localStorageService.remove('voucherPriceInfo');
            if (!this.params.airshuttle || this.params.airshuttle.toLowerCase() !== 'false') {
                this.MmBUtilService.initStorage();
                this.localStorageService.set('channel', this.params.channel || '');
                this.localStorageService.set('isStopOverFromMail', this.params.isStopOver ? true : false);
                this.localStorageService.set('voucherFromEmail', this.params.voucherFromEmail ? true : false);
                this.localStorageService.set('flightChangeFromEmail', this.params.flightChangeFromEmail ? true : false);
                this.localStorageService.set('flowBob', this.params.flowBob ? true : false);
                if (this.MmBAppConstants.OPEN_JBA_LINK) {
                    isDeepLinkParams();
                }
                if (this.params.errorCode && this.getSSOErrorCodeMessage(this.params.errorCode)) {
                    this.onServiceError({
                        message: this.getSSOErrorCodeMessage(this.params.errorCode), internalErrorCode: this.params.errorCode,
                        errorCode: this.params.errorCode, needsTranslate: true
                    });
                }
                this.continueCheckinFlow();
            } else {
                if (this.params.errorCode) {
                    if (this.getSSOErrorCodeMessage(this.params.errorCode)) {
                        this.onServiceError({
                            message: this.getSSOErrorCodeMessage(this.params.errorCode), internalErrorCode: this.params.errorCode,
                            errorCode: this.params.errorCode, needsTranslate: true
                        });
                    }
                    this.continueCheckinFlow();
                } else {
                    this.MmBModalService.showWaitingModal();
                    this.MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
                }
            }
        } else {
            this.MmBModalService.showGenericError({
                title: { message: 'PRIVATE_BROWSER_DETECTED_TITLE', needsTranslate: true },
                needsTranslate: true,
                hideFooter: true,
                hideClose: true,
                message: 'PRIVATE_BROWSER_DETECTED_BODY'
            }, true).result.then(angular.noop, angular.noop);
        }
    };

    private getInitialParameters = (): IUrlParams => {
        const params = {
            pnr: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.LOCATOR, null),
            surname: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.SURNAME, null),
            market: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.MARKET, null),
            language: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.LANGUAGE, null),
            channel: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.CHANNEL, null),
            device: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.DEVICE, null),
            errorCode: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.ERROR_CODE, null),
            airshuttle: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.AIR_SHUTTLE, null),
            preorder: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.PREORDER, null),
            isStopOver: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.IS_STOPOVER, null),
            voucherFromEmail: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.VOUCHER_FROM_EMAIL, null),
            flightChangeFromEmail: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.FLIGHT_CHANGE_FROM_EMAIL, null),
            quadrigam: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.QUADRIGAM, null),
            seat: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.SEAT, null),
            baggage: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.BAGGAGE, null),
            speq: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.SPEQ, null),
            priority: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.PRIORITY, null),
            insurance: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.INSURANCE, null),
            bid: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.UPGRADING_BID, null),
            flowBob: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.FLOWBOB, null),
            flightId: this.MmBUtilService.getParameterByName(this.MmBAppConstants.URL_PARAMETERS.FLIGHT_ID, null),
        };

        if (params.quadrigam?.length > 0) {
            this.localStorageService.set('quadrigam', params.quadrigam);
        }

        const cleanParamsURL = (params.pnr?.length > 0 && params.surname?.length > 0);
        if (cleanParamsURL) {
            this.removeUrlParameters();
        }
        return params;
    };

    private continueCheckinFlow = () => {
        const cookiesInfo = this.CommonsCheckLoginWCSService.generateSSOInfo(true);
        if (cookiesInfo.isLogged && !this.localStorageService.get('deepLinkParams')) {
            const { pnr, surname, flightId, errorCode } = this.params;
            this.LoadingSpinnerService.show();
            this.localStorageService.set('userLogged', cookiesInfo.isLogged);
            this.$cookies.put('userLogged', cookiesInfo.isLogged);
            Promise.allSettled<any>([
                this.CommonsCommercialInfobyMarketService.getCommercialInfo(),
                this.CommonsGetLoginInfoService.checkCustomerStatus(true)
            ]).then((res) => {
                const commercialInfoData: PromiseSettledResult<CommonsCommercialData> = res[0];
                if(commercialInfoData.status === 'fulfilled') {
                    this.localStorageService.set('commercialInfo', commercialInfoData.value);
                }
                if(res[1].status === 'fulfilled') {
                    this.localStorageService.set('DetalleInicio', 'por IB plus');
                    if (this.isPnrSurnameAndNotErrorCode(pnr, surname, errorCode) || flightId) {
                        this.localStorageService.set('DetalleInicio', 'por localizador');
                        this.localStorageService.set('confirmationPNR', false);
                        this.BookingSearchService.searchFlightsPassengers(
                            flightId ? null : surname,
                            flightId ? null : pnr
                        ).then((bookingData) => {
                            this.BookingSearchService.retrieveOrderComplete(bookingData, this.params);
                        }, this.onServiceError);
                    } else {
                        let market = this.$rootScope.appMarket;
                        this.$rootScope.$broadcast('updateLoginModelEvent');
                        if (!this.CommonsUserUtilsService.isSoftUser() && !this.CommonsUserUtilsService.isUserLoggedONB()) {
                            this.checkCustomerData();
                            if (this.MmBAppConstants.NEWMMB_TRIPLIST_MARKETS.indexOf(market) !== -1) {
                                this.$location.path(this.MmBAppConstants.PAGES_URL.TRIP_LIST);
                            } else {
                                this.$location.path(this.MmBAppConstants.PAGES_URL.BOOKINGS_LIST);
                            }
                        } else {
                            this.LoadingSpinnerService.hide();
                        }
                    }
                } else {
                    this.LoadingSpinnerService.hide();
                    this.goAnonymous();
                }
            });
        } else {
            this.goAnonymous();
        }
    };

    private checkCustomerData(): void {
        const customerData = this.localStorageService.get('customerData');
            if (customerData) {
                this.MmBDatalayerUtilsService.updateLoggedDatalayer(customerData);
            } else {
                this.IbCCustomerDataService.getCustomerData().then((response) => {
                this.MmBDatalayerUtilsService.updateLoggedDatalayer(response);
        });
        }
    }

    private isPnrSurnameAndNotErrorCode = (pnr, surname, errorCode) => {
        return (pnr && surname && !errorCode);
    };

    private goAnonymous = () => {
        this.CommonsLoginUtilsService.updateStateToAnonymous();
        this.localStorageService.set('DetalleInicio', 'por localizador');
        const { pnr, surname, flightId, errorCode } = this.params;
        if (this.isPnrSurnameAndNotErrorCode(pnr, surname, errorCode) || flightId) {
            this.MmBModalService.showWaitingModal();
            this.localStorageService.set('confirmationPNR', false);
            this.IbCAuthTokenService.getAnonymousToken().then(() => {
                this.BookingSearchService.searchFlightsPassengers(
                    flightId ? null : surname,
                    flightId ? null : pnr
                ).then((bookingData) => {
                    this.BookingSearchService.retrieveOrderComplete(bookingData, this.params);
                    this.removeUrlParameters();
                }, this.onServiceError);
            }, this.onServiceError);
        } else {
            if (errorCode) {
                this.showOldWebError();
            }
            this.IbCAuthTokenService.getAnonymousToken().then(() => {
                this.FrequentFlyersCompaniesService.getFrequentFlyersCompaniesPromised().then(angular.noop, angular.noop);
            }, this.onServiceError);
            this.removeUrlParameters();
        }
    };

    private removeUrlParameters = () => {
        this.$location.search({});
    };

    private onServiceError = (error) => {
        const externalRedirect = this.localStorageService.get('externalRedirect');
        if (externalRedirect) {
            this.localStorageService.remove('externalRedirect');
            this.MmBModalService.finishWaiting();
            this.MmBModalService.showGenericError(error).result.then(() => {
                this.removeUrlParameters();
                this.RedirectionService.externalRedirect(this.$filter('LinksFilter')('CHECKIN_ONLINE_APP') + '?surname=' + this.params.surname + '&pnr=' + this.params.pnr);
            }, angular.noop);
        } else {
            this.MmBModalService.finishWaiting();
            this.MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
            this.removeUrlParameters();
        }
    };

    private showOldWebError = () => {
        if (this.MmBUtilService.getOldManageAppErrorMessage(this.params.errorCode)) {
            this.onServiceError({
                message: this.MmBUtilService.getOldManageAppErrorMessage(this.params.errorCode), internalErrorCode: this.params.errorCode,
                errorCode: this.params.errorCode, needsTranslate: true
            });
        } else if (!this.getSSOErrorCodeMessage(this.params.errorCode) && !this.MmBUtilService.getOldManageAppErrorMessage(this.params.errorCode)) {
            this.onServiceError({
                message: 'REST_SERVICE_ERROR_GENERAL', internalErrorCode: this.params.errorCode,
                errorCode: this.params.errorCode, needsTranslate: true
            });
        }
    };

    private getSSOErrorCodeMessage = (errorCode) => {
        const messages = {
            606: 'ERROR_SSO_606',
            302: 'ERROR_SSO_302',
            609: 'ERROR_SSO_609'
        };
        return messages[errorCode];
    };
}
