import * as angular from 'angular';
import { MMBDatalayerConstants } from '../constants/ib-MmB-datalayer-constants';
import { MmBDigitalDataService } from './ib-MmB-digital-data-service';

@Service('ib-MmB-services-module', ['$window', 'localStorageService', 'MmBDigitalDataService', 'DatalayerUtilsService', 'CommonsSessionStorageService', 'MmBAppConstants'], ['ib-monetate-module'])
export class MmBDataLayerService {
    public datalayer_general : object;
    public datalayer_ecommerce: object;
    constructor (private $window : ng.IWindowService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private MmBDigitalDataService: MmBDigitalDataService,
        private DatalayerUtilsService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private MmBAppConstants: MmBAppConstants
    ) {}

    /**
     * Initializes the datalayer_general and datalayer_ecommerce objects associating it to page window object.
     * @param {Object} initialGeneralObject the initial object of datalayer_general. if no object received, datalayer_general will be initialized with empty object
     * @param {Object} initialEcommerceObject the initial object of datalayer_ecommerce. if no object received, datalayer_ecommerce will be initialized with empty object
     */
    initDatalayer = (initialGeneralObject: object, initialEcommerceObject : object) :void=> {
        initialGeneralObject = initialGeneralObject || {};
        initialEcommerceObject = initialEcommerceObject || {};
        this.datalayer_general = this.$window.datalayer_general = this.$window?.navigation?.currentEntry?.url?.indexOf('chktrp') || this.$window?.navigation?.currentEntry?.url?.indexOf('mytrips') ? initialGeneralObject :
            this.$window.datalayer_general || this.localStorageService.get('confirmationDatalayerInfo') || {};
        this.datalayer_ecommerce = this.$window.datalayer_ecommerce = this.$window.datalayer_ecommerce || {};
        angular.extend(this.datalayer_general, initialGeneralObject);
        angular.extend(this.datalayer_ecommerce, initialEcommerceObject);
    };

    /**
     * Returns if datalayer has been initialized
     */
    isDatalayerInit = ():boolean => {
        return angular.isObject(this.datalayer_general) && angular.isObject(this.datalayer_ecommerce);
    };

    /**
     * Extends the current datalayer general information with the extendObj object. If an attribute exists in the current
     * datalayer_general object, changes its value.
     * @param {Object} extendObj the object to extend the current datalayer_general object
     */
    addDataLayerGeneralInfo = (extendObj: object):void => {
        extendObj = extendObj || {};
        this.localStorageService.set('confirmationDatalayerInfo', angular.extend(this.datalayer_general, extendObj));
    };

    /**
     * Extends the current datalayer ecommerce information with the extendObj object. If an attribute exists in the current
     * datalayer_ecommerce object, changes its value.
     * @param {Object} extendObj the object to extend the current datalayer_ecommerce object
     */
    addDataLayerEcommerceInfo = (extendObj:object) :void => {
        extendObj = extendObj || {};
        angular.extend(this.datalayer_ecommerce, extendObj);
    };

    /**
     * removes a set of attributes from datalayer_general object. If the input parameter is not an array, no modification will be done
     * @param {Array<String>} attributesArray an array with the String name of the attributes to be removed from datalager_general
     */
    removeDatalayerGeneralInfo = (attributesArray: object) :void=> {
        let i: number = 0;
        if (angular.isArray(attributesArray)) {
            for (i = 0; i < attributesArray.length; i++) {
                if (angular.isString(attributesArray[i]) && this.datalayer_general[attributesArray[i]]) {
                    delete this.datalayer_general[attributesArray[i]];
                }
            }
        }
    };
    /**
     * Removes all datalayer objects info by initializing it to empty object
     */
    removeAllDatalayerInfo = ():void => {
        this.datalayer_general = this.$window.datalayer_general = {};
        this.datalayer_ecommerce = this.$window.datalayer_ecommerce = {};
    };

    /**
     * Sends to Google Tag Manager an event with the current datalayer_general and datalayer_ecommerce info
     * @param {String} type the event type for Google Tag Manager (Ej: 'view', 'link')
     */
    callUpdateTagManager = (type : string) => {
        if (this.$window.DigitalChange) {
            if (Object.keys(this.datalayer_ecommerce).length > 0) {
                this.localStorageService.set('sendDatalayerEcommerce', false);
            } else {
                this.localStorageService.set('sendDatalayerEcommerce', true);
            }
            this.$window.DigitalChange(type, this.datalayer_general, this.datalayer_ecommerce);
        }
    };

    /**
     * returns the current datalayer general
     */
    getDatalayerGeneral = ():object => {
        return this.datalayer_general;
    };

    /**
     * returns the current ecommerce datalayer
     */
    getEcommerceDatalayer = ():object => {
        return this.datalayer_ecommerce;
    };

    getDigitalDataEcommerce = (flightSelectedInfo, cabinSelectedIndex, event: string): void => {
        const transformData = (flightSelectedInfo, cabinSelectedIndex, event) => {
            let digital_data_ecommerce: MMBDigitalDataEcommerceModel.ViewItemList = { items: [] };
            const cvDatalayer: any = this.localStorageService.get('cvDatalayer');
            const mergeFlights: boolean = ![MMBDatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART, MMBDatalayerConstants.EVENTS_ECOMMERCE.VIEW_ITEM_LIST].includes(event);
            let totalPrice = 0;
            if (flightSelectedInfo?.cabins) {
                const numCabins: number = flightSelectedInfo.cabins.length;
                    const outboundRoute: string = this.getOutboundRoute(flightSelectedInfo);
                    const id: string = this.getIdItem('all');
                    const existFareFamily: boolean = (flightSelectedInfo.cabins[cabinSelectedIndex]?.fareFamilies);
                    let fareFamilies: Array<any> = [];
                    // Is shuttle slice
                    if (flightSelectedInfo?.info?.type === 'SHUTTLE') {
                        if (mergeFlights) {
                            totalPrice += this.getPrice(flightSelectedInfo.cabins[cabinSelectedIndex].priceNumber);
                        } else {
                            totalPrice = this.getPrice(flightSelectedInfo.cabins[cabinSelectedIndex].priceNumber);
                        }
                        let item: MMBDigitalDataEcommerceModel.Item = {
                            item_name: this.MmBAppConstants.ECOMMERCE.FLIGHT,
                            item_id: id,
                            price: totalPrice,
                            item_brand: flightSelectedInfo.segments[0].opered.toLowerCase(),
                            item_category: this.getItemCategory(),
                            item_category2: this.getItemCategory2(event, outboundRoute),
                            item_category3: this.DatalayerUtilsService.getItemCategory3(event, outboundRoute, id),
                            item_variant: this.getItemVariantShuttle(event, numCabins, mergeFlights, flightSelectedInfo.cabins[cabinSelectedIndex]),
                            quantity: Number(cvDatalayer?.numeroPax)
                        };
                        if (!mergeFlights) {
                            digital_data_ecommerce.items.push(item);
                        }
                    } else if(existFareFamily) {
                        fareFamilies = flightSelectedInfo.cabins[cabinSelectedIndex].fareFamilies;
                        if (mergeFlights) {
                            totalPrice += this.getPrice(flightSelectedInfo.cabins[cabinSelectedIndex]?.priceNumber);
                        }
                        fareFamilies.forEach(fareFamily => {
                            let item: MMBDigitalDataEcommerceModel.Item = {
                                item_name: this.MmBAppConstants.ECOMMERCE.FLIGHT,
                                item_id: id,
                                price: this.getPrice(fareFamily.price),
                                item_brand: flightSelectedInfo.segments[0].opered.toLowerCase(),
                                item_category: this.getItemCategory(),
                                item_category2: this.getItemCategory2(event, outboundRoute),
                                item_category3: this.DatalayerUtilsService.getItemCategory3(event, outboundRoute, id),
                                item_variant: this.getItemVariant(event, fareFamily, numCabins),
                                quantity: Number(cvDatalayer?.numeroPax)
                            };
                            if(event === MMBDatalayerConstants.EVENTS_ECOMMERCE.VIEW_ITEM_LIST
                            || (fareFamily.originalData.cabinDescription === flightSelectedInfo.cabins[cabinSelectedIndex]?.info?.selectedFareFamily?.cabinDescription && fareFamily.originalData.commercialCode === flightSelectedInfo.cabins[cabinSelectedIndex]?.info?.selectedFareFamily?.commercialCode)) {
                                if (mergeFlights) {
                                    item.price = totalPrice;
                                    digital_data_ecommerce.items.push(item);
                                }else if(!mergeFlights) {
                                    digital_data_ecommerce.items.push(item);
                                }
                            }
                        });
                    }
            }
            return digital_data_ecommerce;
        }
        let dataEcomerce = transformData(flightSelectedInfo, cabinSelectedIndex, event);
        this.MmBDigitalDataService.addDigitalDataEcommerceEvent(dataEcomerce, event);
    }

    createSelectItemEvent = (flightSelectedInfo, cabinSelectedIndex: number, fareSelectedIndex: number): void => {
        const transformData = (flightSelectedInfo, cabinSelectedIndex, fareSelectedIndex) => {
            let digital_data_ecommerce: MMBDigitalDataEcommerceModel.ViewItemList = { items: [] };
            const cvDatalayer: any = this.localStorageService.get('cvDatalayer');
            if (flightSelectedInfo?.cabins) {
                const numCabins: number = flightSelectedInfo.cabins.length;
                const outboundRoute: string = this.getOutboundRoute(flightSelectedInfo);
                const id: string = this.getIdItem('all');
                const fareFamilySelected = flightSelectedInfo.cabins[cabinSelectedIndex].fareFamilies[fareSelectedIndex];
                let item: MMBDigitalDataEcommerceModel.Item = {
                    item_name: this.MmBAppConstants.ECOMMERCE.FLIGHT,
                    item_id: id,
                    price: this.getPrice(fareFamilySelected.price),
                    item_brand: flightSelectedInfo.segments[0].opered.toLowerCase(),
                    item_category: this.getItemCategory(),
                    item_category2: this.getItemCategory2(MMBDatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM, outboundRoute),
                    item_category3: this.DatalayerUtilsService.getItemCategory3(MMBDatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM, outboundRoute, id),
                    item_variant: this.getItemVariant(MMBDatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM, fareFamilySelected, numCabins),
                    quantity: Number(cvDatalayer?.numeroPax)
                };
                digital_data_ecommerce.items.push(item);
            }
            return digital_data_ecommerce;
        }
        let dataEcomerce = transformData(flightSelectedInfo, cabinSelectedIndex, fareSelectedIndex);
        this.MmBDigitalDataService.addDigitalDataEcommerceEvent(dataEcomerce, MMBDatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM);
    }

    createAddToCartItemEvent = (flightSelectedInfo, cabinSelectedIndex: number, fareSelectedIndex: number): void => {
        const transformData = (flightSelectedInfo, cabinSelectedIndex, fareSelectedIndex) => {
            let digital_data_ecommerce: MMBDigitalDataEcommerceModel.ViewItemList = { items: [] };
            const cvDatalayer: any = this.localStorageService.get('cvDatalayer');
            const addToCart: any = this.localStorageService.get('addToCart') || { ecommerce: { items: [] } };
            if (flightSelectedInfo?.cabins) {
                const numCabins: number = flightSelectedInfo.cabins.length;
                const outboundRoute: string = this.getOutboundRoute(flightSelectedInfo);
                const id: string = this.getIdItem('all');
                const fareFamilySelected = flightSelectedInfo.cabins[cabinSelectedIndex].fareFamilies[fareSelectedIndex];
                let item: MMBDigitalDataEcommerceModel.Item = {
                    item_name: this.MmBAppConstants.ECOMMERCE.FLIGHT,
                    item_id: id,
                    price: this.getPrice(fareFamilySelected.price),
                    item_brand: flightSelectedInfo.segments[0].opered.toLowerCase(),
                    item_category: this.getItemCategory(),
                    item_category2: this.getItemCategory2(MMBDatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART, outboundRoute),
                    item_category3: this.DatalayerUtilsService.getItemCategory3(MMBDatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART, outboundRoute, id),
                    item_variant: this.getItemVariant(MMBDatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART, fareFamilySelected, numCabins),
                    quantity: Number(cvDatalayer?.numeroPax)
                };
                digital_data_ecommerce.items.push(item);
                addToCart.ecommerce.items.push(item);
            }
            this.localStorageService.set('addToCart', addToCart);
            return digital_data_ecommerce;
        }
        let dataEcomerce = transformData(flightSelectedInfo, cabinSelectedIndex, fareSelectedIndex);
        this.MmBDigitalDataService.addDigitalDataEcommerceEvent(dataEcomerce, MMBDatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
    }

    private getOutboundRoute = (flightSelectedInfo): string => {
        return flightSelectedInfo.origin + '-' + flightSelectedInfo.destination;
    };

    public getIdItem = (type): string => {
        let idItem: string = '';

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

    };

    private getBrand = (segments: any[]): string => {
        let brand: string = '';
        if(segments) {
            segments.forEach(segment => {
                brand += brand === '' ? segment.flight.operationalCarrier.name : '-' + segment.flight.operationalCarrier.name;
            });
        }
        return brand;
    };

    private getPrice (farePriceToCalculate: any){
        const bookingUrlParams: any = this.localStorageService.get('bookingUrlParams');
        if(bookingUrlParams?.payWithAvios){
            return 0;
        } else {
            return farePriceToCalculate;
        }
    }

    private getItemCategory = (): string => {
        const isHMAD = this.localStorageService.get('isHMAD');
        const isMultipleTrip = this.localStorageService.get('multiCitySearch');
        const isMetasearch = this.localStorageService.get('searchFlightType') === this.MmBAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH;
        if(isMetasearch) return this.MmBAppConstants.ECOMMERCE.METASEARCH;
        if(isHMAD) return this.MmBAppConstants.ECOMMERCE.STOPOVER_HMAD;
        if(isMultipleTrip) return this.MmBAppConstants.ECOMMERCE.MULTIPLE_JOURNEYS;
        return this.MmBAppConstants.ECOMMERCE.DIRECT_PURCHASE;
    };

    private getItemCategory2 = (event: string, outboundRoute: string): string => {
        if(event === 'begin_checkout' || event === 'add_shipping_info') {
            return 'all';
        } else {
            return outboundRoute;
        }
    };

    private getItemVariant = (event: string, fareFamily: any, numSelectedSlices: number): string => {
        if(event === 'begin_checkout' || event === 'add_shipping_info' || event === 'add_to_cart_payments') {
            const isMulticity = this.CommonsSessionStorageService.get('multiCitySearch') || null;
            if(isMulticity) return 'mt';
            return numSelectedSlices > 1 ? 'rt' : 'ow';
        } else {
            return (fareFamily.originalData.cabinDescription.toLowerCase() + '_' + fareFamily.originalData.commercialNameES.toLowerCase()).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
    };

    private getItemVariantShuttle = (event:string, numSelectedSlices:number, mergeFlights:boolean, selectedSlice: any) =>{
        const cabinDesc = selectedSlice.info.cabinFullName.toLowerCase().replace(' ', '_').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if(event === 'add_to_cart_payments')
            return (numSelectedSlices > 1)? 'rt': 'ow';
        return !(mergeFlights)? (numSelectedSlices > 1)? 'rt': 'ow' : cabinDesc;
    };
}
