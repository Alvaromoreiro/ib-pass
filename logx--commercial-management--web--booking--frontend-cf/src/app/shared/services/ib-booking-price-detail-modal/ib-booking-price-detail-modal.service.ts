import { Inject, Injectable } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { downgradeToAJSService, CommonsSessionStorageService, AJSRootScope } from 'ib-web-commons/utils';
import { IbBookingPriceDetailModalComponent } from '../../components/ib-booking-price-detail-modal/ib-booking-price-detail-modal.component';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { IbBookingFlowUtilsService } from '../ib-utils/ib-booking-flow-utils.service';
import { AJSBookingUtilsService } from '../ib-utils/ib-booking-utils-service-bridge.service';
import { IbBookingPriceDetailModalTransformer } from '@shared/components/ib-booking-price-detail-modal/ib-booking-price-detail-modal.transformer';
import { OHImportResponse } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation-component-model';
import type { FareDataModel } from '@src/app/core/models/generic-models/fare-models';

@Injectable({
    providedIn: 'root'
})
export class IbBookingPriceDetailModalService {
    constructor (
        private IbCModalService: IbCModalService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbBookingFlowUtilsService: IbBookingFlowUtilsService,
        @Inject(AJSDatalayerUtilsService) private DatalayerUtilsService: AJSDatalayerUtilsServiceType,
        @Inject(AJSBookingUtilsService) private BookingUtilService,
        @Inject(AJSRootScope) private rootScope
        
    ) {}

    public preparePriceDetails = ():AvailabilityTransformerModel.OfferItem[] => {
        
        const fareData = this.CommonsSessionStorageService.get<FareDataModel>('fareData');
        if (!fareData) {
            const orderInfo = this.CommonsSessionStorageService.get<OHImportResponse>('importOrder'); 
            return IbBookingPriceDetailModalTransformer.transformOrderItemToOfferItem(orderInfo.order.orderItems);  
        }
        const priceDetails = fareData?.offers[0]?.discountsApplied?.originalOfferItems ?? fareData?.offers[0]?.offerItems;
        return priceDetails;
    };

    public openPriceDetailModal = ($event?: Event, model?: AvailabilityTransformerModel.OfferItem[]): any => {
        if($event) {
            $event.preventDefault();
            $event.stopPropagation();
        }
        this.DatalayerUtilsService.updateDatalayerEvent('modal resumen', 'clic', 'detalle', 'interaccion');
        
        const modalOptions = {
            windowClass: 'ib-modals bki-dialog ib-price--scroll'
        };
        const modal = this.IbCModalService.showGenericComponentModal(IbBookingPriceDetailModalComponent, modalOptions);
        const componentInstance = modal.componentInstance as IbBookingPriceDetailModalComponent;
        componentInstance.priceDetails = model ?? this.preparePriceDetails();
        modal.result.then(()=>{}, ()=>{});
    };

    public checkShouldShowCTA = (type?: string) => {
        let isFlowAllowed = this.CommonsSessionStorageService.get(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW);
        if (!isFlowAllowed) return false;
        const flightType = this.CommonsSessionStorageService.get<string>(BkiStorageConstants.SEARCH_FLIGHT_TYPE);
        let flowStep = this.CommonsSessionStorageService.get<number>('loadingNextFlow') ?? 0;
        const isAdaptativeFlow = this.IbBookingFlowUtilsService.checkAdaptativeMobileView();
        const isDEMarket = BookingAppConstants.market === 'DE';

        if (flowStep < 2 && flightType !== BookingAppConstants.SEARCH_FLIGHT_TYPE.ONHOLD_CONF) return false;

        switch (type) {
                case 'header':
                    return isAdaptativeFlow ? isDEMarket : true;
                case 'mobile':
                    return isDEMarket;
                default:
                    return true;
        }
    };

    public initPriceModalData = () => {
        const isMulti = this.CommonsSessionStorageService.get(BkiStorageConstants.SEARCH_FLIGHT_TYPE) === BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP;
        const isMeta = this.CommonsSessionStorageService.get(BkiStorageConstants.SEARCH_FLIGHT_TYPE) === BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH;

        const flashOffer = this.BookingUtilService.getURLFirstParameterByName('flashOffer');
        const flashOfferId = this.BookingUtilService.getURLFirstParameterByName('flashOfferId');
        const isFlashOffers = flashOffer && flashOfferId;

        const isRedemption = this.rootScope.isRedemptionFlow;

        const isForbidden =Boolean(isMulti || isMeta || isRedemption || isFlashOffers);
        this.CommonsSessionStorageService.set(BkiStorageConstants.PRICE_DETAIL_MODAL_VIEW, isForbidden ? false : true);
    };

}

downgradeToAJSService('IbBookingPriceDetailModalService', IbBookingPriceDetailModalService, 'ib-booking-services-module');

