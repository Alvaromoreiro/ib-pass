import * as angular from 'angular';
import dayjs from 'dayjs';
import { MonetateUtilsService } from 'ib-web-commons/app/core/ib-monetate/services/ib-monetate-utils';
import { CommonsUtilService } from 'ib-web-commons/app/core/utils/ib-commons-utils-service';
import { DigitalDataService } from 'ib-web-commons/app/core/ib-datalayer/services/ib-digital-data-service';
import { IbPmtConfirmationCarbonFootprintModel } from 'src/components/ib-payments/cmpnts/ib-pmt-confirmation/cmpnts/ib-pmt-confirmation-carbon-footprint/ib-pmt-confirmation-carbon-footprint-model';
import { CommonsCookiesService } from 'ib-web-commons/app/core/utils/storage-utils/ib-commons-cookies.service';
import { ibMarketingPermissionService } from 'src/components/ib-payments/cmpnts/ib-pmt-reusable/ib-modal/services/ib-marketing-permission-service';
import { SeatBoostResponse } from '../cmpnts/ib-seatboost-banner/model/seatboost.interface';
import { CommonsBrowserStorageService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { ibPmtWithStylesHost } from '../../../../../styles/ib-pmt-styles-host';

const componentOptions: ng.IComponentOptions = {
    bindings: {
        asComponent: '<'
    },
    controller: ibPmtWithStylesHost('CheckInConfirmationController'),
    controllerAs: 'confirmationCtrl',
    templateUrl: ['$rootScope', function ($rootScope) {
        return $rootScope.routes.templates + 'ib-check-in-confirmation.html';
    }]
};

const controllerInfo = {
    module: 'ib-check-in-confirmation-module',
    selector: 'ibCheckInConfirmation',
    controllerName: 'CheckInConfirmationController',
    inject: ['$rootScope', '$scope', 'ConfirmationService', 'DatalayerUtilsService', 'PmtDatalayerConstants', 'PmtConstants', 'CheckinConfirmationModel', 'localStorageService', '$window', 'deviceDetector', '$location',
        '$timeout', 'SearchFlightsPassengersService', 'CloseSessionService', 'PmtGetCachedInformationService', 'MonetateUtilsService', 'pmtRedirectionService', 'PmtModalService', 'PmtUtilsService', '$filter', 'CommonsUtilService',
        'PmtUtilsTransformers', 'DatalayerConstants', '$interval', 'DatalayerGeneralConstants', 'DigitalDataService', 'DatalayerEcommerceUtilsService', '$compile', '$sce', '$document', 'CommonsSessionStorageService',
        'CommonsUserUtilsService', 'CommonsCookiesService', 'ibMarketingPermissionService', 'CommonsAncillariesService', 'CommonsBrowserStorageService'],
    required: []
};

export class checkInConfirmationController implements ng.IController {

    seetboostInfo:{show:boolean, urlRedirection:string};
    private model;
    private isDigitalBoarding = false;
    private urlMMB = '';
    private reactWitgetModel;
    private transferWitgetModel;
    private listLocationWitget;
    private tokenWidget;
    private showMoreInfo;
    private recoglobickCki: boolean = true;
    private pickUpLocation;
    private locationForGlobickWidget: string = '';
    private arrivaleDateForGlobickTransfer: string = '';
    private departureDateForGlobickTransfer: string = '';
    private departureAirlineForGlobickTransfer: string = '';
    private departureFlightNumberForGlobickTransfer: string = '';
    public recoglobickActivitiesCKI: boolean = false;
    public recoglobickTransferCKI: boolean;
    flightAviosInfo = this.localStorageService.get('flightAviosInfo');
    private inhibitStorage = null;
    private inhibitBC = {
        showPassengers: false,
        ALERT: {
            status: false,
            code: '',
            TEXT: '',
            TITLE: '',
            icon: ''
        }
    };
    private ibPayTrace;
    private urlbob;
    private insuranceLink;
    private showInsuranceBanner;
    private lang;
    private holaMadridFlow: boolean = true;
    private showCarbonFootprintBanner: boolean;
    private co2InfoBannerModel: IbPmtConfirmationCarbonFootprintModel;
    private showItemAlert = false;
    private biometricStatusPassengers;
    private showBiometricSummaryModule: string;
    private allianzFusionContractNumber:string = '';
    private isGlobickActivities:any = this.CommonsSessionStorageService.get('isGlobickActivities') ?? null;
    passengersEsta: any[] = [];
    keyApisEsta: string = 'APIS_CONFIRMATION_ALERT_BODY_2DE2';
    isCC: boolean = false;
    isBpSubscriptionMode: boolean = false;
    private footerPropsBySegment: {
        [segmentId: string]: CheckinConfirmationModel.TFooterProps;
    } = {};

    constructor (
        private $rootScope: CommonsRootScope,
        private $scope: angular.IScope,
        private ConfirmationService,
        private DatalayerUtilsService: DatalayerUtilsService,
        private PmtDatalayerConstants,
        private PmtConstants: PmtConstants,
        private CheckinConfirmationModel,
        private localStorageService,
        private $window: ng.IWindowService,
        private deviceDetector,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
        private SearchFlightsPassengersService,
        private CloseSessionService,
        private PmtGetCachedInformationService,
        private MonetateUtilsService: MonetateUtilsService,
        private pmtRedirectionService,
        private PmtModalService,
        private PmtUtilsService,
        private $filter: angular.FilterFactory,
        private CommonsUtilService: CommonsUtilService,
        private PmtUtilsTransformers,
        private DatalayerConstants,
        private $interval,
        private DatalayerGeneralConstants: DatalayerGeneralConstantsType,
        private DigitalDataService: DigitalDataService,
        private DatalayerEcommerceUtilsService,
        private $compile,
        private $sce,
        private $document,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private CommonsCookiesService: CommonsCookiesService,
        private ibMarketingPermissionService: ibMarketingPermissionService,
        private CommonsAncillariesService,
        private CommonsBrowserStorageService: CommonsBrowserStorageService
    ) {

        this.$scope.$on('anonymousSubmit', (event, data) => {
            this.initBooking(data.surname, data.pnr);
        });
        this.$scope.$on('openGenericModal',
            (event, size, tpl, anim) => {
                this.openGenericModal(size, tpl, anim);
            });
        this.model = this.CheckinConfirmationModel;
        // TEST IF GLOBICK TRANSFERS IS HIRED ON ANCILLARIES
        const headerModel: any = this.CommonsSessionStorageService.get('headerModel');
        let globickData = headerModel.headerModel.shoppingBasket.globickTransfers.hasTransfersGlobick;
        this.recoglobickTransferCKI = globickData ? false : true;
    }

    openSeatboostInfo (): void {
        const windowWidth = this.$window.innerWidth;
        if (windowWidth <= 480) {
            this.$window.open(this.PmtConstants.SEATBOOST_BANNER_URL.MOBILE, '_blank');
        } else {
            this.$window.open(this.PmtConstants.SEATBOOST_BANNER_URL.DESKTOP, '_blank');
        }
    }


    getEnvUrlToGetWidgetCode = () => {
        let env: string = '';
        const envCopy: any = {};
        (<any>Object).assign(envCopy, (<any>window).env);
        return envCopy.urlEnvironment;

    };
    completeTransferFlow = (): void => {
        const widgetVersion = '2.2.3';
        const baseUrl = this.getEnvUrlToGetWidgetCode();
        const urlTransfers = baseUrl + 'iberia-web-content/build-recoglobick-transfers/' + widgetVersion;

        const scriptTransferVendor = urlTransfers + '/static/js/2.vendor.chunk.js';
        const scriptTransferMain = urlTransfers + '/static/js/main.chunk.js';
        const scriptTransferRunTime = urlTransfers + '/static/js/runtime-main.js';
        const cssTransfersMain = urlTransfers + '/static/css/main.chunk.css';

        angular.element('script[src="' + scriptTransferVendor + '"]').remove();
        angular.element('script[src="' + scriptTransferMain + '"]').remove();
        angular.element('script[src="' + scriptTransferRunTime + '"]').remove();
        angular.element('link[href="' + cssTransfersMain + '"]').remove();

        this.$window.RecoglobickTransfersWidget.unmount();

    };
    loadWidgetsScripts = () => {
        let scriptActivitiesVendor, scriptActivitiesMain, scriptActivitiesRunTime, cssActivitiesVendor, cssActivitiesMain, urlActivities, baseUrl, widgetActivitiesVersion, widgetTransfersVersion;
        let scriptTransferVendor, scriptTransferMain, scriptTransferRunTime, cssTransfersMain, urlTransfers;


        widgetActivitiesVersion = '2.2.4';
        widgetTransfersVersion = '2.1.3';
        baseUrl = this.getEnvUrlToGetWidgetCode();
        urlActivities = baseUrl + 'iberia-web-content/build-recoglobick-activities/' + widgetActivitiesVersion;
        urlTransfers = baseUrl + 'iberia-web-content/build-recoglobick-transfers/' + widgetTransfersVersion;

        //activities
        scriptActivitiesVendor = '<script type="text/javascript" src="' + this.$sce.trustAsResourceUrl(urlActivities + '/static/js/2.vendor.chunk.js') + '"</script>';
        scriptActivitiesMain = '<script type="text/javascript" src="' + this.$sce.trustAsResourceUrl(urlActivities + '/static/js/main.chunk.js') + '"</script>';
        scriptActivitiesRunTime = '<script type="text/javascript" src="' + this.$sce.trustAsResourceUrl(urlActivities + '/static/js/runtime-main.js') + '"</script>';
        cssActivitiesVendor = '<link rel="stylesheet" href="' + this.$sce.trustAsResourceUrl(urlActivities + '/static/css/2.vendor.chunk.css') + '">';
        cssActivitiesMain = '<link rel="stylesheet" href="' + this.$sce.trustAsResourceUrl(urlActivities + '/static/css/main.chunk.css') + '">';
        angular.element(this.$document).find('body').prepend(this.$compile(scriptActivitiesVendor)(this.$scope));
        angular.element(this.$document).find('body').prepend(this.$compile(scriptActivitiesMain)(this.$scope));
        angular.element(this.$document).find('body').prepend(this.$compile(scriptActivitiesRunTime)(this.$scope));

        angular.element(this.$document).find('body').prepend(this.$compile(cssActivitiesVendor)(this.$scope));
        angular.element(this.$document).find('body').prepend(this.$compile(cssActivitiesMain)(this.$scope));


        //transfers
        scriptTransferVendor = '<script type="text/javascript" src="' + this.$sce.trustAsResourceUrl(urlTransfers + '/static/js/2.vendor.chunk.js') + '"</script>';
        scriptTransferMain = '<script type="text/javascript" src="' + this.$sce.trustAsResourceUrl(urlTransfers + '/static/js/main.chunk.js') + '"</script>';
        scriptTransferRunTime = '<script type="text/javascript" src="' + this.$sce.trustAsResourceUrl(urlTransfers + '/static/js/runtime-main.js') + '"</script>';
        cssTransfersMain = '<link rel="stylesheet" href="' + this.$sce.trustAsResourceUrl(urlTransfers + '/static/css/main.chunk.css') + '">';
        angular.element(this.$document).find('body').prepend(this.$compile(scriptTransferVendor)(this.$scope));
        angular.element(this.$document).find('body').prepend(this.$compile(scriptTransferMain)(this.$scope));
        angular.element(this.$document).find('body').prepend(this.$compile(scriptTransferRunTime)(this.$scope));

        angular.element(this.$document).find('body').prepend(this.$compile(cssTransfersMain)(this.$scope));
    };

    $onInit (): void {
        const confirmationInfo = this.localStorageService.get('confirmationInfo');
        const infoDigitalBoarding = this.localStorageService.get('digitalBoardingInfo') || null;
        infoDigitalBoarding ? this.isDigitalBoarding = true : this.isDigitalBoarding = false;
        this.ibPayTrace = this.localStorageService.get('ibPayTrace');
        this.urlbob = this.localStorageService.get('ancillariesBob');
        this.insuranceLink = 'https://iberia.allianz-assistance.com/';
        this.showInsuranceBanner = (this.$rootScope.appMarket === 'ES');
        this.$rootScope.showMainHeader = true;
        this.$rootScope.$broadcast('changeStatusBasket', false);
        this.localStorageService.set('confirmationPNR', true);
        this.PmtModalService.showWaitingModal('ib-modal-loading-plane-pmt', 'ib-modals ib-modals--transparent', true);
        this.localStorageService.set('nextStepAllowed', false);
        this.model.confirmInfo.bookingHotelsInfo = this.getBookingHotelsInfo(confirmationInfo);
        this.showBiometricSummaryModule = this.localStorageService.get('showBiometricSummaryModule');
        this.biometricStatusPassengers = this.localStorageService.get('biometricStatusPassengers');
        this.$timeout(() => {
            this.CommonsUtilService.setTitlePage('CKI_TITLE_PAGE_IBCKICF');
            this.checkMarketingPermission();
        }, 1600);
        const isInhibitBoardingCard = this.initInhibitionBoardingCard();
        this.ConfirmationService.searchConfirmationInfo(isInhibitBoardingCard).then(this.searchConfirmationInfoSuccess);
        this.getApisPassengerEsta();
        this.isHolaMadridFlow();
        this.isBpSubscriptionMode = this.localStorageService.get('bookingInfo')?.subscriptionEnabled || false;

        this.ConfirmationService.showBanner()
            .then((response:SeatBoostResponse) => {
                this.seetboostInfo ={
                    show:response.showBanner,
                    urlRedirection:response.encryptedDeeplink
                };
            })
            .catch(() => {
                this.seetboostInfo ={
                    show:false,
                    urlRedirection:''
                };
            });
    }

    searchConfirmationInfoSuccess = (data) => {
        this.model.confirmInfo = data.confirmInfo;
        this.model.insuranceInfo = data.insurance;
        this.model.warningInfo = data.warnings;
        this.model.rightPanelInfo = data.rightPanelInfo;
        this.model.rentCarInfo = data.rentCarInfo;
        this.model.co2Info = data.co2Info;
        this.model.carbonFootprint = data.carbonFootprint;
        this.lang = data.lang;
        this.model.isOpen = false;
        this.showMoreInfo = this.showMoreInfoBool();
        this.model.biometricBoardingAssociation = this.localStorageService.get('biometricBoardingAssociation');
        this.model.acceptBiometric = angular.isDefined(this.model.biometricBoardingAssociation);
        this.model.showBiometric = this.localStorageService.get('showBiometric');

        this.listLocationWitget = this.generateListWidget();
        this.$timeout(() => {
            this.recoglobickCki = true;
            this.initRecommendAppWidget();
            this.initTransferWidget();
        }, 1000);

        this.localStorageService.set('confirmationInfo', this.model.confirmInfo);
        this.PmtModalService.finishWaiting();
        this.initAnalytics();
        this.showInfoInhibitPassengers();
        this.displayCarbonFootprintBanner();
        let issueOrderInfo:any = this.CommonsSessionStorageService.get('issueOrderInfo');
        if (issueOrderInfo) {
            angular.forEach(issueOrderInfo.issuedItems, (item) => {
                if (item?.type === 'ALLIANZ_FUSION') {
                    this.allianzFusionContractNumber = item.contractNumber;
                }
            });
        }
        this.initializeFooterProps();
    };

    isHolaMadridFlow = (): void => {
        const sumInfo: any = this.localStorageService.get('summaryInfo');
        sumInfo?.context?.segments?.forEach((segment: any) => {
            this.holaMadridFlow = segment.passengerCoupons.find((coupon: any) => coupon.ticketDesignator === 'HM') !== undefined;
        });
    };

    displayCarbonFootprintBanner = () => {
        this.co2InfoBannerModel = {
            name: this.model.confirmInfo.boardingCards[0].passengers[0].name,
            kilosCo2eFormatted: this.model.co2Info?.kilosCo2EquivalentFormatted,
            priceFormatted: this.model.co2Info?.priceFormatted,
            flight: {
                numPax: this.model.confirmInfo.boardingCards[0].passengers.length,
                segments: this.model.confirmInfo.boardingCards.map(card => {
                    return {
                        from: card.departure.airport.code,
                        to: card.arrival.airport.code,
                        cabin: card.cabinClass
                    };
                })
            }
        };
        const summaryInfo = this.localStorageService.get('summaryInfo');
        this.showCarbonFootprintBanner = Boolean(!this.model.carbonFootprint?.hasCarbonFootprint &&
            !summaryInfo?.issuedItems?.some(item => item.type === this.PmtConstants.ANCILLARIES_TYPES.CO2_FOOTPRINT && item.orderId) &&
            this.model.co2Info);
    };

    expiredTokenCallbackTransfer = () => {
        this.initTransferWidget();
    };

    checkIsPro = () => {
        let env: string = '';
        const widgetProMonetate = this.localStorageService.get('widgetProMonetate');
        const envCopy: any = {};
        (<any>Object).assign(envCopy, (<any>window).env);
        if (envCopy.production || widgetProMonetate) {
            env = 'prod';
        } else {
            env = 'test';
        }

        return env;
    };

    generateTransferWitgetModel = () => {
        let transferWitgetModel: any = {};
        const summaryInfo = this.localStorageService.get('summaryInfo');

        if (summaryInfo?.context) {
            this.localStorageService.set('clientBookingId', this.model.confirmInfo.locator + '-' + this.localStorageService.get('summaryInfo').context.bookingDate.split(' ')[0].replaceAll('-', ''));
        }

        const generate = () => {
            return this.CommonsUtilService.sha256(this.localStorageService.get('clientBookingId')).then((hash) => {
                transferWitgetModel = {
                    env: this.checkIsPro(),
                    token: 'Bearer' + ' ' + this.tokenWidget,
                    clientBookingId: hash,
                    pickupLocation: this.locationForGlobickWidget,
                    outboundTripDateTime: this.arrivaleDateForGlobickTransfer.replaceAll(' ', 'T'),
                    airline: summaryInfo.context.segments[0].marketingFlight ? summaryInfo.context.segments[0].marketingFlight.cabin.carrier : summaryInfo.context.segments[0].operatingFlight.cabin.carrier,
                    flightNumber: summaryInfo.context.segments[0].marketingFlight ? summaryInfo.context.segments[0].marketingFlight.flightNumber : summaryInfo.context.segments[0].operatingFlight.flightNumber,
                    returnTripDateTime: null,
                    returnAirline: null,
                    returnFlightNumber: null,
                    language: this.generateLanguage(),
                    currency: this.getCurrency(),
                    currencyExchange: null,
                    travellers: this.generateTravellers(),
                    expiredTokenCallback: this.expiredTokenCallbackTransfer,
                    getTransferSearchCallback: null,
                    postOrderCallback: null,
                    confirmOrderCallback: this.ConfirmationService.confirmTransferOrderCallback,
                    mountLocation: this.generateMountLocation()
                };
                if (summaryInfo.context.slices.length === 2) {
                    transferWitgetModel.returnTripDateTime = this.departureDateForGlobickTransfer.replaceAll(' ', 'T');
                    transferWitgetModel.returnAirline = this.departureAirlineForGlobickTransfer;
                    transferWitgetModel.returnFlightNumber = this.departureFlightNumberForGlobickTransfer;
                }
                this.localStorageService.set('clientBookingIdTransfer', hash);
                return transferWitgetModel;
            });
        };


        return generate().then((transferWitgetModel) => {
            return transferWitgetModel;
        });
    };

    checkIfMultiFlight = () => {
        const summaryInfo = this.localStorageService.get('summaryInfo');
        let isMultiFlight = false, slice1, slice2, firstSegmentSlice1, lastSegmentSlice1, firstSegmentSlice2, lastSegmentSlice2;

        if (summaryInfo?.context?.slices?.length >= 3) {
            isMultiFlight = true;
        } else if (summaryInfo?.context?.slices?.length === 2) {
            slice1 = summaryInfo.context.slices[0];
            slice2 = summaryInfo.context.slices[1];

            firstSegmentSlice1 = summaryInfo.context.segments[0];
            lastSegmentSlice1 = summaryInfo.context.segments[slice1.segmentIds.length - 1];

            firstSegmentSlice2 = summaryInfo.context.segments[slice1.segmentIds.length];
            lastSegmentSlice2 = summaryInfo.context.segments[summaryInfo.context.segments.length - 1];

            if ((firstSegmentSlice1.departureAirport === lastSegmentSlice2.arrivalAirport) && (firstSegmentSlice2.departureAirport === lastSegmentSlice1.arrivalAirport)) {
                isMultiFlight = false;
                this.locationForGlobickWidget = lastSegmentSlice1.arrivalAirport;
                this.arrivaleDateForGlobickTransfer = lastSegmentSlice1.arrivalDate;
                this.departureDateForGlobickTransfer = firstSegmentSlice2.departureDate;
                this.departureAirlineForGlobickTransfer = firstSegmentSlice2.marketingFlight ? firstSegmentSlice2.marketingFlight.cabin.carrier : firstSegmentSlice2.operatingFlight.cabin.carrier;
                this.departureFlightNumberForGlobickTransfer = firstSegmentSlice2.marketingFlight ? firstSegmentSlice2.marketingFlight.flightNumber : firstSegmentSlice2.operatingFlight.flightNumber;

            } else if ((firstSegmentSlice1.departureAirport !== lastSegmentSlice2.arrivalAirport) && (firstSegmentSlice2.departureAirport !== lastSegmentSlice1.arrivalAirport)) {
                isMultiFlight = false;
                slice1 = summaryInfo.context.slices[0];
                lastSegmentSlice1 = summaryInfo.context.segments[slice1.segmentIds.length - 1];
                this.locationForGlobickWidget = lastSegmentSlice1.arrivalAirport;
                this.arrivaleDateForGlobickTransfer = lastSegmentSlice1.arrivalDate;
            } else {
                isMultiFlight = true;
            }
        } else if (summaryInfo?.context?.slices?.length === 1 || summaryInfo?.context?.slices?.length === 2) {
            isMultiFlight = false;
            slice1 = summaryInfo.context.slices[0];
            lastSegmentSlice1 = summaryInfo.context.segments[slice1.segmentIds.length - 1];
            this.locationForGlobickWidget = lastSegmentSlice1.arrivalAirport;
            this.arrivaleDateForGlobickTransfer = lastSegmentSlice1.arrivalDate;
        }
        return isMultiFlight;
    };

    initTransferWidget = () => {
        if (this.checkShowWidget(true) && this.recoglobickTransferCKI) {
            this.recoglobickTransferCKI = true;
        } else {
            this.recoglobickTransferCKI = false;
        }
    };

    generateListWidget = () => {
        const list = this.PmtConstants.allowCitiesWinget;
        return list;
    };

    getTokenWidget = () => {
        this.ConfirmationService.getTokenWidget().then((response) => {
            this.tokenWidget = response.data.access_token;
            this.generateReactWidgetModel().then((reactWidget) => {
                this.$window?.RecoglobickActivitiesWidget?.unmount();
                this.DatalayerUtilsService.updateDatalayerEvents('confirmationWidgetActivitiesCKI', 'view', this.localStorageService.get('PNR') + '_' + reactWidget.clientBookingId);
                this.$window?.RecoglobickActivitiesWidget?.mount(reactWidget);
                this.recoglobickActivitiesCKI = true;
            });
        });
    };
    postOrderCallback = () => { };
    getRecommendationCallback = () => { };

    checkWithChildren = () => {
        let withChildren = false;

        this.model.confirmInfo.boardingCards[0].passengers.forEach(passenger => {
            if (passenger.type === 'CHILD' || passenger.type === 'INFANT') {
                withChildren = true;
            }
        });

        return withChildren;
    };
    generateLanguage = () => {
        const confirmationDatalayerInfo = this.localStorageService.get('confirmationDatalayerInfo');
        let languageAndMarket;
        if (confirmationDatalayerInfo.idioma === 'es') {
            languageAndMarket = confirmationDatalayerInfo.idioma + '-' + 'ES';
        } else if (confirmationDatalayerInfo.idioma === 'en') {
            languageAndMarket = confirmationDatalayerInfo.idioma + '-' + 'US';
        } else if (confirmationDatalayerInfo.idioma === 'zh') {
            languageAndMarket = confirmationDatalayerInfo.idioma + '-' + 'CN';
        }


        return languageAndMarket;
    };
    generateMountLocation = () => {
        let flowName = this.$rootScope.flowName;
        let flowNameReturned;
        if (flowName === 'BKI' || flowName === 'CKI' || flowName === 'MMB') {
            flowNameReturned = flowName;
        } else {
            flowNameReturned = '';
        }
        return flowNameReturned;
    };
    getCurrency = () => {
        const summaryInfo = this.localStorageService.get('summaryInfo');
        let currency;
        if (summaryInfo) {
            currency = summaryInfo.currencies[0].code;

        }
        return currency;
    };
    checkBusinessTrip = () => {
        const UserLogged = this.localStorageService.get('userLogged');
        let isBusinessTrip = false;

        if (UserLogged === 'ONB') {
            isBusinessTrip = true;
        }

        return isBusinessTrip;
    };

    generateTravellers = () => {
        const bookingInfo = this.localStorageService.get('bookingInfo');
        const listTravellers = [];
        let travellerTemp = {};


        Object.keys(bookingInfo.passengers).forEach(key => {
            travellerTemp = {};

            travellerTemp = {
                name: bookingInfo.passengers[key].name,
                surname: bookingInfo.passengers[key].surname,
                email: '',
                dob: '',
                address: '',
                country: '',
                countryPhoneCode: '',
                phone: '',
                countryMobileCode: '',
                mobile: '',
                language: '',
                nationality: '',
                passport: '',
                expenditureDate: '',
                expirationDate: '',
                zipCode: '',
                pickupLocation: ''
            };
            listTravellers.push(travellerTemp);
        });
        return listTravellers;
    };

    expiredTokenCallback = () => {
        this.getTokenWidget();
    };

    generateReactWidgetModel = () => {
        let widgetModel: any = {};

        const summaryInfo = this.localStorageService.get('summaryInfo');
        if (summaryInfo?.context) {
            this.localStorageService.set('clientBookingId', this.model.confirmInfo.locator + '-' + this.localStorageService.get('summaryInfo').context.bookingDate.split(' ')[0].replaceAll('-', ''));
        }

        const generate = () => {
            return this.CommonsUtilService.sha256(this.localStorageService.get('clientBookingId')).then((hash) => {
                widgetModel = {
                    env: this.checkIsPro(),
                    token: 'Bearer' + ' ' + this.tokenWidget,
                    clientBookingId: hash,
                    startDate: this.arrivaleDateForGlobickTransfer.split(' ')[0],
                    endDate: null,
                    location: this.ConfirmationService.locationForWidget(this.locationForGlobickWidget),
                    totalTickets: summaryInfo.context.passengers.length,
                    businessTrip: this.checkBusinessTrip(),
                    withChildren: this.checkWithChildren(),
                    ages: null,
                    language: this.generateLanguage(),
                    currency: this.getCurrency(),
                    currencyExchange: null,
                    gaTrackingCode: 'test',
                    travellers: this.generateTravellers(),
                    postOrderCallback: this.postOrderCallback,
                    getRecommendationCallback: this.getRecommendationCallback,
                    expiredTokenCallback: this.expiredTokenCallback,
                    confirmOrderCallback: this.ConfirmationService.confirmOrderCallback
                };
                if (summaryInfo.context.slices.length === 2) {
                    widgetModel.endDate = this.departureDateForGlobickTransfer.split(' ')[0];
                }
                this.localStorageService.set('clientBookingIdActivities', hash);
                return widgetModel;
            });
        };

        return generate().then(() => {
            return widgetModel;
        });
    };


    checkShowWidget = (showExperiences: boolean) => {
        let showWidget = false, diffDays, currency;
        const confirmationDatalayerInfo = this.localStorageService.get('confirmationDatalayerInfo'), flowApp = this.localStorageService.get('flowApp');
        const language = confirmationDatalayerInfo.idioma, todayDate: any = new Date(), diffTime = todayDate.getTime();
        const summaryInfo: any = this.localStorageService.get('summaryInfo');

        if (summaryInfo) {
            const bookingDate = summaryInfo.context.bookingDate;
            const numberbookingDate = Date.parse(bookingDate);
            const datenumberDate = diffTime - numberbookingDate;
            diffDays = Math.round(datenumberDate / (1000 * 60 * 60));
            currency = summaryInfo.currencies[0].code;
        }

        if(flowApp === 'CKI' && !this.checkIfMultiFlight() && this.listLocationWitget.includes(this.ConfirmationService.locationForWidget(this.locationForGlobickWidget)) && currency === 'EUR' &&
        (language === 'es' || language === 'en' || language === 'zh') && showExperiences) {
            showWidget = true;
        }

        return showWidget;
    };
    initRecommendAppWidget = () => {
        if (this.isGlobickActivities) {
            this.recoglobickActivitiesCKI = true;
        } else {
            this.recoglobickCki = false;
        }
    };
    ////////////////
    //#########################################widget end#############################################

    registerGlobickClick (): void {
        this.CommonsAncillariesService.registerClickGlobickProduct('EXP');
        this.redirectToMMB();
    }


    /**
     * Redirect to MMB
     */
    redirectToMMB = () => {
        let url = this.$filter('LinksFilter')('MANAGE_MY_BOOKING_LOGGED_LINK', this.$rootScope.appLang) + '?pnr=' + this.localStorageService.get('PNR') +
        '&surname=' + this.localStorageService.get('checkinSurname') + '&activity=true#!/';
        this.$window.open(url, '_self');
    };



    /**
     * Check if company is IB|I2|YW
     * @param {String} company Company of flight
     */
    checkCompany = (company) => {
        return this.PmtUtilsService.checkCompany(company);
    };

    baggageRestrictionsRedirection = () => {
        this.pmtRedirectionService.newNavigation(this.$window.location.origin + this.PmtConstants.WEB_CENTER_REDIRECT.REDIRECTION_START + this.PmtConstants.WEB_CENTER_REDIRECT.MARKET_QUERY + this.$rootScope.appMarket + this.PmtConstants.WEB_CENTER_REDIRECT.LANGUAGE_QUERY + this.$rootScope.appLang + this.PmtConstants.WEB_CENTER_REDIRECT.QUADRIGAM_QUERY + this.PmtConstants.WEB_CENTER_REDIRECT.BAGGAGE_RESTRIC, this.PmtConstants.WEB_CENTER_REDIRECT.BLANK);
    };

    /**
      * @function
      * @name showMoreInfo
      * @desc determinates if the show moere info panel needs to be show
      */
    showMoreInfoBool = () => {
        return this.model.rightPanelInfo.fastTrackSegments.length > 0 || this.model.rightPanelInfo.vipSegments.length > 0;
    };

    /**
      * @function
      * @name continueToIbcose2
      * @desc go to Ibcose2 form logged confirmation
      */
    continueToIbcose2 = () => {
        this.PmtModalService.showWaitingModal('ib-modal-loading-plane-pmt', 'ib-modals ib-modals--transparent', true);
        this.localStorageService.remove('userLoggedBookingInfo');
        this.$location.path('/ibcose2');
    };

    /**
      * @function
      * @name calculateBaggageLabel
      * @param totalBaggage the amount of baggages to calculate its label
      * @desc returns a price with the right concurrency format
      */
    calculateBaggageLabel = (totalBaggage) => {
        return totalBaggage > 1 ? 'GLOBAL_BULTOS' : 'GLOBAL_BULTO';
    };

    /**
      * @function
      * @name getCabinClassTypeLabel
      * @desc return the translated label for cabin class type segment
      */
    getCabinClassTypeLabel = (cabinClassType) => {
        return this.PmtUtilsService.getCabinClassName(cabinClassType);
    };

    /**
      * @function
      * @name isLogged
      * @desc determinates if the client is logged
      */
    isLogged = () => {
        return this.localStorageService.get('userLogged');
    };

    /**
     * @function
     * @name showBaggagePolicy
     * @desc opens a modal showing the baggage policy of the segments
     */
    showBaggageRestriction = (size, tpl) => {
        this.PmtModalService.showGenericModal(size, tpl, true, { idModal: this.PmtDatalayerConstants.DATALAYER_MODAL_ID.BAGGAGE_RESTRICTIONS });
    };

    initBooking = (surname, locator) => {
        if (this.localStorageService.get('checkinPa')) {
            if (surname === this.localStorageService.get('checkinSurname') && locator === this.localStorageService.get('PNR')) {
                this.PmtGetCachedInformationService.getCachedInformation().then((data) => {
                    this.localStorageService.set('bookingInfo', data);
                    this.localStorageService.set('nextStepAllowed', false);
                    this.localStorageService.set('confirmationPNR', false);
                    this.$location.path('/ibcoac');
                }, (error) => {
                    this.PmtModalService.finishWaiting();
                    /*PmtModalService.setErrorMessage(error.message);
                    PmtModalService.setErrorCode(error.internalErrorCode);
                    PmtModalService.isError(error);*/
                });
            } else {
                this.CloseSessionService.closeSession();
                this.searchBooking(surname, locator);
            }
        } else {
            this.searchBooking(surname, locator);
        }
    };

    searchBooking = (surname, locator) => {
        this.DatalayerUtilsService.updateDatalayerInitType(this.PmtDatalayerConstants.DATALAYER_VALUES.INIT_LOCATOR);
        this.PmtUtilsService.initStorage();
        this.localStorageService.set('confirmationPNR', false);
        this.localStorageService.set('PNR', this.PmtUtilsService.cleanSpaces(locator));
        this.localStorageService.set('checkinSurname', this.PmtUtilsService.cleanSpaces(surname));
        this.SearchFlightsPassengersService.searchFlighsPassengersByLocatorAndSurname(surname, locator, false);
    };

    /**
     * @function
     * @name openGenericModal
     * @desc opens a modal in the current view
     */
    openGenericModal = (size, tpl, anim) => {
        this.PmtModalService.showGenericModal(size, tpl, anim, { idModal: this.PmtDatalayerConstants.DATALAYER_MODAL_ID.CHECKIN_ONLINE_MORE_INFO }).result.then(angular.noop, angular.noop);
    };

    /**
    * Return information of booking hotels.
    * @return {Obj} information about boardingCards to load external booking iframe
    */
    getBookingHotelsInfo = (confirmationInfo) => {
        let checkInDate = '', checkOutDate = '', departureAirport = '', arrivalAirport = '', destinationCode = '';
        if (Array.isArray(confirmationInfo?.boardingCards)) {
            if (confirmationInfo.boardingCards.length > 1) {
                departureAirport = confirmationInfo.boardingCards[0].departure.airport.code;
                arrivalAirport = confirmationInfo.boardingCards[confirmationInfo.boardingCards.length - 1].arrival.airport.code;
                if (departureAirport === arrivalAirport) {
                    destinationCode = confirmationInfo.boardingCards[0].arrival.airport.code;
                    checkInDate = confirmationInfo.boardingCards[0].arrival.date.split(' ')[0];
                    checkOutDate = confirmationInfo.boardingCards[0].departure.date.split(' ')[0];
                } else {
                    destinationCode = confirmationInfo.boardingCards[confirmationInfo.boardingCards.length - 1].arrival.airport.code;
                    checkInDate = confirmationInfo.boardingCards[confirmationInfo.boardingCards.length - 1].arrival.date.split(' ')[0];
                    checkOutDate = confirmationInfo.boardingCards[confirmationInfo.boardingCards.length - 1].departure.date.split(' ')[0];
                }
            } else {
                checkInDate = confirmationInfo.boardingCards[0].arrival.date.split(' ')[0];
                checkOutDate = confirmationInfo.boardingCards[0].departure.date.split(' ')[0];
                destinationCode = confirmationInfo.boardingCards[0].arrival.airport.code;
            }
        }

        return {
            checkInDate: checkInDate,
            checkOutDate: dayjs(checkOutDate).diff(dayjs(checkInDate), 'days') > 30 ? dayjs(dayjs(checkInDate).add(7, 'days')).format('YYYY-MM-DD') : checkOutDate,
            destinationCode: destinationCode
        };
    };
    openBagOnBoardUrl = (urlbob) => {
        this.$window.open(urlbob, '_blank');
    };

    showBiometricActive = (segment) => {
        let biometricStatusPassengers = this.localStorageService.get('biometricStatusPassengers'), showBiometricActive = false, countStatusComplete = null, segmentsByPass = [];
        if (angular.isDefined(biometricStatusPassengers) && angular.isObject(biometricStatusPassengers)
            && angular.isArray(biometricStatusPassengers.segmentsList) && angular.isArray(biometricStatusPassengers.passengersStatusBySegment) && angular.isArray(biometricStatusPassengers.passengersList)
            && this.model.acceptBiometric) {

            segmentsByPass = biometricStatusPassengers.passengersStatusBySegment.filter((pass) => {
                return pass.segment === segment.id;
            });

            for (let i = 0; i < segmentsByPass.length; i++) {
                if (segmentsByPass[i].status === this.PmtConstants.BIOMETRIC.STATUS.COMPLETE) {
                    countStatusComplete++;
                }
            }

            if (segmentsByPass.length === countStatusComplete) {
                showBiometricActive = true;
            }
        }

        return showBiometricActive;
    };

    checkSeatList = (seatList) => {
        return (angular.isString(seatList) && seatList.length > 0) ? seatList : '';
    };

    /**
     * @function
     * @name showInfoInhibitPassengers
     * @desc Show info Inhibition boarding card
     *
     */
    showInfoInhibitPassengers = () => {
        const newBoardingCards = [];
        const tagsInfo = {
            bold: {
                tag: 'span',
                class: 'ib-message-box__text--bold'
            },
            link: {
                tag: 'a',
                href: '',
                target: '_blank',
                title: '',
                class: 'ib-link ib-link--inline ib-link--important ib-link--underline ib-text--bold'
            },
            link1: {
                tag: 'a',
                href: '',
                target: '_blank',
                title: '',
                class: 'ib-link ib-link--inline ib-link--important ib-link--underline ib-text--bold'
            }
        };
        let newBC: any = {};

        if (this.inhibitStorage) {
            // add boarding card with inhibition active
            for (let f = 0; f < this.inhibitStorage.segments.length; f++) {
                const segmentSelected = this.PmtUtilsTransformers.generateBoardingCardInhibit(this.inhibitStorage.segments[f]);
                newBC = segmentSelected;
                for (let g = 0; g < this.model?.confirmInfo?.boardingCards?.length; g++) {
                    const confirmSegment = this.model.confirmInfo.boardingCards[g];
                    const isEqual: boolean = Number(segmentSelected.id) === Number(confirmSegment.id);
                    const numPassDifferent: boolean = segmentSelected.passengers.length !== confirmSegment.passengers.length;
                    if (isEqual && numPassDifferent) {
                        confirmSegment.passengers = [...confirmSegment.passengers, ...segmentSelected.passengers].reduce((acumulador, valorActual) => {
                            const indice = acumulador.findIndex(item => Number(item.id) === Number(valorActual.id));
                            if (indice === -1) acumulador.push(valorActual);
                            return acumulador;
                        }, []);
                        newBC = confirmSegment;
                    }
                }

                newBoardingCards.push(newBC);
            }

            if (!this.PmtUtilsService.isObject(this.model.confirmInfo)) {
                this.model.confirmInfo = { boardingCards: [] };
            }

            if (newBoardingCards.length > 0) {
                this.model.confirmInfo.boardingCards = newBoardingCards;
            }

            this.model.inhibitBC.showPassengers = this.inhibitStorage.inhibitBoardingCard.status;
            if (this.model.inhibitBC.showPassengers && this.inhibitStorage.inhibitBoardingCard.reason) {
                if (this.model.inhibitBC[this.inhibitStorage.inhibitBoardingCard.priority]) {
                    this.model.inhibitBC[this.inhibitStorage.inhibitBoardingCard.priority].status = true;
                }
                const isAircheckReason: boolean = this.inhibitStorage.inhibitBoardingCard.isAircheckReason && this.inhibitStorage.airCheck.status;
                if (isAircheckReason) {
                    tagsInfo.link.href = this.inhibitStorage.airCheck.url;
                    this.model.inhibitBC.Aircheck.status = true;
                    this.model.inhibitBC.Aircheck.TEXT_1 = 'INHIBIT_MIX_BOARDING_CARD_AIRCHECK_INFO_CONFIRMATION';
                    this.model.inhibitBC.Aircheck.TEXT_2 = this.$filter('literalFormatter')(this.$filter('translate')('MODAL_INHIBIT_BOARDING_CARD_AIRCHECK_INFO_2'), tagsInfo);
                    this.model.inhibitBC.Aircheck.TEXT_3 = this.$filter('literalFormatter')(this.$filter('translate')('MODAL_INHIBIT_BOARDING_CARD_AIRCHECK_INFO_3'), tagsInfo);
                }
                this.showPriorityAlertInhibit();
            }

            this.urlMMB = angular.isString(this.inhibitStorage.LITERALS.TEXT_3) ? this.inhibitStorage.LITERALS.TEXT_3 : '';

            for (let i = 0; i < this.model.confirmInfo.boardingCards.length; i++) {
                const segmentOrigin: any = this.updateSeatList(this.model.confirmInfo.boardingCards[i]);
                const existInhibit: any = this.existItemInhibit();
                const fillRightPanel: boolean = (existInhibit && i === 0 && segmentOrigin.passengers.length > 0 && Array.isArray(this.model.rightPanelInfo.pasList));
                if (fillRightPanel) {
                    const passengerNameList: Array<string> = [];
                    segmentOrigin.passengers.forEach(pass => {
                        passengerNameList.push(`${pass.name} ${pass.surname}`);
                    });
                    if (passengerNameList.length > 0) this.model.rightPanelInfo.pasList = passengerNameList;
                }
                for (let i2 = 0; i2 < this.inhibitStorage.segments.length; i2++) {
                    const segmentCheck = this.inhibitStorage.segments[i2];
                    if (segmentOrigin.id == segmentCheck.id) {
                        for (let j = 0; j < segmentOrigin.passengers.length; j++) {
                            const passOrigin = segmentOrigin.passengers[j];
                            for (let j2 = 0; j2 < segmentCheck.passengers.length; j2++) {
                                const passCheck = segmentCheck.passengers[j2];
                                if (passOrigin.id == passCheck.id) {
                                    passOrigin.gender = passCheck.status.gender;
                                    passOrigin.inhibitBoardingCard = {
                                        status: false,
                                        reason: Array.isArray(passCheck.status.inhibitBoardingCard.reason) ? passCheck.status.inhibitBoardingCard.reason : [],
                                        documentRequired: passCheck?.status?.airCheckDocumentationRequired ? passCheck.status.airCheckDocumentationRequired : false
                                    };

                                    const isAircheck: boolean = passOrigin.inhibitBoardingCard.reason.includes(this.PmtConstants.INHIBIT_BOARDING_CARD_TYPES.AIRCHECK_REASON);
                                    const isSeeAgent: boolean = passCheck.accepted.messageStatus === 'SEE_AGENT_FOR_BP';
                                    const existInhibitBC: boolean = passOrigin.inhibitBoardingCard.reason.length > 0 && !isAircheck;
                                    if (existInhibitBC || isSeeAgent) passOrigin.inhibitBoardingCard.status = true;
                                    if (isAircheck) passOrigin.inhibitBoardingCard.status = passOrigin.inhibitBoardingCard.documentRequired;
                                }
                            }
                        }
                    }
                }
            }
        }
        this.PmtModalService.closeAllCurrentModals();
    };

    /**
     * @function
     * @name initInhibitionBoardingCard
     * @desc init Inhibition boarding card
     * @returns boolean
     */
    initInhibitionBoardingCard = (): boolean => {
        let isHomogeneous = false;
        this.inhibitStorage = this.localStorageService.get('inhibitBoardingCard');
        Object.assign(this.inhibitBC, this.PmtConstants.INHIBIT_ALERT);
        this.model.inhibitBC = this.inhibitBC;

        if (this.inhibitStorage) {
            const priority = this.inhibitStorage?.inhibitBoardingCard?.priority;
            const existPriority = priority && this.model.inhibitBC[priority];
            this.model.inhibitBC.Aircheck.status = this.inhibitStorage?.inhibitBoardingCard?.isAircheckReason;

            if (existPriority) {
                const dataPriority = this.model.inhibitBC[priority];
                dataPriority.status = true;
                dataPriority.isHomogeneous = this.inhibitStorage?.inhibitBoardingCard.isHomogeneous;

                this.showItemAlert = dataPriority.status;
                isHomogeneous = dataPriority.isHomogeneous;
            }
            this.showPriorityAlertInhibit();
        }

        return isHomogeneous;
    };

    openHolaMadridActivities = () => {
        const url = window.location.href;
        const baseUrl = url.substring(0, url.indexOf('/', url.indexOf('/') + 2));
        this.$window.open(baseUrl + '/' + this.$rootScope.appMarket + '/' + this.$rootScope.appLang + '/stopover-in-madrid/experiencias/', '_blank');
    };

    existItemInhibit = () => {
        const types = Object.keys(this.PmtConstants.INHIBIT_ALERT);
        const item = types.find((type) => this.model.inhibitBC[type]?.status === true);

        return item ? item : false;
    };

    /**
     * Show priority alert inhibition boarding card
     */
    showPriorityAlertInhibit = () => {
        const item = this.existItemInhibit();

        if (item) {
            this.model.inhibitBC.ALERT = this.model.inhibitBC[item];

            if (item === 'SEE_AGENT') {
                this.model.inhibitBC.ALERT.LITERAL = this.model.inhibitBC[item].isHomogeneous ? this.model.inhibitBC[item].LITERAL_HOMOGENEOUS : this.model.inhibitBC[item].LITERAL_NO_HOMOGENEOUS;
            }

            this.buildTextInhibitAlert();
        }
    };

    /**
     * Build text alert inhibition boarding card
     */
    buildTextInhibitAlert = () => {
        const urlBase = 'https://www.iberia.com/';
        const urlBody = {
            AVIH: {
                es: 'viajar-con-iberia/animales/',
                pt: 'voe-com-iberia/animais/',
                en: 'fly-with-iberia/pets/',
                it: 'volare-con-iberia/animali/',
                fr: 'voyager-avec-iberia/animaux/',
                ca: 'viatjar-amb-iberia/animals/',
                de: 'mit-iberia-reisen/haustieren/',
                ru: 'puteshestviya-s-iberia/zhivotnye/'
            }
        };
        const market = this.$rootScope.appMarket.toLowerCase() + '/' || 'es/';
        const language = this.$rootScope.appLang || 'es';
        const tagsInfo = (type) => {
            let url = `${urlBase}${market}${urlBody.AVIH[language]}`; // avih/petc
            if (type === 'UMNR') {
                url = this.$filter('NewLinksFilter')('INFO_INHIBITION_UMNR');
            }
            return {
                link: {
                    tag: 'a',
                    href: url,
                    target: '_blank',
                    title: '',
                    class: 'ib-link ib-link--inline ib-text--bold'
                }
            };
        };
        const literalFormatter = (literal, type) => this.$filter('literalFormatter')(this.$filter('translate')(literal), tagsInfo(type));
        this.model.inhibitBC.ALERT.TEXT = literalFormatter(this.model.inhibitBC.ALERT.LITERAL, this.model.inhibitBC.ALERT.code);
    };

    checkMarketingPermission = () => {
        if (this.CommonsUserUtilsService.isIbPlus() && !this.CommonsCookiesService.getCookie(this.PmtConstants.COOKIES.NO_MARKETING_PERMISSION)) {
            this.CommonsCookiesService.setCookieTime(this.PmtConstants.COOKIES.NO_MARKETING_PERMISSION, true, this.selectCookieTime());
            this.ibMarketingPermissionService.getMarketingPermissions().then((response) => {
                const commercialCamp = response.data.find((element) => element.permissionType === 'COMMERCIAL_CAMPAIGN')?.permissionGranted;
                if (!commercialCamp) {
                    this.PmtModalService.showGenericModal(true, 'ib-modal-marketing-permission.html').result.finally(() => { });
                }
            });
        }
    };

    selectCookieTime = () => {
        return this.CommonsSessionStorageService.get('showMarketingPermission') ? this.PmtConstants.COOKIES.MARKETING_PERMISSION_TEST_EXPIRY_TIME :
            this.PmtConstants.COOKIES.MARKETING_PERMISSION_EXPIRY_TIME;
    };

    updateSeatList = (segment) => {
        const seatList: string[] = [];
        for (let i = 0; i < segment.passengers.length; i++) {
            const passenger: any = segment.passengers[i];
            const isInfant: boolean = passenger.type === 'INFANT';
            const existSeat: boolean = !isInfant && passenger.seat?.row && passenger.seat?.column;
            const exisExtratSeat: boolean = !isInfant && passenger.extraSeat?.row && passenger.extraSeat?.column;
            let stringSeat: string = '';
            if (existSeat) stringSeat += `${passenger.seat.row}${passenger.seat.column}`;
            if (exisExtratSeat) stringSeat += `-${passenger.extraSeat.row}${passenger.extraSeat.column}`;
            if (stringSeat.length > 0) seatList.push(stringSeat);
        }
        if (segment.seatList.length > 0) segment.seatList = seatList.join(',');

        return segment;
    };

    getApisPassengerEsta = () => {
        const bookingInfo = this.localStorageService.get('bookingInfo');
        this.isCC = bookingInfo?.carrierConnectEnabled ?? false;
        const passengersApisDocs = this.localStorageService.get('passengersApisDocs') ?? [];
        this.passengersEsta = bookingInfo?.passengers?.filter((passenger: any) => {
            return passenger.status?.reason?.code.includes('ESTA_CONSTRAINTS') && passenger.status?.code === 'NOT_ALLOWED' && passengersApisDocs.includes(passenger.id);
        }) || [];
        //links
        if(this.passengersEsta.length > 0) {
            const tagsInfo = {
                link: {
                    tag: 'a',
                    href: '',
                    target: '_blank',
                    title: '',
                    class: 'ib-link ib-link--inline'
                }
            };
            tagsInfo.link.href = this.$filter('NewLinksFilter')('APIS_URL_TRAVEL_DOCUMENTATION', this.$rootScope.appLang);
            this.keyApisEsta = this.$filter('literalFormatter')(this.$filter('translate')(this.keyApisEsta), tagsInfo);
        }
    };

    showSeatInhibit = (passenger) => {
        return passenger?.seat?.row && passenger?.seat?.column;
    };

    initAnalytics = () => {
        this.$timeout(() => {
            const context = this.getConfirmationContext();

            this.sendDatalayerTracking(context);
            this.sendDigitalDataTracking(context);
            this.updateMonetate(context.quadrigam);
            this.addSelectedCardType(context.selectedCardType);
            this.notifyMonetateUpdate();
        });
    };

    getConfirmationContext = () => {
        const selectedCardType = this.localStorageService.get('typeCardIberiaPay');
        const isFlowDuplicated = this.localStorageService.get('isFlowDuplicated');
        const isEarly = this.localStorageService.get('isEarly') || false;
        const quadrigam = this.getQuadrigam(isEarly);
        const vipRoom = this.getVipRoomValue();
        const hpbt = this.getHpbtValue();
        const step = 'confirmacion';
        const process = this.getProcessValue(isFlowDuplicated);

        return {
            selectedCardType,
            quadrigam,
            vipRoom,
            hpbt,
            step,
            process
        };
    };

    getQuadrigam = (isEarly: boolean) => {
        const pmtViewType: CheckinConfirmationModel.PaymentViewType =  this.CommonsBrowserStorageService.get<CheckinConfirmationModel.PaymentViewType>('ib-check-in-app.forcePaymentType') ?? null;
        const isDecoupling: boolean = pmtViewType === this.PmtConstants.PAYMENT_VIEW_TYPE.NEW;

        return isDecoupling ? this.getQuadrigamDecoupling(isEarly) : this.getQuadrigamRegular(isEarly);
    };

    getQuadrigamRegular = (isEarly: boolean) => {
        return isEarly
            ? this.PmtConstants.QUADRIGAMS.CKI_CONFIRMATION_EARLY
            : this.PmtConstants.QUADRIGAMS.CKI_CONFIRMATION;
    };

    getQuadrigamDecoupling = (isEarly: boolean) => {
        return isEarly
            ? this.PmtConstants.QUADRIGAMS.CKI_CONFIRMATION_EARLY_DECOUPLING
            : this.PmtConstants.QUADRIGAMS.CKI_CONFIRMATION_DECOUPLING;
    };

    getVipRoomValue = () => {
        return this.model.rightPanelInfo.vipSegments.length > 0
            ? this.PmtDatalayerConstants.DATALAYER_VALUES.YES
            : this.PmtDatalayerConstants.DATALAYER_VALUES.NO;
    };

    getHpbtValue = () => {
        return this.PmtDatalayerConstants.DATALAYER_VALUES.OFFERED
            + ':' + this.PmtDatalayerConstants.DATALAYER_VALUES.NO
            + ' - ' + this.PmtDatalayerConstants.DATALAYER_VALUES.EMITED
            + ':' + this.PmtDatalayerConstants.DATALAYER_VALUES.NO;
    };

    getProcessValue = (isFlowDuplicated) => {
        return isFlowDuplicated
            ? this.DatalayerConstants.DATALAYER_FLOW_CKI.PROCESS_DUPLICATE
            : this.DatalayerConstants.DATALAYER_FLOW_CKI.PROCESS;
    };

    sendDatalayerTracking = ({ quadrigam, vipRoom, hpbt, step, process }) => {
        const extendedInfo = this.buildDatalayerInfo(vipRoom, hpbt, step, process);

        this.DatalayerUtilsService.updateDatalayerWithQuadrigam(
            quadrigam,
            extendedInfo,
            this.PmtUtilsService.isUserLogged()
        );

        this.DatalayerUtilsService.sendDatalayerEvent(
            this.PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW
        );
    };

    buildDatalayerInfo = (vipRoom, hpbt, step, process) => {
        return {
            [this.PmtDatalayerConstants.DATALAYER_INFO.VIP_ROOM]: vipRoom,
            [this.PmtDatalayerConstants.DATALAYER_INFO.HPBT]: hpbt,
            [this.DatalayerConstants.DATALAYER_INFO.STEP]: step,
            [this.DatalayerConstants.DATALAYER_INFO.PROCESS]: process
        };
    };

    sendDigitalDataTracking = ({ quadrigam, step, process }) => {
        const extendedDigitalDataInfo = this.buildDigitalDataInfo(step, process);

        this.DatalayerUtilsService.updateDigitalDataWithQuadrigam(
            quadrigam,
            extendedDigitalDataInfo,
            this.PmtUtilsService.isUserLogged()
        );

        this.DigitalDataService.emitViewEvent();
    };

    buildDigitalDataInfo = (step, process) => {
        return {
            [this.DatalayerGeneralConstants.STEP]: step,
            [this.DatalayerGeneralConstants.PROCESS]: process
        };
    };

    updateMonetate = (quadrigam) => {
        this.MonetateUtilsService.updateMonetateWithQuadrigam(
            this.PmtConstants.MONETATE_INFO.SETPAGETYPE,
            quadrigam,
            null
        );
    };

    addSelectedCardType = (selectedCardType) => {
        if (!selectedCardType) {
            return;
        }

        const cardType = {
            [this.PmtDatalayerConstants.DATALAYER_INFO.PAYMENT_METHOD]: selectedCardType
        };

        this.DatalayerUtilsService.addDataLayerInfo(cardType);
        this.DatalayerUtilsService.addDigitalDataInfo(cardType);
    };

    notifyMonetateUpdate = () => {
        this.$timeout(() => {
            this.$rootScope.$broadcast('sendUpdateToMonetate');
        });
    };

    private getSegmentKey (segment: CheckinConfirmationModel.BoardingCards): string {
        return String(segment.id);
    }

    initializeFooterProps = () => {
        const segments: CheckinConfirmationModel.BoardingCards[] = this.model?.confirmInfo?.boardingCards ?? [];

        this.footerPropsBySegment = {};

        segments.forEach((segment) => {
            this.footerPropsBySegment[this.getSegmentKey(segment)] = {
                checkCompany: this.checkCompany(segment),
                cabinClassTypeLabel: this.getCabinClassTypeLabel(segment),
                segment,
                showInhibitPassengers: this.model?.inhibitBC?.showPassengers ?? false,
                isCC: this.isCC,
                inhibitStorage: this.inhibitStorage,
                showBiometricActive: this.showBiometricActive(segment),
                isBpSubscriptionMode: this.isBpSubscriptionMode ?? false
            };
        });
    };
}


try {
    const mod = angular.module(controllerInfo.module);
    checkInConfirmationController.$inject = controllerInfo.inject;
    mod.controller(controllerInfo.controllerName, checkInConfirmationController);
    mod.component(controllerInfo.selector, componentOptions);
} catch (error) {
    const mod = angular.module(controllerInfo.module, controllerInfo.required);
    checkInConfirmationController.$inject = controllerInfo.inject;
    mod.controller(controllerInfo.controllerName, checkInConfirmationController);
    mod.component(controllerInfo.selector, componentOptions);
}
