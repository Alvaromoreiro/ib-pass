@Service('ib-newMain-header-module', ['CommonsUtilService', 'DatalayerConstants', 'DigitalDataService', 'localStorageService', 'DatalayerUtilsService'])
export class DatalayerMenusService {

    constructor (
        private CommonsUtilService: CommonsUtilService,
        private DatalayerConstants: DatalayerConstantsType,
        private DigitalDataService: DigitalDataService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private DatalayerUtilsService: DatalayerUtilsService
    ) {}

    deleteBaggages = (segment, baggageTypeSelected): void => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: []};
        const addToCart: any = this.localStorageService.get('addToCart');
        const id: string = this.CommonsUtilService.getIdItem('all');
        const itemCategory2: string = `${segment.origin.code}-${segment.destination.code}`;
        segment?.baggages.forEach(baggage => {
            if(baggage?.type === baggageTypeSelected) {
                addToCart.ecommerce.items.forEach(item => {
                    if(item.item_name === 'baggage' && item.item_id === id && item.item_category2 === itemCategory2 && item.item_variant === baggage.description.replace('Kg', 'kilos')) {
                        digital_data_ecommerce.items.push(item);
                    }
                });
            }
        });
        if(digital_data_ecommerce.items.length > 0) {
            this.updateDataLayer(digital_data_ecommerce);
        }
    };

    private getBaggagePrice = (baggage): number => {
        let price = 0;
        if(baggage?.total && baggage?.quanty) price = baggage.total / baggage.quanty;
        return price;
    };

    deleteSeats = (segmentId: string, seat: any): void => {
        const seatInfoConfirmation: any = this.localStorageService.get('seatInfoConfirmation');
        const addToCart: any = this.localStorageService.get('addToCart');
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: []};
        let item_category2: string = '';
        const quantitySeats: number = seat?.passengers.length;
        seatInfoConfirmation?.segments.forEach(segment => {
            if(segment.id === segmentId) item_category2 = segment.departure.code + '-' + segment.arrival.code;
        });
        addToCart?.ecommerce?.items.forEach(item => {
            const price = seat?.amount / quantitySeats;
            if(item.item_name === 'seat' && item.item_category2 === item_category2 && item.price === price && item.quantity === quantitySeats) {
                digital_data_ecommerce.items.push(item);
            }
        });
        if(digital_data_ecommerce.items.length > 0) {
            this.updateDataLayer(digital_data_ecommerce);
        }
    };

    deleteAncillaries = (category: string) => {
        const addToCart: any = this.localStorageService.get('addToCart');
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: []};
        addToCart.ecommerce.items.forEach(item => {
            if(category === 'flexibility' && item.item_name === 'flexibilization') {
                digital_data_ecommerce.items.push(item);
            }
        });
        if(digital_data_ecommerce.items.length > 0) {
            this.updateDataLayer(digital_data_ecommerce);
        }
    };

    deleteSpeqs = (segment, speqTypeSelected): void => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: []};
        const addToCart: any = this.localStorageService.get('addToCart');
        const id: string = this.CommonsUtilService.getIdItem('all');
        const itemCategory2: string = `${segment.origin.code}-${segment.destination.code}`;
        segment?.speqs.forEach(speq => {
            if(speq?.type === speqTypeSelected) {
                addToCart.ecommerce.items.forEach(item => {
                    if(item.item_name === 'special baggage' && item.item_id === id && item.item_category2 === itemCategory2 && item.item_variant === this.CommonsUtilService.getSpeqsVariant(speqTypeSelected)) {
                        digital_data_ecommerce.items.push(item);
                    }
                });
            }
        });
        if(digital_data_ecommerce.items.length > 0) {
            this.updateDataLayer(digital_data_ecommerce);
        }
    };

    deleteInsurance = (): void => {
        const addToCart: any = this.localStorageService.get('addToCart');
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: []};
        addToCart.ecommerce.items.forEach(item => {
            if(item.item_name === 'insurance') {
                digital_data_ecommerce.items.push(item);
            }
        });
        if(digital_data_ecommerce.items.length > 0) {
            this.updateDataLayer(digital_data_ecommerce);
        }
    };

    deletePriorityBoarding = (deleteInfo: any): void => {
        const addToCart: any = this.localStorageService.get('addToCart');
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: []};
        const id: string = this.CommonsUtilService.getIdItem('all');
        const itemCategory2: string = this.DatalayerUtilsService.getItemCategory2(this.CommonsUtilService.getSliceById(deleteInfo?.id));
        addToCart.ecommerce.items.forEach(item => {
            if(item.item_name === 'priority boarding' && item.item_id === id && item.item_category2 === itemCategory2) {
                digital_data_ecommerce.items.push(item);
            }
        });
        if(digital_data_ecommerce.items.length > 0) {
            this.updateDataLayer(digital_data_ecommerce);
        }
    };

    deleteBundle (bundleInfo: any) {
        const addToCart: any = this.localStorageService.get('addToCart');
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: []};
        addToCart.ecommerce.items.forEach((item: DigitalDataEcommerceModel.Item) => {
            if (item.item_name === 'bundle' && item.item_variant.includes(bundleInfo.id)) {
                digital_data_ecommerce.items.push(item);
            }
            if (item.item_name.includes(bundleInfo.id)) {
                digital_data_ecommerce.items.push(item);
            }
        });
        if(digital_data_ecommerce.items.length > 0) {
            this.updateDataLayer(digital_data_ecommerce);
        }
    }

    updateDataLayer (digitalDataEcommerce: any): void {
        this.DigitalDataService.addDigitalDataEcommerceEvent(digitalDataEcommerce, 'remove_from_cart');
        this.DigitalDataService.setRemoveInfoAddToCart(digitalDataEcommerce);
        const addToCart: any = this.localStorageService.get('addToCart');
    }
}