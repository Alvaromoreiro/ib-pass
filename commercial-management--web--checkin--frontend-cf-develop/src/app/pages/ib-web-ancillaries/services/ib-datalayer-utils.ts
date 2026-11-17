import * as angular from 'angular';
import { isNgTemplate } from '@angular/compiler';
import { DatalayerConstantsType } from 'ib-web-commons/dist/app/core/ib-datalayer/ib-datalayer-constants';
import { DigitalDataService } from 'ib-web-commons/dist/app/core/ib-datalayer/services/ib-digital-data-service';
import isEqual from 'lodash-es/isEqual.js';
import omit from 'lodash-es/omit.js';
import { CkiDatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service';
import { IbInsuranceAllianzDatalayerUtilsService } from 'ib-web-ancillaries/dist/app/shared/ib-insurance-allianz-datalayer-utils.service';

@Service('ib-checkin-ancillaries-module',
    ['localStorageService', 'DatalayerConstants', 'CommonsUtilService', 'DigitalDataService', 'CheckinAncillariesConstants', 'CkiDatalayerUtilsService', 'IbInsuranceAllianzDatalayerUtilsService', '$rootScope', '$window', '$timeout'],
    ['ib-commons-constants-module', 'ib-monetate-module', 'IbInsuranceAllianzDatalayerUtilsService'])
export class DatalayerUtils {
    seatSelectedId: string[] = [];
    private _viewPollToken = 0;
    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private DatalayerConstants: DatalayerConstantsType,
        private CommonsUtilService: CommonsUtilService,
        private DigitalDataService: DigitalDataService,
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private CkiDatalayerUtilsService: CkiDatalayerUtilsService,
        private IbInsuranceAllianzDatalayerUtilsService: IbInsuranceAllianzDatalayerUtilsService,
        private $rootScope: CommonsRootScope,
        private $window: ng.IWindowService,
        private $timeout: ng.ITimeoutService
    ) { }

    private deferViewEventUntilDigitalDataChanges (): void {
        const window: any = this.$window as any;
        const token = ++this._viewPollToken;
        const before = this.safeStableStringify(window?.digital_data);
        const maxTries = 40;
        const delayMs = 50;
        const fire = () => {
            if (token !== this._viewPollToken) return;
            this.CkiDatalayerUtilsService.updateDatalayerViewEvent();
        };
        const tick = (tryNo: number) => {
            if (token !== this._viewPollToken) return;
            const after = this.safeStableStringify(window?.digital_data);
            const changed = after !== before;
            if (changed || tryNo >= maxTries) {
                fire();
                return;
            }
            this.$timeout(() => tick(tryNo + 1), delayMs, false);
        };
        this.$timeout(() => tick(0), 0, false);
    }

    private safeStableStringify (obj: any): string {
        try {
            return JSON.stringify(obj ?? {});
        } catch {
            return `__unstringifiable__`;
        }
    }
    getAncillariesDigitalDataEcommerce = (typeAncillaries: string, event: string): void => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const ancillariesInfo: any = this.localStorageService.get('ancillariesInfo');
        const selectedTripInfo: any = this.localStorageService.get('selectedTripInfo');
        const confirmationDatalayerInfo: any = this.localStorageService.get('confirmationDatalayerInfo');

        if (ancillariesInfo) {
            let id = this.CommonsUtilService.getIdItem('all');
            ancillariesInfo?.ancillaries.forEach(anc => {
                if (this.CheckinAncillariesConstants.ANCILLARIES_NAME.BAGGAGES === typeAncillaries
                    && this.CheckinAncillariesConstants.TYPE_ANCILLARIE.BAGGAGE === anc.type) {
                    anc.slices.forEach(slice => {
                        const itemCategory2: string = this.CkiDatalayerUtilsService.getItemCategory2(slice);
                        slice?.passengers[0]?.pieces.forEach(piece => {
                            const item: DigitalDataEcommerceModel.Item = {
                                item_name: 'baggage',
                                item_id: id,
                                price: piece?.availablePriceRanges[0]?.amount,
                                item_brand: this.getBrandItem(slice?.id, slice?.id),
                                item_category: this.getItemCategory(),
                                item_category2: itemCategory2,
                                item_category3: this.CkiDatalayerUtilsService.getItemCategory3('baggage', itemCategory2, id),
                                item_variant: piece?.description.replace('Kg', 'kilos').replace('kg', 'kilos').replace(' ', '')
                            };
                            digital_data_ecommerce.items.push(item);
                        });
                    });
                } else if (this.CheckinAncillariesConstants.ANCILLARIES_NAME.SEAT === typeAncillaries
                    && this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SEAT === anc.type) {
                    const seatMap: any = this.localStorageService.get('seatMap');
                    const itemCategory2: string = this.getTripBySeats();
                    seatMap?.seatPriceInfo?.seatPrices?.forEach(seatPrice => {
                        const item: DigitalDataEcommerceModel.Item = {
                            item_name: 'seat',
                            item_id: id,
                            price: seatPrice.amount,
                            item_brand: selectedTripInfo ? selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase() : this.getBrandItem(itemCategory2, null),
                            item_category: this.getItemCategory(),
                            item_category2: itemCategory2,
                            item_category3: this.CkiDatalayerUtilsService.getItemCategory3('seat', itemCategory2, id),
                            item_variant: seatPrice.type.toLowerCase()
                        };
                        digital_data_ecommerce.items.push(item);
                    });
                } else if (this.CheckinAncillariesConstants.ANCILLARIES_NAME.INSURANCE === typeAncillaries
                    && this.CheckinAncillariesConstants.TYPE_ANCILLARIE.INSURANCE === anc.type) {
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
                } else if (this.CheckinAncillariesConstants.ANCILLARIES_NAME.INSURANCE === typeAncillaries
                    && this.CheckinAncillariesConstants.TYPE_ANCILLARIE.INSURANCE_ALLIANZ === anc.type) {
                    id = this.CommonsUtilService.getIdItem('all');
                    anc.products.forEach(product => {
                        const item: DigitalDataEcommerceModel.Item = this.IbInsuranceAllianzDatalayerUtilsService.setInsuranceEcommerceViewItem('insurance', product);
                        digital_data_ecommerce.items.push(item);
                    });
                } else if (this.CheckinAncillariesConstants.ANCILLARIES_NAME.FLEXIBILIZATION === typeAncillaries
                    && this.CheckinAncillariesConstants.TYPE_ANCILLARIE.FLEXIBILITY === anc.type) {
                    id = this.CommonsUtilService.getIdItem('all');
                    anc.flexibilityAncillaries.forEach(offer => {
                        const item: DigitalDataEcommerceModel.Item = {
                            item_name: 'flexible_ticket',
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

                } else if (this.CheckinAncillariesConstants.ANCILLARIES_NAME.SPECIAL_BAGGAGES === typeAncillaries
                    && this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SPEQS === anc.type) {
                    anc.slices.forEach(slice => {
                        const itemCategory2: string = this.CkiDatalayerUtilsService.getItemCategory2(slice);
                        slice?.passengers[0]?.pieces.forEach(piece => {
                            let item: DigitalDataEcommerceModel.Item = {
                                item_name: 'special baggage',
                                item_id: id,
                                price: piece?.availablePriceRanges[0]?.amount,
                                item_brand: this.getBrandItem(slice?.id, slice?.id),
                                item_category: this.getItemCategory(),
                                item_category2: itemCategory2,
                                item_category3: this.CkiDatalayerUtilsService.getItemCategory3('special baggage', itemCategory2, id),
                                item_variant: this.getSpeqsVariant(piece),
                                quantity: slice?.passengers.length
                            };
                            item = this.ecommerceFlowCKI(item, slice);
                            digital_data_ecommerce.items.push(item);
                        });
                    });
                } else if (typeAncillaries === this.CheckinAncillariesConstants.DATALAYER_INFO.PRIORITY_BOARDING
                    && anc.type === this.CheckinAncillariesConstants.ANCILLARIES_TYPES.PRIORITY_BOARDING) {
                    id = this.CommonsUtilService.getIdItem('all');
                    anc.segments.forEach(segment => {
                        const itemCategory2: string = this.CkiDatalayerUtilsService.getItemCategory2(this.CommonsUtilService.getSliceById(segment?.id));
                        const item: DigitalDataEcommerceModel.Item = {
                            item_name: this.CheckinAncillariesConstants.DATALAYER_INFO.PRIORITY_BOARDING,
                            item_id: id,
                            price: segment?.passengers[0].amount,
                            item_brand: selectedTripInfo ? selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase() : this.getBrandItem(id, null),
                            item_category: this.getItemCategory(),
                            item_category2: itemCategory2,
                            item_category3: this.CkiDatalayerUtilsService.getItemCategory3(this.CheckinAncillariesConstants.DATALAYER_INFO.PRIORITY_BOARDING, itemCategory2, id),
                            item_variant: ''
                        };
                        digital_data_ecommerce.items.push(item);
                    });

                }
            });

            if (typeAncillaries === this.CheckinAncillariesConstants.DATALAYER_INFO.BUNDLE) {
                ancillariesInfo.bundles.forEach((bundle: any) => {
                    const item: DigitalDataEcommerceModel.Item = {
                        item_name: this.CheckinAncillariesConstants.DATALAYER_INFO.BUNDLE,
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
            item_category3: this.CkiDatalayerUtilsService.getItemCategory3('baggage', itemCategory2, id),
            item_variant: baggageTypeSelected.description.replace('Kg', 'kilos').replace('kg', 'kilos').replace(' ', ''),
            quantity: Number(baggageTypeSelected.quantySelected)
        };
        digital_data_ecommerce.items.push(item);
        if (digital_data_ecommerce.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, this.DatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM);
        }
    };

    setSelectItemAndAddToCartBundle (selectedBundle: any): void {
        const selectedTripInfo: any = this.localStorageService.get('selectedTripInfo');
        const id = this.CommonsUtilService.getIdItem('all');
        const digital_data_ecommerce_select_item: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const digital_data_ecommerce_add_to_cart: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const item: DigitalDataEcommerceModel.Item = {
            item_name: this.CheckinAncillariesConstants.DATALAYER_INFO.BUNDLE,
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
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce_select_item, this.DatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM);
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce_add_to_cart, this.DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
            this.DigitalDataService.setAddInfoAddToCart(digital_data_ecommerce_add_to_cart);
        }
    }

    private getBundleItemTypeName (type: string): string {
        switch (type) {
                case this.CheckinAncillariesConstants.TYPE_ANCILLARIE.BAGGAGE:
                    return this.CheckinAncillariesConstants.DATALAYER_INFO.BAGGAGE;
                case this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SPEQS:
                    return this.CheckinAncillariesConstants.DATALAYER_INFO.SPECIAL_EQUIPMENT;
                case this.CheckinAncillariesConstants.TYPE_ANCILLARIE.FLEXIBILITY:
                    return this.CheckinAncillariesConstants.DATALAYER_INFO.FLEXIBILITY_ON_DEMAND;
                case this.CheckinAncillariesConstants.TYPE_ANCILLARIE.PRIORITY_BOARDING:
                    return this.CheckinAncillariesConstants.DATALAYER_INFO.PRIORITY_BOARDING;
        }
    }

    private getBundleItemSubtypeName (subtype: string): string {
        switch (subtype) {
                case this.CheckinAncillariesConstants.ANCILLARIES_SUBTYPES.BAGGAGE_15:
                    return this.CheckinAncillariesConstants.DATALAYER_INFO.BAGGAGE + ' 15Kg';
                case this.CheckinAncillariesConstants.ANCILLARIES_SUBTYPES.BAGGAGE_23:
                    return this.CheckinAncillariesConstants.DATALAYER_INFO.BAGGAGE + ' 23Kg';
                case this.CheckinAncillariesConstants.ANCILLARIES_SUBTYPES.BAGGAGE_32:
                    return this.CheckinAncillariesConstants.DATALAYER_INFO.BAGGAGE + ' 32Kg';

                case this.CheckinAncillariesConstants.ANCILLARIES_SUBTYPES.BICYCLE:
                    return this.CheckinAncillariesConstants.DATALAYER_INFO.BICYCLE;
                case this.CheckinAncillariesConstants.ANCILLARIES_SUBTYPES.GOLF_EQUIPMENT:
                    return this.CheckinAncillariesConstants.DATALAYER_INFO.GOLF_EQUIPMENT;
                case this.CheckinAncillariesConstants.ANCILLARIES_SUBTYPES.SKI_SNOW:
                    return this.CheckinAncillariesConstants.DATALAYER_INFO.SKI_SNOW;

                case this.CheckinAncillariesConstants.ANCILLARIES_SUBTYPES.FLEXIBILITY_PACK:
                    return this.CheckinAncillariesConstants.DATALAYER_INFO.FLEXIBILITY_PACK;
                case this.CheckinAncillariesConstants.ANCILLARIES_SUBTYPES.FLIGHT_CHANGE:
                    return this.CheckinAncillariesConstants.DATALAYER_INFO.FLIGHT_CHANGE;
                case this.CheckinAncillariesConstants.ANCILLARIES_SUBTYPES.VOUCHER_REFUND:
                    return this.CheckinAncillariesConstants.DATALAYER_INFO.VOUCHER_REFUND;
                default:
                    return this.CheckinAncillariesConstants.DATALAYER_INFO.PRIORITY_BOARDING;
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
                            item_category3: this.CkiDatalayerUtilsService.getItemCategory3('baggage', itemCategory2, id),
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
            this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToAdd, this.DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
            this.DigitalDataService.setAddInfoAddToCart(itemsToAdd);
        }
        if (itemsToRemove.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToRemove, this.DatalayerConstants.EVENTS_ECOMMERCE.REMOVE_FROM_CART);
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
            item_category3: this.CkiDatalayerUtilsService.getItemCategory3('baggage', itemCategory2, id),
            item_variant: baggageTypeSelected.description.replace('Kg', 'kilos').replace('kg', 'kilos').replace(' ', ''),
            quantity: 1
        };
        digital_data_ecommerce.items.push(item);
        if (digital_data_ecommerce.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, this.DatalayerConstants.EVENTS_ECOMMERCE.REMOVE_FROM_CART);
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
            item_category3: this.CkiDatalayerUtilsService.getItemCategory3('seat', itemCategory2, id),
            item_variant: seatSelected.originalType.toLowerCase(),
            quantity: 1
        };
        digital_data_ecommerce.items.push(item);
        if (digital_data_ecommerce.items.length > 0 && !this.seatSelectedId.includes(seatSelected.id)) {
            this.seatSelectedId.push(seatSelected.id);
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, this.DatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM);
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
                    item_category3: this.CkiDatalayerUtilsService.getItemCategory3('seat', itemCategory2, id),
                    item_variant: summarySeat.variant ? summarySeat.variant.toLowerCase() : 'preassigned',
                    quantity: Number(summarySeat.quantity)
                };
                digital_data_ecommerce.items.push(item);
            });
        });

        itemsToAdd = this.getItemsToAdd(addToCart, digital_data_ecommerce);
        itemsToRemove = this.gerItemsToRemove(addToCart, digital_data_ecommerce);

        if (itemsToAdd.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToAdd, this.DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
            this.DigitalDataService.setAddInfoAddToCart(itemsToAdd);
        }
        if (itemsToRemove.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToRemove, this.DatalayerConstants.EVENTS_ECOMMERCE.REMOVE_FROM_CART);
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
        //const isCheckinFlow = flowApp === this.CheckinAncillariesConstants.APPLICATION_FLOW.CHECKIN;
        let typeSeat: string = '';

        if (passenger?.currentSeat?.originalType) {
            typeSeat = passenger.currentSeat.originalType;
        } else if (passenger?.currentSeat?.seatType) {
            typeSeat = passenger.currentSeat.seatType;
        }

        // if (isCheckinFlow && typeSeat.trim() === '') {
        //     typeSeat = 'standard';
        // }

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
            if (event === this.DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART && !this.CommonsUtilService.checkIsAddToCart('insurance')) {
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
        const itemCategory2: string = this.CkiDatalayerUtilsService.getItemCategory2(this.CommonsUtilService.getSliceById(tripInfo?.id));
        const item: DigitalDataEcommerceModel.Item = {
            item_name: this.CheckinAncillariesConstants.DATALAYER_INFO.PRIORITY_BOARDING,
            item_id: id,
            price: tripInfo.amount,
            item_brand: selectedTripInfo ? selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase() : this.getBrandItem(itemCategory2, null),
            item_category: this.getItemCategory(),
            item_category2: itemCategory2,
            item_category3: this.CkiDatalayerUtilsService.getItemCategory3(this.CheckinAncillariesConstants.DATALAYER_INFO.PRIORITY_BOARDING, itemCategory2, id),
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
        const addToCart: DigitalDataEcommerceModel.ViewItemList = this.getItemAddToCartByItemName(this.CheckinAncillariesConstants.DATALAYER_INFO.PRIORITY_BOARDING);
        segments.forEach(segment => {
            info[0].trips.forEach(trip => {
                if (segment.id === trip.id && trip.checkedTrip) {
                    const itemCategory2: string = this.CkiDatalayerUtilsService.getItemCategory2(this.CommonsUtilService.getSliceById(trip?.id));
                    const item: DigitalDataEcommerceModel.Item = {
                        item_name: this.CheckinAncillariesConstants.DATALAYER_INFO.PRIORITY_BOARDING,
                        item_id: id,
                        price: trip.amount,
                        item_brand: selectedTripInfo ? selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase() : this.getBrandItem(itemCategory2, null),
                        item_category: this.getItemCategory(),
                        item_category2: itemCategory2,
                        item_category3: this.CkiDatalayerUtilsService.getItemCategory3(this.CheckinAncillariesConstants.DATALAYER_INFO.PRIORITY_BOARDING, itemCategory2, id),
                        item_variant: '',
                        quantity: (segment?.passengerIds?.length > 0) ? segment.passengerIds.length : 1
                    };
                    digital_data_ecommerce.items.push(item);
                }
            });
        });
        itemsToRemove = this.gerItemsToRemove(addToCart, digital_data_ecommerce);
        if (digital_data_ecommerce.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, this.DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
            this.DigitalDataService.setAddInfoAddToCart(digital_data_ecommerce);
        }
        if (itemsToRemove.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToRemove, this.DatalayerConstants.EVENTS_ECOMMERCE.REMOVE_FROM_CART);
            this.DigitalDataService.setRemoveInfoAddToCart(itemsToRemove);
        }
    };

    private getBrandItem = (origin: string, idOrigin: any): string => {
        const flowApp = this.localStorageService.get('flowApp');
        const isSeatMap = (origin === '' && idOrigin === null);
        let brandItem: string = '';
        switch (flowApp) {
                case this.CheckinAncillariesConstants.APPLICATION_FLOW.CHECKIN:
                    const segmentsSelected: any = this.localStorageService.get('segmentsSelected');
                    let idSeg = '';
                    if (!isSeatMap) {
                        const splitId: string[] = idOrigin?.toString().split('_') || [];
                        const isSliceId: boolean = (splitId.length > 0 && splitId.length === 2);
                        const ancillariesInfo: any = this.localStorageService.get('ancillariesInfo');
                        if (segmentsSelected.length > 0) {
                            if (isSliceId && ancillariesInfo?.slices?.length > 0) {
                                ancillariesInfo.slices.forEach(slice => {
                                    if (idOrigin === slice?.id && slice?.segmentIds?.length > 0) {
                                        idSeg = slice.segmentIds[0];
                                    }
                                });
                            } else {
                                idSeg = idOrigin;
                            }
                        }
                    } else {
                        const seatMap: any = this.localStorageService.get('seatMapSegment');
                        idSeg = seatMap?.segmentId?.toString();
                    }

                    for (let i = 0; i < segmentsSelected.length; i++) {
                        const segSelected = segmentsSelected[i];
                        const originSelected: string = `${segSelected?.departure?.airportCode}-${segSelected?.arrival?.airportCode}`;
                        if (+segSelected?.id === +idSeg || origin === originSelected) {
                            brandItem = segSelected.airlineName;
                        }
                    }
                    break;

                default:
                // BKI MMB
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
                    break;
        }

        return brandItem;
    };

    private getTripBySeats = (): string => {
        const flowApp = this.localStorageService.get('flowApp');
        const seatInfoConfirmation: any = this.localStorageService.get('seatInfoConfirmation');
        const segmentsInfo: any = this.localStorageService.get('segmentsInfo');
        let trip: string = '';
        let seatMap: any = null;

        if (flowApp === this.CheckinAncillariesConstants.APPLICATION_FLOW.CHECKIN) {
            seatMap = this.localStorageService.get('seatMapSegment');
        } else {
            seatMap = this.localStorageService.get('seatMap');
        }

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

    setFlexibilizationSelectItem = (flex: CheckinAncillariesModel.AncillaryInfo): void => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const selectedTripInfo: any = this.localStorageService.get('selectedTripInfo');
        const id = this.CommonsUtilService.getIdItem('all');
        const item: DigitalDataEcommerceModel.Item = {
            item_name: 'flexibilization',
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
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, this.DatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM);
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
            item_category3: this.CkiDatalayerUtilsService.getItemCategory3('special baggage', itemCategory2, id),
            item_variant: this.getSpeqsVariant(piece),
            quantity: Number(piece.quantySelected)
        };
        item = this.ecommerceFlowCKI(item, trip.id, piece);
        digital_data_ecommerce.items.push(item);
        if (digital_data_ecommerce.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, this.DatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM);
        }
    };

    setFlexibilizationAddToCart = (selectedFlex) => {
        const digital_data_ecommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const id = this.CommonsUtilService.getIdItem('all');
        const selectedTripInfo: any = this.localStorageService.get('selectedTripInfo');
        const item: DigitalDataEcommerceModel.Item = {
            item_name: 'flexibilization',
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
            this.DigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, this.DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
            this.DigitalDataService.setAddInfoAddToCart(digital_data_ecommerce);
        }
    };

    private getSpeqsVariant = (piece: any): string => {
        switch (piece?.subtype) {
                case this.CheckinAncillariesConstants.SPEQS_SUBTYPE.SKI_SNOW: return this.CheckinAncillariesConstants.DATALAYER_INFO.SKI_SNOW;
                case this.CheckinAncillariesConstants.SPEQS_SUBTYPE.BICYCLE: return this.CheckinAncillariesConstants.DATALAYER_INFO.BICYCLE;
                case this.CheckinAncillariesConstants.SPEQS_SUBTYPE.GOLF_EQUIPMENT: return this.CheckinAncillariesConstants.DATALAYER_INFO.GOLF_EQUIPMENT;
                case this.CheckinAncillariesConstants.SPEQS_SUBTYPE.FISHING_EQUIPMENT: return this.CheckinAncillariesConstants.DATALAYER_INFO.FISHING_EQUIPMENT;
                case this.CheckinAncillariesConstants.SPEQS_SUBTYPE.SCUBA_DIVING: return this.CheckinAncillariesConstants.DATALAYER_INFO.SCUBA_DIVING;
                case this.CheckinAncillariesConstants.SPEQS_SUBTYPE.SURFBOARD: return this.CheckinAncillariesConstants.DATALAYER_INFO.SURFBOARD;
                case this.CheckinAncillariesConstants.SPEQS_SUBTYPE.SPORTING_FIREARMS: return this.CheckinAncillariesConstants.DATALAYER_INFO.SPORTING_FIREARMS;
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
                            item_category3: this.CkiDatalayerUtilsService.getItemCategory3('special baggage', itemCategory2, id),
                            item_variant: this.getSpeqsVariant(piece),
                            quantity: Number(piece.quantySelected)
                        };
                        item = this.ecommerceFlowCKI(item, trip);
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
            this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToAdd, this.DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
            this.DigitalDataService.setAddInfoAddToCart(itemsToAdd);
        }
        if (itemsToRemove.items.length > 0) {
            this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToRemove, this.DatalayerConstants.EVENTS_ECOMMERCE.REMOVE_FROM_CART);
            this.DigitalDataService.setRemoveInfoAddToCart(itemsToRemove);
        }
    };

    private ecommerceFlowCKI = (item: DigitalDataEcommerceModel.Item, idModel: string, piece?: any): DigitalDataEcommerceModel.Item => {
        const flowApp = this.localStorageService.get('flowApp');
        if (flowApp === this.CheckinAncillariesConstants.APPLICATION_FLOW.CHECKIN) {
            const segmentsSelected: any = this.localStorageService.get('segmentsSelected');
            const ancillariesSlices: any = this.localStorageService.get('ancillariesSlices');
            let objSegmentIds: any = null;
            let airlineName: string = 'Iberia';
            let positionSlice: string = '';
            ancillariesSlices.forEach((elem, i) => {
                if (elem.id === idModel) {
                    positionSlice = (i + 1).toString();
                    objSegmentIds = elem;
                }
            });

            segmentsSelected.forEach((seg, i) => {
                if (objSegmentIds && seg.id === Number(objSegmentIds.segmentIds[0])) {
                    if (seg.airlineName?.length > 0) {
                        airlineName = seg.airlineName;
                    } else if (seg.flightCode?.length > 0) {
                        airlineName = seg.flightCode;
                    }

                    if (seg.departure?.airportCode && seg.arrival?.airportCode) {
                        item.item_category2 = `${seg.departure.airportCode}-${seg.arrival.airportCode}`;
                        item.item_category3 = positionSlice;
                    }
                }
            });

            if (item.item_category3 === 'all') {
                const arrId = item.item_id.split('|');
                arrId.forEach((element, i) => {
                    if (item.item_category2 === element) {
                        item.item_category3 = (i + 1).toString();
                    }
                });
            }

            if (piece?.availablePriceRanges[0]?.amount) {
                item.price = piece.availablePriceRanges[0].amount;
            }

            item.item_category = 'checkin';
            item.quantity = (item?.quantity && item.quantity > 0) ? item.quantity : 1;
            item.item_brand = airlineName;
        }

        return item;
    };

    bobEcommerceEventSelected = (model: any) => {
        this.bobEcommerceEvent(this.DatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM, model);
    };

    bobEcommerceEventView = () => {
        this.bobEcommerceEvent(this.DatalayerConstants.EVENTS_ECOMMERCE.VIEW_ITEM_LIST);
    };

    bobEcommerceEventAddToCard = (model: any) => {
        this.bobEcommerceEvent(this.DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART, model);
    };

    private bobEcommerceEvent = (eventType: string, model?: any): void => {
        const segmentsSelected: any[] = this.localStorageService.get('segmentsSelected');
        const ancillariesInfo: any = this.localStorageService.get('ancillariesInfo');
        const bobInfo: any = this.localStorageService.get('bobInfo');
        const ancillariesAvailableSegments: string[] = this.localStorageService.get('ancillariesAvailableSegments');
        const digitalDataEcommerce: DigitalDataEcommerceModel.ViewItemList = { items: [] };
        const isEventAddToCart: boolean = (eventType === this.DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
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
                    this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToAdd, this.DatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
                    this.DigitalDataService.setAddInfoAddToCart(itemsToAdd);
                }
                if (itemsToRemove.items.length > 0) {
                    this.DigitalDataService.addDigitalDataEcommerceEvent(itemsToRemove, this.DatalayerConstants.EVENTS_ECOMMERCE.REMOVE_FROM_CART);
                    this.DigitalDataService.setRemoveInfoAddToCart(itemsToRemove);
                }
            }
        }
    };

    private getItemCategory = (): string => {
        const flowApp = this.localStorageService.get('flowApp');
        switch (flowApp) {
                case this.CheckinAncillariesConstants.APPLICATION_FLOW.MMB: return 'mmb';
                case this.CheckinAncillariesConstants.APPLICATION_FLOW.CHECKIN: return 'checkin';
                default: return this.DatalayerConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.DIRECT.toLowerCase();
        }
    };

    updateDataLayerAndDigitalData = (ancillaryQuadrigam, backToAnc = false, accepted = false): void => {
        const ancillariesActionName = this.CheckinAncillariesConstants.DATALAYER_ANC_EVENTS[ancillaryQuadrigam];
        const userLogged = this.localStorageService.get('userLogged');
        const quadrigam = backToAnc ? this.CheckinAncillariesConstants.QUADRIGAM.ANCILLARIES : ancillaryQuadrigam;

        if (!backToAnc) {
            this.CkiDatalayerUtilsService.updateDatalayerAndDontSend(
                this.CheckinAncillariesConstants.DATALAYER_ANC_EVENTS.ON_OPEN + ancillariesActionName,
                this.CheckinAncillariesConstants.DATALAYER_ANC_EVENTS.CLICK,
                this.CheckinAncillariesConstants.DATALAYER_ANC_EVENTS.ON_ACTION_OPEN
            );
        } else if (accepted) {
            this.CkiDatalayerUtilsService.updateDatalayerAndDontSend(
                this.CheckinAncillariesConstants.DATALAYER_ANC_EVENTS.ON_CLOSE + ancillariesActionName,
                this.CheckinAncillariesConstants.DATALAYER_ANC_EVENTS.CLICK,
                this.CheckinAncillariesConstants.DATALAYER_ANC_EVENTS.ON_ACTION_CLOSE
            );
        }

        /* INIT DELETE GA4 MIGRATION */
        this.CkiDatalayerUtilsService.updateDatalayerWithQuadrigam(quadrigam, null, userLogged);
        this.CkiDatalayerUtilsService.sendDatalayerEvent(this.DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        /* FINISH DELETE GA4 MIGRATION*/
        this.CkiDatalayerUtilsService.updateDigitalDataWithQuadrigam(quadrigam, null, userLogged);
        this.CkiDatalayerUtilsService.setProcessAndStep(this.DatalayerConstants.DATALAYER_ANCILLARIES.ANCILLARIES, null, quadrigam);

        if (backToAnc) {
            this.CkiDatalayerUtilsService.addDigitalDataInfo({ Step: this.DatalayerConstants.DATALAYER_ANCILLARIES.ANCILLARIES });
        } else {
            this.getAncillariesDigitalDataEcommerce(ancillariesActionName, 'view_item_list');
        }
        this.deferViewEventUntilDigitalDataChanges();
        this.$rootScope.$broadcast('updateDatalayer');
        this.$rootScope.$broadcast('updateDigitalData');
        this.$rootScope.$broadcast('sendUpdateToMonetate');
    };

}