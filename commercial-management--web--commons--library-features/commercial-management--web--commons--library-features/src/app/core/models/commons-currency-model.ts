namespace CommonsCurrencyModel{
    export type CurrencyObject = {
        alignment :string;
        decimalSeparator: string;
        decimals: number;
        groupingSeparator: string;
        symbol:string;
        code: string;
        description: string;
    };
    export type CurrencyResponse = {
        suffixSymbol:boolean;
        decimalSeparator: string;
        numberDecimals:number;
        groupingSeparator:string;
        currencySymbol:string;
        description:string;
        code?:string;
    };
    export type CurrencyCommercialData = {
        roundingPolicy: string;
    };
    export type CurrencyCustomFormat = {
        GROUP_SEP:string;
        DECIMAL_SEP:string;
    };
    export interface CommonsCurrencyLocation extends ng.ILocationService {
        NUMBER_FORMATS:{
            DEFAULT_PRECISION:number;
            CURRENCY_SYM:string;
            GROUP_SEP:string;
            DECIMAL_SEP:string;
            PATTERNS:[CommonsCurrencyLocationPatterns, CommonsCurrencyLocationPatterns];
        }
    }
    export type CommonsCurrencyLocationPatterns = {
        negPre?:string;
        posPre?:string;
        negSuf?:string;
        posSuf?:string;
    };
    export interface CommonsCurrencyFilter {
        (amount: number, currencySymbol:string, fractionSize:number, suffixSymbol:boolean, customFormat:CurrencyCustomFormat):string;
    }
    export type CommonsCurrencyMap = Record<string, unknown>;

}
