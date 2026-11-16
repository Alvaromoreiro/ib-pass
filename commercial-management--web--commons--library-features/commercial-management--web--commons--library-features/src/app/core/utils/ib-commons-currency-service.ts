import * as angular from 'angular';

@Service('ib-commons-utils-module', ['$filter', 'localStorageService'])
export class CurrencyService {
    constructor (
        private $filter: ng.IFilterService,
        private localStorageService: ng.local.storage.ILocalStorageService
    ) {}

    getCurrencyObject = (serviceCurrency: CommonsCurrencyModel.CurrencyObject) : CommonsCurrencyModel.CurrencyResponse => {
        const currency: CommonsCurrencyModel.CurrencyResponse = {
            suffixSymbol: true,
            decimalSeparator: ',',
            numberDecimals: 2,
            groupingSeparator: '.',
            currencySymbol: '',
            description: '',
            code: serviceCurrency.code
        };

        if (serviceCurrency) {
            currency.suffixSymbol = serviceCurrency.alignment === 'R';
            currency.decimalSeparator = serviceCurrency.decimalSeparator ? serviceCurrency.decimalSeparator : ',';
            currency.groupingSeparator = serviceCurrency.groupingSeparator ? serviceCurrency.groupingSeparator : '.';
            currency.description = serviceCurrency.description ? serviceCurrency.description : '';

            if (angular.isDefined(serviceCurrency.decimals) && serviceCurrency.decimals !== null) {
                currency.numberDecimals = serviceCurrency.decimals;
            }
            if(serviceCurrency.symbol) {
                currency.currencySymbol = serviceCurrency.symbol;
            }else{
                currency.currencySymbol = serviceCurrency.code ? serviceCurrency.code : '';
            }
        }
        return currency;
    };

    getPriceByRoundingPolicy = (price: number) :number => {
        let returnedPrice = null;
        const commercialData: CommonsCurrencyModel.CurrencyCommercialData = this.localStorageService.get('commercialData');

        switch (commercialData.roundingPolicy) {
                case 'ROUND_UP':
                    returnedPrice = Math.ceil(price);
                    break;
                case 'HALF_ROUND_DOWN':
                    returnedPrice = price % 0.5 === 0 ? Math.floor(price) : Math.round(price);
                    break;
                case null:
                    returnedPrice = Math.ceil(price);
        }
        return returnedPrice;
    };

    formatPrice = (currencyData: CommonsCurrencyModel.CurrencyResponse, price: number, decimals: boolean, roundedByService: boolean, space: boolean = false):string => {
        const commercialData: CommonsCurrencyModel.CurrencyCommercialData = this.localStorageService.get('commercialData');
        const currencyObject : any = this.localStorageService.get('commercialData') || null;
        let response='';
        if (roundedByService && commercialData) {
            decimals = false;
            price = this.getPriceByRoundingPolicy(price);
        }
        price = price || 0;

        if (price === 0) {
            decimals = false;
        }

        if(currencyData) {
            if(!angular.isObject(currencyData) && currencyObject && currencyObject.currency ) {
                const formatedCurrencyObject = this.getCurrencyObject(currencyObject.currency);
                currencyData = formatedCurrencyObject;
            }
            if(space) {
                currencyData.currencySymbol = ' ' + currencyData.currencySymbol;
            }
            const groupingSeparator = {
                GROUP_SEP: currencyData.groupingSeparator,
                DECIMAL_SEP: currencyData.decimalSeparator
            };
            if(decimals) {
                response = this.$filter<CommonsCurrencyModel.CommonsCurrencyFilter>('currency')(
                    price,
                    currencyData.currencySymbol,
                    currencyData.numberDecimals,
                    currencyData.suffixSymbol,
                    groupingSeparator
                );
            }else{
                response = this.$filter<CommonsCurrencyModel.CommonsCurrencyFilter>('currency')(
                    price,
                    currencyData.currencySymbol,
                    0,
                    currencyData.suffixSymbol,
                    groupingSeparator);
            }
        }
        return response;
    };
    /**
     * SAME CODE FORMAT PRICE - WE NEED DELETE THIS FUNCTION AND CREATE A GENERAL FUNCTION TO BOTH CASES
     * @param currencyData
     * @param price
     * @param decimals
     * @param roundedByService
     */
    formatPriceWithoutSimbol = (currencyData: CommonsCurrencyModel.CurrencyResponse, price: number, decimals: boolean, roundedByService: boolean) =>{
        const commercialData: CommonsCurrencyModel.CurrencyCommercialData = this.localStorageService.get('commercialData');
        let response = '';
        if(roundedByService && commercialData) {
            decimals = false;
            price = this.getPriceByRoundingPolicy(price);
        }

        price = price || 0;

        if (price === 0) {
            decimals = false;
        }
        if(currencyData) {
            const groupingSeparator = {
                GROUP_SEP: currencyData.groupingSeparator,
                DECIMAL_SEP: currencyData.decimalSeparator
            };
            if(decimals) {
                response = this.$filter<CommonsCurrencyModel.CommonsCurrencyFilter>('currency')(
                    price,
                    '',
                    currencyData.numberDecimals,
                    currencyData.suffixSymbol,
                    groupingSeparator
                );
            }else{
                response = this.$filter<CommonsCurrencyModel.CommonsCurrencyFilter>('currency')(
                    price,
                    '',
                    0,
                    currencyData.suffixSymbol,
                    groupingSeparator);
            }
        }
        return response;
    };

    formatAvios = (groupingSeparator: string, avios: string) => {
        const value = parseInt(avios) || 0;
        let response= avios;
        const separator = {
            GROUP_SEP: groupingSeparator,
            DECIMAL_SEP: null
        };
        if(groupingSeparator) {
            response = this.$filter<CommonsCurrencyModel.CommonsCurrencyFilter>('currency')(
                value, '', 0, false, separator);
        }
        return response;
    };

    getCurrenciesAsMap= (currencies: CommonsCurrencyModel.CurrencyObject[])=> {
        const returnedCurrencies = {};
        currencies = currencies || [];

        for (let i = 0; i < currencies.length; i++) {
            if (currencies[i] !== null) {
                returnedCurrencies[currencies[i].code] = this.getCurrencyObject(currencies[i]);
            }
        }
        return returnedCurrencies;
    };


}