import { DatalayerConstants } from '@src/app/shared/services/ib-datalayer/constants/ib-datalayer-constants';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import isEqual from 'lodash-es/isEqual.js';
import omit from 'lodash-es/omit.js';
import { DatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service';

@Service('ib-booking-ancillaries-module',
    ['localStorageService', 'DatalayerConstants', 'CommonsUtilService', 'DigitalDataService', 'BookingAncillariesConstant', 'DatalayerUtilsService'],
    ['ib-commons-constants-module', 'ib-monetate-module'])
export class DatalayerUtils {
    seatSelectedId: string[] = [];
    segmentId: string;
    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsUtilService: CommonsUtilService,
        private DigitalDataService: DigitalDataService,
        private BookingAncillariesConstant: BookingAncillariesConstant,
        private DatalayerUtilsService: DatalayerUtilsService
    ) { }
    getAncillariesDigitalDataEcommerce = (typeAncillaries: string, event: string): void => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const ancillariesInfo: any = this.localStorageService.get('ancillariesInfo');
        const selectedTripInfo: any = this.localStorageService.get('selectedTripInfo');
        const confirmationDatalayerInfo: any = this.localStorageService.get('confirmationDatalayerInfo');
        if (ancillariesInfo) {
            let id = this.CommonsUtilService.getIdItem('all');
            ancillariesInfo?.ancillaries.forEach(anc => {
                if (typeAncillaries === 'baggages' && anc.type === 'BAGGAGE') {
                    anc.slices.forEach(slice => {
                        const itemCategory2: string = this.DatalayerUtilsService.getItemCategory2(slice);
                        slice?.passengers[0]?.pieces.forEach(piece => {
                            const item: DigitalDataEcommerceModel.Item = {
                                item_name: 'baggage',
                                item_id: id,
                                price: piece?.availablePriceRanges[0]?.amount,
                                item_brand: this.getBrandItem(slice?.id, slice?.id),
                                item_category: this.getItemCategory(),
                                item_category2: itemCategory2,
                                item_category3: this.DatalayerUtilsService.getItemCategory3('baggage', itemCategory2, id),
                                item_variant: piece?.description.replace('Kg', 'kilos').replace('kg', 'kilos').replace(' ', ''),
                                quantity: slice.passengers.length
                            };
                            digital_data_ecommerce.items.push(item);
                        });
                    });
                } else if (typeAncillaries === 'seat' && anc.type === 'SEAT') {
                    const seatMap: any = this.localStorageService.get('seatMap');
                    this.segmentId = seatMap.segmentId;
                    const itemCategory2: string = this.getTripBySeats();
                    seatMap?.seatPriceInfo?.seatPrices?.forEach(seatPrice => {
                        const item: DigitalDataEcommerceModel.Item = {
                            item_name: 'seat',
                            item_id: id,
                            price: seatPrice.amount,
                            item_brand: selectedTripInfo ? selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase() : this.getBrandItem(itemCategory2, null),
                            item_category: this.getItemCategory(),
                            item_category2: itemCategory2,
                            item_category3: this.DatalayerUtilsService.getItemCategory3('seat', itemCategory2, id),
                            item_variant: seatPrice.type.toLowerCase(),
                            quantity: anc.segments.find(segment => segment.id === this.segmentId).passengers.length
                        };
                        digital_data_ecommerce.items.push(item);
                    });
                } else if (typeAncillaries === 'insurance' && anc.type === 'INSURANCE') {
                    id = this.CommonsUtilService.getIdItem('all');
                    anc.offers.forEach(offer => {
                        const item: DigitalDataEcommerceModel.Item = {
                            item_name: 'insurance',
                            item_id: id,
                            price: offer.premium,
                            item_brand: anc?.provider.toLowerCase(),
                            item_category: this.getItemCategory(),
                            item_category2: 'all',
                            item_category3: 'all',
                            item_variant: offer?.code.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
                            quantity: confirmationDatalayerInfo?.numeroPax
                        };
                        digital_data_ecommerce.items.push(item);
                    });
                } else if (typeAncillaries === 'flexibilization' && anc.type === 'FLEXIBILITY_ON_DEMAND') {
                    id = this.CommonsUtilService.getIdItem('all');
                    anc.flexibilityAncillaries.forEach(offer => {
                        const item: DigitalDataEcommerceModel.Item = {
                            item_name: DatalayerConstants.DATALAYER_ITEM_NAMES.FLEXIBLE_TICKETS,
                            item_id: id,
                            price: offer.total,
                            item_brand: selectedTripInfo ? selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase() : this.getBrandItem(id, null),
                            item_category: this.getItemCategory(),
                            item_category2: 'all',
                            item_category3: 'all',
                            item_variant: offer.description.toLowerCase()
                        };
                        digital_data_ecommerce.items.push(item);
                    });

                } else if (typeAncillaries === 'special baggages' && anc.type === 'SPECIAL_EQUIPMENT') {
                    anc.slices.forEach(slice => {
                        const itemCategory2: string = this.DatalayerUtilsService.getItemCategory2(slice);
                        slice?.passengers[0]?.pieces.forEach(piece => {
                            let item: DigitalDataEcommerceModel.Item = {
                                item_name: 'special baggage',
                                item_id: id,
                                price: piece?.availablePriceRanges[0]?.amount,
                                item_brand: this.getBrandItem(slice?.id, slice?.id),
                                item_category: this.getItemCategory(),
                                item_category2: itemCategory2,
                                item_category3: this.DatalayerUtilsService.getItemCategory3('special baggage', itemCategory2, id),
                                item_variant: this.getSpeqsVariant(piece),
                                quantity: slice?.passengers.length
                            };
                            digital_data_ecommerce.items.push(item);
                        });
                    });
                } else if (typeAncillaries === this.BookingAncillariesConstant.DATALAYER_INFO.PRIORITY_BOARDING && anc.type === this.BookingAncillariesConstant.ANCILLARIES_TYPES.PRIORITY_BOARDING) {
                    id = this.CommonsUtilService.getIdItem('all');
                    anc.segments.forEach(segment => {
                        const itemCategory2: string = this.DatalayerUtilsService.getItemCategory2(this.CommonsUtilService.getSliceById(segment?.id));
                        const item: DigitalDataEcommerceModel.Item = {
                            item_name: this.BookingAncillariesConstant.DATALAYER_INFO.PRIORITY_BOARDING,
                            item_id: id,
                            price: segment?.passengers[0].amount,
                            item_brand: selectedTripInfo ? selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase() : this.getBrandItem(id, null),
                            item_category: this.getItemCategory(),
                            item_category2: itemCategory2,
                            item_category3: this.DatalayerUtilsService.getItemCategory3(this.BookingAncillariesConstant.DATALAYER_INFO.PRIORITY_BOARDING, itemCategory2, id),
                            item_variant: ''
                        };
                        digital_data_ecommerce.items.push(item);
                    });

                }
            });

            if(typeAncillaries === this.BookingAncillariesConstant.DATALAYER_INFO.BUNDLE) {
                ancillariesInfo.bundles.forEach((bundle: any) => {
                    const item: DigitalDataEcommerceModel.Item = {
                        item_name: this.BookingAncillariesConstant.DATALAYER_INFO.BUNDLE,
                        item_id: id,
                        price: bundle.priceItemsDiscount,
                        item_brand: selectedTripInfo ? selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase() : this.getBrandItem(id, null),
                        item_category: this.getItemCategory(),
                        item_category2: 'all',
                        item_category3: 'all',
                        item_variant: bundle.id
                    };
                    digital_data_ecommerce.items.push(item);
                });
            }
        }
        if (digital_data_ecommerce.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, event);
        }
    };

    setTransferEvent (eventType: string, transferCar: string, priceGoing: number, priceReturn: number, segments: any): void {
        const digitalDataEcommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const trip: string = this.CommonsUtilService.getIdItem();

        const itemOneWay: DigitalDataEcommerceModel.Item = {
            item_name: 'traslado',
            item_id: trip,
            price: priceGoing,
            item_brand: 'globick',
            item_category: this.getItemCategory(),
            item_category2: trip.substring(0, trip.indexOf('|')),
            item_category3: '1',
            item_variant: transferCar,
            quantity: 1
        };

        digitalDataEcommerce.items.push(itemOneWay);

        if(priceReturn) {
            const itemReturn: DigitalDataEcommerceModel.Item = {
                item_name: 'traslado',
                item_id: trip,
                price: priceReturn,
                item_brand: 'globick',
                item_category: this.getItemCategory(),
                item_category2: trip.substring(trip.indexOf('|') + 1, trip.length),
                item_category3: '2',
                item_variant: transferCar,
                quantity: 1
            };
            digitalDataEcommerce.items.push(itemReturn);
        }

        if (eventType === DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(digitalDataEcommerce, eventType);
            this.DigitalDataService.setAddInfoAddToCart(digitalDataEcommerce);
        }
    }

    setBaggagesSelectItem = (trip: any, baggageTypeSelected: any): void => {

        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const id: string = this.CommonsUtilService.getIdItem('all');
        const itemCategory2: string = trip.departure.code + '-' + trip.arrival.code;
        const item: DigitalDataEcommerceModel.Item = {
            item_name: 'baggage',
            item_id: id,
            price: this.getBaggagePrice(baggageTypeSelected),
            item_brand: this.getBrandItem(trip?.departure?.code, trip?.id),
            item_category: this.getItemCategory(),
            item_category2: itemCategory2,
            item_category3: this.DatalayerUtilsService.getItemCategory3('baggage', itemCategory2, id),
            item_variant: baggageTypeSelected.description.replace('Kg', 'kilos').replace('kg', 'kilos').replace(' ', ''),
            quantity: Number(baggageTypeSelected.quantySelected)
        };
        digital_data_ecommerce.items.push(item);
        if (digital_data_ecommerce.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, DatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM);
        }
    };

    setSelectItemAndAddToCartBundle (selectedBundle: any): void {
        const selectedTripInfo: any = this.localStorageService.get('selectedTripInfo');
        const id = this.CommonsUtilService.getIdItem('all');
        const digital_data_ecommerce_select_item: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const digital_data_ecommerce_add_to_cart: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const item: DigitalDataEcommerceModel.Item = {
            item_name: this.BookingAncillariesConstant.DATALAYER_INFO.BUNDLE,
            item_id: id,
            price: selectedBundle.priceItemsDiscount,
            item_brand: selectedTripInfo ? selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase() : this.getBrandItem(id, null),
            item_category: this.getItemCategory(),
            item_category2: 'all',
            item_category3: 'all',
            item_variant: selectedBundle.id
        };
        digital_data_ecommerce_select_item.items.push(item);
        digital_data_ecommerce_add_to_cart.items.push(item);

        selectedBundle.items.forEach((itemBundle: any) => {
            const item: DigitalDataEcommerceModel.Item = {
                item_name: selectedBundle.id + ' ' + this.getBundleItemTypeName(itemBundle.type),
                item_id: id,
                price: itemBundle.priceItemDiscount,
                item_brand: selectedTripInfo ? selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase() : this.getBrandItem(id, null),
                item_category: this.getItemCategory(),
                item_category2: '',
                item_category3: '',
                item_variant: this.getBundleItemSubtypeName(itemBundle.subtype)
            };

            digital_data_ecommerce_add_to_cart.items.push(item);
        });


        if (digital_data_ecommerce_select_item.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce_select_item, DatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM);
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce_add_to_cart, DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
            this.DigitalDataService.setAddInfoAddToCart(digital_data_ecommerce_add_to_cart);
        }
    }

    private getBundleItemTypeName (type: string): string {
        switch(type) {
                case this.BookingAncillariesConstant.TYPE_ANCILLARIE.BAGGAGE:
                    return this.BookingAncillariesConstant.DATALAYER_INFO.BAGGAGE;
                case this.BookingAncillariesConstant.TYPE_ANCILLARIE.SPEQS:
                    return this.BookingAncillariesConstant.DATALAYER_INFO.SPECIAL_EQUIPMENT;
                case this.BookingAncillariesConstant.TYPE_ANCILLARIE.FLEXIBILITY:
                    return this.BookingAncillariesConstant.DATALAYER_INFO.FLEXIBILITY_ON_DEMAND;
                case this.BookingAncillariesConstant.TYPE_ANCILLARIE.PRIORITY_BOARDING:
                    return this.BookingAncillariesConstant.DATALAYER_INFO.PRIORITY_BOARDING;
        }
    }

    private getBundleItemSubtypeName (subtype: string): string {
        switch(subtype) {
                case this.BookingAncillariesConstant.ANCILLARIES_SUBTYPES.BAGGAGE_15:
                    return this.BookingAncillariesConstant.DATALAYER_INFO.BAGGAGE + ' 15Kg';
                case this.BookingAncillariesConstant.ANCILLARIES_SUBTYPES.BAGGAGE_23:
                    return this.BookingAncillariesConstant.DATALAYER_INFO.BAGGAGE + ' 23Kg';
                case this.BookingAncillariesConstant.ANCILLARIES_SUBTYPES.BAGGAGE_32:
                    return this.BookingAncillariesConstant.DATALAYER_INFO.BAGGAGE + ' 32Kg';

                case this.BookingAncillariesConstant.ANCILLARIES_SUBTYPES.BICYCLE:
                    return this.BookingAncillariesConstant.DATALAYER_INFO.BICYCLE;
                case this.BookingAncillariesConstant.ANCILLARIES_SUBTYPES.GOLF_EQUIPMENT:
                    return this.BookingAncillariesConstant.DATALAYER_INFO.GOLF_EQUIPMENT;
                case this.BookingAncillariesConstant.ANCILLARIES_SUBTYPES.SKI_SNOW:
                    return this.BookingAncillariesConstant.DATALAYER_INFO.SKI_SNOW;

                case this.BookingAncillariesConstant.ANCILLARIES_SUBTYPES.FLEXIBILITY_PACK:
                    return this.BookingAncillariesConstant.DATALAYER_INFO.FLEXIBILITY_PACK;
                case this.BookingAncillariesConstant.ANCILLARIES_SUBTYPES.FLIGHT_CHANGE:
                    return this.BookingAncillariesConstant.DATALAYER_INFO.FLIGHT_CHANGE;
                case this.BookingAncillariesConstant.ANCILLARIES_SUBTYPES.VOUCHER_REFUND:
                    return this.BookingAncillariesConstant.DATALAYER_INFO.VOUCHER_REFUND;
                default:
                    return this.BookingAncillariesConstant.DATALAYER_INFO.PRIORITY_BOARDING;
        }
    }


    private getBaggagePrice = (piece: any): number => {
        let price = 0;
        piece.availablePriceRanges.forEach(range => {
            if (piece.quantySelected >= range.from && piece.quantySelected <= range.to) {
                price = range.amount;
            }
        });
        return price;
    };

    setBaggagesEventCart = (model: any): void => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        let itemsToAdd: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        let itemsToRemove: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const addToCart: DigitalDataEcommerceModel.ViewItemList = this.getItemAddToCartByItemName('baggage');
        model?.passengers.forEach(passenger => {
            passenger?.trips.forEach(trip => {
                const id: string = this.CommonsUtilService.getIdItem('all');
                const itemCategory2: string = trip.departure.code + '-' + trip.arrival.code;
                trip.pieces.forEach(piece => {
                    if (piece.quantySelected > 0) {
                        const item: DigitalDataEcommerceModel.Item = {
                            item_name: 'baggage',
                            item_id: id,
                            price: this.getBaggagePrice(piece),
                            item_brand: this.getBrandItem(trip?.departure?.code, trip?.id),
                            item_category: this.getItemCategory(),
                            item_category2: itemCategory2,
                            item_category3: this.DatalayerUtilsService.getItemCategory3('baggage', itemCategory2, id),
                            item_variant: piece.description.replace('Kg', 'kilos').replace('kg', 'kilos').replace(' ', ''),
                            quantity: Number(piece.quantySelected)
                        };

                        const indexAddToCart = digital_data_ecommerce.items.findIndex(itemAddToCart => isEqual(omit(item, ['quantity']), omit(itemAddToCart, ['quantity'])));
                        if (indexAddToCart < 0) {
                            digital_data_ecommerce.items.push(item);
                        } else {
                            digital_data_ecommerce.items[indexAddToCart].quantity = digital_data_ecommerce.items[indexAddToCart].quantity + item.quantity;
                        }
                    }
                });
            });
        });
        itemsToAdd = this.getItemsToAdd(addToCart, digital_data_ecommerce);
        itemsToRemove = this.gerItemsToRemove(addToCart, digital_data_ecommerce);
        if (itemsToAdd.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToAdd, DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
            this.DigitalDataService.setAddInfoAddToCart(itemsToAdd);
        }
        if (itemsToRemove.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToRemove, DatalayerConstants.EVENTS_ECOMMERCE.REMOVE_FROM_CART);
            this.DigitalDataService.setRemoveInfoAddToCart(itemsToRemove);
        }
    };

    private getItemsToAdd = (addToCart: DigitalDataEcommerceModel.ViewItemList, digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList): DigitalDataEcommerceModel.ViewItemList => {
        const itemsToAdd: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        digital_data_ecommerce.items.forEach(itemAddToCart => {
            const indexAddToCart = addToCart.items.findIndex(item => isEqual(omit(itemAddToCart, ['quantity']), omit(item, ['quantity'])));
            if (indexAddToCart < 0) {
                itemsToAdd.items.push(itemAddToCart);
            } else if (indexAddToCart >= 0 && itemAddToCart.quantity > addToCart.items[indexAddToCart].quantity) {
                const modItemAddToCart = structuredClone(itemAddToCart);
                modItemAddToCart.quantity = modItemAddToCart.quantity - addToCart.items[indexAddToCart].quantity;
                itemsToAdd.items.push(modItemAddToCart);
            }
        });
        return itemsToAdd;
    };

    private gerItemsToRemove = (addToCart: DigitalDataEcommerceModel.ViewItemList, digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList) => {
        const itemsToRemove: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        addToCart.items.forEach(itemAddToCart => {
            const indexAddToCart = digital_data_ecommerce.items.findIndex(item => isEqual(omit(itemAddToCart, ['quantity']), omit(item, ['quantity'])));
            if (indexAddToCart < 0) {
                itemsToRemove.items.push(itemAddToCart);
            } else if (indexAddToCart >= 0 && itemAddToCart.quantity > digital_data_ecommerce.items[indexAddToCart].quantity) {
                const modItemAddToCart = structuredClone(itemAddToCart);
                modItemAddToCart.quantity = modItemAddToCart.quantity - digital_data_ecommerce.items[indexAddToCart].quantity;
                itemsToRemove.items.push(modItemAddToCart);
            }
        });
        return itemsToRemove;
    };

    getItemAddToCartByItemName = (itemName: string): DigitalDataEcommerceModel.ViewItemList => {
        const viewItemList: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const addToCart: any = this.localStorageService.get('addToCart') || { ecommerce: { items: [] } };
        addToCart.ecommerce.items.forEach(itemAddToCart => {
            if (itemAddToCart.item_name === itemName) {
                viewItemList.items.push(itemAddToCart);
            }
        });
        return viewItemList;
    };

    setBaggagesRemoveFromCart = (trip: any, baggageTypeSelected: any): void => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const id: string = this.CommonsUtilService.getIdItem('all');
        const itemCategory2: string = trip.departure.code + '-' + trip.arrival.code;
        const item: DigitalDataEcommerceModel.Item = {
            item_name: 'baggage',
            item_id: id,
            price: this.getBaggagePrice(baggageTypeSelected),
            item_brand: this.getBrandItem(trip?.departure?.code, trip?.id),
            item_category: this.getItemCategory(),
            item_category2: itemCategory2,
            item_category3: this.DatalayerUtilsService.getItemCategory3('baggage', itemCategory2, id),
            item_variant: baggageTypeSelected.description.replace('Kg', 'kilos').replace('kg', 'kilos').replace(' ', ''),
            quantity: 1
        };
        digital_data_ecommerce.items.push(item);
        if (digital_data_ecommerce.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, DatalayerConstants.EVENTS_ECOMMERCE.REMOVE_FROM_CART);
        }
    };

    setSeatSelectItem = (model: any, seatSelected: any): void => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const id: string = this.CommonsUtilService.getIdItem('all');
        const itemCategory2: string = model?.seatMapInfo?.segmentInfo?.departure?.code + '-' + model?.seatMapInfo?.segmentInfo?.arrival?.code;
        const item: DigitalDataEcommerceModel.Item = {
            item_name: 'seat',
            item_id: id,
            price: seatSelected.price,
            item_brand: this.getBrandItem(model?.seatMapInfo?.segmentInfo?.departure?.code, model?.seatMapInfo?.segmentInfo?.id),
            item_category: this.getItemCategory(),
            item_category2: itemCategory2,
            item_category3: this.DatalayerUtilsService.getItemCategory3('seat', itemCategory2, id),
            item_variant: seatSelected.originalType.toLowerCase(),
            quantity: 1
        };
        digital_data_ecommerce.items.push(item);
        if (digital_data_ecommerce.items.length > 0 && !this.seatSelectedId.includes(seatSelected.id)) {
            this.seatSelectedId.push(seatSelected.id);
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, DatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM);
        }
    };

    setRemoveSeatSelectedId = (): void => {
        this.seatSelectedId = [];
    };

    setSeatAddToCart = (model: any): void => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const addToCart: DigitalDataEcommerceModel.ViewItemList = this.getItemAddToCartByItemName('seat');
        let itemsToAdd: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        let itemsToRemove: DigitalDataEcommerceModel.ViewItemList = { items: [] };

        model?.seatInfo?.segments.forEach(segment => {
            const summarySeats = this.getSummarySeats(segment);
            const id: string = this.CommonsUtilService.getIdItem('all');
            const itemCategory2: string = `${segment?.departure?.code}-${segment?.arrival?.code}`;
            const origin: string = model?.seatMapInfo?.segmentInfo?.departure?.code ? model.seatMapInfo.segmentInfo.departure.code : `${segment?.departure?.code}-${segment?.arrival?.code}`;
            const idOrigin: any = model?.seatMapInfo?.segmentInfo?.id || null;

            summarySeats.forEach(summarySeat => {
                const item: DigitalDataEcommerceModel.Item = {
                    item_name: 'seat',
                    item_id: id,
                    price: summarySeat.price,
                    item_brand: this.getBrandItem(origin, idOrigin),
                    item_category: this.getItemCategory(),
                    item_category2: itemCategory2,
                    item_category3: this.DatalayerUtilsService.getItemCategory3('seat', itemCategory2, id),
                    item_variant: summarySeat.variant ? summarySeat.variant.toLowerCase() : 'preassigned',
                    quantity: Number(summarySeat.quantity)
                };
                digital_data_ecommerce.items.push(item);
            });
        });

        itemsToAdd = this.getItemsToAdd(addToCart, digital_data_ecommerce);
        itemsToRemove = this.gerItemsToRemove(addToCart, digital_data_ecommerce);

        if (itemsToAdd.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToAdd, DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
            this.DigitalDataService.setAddInfoAddToCart(itemsToAdd);
        }
        if (itemsToRemove.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToRemove, DatalayerConstants.EVENTS_ECOMMERCE.REMOVE_FROM_CART);
            this.DigitalDataService.setRemoveInfoAddToCart(itemsToRemove);
        }
    };

    private getSummarySeats = (segment: any) => {
        const summarySeats = [];
        segment.passengers.forEach(passenger => {
            //const price = passenger.isInitialSeat ? 0 : passenger.seatPrice;
            //const seatType = passenger.isInitialSeat ? '' : this.getTypeSeat(passenger);
            const price = passenger.seatPrice;
            const seatType = this.getTypeSeat(passenger);

            if (summarySeats.length === 0) {
                summarySeats.push({ variant: seatType, price: price, quantity: 1 });
            } else {
                let findSummarySeat = false;
                summarySeats.forEach(summarySeat => {
                    if (!findSummarySeat && summarySeat.variant === seatType) {
                        summarySeat.quantity += 1;
                        findSummarySeat = true;
                    }
                });
                if (!findSummarySeat) {
                    summarySeats.push({ variant: seatType, price: price, quantity: 1 });
                }
            }
        });
        return summarySeats;
    };

    private getTypeSeat = (passenger: any): string => {
        const flowApp = this.localStorageService.get('flowApp');

        let typeSeat: string = '';

        if (passenger?.currentSeat?.originalType) {
            typeSeat = passenger.currentSeat.originalType;
        } else if (passenger?.currentSeat?.seatType) {
            typeSeat = passenger.currentSeat.seatType;
        }


        return typeSeat;
    };

    setInsuranceEcommerce = (insurance: any, event: string) => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const id = this.CommonsUtilService.getIdItem('all');
        const item_brand = insurance?.provider ? insurance.provider.toLowerCase() : 'null';
        const item: DigitalDataEcommerceModel.Item = {
            item_name: 'insurance',
            item_id: id,
            price: insurance.originalPrice,
            item_brand: item_brand,
            item_category: this.getItemCategory(),
            item_category2: 'all',
            item_category3: 'all',
            item_variant: insurance?.id.toLowerCase(),
            quantity: 1
        };
        digital_data_ecommerce.items.push(item);
        if (digital_data_ecommerce.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, event);
            if (event === DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART && !this.CommonsUtilService.checkIsAddToCart('insurance')) {
                this.DigitalDataService.setAddInfoAddToCart(digital_data_ecommerce);
            } else {
                this.DigitalDataService.setRemoveInfoAddToCart(digital_data_ecommerce);
            }
        }

    };

    setPriorityBoardingSelectItem = (tripInfo: any) => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const selectedTripInfo: any = this.localStorageService.get('selectedTripInfo');
        const id = this.CommonsUtilService.getIdItem('all');
        const itemCategory2: string = this.DatalayerUtilsService.getItemCategory2(this.CommonsUtilService.getSliceById(tripInfo?.id));
        const item: DigitalDataEcommerceModel.Item = {
            item_name: this.BookingAncillariesConstant.DATALAYER_INFO.PRIORITY_BOARDING,
            item_id: id,
            price: tripInfo.amount,
            item_brand: selectedTripInfo ? selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase() : this.getBrandItem(itemCategory2, null),
            item_category: this.getItemCategory(),
            item_category2: itemCategory2,
            item_category3: this.DatalayerUtilsService.getItemCategory3(this.BookingAncillariesConstant.DATALAYER_INFO.PRIORITY_BOARDING, itemCategory2, id),
            item_variant: '',
            quantity: tripInfo.numPassengers === 0 ? 1 : tripInfo.numPassengers
        };
        digital_data_ecommerce.items.push(item);
        if (digital_data_ecommerce.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, 'select_item');
        }
    };

    /*
     ** Set Priority Boarding AddToCart or RemoveFromCart datalayer events as appropriate
     */
    setPriorityBoardingAddToCart = (segments: any, info: any) => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const selectedTripInfo: any = this.localStorageService.get('selectedTripInfo');
        const id = this.CommonsUtilService.getIdItem('all');
        let itemsToRemove: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const addToCart: DigitalDataEcommerceModel.ViewItemList = this.getItemAddToCartByItemName(this.BookingAncillariesConstant.DATALAYER_INFO.PRIORITY_BOARDING);
        segments.forEach(segment => {
            info[0].trips.forEach(trip => {
                if (segment.id === trip.id && trip.checkedTrip) {
                    const itemCategory2: string = this.DatalayerUtilsService.getItemCategory2(this.CommonsUtilService.getSliceById(trip?.id));
                    const item: DigitalDataEcommerceModel.Item = {
                        item_name: this.BookingAncillariesConstant.DATALAYER_INFO.PRIORITY_BOARDING,
                        item_id: id,
                        price: trip.amount,
                        item_brand: selectedTripInfo ? selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase() : this.getBrandItem(itemCategory2, null),
                        item_category: this.getItemCategory(),
                        item_category2: itemCategory2,
                        item_category3: this.DatalayerUtilsService.getItemCategory3(this.BookingAncillariesConstant.DATALAYER_INFO.PRIORITY_BOARDING, itemCategory2, id),
                        item_variant: '',
                        quantity: (segment?.passengerIds?.length > 0) ? segment.passengerIds.length : 1
                    };
                    digital_data_ecommerce.items.push(item);
                }
            });
        });
        itemsToRemove = this.gerItemsToRemove(addToCart, digital_data_ecommerce);
        if (digital_data_ecommerce.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
            this.DigitalDataService.setAddInfoAddToCart(digital_data_ecommerce);
        }
        if (itemsToRemove.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToRemove, DatalayerConstants.EVENTS_ECOMMERCE.REMOVE_FROM_CART);
            this.DigitalDataService.setRemoveInfoAddToCart(itemsToRemove);
        }
    };

    private getBrandItem = (origin: string, idOrigin: any): string => {
        const isSeatMap = (origin === '' && idOrigin === null);
        let brandItem: string = '';
        const selectedTripInfo: any = this.localStorageService.get('selectedTripInfo');
        const flightsInfo: any = this.localStorageService.get('flightsInfo');
        if (selectedTripInfo) {
            if (selectedTripInfo.length > 1 && origin !== selectedTripInfo[0].origin) {
                brandItem = selectedTripInfo[1].info.segments[0].flight.operationalCarrier.name.toLowerCase();
            } else {
                brandItem = selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase();
            }
        } else if (flightsInfo) {
            if (flightsInfo.length > 1 && origin !== flightsInfo[0]?.departure?.code) {
                brandItem = flightsInfo[1].flight.operationalCarrier.name.toLowerCase();
            } else {
                brandItem = flightsInfo[0].flight.operationalCarrier.name.toLowerCase();
            }
        }

        return brandItem;
    };

    private getTripBySeats = (): string => {
        const flowApp = this.localStorageService.get('flowApp');
        const seatInfoConfirmation: any = this.localStorageService.get('seatInfoConfirmation');
        const segmentsInfo: any = this.localStorageService.get('segmentsInfo');
        let trip: string = '';
        let seatMap: any = null;
        seatMap = this.localStorageService.get('seatMap');


        if (segmentsInfo) {
            segmentsInfo.forEach(segment => {
                if (segment?.id === seatMap?.segmentId) {
                    trip = segment?.origin?.code + '-' + segment?.destination?.code;
                }
            });
        } else if (seatInfoConfirmation) {
            seatInfoConfirmation?.segments.forEach(segment => {
                if (segment?.id === seatMap?.segmentId) {
                    trip = segment?.departure?.code + '-' + segment?.arrival?.code;
                }
            });
        }

        return trip;
    };

    setFlexibilizationSelectItem = (flex: BookingAncillariesModel.AncillaryInfo): void => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const selectedTripInfo: any = this.localStorageService.get('selectedTripInfo');
        const id = this.CommonsUtilService.getIdItem('all');
        const item: DigitalDataEcommerceModel.Item = {
            item_name: DatalayerConstants.DATALAYER_ITEM_NAMES.FLEXIBLE_TICKETS,
            item_id: id,
            price: flex.total,
            item_brand: selectedTripInfo ? selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase() : '',
            item_category: this.getItemCategory(),
            item_category2: 'all',
            item_category3: 'all',
            item_variant: flex.description.toLowerCase(),
            quantity: 1
        };
        digital_data_ecommerce.items.push(item);
        if (digital_data_ecommerce.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, DatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM);
        }
    };
    setSpeqsSelectItem = (trip: any, piece: any): void => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const id: string = this.CommonsUtilService.getIdItem('all');
        const itemCategory2: string = trip.departure.code + '-' + trip.arrival.code;
        let item: DigitalDataEcommerceModel.Item = {
            item_name: 'special baggage',
            item_id: id,
            price: this.getBaggagePrice(piece),
            item_brand: this.getBrandItem(trip?.departure?.code, trip?.id),
            item_category: this.getItemCategory(),
            item_category2: itemCategory2,
            item_category3: this.DatalayerUtilsService.getItemCategory3('special baggage', itemCategory2, id),
            item_variant: this.getSpeqsVariant(piece),
            quantity: Number(piece.quantySelected)
        };

        digital_data_ecommerce.items.push(item);
        if (digital_data_ecommerce.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, DatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM);
        }
    };

    setFlexibilizationAddToCart = (selectedFlex) => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const id = this.CommonsUtilService.getIdItem('all');
        const selectedTripInfo: any = this.localStorageService.get('selectedTripInfo');
        const item: DigitalDataEcommerceModel.Item = {
            item_name: DatalayerConstants.DATALAYER_ITEM_NAMES.FLEXIBLE_TICKETS,
            item_id: id,
            price: selectedFlex.total,
            item_brand: selectedTripInfo ? selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase() : '',
            item_category: this.getItemCategory(),
            item_category2: 'all',
            item_category3: 'all',
            item_variant: selectedFlex.description.toLowerCase(),
            quantity: 1
        };
        digital_data_ecommerce.items.push(item);

        if (digital_data_ecommerce.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
            this.DigitalDataService.setAddInfoAddToCart(digital_data_ecommerce);
        }
    };

    private getSpeqsVariant = (piece: any): string => {
        switch (piece?.subtype) {
                case this.BookingAncillariesConstant.SPEQS_SUBTYPE.SKI_SNOW: return this.BookingAncillariesConstant.DATALAYER_INFO.SKI_SNOW;
                case this.BookingAncillariesConstant.SPEQS_SUBTYPE.BICYCLE: return this.BookingAncillariesConstant.DATALAYER_INFO.BICYCLE;
                case this.BookingAncillariesConstant.SPEQS_SUBTYPE.GOLF_EQUIPMENT: return this.BookingAncillariesConstant.DATALAYER_INFO.GOLF_EQUIPMENT;
                case this.BookingAncillariesConstant.SPEQS_SUBTYPE.FISHING_EQUIPMENT: return this.BookingAncillariesConstant.DATALAYER_INFO.FISHING_EQUIPMENT;
                case this.BookingAncillariesConstant.SPEQS_SUBTYPE.SCUBA_DIVING: return this.BookingAncillariesConstant.DATALAYER_INFO.SCUBA_DIVING;
                case this.BookingAncillariesConstant.SPEQS_SUBTYPE.SURFBOARD: return this.BookingAncillariesConstant.DATALAYER_INFO.SURFBOARD;
                case this.BookingAncillariesConstant.SPEQS_SUBTYPE.SPORTING_FIREARMS: return this.BookingAncillariesConstant.DATALAYER_INFO.SPORTING_FIREARMS;

                default: return '';
        }
    };

    setSpeqsEventCart = (model: any): void => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        let itemsToAdd: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        let itemsToRemove: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const addToCart: DigitalDataEcommerceModel.ViewItemList = this.getItemAddToCartByItemName('special baggage');
        const id = this.CommonsUtilService.getIdItem();
        model?.passengers.forEach(passenger => {
            passenger?.trips.forEach(trip => {
                const itemCategory2: string = trip.departure.code + '-' + trip.arrival.code;
                trip.pieces.forEach(piece => {
                    if (piece.quantySelected > 0) {
                        let item: DigitalDataEcommerceModel.Item = {
                            item_name: 'special baggage',
                            item_id: id,
                            price: this.getBaggagePrice(piece),
                            item_brand: this.getBrandItem(trip?.departure?.code, trip?.id),
                            item_category: this.getItemCategory(),
                            item_category2: itemCategory2,
                            item_category3: model.passengers[0].trips.findIndex((tripFromModel) => tripFromModel.id === trip.id) + 1,
                            item_variant: this.getSpeqsVariant(piece),
                            quantity: Number(piece.quantySelected)
                        };

                        const indexAddToCart = digital_data_ecommerce.items.findIndex(itemAddToCart => isEqual(omit(item, ['quantity']), omit(itemAddToCart, ['quantity'])));
                        if (indexAddToCart < 0) {
                            digital_data_ecommerce.items.push(JSON.parse(JSON.stringify(item)));
                        } else {
                            digital_data_ecommerce.items[indexAddToCart].quantity = digital_data_ecommerce.items[indexAddToCart].quantity + item.quantity;
                        }

                    }
                });
            });
        });
        itemsToAdd = this.getItemsToAdd(addToCart, digital_data_ecommerce);
        itemsToRemove = this.gerItemsToRemove(addToCart, digital_data_ecommerce);
        if (itemsToAdd.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToAdd, DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
            this.DigitalDataService.setAddInfoAddToCart(itemsToAdd);
        }
        if (itemsToRemove.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToRemove, DatalayerConstants.EVENTS_ECOMMERCE.REMOVE_FROM_CART);
            this.DigitalDataService.setRemoveInfoAddToCart(itemsToRemove);
        }
    };


    bobEcommerceEventSelected = (model: any) => {
        this.bobEcommerceEvent(DatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM, model);
    };

    bobEcommerceEventView = () => {
        this.bobEcommerceEvent(DatalayerConstants.EVENTS_ECOMMERCE.VIEW_ITEM_LIST);
    };

    bobEcommerceEventAddToCard = (model: any) => {
        this.bobEcommerceEvent(DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART, model);
    };

    private bobEcommerceEvent = (eventType: string, model?: any): void => {
        const segmentsSelected: any[] = this.localStorageService.get('segmentsSelected');
        const ancillariesInfo: any = this.localStorageService.get('ancillariesInfo');
        const bobInfo: any = this.localStorageService.get('bobInfo');
        const ancillariesAvailableSegments: string[] = this.localStorageService.get('ancillariesAvailableSegments');
        const digitalDataEcommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const isEventAddToCart: boolean = (eventType === DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
        let itemsToAdd: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        let itemsToRemove: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        let addToCart: DigitalDataEcommerceModel.ViewItemList = null;

        if (isEventAddToCart) {
            addToCart = this.getItemAddToCartByItemName('bob');
        }

        ancillariesAvailableSegments.forEach((strId: string) => {
            const segment = segmentsSelected.find(seg => seg.id === Number(strId));
            const airportCodeArrival: string = segment?.arrival?.airportCode ? segment.arrival.airportCode : '';
            const airportCodeDeparture: string = segment?.departure?.airportCode ? segment.departure.airportCode : '';
            const airlineName: string = segment?.airlineName ? segment.airlineName : '';

            ancillariesInfo.slices.forEach(slice => {
                if (bobInfo && slice.segmentIds.includes(segment.id.toString())) {
                    const bobSlice = bobInfo.slices.find(sliceBob => sliceBob.sliceId === slice.id);

                    if (bobSlice) {
                        const freeBagsIncluded = (Array.isArray(bobSlice.products) && bobSlice.products.length > 0 && bobSlice.products[0].freeBagsIncluded) ? bobSlice.products[0].freeBagsIncluded : 0;
                        const quantity = model?.numBagsTotal ? model.numBagsTotal : freeBagsIncluded;
                        let price = (Array.isArray(bobSlice.products) && bobSlice.products.length > 0) ? bobSlice.products[0].price : 0;
                        if (model?.priceTotal && quantity > 1) {
                            price = model.priceTotal / quantity;
                        }
                        const item: DigitalDataEcommerceModel.Item = {
                            item_name: 'bob',
                            item_id: `${airportCodeDeparture}-${airportCodeArrival}`,
                            price: price,
                            item_brand: airlineName,
                            item_category: this.getItemCategory(),
                            item_category2: 'all',
                            item_category3: 'all',
                            item_variant: '1maleta',
                            quantity: quantity
                        };

                        digitalDataEcommerce.items.push(item);
                    }
                }
            });
            if (isEventAddToCart) {
                itemsToAdd = this.getItemsToAdd(addToCart, digitalDataEcommerce);
            }
        });

        if (digitalDataEcommerce.items?.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(digitalDataEcommerce, eventType);
            //this.DigitalDataService.setAddInfoAddToCart(digitalDataEcommerce);
            if (isEventAddToCart) {
                itemsToRemove = this.gerItemsToRemove(addToCart, digitalDataEcommerce);
                if (itemsToAdd.items.length > 0) {
                    this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToAdd, DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
                    this.DigitalDataService.setAddInfoAddToCart(itemsToAdd);
                }
                if (itemsToRemove.items.length > 0) {
                    this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToRemove, DatalayerConstants.EVENTS_ECOMMERCE.REMOVE_FROM_CART);
                    this.DigitalDataService.setRemoveInfoAddToCart(itemsToRemove);
                }
            }
        }
    };

    private getItemCategory = (): string => {
        return DatalayerConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.DIRECT.toLowerCase();
    };
}
