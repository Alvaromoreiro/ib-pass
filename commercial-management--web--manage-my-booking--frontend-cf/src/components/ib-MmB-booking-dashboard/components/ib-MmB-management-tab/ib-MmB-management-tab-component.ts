import { IbMmbUmnrUtilsService } from "@src/components/ib-MmB-umnr-passengers/services/ib-Mmb-umnr-utils.service";
import { IbMmBUmnrDataModalComponent } from "../../../ib-MmB-umnr-passengers/components/ib-MmB-umnr-data-modal/ib-MmB-umnr-data-modal.component";
import { IbCModalService } from "ib-web-commons/ib-modal";

@Component(
    'ib-MmB-management-tab-module',
    'ibMmbManagementTabComponent',
    {
        controllerAs: 'managTabCtrl',
        templateUrl: ['MmBAppConstants', (MmBAppConstants) => {
            return MmBAppConstants.templatesRoute + 'ib-MmB-management-tab-view.html';
        }],
        bindings: {
            exp: '=',
            trans: '=',
            model: '=',
            apis: '<',
            flags: '=',
            flagsViews: '<',
            passengers: '=',
            yourFlightsModel: '<',
            ancillariesInfo: '<',
            managementModel: '<',
            tabsModel: '<',
            seatChangeConditions: '<',
            isSkeleton: '<',
            canceledSeatsFlag: '<'
        }
    },
    ['$scope','$rootScope','BookingDashboardConstants','MmBDatalayerUtilsService','MmBAppConstants','localStorageService','RedirectionService', '$filter','DisruptionUtilService','EvaluatorConst','VipLoungesService', 'IbCModalService', 'IbMmbUmnrUtilsService'],
[])
export class ibMmbManagementTabComponent {
    exp;
    trans;
    model;
    apis;
    flags;
    flagsViews;
    passengers;
    yourFlightsModel;
    ancillariesInfo;
    managementModel;
    tabsModel;
    seatChangeConditions;
    isSkeleton:boolean;
    canceledSeatsFlag:boolean;
    private vipLoungeEventHandler: EventListener;
    isActiveUmnr:boolean = false;
    isDataUmnrCompleted:boolean = false;

    constructor(
        private $scope,
        private $rootScope,
        private BookingDashboardConstants,
        private MmBDatalayerUtilsService,
        private MmBAppConstants,
        private localStorageService,
        private RedirectionService,
        private $filter,
        private DisruptionUtilService,
        private EvaluatorConst,
        private VipLoungesService,
        private IbCModalService: IbCModalService,
        private IbMmbUmnrUtilsService: IbMmbUmnrUtilsService
    ) {
      this.$scope.$on('showBoxYourDocuments', this.showBoxYourDocuments);
      this.$scope.$on('importReady', this.importReady);
      this.$scope.$on('vipLoungesDataReady', this.handleVipLoungesData);
      this.vipLoungeEventHandler = this.handleVipLoungeEvent.bind(this);
      this.isActiveUmnr = this.IbMmbUmnrUtilsService.isActiveUMNR();
      this.isDataUmnrCompleted = this.IbMmbUmnrUtilsService.isDataUmnrCompleted();
    }

    print_itinerary = null;
    infoBooking = null;
    infoDigitalBoarding = null;
    showModuleLink:boolean = false;
    externalAgency:boolean = false;
    showGibeInvitationsLink = false;
    showGibeFastLink = false;
    availableForCheckin = null;
    infoImportOrderHandler = null;
    flightReminder;
    seatsAuctionData;
    seatsAuctionPreBidData;
    checkInLinkData;
    orderFlags;
    ibcomChannel:boolean;
    thereIsCurrencies:boolean;
    phone;
    oldExternalRubiQ;
    oldExternalRubiQLabel;
    oldExternalRubiQLabel2;
    oldExternalRubiQLabelPhone;
    cashRefundTextCoded;
    cashRefundText;
    cashVoucherRefundTextCoded;
    cashVoucherRefundText;
    digitalBoardingLinkData;
    caseFive;
    gibeData;
    ancillariesInfoApi;
    isCheckIn = false;
    delayedFlights = null;

    $onInit = () => {
        this.MmBDatalayerUtilsService.updateDatalayerInfo(null, null, this.MmBAppConstants.QUADRIGAM.MANAGE_RESERV);
        if (this.isSkeleton) {
            this.initializeSkeletonData();
        } else {
            this.setupManagementData();
        };

        this.addGastronomicEventListener();

        const vipLoungesData = this.localStorageService.get('vipLoungesInvitations');
        if (vipLoungesData) {
            this.initializeVipLounges(vipLoungesData);
        }
    };

    $onDestroy = () => {
        this.removeVipLoungeEventListener();
        this.removeGibeFastEventListener();
        this.removeGastronomicEventListener();
    };

    private initializeVipLounges (data) {
        Promise.all([
            this.VipLoungesService.getVipInvitationsComponent(),
            this.VipLoungesService.getFastTrackCardComponent()
        ])
        .then(
            () => {
                this.handleVipLoungesData(null, data)
            },
        )
    }

    private handleVipLoungesData = (event, data) => {
        this.showGibeInvitationsLink = this.shouldShowGibeInvitationsLink(data);
        this.showGibeFastLink = this.shouldShowGibeFastLink(data);
        this.gibeData = data;

        if (this.showGibeInvitationsLink) {
            this.setupVipLoungeEventListener();
        } else {
            this.removeVipLoungeEventListener();
        }

        if (this.showGibeFastLink) {
            this.setupGibeFastEventListener();
        } else {
            this.removeGibeFastEventListener();
        }
    };

    private shouldShowGibeInvitationsLink(data) {
        return data?.status?.invitations?.code === 'AVAILABLE';
    }

    private shouldShowGibeFastLink(data) {
        return data?.status?.fast?.code === 'AVAILABLE';
    }

    private setupGibeFastEventListener = () => {
        window.addEventListener('gibe-fast-button-clicked', this.vipLoungeEventHandler);
    };

    private removeGibeFastEventListener = () => {
        window.removeEventListener('gibe-fast-button-clicked', this.vipLoungeEventHandler);
    };

    private setupVipLoungeEventListener = () => {
        window.addEventListener('vip-lounge-button-clicked', this.vipLoungeEventHandler);
    };

    private removeVipLoungeEventListener = () => {
        window.removeEventListener('vip-lounge-button-clicked', this.vipLoungeEventHandler);
    };

    private handleVipLoungeEvent = () => {
        this.gibeData = this.localStorageService.get('vipLoungesInvitations');
        this.$rootScope.$broadcast('changeActiveTabMenuEvt', this.BookingDashboardConstants.TABS.exclusiveBenefits);
    };

    private addGastronomicEventListener = () => {
        window.addEventListener("open-gastronomic-proposal-event", this.handleGastronomicEvent);
    };

    private removeGastronomicEventListener = () => {
        window.removeEventListener("open-gastronomic-proposal-event", this.handleGastronomicEvent);
    };

    private handleGastronomicEvent = () => {
        this.$rootScope.$broadcast('openGastronomicProposal');
    };

    private importReady = () => {
        this.setupManagementData();
    };

    private setupManagementData = () => {
        this.loadManagementData();
        this.initializeManagementLinks();
        this.initializeBookingContext();
        this.initializeRefundCopy();
        this.initializeDisruptionInfo();
    };

    private loadManagementData = () => {
        this.infoBooking = this.localStorageService.get('bookingInfo');
        this.infoDigitalBoarding = this.localStorageService.get('digitalBoardingInfo');
        this.actionUpgInformation();
    };

    private initializeManagementLinks = () => {
        this.initializeSeatsAuctionData();
        this.initializeSeatsAuctionPreBidData();
        this.initializeCheckInLinkData();

        this.isCheckIn = this.infoBooking?.order?.slices?.some(slice => slice.segments?.some(segment => segment.ckiStatus?.code === 'CHECKED')) ?? false;

        this.showBoxYourDocuments();

        this.orderFlags = this.initializeOrderFlags();
        this.checkItinerary();

        this.actionCheckinLinkDataPrintItinerary();
    };

    private initializeBookingContext = () => {
        this.ibcomChannel = this.isIbComChannel();
        this.thereIsCurrencies = this.isCurrenciesCode();
        this.externalAgency = this.isExternalAgency();
    };

    private initializeRefundCopy = () => {
        this.phone = this.localStorageService.get('phonesList');
        this.oldExternalRubiQ = this.DisruptionUtilService.evaluateRule(this.infoBooking?.orderFlags, this.EvaluatorConst.REFUND_FLAG_EVALUATOR.OLD_RUBIQ_EVAL);
        this.oldExternalRubiQLabel = this.$filter('translate')(this.literalOldExternalRubiQLabel());
        this.oldExternalRubiQLabel2 = this.$filter('translate')(this.literalOldExternalRubiQLabel2());
        this.oldExternalRubiQLabelPhone = this.literalOldExternalRubiQLabelPhone();
        this.cashRefundTextCoded = this.$filter('translate')('MMB_FLEX_CASH_REFUND');
        this.cashRefundText = this.cashRefundTextCoded.replace(/\*/g, this.oldExternalRubiQLabelPhone);
        this.cashVoucherRefundTextCoded = this.$filter('translate')( 'MMB_FLEX_CASH_VOUCHER_REFUND');
        this.cashVoucherRefundText = this.cashVoucherRefundTextCoded.replace(/\*/g, this.oldExternalRubiQLabelPhone);

        this.flagFixer();
        this.actionAvailableForCheckin();
    };

    private initializeDisruptionInfo = () => {
        this.caseFive = this.DisruptionUtilService.checkWarning(this.infoBooking?.warnings);
        this.initializeGastronomicProposal();
        this.delayedFlights = this.DisruptionUtilService.checkDelayedFlights(this.infoBooking?.order?.slices);
    };

    private initializeGastronomicProposal = () => {
        this.ancillariesInfoApi = this.localStorageService.get('ancillariesInfo')?.ancillaries;
    }

    private literalOldExternalRubiQLabel = () => {
        return (this.externalAgency ? 'MMB_FLEX_VOUCHER_REFUND_EXTERNAL': 'MMB_FLEX_VOUCHER_REFUND_1');
    };

    private literalOldExternalRubiQLabel2 = () => {
        return (this.externalAgency ? '': 'MMB_FLEX_VOUCHER_REFUND_2');
    };

    private literalOldExternalRubiQLabelPhone = () => {
        return (this.externalAgency ? '': ' ' + this.phone?.RESERVAS?.prefix + ' ' + this.phone?.RESERVAS?.telephone);
    };

    private initializeOrderFlags = () => {
        return this.infoBooking?.orderFlags ? this.infoBooking.orderFlags : [];
    };

    private actionAvailableForCheckin = () => {
        this.availableForCheckin = this.infoBooking && this.infoBooking?.order && this.infoBooking?.order.availableForCheckin ? this.infoBooking?.order.availableForCheckin : false;
        if (!this.availableForCheckin) {
            this.flightReminder = {
                colSize: this.BookingDashboardConstants.BOX_COL_SIZES.LARGE,
                boxSize: this.BookingDashboardConstants.BOX_LINK_SIZES.FULL,
                icon: this.BookingDashboardConstants.BOX_LINK_ICONS.MESSAGES,
                linkId: this.BookingDashboardConstants.BOX_LINKS_TYPES.FLIGHT_REMINDER,
                text: {
                    title: 'MODULES_LINK_MAIL_FLIGHT_TEXT_2',
                    subtitle: 'MODULES_LINK_RESEND_TEXT_2',
                    accessibilityText: 'MODULES_LINK_MAIL_FLIGHT_ACCESIBLE_TEXT_2'
                }
            };
        };
    };

    private isUpgInformation = () => {
        return ((this.infoBooking && !this.infoBooking?.upgInformation) || !this.infoBooking?.upgInformation?.bidable);
    };

    private initializeSeatsAuctionData = () => {
        this.seatsAuctionData = {
            colSize: this.BookingDashboardConstants.BOX_COL_SIZES.LARGE,
            boxSize: this.BookingDashboardConstants.BOX_LINK_SIZES.FULL,
            icon: this.BookingDashboardConstants.BOX_LINK_ICONS.UPGRADE,
            linkId: this.BookingDashboardConstants.BOX_LINKS_TYPES.SEATS_AUCTION,
            text: {
                title: 'MODULES_LINK_BIDS_AUCTION_TITLE',
                subtitle: 'MODULES_LINK_NOT_PREBID_TEXT',
                accessibilityText: 'MODULES_LINK_GET_BETTER_SEAT_TEXT'
            }
        };
    };

    private initializeSeatsAuctionPreBidData = () => {
        this.seatsAuctionPreBidData = {
            colSize: this.BookingDashboardConstants.BOX_COL_SIZES.LARGE,
            boxSize: this.BookingDashboardConstants.BOX_LINK_SIZES.FULL,
            icon: this.BookingDashboardConstants.BOX_LINK_ICONS.UPGRADE,
            linkId: this.BookingDashboardConstants.BOX_LINKS_TYPES.SEATS_AUCTION,
            text: {
                title: 'MODULES_LINK_BIDS_AUCTION_TITLE',
                subtitle: 'MODULES_LINK_PREBID_TEXT',
                accessibilityText: 'MODULES_LINK_GET_BETTER_SEAT_TEXT'
            }
        };
    };

    private initializeCheckInLinkData = () => {
        this.checkInLinkData = {
            colSize: this.BookingDashboardConstants.BOX_COL_SIZES.MEDIUM,
            boxSize: this.BookingDashboardConstants.BOX_LINK_SIZES.FULL,
            icon: this.BookingDashboardConstants.BOX_LINK_ICONS.CHECK_IN,
            linkId: this.BookingDashboardConstants.BOX_LINKS_TYPES.CHECK_IN,
            text: {
                title: 'MODULES_LINK_GO_TO_CHECK_IN_TEXT',
                subtitle: '',
                accessibilityText: 'MODULES_LINK_GO_TO_CHECK_IN_ACCESIBLE_TEXT'
            }
        };
    };

    private actionCheckinLinkDataPrintItinerary = () => {
        if (!this.print_itinerary) {
            this.checkInLinkData.colSize = this.BookingDashboardConstants.BOX_COL_SIZES.LARGE;
        };
    };

    private actionUpgInformation = () => {
        if (this.isUpgInformation()){
              this.flightReminder = {
                  colSize: this.BookingDashboardConstants.BOX_COL_SIZES.MEDIUM,
                  boxSize: this.BookingDashboardConstants.BOX_LINK_SIZES.FULL,
                  icon: this.BookingDashboardConstants.BOX_LINK_ICONS.MESSAGES,
                  linkId: this.BookingDashboardConstants.BOX_LINKS_TYPES.FLIGHT_REMINDER,
                  text: {
                      title: 'MODULES_LINK_MAIL_FLIGHT_TEXT_2',
                      subtitle: 'MODULES_LINK_RESEND_TEXT_2',
                      accessibilityText: 'MODULES_LINK_MAIL_FLIGHT_ACCESIBLE_TEXT_2'
                  }
              };
          };
    };

    private isIbComChannel = () => {
        return ((this.infoBooking?.channel === 'IBCOM') || this.infoBooking?.channel === 'OTHER');
    };

    private isCurrenciesCode = () => {
        if (this.infoBooking?.contextMetadata?.currencies[0]?.code){
            return true;
        };
        return false;
    };

    private isExternalAgency = () => {
        return ((this.infoBooking?.channel === 'OTHER') || this.infoBooking?.channel === 'NDC_INDIRECT');
    };

    /**
      * Initializes data for skeleton mode using data from bookingInfoLight
      * @private
    */
    private initializeSkeletonData = () => {
        this.infoImportOrderHandler = this.localStorageService.get("bookingInfoLight");
        this.model = this.model || {};
        if (this.infoImportOrderHandler) {
            this.initializePassengersData();
            this.initializeFlightsData();
            this.initializerBaggageData();
            this.initializerInvoiceData();
            this.initializeSeatsData();
        };
    };

  /**
    * Initializes passengers data for skeleton mode
    * Only adds them to the model if there are passengers in bookingInfoLight
    * @private
  */
  private initializePassengersData = () => {
      const { passengers = [] } = this.infoImportOrderHandler || {};

      if (passengers.length) {
          this.model.managePassengers = passengers.map(passenger => {
              const { passengerId, passengerType, personalInfo = {} } = passenger || {};
              const { name = '', surname = '' } = personalInfo || {};

              return {
                  passengerId,
                  passengerType,
                  personalInfo: { name, surname },
                  isSkeletonView: true,
              };
          });
      }
  };

  /**
   * Initializes flight data for skeleton mode
   * @private
   */
  private initializeFlightsData = () => {
      const { order = {} } = this.infoImportOrderHandler || {};
      const { slices = [] } = order;

      if (!slices.length) return;

      this.model.manageFlights = slices.map(this.createFlightFromSlice);
  };


  /**
   * Initializes baggage data for skeleton mode
   * @private
   */
    private initializerBaggageData = () => {
        this.model.baggageInfo = {
            isSkeletonView: true
        };
    };

    private initializerInvoiceData = () => {
        this.model.invoice = {
            isSkeletonView: true
        };
    };


    /**
    * Creates a flight object from an bookingInfoLight slice
    * @param {Object} slice - Flight slice
    * @returns {Object} Formatted flight object
    * @private
    */
    private createFlightFromSlice = (slice) => {
        if (!slice?.segments?.length) {
            return {};
        }
        const firstSegment = slice.segments[0];
        const lastSegment = slice.segments[slice.segments.length - 1];

        const { departure, status, flight } = this.extractSegmentData(firstSegment);
        const { arrival } = this.extractSegmentData(lastSegment);

        return {
            departureCity: this.createCityInfo(departure),
            arrivalCity: this.createCityInfo(arrival),
            departureDateParsed: this.createDateInfo(departure.dateTime),
            status: this.createStatusInfo(status),
            segments: [{ status: this.createStatusInfo(status), flight: this.createFlightInfo(flight) }],
            flown: false,
            isSkeletonView: true,
        };
    };


    private extractSegmentData = (segment) => {
        return {
            departure: segment.departure || {},
            arrival: segment.arrival || {},
            status: segment.status || {},
            flight: segment.flight || {},
        };
    };


    private createCityInfo = (locationData:any = {}) => {
        return {
            city: {
                description: locationData?.city?.description || "",
            },
            code: locationData?.code || "",
        };
    };

    /**
    * Creates date and time information from a date/time string
    * @param {string} dateTimeString - Date in ISO format
    * @returns {Object} Formatted date and time information
    * @private
    */
    private createDateInfo = (dateTimeString) => {
        return {
            formatedDate: this.formatDateToDisplay(dateTimeString),
            dateTime: this.formatTimeOnly(dateTimeString),
        };
    };

    /**
    * Creates flight status information
    * @param {Object} statusData - Flight status data
    * @returns {Object} Formatted flight status information
    * @private
    */
    private createStatusInfo = (statusData:any = {}) => {
        return {
            description: statusData.description || "",
        };
    };

    /**
    * Creates flight information
    * @param {Object} flightData - Flight data
    * @returns {Object} Formatted flight information
    * @private
    */
    private createFlightInfo = (flightData:any = {}) => {
        return {
            aircraft: {
                code: flightData.aircraft?.code || "",
            },
        };
    };

    /**
    * Initializes skeleton mode for seats
    * @private
    */
    private initializeSeatsData = () => {
        this.model.manageSeats = {
          isSkeletonView: true,

        };
    };

    /**
    * Formats a date in ISO format to DD/MM/YYYYYY format
    * @param {string} dateTimeString - Date formatted ISO "YYYY-MM-DD HH:MM"
    * @returns {string} Date formatted “DD/MM/YYYYYY”.
    * @private
    */
    private formatDateToDisplay = (dateTimeString) => {
        if (!dateTimeString) return "";

        try {
          const [datePart] = dateTimeString.split(" ");
          if (!datePart) return "";

          const [year, month, day] = datePart.split("-");
          return `${day}/${month}/${year}`;
        } catch {
          return "";
        };
    };


    /**
    * Extracts only the time from a date and time string
    * @param {string} dateTimeString - Date formatted ISO "YYYY-MM-DD HH:MM"
    * @returns {string} Time formatted "HH:MM"
    * @private
    */
    private formatTimeOnly = (dateTimeString) => {
        if (!dateTimeString) return "";

        try {
          const [, timePart] = dateTimeString.split(" ");
          return timePart?.substring(0, 5) || "";
        } catch {
          return "";
        };
    };

    private checkItinerary = () => {
        let found = false;
        let j = 0;
        const limit = this.orderFlags.length;
        while (!found && j < limit) {
            if (this.orderFlags[j].type === 'PRINT_ITINERARY' && this.orderFlags[j].enabled) {
                found = true;
                this.print_itinerary = this.orderFlags[j].enabled;
            }
            j++;
        };
    };

    redirectToRefundSection = () =>{
        this.$rootScope.$broadcast('changeActiveTabMenuEvt', this.BookingDashboardConstants.TABS.refunds);
    };

    redirectToVoucherRefundFlow = () => {
        let bookingInfo, email;
        if (this.flagsViews.showRefundVoucherSectionFunctional) {
            this.$rootScope.$broadcast('changeActiveTabMenuEvt', this.BookingDashboardConstants.TABS.refunds);
        } else {
            bookingInfo = this.localStorageService.get('bookingInfo') || null, email = null;
            email = bookingInfo && bookingInfo.order && bookingInfo.order.primaryContactInfo && bookingInfo.order.primaryContactInfo.email ? bookingInfo.order.primaryContactInfo.email : '';
            this.RedirectionService.externalRedirect(this.$filter('LinksFilter')('DISRUPTION_REFUND_EXTERNAL_LINK') + '?pnr=' + this.localStorageService.get('PNR') + '&lastname=' + this.localStorageService.get('checkinSurname')
                + '&email=' + email + '&fc=C');
        };
    };

    redirectToFlightChangeFlow = () => {
        this.$rootScope.$broadcast('changeActiveTabMenuEvt', this.BookingDashboardConstants.TABS.changeFlights);
    };

    /**
     * Validates flags internal coherence, and fix unexpected behaviour
     */
    private flagFixer = () => {
        /**
         * Checks on refund flags, assuring its posible to request for refund,
         * when not update callcenter flags to give the user an option
         */
        if(this.isOldExternalRubiQ()) {
            this.oldExternalRubiQ = true;
        };
    };

    private isOldExternalRubiQ = () => {
        return (!this.oldExternalRubiQ && this.flagsViews?.allowedRefundVoucher && !this.flagsViews?.showRefundVoucherSectionFunctional);
    };

    redirectToSeatmapLayout = () => {
        //Aquí va la llamada al servicio de aviso a server de no mostrar más el aviso (por definir).
        //Poner active tab "Personaliza tu vuelo"
        this.$rootScope.$broadcast('changeActiveTabMenuEvt', this.BookingDashboardConstants.TABS.customize);
        this.$rootScope.$broadcast('openSeatMap');
    };

    /**
    * Show section and box your documents
    */
    private showBoxYourDocuments () {
        if (this.infoDigitalBoarding) {
            this.digitalBoardingLinkData = {
                colSize: this.BookingDashboardConstants.BOX_COL_SIZES.LARGE,
                boxSize: this.BookingDashboardConstants.BOX_LINK_SIZES.FULL,
                icon: this.BookingDashboardConstants.BOX_LINK_ICONS.UPLOAD_FILE,
                linkId: this.infoDigitalBoarding.digitalBoardings.segments[0].url,
                text: {
                    title: 'MODULES_LINK_GO_TO_DIGITAL_BOARDING_IN_TEXT',
                    subtitle: this.infoDigitalBoarding.message,
                    accessibilityText: ''
                }
            };

            if(this.infoDigitalBoarding?.digitalBoardings?.segments?.length > 0) {
                this.showModuleLink = true;
            }
        };
    };

    getFlexibilizationTitle = (): string => {
        const id = this.infoBooking?.flexibilizationCapabilitiesInformation?.id;
        return this.BookingDashboardConstants.CUSTOM_FLEXIBILIZATION_TITLE[id]
            ?? this.BookingDashboardConstants.DEFAULT_FLEXIBILIZATION_TITLE;
    };
	openDataModal = (viewModel) => {
        const options = {
            windowClass: 'ib-modals ib-modals--right mmb-modals mmb-modals--right ib-modals--full-mobile',
            modalBlocked: false
        };
        const modalRef = this.IbCModalService.showGenericComponentModal(IbMmBUmnrDataModalComponent, {...options});
        // modalRef.componentInstance.currentStep = viewModel.currentStep ?? {};

        return modalRef;
    };
};