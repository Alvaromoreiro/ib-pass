import { Inject, Injectable } from "@angular/core";
import { DatalayerConstants } from "ib-web-commons/ib-datalayer";
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import { AJSMmBDigitalDataService } from "./ib-mmb-digital-data-bridge.service";
import { MmBDigitalDataService } from "./ib-MmB-digital-data-service";
import { MmBAppConstants } from "@src/ib-MmB-constants";

@Injectable()
export class DatalayerEcommerceService {

    constructor(
        @Inject(AJSMmBDigitalDataService) private DigitalDataService: MmBDigitalDataService,
        private localStorageService: CommonsSessionStorageService
    ){}

    setAddPurchase = (confirmationInfo): void => {
        const addToCart: any = this.localStorageService.get('addToCart');
        const typeCard = this.localStorageService.get('typeCardIberiaPay');
        const bookingInfo: any = this.localStorageService.get('bookingInfo');
        const headerModel: any = this.localStorageService.get('headerModel');
        const commercialInfo: any = this.localStorageService.get('commercialInfo');
        if (addToCart) {
            addToCart.ecommerce.transaction_id = this.localStorageService.get('PNR');
            addToCart.ecommerce.affiliation = bookingInfo.contextMetadata.country;
            addToCart.ecommerce.value = headerModel?.headerModel?.shoppingBasket?.total.original;
            addToCart.ecommerce.tax = '';
            addToCart.ecommerce.shipping = 0.00;
            addToCart.ecommerce.currency = commercialInfo?.currency?.code;
            typeCard ? addToCart.ecommerce.items.push(this.setCreditCardFeeEcommerce(confirmationInfo, addToCart, typeCard)) : '';
            this.DigitalDataService.addDigitalDataEcommerceEvent(addToCart.ecommerce, 'purchase');
        }
    }

    private setCreditCardFeeEcommerce = (confirmationInfo, addToCart, typeCard) => {
        const id = this.getIdItem(null);
        const itemBrandValor = addToCart?.ecommerce?.items[0]?.item_brand.toLowerCase();
        const category = this.getCategoty();
        let price = confirmationInfo?.summaryInfo?.orderFees?.total || 0;
        
        const item = this.getItemEcommerce('credit card fee', id, price, itemBrandValor, category.toLowerCase(), 'all', 'all', typeCard.toLowerCase(), 1);

        return item;
    }

    private getIdItem = (type: string): string => {
        let idItem: string = '';
        const flowApp = this.localStorageService.get('flowApp');
        const availabilityRequestData: any = this.localStorageService.get('availabilityRequestData');
        const originDestinationMulticity: any = this.localStorageService.get('originDestinationMulticity');
        const flightsInfo: any = this.localStorageService.get('flightsInfo');

        if (type === 'all' && originDestinationMulticity) {
            originDestinationMulticity.forEach(slice => {
                if (idItem !== '') {
                    idItem += '|';
                }
                idItem += slice.originCity.code + '-' + slice.destinationCity.code;
            });
        } else if (availabilityRequestData) {
            idItem = availabilityRequestData?.slices.length === 1 || originDestinationMulticity ? availabilityRequestData.slices[0].origin + '-' + availabilityRequestData.slices[0].destination : availabilityRequestData.slices[0].origin + '-' + availabilityRequestData.slices[0].destination + '|' + availabilityRequestData.slices[0].destination + '-' + availabilityRequestData.slices[0].origin;
        } else if (flightsInfo) {
            flightsInfo.forEach(slice => {
                if (idItem !== '') {
                    idItem += '|';
                }
                idItem += slice.departure.city.code + '-' + slice.arrival.city.code;
            });
        }
        return idItem;
    }

    private getCategoty = (): string => {
        let category;
        const flowApp = this.localStorageService.get('flowApp');

        if (flowApp === MmBAppConstants.APP_TYPES.ONHOLD) {
            category = DatalayerConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.ON_HOLD;
        } else {
            category = DatalayerConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.DIRECT;
        }

        return category;
    }

    private getItemEcommerce = (name, id, price, brand, category, category2, category3, variant, quantity) => {
        const item = {
            item_name: name,
            item_id: id,
            price: price,
            item_brand: brand,
            item_category: category.toLowerCase(),
            item_category2: category2,
            item_category3: category3,
            item_variant: variant,
            quantity: quantity ? quantity : 1
        };

        return item;
    }
}