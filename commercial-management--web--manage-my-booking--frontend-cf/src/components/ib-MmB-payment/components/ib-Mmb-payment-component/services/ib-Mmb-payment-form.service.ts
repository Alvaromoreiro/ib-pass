import { EventEmitter, Inject, Injectable } from '@angular/core';
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { PaymentComponentConfig } from '@src/components/ib-MmB-payment/models/ib-Mmb-payments-model';
import { CurrencyConversion, CurrencyDisplayFormat, PriceSubscriptionModel } from '@src/components/ib-MmB-payment/models/ib-Mmb-payments-component-model';
import { AJSCurrencyService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { HeaderModelLocalstorage, Total } from '@src/app/core/models/header-model/header.model';

@Injectable({ providedIn: 'root' })
export class IbMmbPaymentFormService {
    private paymentWebComponent = null;
    private readonly INDEX_URL = `${MmBAppConstants.paymentsComponentURI}index.esm.js`;
    private readonly COMPONENT_ESM = `${MmBAppConstants.paymentsComponentURI}payment-component.esm.js`;
    public priceUpdateEmitter = new EventEmitter<PriceSubscriptionModel>();

    constructor(
        private CommonsSessionStorageService: CommonsSessionStorageService,
        @Inject(AJSCurrencyService) private CurrencyService: CurrencyService
    ) { }

    private importWebComponent = async () => {
        const [PaymentWebComponentModule] = await Promise.all(
            [
                import(/* webpackIgnore: true */ this.INDEX_URL),
                import(/* webpackIgnore: true */ this.COMPONENT_ESM)
            ]
        );
        const { PaymentWebComponent } = PaymentWebComponentModule;
        this.paymentWebComponent = new PaymentWebComponent();
        return this.paymentWebComponent;
    };

    public getNewPaymentComponent = async (componentConfig: PaymentComponentConfig) => {
        if (this.paymentWebComponent === null) {
            await this.importWebComponent();
        }
        await this.paymentWebComponent.init(componentConfig);
        return this.paymentWebComponent;
    };

    public getPriceFormatted = (price) => {
        const currency = this.CommonsSessionStorageService.get('currency');
        return this.CurrencyService.formatPrice(currency, price, true, false);
    };

    public updatePrice(data: PriceSubscriptionModel): void {
        this.priceUpdateEmitter.emit(data);
    }



    public formatPrice = (price: number, format: CurrencyDisplayFormat): string => {

        const formatDecimals = (price: number, decimals: number): string => {
            return price.toFixed(decimals);
        };

        const formatGrouping = (price: string, format: CurrencyDisplayFormat['separator']): string => {
            return price.toString()
                .replace('.', format.decimal)
                .replace(/\B(?=(\d{3})+(?!\d))/g, format.grouping);
        };

        const formatCurrency = (price: string, format: CurrencyDisplayFormat['symbol']): string => {
            return format.alignment === 'L' ? `${format.value}${price}` : `${price}${format.value}`;
        };

        const priceWithDecimals = formatDecimals(price, format.decimalDigits.value);
        const priceWithGrouping = formatGrouping(priceWithDecimals, format.separator);
        return formatCurrency(priceWithGrouping, format.symbol);
    };

    /**
     * 💳​ DCC - Dynamic Currency Conversion 
     */
    public processDccPrice(data: PriceSubscriptionModel): string | undefined {
        const { currencyConversion, currency } = data;

        const hasCurrencyConversion =
            currencyConversion &&
            typeof currencyConversion.total === 'number' &&
            currencyConversion.currency;

        if (!hasCurrencyConversion) {
            return undefined;
        }

        const dccPrice = this.formatDCCInfo(currencyConversion, currency.format);


        return dccPrice;
    }
    
    public formatDCCInfo = (currencyConversion: CurrencyConversion, currencyDisplayFormat: CurrencyDisplayFormat): string | undefined => {
        if (!currencyConversion) {
            return;
        }
        const currencyFormat = structuredClone(currencyDisplayFormat);
        currencyFormat.symbol.value = currencyConversion.currency;

        return this.formatPrice(currencyConversion.total, currencyFormat)
    };


    public updateDCCInHeaderModel(data: PriceSubscriptionModel): void {
        const headerModel = this.getHeaderModel();
        if (!headerModel) return;

        const basketTotal = headerModel.headerModel.shoppingBasket.total;

        if (!this.hasCurrencyConversion(data)) {
            this.removeDccFromBasket(basketTotal, headerModel);
            return;
        }

        this.updateDccInBasket(basketTotal, headerModel, data);
    }

    private getHeaderModel(): HeaderModelLocalstorage | null {
        const headerModel = this.CommonsSessionStorageService.get<HeaderModelLocalstorage>('headerModel');
        return headerModel?.headerModel?.shoppingBasket?.total ? headerModel : null;
    }


    private hasCurrencyConversion(data: PriceSubscriptionModel): boolean {
        return data?.currencyConversion?.total != null && data?.currencyConversion?.currency != null;
    }


    private removeDccFromBasket(basketTotal: Total, headerModel: HeaderModelLocalstorage): void {
        if (!('totalDcc' in basketTotal)) return;

        delete basketTotal.totalDcc;
        this.CommonsSessionStorageService.set('headerModel', headerModel);
    }


    private updateDccInBasket(basketTotal: Total, headerModel: HeaderModelLocalstorage, data: PriceSubscriptionModel): void {
        const formattedDCCPrice = this.processDccPrice(data);
        if (!formattedDCCPrice || basketTotal.totalDcc === formattedDCCPrice) return;

        basketTotal.totalDcc = formattedDCCPrice;
        this.CommonsSessionStorageService.set('headerModel', headerModel);
    }
    /** End DCC - Dynamic Currency Conversion  */

}

