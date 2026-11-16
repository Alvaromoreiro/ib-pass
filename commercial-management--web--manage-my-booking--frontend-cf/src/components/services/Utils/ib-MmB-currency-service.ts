import * as angular from 'angular';
import { CurrencyObject, CurrencyResponse, CurrencyCommercialData, CommonsCurrencyFilter} from './models/currency-type.model';

@Service('ib-MmB-services-module', ['$filter', 'localStorageService'])
export class MmBCurrencyService {
    constructor (
        private $filter: ng.IFilterService,
        private localStorageService: ng.local.storage.ILocalStorageService
    ) {}

    getCurrencyObject = (serviceCurrency: CurrencyObject) : CurrencyResponse => {
        const currency: CurrencyResponse = {
            alignment: 'R',
            suffixSymbol: true,
            decimalSeparator: ',',
            numberDecimals: 2,
            groupingSeparator: '.',
            currencySymbol: '',
            description: ''
        };

        if (serviceCurrency) {
            currency.alignment = serviceCurrency.alignment ? serviceCurrency.alignment : 'R';
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
        const commercialData: CurrencyCommercialData = this.localStorageService.get('commercialData');

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

    formatPrice = (currencyData: CurrencyResponse, price: number, decimals: boolean, roundedByService: boolean, space: boolean = false, decimalsZero: boolean = false):string => {
        const commercialData: CurrencyCommercialData = this.localStorageService.get('commercialData');
        const currencyObject : any = this.localStorageService.get('commercialData') || null;
        let response='';
        if (roundedByService && commercialData) {
            decimals = false;
            price = this.getPriceByRoundingPolicy(price);
        }
        price = price || 0;

        if (price === 0 && !decimalsZero) {
            decimals = false;
        }

        if(currencyData) {
            if(!angular.isObject(currencyData) && currencyObject && currencyObject.currency ) {
                const formatedCurrencyObject = this.getCurrencyObject(currencyObject.currency);
                currencyData = formatedCurrencyObject;
            }
            if(space) {
                if (currencyData.alignment === 'L') {
                    currencyData.currencySymbol = currencyData.currencySymbol + ' ';
                } else {
                    currencyData.currencySymbol = ' ' + currencyData.currencySymbol;
                }
            }
            const groupingSeparator = {
                GROUP_SEP: currencyData.groupingSeparator,
                DECIMAL_SEP: currencyData.decimalSeparator
            };
            if(decimals) {
                response = this.$filter<CommonsCurrencyFilter>('currency')(
                    price,
                    currencyData.currencySymbol,
                    currencyData.numberDecimals,
                    currencyData.suffixSymbol,
                    groupingSeparator
                );
            }else{
                response = this.$filter<CommonsCurrencyFilter>('currency')(
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
    formatPriceWithoutSimbol = (currencyData: CurrencyResponse, price: number, decimals: boolean, roundedByService: boolean) =>{
        const commercialData: CurrencyCommercialData = this.localStorageService.get('commercialData');
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
                response = this.$filter<CommonsCurrencyFilter>('currency')(
                    price,
                    '',
                    currencyData.numberDecimals,
                    currencyData.suffixSymbol,
                    groupingSeparator
                );
            }else{
                response = this.$filter<CommonsCurrencyFilter>('currency')(
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
            response = this.$filter<CommonsCurrencyFilter>('currency')(
                value, '', 0, false, separator);
        }
        return response;
    };

    getCurrenciesAsMap = (currencies: CurrencyObject[]) => {
        const returnedCurrencies = {};
        currencies = currencies || [];

        for (let i = 0; i < currencies.length; i++) {
            if (currencies[i] !== null) {
                returnedCurrencies[currencies[i].code] = this.getCurrencyObject(currencies[i]);
            }
        }
        return returnedCurrencies;
    };
};
