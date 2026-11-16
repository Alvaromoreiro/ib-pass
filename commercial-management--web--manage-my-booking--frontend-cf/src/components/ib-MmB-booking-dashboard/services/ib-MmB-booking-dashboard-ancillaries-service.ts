import angular from "angular";
import { BookingDashboardSharedUtilsService } from './ib-MmB-booking-dashboard-shared-utils-service';
import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { MmBAncillariesUtilsService } from '@src/components/services/Utils/ib-ancillaries/ib-MmB-ancillaries-utils-service';

@Service(
    'ib-MmB-booking-dashboard-module',
    [  '$rootScope','localStorageService','MmBUtilService', 'ModalServiceAncillaries', 'MmBDatalayerUtilsService', 'AncillariesConstants', 'MmBAncillariesUtilsService', 
        'CommonsUtilService', 'MmBAppConstants', 'BookingDashboardService','BookingDashboardUtilsService','BookingDashboardSharedUtilsService', 'BookingDashboardConstants', 
        'UpdateSeatChangeNotificationService', 'CommonsSessionStorageService', 'RetrieveOrderService', 'AncillariesService', 'AncillariesTransformer', 
        'CommonsAncillariesService', 'MmBModalService', '$filter', '$timeout', 'MonetateUtilsService', 'MonetateConstants', 'NewMainHeaderFacade', 'NewSeatsMapService',
        'IbMmbManageCarbonFootprintInfoService'
    ],
    [])
export class BookingDashboardAncillariesService {
    constructor(
        private $rootScope: any,
        private localStorageService,
        private MmBUtilService,
        private ModalServiceAncillaries,
        private MmBDatalayerUtilsService,
        private AncillariesConstants,
        private MmBAncillariesUtilsService: MmBAncillariesUtilsService,
        private CommonsUtilService,
        private MmBAppConstants,
        private BookingDashboardService,
        private BookingDashboardUtilsService,
        private BookingDashboardSharedUtilsService: BookingDashboardSharedUtilsService,
        private BookingDashboardConstants,
        private UpdateSeatChangeNotificationService,
        private CommonsSessionStorageService,
        private RetrieveOrderService,
        private AncillariesService,
        private AncillariesTransformer,
        private CommonsAncillariesService,
        private MmBModalService,
        private $filter,
        private $timeout,
        private MonetateUtilsService,
        private MonetateConstants,
        private NewMainHeaderFacade,
        private NewSeatsMapService,
        private IbMmbManageCarbonFootprintInfoService
    ) {
        
    }

    model;
    lastSavedApis;
    bookingInfo;
    emailUpgBidsFlow;
    baggagesTemp;
    speqsTemp;
    quadrigamStatus;
    typeQuadrigam;
    baggagesTrips;
    headerModel;
    headerModelLocal;
    newHeaderModel;
    
    refreshAncillaries = () => {
        const refreshSuccess = () => {
            this.$rootScope.$broadcast('updateBasket');
        }

        const refreshError = (error) => {
            Promise.reject(error);
        }

        this.BookingDashboardService.updateAncillarieSummary().then(refreshSuccess, refreshError);
    };

    /**
     * Open special meals modal for select the meals
     */
    openSpecialMealModal = ($event, segmentId) => {
        let specialMealModel = angular.copy(this.model.ancillariesInfo.specialMealsInfo);
        if(segmentId){
            specialMealModel.isGastronomicProposal = true;
            specialMealModel.gastronomicProposalSegmentId = segmentId;
        }
        this.BookingDashboardSharedUtilsService.closeCollapseHeader();
        this.ModalServiceAncillaries.openSpecialMealsModal(specialMealModel).result.then(() => {
        }, angular.noop);
        this.CommonsUtilService.setTitlePage('MMB_TITLE_UPDATE_SPECIAL_MEALS');
        this.MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOMEAL, MMBDatalayerConstants.DIGITAL_DATA_STEP.MOMEAL, this.MmBAppConstants.QUADRIGAM.ANC_SPECIAL_MEALS_OPEN_MODAL);
    };
    
    updateDataInsurance = () => {
        const changesInsurage = angular.copy(this.model.ancillariesInfo);
        this.model.ancillariesInfo = this.model.ancillariesInfoOld;
        this.resetInsuranceInfo();
        this.model.ancillariesInfo.insuranceInfo.insuranceCountry = this.model.insuranceCountryOld;
        this.$rootScope.$broadcast('refreshInsuranceInfo', changesInsurage);
    };

    resetInsuranceInfo = () => {
        if (!this.model.ancillariesInfo.insuranceInfo) {
            this.model.ancillariesInfo.insuranceInfo = {};
        };
    };

    handleDashboardAncillariesInfo() {
        if (this.model.ancillariesInfo) {
            this.handleInitAncillariesInfo();
        }
    };

    private handleInitAncillariesInfo() {
        this.initBaggagesInfo();
        this.initSpeqsInfo();
        this.initPriorityBoardingInfo();
    };

    private initBaggagesInfo() {
        if (this.baggagesTrips) {
            this.updateBaggages();
            this.model.ancillariesInfo.passengerBaggagesTrips = this.baggagesTrips;
            if (this.headerModelLocal?.shoppingBasket?.baggages?.amount) {
                this.model.ancillariesInfo.baggagesQuanty = this.headerModelLocal.shoppingBasket.baggages.amount;
            } else {
                this.model.ancillariesInfo.baggagesQuanty = this.AncillariesService.calculateTotalBaggages(this.model.ancillariesInfo.passengerBaggagesTrips);
            }
        }
    };

    private initSpeqsInfo() {
        if (this.headerModelLocal?.headerModel?.shoppingBasket?.speqs?.hasSpeqs) {
            this.updateSpeqs();
            
            this.model.ancillariesInfo.speqsQuanty = 0;
            const speqsSegments = this.headerModelLocal.headerModel.shoppingBasket.speqs.segments;
            for (let i = 0; i < speqsSegments.length; i++) {
                for (let j = 0; j < speqsSegments[i].speqs.length; j++) {
                    this.model.ancillariesInfo.speqsQuanty += speqsSegments[i].speqs[j].quanty;
                }
            }
        }
    };

    private initPriorityBoardingInfo() {
        if (this.headerModelLocal?.headerModel?.shoppingBasket?.priorityBoarding?.hasPriorityBoarding) {
            const update = this.buildPriorityBoardingUpdate();
            if (!this.localStorageService.get('pmtMthdsBidsTransformed')) {
                this.localStorageService.set('ancillariesPutAfterUpgBids', true);
            }
            this.CommonsAncillariesService.updateAncillaries(update).then(
                () => this.handlePriorityBoardingSuccess(),
                (error) => this.handlePriorityBoardingError(error)
            );
        }
    }

    private buildPriorityBoardingUpdate() {
        return [{
            type: this.AncillariesConstants.TYPE_ANCILLARIE.PRIORITY_BOARDING,
            segments: this.localStorageService.get('prioritySegmentPutRequest')
        }];
    };

    private handlePriorityBoardingSuccess() {
        this.model.ancillariesInfo.priorityBoardingInfo.confirmed = true;
        this.model.ancillariesInfo.priorityBoardingInfo.info = this.localStorageService.get('selectedPriorityBoarding');
    };

    private handlePriorityBoardingError(error) {
        this.ModalServiceAncillaries.isNotWaiting();
        if (this.localStorageService.get('pmtMthdsBidsTransformed') && this.localStorageService.get('ancillariesPutAfterUpgBids')) {
            this.MmBModalService.showGenericInfoModal(
                {
                    title: this.$filter('translate')('MODAL_ANCILLARIES_PUT_ERROR_TITLE'),
                    message: 'MODAL_ANCILLARIES_PUT_ERROR_INFO',
                    needsTranslate: true,
                    idModal: MMBDatalayerConstants.DATALAYER_MODAL_ID.PENDING_PEYMENTS
                },
                false,
                'generic-error-modal'
            ).result.then(() => {}, angular.noop);
        } else {
            this.ModalServiceAncillaries.showGenericError(error).result.then(angular.noop, angular.noop);
        }
        this.localStorageService.set('selectedPriorityBoarding', null);
        this.localStorageService.set('totalPricePriorityBoarding', 0);
        this.model.ancillariesInfo.priorityBoardingInfo.confirmed = false;
        this.NewMainHeaderFacade.updateBasketPriority('');
    };

    checkAncillariesDeppLink = () => {
        const ancillariesInfo = this.localStorageService.get('ancillariesInfo');
        if (!ancillariesInfo) return;
        const params = [
            { name: 'seat', handler: () => this.handleAncillarySeat(ancillariesInfo) },
            { name: 'baggage', handler: () => this.handleAncillaryBaggage(ancillariesInfo) },
            { name: 'speq', handler: () => this.handleAncillarySpeq(ancillariesInfo) },
            { name: 'priority', handler: () => this.handleAncillaryPriority(ancillariesInfo) },
            { name: 'insurance', handler: () => this.handleAncillaryInsurance(ancillariesInfo) },
            { name: 'bid', handler: () => this.handleAncillaryBid(ancillariesInfo) },
            { name: 'transfer', handler: () => this.handleAncillaryTransfer(ancillariesInfo) },
            { name: 'activity', handler: () => this.handleAncillaryActivity(ancillariesInfo) }
        ];
        const found = params.find(p => this.MmBUtilService.getParameterByName(p.name));
        if (found) {
            this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.customize);
            found.handler();
        }
    };

    private handleAncillarySeat(ancillariesInfo) {
        for (let i = 0; i < ancillariesInfo.ancillaries.length; i++) {
            if (ancillariesInfo.ancillaries[i].type === this.AncillariesConstants.TYPE_ANCILLARIE.SEAT && ancillariesInfo.ancillaries[i].status.code === this.BookingDashboardConstants.ANCILLARIES_STATUS.AVAILABLE) {
                this.openSeatMap(null, null);
            }
        }
    };
    private handleAncillaryBaggage(ancillariesInfo) {
        for (let i = 0; i < ancillariesInfo.ancillaries.length; i++) {
            if (ancillariesInfo.ancillaries[i].type === this.AncillariesConstants.TYPE_ANCILLARIE.BAGGAGE && ancillariesInfo.ancillaries[i].status.code === this.BookingDashboardConstants.ANCILLARIES_STATUS.AVAILABLE) {
                this.openBaggages();
            }
        }
    };
    private handleAncillarySpeq(ancillariesInfo) {
        for (let i = 0; i < ancillariesInfo.ancillaries.length; i++) {
            if (ancillariesInfo.ancillaries[i].type === this.AncillariesConstants.TYPE_ANCILLARIE.SPEQS && ancillariesInfo.ancillaries[i].status.code === this.BookingDashboardConstants.ANCILLARIES_STATUS.AVAILABLE) {
                this.openSpeqs();
            }
        }
    };
    private handleAncillaryPriority(ancillariesInfo) {
        for (let i = 0; i < ancillariesInfo.ancillaries.length; i++) {
            if (ancillariesInfo.ancillaries[i].type === this.AncillariesConstants.TYPE_ANCILLARIE.PRIORITY_BOARDING && ancillariesInfo.ancillaries[i].status.code === this.BookingDashboardConstants.ANCILLARIES_STATUS.AVAILABLE) {
                this.openPriorityBoarding();
            }
        }
    };
    private handleAncillaryInsurance(ancillariesInfo) {
        for (let i = 0; i < ancillariesInfo.ancillaries.length; i++) {
            if (ancillariesInfo.ancillaries[i].type === this.AncillariesConstants.TYPE_ANCILLARIE.INSURANCE && ancillariesInfo.ancillaries[i].status.code === this.BookingDashboardConstants.ANCILLARIES_STATUS.AVAILABLE) {
                this.openInsuranceModal();
            }
        }
    };
    private handleAncillaryBid(ancillariesInfo) {
        for (let i = 0; i < ancillariesInfo.ancillaries.length; i++) {
            if (this.hasUpgradingBID(ancillariesInfo, i)) {
                this.emailUpgBidsFlow = true;
                this.BookingDashboardSharedUtilsService.handleUpgradeFlow();
            }
        }
    };
    private handleAncillaryTransfer(ancillariesInfo) {
        for (let i = 0; i < ancillariesInfo.ancillaries.length; i++) {
            if (ancillariesInfo.ancillaries[i].type === this.AncillariesConstants.TYPE_ANCILLARIE.GLOBICK && ancillariesInfo.ancillaries[i].status.code === this.BookingDashboardConstants.ANCILLARIES_STATUS.AVAILABLE) {
                this.openTransfersModal();
            }
        }
    };
    private handleAncillaryActivity(ancillariesInfo) {
        for (let i = 0; i < ancillariesInfo.ancillaries.length; i++) {
            if (ancillariesInfo.ancillaries[i].type === this.AncillariesConstants.TYPE_ANCILLARIE.GLOBICK && ancillariesInfo.ancillaries[i].status.code === this.BookingDashboardConstants.ANCILLARIES_STATUS.AVAILABLE) {
                this.openActivitiesModal();
            }
        }
    };

    private hasUpgradingBID = (ancillariesInfo, i) => {
        return (ancillariesInfo.ancillaries[i].type === this.AncillariesConstants.TYPE_ANCILLARIE.UPGRADING_BID && ancillariesInfo.ancillaries[i].status.code === this.BookingDashboardConstants.ANCILLARIES_STATUS.AVAILABLE && !this.emailUpgBidsFlow && this.localStorageService.get('urlBidFlow') !== true);
    };

    /**
     * Open seat map modal
     * @param {Object} evt Object event
     * @param {String} segmentId Id of segment to open seat map
     */
    openSeatMap = (evt, segmentId) => {
        let seatChangeVar;
        this.BookingDashboardSharedUtilsService.closeCollapseHeader();
        this.model.isLoaded = false;
        if (this.model.seatChangeConditions) {
            this.UpdateSeatChangeNotificationService.callUpdateSeatChangeNotification(this.localStorageService.get('flowId')).then(angular.noop, angular.noop);
            seatChangeVar = this.localStorageService.get('disruptionSeatChangeCapabilities');
            seatChangeVar.message.showInPageDetailTrip = false;
            this.localStorageService.set('disruptionSeatChangeCapabilities', seatChangeVar);
        }
        this.MmBAncillariesUtilsService.setSegmentInfo({ segmentId: segmentId ? segmentId : this.localStorageService.get('seatsAvailableSegments')[0], pasId: this.localStorageService.get('ancillariesAvailablePassengers')[0] });
       
        this.ModalServiceAncillaries.openSeatNewMapModal({ seatMapInfo: this.model }).result.then(() => {
            this.RetrieveOrderService.retrieveOrderByCheckinId(this.localStorageService.get('flowId')).then(this.retrieveOrderSucces, this.retrieveOrderError);
        }, this.retrieveOrderError);
    };

    private retrieveOrderSucces = (response) => {
        this.localStorageService.set('bookingInfo', response);
        this.checkSeatsQuantity();
        this.model.ancillariesInfo.isModifySeat = this.model.ancillariesInfo.seatsQuanty > 0;
        ////[Selección de asientos] Actualizamos el objeto digital_data que no se estaba actualizando 
        // y actualizamos el Quadrigam por MOANCI cuando cerramos la modal y lanzamos el evento view
        this.MmBDatalayerUtilsService.setAncillariesDatalayer();
        const updateQuadrigam = true;
        this.AncillariesService.closeAncillaryModal(updateQuadrigam);
    };

    private retrieveOrderError = () => {
        this.checkSeatsQuantity();
    };

    checkSeatsQuantity =() => {
        const seatConfirmationInfo = this.MmBAncillariesUtilsService.getSeatInfoConfirmation();
        const totalSeatsChanged = this.AncillariesService.calculateTotalSeats(seatConfirmationInfo?.segments);
        if (totalSeatsChanged > 0) this.model.ancillariesInfo.seatsQuanty = totalSeatsChanged;
        this.localStorageService.set('seatsQuanty', this.model.ancillariesInfo.seatsQuanty);
        // this.MmBAncillariesUtilsService.removeSeatInfoConfirmation();
    };

    /**
     * Open baggages modal for select baggages for passenger
     */
    openBaggages = () => {
        this.localStorageService.set('close', this.MmBAppConstants.QUADRIGAM.CUSTOMIZE_FLIGHTS);
        const copyPassengerBaggagesTrips = angular.copy(this.model.ancillariesInfo.passengerBaggagesTrips);
        this.BookingDashboardSharedUtilsService.closeCollapseHeader();
        const updateQuadrigam = true;
        this.ModalServiceAncillaries.openBaggagesModal({ passengers: copyPassengerBaggagesTrips, isCurrencyLong: this.model.isCurrencyLong }).result
        .then(() => {
            this.model.ancillariesInfo.passengerBaggagesTrips = copyPassengerBaggagesTrips;
            this.baggagesTemp = this.localStorageService.get('passengerBaggagesTrips');
            this.saveBaggagesTrips();
            this.updateBaggages();
            this.model.ancillariesInfo.baggagesQuanty = this.AncillariesService.calculateTotalBaggages(this.model.ancillariesInfo.passengerBaggagesTrips);
            this.$rootScope.$broadcast('updateHeaderBaggages', this.model.ancillariesInfo.passengerBaggagesTrips);
            this.MmBDatalayerUtilsService.setAncillariesDatalayer();
            ////[Maletas] Actualizamos el Quadrigam por MOANCI cuando cerramos la modal y lanzamos el evento view            
            this.AncillariesService.closeAncillaryModal(updateQuadrigam);
        }, () => {            
            this.AncillariesService.closeAncillaryModal(updateQuadrigam)
        });
    };

    private saveBaggagesTrips = () => {
        this.localStorageService.set('passengerBaggagesTrips', this.model.ancillariesInfo.passengerBaggagesTrips);
    };

    private updateBaggages = (): void => {
        const baggages = this.localStorageService.get('passengerBaggagesTrips');
        const infoBaggages = this.AncillariesTransformer.buildAncillariesRequest(baggages, null, null);
        if (this.hasBaggageChoosed(baggages)) {
            this.handleUpdateAncillariesBaggages(infoBaggages);
        } else {
            this.handleDeleteAncillariesBaggages();
        }
    };

    private hasBaggageChoosed(baggages) {
        let found = false;
        angular.forEach(baggages, (baggage) => {
            angular.forEach(baggage.trips, (trip) => {
                if (trip.piecesChoosed > 0) {
                    found = true;
                }
            });
        });
        return found;
    };

    private handleUpdateAncillariesBaggages(infoBaggages) {
        if (!this.localStorageService.get('pmtMthdsBidsTransformed')) {
            this.localStorageService.set('ancillariesPutAfterUpgBids', true);
        }
        this.ModalServiceAncillaries.showWaitingModal();
        this.CommonsAncillariesService.updateAncillaries(infoBaggages).then((data) => {
            this.updateDatalayer();
            this.ModalServiceAncillaries.isNotWaiting();
        }, (error) => {
            this.updateDatalayer();
            this.ModalServiceAncillaries.isNotWaiting();
            if (this.localStorageService.get('pmtMthdsBidsTransformed') && this.localStorageService.get('ancillariesPutAfterUpgBids')) {
                this.MmBModalService.showGenericInfoModal({title: this.$filter('translate')('MODAL_ANCILLARIES_PUT_ERROR_TITLE'), message: 'MODAL_ANCILLARIES_PUT_ERROR_INFO', needsTranslate: true, idModal: MMBDatalayerConstants.DATALAYER_MODAL_ID.PENDING_PEYMENTS }, false, 'generic-error-modal').result.then(() => {
                }, angular.noop);
            } else {
                this.ModalServiceAncillaries.showGenericError(error).result.then(angular.noop, angular.noop);
            }
            angular.forEach(this.model.ancillariesInfo.passengerBaggagesTrips, (baggage) => {
                angular.forEach(baggage.trips, (trip) => {
                    trip.piecesChoosed = 0;
                    trip.totalBaggages = 0;
                    trip.totalPrice = 0;
                    angular.forEach(trip.pieces, (piece) => {
                        piece.quantySelected = 0;
                    });
                });
            });
            this.model.ancillariesInfo.baggagesQuanty = 0;
            this.localStorageService.remove('passengerBaggagesTrips');
            this.localStorageService.remove('genAviosAncillariesBaggages');
            this.$rootScope.$broadcast('updateHeaderBaggages', null);
        });
    };

    private updateDatalayer = (isActivate?:boolean): void => {
        const confirmationDigitalInfo = this.localStorageService.get('confirmationDigitalInfo') || {};
        const confirmationDatalayerInfo: any = this.localStorageService.get('confirmationDatalayerInfo') || {};
        const ancillariesInfo: any = this.localStorageService.get('ancillariesInfo') || {};
        confirmationDigitalInfo.Currency = ancillariesInfo?.currencies?.[0]?.code ?? null;
        this.quadrigamStatus = this.MmBAncillariesUtilsService.checkEarlyFlights(this.localStorageService.get('bookingInfo'), this.localStorageService.get('ancillariesAvailableSegments'));
        // this.quadrigamStatus ? this.typeQuadrigam = this.MmBAppConstants.QUADRIGAM.EARLY_ANCILLARIES : this.typeQuadrigam = this.MmBAppConstants.QUADRIGAM.ANCILLARIES;
        this.typeQuadrigam = this.MmBAppConstants.QUADRIGAM.CUSTOMIZE_YOUR_TRAVEL;

        /* INIT DELETE GA4 MIGRATION*/
        this.MmBDatalayerUtilsService.updateDatalayerWithQuadrigam(this.typeQuadrigam, confirmationDatalayerInfo, this.MmBUtilService.isUserLogged());
        /* FINISH DELETE GA4 MIGRATION*/
        this.MmBDatalayerUtilsService.updateDigitalDataWithQuadrigam(this.typeQuadrigam, confirmationDigitalInfo, this.MmBUtilService.isUserLogged());
        if (isActivate) {
            this.MonetateUtilsService.updateMonetateWithQuadrigam(this.MonetateConstants.MONETATE_INFO.SETPAGETYPE, this.typeQuadrigam);
            this.$timeout(() => {
                this.$rootScope.$broadcast('sendUpdateToMonetate');
            });
        }
        this.$rootScope.$broadcast('updateDatalayer');
        this.$rootScope.$broadcast('updateDigitalData');
    };

    private handleDeleteAncillariesBaggages() {
        let deleteInfo;
        const deleteInfoArray = [];
        angular.forEach(this.baggagesTemp, (data) => {
            deleteInfo = this.AncillariesTransformer.buildDeleteAllAncillariesBaggageRequest(data, 'BAGGAGE', this.baggagesTemp);
            if (deleteInfo.length > 0) {
                deleteInfoArray.push(deleteInfo);
            }
        });
        if (deleteInfoArray.length > 1) {
            deleteInfo = this.AncillariesTransformer.mergePassengerItemsForDelete(deleteInfoArray);
        } else {
            deleteInfo = deleteInfoArray[0];
        }
        if (deleteInfo && deleteInfo.length > 0) {
            this.ModalServiceAncillaries.showWaitingModal();
            this.CommonsAncillariesService.deleteAncillarie(deleteInfo).then((data) => {
                this.ModalServiceAncillaries.isNotWaiting();
            }, (error) => {
                this.ModalServiceAncillaries.isNotWaiting();
                this.ModalServiceAncillaries.showGenericError(error).result.then(angular.noop, angular.noop);
            });
        }
    };
    
    openSpeqs = () => {
        this.localStorageService.set('ancillariesAction', 'click');
        const passengerSpeqsTrips = this.localStorageService.get('passengerSpeqsTrips');
        if (passengerSpeqsTrips) this.model.ancillariesInfo.passengerSpeqsTrips = passengerSpeqsTrips;
        const copyPassengersSpeqsTrips = angular.copy(this.model.ancillariesInfo.passengerSpeqsTrips);
        this.BookingDashboardSharedUtilsService.closeCollapseHeader();
        this.ModalServiceAncillaries.openSpeqsModal({ passengers: copyPassengersSpeqsTrips, quantySelected: this.model.ancillariesInfo.speqsQuanty, isCurrencyLong: this.model.isCurrencyLong }).result.then(() => {
            this.model.ancillariesInfo.passengerSpeqsTrips = copyPassengersSpeqsTrips;
            this.speqsTemp = this.localStorageService.get('passengerSpeqsTrips');
            this.saveSpeqsTrips();
            this.updateSpeqs();
            this.model.ancillariesInfo.speqsQuanty = this.AncillariesService.calculateTotalSpeqs(this.model.ancillariesInfo.passengerSpeqsTrips);
            this.$rootScope.$broadcast('updateHeaderSpeqs', angular.copy(this.model.ancillariesInfo.passengerSpeqsTrips));
           
            this.MmBDatalayerUtilsService.setAncillariesDatalayer();
            ////[Equipajes Especiales] Actualizamos el Quadrigam por MOANCI cuando cerramos la modal y lanzamos el evento view
            const updateQuadrigam = true;
            this.AncillariesService.closeAncillaryModal(updateQuadrigam);
    
        }, angular.noop);
    };

    private saveSpeqsTrips = () => {
        this.localStorageService.set('passengerSpeqsTrips', this.model.ancillariesInfo.passengerSpeqsTrips);
    };

    private updateSpeqs = (): void => {
        const speqs = this.localStorageService.get('passengerSpeqsTrips');
        const infoSpeqs = this.AncillariesTransformer.buildAncillariesRequest(null, speqs, null);
        if (this.hasSpeqsChoosed(speqs)) {
            this.handleUpdateAncillariesSpeqs(infoSpeqs);
        } else {
            this.handleDeleteAncillariesSpeqs();
        }
    };

    private hasSpeqsChoosed(speqs) {
        return Array.isArray(speqs) && speqs.some(speq => this.tripsHasSpeqsChoosed(speq.trips));
    };

    private tripsHasSpeqsChoosed(trips) {
        return Array.isArray(trips) && trips.some(trip => trip.speqsChoosed > 0);
    };
    private handleUpdateAncillariesSpeqs(infoSpeqs) {
        if (!this.localStorageService.get('pmtMthdsBidsTransformed')) {
            this.localStorageService.set('ancillariesPutAfterUpgBids', true);
        }
        this.ModalServiceAncillaries.showWaitingModal();
        this.CommonsAncillariesService.updateAncillaries(infoSpeqs).then(
            () => this.ModalServiceAncillaries.isNotWaiting(),
            (error) => this.handleAncillariesSpeqsError(error)
        );
    };

    private handleAncillariesSpeqsError(error) {
        this.ModalServiceAncillaries.isNotWaiting();
        if (this.localStorageService.get('pmtMthdsBidsTransformed') && this.localStorageService.get('ancillariesPutAfterUpgBids')) {
            this.MmBModalService.showGenericInfoModal(
                {
                    title: this.$filter('translate')('MODAL_ANCILLARIES_PUT_ERROR_TITLE'),
                    message: 'MODAL_ANCILLARIES_PUT_ERROR_INFO',
                    needsTranslate: true,
                    idModal: MMBDatalayerConstants.DATALAYER_MODAL_ID.PENDING_PEYMENTS
                },
                false,
                'generic-error-modal'
            ).result.then(() => {}, angular.noop);
        } else {
            this.ModalServiceAncillaries.showGenericError(error).result.then(angular.noop, angular.noop);
        }
        angular.forEach(this.model.ancillariesInfo.passengerSpeqsTrips, (speq) => {
            angular.forEach(speq.trips, (trip) => {
                trip.speqsChoosed = 0;
                trip.totalPrice = 0;
            });
        });
        this.model.ancillariesInfo.speqsQuanty = 0;
        this.localStorageService.remove('passengerSpeqsTrips');
        this.localStorageService.remove('genAviosAncillariesSpeq');
        this.$rootScope.$broadcast('updateHeaderSpeqs', null);
    };

    private handleDeleteAncillariesSpeqs() {
        let deleteInfo;
        const deleteInfoArray = [];
        angular.forEach(this.speqsTemp, (data) => {
            deleteInfo = this.AncillariesTransformer.buildDeleteAllAncillariesBaggageRequest(data, 'SPECIAL_EQUIPMENT', this.speqsTemp);
            if (deleteInfo.length > 0) {
                deleteInfoArray.push(deleteInfo);
            }
        });
        if (deleteInfoArray.length > 1) {
            deleteInfo = this.AncillariesTransformer.mergePassengerItemsForDelete(deleteInfoArray);
        } else {
            deleteInfo = deleteInfoArray[0];
        }
        if (deleteInfo && deleteInfo.length > 0) {
            this.ModalServiceAncillaries.showWaitingModal();
            this.CommonsAncillariesService.deleteAncillarie(deleteInfo).then((data) => {
                this.ModalServiceAncillaries.isNotWaiting();
            }, (error) => {
                this.ModalServiceAncillaries.isNotWaiting();
                this.ModalServiceAncillaries.showGenericError(error).result.then(angular.noop, angular.noop);
            });
        }
    };

    openTransfersModal = () => {
        this.localStorageService.set('close', this.MmBAppConstants.QUADRIGAM.CUSTOMIZE_FLIGHTS);
        const infoModal = this.model.ancillariesInfo.ancillariesTransfersGlobick;
        this.BookingDashboardSharedUtilsService.closeCollapseHeader();
        this.ModalServiceAncillaries.openTransfersModal(infoModal);
    };

    openActivitiesModal = (): void => {
        this.localStorageService.set('close', this.MmBAppConstants.QUADRIGAM.CUSTOMIZE_FLIGHTS);
        const infoModal = this.model?.ancillariesInfo.ancillariesActivitiesGlobick;
        this.BookingDashboardSharedUtilsService.closeCollapseHeader();
        this.ModalServiceAncillaries.openActivitiesModal(infoModal);
    };

    deleteSpeqs = (evt, segmentId, speqTypeSelected) => {
        angular.forEach(this.model.ancillariesInfo.passengerSpeqsTrips, (passenger) => {
            angular.forEach(passenger.trips, (trip) => {
                if (trip.id === segmentId) {
                    angular.forEach(trip.pieces, (piece) => {
                        if (piece.subtype === speqTypeSelected) {
                            this.model.ancillariesInfo.speqsQuanty -= piece.quantySelected;
                            trip.speqsChoosed -= piece.quantySelected;
                            piece.quantySelected = 0;
                        }
                    });
                }
            });
        });
        this.AncillariesService.deleteAviosAncillaries(segmentId, this.AncillariesConstants.TYPE_ANCILLARIE.SPEQS, speqTypeSelected);
        this.model.ancillariesInfo.speqsQuanty = this.AncillariesService.countSpeqsTotal(this.model.ancillariesInfo.passengerSpeqsTrips);
        this.MmBAncillariesUtilsService.calculatePiecesSpeqsTrip(this.model.ancillariesInfo.passengerSpeqsTrips);
        this.saveSpeqsTrips();
        this.refreshAncillaries();
    };

    /**
         *  Delete baggages of segment selected on basket and update quanty on model
         * @param {Object} evt Object event
         * @param {String} segmentId Id of segment
         * @param {String} baggageTypeSelected Type of baggage
         */
        deleteBaggages = (evt, segmentId, baggageTypeSelected) => {
            angular.forEach(this.model.ancillariesInfo.passengerBaggagesTrips, (passenger) => {
                angular.forEach(passenger.trips, (trip) => {
                    if (trip.id === segmentId) {
                        angular.forEach(trip.pieces, (piece) => {
                            if (piece.subtype === baggageTypeSelected) {
                                this.model.ancillariesInfo.baggagesQuanty -= piece.quantySelected;
                                trip.piecesChoosed -= piece.quantySelected;
                                piece.quantySelected = 0;
                            }
                        });
                    }
                });
            });
            this.AncillariesService.deleteAviosAncillaries(segmentId, this.AncillariesConstants.TYPE_ANCILLARIE.BAGGAGE, baggageTypeSelected);
            this.model.ancillariesInfo.baggagesQuanty = this.AncillariesService.countBaggageTotal(this.model.ancillariesInfo.passengerBaggagesTrips);
            this.MmBAncillariesUtilsService.calculatePiecesBaggageTrip(this.model.ancillariesInfo.passengerBaggagesTrips);
            this.saveBaggagesTrips();
            this.refreshAncillaries();
        }
    
       
    
    /**
     *  Delete seats of segments selecteds on basket and update quanty on model
     * @param {Object} evt Event object
     * @param {Object} seatsDeleted Amount of seats deleted and new seat returned by service
     */
    deleteSeats = (evt, seatsDeleted) => {
        const idDeleteSegment = seatsDeleted?.seats[0]?.segments[0].id || null;
        this.decrementSeatsQuanty(seatsDeleted.amount);
        this.updateSeatsCache(seatsDeleted);
        this.handleDeleteSeat(seatsDeleted);
        this.resetSeatsQuantyIfZero();
        this.updateSeatsQuantyInStorage();
        this.updateSeatmapDeleteSeat(idDeleteSegment, seatsDeleted);
    };

    private decrementSeatsQuanty(amount) {
        this.model.ancillariesInfo.seatsQuanty -= amount;
    };

    private updateSeatsCache(seatsDeleted) {
        const updateSeatsInfo = this.AncillariesService.getUpdateSeatInfo(seatsDeleted);
        this.MmBAncillariesUtilsService.updateSegmentSeatCachedInfo(updateSeatsInfo);
    };

    private handleDeleteSeat(seatsDeleted) {
        if (seatsDeleted && seatsDeleted.seats[0].type === this.AncillariesConstants.TYPE_ANCILLARIE.SEAT) {
            this.updateDeleteSeat(seatsDeleted);
        };
    };

    private resetSeatsQuantyIfZero() {
        if (this.model.ancillariesInfo.seatsQuanty === 0) {
            const order = this.localStorageService.get('bookingInfo');
            this.model.ancillariesInfo.seatsQuanty = this.AncillariesService.countSeatsTotal(order.order.orderItems);
        };
    };

    private updateSeatsQuantyInStorage() {
        this.localStorageService.set('seatsQuanty', this.model.ancillariesInfo.seatsQuanty);
    };

    private updateSeatmapDeleteSeat(idDeleteSegment, seatsDeleted) {
        this.NewSeatsMapService.updateNewSeatmapDeleteSeat(idDeleteSegment, seatsDeleted?.seats[0]?.segments[0].passengers);
    };

    cleanPriorityBoarding = () => {
        this.localStorageService.set('selectedPriorityBoarding', null);
        this.localStorageService.set('totalPricePriorityBoarding', 0);
        this.model.ancillariesInfo.priorityBoardingInfo.confirmed = false;
        this.refreshAncillaries();
    };

    deleteCarbonFootprintAncillary = (evt) => {
        return this.AncillariesService.deleteCarbonFootprint().then(() => {
            this.cleanCarbonFootprintAncillary(null);
            this.AncillariesService.deleteCarbonFootprintFromBasket();
        }, angular.noop);
    };

    cleanCarbonFootprintAncillary = (evt) => {
        this.model.ancillariesInfo.ancillariesCarbonFootprint.confirmed = false;
    };
    
    openPriorityBoarding = () => {
        this.BookingDashboardSharedUtilsService.closeCollapseHeader();
        this.localStorageService.set('ancillariesAction', 'click');
         const updateQuadrigam = true;
        this.ModalServiceAncillaries.openPriorityBoardingModal({ model: this.model.ancillariesInfo.priorityBoardingInfo }).result
        
        .then(() => {
            this.localStorageService.set('ancillariesAction', 'addtocart');
            //TODO: Se observa que el servicio de accept de la modal de embarque prioritario no devuelve una promesa por lo que nunca pasa por aqui, cambiar en ancillaries
            ////[Priority Boarding] actualizamos el quadrigam y lanzamos el evento view con digital_data actualizado
            this.AncillariesService.closeAncillaryModal(updateQuadrigam);
        }, 
        () => {
            ////[Priority Boarding] actualizamos el quadrigam y lanzamos el evento view con digital_data actualizado
            this.AncillariesService.closeAncillaryModal(updateQuadrigam);
        });
    };

    /**
     * Open insurance modal for select the insurance
     */
    openInsuranceModal = () => {
        let insuranceModel = angular.copy(this.model.ancillariesInfo), insuranceCountry = angular.copy(this.model.ancillariesInfo.insuranceInfo.insuranceCountry);
        this.openInsuranceModalInit(insuranceModel, insuranceCountry);
        this.ModalServiceAncillaries.openInsuranceModal(insuranceModel, 'ib-modal-insurance.html').result.then(() => {
            this.openInsuranceModalSuccess();
            this.$rootScope.$broadcast('updateHeaderInsurance', this.model.ancillariesInfo.selectedInsurance);
        });
    };

    private openInsuranceModalInit = (insuranceModel, insuranceCountry) => {  
        this.BookingDashboardSharedUtilsService.closeCollapseHeader();
        this.model.ancillariesInfo = insuranceModel;
        this.model.ancillariesInfoOld = insuranceModel;
        
        if (!insuranceCountry || typeof insuranceCountry !== 'object') {
            insuranceCountry = { country: {} };
        } else if (!insuranceCountry.country) {
            insuranceCountry.country = {};
        }
        this.model.insuranceCountryOld = insuranceCountry;  
    };

    /**
     * Open insurance modal for select the insurance
     */
    openInsuranceAllianzFusionModal = () => {
        let insuranceModel = angular.copy(this.model.ancillariesInfo), insuranceCountry = angular.copy(this.model.ancillariesInfo.insuranceInfo.insuranceCountry);
        this.openInsuranceModalInit(insuranceModel, insuranceCountry);
        this.ModalServiceAncillaries.openInsuranceMMBAllianzFusionModal(insuranceModel.insuranceInfo, 'ib-modal-mmb-insurance-allianz-fusion.html').result.then(() => {
            this.openInsuranceModalSuccess();
        });
    };

    private openInsuranceModalSuccess = () => {
        const selectedInsuranceModel = angular.copy(this.model.ancillariesInfo);
        this.model.ancillariesInfo = selectedInsuranceModel;
        this.model.ancillariesInfoOld = selectedInsuranceModel;
        this.localStorageService.set('insuranceSelected', this.model.ancillariesInfo.selectedInsurance);
        this.MmBDatalayerUtilsService.setAncillariesDatalayer();
    };

    specialMealsNavigation = (event, data) => {
        this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.customize);
        this.model.ancillariesInfo.specialMealsInfo.activeSegment = data;
        this.openSpecialMealModal(null, null); //REVIEW
    };

    speqsNavigation = () => {
        this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.customize);
        this.openSpeqs();
    };

    ancillariesBaggageNavigation = () => {
        this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.customize);
        this.openBaggages();
    };

    ancillariesSeatsNavigation = (event, segmentInfo) => {
        //Avisar al servicio de "no muestres m�s el mensaje de asientos"
        this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.customize);
        this.openSeatMap(event, segmentInfo.segmentId);
    };

    goToCustomize = () => {
        this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.customize);
        this.openPriorityBoarding();
    };

    private updateDeleteSeat = (seatsDeleted) => {
        const segmentDeleted = seatsDeleted.seats[0].segments[0];
        this.clearSeatsSelectedInfoData(segmentDeleted);
        this.clearSeatInfoConfirmation(segmentDeleted);
        this.clearSegmentStatusForDeleted(segmentDeleted);
        if (seatsDeleted.deleteAll !== true) {
            this.refreshAncillaries();
        }
    };

    private clearSeatsSelectedInfoData(segmentDeleted: any): void {
    const seatsLocalStorage =
        this.localStorageService.get('seatsSelectedInfoData') || {};

    if (!this.hasSeatsLocalStorage(seatsLocalStorage, segmentDeleted)) {
        return;
    }

    const segData = seatsLocalStorage[segmentDeleted.id];
    const deletedIds = this.buildDeletedIds(segmentDeleted);

    this.clearPassengersInfoSeats(segData, deletedIds);
    this.clearPassengersSeats(segData, deletedIds);

    this.localStorageService.set('seatsSelectedInfoData', seatsLocalStorage);
}

    private buildDeletedIds(segmentDeleted: any): Set<string> {
        return new Set((segmentDeleted.passengers || []).map((p: any) => String(p.id)));
    }

    private clearPassengersInfoSeats(segData: any, deletedIds: Set<string>): void {
        (segData.passengersInfo || []).forEach((passenger: any, index: number) => {
            if (!deletedIds.has(String(passenger.id))) {
                return;
            }

            const cabinTemp = segData.passengersInfo[index].currentSeat.cabinIndex;

            segData.passengersInfo[index].currentSeat = {
                row: '',
                column: '',
                cabinIndex: cabinTemp,
                rowIndex: 0,
                columnIndex: 0,
                seatTypeDescription: '',
                seatType: ''
            };
        });
    }

    private clearPassengersSeats(segData: any, deletedIds: Set<string>): void {
        (segData.passengers || []).forEach((selection: any, index: number) => {
            if (!deletedIds.has(String(selection.id))) {
                return;
            }

            segData.passengers[index].seat = {
                ...segData.passengers[index].seat,
                row: '',
                column: ''
            };

            if (segData.passengers[index].passengerInfo?.currentSeat) {
                segData.passengers[index].passengerInfo.currentSeat = {
                    ...segData.passengers[index].passengerInfo.currentSeat,
                    row: '',
                    column: ''
                };
            }
        });
    }

    private clearSeatInfoConfirmation(segmentDeleted) {
        const seatInfoConfirmation = this.localStorageService.get('seatInfoConfirmation');
        if (!seatInfoConfirmation?.segments?.length) return;

        const deletedIds = this.getDeletedPassengerIds(segmentDeleted);

        seatInfoConfirmation.segments.forEach((segment) => {
            if (String(segment.id) !== String(segmentDeleted.id)) return;
            segment.passengers.forEach((passenger) => {
                if (!deletedIds.has(String(passenger.id))) return;
                passenger.currentSeat.row = '';
                passenger.currentSeat.column = '';
                passenger.initialSeat.row = '';
                passenger.initialSeat.column = '';
            });
        });

        this.localStorageService.set('seatInfoConfirmation', seatInfoConfirmation);
    }

    private getDeletedPassengerIds(segmentDeleted): Set<string> {
        if (segmentDeleted.passengers) {
            return new Set(segmentDeleted.passengers.map(p => String(p.id)));
        }
        return new Set((segmentDeleted.passengerIds || []).map(id => String(id)));
    }

    private clearSegmentStatusForDeleted(segmentDeleted) {
        if (!segmentDeleted?.passengerIds?.length) return;
        segmentDeleted.passengerIds.forEach(() => {
            this.clearSegmentStatusInFlights(segmentDeleted.id);
            this.clearSegmentStatusInManageSeats(segmentDeleted.id);
            this.clearSegmentStatusInAllSegments(segmentDeleted.id);
        });
    }

    private hasSeatsLocalStorage = (seatsLocalStorage,segmentDeleted) => {
        return (seatsLocalStorage && segmentDeleted.id && seatsLocalStorage[segmentDeleted.id]);
    };

    private clearSegmentStatusInFlights(segmentId) {
        this.model.managementModel.flights.forEach(flight => {
            if (flight.segmentId === segmentId) {
                flight.segmentStatus = '';
            }
        });
    };

    private clearSegmentStatusInManageSeats(segmentId) {
        this.model.managementModel.manageSeats.flights.forEach(flight => {
            if (flight.segmentId === segmentId) {
                flight.segmentStatus = '';
            }
        });
    };

    private clearSegmentStatusInAllSegments(segmentId) {
        for (const segment in this.model.yourFlightsModel.allSegments) {
            if (segment === segmentId) {
                this.model.yourFlightsModel.allSegments[segment].segmentStatus = '';
            }
        }
    };

    deleteInsurance = (evt) => {
        this.model.ancillariesInfo.insurance = null;
        this.model.ancillariesInfo.selectedInsurance = null;
        this.refreshAncillaries();
    };

    deleteAllPendingAncillaries = () => {
        let pendinPaymentFailed;
        this.MmBModalService.showWaitingModal();
        this.CommonsAncillariesService.deleteAllAncillaries().then((cancelData) => {
            this.MmBModalService.finishWaiting();
            this.BookingDashboardService.deleteAllSeats();       //NEED delete all with info headerModel before remove of localstorage
            this.localStorageService.remove('headerModel');
            if (cancelData && cancelData.failedToDelete.length > 0) {
                pendinPaymentFailed = this.MmBAncillariesUtilsService.checkFailedPendingPayments(cancelData);
                this.MmBModalService.finishWaiting();
                this.MmBModalService.showGenericInfoModal({ info: pendinPaymentFailed, message: 'MMB_SOME_PENDING_PAYMENTS_CANCEL_ERROR', needsTranslate: true, idModal: MMBDatalayerConstants.DATALAYER_MODAL_ID.PENDING_PEYMENTS }, false, 'generic-info-modal');
            } else {
            this.BookingDashboardUtilsService.initFacadeHeader();
            }
            this.refreshAncillaries();

        }, () => {
            this.$rootScope.$emit('closeCollapseHeader');
            this.MmBModalService.finishWaiting();
            this.MmBModalService.showGenericInfoModal({ message: 'MMB_PENDING_PAYMENTS_CANCEL_ERROR', needsTranslate: true, idModal: MMBDatalayerConstants.DATALAYER_MODAL_ID.PENDING_PEYMENTS }, false, 'generic-error-modal').result.then(() => {
            }, angular.noop);

        });
    };

    /**
    * Open seat map modal of segement received of modal confirmation
    * @param {Object} evt
    * @param {Integer} segmentId Id of segment
    */
    modifySeatMap = (evt, segmentId) => {
        this.BookingDashboardSharedUtilsService.closeCollapseHeader();
        this.MmBAncillariesUtilsService.setSegmentInfo({ segmentId: segmentId, pasId: this.localStorageService.get('ancillariesAvailablePassengers')[0] });
        this.openSeatMap(null, segmentId);
    };

    customizeFlight = () => {
        let isModify;
        this.localStorageService.set('customizeFlight', true);
        isModify = this.localStorageService.get('modifyFFOrSpecialNeed') ? this.localStorageService.get('modifyFFOrSpecialNeed') : false;
        if (isModify) {
            this.MmBModalService.showWaitingModal();
            this.CommonsAncillariesService.getAncillaries().then(this.getAncillariesSuccess, this.getAncillariesError);
        } else {
            this.model.activeTab = this.model.tabs.customize;
        }
    };


    private getAncillariesSuccess = (ancillariesResponse) => {
        this.$rootScope.cancel = true;
        this.model.activeTab = this.model.tabs.customize;
        this.localStorageService.set('modifyFFOrSpecialNeed', false);
        this.localStorageService.set('ancillariesInfo', ancillariesResponse);
        this.updateAncillaries();
    };

    private updateAncillaries = () => {
        let mmbAncillariesPaymentSummaryModel;
        this.BookingDashboardService.updateAncillariesInfo(this.model.ancillariesInfo.passengerBaggagesTrips, [], this.model.ancillariesInfo.insurance).then(() => {
            this.$rootScope.cancel = true;
            this.model.activeTab = this.model.tabs.customize;
            mmbAncillariesPaymentSummaryModel = this.localStorageService.get('headerModel');
            this.MmBModalService.finishWaiting();
            this.localStorageService.set('mmbAncillariesPaymentSummaryModel', mmbAncillariesPaymentSummaryModel);
        }, (error) => {
            this.$rootScope.cancel = true;
            this.model.activeTab = this.model.tabs.customize;
            this.MmBModalService.showGenericError(error).result.then(angular.noop, angular.noop);
            this.MmBModalService.finishWaiting();
        });
    };

    private getAncillariesError = () => {
        this.$rootScope.cancel = true;
        this.model.activeTab = this.model.tabs.customize;
        this.localStorageService.set('breakdownInfo', null);
        this.localStorageService.set('ancillariesInfo', null);
        this.MmBModalService.finishWaiting();
        this.MmBModalService.showGenericError().result.then(angular.noop, angular.noop);
    };

    /**
     * Check if have pending elements in ordenItems and show modal
     * for accept or decline
     */
    checkPendingPayments = () => {
        this.bookingInfo = this.localStorageService.get('bookingInfo');
        this.headerModelLocal = this.localStorageService.get('headerModel');
        const showModal = this.hasPendingPayments();
        if (showModal) {
            this.openPendingPaymentsModal();
        }
    };

    private hasPendingPayments() {
        if (!this.hasOrderItems()) return false;
        if (!this.hasTotalOriginal()) return false;
        return this.hasAnyPendingPayment();
    };

    private hasOrderItems() {
        return !!(this.bookingInfo?.order?.orderItems?.length);
    };

    private hasTotalOriginal() {
        return !!(this.headerModelLocal?.headerModel?.shoppingBasket?.total?.original);
    };

    private hasAnyPendingPayment() {
        return this.bookingInfo.order.orderItems.some(
            item => item.emd === this.MmBAppConstants.PAYMENT_STATUS.PENDING_PAYMENT
        );
    };

    private openPendingPaymentsModal() {
        this.MmBModalService.showGenericModal(false, 'ib-modal-pending-payment.html', this.model, 'ib-modals ib-modals--md');
    };
    
    handleAlreadyLoadedTimeout() {
        this.$timeout(() => {
            if (this.hasSeatsInBasket()) {
                // this.localStorageService.set('alreadyLoaded', false);
                if (this.hasTotalOriginalHeaderModel()) {
                    this.localStorageService.set('alreadyLoaded', true);
                } else {
                    this.handlePendingPayments();
                }
            }
        });
    };

    private hasSeatsInBasket() {
        const headerModel = this.headerModel;
        return headerModel?.basket?.seats?.length > 0;
};

    private hasTotalOriginalHeaderModel() {
        const headerModel = this.headerModel;
        return headerModel?.headerModel?.shoppingBasket?.total?.original > 0;
};

    private handlePendingPayments() {
        const headerModel = this.headerModel;
        if (headerModel?.basket?.seats) {
            headerModel.basket.seats.forEach(seat => {
                seat.seats?.forEach(s => {
                    s.paymentPassenger = s.passengers;
                    s.freePassenger = [];
                });
            });
        }
        this.NewMainHeaderFacade.updatePendingPaymentItems(headerModel);
        this.checkPendingPayments();
};

    openCarbonFootprintModal = () => {
        this.localStorageService.set('close', this.MmBAppConstants.QUADRIGAM.CUSTOMIZE_FLIGHTS);
        const carbonFootprintModal = this.model.ancillariesInfo.ancillariesCarbonFootprint;
        this.BookingDashboardSharedUtilsService.closeCollapseHeader();
        this.ModalServiceAncillaries.openCarbonFootprintModal(carbonFootprintModal);
    };

    openActivitiesModifyModal = () => {
        this.localStorageService.set('close', this.MmBAppConstants.QUADRIGAM.CUSTOMIZE_FLIGHTS);
        const infoModal = this.model?.ancillariesInfo.ancillariesActivitiesGlobick;
        this.BookingDashboardSharedUtilsService.closeCollapseHeader();
        this.ModalServiceAncillaries.openActivitiesModifyModal(infoModal);
    };

    deleteGlobickActivities = () => {
        this.$rootScope.$broadcast('setDisconfirmedActivities');
    };

    openTransfersModifyModal = () => {
        this.localStorageService.set('close', this.MmBAppConstants.QUADRIGAM.CUSTOMIZE_FLIGHTS);
        const infoModal = this.model.ancillariesInfo.ancillariesTransfersGlobick;
        this.BookingDashboardSharedUtilsService.closeCollapseHeader();
        this.ModalServiceAncillaries.openTransfersModifyModal(infoModal);
    };

    handleInitCarbonFootprintSubscription() {
        this.IbMmbManageCarbonFootprintInfoService.$openTabObser.subscribe((submitState) => {
            if (submitState) {
                this.model.activeTab = angular.copy(this.BookingDashboardConstants.TABS.customize);
                this.openCarbonFootprintModal();
            }
        });
    };

    changesInHeaderModel = (event) => {
        if (this.model.ancillariesInfo && this.newHeaderModel?.shoppingBasket?.seats?.segments) {
            this.model.ancillariesInfo.seatsQuanty = 0;
            angular.forEach(this.newHeaderModel.shoppingBasket.seats.segments, (segmentsOfSeats) => {
                this.model.ancillariesInfo.seatsQuanty += segmentsOfSeats.seats ? segmentsOfSeats.seats.length : 0;
            });
            this.localStorageService.set('seatsQuanty', this.model.ancillariesInfo.seatsQuanty);
        };
    };

    /**
     * Update seats localstoraget
     * @param {Object} evt
     * @param {Object} data
     */
    updateHeaderSeats = (evt, data) => {
        this.updateSeats(data);
    };

    updateSeats = (data) => {
        let objSeat;

        objSeat = {};

        objSeat = this.newSeats(data);
        this.setLocalSeats(objSeat);
    };

    newSeats = (data) => {
        let segmentIdSeat = data.segmentId.toString();
        let seatsSelectedInfoData = this.localStorageService.get('seatsSelectedInfoData') || {};
        seatsSelectedInfoData[segmentIdSeat] = data;
        this.localStorageService.set('seatsSelectedInfoData', seatsSelectedInfoData);

        const objSeat = {
            seats: [],
            segmentId: segmentIdSeat,
            status: ''
        };

        data.passengersInfo.forEach((passenger) => {
            const codeCurrent = passenger.currentSeat.row + passenger.currentSeat.column;
            if (codeCurrent) {
                const status = this.getSeatStatus(passenger);
                objSeat.status = this.updateSeatStatus(objSeat.status, status, data.passengersInfo.length);
                objSeat.seats.push(this.buildSeatObject(passenger));
            }
        });

        return objSeat;
    };

    private getSeatStatus(passenger) {
        return passenger.seatPrice === 0 ? 'free' : 'pending';
    };

    private updateSeatStatus(currentStatus, newStatus, totalPassengers) {
        if (totalPassengers > 0) {
            if (newStatus === 'pending') {
                return 'pending';
            } else if (newStatus === 'free' && currentStatus === 'pending') {
                return 'pending';
            } else {
                return 'free';
            }
        } else {
            return newStatus;
        };
    };

    private buildSeatObject(passenger) {
        const [userName, userSurname] = this.splitName(passenger.name);
        return {
            code: passenger.currentSeat.row + passenger.currentSeat.column,
            codeInitial: passenger.initialSeat.row + passenger.initialSeat.column,
            rowInitial: passenger.initialSeat.row,
            columnInitial: passenger.initialSeat.column,
            codeCurrent: passenger.currentSeat.row + passenger.currentSeat.column,
            rowCurrent: passenger.currentSeat.row,
            columnCurrent: passenger.currentSeat.column,
            id: passenger.id,
            name: passenger.name,
            userName: userName,
            userSurname: userSurname,
            price: passenger.seatPrice,
            selected: !(passenger.seatPrice > 0),
            isShow: !(passenger.seatPrice > 0)
        };
    };

    private splitName(name) {
        const parts = name.split(' ');
        return [parts[0], parts[1] || ''];
    };

    setLocalSeats = (objSeat) => {
        let isModify, seatsLocalStorage, z;

        isModify = false;
        seatsLocalStorage = this.localStorageService.get('updateSeatFlights') ? this.localStorageService.get('updateSeatFlights') : [];
        for (z = 0; z < seatsLocalStorage.length; z++) {
            if (seatsLocalStorage[z].segmentId === objSeat.segmentId) {
                seatsLocalStorage[z] = objSeat;
                isModify = true;
            }
        }

        if (!isModify) {
            seatsLocalStorage.push(objSeat);
        }
        this.localStorageService.set('updateSeatFlights', seatsLocalStorage);
    };

    updateSeatsAccept = () => {
        let seatsLocal;
        seatsLocal = this.localStorageService.get('updateSeatFlights') ? this.localStorageService.get('updateSeatFlights') : [];
        this.setModelSeats(seatsLocal); this.setBookingInfoSeats(seatsLocal);
    };

    setModelSeats = (seatsLocal) => {
        this.updateFlightsSeats(seatsLocal);
        this.updateManageSeatsFlights(seatsLocal);
        this.updateYourFlightsModelSegments(seatsLocal);
    };

    private updateFlightsSeats(seatsLocal) {
        seatsLocal.forEach(seatLocal => {
            this.model.managementModel.flights.forEach(flight => {
                if (flight.segmentId === seatLocal.segmentId) {
                    flight.seats = seatLocal.seats;
                }
            });
        });
    };

    private updateManageSeatsFlights(seatsLocal) {
        seatsLocal.forEach(seatLocal => {
            this.model.managementModel.manageSeats.flights.forEach(flight => {
                if (flight.segmentId === seatLocal.segmentId) {
                    flight.seats = seatLocal.seats;
                }
            });
        });
    };

    private updateYourFlightsModelSegments(seatsLocal) {
        seatsLocal.forEach(seatLocal => {
            for (const segment in this.model.yourFlightsModel.allSegments) {
                if (segment === seatLocal.segmentId) {
                    this.model.yourFlightsModel.allSegments[segment].seats = seatLocal.seats;
                }
            }
        });
    };

    setBookingInfoSeats = (seatsLocal) => {
        let bookingInfo = this.localStorageService.get('bookingInfo') ? this.localStorageService.get('bookingInfo') : [];
        this.updateOrderItemsSeats(seatsLocal, bookingInfo);
        const arrOrderItemsSeat = this.getOrderItemsSeat(bookingInfo);
        this.model.managementModel.orderItems.seat = arrOrderItemsSeat;
        this.model.summaryModel.infoAncillaries.seat = arrOrderItemsSeat;
        this.localStorageService.set('bookingInfo', bookingInfo);
    };

    private updateOrderItemsSeats(seatsLocal, bookingInfo) {
        seatsLocal.forEach(seatLocal => {
            seatLocal.seats.forEach(seat => {
                bookingInfo.order.orderItems.forEach(orderItem => {
                    if (this.hasOrderSeatSelected(orderItem,seatLocal,seat)) {
                        orderItem.row = seat.rowCurrent;
                        orderItem.column = seat.columnCurrent;
                    }
                });
            });
        });
    };

    private getOrderItemsSeat(bookingInfo) {
        return bookingInfo.order.orderItems.filter(item => item.type === 'seat');
    };

    private hasOrderSeatSelected = (orderItem,seatLocal,seat) => {
        return (orderItem.type === 'seat' && seatLocal.segmentId === orderItem.segmentId && orderItem.selected && seat.id === orderItem.passengerId);
    };

    deleteGlobickTransfers = () => {
        this.$rootScope.$broadcast('setDisconfirmed');
    };

    updateSeatsClose = (data) => {
        this.localStorageService.remove('updateSeatFlights');
    };    
};