import * as angular from 'angular';
import { MmBUtilService } from "@src/components/services/Utils/ib-MmB-utils";

@Service(
    'ib-MmB-communication-lost-module',
    ['MmBUtilService', 'CurrencyService', 'MmBAppConstants'],
    []
)
export class MmBCommunicationLostTransformer {
    constructor (
        private MmBUtilService: MmBUtilService,
        private CurrencyService: CurrencyService,
        private MmBAppConstants,
    ) { }

    /**
    * generates the communication lost info calling to transformer
    */
    generateCommunicationLostInfo = (confirmationInfo, creditCardTypes) => {
        const communicationLostModel = {
            communicationLostInfo: this.getCommunicationsLostInfo(confirmationInfo, creditCardTypes),
            relatedContent: this.MmBUtilService.getRelatedContent(confirmationInfo && confirmationInfo.relatedContent ? confirmationInfo.relatedContent : null)
        };
        return communicationLostModel;
    };

        /**
    * Return a Object with all information to show comunications lost view
    * @param {Object} confirmationInfo Object with all information return issue service when error code is 417
    * @param {Array<Object>} creditCardTypes All information credit card return in payment method creditCard
    */
    getCommunicationsLostInfo = (confirmationInfo, creditCardTypes) => {
        let communicationLostModel = this.communicationLostModelInit(confirmationInfo);
        
        if (confirmationInfo && confirmationInfo.paymentItems) {
            communicationLostModel = this.forPaymentItemsCommunicationLost(confirmationInfo, creditCardTypes, communicationLostModel);
        };
        return communicationLostModel;
    };

    private communicationLostModelInit = (confirmationInfo) => {
        return {
            currency: this.getCurrencyCommunicationLost(confirmationInfo),
            pnr: confirmationInfo && confirmationInfo.order ? confirmationInfo.order.bookingReferences[0].reference : null,
            paymentItems: {},
            ancillaries: confirmationInfo && confirmationInfo.order && confirmationInfo.order.orderItems ? this.getAncillariesInfo(confirmationInfo.order.orderItems, confirmationInfo.order.slices) : null,
            aviosRedeemed: {}
        }
    };

    private getCurrencyCommunicationLost = (confirmationInfo) => {
        return (this.CurrencyService.getCurrenciesAsMap(confirmationInfo && confirmationInfo.contextMetadata ? confirmationInfo.contextMetadata.currencies : null)[confirmationInfo && confirmationInfo.order ? confirmationInfo.order.price.currency : null]);
    };

    private forPaymentItemsCommunicationLost = (confirmationInfo, creditCardTypes, communicationLostModel) => {
        for (let i = 0; i < confirmationInfo.paymentItems.length; i++) {
            const paymentType = confirmationInfo.paymentItems[i].type;
            switch (paymentType) {
                case this.MmBAppConstants.PAYMENT_TYPES.CREDIT_CARD:
                    this.handleCreditCardPayment(communicationLostModel, confirmationInfo, creditCardTypes, i);
                    break;
                case this.MmBAppConstants.PAYMENT_TYPES.AVIOS:
                    this.handleAviosPayment(communicationLostModel, confirmationInfo, i);
                    break;
                case this.MmBAppConstants.PAYMENT_TYPES.VOUCHER:
                    this.handleVoucherPayment(communicationLostModel, confirmationInfo, i);
                    break;
            }
        }
        return communicationLostModel;
    };

    private handleCreditCardPayment = (communicationLostModel, confirmationInfo, creditCardTypes, i) => {
        communicationLostModel.paymentItems[this.MmBAppConstants.PAYMENT_TYPES.CREDIT_CARD] = {
            total: this.getCurrencyTotal(communicationLostModel, confirmationInfo, i),
            authorization: confirmationInfo.paymentItems[i].authorization,
            creditCardNumber: confirmationInfo.paymentMethod.cardNumber,
            cardDescription: this.getCreditCardDescription(confirmationInfo.paymentMethod.cardTypeId, creditCardTypes)
        };
    };

    private handleAviosPayment = (communicationLostModel, confirmationInfo, i) => {
        communicationLostModel.paymentItems[this.MmBAppConstants.PAYMENT_TYPES.AVIOS] = {
            dicount: '-' + this.getCurrencyTotal(communicationLostModel, confirmationInfo, i),
            authorization: confirmationInfo.paymentItems[i].authorization,
            aviosRedeemed: confirmationInfo.paymentItems[i].aviosRedeemed
        };
        communicationLostModel.aviosRedeemed = confirmationInfo.paymentItems[i].aviosRedeemed;
    };

    private handleVoucherPayment = (communicationLostModel, confirmationInfo, i) => {
        communicationLostModel.paymentItems[this.MmBAppConstants.PAYMENT_TYPES.VOUCHER] = {
            dicount: '-' + this.getCurrencyTotal(communicationLostModel, confirmationInfo, i),
            authorization: confirmationInfo.paymentItems[i].authorization
        };
    };
    
    private getCurrencyTotal = (communicationLostModel, confirmationInfo, i) => {
        return (this.CurrencyService.formatPrice(communicationLostModel.currency, confirmationInfo.paymentItems[i].total, true) + (communicationLostModel?.currency?.description ? ' (' + communicationLostModel.currency.description + ')' : ''));
    };

    private getCreditCardDescription = (cardTypeId, creditCardTypes) => {
        let cardDescription = '';
        if (creditCardTypes) {
            cardDescription = this.handleCardDescription(creditCardTypes, cardTypeId);
        };
        return cardDescription;
    };

    private handleCardDescription = (creditCardTypes, cardTypeId) => {
        let cardIndex = 0, cardFound = false;
        let cardDescriptionInit = '';
        while (!cardFound && cardIndex < creditCardTypes.length) {
            if (cardTypeId === creditCardTypes[cardIndex].cardTypeId) {
                cardFound = true;
                cardDescriptionInit = creditCardTypes[cardIndex].description;
            };
            cardIndex++;
        };
        return cardDescriptionInit;
    };

    private getAncillariesInfo = (orderItems, slices) => {
        let orderItemsIndex, ancillariesInfo: any = {}, ancillariesInfoIndex = 0;
        for (orderItemsIndex = 0; orderItemsIndex < orderItems.length; orderItemsIndex++) {
            let paramsSwitchTypes = { orderItems, orderItemsIndex, ancillariesInfo, slices };
            this.switchTypes(paramsSwitchTypes);
        };
        if (ancillariesInfo.SEATS) {
            angular.forEach(ancillariesInfo.SEATS.info, (value, id) => {
                ancillariesInfo.SEATS.viewInfo.text += value.seats + ' ' + value.trip + (ancillariesInfoIndex < Object.keys(ancillariesInfo.SEATS.info).length - 1 ? '. ' : '');
                ancillariesInfoIndex++;
            });
        };
        ancillariesInfoIndex = 0;
        if (ancillariesInfo.BAGGAGES) {
            angular.forEach(ancillariesInfo.BAGGAGES.info, (value, id) => {
                ancillariesInfo.BAGGAGES.viewInfo.text += value.baggages + ' ' + value.trip + (ancillariesInfoIndex < Object.keys(ancillariesInfo.BAGGAGES.info).length - 1 ? ', ' : '');
                ancillariesInfoIndex++;
            });
        };
        return ancillariesInfo;
    };

    private switchTypes = (paramsSwitchTypes) => {
        let tripInfo;
        let { orderItems, orderItemsIndex, ancillariesInfo, slices } = paramsSwitchTypes;
        switch (orderItems[orderItemsIndex].type) {
            case 'baggage':
                if (!ancillariesInfo.BAGGAGES) {
                    ancillariesInfo.BAGGAGES = {
                        title: 'SUMMARY_ANCILLARIES_BAGGAGE_TITLE',
                        info: {},
                        viewInfo: { text: '', quantity: 1 }
                    };
                } else {
                    ancillariesInfo.BAGGAGES.viewInfo.quantity++;
                };
                if (ancillariesInfo.BAGGAGES.info[orderItems[orderItemsIndex].sliceId]) {
                    ancillariesInfo.BAGGAGES.info[orderItems[orderItemsIndex].sliceId].baggages++;
                } else {
                    tripInfo = this.getSliceDetailsById(orderItems[orderItemsIndex].sliceId, slices);
                    ancillariesInfo.BAGGAGES.info[orderItems[orderItemsIndex].sliceId] = { baggages: 1, trip: '(' + tripInfo.origin.city.description + '-' + tripInfo.arrival.city.description + ')' };
                };
                break;
            case 'seat':
                if (!ancillariesInfo.SEATS) {
                    ancillariesInfo.SEATS = {
                        title: 'SUMMARY_ANCILLARIES_SEATS_TITLE',
                        info: {},
                        viewInfo: { text: '' }
                    };
                };
                if (ancillariesInfo.SEATS.info[orderItems[orderItemsIndex].segmentId]) {
                    ancillariesInfo.SEATS.info[orderItems[orderItemsIndex].segmentId].seats += ',' + orderItems[orderItemsIndex].row + orderItems[orderItemsIndex].column;
                } else {
                    tripInfo = this.getSegmentDetailsById(orderItems[orderItemsIndex].segmentId, slices);
                    ancillariesInfo.SEATS.info[orderItems[orderItemsIndex].segmentId] = { seats: orderItems[orderItemsIndex].row + orderItems[orderItemsIndex].column, trip: '(' + tripInfo.origin.city.description + '-' + tripInfo.arrival.city.description + ')' };
                };
                break;
        };
    };

    private getSliceDetailsById = (sliceId, slices) => {
        let sliceFounded = false, sliceIndex = 0, sliceInfo = {};
        while (!sliceFounded && sliceIndex < slices.length) {
            if (slices[sliceIndex].sliceId === sliceId) {
                sliceFounded = true;
                sliceInfo = {
                    origin: slices[sliceIndex].segments[0].departure,
                    arrival: slices[sliceIndex].segments[slices[sliceIndex].segments.length - 1].arrival
                };
            };
            sliceIndex++;
        };
        return sliceInfo;
    };

    private getSegmentDetailsById = (segmentId, slices) => {
        let sliceIndex = 0, segmentFounded = false, segmentIndex, segmentInfo = {};
        while (!segmentFounded && sliceIndex < slices.length) {
            segmentIndex = 0;
            while (!segmentFounded && segmentIndex < slices[sliceIndex].segments.length) {
                if (slices[sliceIndex].segments[segmentIndex].id === segmentId) {
                    segmentFounded = true;
                    segmentInfo = {
                        origin: slices[sliceIndex].segments[segmentIndex].departure,
                        arrival: slices[sliceIndex].segments[segmentIndex].arrival
                    };
                };
                segmentIndex++;
            };
            sliceIndex++;
        };
        return segmentInfo;
    };

};
