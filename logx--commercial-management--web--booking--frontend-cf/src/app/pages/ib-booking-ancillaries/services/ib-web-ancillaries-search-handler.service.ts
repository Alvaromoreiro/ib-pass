import { Inject, Injectable } from '@angular/core';
import { CommonsSessionStorageService, AJSRootScope, AJSCurrencyService, downgradeToAJSService } from 'ib-web-commons/utils';
import { AJSCommonsAncillariesServiceToken, CommonsAncillariesServiceType } from '@src/app/shared/components/ib-booking-header/services/upgraded/ib-commons-ancillaries-bridge.service';
import { IbCheckPartnersDiscountsService } from '@src/app/shared/services/ib-check-partners-discount/ib-check-partners-discount.service';
import { BookingAncillariesConstant } from '@src/app/core/constants/ib-ancillaries-constants';
import { AJSModalServiceAncillariesToken, ModalServiceAncillariesType } from './upgraded/ib-modal-ancillaries-bridge.service';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
@Injectable({ providedIn: 'root' })
export class AncillariesSearchHandlerService {
    constructor (
        private localStorageService: CommonsSessionStorageService,
        @Inject(AJSCurrencyService) private CurrencyService: CurrencyService,
        private NewMainHeaderFacade: IbBookingHeaderFacadeService,
        private IbCheckPartnersDiscountsService: IbCheckPartnersDiscountsService,
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        @Inject(AJSCommonsAncillariesServiceToken) private CommonsAncillariesService: CommonsAncillariesServiceType,
        @Inject(AJSModalServiceAncillariesToken) private ModalServiceAncillaries: ModalServiceAncillariesType
    ) {}

    mapResponseToModel (model: any, response: any): void {
        model.ancillariesTrips = response.ancillariesTrips;
        model.seatsAvailable = response.seatsAvailable;
        model.baggageAvailable = response.baggageAvailable;
        model.seatsQuanty = response.seatsQuanty;
        model.ancillariesInsurance = response.ancillariesInsurance;
        model.insuranceAvailable = response.insuranceAvailable;
        model.ancillariesInsuranceAllianzFusion = response.insuranceInfo;
        model.insuranceAllianzFusionAvailable = response.insuranceAllianzFusionAvailable;
        model.ancillariesFlexibilization = response.flexibilizationInfo;
        model.insuranceInfo = response.insuranceInfo;
        model.pendingSeats = response.pendingSeats;
        model.passengerTrips = response.passengerData;
        model.passengerBaggagesTrips = response.passengerBaggagesTrips;
        model.currency = response.currency;
        model.isCurrencyLong = response.isCurrencyLong;
        model.baggageAvailablePrice = response.baggageAvailablePrice.priceFrom;
        model.bobAvailable = response.bobAvailable;
        model.bobInfo = response.bobInfo;
        model.upgrading = response.upgradingInfo;
        model.speqsAvailablePrice = response.speqsAvailablePrice.priceFrom;
        model.passengerSpeqsTrips = response.ancillariesSpeqs;
        model.showBannerConfort = response.showBannerConfort;
        model.ancillariesPreorder = response.preorderAncillarieInfo;
        model.ancillariesPriorityBoarding = response.priorityBoardingInfo;
        model.ancillariesCarbonFootprint = response.ancillariesCarbonFootprint;
        model.flags = response.flags;
        model.petc = response.pet;
        model.assistCard = response.assistCard;
    }

    applyTransfersIfAvailable (model: any, response: any): void {
        const headerModel: any = this.localStorageService.get('headerModel');
        if (!headerModel || headerModel.greyBarModel.isONB) { return; }
        const language = this.returnLanguageToShowTransfers();
        if (language === 'es' || language === 'en') {
            model.ancillariesTransfersGlobick = response.ancillariesTransfersGlobick;
        }
    }

    applyTotalPaymentIfMissing (model: any): void {
        if (model.totalPayment === 0) {
            model.totalPayment = this.CurrencyService.formatPrice(model.currency, 0, true, false, false);
        }
    }

    applyDiscountsToBasket (createOrderData: any): void {
        const discounts = createOrderData?.order?.discountsApplied?.discounts;
        if (!discounts?.length) { return; }
        const { originalPrice, totalDiscount } = createOrderData.order.discountsApplied;
        discounts.forEach((discount: any) => {
            const isPartner = this.IbCheckPartnersDiscountsService.isDiscountTypePartnerEquivalent(discount.type) || discount.type === BookingAncillariesConstant.DISCOUNT_TYPES.PARTNER;
            const price = isPartner ? createOrderData.order.price.total - discount.totalDiscount : createOrderData.order.price.total;
            this.NewMainHeaderFacade.updateBasketDiscountsNew(discount, originalPrice, totalDiscount, price);
        });
    }

    restoreSelectedInsurance (model: any): void {
        const insuranceSave: any = this.localStorageService.get('insuranceSelected');
        if (!insuranceSave) { return; }
        model.ancillariesInsurance.forEach((insurance: any, index: any) => {
            if (insuranceSave.id === insurance.id) {
                model.selectedInsurance = model.ancillariesInsurance[index];
                this.$rootScope.$broadcast('setSelectedInsurance', model.selectedInsurance);
                this.localStorageService.set('selectInsurance', true);
            }
        });
    }

    restoreSelectedFlex (model: any): void {
        const selectedFlex: any = this.localStorageService.get('selectedFlex');
        if (!selectedFlex) { return; }
        model.ancillariesFlexibilization.info.forEach((info: any, index: any) => {
            if (info.subtype === selectedFlex.subtype) {
                model.ancillariesFlexibilization.selectedFlex = model.ancillariesFlexibilization.info[index];
                model.ancillariesFlexibilization.confirmed = true;
            }
            const update = [{ type: BookingAncillariesConstant.TYPE_ANCILLARIE.FLEXIBILITY, subtype: selectedFlex.subtype }];
            this.CommonsAncillariesService.updateAncillaries(update).then(() => {
                model.ancillariesFlexibilization.confirmed = true;
            }, (error: any) => {
                model.ancillariesFlexibilization.confirmed = false;
                model.ancillariesFlexibilization.selectedFlex = null;
                this.ModalServiceAncillaries.isNotWaiting();
                this.ModalServiceAncillaries.showGenericError(error).result.finally(() => { });
            });
        });
    }

    getShoppingBasket (headerModel: any): any {
        return headerModel.shoppingBasket ?? headerModel.headerModel.shoppingBasket;
    }

    updateSeatsQuantyFromBasket (model: any, seats: any): void {
        if (!seats.hasSeats) { return; }
        const count = seats.segments.reduce((acc: number, seg: any) => acc + seg.quanty, 0);
        model.seatsQuanty = count;
    }

    private returnLanguageToShowTransfers (): string {
        const confirmationDatalayerInfo: any = this.localStorageService.get('fareData') ?? this.localStorageService.get('importOrder');
        return confirmationDatalayerInfo.contextMetadata.language;
    }
}

downgradeToAJSService('AncillariesSearchHandlerService', AncillariesSearchHandlerService, 'ib-booking-ancillaries-module');
