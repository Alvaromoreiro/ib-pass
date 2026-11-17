import { Inject, Injectable } from '@angular/core';
import { AJSFlightsPassengersUtilsServiceToken, FlightsPassengersUtilsServiceType } from '../../../../components/services/Utils/bridges/ib-flights-passengers-utils-bridge.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { AcceptObjectsPolicyServiceType, AJSAcceptObjectsPolicyServiceToken } from '@src/app/shared/http-services/pacc-pacc/bridges/ib-accept-objects-bridge.service';
import { AJSCheckAncillariesServiceToken, CheckAncillariesServiceType } from '@src/app/shared/services/bridges/ib-check-ancillaries-bridge.service';
import { AJSCheckPaymentsServiceToken, CheckPaymentsServiceType } from '@src/components/services/Utils/bridges/ib-check-payments-bridge.service';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { CkiDatalayerConstants } from '@src/app/shared/services/ib-datalayer/ib-cki-datalayer-constants';
import {
    AJSFlightsPassengersServiceToken,
    FlightsPassengersServiceType
} from '@src/components/ib-check-in-flights-passengers/services/bridges/ib-flights-and-passengers-bridge.service';
import { AJSCallAncillariesServiceToken, CallAncillariesServiceType } from '@src/app/shared/http-services/ass-fass/bridges/ib-call-ancillaries-bridge.service';
import { IbCheckinRedirectionUtilsService } from '@src/app/shared/services/ib-utils/ib-checkin-redirection-utils.service';
import { AJSCommonsAncillariesServiceToken, CommonsAncillariesServiceType } from '@src/components/services/Utils/bridges/ib-common-ancillaries-bridge.service';
import { AJSModalService, AJSModalServiceType } from '@src/app/shared/services/ib-modal/ib-modal-service-bridge.service';
import { IbCheckinSeatSummaryService } from '../../ib-checkin-seat-summary/services/ib-checkin-seat-summary.service';
import { AJSGetCKICachedInformationServiceToken, AJSGetCKICachedInformationServiceType } from '@src/app/shared/http-services/pac-prm/bridges/ib-get-cached-information-bridge.service';
import { AJSUpgradingAncillaryToUpgradeInfoMapperServiceToken } from '@src/app/shared/services/ib-upgrading/bridges/ib-upgrading-ancillary-to-upgrade-info-mapper-bridge.service';
import { UpgradingAncillaryToUpgradeInfoMapperServiceType, UpgradingAncillariesResponse, LegacyUpgradeInfo } from '@src/app/shared/services/ib-upgrading/models/ib-upgrading-ancillary-to-upgrade-info-mapper.model';
import { IbAncillariesPaymentUtilsService } from '@src/app/shared/services/ib-utils/ib-ancillaries-payment-utils.service';
import { IbPassengerBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-passenger-booking-utils.service';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';
import { IbBoardingCardsPrintTransformer } from '@src/app/shared/services/ib-boarding-cards/ib-boarding-cards-print-transformer.service';

@Injectable({ providedIn: 'root' })
export class AcceptService {
    constructor (
        @Inject(AJSFlightsPassengersUtilsServiceToken) private FlightsPassengersUtils: FlightsPassengersUtilsServiceType,
        @Inject(AJSAcceptObjectsPolicyServiceToken) private AcceptObjectsPolicyService: AcceptObjectsPolicyServiceType,
        @Inject(AJSModalService) private ModalService: AJSModalServiceType,
        @Inject(AJSGetCKICachedInformationServiceToken) private GetCKICachedInformationService: AJSGetCKICachedInformationServiceType,
        @Inject(AJSCheckAncillariesServiceToken) private CheckAncillariesService: CheckAncillariesServiceType,
        @Inject(AJSCheckPaymentsServiceToken) private CheckPaymentsService: CheckPaymentsServiceType,
        @Inject(AJSFlightsPassengersServiceToken) private FlightsPassengersService: FlightsPassengersServiceType,
        @Inject(AJSCommonsAncillariesServiceToken) private CommonsAncillariesService: CommonsAncillariesServiceType,
        @Inject(AJSCallAncillariesServiceToken) private CallAncillariesService: CallAncillariesServiceType,
        @Inject(AJSUpgradingAncillaryToUpgradeInfoMapperServiceToken) private UpgradingAncillaryToUpgradeInfoMapperService: UpgradingAncillaryToUpgradeInfoMapperServiceType,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbCheckinRedirectionUtilsService: IbCheckinRedirectionUtilsService,
        private IbCheckinSeatSummaryService: IbCheckinSeatSummaryService,
        private IbAncillariesPaymentUtilsService: IbAncillariesPaymentUtilsService,
        private IbPassengerBookingUtilsService: IbPassengerBookingUtilsService,
        private IbUtilsService: IbUtilsService,
        private IbBoardingCardsPrintTransformer: IbBoardingCardsPrintTransformer
    ) {}

    /**
     * @function
     * @name callAccept
     * @desc calls accepted forbidden objects policy and continue to the next step
     */
    callAccept = (passengers, printBoardingCard, nextStep, isEarly): any => {
        const requestAcceptInfo = this.FlightsPassengersUtils.getAcceptUpdateInformation(this.CommonsSessionStorageService.get('availableSegments'), passengers);
        let modalObject;

        const acceptPolicySuccess = (acceptInfo) => {
            const uncheckableSegments = this.IbPassengerBookingUtilsService.updateCachedInfo(acceptInfo.data.acceptedSegments);
            let acceptedSegments = acceptInfo?.data?.acceptedSegments || [];

            const checkAcceptSeats = () => {
                let seatsAssigned = true;
                acceptedSegments.forEach((segment) => {
                    segment.passengers.forEach((passenger) => {
                        if (passenger.seat === null) seatsAssigned = false;
                    });
                });
                return seatsAssigned;
            };

            const acceptSegmentsError = () => {
                if (acceptedSegments.length > 0) {
                    checkAcceptResponse();
                } else {
                    this.IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                    this.IbUtilsService.goIbCose();
                }
            };

            const checkAcceptResponse = () => {
                this.ModalService.isWaiting();
                if ((acceptInfo.code === 201 || acceptInfo.code === 200) && acceptInfo.data.locator != null) {
                    this.GetCKICachedInformationService.getCachedInformation().then(
                        (cachedData: any) => {
                            const cachedDataPassengers: any = cachedData?.passengers;
                            this.CommonsSessionStorageService.set('bookingInfo', cachedData);
                            this.CommonsSessionStorageService.set(
                                'passengersSelected',
                                this.FlightsPassengersUtils.updateSelectedPassengers(this.CommonsSessionStorageService.get('passengersSelected'), cachedDataPassengers)
                            );
                            this.ModalService.isNotWaiting();
                            this.ModalService.openSplitModal('md', 'modal-split', false, acceptInfo.data.locator).result.then(startCheckinFromSplit, startCheckinFromSplit);
                        },
                        (error) => {
                            this.IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                            this.ModalService.showGenericError(error, false, null);
                        }
                    );
                } else {
                    this.nextViewAfterAccept(printBoardingCard, nextStep, acceptInfo);
                }

                const startCheckinFromSplit = (response) => {
                    this.IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                    this.IbCheckinRedirectionUtilsService.path('/ibcose').search({ surname: this.CommonsSessionStorageService.get('checkinSurname'), pnr: response.data.locator });
                };
            };

            const seatsAssigned = checkAcceptSeats();

            this.ModalService.isNotWaiting();
            if (uncheckableSegments.length > 0) {
                acceptedSegments = this.FlightsPassengersUtils.updateSelectedSegments(this.CommonsSessionStorageService.get('availableSegments'), uncheckableSegments);
                this.CommonsSessionStorageService.set('availableSegments', acceptedSegments);
                this.ModalService.showGenericError(
                    { message: 'NOT_ACCEPTED_SEGMENT_ERROR', needsTranslate: true, idModal: CkiDatalayerConstants.DATALAYER_MODAL_ID.NOT_ACCEPTED_SEGMENT_ERROR },
                    true,
                    'apis.error-modal.html'
                ).result.then(acceptSegmentsError, acceptSegmentsError);
            } else if (isEarly) {
                this.FlightsPassengersService.checkAvailabilitySeatsPassengers().then(
                    (response) => {
                        if (response || seatsAssigned) {
                            this.ModalService.isNotWaiting();
                            checkAcceptResponse();
                        } else {
                            this.seatNotAvailableError();
                        }
                    },
                    (error) => {
                        this.IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                        this.ModalService.showGenericError(error, true, null).result.then(this.IbUtilsService.goIbCose, this.IbUtilsService.goIbCose);
                    }
                );
            } else {
                checkAcceptResponse();
            }
        };

        this.AcceptObjectsPolicyService.acceptForbiddenObjectsPolicy(requestAcceptInfo).then(acceptPolicySuccess, this.acceptPolicyError);
    };

    public nextViewAfterAccept = (printBoardingCard, nextStep, response) => {
        this.CommonsSessionStorageService.set(CheckinAppConstants.STORAGE_KEYS.ACCEPT_INFO, response.data);

        const confirmationInfo = this.IbBoardingCardsPrintTransformer.getPrintedInformation();
        this.CommonsSessionStorageService.set(CheckinAppConstants.STORAGE_KEYS.CONFIRMATION_INFO, confirmationInfo);

        const bkiInfo: any = this.CommonsSessionStorageService.get('bookingInfo');
        if (bkiInfo?.ancillariesDisabled) {
            this.IbCheckinSeatSummaryService.checkRedirectionPage('ibecbp');
        } else if (response.code === 202) {
            this.ModalService.showGenericModal({ message: '{{\'ALERT_NO_SHOW_FEES\'|translate}}' }, true, 'generic-info-modal').result.then(
                () => {
                    this.checkAncillaries(printBoardingCard, nextStep, response.data);
                },
                () => {
                    this.checkAncillaries(printBoardingCard, nextStep, response.data);
                }
            );
        } else {
            this.checkAncillaries(printBoardingCard, nextStep, response.data);
        }
    };

    /**
     * Redirect user to payments or boarding-document depending if have
     * pending payments
     */
    public serviceError = (pendingPayments: boolean = false) => {
        this.ModalService.isNotWaiting();
        if (pendingPayments) {
            this.IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
            this.IbCheckinRedirectionUtilsService.path('/ibpurc');
        } else {
            this.IbCheckinSeatSummaryService.checkRedirectionPage('ibecbp');
        }
    };

    /**
     * Call ancillaries service
     * @param {BOOL} printBoardingCard
     * @param {String} nextStep Next step in flow
     * @param {Object} responseData
     */
    public checkAncillaries = (printBoardingCard, nextStep, responseData) => {
        const isEarly = this.CommonsSessionStorageService.get('isEarly');
        this.CommonsSessionStorageService.set('acceptInfoSegments', responseData);
        (this.CommonsSessionStorageService as any).remove('upgradeInfo');

        const CommonsAncillariesServiceSucces = (ancillariesSummary) => {
            this.IbAncillariesPaymentUtilsService.setAncillariesCurrency(ancillariesSummary.currencies, ancillariesSummary.context.issueCurrency);
            this.IbAncillariesPaymentUtilsService.setAncillariesBob(ancillariesSummary.freeItems);
            this.CheckAncillariesService.checkAncillaries().then(() => continueFlow(ancillariesSummary), this.serviceError);
        };

        const CommonsAncillariesServiceError = (response) => {
            const acceptInfo: any = this.CommonsSessionStorageService.get('acceptInfoSegments');
            let uncheckableSegments = false;
            acceptInfo.acceptedSegments.forEach((segments) => {
                segments.passengers.forEach((pax) => {
                    if (pax.status === 'CHECKED' && pax.seat === null && pax.purchaseSeatRequired) {
                        uncheckableSegments = true;
                    }
                });
            });

            if (uncheckableSegments) {
                this.IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                this.ModalService.showGenericError({ message: 'REST_SERVICE_ERROR_GENERAL', needsTranslate: true }, true, null).result.then(
                    () => {
                        this.IbUtilsService.goIbCose();
                    },
                    () => {
                        this.IbUtilsService.goIbCose();
                    }
                );
            } else {
                this.serviceError();
            }
        };

        const continueFlow = (ancillariesSummary) => {
            if (nextStep === CheckinAppConstants.SHUTTLE_NEXT_STEPS.SEATS_MAP) {
                this.CommonsSessionStorageService.set('seatMapSegment', {
                    segmentId: Number(this.CommonsSessionStorageService.get('availableSegments')[0]),
                    pasId: this.CommonsSessionStorageService.get('passengersSelected')[0]
                });
                this.CommonsSessionStorageService.set('isPaFlow', !this.checkStandby(ancillariesSummary));
                this.IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                this.IbCheckinRedirectionUtilsService.path('/ckianc');
            } else {
                this.ModalService.isNotWaiting();
                this.IbCheckinSeatSummaryService.checkRedirectionPage('ckianc');
            }
        };
        if (printBoardingCard) {
            this.handleBoardingCardCase();
        } else {
            const continueWithoutUpgrading = () => {
                const pnr: string | null = this.CommonsSessionStorageService.get('PNR');
                this.CommonsAncillariesService.getAncillarieSummary(undefined, null, pnr).then(CommonsAncillariesServiceSucces, CommonsAncillariesServiceError);
            };

            const getUpgradingAncillarieSuccess = (upgradingAncillarieResponse: UpgradingAncillariesResponse):void => {
                const upgradeInfo: LegacyUpgradeInfo | null = this.UpgradingAncillaryToUpgradeInfoMapperService.map(upgradingAncillarieResponse);

                if (upgradeInfo) {
                    this.CommonsSessionStorageService.set('upgradeInfo', upgradeInfo);
                    this.IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                    this.IbCheckinRedirectionUtilsService.path('/ckiancupp');
                } else {
                    continueWithoutUpgrading();
                }
            };
            this.CallAncillariesService.getUpgradingAncillarie().then(getUpgradingAncillarieSuccess, continueWithoutUpgrading);
        }
    };

    private handleBoardingCardCase (): void {
        const pendingPayments = this.CommonsSessionStorageService.get('pendingPayments');
        const pnr: any = this.CommonsSessionStorageService.get('PNR');
        if (pendingPayments) {
            this.IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
            this.CheckPaymentsService.checkPayments();
        } else {
            this.CommonsAncillariesService.getAncillarieSummary(undefined, null, pnr).then(
                (ancillariesSummary: any) => {
                    this.CommonsSessionStorageService.set('summaryInfo', ancillariesSummary);
                    this.IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
                    this.IbCheckinRedirectionUtilsService.path('/ibecbp');
                },
                this.serviceError
                /*
                 * Code commented out due to the recurring HTTP 500 response from the ancillaries-summary service.
                 * JIRA Task: DIB-9322
                 *
                 * () => {
                 *     this.ModalService.showGenericError({ message: 'REST_SERVICE_ERROR_GENERAL', needsTranslate: true }, true).result.then(() => {
                 *         IbUtilsService.goIbCose();
                 *     }, () => {
                 *         IbUtilsService.goIbCose();
                 *     });
                 * }
                 */
            );
        }
    }

    public seatNotAvailableError = () => {
        this.ModalService.isNotWaiting();
        const modalObject = {
            title: {
                message: 'CKIANCPURC_MODAL_TARJ_TITLE',
                needsTranslate: true
            },
            needsTranslate: true,
            message: 'MODAL_UNAVAILABLE_SEATMAP',
            idModal: 'MOD_INFO_TITLE'
        };
        this.IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
        this.ModalService.showGenericModal(modalObject, true, null).result.then(this.IbUtilsService.goIbCose, this.IbUtilsService.goIbCose);
    };
    
    private checkStandby (ancillariesSummary: any): boolean {
        const segments = ancillariesSummary?.context?.segments ?? [];
        const [firstSegment] = segments;
        const coupons = firstSegment?.passengerCoupons ?? [];
        const [firstCoupon] = coupons;
        let isSby = firstCoupon?.status?.code === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.STANDBY;
        return isSby;
    }

    goToIbcoac = () => {
        this.IbCheckinSeatSummaryService.sendSeatSummaryEventToMonetate(false);
        if (this.IbCheckinRedirectionUtilsService.path() === '/ibcoac') {
            this.IbCheckinRedirectionUtilsService.reload();
        } else {
            this.IbCheckinRedirectionUtilsService.path('/ibcoac');
        }
    };

    acceptPolicyError = (error: any) => {
        this.ModalService.finishWaiting();

        const updateCachedData = () => {
            if (error.internalErrorCode !== 'IB_00002') {
                this.GetCKICachedInformationService.getCachedInformation().then(
                    (data) => {
                        this.CommonsSessionStorageService.set('bookingInfo', data);
                        this.goToIbcoac();
                    },
                    (error) => {
                        this.goToIbcoac();
                    }
                );
            }
        };

        this.ModalService.showGenericError(error, false, null).result.then(updateCachedData, updateCachedData);
    };

}
