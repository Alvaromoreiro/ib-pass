export type BasketTotal = {
    total: number,
    totalFormatted: string
};

export interface IbPmtSummaryGlobickActivities {
    info: {
        date: string,
        description: string,
        price: number,
        priceFormatted: number,
        totalFormatted: string
    },
    hasActivitiesGlobick: boolean,
    total: BasketTotal,
}

