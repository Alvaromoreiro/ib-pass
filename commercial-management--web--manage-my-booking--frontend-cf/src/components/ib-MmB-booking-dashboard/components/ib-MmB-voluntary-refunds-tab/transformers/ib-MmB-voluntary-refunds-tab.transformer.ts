import { Injectable, Inject } from '@angular/core';
import { DetailedReshopDifferentialsEntity, OrderItemsEntity, PassengersEntity, SlicesEntity, VoluntaryRefundsModel } from '../models/ib-voluntary-refunds-model';
import { SummaryPenalty, SummaryAncillariesRefund, SummaryRefund, SummaryAncillariesNotRefund, Penalty, Price, VoluntaryRefundsTransformerModel, Louse, Segment, GroupsType, Origin, Destination, SummaryPassengerPenalty, SummaryAncillariesNotRefundOnline, CurrencyViews } from '../models/ib-voluntary-refunds-tab-transformer-model';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { AJSCurrencyUtilsService, AJSCurrencyUtilsServiceType } from '@src/components/services/Utils/ib-MmB-currency-utils-service-bridge.service';
import { CurrencyResponse } from '../../../../services/Utils/models/currency-type.model';
import { log } from 'console';

@Injectable({
    providedIn: 'root'
})
export class VoluntaryRefundsTabTransformer {
    //ONLY ANCILLARIES TO SHOW REFUND AND NOT REFUND IN ORDER ITEMS
    refundItemsType: string[] = ['seat', 'baggage', 'priorityBoarding'];
    notRefundItemsType: string[] = ['creditCardFee', 'specialEquipment'];
    notRefundOnlineItemsType: string[] = ['preOrder', 'globickV2', 'insurance', 'wineClub', 'bob', 'stopover', 'InsuranceOrderItemWebResponse'];
    refundItemsContracted: string[] = [];
    notRefundItemsContracted: string[] = [];
    notRefundOnlineItemsContracted: string[] = [];
    onlyRefundAirportTaxes: boolean = false;
    mixRefundNotRefundFare: boolean = false;
   

    constructor(
        private CommonsSessionStorageService: CommonsSessionStorageService,
        @Inject(AJSCurrencyUtilsService) private MmBCurrencyService: AJSCurrencyUtilsServiceType,
    ) { }

    voluntaryRefundsTransfomedInfo = (data: VoluntaryRefundsModel): VoluntaryRefundsTransformerModel => {
        let infoTransformer: VoluntaryRefundsTransformerModel = this.initVoluntaryRefundsTransformerModel();

        infoTransformer.less24Hours = data.less24Hours;
        infoTransformer.price = this.updateInfoPrice(data);
        infoTransformer.penalty = this.updateInfoPenalty(data);
        infoTransformer.totalRefund = this.MmBCurrencyService.formatPrice(this.getCurrencyObj(), infoTransformer.price.totalRefundPrice, true, false, true, true);
        infoTransformer.totalRefundWithoutPenalty = this.MmBCurrencyService.formatPrice(this.getCurrencyObj(), infoTransformer.less24Hours ? infoTransformer.price.totalRefundPrice : infoTransformer.price.totalRefundPrice + infoTransformer.penalty.cash, true, false, true, true);
        infoTransformer.totalBookingPrice = this.MmBCurrencyService.formatPrice(this.getCurrencyObj(), infoTransformer.price.totalCash, true, false, true, true);
        infoTransformer.noRefundPrice = this.MmBCurrencyService.formatPrice(this.getCurrencyObj(), infoTransformer.less24Hours ? infoTransformer.price.totalCash - infoTransformer.price.totalRefundPrice : infoTransformer.price.totalCash - infoTransformer.penalty.cash - infoTransformer.price.totalRefundPrice, true, false, true, true);
        infoTransformer.summaryRefund = this.updateInfoSummaryRefund(data);
        infoTransformer.summaryAncillariesRefund = this.updateInfoSummaryAncillariesRefund(data);
        infoTransformer.summaryAncillariesNotRefund = this.updateInfoSummaryAncillariesNotRefund(data);
        infoTransformer.summaryAncillariesNotRefundOnline = this.updateInfoSummaryAncillariesNotRefundOnline(data);
        infoTransformer.summaryPenalty = this.updateInfoSummaryPenalty(data);
        infoTransformer.withPayments = data.withPayments;
        infoTransformer.noPenalty = this.MmBCurrencyService.formatPrice(this.getCurrencyObj(), 0, true, false, true, true);
        infoTransformer.refundItems = this.refundItemsContracted;
        infoTransformer.notRefundItems = this.notRefundItemsContracted;
        infoTransformer.notRefundOnlineItems = this.notRefundOnlineItemsContracted;
        infoTransformer.taxes = { listTaxedRefundInfo: data.listTaxedRefundInfo };
        infoTransformer.listFareBasisRefundInfo = data.listFareBasisRefundInfo;
        infoTransformer.onlyRefundAirportTaxes = this.onlyRefundAirportTaxes;
        infoTransformer.mixRefundNotRefundFare = this.mixRefundNotRefundFare;
        infoTransformer.refundType = data.refundType;
        infoTransformer.totalBookingAmountLongCurrency = this.verifyFigureLength(infoTransformer.totalBookingPrice, 9, 12);
        infoTransformer.formatPenaltyLongCurrency = this.verifyFigureLength(infoTransformer.penalty.formatPenalty, 9, 12);
        infoTransformer.totalRefundLongCurrency = this.verifyFigureLength(infoTransformer.totalRefund, 9, 12);
        infoTransformer.noRefundPriceLongCurrency = this.verifyFigureLength(infoTransformer.noRefundPrice, 9, 12);
        infoTransformer.longCurrencyLgView =  infoTransformer.totalBookingAmountLongCurrency.lgView || infoTransformer.formatPenaltyLongCurrency.lgView || infoTransformer.totalRefundLongCurrency.lgView || infoTransformer.noRefundPriceLongCurrency.lgView;
        infoTransformer.longCurrencyXlView = infoTransformer.totalBookingAmountLongCurrency.xlView || infoTransformer.formatPenaltyLongCurrency.xlView || infoTransformer.totalRefundLongCurrency.xlView || infoTransformer.noRefundPriceLongCurrency.xlView;
        return infoTransformer;
    }

    private verifyFigureLength = (value: string, minLengthLgView: number, minLengthXlView: number): CurrencyViews => {
        let currencyViews = {
            lgView : false,
            xlView: false
        };

        if (value.length > minLengthLgView) {
            currencyViews.lgView = true;

            if (value.length > minLengthXlView) {
                currencyViews.xlView = true;
            }
        }

        return currencyViews;
    }

    private initVoluntaryRefundsTransformerModel = (): VoluntaryRefundsTransformerModel => {
        return {
            less24Hours: false,
            price: this.initPrice(),
            penalty: this.initPenalty(),
            totalRefund: '',
            totalRefundWithoutPenalty: '',
            totalBookingPrice: '',
            noRefundPrice: '',
            summaryRefund: [],
            summaryAncillariesRefund: [],
            summaryAncillariesNotRefund: [],
            summaryAncillariesNotRefundOnline: [],
            summaryPenalty: this.initSummaryPenalty(),
            withPayments: false,
            noPenalty: '',
            refundItems: [],
            notRefundItems: [],
            notRefundOnlineItems: [],
            taxes: { listTaxedRefundInfo: [] },
            listFareBasisRefundInfo: [],
            onlyRefundAirportTaxes: false,
            mixRefundNotRefundFare: false,
            refundType: '',
            totalBookingAmountLongCurrency: {lgView: false, xlView: false},
            formatPenaltyLongCurrency: {lgView: false, xlView: false},
            totalRefundLongCurrency: {lgView: false, xlView: false},
            noRefundPriceLongCurrency: {lgView: false, xlView: false},
            longCurrencyLgView: false,
            longCurrencyXlView: false
        }
    }

    private initPrice = (): Price => {
        return {
            currency: '',
            symbol: '',
            avios: 0,
            cash: 0,
            tax: 0,
            ticketingFee: 0,
            totalAvios: 0,
            totalCash: 0,
            totalRefundPrice: 0
        }
    };

    private initPenalty = (): Penalty => {
        return {
            currency: '',
            symbol: '',
            avios: 0,
            cash: 0,
            formatPenalty: ''
        }
    };

    private initSummaryRefund = (): SummaryRefund => {
        return {
            passengerType: '',
            quantityPassenger: 0,
            avios: 0,
            cash: 0,
            formatCash: '',
            tax: 0,
            formatTax: '',
            currency: '',
            symbol: '',
            totalAvios: 0,
            totalCash: 0,
            formatTotalCash: ''
        };
    }

    private initSummaryAncillariesRefund = (): SummaryAncillariesRefund => {
        return {
            serviceType: '',
            slice: []
        }
    }

    private initSlice = (): Louse => {
        return {
            sliceId: '',
            segment: []
        }
    }

    private initSegment = (): Segment => {
        return {
            segmentId: '',
            origin: {
                description: '',
                code: ''
            },
            destination: {
                description: '',
                code: ''
            },
            groupsType: []
        }
    }

    private initOrigin = (): Origin => {
        return {
            description: '',
            code: ''
        }
    }

    private initDestination = (): Destination => {
        return {
            description: '',
            code: ''
        }
    }

    private initGroupsType = (): GroupsType => {
        return {
            subtype: '',
            quantity: 0,
            avios: 0,
            cash: 0,
            formatCash: '',
            currency: '',
            symbol: '',
            totalAvios: 0,
            totalCash: 0,
            formatTotalCash: ''
        }
    }

    private initSummaryPenalty = (): SummaryPenalty => {
        return {
            summaryPassengerPenalties: []
        };
    }

    private initSummaryPassengerPenalty = (): SummaryPassengerPenalty => {
        return {
            passengerType: '',
            quantityPassenger: 0,
            avios: 0,
            cash: 0,
            formatCash: '',
            currency: '',
            symbol: '',
            totalAvios: 0,
            totalCash: 0,
            formatTotalCash: ''
        }
    }

    private createBlankSummaryAncillariesRefund = (): SummaryAncillariesRefund => {
        const summaryAncillariesRefund = this.initSummaryAncillariesRefund();
        summaryAncillariesRefund.slice = [this.initSlice()];
        summaryAncillariesRefund.slice[0].segment = [this.initSegment()];
        summaryAncillariesRefund.slice[0].segment[0].groupsType = [this.initGroupsType()];
        return summaryAncillariesRefund;
    }

    private updateInfoPrice = (data: VoluntaryRefundsModel): Price => {
        let price: Price = this.initPrice();

        price.currency = data.order.price.currency;
        price.symbol = this.getSymbol(data.order.price.currency);
        price.avios = 0;
        price.cash = data.order.price.fare;
        price.tax = data.order.price.tax;
        price.ticketingFee = data.order.price.ticketingFee;
        price.totalAvios = 0;
        price.totalCash = data.order.price.total;
        price.totalRefundPrice = Math.abs(data.reshopDifferential.refundPrice.fare);

        return price;
    }

    private updateInfoPenalty = (data: VoluntaryRefundsModel): Penalty => {
        let penalty: Penalty = this.initPenalty();

        penalty.currency = data.reshopDifferential.penalty.currency;
        penalty.symbol = this.getSymbol(data.reshopDifferential.penalty.currency);
        penalty.avios = 0;
        penalty.cash = data.reshopDifferential.penalty.fare;
        penalty.formatPenalty = this.MmBCurrencyService.formatPrice(this.getCurrencyObj(), data.reshopDifferential.penalty.fare, true, false, true, true);

        return penalty;
    };

    private updateInfoSummaryRefund = (data: VoluntaryRefundsModel): SummaryRefund[] => {
        let summaryRefund: SummaryRefund[] = [];
        data.detailedReshopDifferentials.filter((item) => item.type === 'flight').map((item) => {
            const passengerType = this.getPassengerType(data.passengers, item.passengerID);
            const position: number = this.findPositionInSummaryRefundByType(passengerType, summaryRefund);
            if (position > -1) {
                summaryRefund[position].quantityPassenger += 1;
                summaryRefund[position].totalCash = Math.abs(summaryRefund[position].cash) * summaryRefund[position].quantityPassenger + Math.abs(summaryRefund[position].tax) * summaryRefund[position].quantityPassenger;
                summaryRefund[position].formatTotalCash = this.MmBCurrencyService.formatPrice(this.getCurrencyObj(), Math.abs(summaryRefund[position].totalCash), true, false, true, true);
            } else {
                summaryRefund.push(this.newInfoSummaryRefund(item, passengerType));
            }
        });
        return summaryRefund;
    };

    private newInfoSummaryRefund = (passengerPrice: DetailedReshopDifferentialsEntity, passengerType: string): SummaryRefund => {
        let summaryRefundObject: SummaryRefund = this.initSummaryRefund();
        summaryRefundObject.passengerType = passengerType;
        summaryRefundObject.quantityPassenger = 1;
        summaryRefundObject.avios = 0;
        summaryRefundObject.cash = passengerPrice.saleFareDifference.fare;
        summaryRefundObject.formatCash = this.MmBCurrencyService.formatPrice(this.getCurrencyObj(), Math.abs(passengerPrice.saleFareDifference.fare), true, false, true, true);
        summaryRefundObject.tax = passengerPrice.saleTaxTotalDifference.fare;
        summaryRefundObject.formatTax = this.MmBCurrencyService.formatPrice(this.getCurrencyObj(), Math.abs(passengerPrice.saleTaxTotalDifference.fare), true, false, true, true);
        summaryRefundObject.currency = passengerPrice.saleFareDifference.currency;
        summaryRefundObject.symbol = this.getSymbol(passengerPrice.saleFareDifference.currency);
        summaryRefundObject.totalAvios = 0;
        summaryRefundObject.totalCash = Math.abs(passengerPrice.saleFareDifference.fare) * summaryRefundObject.quantityPassenger + Math.abs(passengerPrice.saleTaxTotalDifference.fare) * summaryRefundObject.quantityPassenger;
        summaryRefundObject.formatTotalCash = this.MmBCurrencyService.formatPrice(this.getCurrencyObj(), Math.abs(summaryRefundObject.totalCash), true, false, true, true);
        return summaryRefundObject;
    }

    private findPositionInSummaryRefundByType = (type: string, summaryRefund: SummaryRefund[]): number => {
        return summaryRefund.findIndex(refund => refund.passengerType === type)
    }

    private updateInfoSummaryAncillariesRefund = (data: VoluntaryRefundsModel): SummaryAncillariesRefund[] => {
        let summaryAncillariesRefunds: SummaryAncillariesRefund[] = [];
        let refundItemsContracted: string[] = [];
        if (data.less24Hours) {
            data.order.orderItems.filter((orderItem) => this.refundItemsType.includes(orderItem.type) && orderItem.price.total > 0).map((item) => {
                const positionAncillariesType: number = this.findType(summaryAncillariesRefunds, item.type);
                if (positionAncillariesType > -1) {
                    const itemSummaryAncillariesRefund: SummaryAncillariesRefund = summaryAncillariesRefunds[positionAncillariesType];
                    this.updateAncillariesSlice(itemSummaryAncillariesRefund, data, item);
                } else {
                    refundItemsContracted.push(item.type);
                    summaryAncillariesRefunds.push(this.newSummaryAncillariesRefund(data, item));
                }
            });
        };

        if (!data.less24Hours) {
            data.listTaxedRefundInfo.filter((tax) => tax.type === "YQ").map((item) => {
                if (!data.listFareBasisRefundInfo.every(slice => slice.refundable) && item.refundable && item.parcial) {
                    this.mixRefundNotRefundFare = true;
                }
            });
        }

        if (data.listTaxedRefundInfo.length > 0 && data.listTaxedRefundInfo.some(tax => tax.type !== "YQ")) {
            const positionAncillariesType: number = this.findType(summaryAncillariesRefunds, 'TAXES');
            if (positionAncillariesType === -1) {
                refundItemsContracted.push('TAXES');
            }
        }

        this.refundItemsContracted = refundItemsContracted;
        return summaryAncillariesRefunds;
    };

    private updateInfoSummaryAncillariesNotRefundOnline = (data: VoluntaryRefundsModel): SummaryAncillariesNotRefundOnline[] => {
        const bookingInfo: any = this.CommonsSessionStorageService.get('bookingInfo') ?? {};
        let summaryAncillariesNotRefundsOnline: SummaryAncillariesNotRefundOnline[] = [];
        let notRefundOnlineItemsContracted: string[] = [];

        data.order.orderItems.filter((orderItem) => this.notRefundOnlineItemsType.includes(orderItem.type) && orderItem.price.total > 0).map((item) => {
            const positionAncillariesType: number = this.findTypeNotRefundOnline(summaryAncillariesNotRefundsOnline, item.type);
            if (positionAncillariesType === -1) {
                notRefundOnlineItemsContracted.push(item.type);
                summaryAncillariesNotRefundsOnline.push({ serviceType: item.type });
            }

            // VERIFY ONLY TRANS OR EXP OR BOTH
            if (item.type === 'globickV2') {
                if (item.items.length === 1) {
                    item.items.filter((issuedItem) => {
                        notRefundOnlineItemsContracted.pop(); //remove type glovickV2 to show only one product TRANS OR EXP
                        notRefundOnlineItemsContracted.push(issuedItem.product);
                    });
                }
            }
        });

        if (bookingInfo.qualifiers.length > 0 && bookingInfo.qualifiers[0].name === 'HOLAMADRID') {
            notRefundOnlineItemsContracted.push('stopover');
            summaryAncillariesNotRefundsOnline.push({ serviceType: 'stopover' });
        };

        this.notRefundOnlineItemsContracted = notRefundOnlineItemsContracted;
        return summaryAncillariesNotRefundsOnline;
    }

    private updateInfoSummaryAncillariesNotRefund = (data: VoluntaryRefundsModel): SummaryAncillariesNotRefund[] => {
        let summaryAncillariesNotRefunds: SummaryAncillariesNotRefund[] = [];
        let notRefundItemsContracted: string[] = [];
        data.order.orderItems.filter((orderItem) => this.notRefundItemsType.includes(orderItem.type) && orderItem.price.total > 0).map((item) => {
            const positionAncillariesType: number = this.findTypeNotRefund(summaryAncillariesNotRefunds, item.type);
            if (positionAncillariesType === -1) {
                notRefundItemsContracted.push(item.type);
                summaryAncillariesNotRefunds.push({ serviceType: item.type });
            }
        });

        if (!data.less24Hours) {
            data.order.orderItems.filter((orderItem) => this.refundItemsType.includes(orderItem.type) && orderItem.price.total > 0).map((item) => {
                const positionAncillariesType: number = this.findTypeNotRefund(summaryAncillariesNotRefunds, item.type);
                if (positionAncillariesType === -1) {
                    notRefundItemsContracted.push(item.type);
                    summaryAncillariesNotRefunds.push({ serviceType: item.type });
                }
            });

            if (data.listFareBasisRefundInfo.every(slice => (!slice.noShow && !slice.refundable) || (slice.noShow && !slice.refundableNoShow))) {
                this.onlyRefundAirportTaxes = true;
                this.mixRefundNotRefundFare = false;
            } else if (data.listFareBasisRefundInfo.some(slice => (!slice.noShow && !slice.refundable) || (slice.noShow && !slice.refundableNoShow))) {
                this.onlyRefundAirportTaxes = false;
                this.mixRefundNotRefundFare = true;
            } else {
                this.resetAirportTaxesAndMixRefund();
            }
        } else {
            this.resetAirportTaxesAndMixRefund();
        }

        this.notRefundItemsContracted = notRefundItemsContracted;
        return summaryAncillariesNotRefunds;
    };

    private resetAirportTaxesAndMixRefund = () => {
        this.onlyRefundAirportTaxes = false;
        this.mixRefundNotRefundFare = false;
    }

    private updateAncillariesSlice = (summaryAncillariesRefund: SummaryAncillariesRefund, data: VoluntaryRefundsModel, item: OrderItemsEntity): void => {
        const sliceId: string = this.getSliceId(data, item);
        const positionAncillariesSlice: number = this.findSlice(summaryAncillariesRefund, sliceId);
        if (positionAncillariesSlice > -1) {
            this.updateAncillariesSegment(summaryAncillariesRefund.slice[positionAncillariesSlice], data, item);
        } else {
            summaryAncillariesRefund.slice.push(this.newSlice(data, item));
        }
    }

    private updateAncillariesSegment = (slice: Louse, data: VoluntaryRefundsModel, item: OrderItemsEntity): void => {
        const segmentId: string = this.getSegmentId(item);
        const positionAncillariesSegment: number = this.findSegment(slice, segmentId);
        if (positionAncillariesSegment > -1) {
            const itemSegment: Segment = slice.segment[positionAncillariesSegment];
            this.updateGroupType(itemSegment, item);
        } else {
            slice.segment.push(this.newSegment(data, item));
        }

    }

    private updateGroupType = (itemSegment: Segment, item: OrderItemsEntity): void => {
        const positionGroupType: number = this.findGroupType(itemSegment, item.price.fare);
        if (positionGroupType > -1) {
            itemSegment.groupsType[positionGroupType].quantity += 1;
            itemSegment.groupsType[positionGroupType].totalCash = itemSegment.groupsType[positionGroupType].cash * itemSegment.groupsType[positionGroupType].quantity;
            itemSegment.groupsType[positionGroupType].formatTotalCash = this.MmBCurrencyService.formatPrice(this.getCurrencyObj(), itemSegment.groupsType[positionGroupType].totalCash, true, false, true, true);
        } else {
            itemSegment.groupsType.push(this.fillGroupsTypeByItem(item));
        }
    }

    private newSummaryAncillariesRefund = (data: VoluntaryRefundsModel, item: OrderItemsEntity): SummaryAncillariesRefund => {
        let ancillarieObj: SummaryAncillariesRefund = this.createBlankSummaryAncillariesRefund();
        ancillarieObj.serviceType = item.type;
        ancillarieObj.slice[0].sliceId = this.getSliceId(data, item);
        ancillarieObj.slice[0].segment[0].segmentId = this.getSegmentId(item);
        ancillarieObj.slice[0].segment[0].origin = this.fillOrigin(data, ancillarieObj.slice[0].sliceId, ancillarieObj.slice[0].segment[0].segmentId);
        ancillarieObj.slice[0].segment[0].destination = this.fillDestination(data, ancillarieObj.slice[0].sliceId, ancillarieObj.slice[0].segment[0].segmentId);
        ancillarieObj.slice[0].segment[0].groupsType = [this.fillGroupsTypeByItem(item)];
        return ancillarieObj;
    }

    private newSlice = (data: VoluntaryRefundsModel, item: OrderItemsEntity): Louse => {
        let slice: Louse = this.initSlice();
        slice.segment = [this.initSegment()];
        slice.sliceId = this.getSliceId(data, item);
        slice.segment[0].segmentId = this.getSegmentId(item);
        slice.segment[0].origin = this.fillOrigin(data, slice.sliceId, slice.segment[0].segmentId);
        slice.segment[0].destination = this.fillDestination(data, slice.sliceId, slice.segment[0].segmentId);
        slice.segment[0].groupsType = [this.fillGroupsTypeByItem(item)];
        return slice;
    }

    private newSegment = (data: VoluntaryRefundsModel, item: OrderItemsEntity): Segment => {
        let segment: Segment = this.initSegment();
        const sliceId: string = this.getSliceId(data, item);
        segment.segmentId = this.getSegmentId(item);
        segment.origin = this.fillOrigin(data, sliceId, segment.segmentId);
        segment.destination = this.fillDestination(data, sliceId, segment.segmentId);
        segment.groupsType = [this.fillGroupsTypeByItem(item)];
        return segment;
    }

    private findType = (summaryAncillariesRefund: SummaryAncillariesRefund[], type: string): number => {
        return summaryAncillariesRefund.findIndex((ancillarie) => ancillarie.serviceType === type)
    }

    private findTypeNotRefund = (summaryAncillariesNotRefund: SummaryAncillariesNotRefund[], type: string): number => {
        return summaryAncillariesNotRefund.findIndex((ancillarie) => ancillarie.serviceType === type)
    }

    private findTypeNotRefundOnline = (summaryAncillariesNotRefundOnline: SummaryAncillariesNotRefundOnline[], type: string): number => {
        return summaryAncillariesNotRefundOnline.findIndex((ancillarie) => ancillarie.serviceType === type)
    }

    private fillOrigin = (data: VoluntaryRefundsModel, sliceId: string, segmentId: string): Origin => {
        let origin = this.initOrigin();
        data.order.slices.filter((slice) => slice.sliceId === sliceId).map((slice) => {
            if (segmentId !== '') {
                slice.segments.filter((segment) => segment.id === segmentId).map((segment) => {
                    origin.description = segment.departure.city.description;
                    origin.code = segment.departure.city.code;
                })
            } else {
                origin.description = slice.segments[0].departure.city.description;
                origin.code = slice.segments[0].departure.city.code;
            }
        });
        return origin;
    }

    private fillDestination = (data: VoluntaryRefundsModel, sliceId: string, segmentId: string = null): Origin => {
        let destination = this.initDestination();
        data.order.slices.filter((slice) => slice.sliceId === sliceId).map((slice) => {
            if (segmentId !== '') {
                slice.segments.filter((segment) => segment.id === segmentId).map((segment) => {
                    destination.description = segment.arrival.city.description;
                    destination.code = segment.arrival.city.code;
                })
            } else {
                destination.description = slice.segments[slice.segments.length - 1].arrival.city.description;
                destination.code = slice.segments[slice.segments.length - 1].arrival.city.code;
            }
        });
        return destination;
    }

    private fillGroupsTypeByItem = (item: OrderItemsEntity): GroupsType => {
        let groupsType: GroupsType = this.initGroupsType();
        groupsType.subtype = item.subtype,
            groupsType.quantity = 1,
            groupsType.avios = 0,
            groupsType.cash = item.price.fare,
            groupsType.formatCash = this.MmBCurrencyService.formatPrice(this.getCurrencyObj(), item.price.fare, true, false, true, true);
        groupsType.currency = item.price.currency,
            groupsType.symbol = this.getSymbol(item.price.currency),
            groupsType.totalAvios = 0,
            groupsType.totalCash = groupsType.cash * groupsType.quantity;
        groupsType.formatTotalCash = this.MmBCurrencyService.formatPrice(this.getCurrencyObj(), groupsType.totalCash, true, false, true, true);
        return groupsType;
    }

    private findSlice = (summaryAncillariesRefund: SummaryAncillariesRefund, sliceId: string): number => {
        return summaryAncillariesRefund.slice.findIndex((slice) => slice.sliceId === sliceId);
    }

    private findSegment = (slice: Louse, segmentId: string): number => {
        return slice.segment.findIndex((slice) => slice.segmentId === segmentId);
    }

    private findGroupType = (segment: Segment, fare: number): number => {
        return segment.groupsType.findIndex((groupType) => groupType.cash === fare);
    }

    private updateInfoSummaryPenalty = (data: VoluntaryRefundsModel): SummaryPenalty => {
        let summaryPenalty: SummaryPenalty = this.initSummaryPenalty();
        summaryPenalty.summaryPassengerPenalties = this.updateSummaryPassengerPenalties(data);
        return summaryPenalty;
    };

    private updateSummaryPassengerPenalties = (data: VoluntaryRefundsModel): SummaryPassengerPenalty[] => {
        let summaryPassengerPenalties: SummaryPassengerPenalty[] = [];
        data.detailedReshopDifferentials.filter((detail) => detail.type === 'flight').map((penaltyPassenger) => {
            const passengerType: string = this.getPassengerType(data.passengers, penaltyPassenger.passengerID);
            const positionPassengerType: number = this.findPassengerType(summaryPassengerPenalties, passengerType);
            if (positionPassengerType > -1) {
                summaryPassengerPenalties[positionPassengerType].quantityPassenger += 1;
                summaryPassengerPenalties[positionPassengerType].totalCash = summaryPassengerPenalties[positionPassengerType].quantityPassenger * summaryPassengerPenalties[positionPassengerType].cash;
                summaryPassengerPenalties[positionPassengerType].formatTotalCash = this.MmBCurrencyService.formatPrice(this.getCurrencyObj(), summaryPassengerPenalties[positionPassengerType].totalCash, true, false, true, true);
            } else {
                summaryPassengerPenalties.push(this.newSummaryPassengerPenalties(penaltyPassenger, passengerType));
            }
        });
        return summaryPassengerPenalties;
    }

    private newSummaryPassengerPenalties = (penaltyPassenger: DetailedReshopDifferentialsEntity, passengerType: string): SummaryPassengerPenalty => {
        let summaryPassengerPenalty: SummaryPassengerPenalty = this.initSummaryPassengerPenalty();
        summaryPassengerPenalty.passengerType = passengerType;
        summaryPassengerPenalty.quantityPassenger = 1;
        summaryPassengerPenalty.avios = 0;
        summaryPassengerPenalty.cash = penaltyPassenger.penalty.fare;
        summaryPassengerPenalty.formatCash = this.MmBCurrencyService.formatPrice(this.getCurrencyObj(), penaltyPassenger.penalty.fare, true, false, true, true);
        summaryPassengerPenalty.currency = penaltyPassenger.penalty.currency;
        summaryPassengerPenalty.symbol = this.getSymbol(penaltyPassenger.penalty.currency);
        summaryPassengerPenalty.totalAvios = 0;
        summaryPassengerPenalty.totalCash = summaryPassengerPenalty.quantityPassenger * summaryPassengerPenalty.cash;
        summaryPassengerPenalty.formatTotalCash = this.MmBCurrencyService.formatPrice(this.getCurrencyObj(), summaryPassengerPenalty.totalCash, true, false, true, true);
        return summaryPassengerPenalty;
    }

    private findPassengerType = (summaryPassengerPenalty: SummaryPassengerPenalty[], passengerType: string): number => {
        return summaryPassengerPenalty.findIndex((passenger) => passenger.passengerType === passengerType);
    }

    private getSymbol = (currency): string => {
        let symbol: string = '';
        switch (currency) {
            case 'EUR':
                symbol = '€';
                break;
            case 'USD':
                symbol = '$';
                break;
            default:
                symbol = '€';
                break;
        }
        return symbol;
    }

    private getPassengerType = (passengers: PassengersEntity[], passengerId: string): string => {
        let passengerType: string = '';
        passengers.map((passenger) => {
            if (passenger.passengerId === passengerId) {
                passengerType = passenger.passengerType;
            };
        })
        return passengerType;
    };

    private findSliceIdBySegmentId = (slices: SlicesEntity[], segmentId: string): string => {
        let slideId = '';
        slices.map((slice) => {
            slice.segments.map((segment) => {
                if (segment.id === segmentId) {
                    slideId = slice.sliceId;
                }
            });
        });
        return slideId;
    }

    private getCurrencyObj = (): CurrencyResponse => {
        let currency: CurrencyResponse;
        const commercialInfo: any = this.CommonsSessionStorageService.get('commercialInfo') ?? {};
        const bookingInfo: any = this.CommonsSessionStorageService.get('bookingInfo') ?? {};

        if (bookingInfo?.contextMetadata?.currencies[0]) {
            currency = this.MmBCurrencyService.getCurrencyObject(bookingInfo.contextMetadata.currencies[0]);
        } else if (commercialInfo?.currency) {
            currency = this.MmBCurrencyService.getCurrencyObject(commercialInfo.currency);
        } else {
            currency = {
                alignment: 'R',
                suffixSymbol: true,
                decimalSeparator: ',',
                numberDecimals: 2,
                groupingSeparator: '.',
                currencySymbol: '€',
                description: 'EUR'
            }
        }

        return currency;
    }

    private getSliceId = (data: VoluntaryRefundsModel, item: OrderItemsEntity): string => {
        return item.sliceId ?? this.findSliceIdBySegmentId(data.order.slices, item.segmentId ?? item?.segments[0]?.segmentId)
    }

    private getSegmentId = (item: OrderItemsEntity): string => {
        return item.segmentId ?? '';
    }
}
