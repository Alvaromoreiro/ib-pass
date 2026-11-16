import { listTaxedRefundInfo, listFareBasisRefundInfo } from "./ib-voluntary-refunds-model";

export interface VoluntaryRefundsTransformerModel {
    less24Hours: boolean
    price: Price
    penalty: Penalty
    totalRefund: string
    totalRefundWithoutPenalty: string
    totalBookingPrice: string
    noRefundPrice: string
    summaryRefund: SummaryRefund[]
    summaryAncillariesRefund: SummaryAncillariesRefund[]
    summaryAncillariesNotRefund: SummaryAncillariesNotRefund[]
    summaryAncillariesNotRefundOnline: SummaryAncillariesNotRefundOnline[]
    summaryPenalty: SummaryPenalty
    withPayments: boolean
    noPenalty: string
    refundItems: string[]
    notRefundItems: string[]
    notRefundOnlineItems: string[]
    taxes: Taxes
    listFareBasisRefundInfo: listFareBasisRefundInfo[],
 	onlyRefundAirportTaxes: boolean
    mixRefundNotRefundFare: boolean
    refundType: string;
    totalBookingAmountLongCurrency: CurrencyViews;
    formatPenaltyLongCurrency: CurrencyViews;
    totalRefundLongCurrency: CurrencyViews;
    noRefundPriceLongCurrency: CurrencyViews;
    longCurrencyLgView: boolean;
    longCurrencyXlView: boolean;
}

export interface CurrencyViews {
    lgView: boolean;
    xlView: boolean;
}

export interface Taxes {
    listTaxedRefundInfo: listTaxedRefundInfo[]
}

export interface Price {
    currency: string
    symbol: string
    avios: number
    cash: number
    tax: number
    ticketingFee: number
    totalAvios: number
    totalCash: number
    totalRefundPrice: number
}

export interface Penalty {
    currency: string
    symbol: string
    avios: number
    cash: number
    formatPenalty: string
}

export interface SummaryRefund {
    passengerType: string
    quantityPassenger: number
    avios: number
    cash: number
    formatCash: string
    tax: number
    formatTax: string
    currency: string
    symbol: string
    totalAvios: number
    totalCash: number
    formatTotalCash: string
}

export interface SummaryAncillariesRefund {
    serviceType: string
    slice: Louse[]
}

export interface SummaryAncillariesNotRefund {
    serviceType: string
}

export interface SummaryAncillariesNotRefundOnline {
    serviceType: string
}

export interface Louse {
    sliceId: string
    segment: Segment[]
}

export interface Segment {
    segmentId: string
    origin: Origin
    destination: Destination
    groupsType: GroupsType[]
}

export interface Origin {
    description: string
    code: string
}

export interface Destination {
    description: string
    code: string
}

export interface GroupsType {
    subtype: string
    quantity: number
    avios: number
    cash: number
    formatCash: string
    currency: string
    symbol: string
    totalAvios: number
    totalCash: number
    formatTotalCash: string
}

export interface SummaryPenalty {
    summaryPassengerPenalties: SummaryPassengerPenalty[]
}

export interface SummaryPassengerPenalty {
    passengerType: string
    quantityPassenger: number
    avios: number
    cash: number
    formatCash: string
    currency: string
    symbol: string
    totalAvios: number
    totalCash: number
    formatTotalCash: string
}


