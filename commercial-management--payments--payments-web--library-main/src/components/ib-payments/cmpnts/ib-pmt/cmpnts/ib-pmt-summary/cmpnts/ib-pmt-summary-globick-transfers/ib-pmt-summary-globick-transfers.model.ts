export type BasketTotal = {
    total: number,
    totalFormatted: string
};

export interface IbPmtSummaryGlobickTransfers {
    info: {
        date: string,
        dateReturn: string,
        transferCar: string,
        price: number,
        priceFormatted: number,
        totalFormatted: string,
        priceReturn: number,
        priceFormattedReturn: number,
        totalFormattedReturn: string
    },
    hasTransfersGlobick: boolean,
    total: BasketTotal,
}

