namespace PmtCustomerCardsFees {
    export type creditcarsdFeesResponse = {
        ccFeeBinPrices: ccFeeBinPrices[]
    };
    export type ccFeeBinPrices = {
        bin?: string,
        value?: number,
        currency?: string
    };
}