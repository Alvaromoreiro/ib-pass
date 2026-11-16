import { Inject, Injectable } from '@angular/core';
import { AJSDatalayerBKIService, AJSDatalayerBKIServiceType } from '@shared/services/ib-datalayer/services/ib-datalayer-bki-service-bridge.service';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { DigitalDataService } from '@shared/services/ib-datalayer/services/ib-digital-data.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingAppConstants } from '../../../../../../../core/constants/ib-booking-constants';
import { ShoppingBasketPetcSegment } from '../../../../../../../core/models/ib-booking-availability/header-model';
import { DatalayerConstants } from '../../../../../../services/ib-datalayer/constants/ib-datalayer-constants';

@Injectable({providedIn: 'root'})
export class DatalayerBasketService {
    constructor (
        private DigitalDataService: DigitalDataService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        @Inject( AJSDatalayerUtilsService ) private DatalayerUtilsService: AJSDatalayerUtilsServiceType,
        @Inject(AJSDatalayerBKIService) private DatalayerBKIService: AJSDatalayerBKIServiceType
    ) { }

    deleteBaggages = (segment, baggageTypeSelected): void => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: []};
        const addToCart: any = this.CommonsSessionStorageService.get('addToCart');
        const id: string = this.DatalayerBKIService.getIdItem('all');
        const itemCategory2: string = `${segment.origin.code}-${segment.destination.code}`;
        segment?.baggages.forEach(baggage => {
            if(baggage?.type === baggageTypeSelected) {
                addToCart.ecommerce.items.forEach(item => {
                    if ( item.item_name === 'baggage' && item.item_id === id && item.item_category2 === itemCategory2 && item.item_variant === baggage.description.replace( 'Kg', 'kilos' ) ) {
                        digital_data_ecommerce.items.push(item);
                    }
                });
            }
        });
        if(digital_data_ecommerce.items.length > 0) {
            this.updateDataLayer(digital_data_ecommerce);
        }
    };

    deleteSeats = (segmentId: string, seat: any): void => {
        const seatInfoConfirmation: any = this.CommonsSessionStorageService.get('seatInfoConfirmation');
        const addToCart: any = this.CommonsSessionStorageService.get('addToCart');
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: []};
        let item_category2: string = '';
        const quantitySeats: number = seat?.passengers.length;
        seatInfoConfirmation?.segments.forEach(segment => {
            if(segment.id === segmentId) item_category2 = segment.departure.code + '-' + segment.arrival.code;
        });
        addToCart?.ecommerce?.items.forEach( item => {
            const price = seat?.amount / quantitySeats;
            if ( item.item_name === 'seat' && item.item_category2 === item_category2 && item.price === price && item.quantity === quantitySeats ) {
                digital_data_ecommerce.items.push(item);
            }
        });
        if(digital_data_ecommerce.items.length > 0) {
            this.updateDataLayer(digital_data_ecommerce);
        }
    };

    deleteAncillaries = ( category: string ) => {
        const addToCart: any = this.CommonsSessionStorageService.get( 'addToCart' );
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        addToCart.ecommerce.items.forEach( item => {
            if ( category === 'flexibility' && item.item_name === 'flexibilization' ) {
                digital_data_ecommerce.items.push( item );
            }
        });
        if ( digital_data_ecommerce.items.length > 0 ) {
            this.updateDataLayer( digital_data_ecommerce );
        }
    };

    deleteSpeqs = ( segment, speqTypeSelected ): void => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const addToCart: any = this.CommonsSessionStorageService.get( 'addToCart' );
        const id: string = this.DatalayerBKIService.getIdItem( 'all' );
        const itemCategory2: string = `${ segment.origin.code }-${ segment.destination.code }`;
        segment?.speqs.forEach( speq => {
            if ( speq?.type === speqTypeSelected ) {
                addToCart.ecommerce.items.forEach( item => {
                    if ( item.item_name === 'special baggage' && item.item_id === id && item.item_category2 === itemCategory2 && item.item_variant === this.DatalayerBKIService.getSpeqsVariant( speqTypeSelected ) ) {
                        digital_data_ecommerce.items.push( item );
                    }
                });
            }
        });
        if ( digital_data_ecommerce.items.length > 0 ) {
            this.updateDataLayer( digital_data_ecommerce );
        }
    };

    deleteInsurance = (): void => {
        const addToCart: any = this.CommonsSessionStorageService.get( 'addToCart' );
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        addToCart.ecommerce.items.forEach( item => {
            if ( item.item_name === 'insurance' ) {
                digital_data_ecommerce.items.push( item );
            }
        });
        if ( digital_data_ecommerce.items.length > 0 ) {
            this.updateDataLayer( digital_data_ecommerce );
        }
    };

    deletePriorityBoarding = ( deleteInfo: any ): void => {
        const addToCart: any = this.CommonsSessionStorageService.get( 'addToCart' );
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const id: string = this.DatalayerBKIService.getIdItem( 'all' );
        const itemCategory2: string = this.DatalayerUtilsService.getItemCategory2( this.DatalayerBKIService.getSliceById( deleteInfo?.id ) );
        addToCart.ecommerce.items.forEach( item => {
            if ( item.item_name === 'priority boarding' && item.item_id === id && item.item_category2 === itemCategory2 ) {
                digital_data_ecommerce.items.push( item );
            }
        });
        if ( digital_data_ecommerce.items.length > 0 ) {
            this.updateDataLayer( digital_data_ecommerce );
        }
    };

    deleteBundle ( bundleInfo: any ) {
        const addToCart: any = this.CommonsSessionStorageService.get( 'addToCart' );
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        addToCart.ecommerce.items.forEach( ( item: DigitalDataEcommerceModel.Item ) => {
            if ( item.item_name === 'bundle' && item.item_variant.includes( bundleInfo.id ) ) {
                digital_data_ecommerce.items.push( item );
            }
            if ( item.item_name.includes( bundleInfo.id ) ) {
                digital_data_ecommerce.items.push( item );
            }
        });
        if ( digital_data_ecommerce.items.length > 0 ) {
            this.updateDataLayer( digital_data_ecommerce );
        }
    }

    removePetItemFromBasket (deletedPets: ShoppingBasketPetcSegment ): void {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const itemId: string = this.DatalayerBKIService.getIdItem('all');
        const itemCategory2: string = deletedPets.origin.code + '-' + deletedPets.destination.code;
        const segments: any[] = (this.CommonsSessionStorageService.get('selectedTripSegments') as any).flat();
        const itemName: string = BookingAppConstants.ANCILLARIES_TYPES.PET.toLowerCase();

        deletedPets.pets.forEach(pet => {
            const item: DigitalDataEcommerceModel.Item = {
                item_name: itemName,
                item_id: itemId,
                price: pet.amount,
                item_brand: this.DatalayerBKIService.getBrand(segments.filter(s => s.departure.code === deletedPets.origin.code)).toLowerCase(),
                item_category: DatalayerConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.DIRECT.toLowerCase(),
                item_category2: itemCategory2,
                item_category3: this.DatalayerUtilsService.getItemCategory3(itemName, itemCategory2, itemId),
                item_variant: this.getItemVariant(pet.type.id),
                quantity: 1
            };
            digital_data_ecommerce.items.push(item);
        });
        this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, DatalayerConstants.EVENTS_ECOMMERCE.REMOVE_FROM_CART);
    }

    private getItemVariant (type: string): string {
        const itemVariants = {
            'DOG': 'perro',
            'CAT': 'gato',
            'BIRD': 'ave',
            'TURTLE': 'tortuga'
        } as const;
        return itemVariants[type];
    }

    updateDataLayer ( digitalDataEcommerce: any ): void {
        this.DigitalDataService.addDigitalDataEcommerceEvent( digitalDataEcommerce, 'remove_from_cart' );
        this.DigitalDataService.setRemoveInfoAddToCart( digitalDataEcommerce );
        const addToCart: any = this.CommonsSessionStorageService.get( 'addToCart' );
        if ( addToCart ) this.DigitalDataService.addDigitalDataEcommerceEvent( addToCart.ecommerce, 'add_payment_info' );
    }


}
