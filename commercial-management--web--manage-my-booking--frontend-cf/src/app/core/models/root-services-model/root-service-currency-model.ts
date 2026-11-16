namespace ServiceCurrencyData {
    export interface Currency {
        suffixSymbol: boolean,
        decimalSeparator: string,
        code: string,
        numberDecimals: number,
        groupingSeparator: string,
        currencySymbol: string,
        description: string,
        symbol: string,
        recommendedDisplay: string
    }
}