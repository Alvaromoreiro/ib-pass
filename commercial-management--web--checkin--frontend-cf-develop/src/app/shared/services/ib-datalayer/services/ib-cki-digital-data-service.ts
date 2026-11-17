import * as angular from 'angular';
import isEqual from 'lodash-es/isEqual.js';
import omit from 'lodash-es/omit.js';

@Service(
    'ib-datalayer-cki-module',
    ['$window', 'localStorageService']
)
export class CkiDigitalDataService {
    digital_data: object;

    constructor (
        private $window: ng.IWindowService,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) {}

    /**
     * Initializes the digital_data objects associating it to page window object.
     * @param {Object} initialGeneralObject the initial object of digital_data. if no object received, digital_data will be initialized with empty object
     */
    initDigitalData = (initialGeneralObject: object = {}): void => {
        this.digital_data = this.$window.digital_data =
            this.$window.digital_data || this.localStorageService.get('confirmationDigitalInfo') || {};
        angular.extend(this.digital_data, initialGeneralObject);
    };

    /**
     * Returns if datalayer has been initialized
     */
    isDigitalDataInit = (): boolean => {
        return angular.isObject(this.digital_data);
    };

    /**
     * Extends the current datalayer general information with the extendObj object. If an attribute exists in the current
     * digital_data object, changes its value.
     * @param {Object} extendObj the object to extend the current digital_data object
     */
    addDigitalDataInfo = (extendObj: object = {}): void => {
        this.localStorageService.set('confirmationDigitalInfo', angular.extend(this.digital_data, extendObj));
    };

    /**
     * Extends the current datalayer ecommerce information with the extendObj object. If an attribute exists in the current
     * digital_data_ecommerce object, changes its value.
     * @param {Object} extendObj the object to extend the current digital_data_ecommerce object
     */
    addDigitalDataEcommerceInfo = (extendObj: object): void => {
        extendObj = extendObj || {};
        let confirmationDigitalInfo: object = this.localStorageService.get('confirmationDigitalInfo');
        confirmationDigitalInfo['ecommerce'] = extendObj;
        this.addDigitalDataInfo(confirmationDigitalInfo);
    };

    addDigitalDataEcommerceEvent = (extendObj: object, event: string): void => {
        const digital_data = { ecommerce: extendObj };
        this.$window.dataLayer.push(digital_data, { event: event });
    };

    setAddInfoAddToCart = (extendObj: DigitalDataEcommerceModel.ViewItemList): void => {
        const addToCart: any = this.localStorageService.get('addToCart') || { ecommerce: { items: [] } };
        if (extendObj && extendObj.items.length > 0) {
            extendObj.items.forEach((itemToAdd) => {
                const index: number = addToCart.ecommerce.items.findIndex((item) =>
                    isEqual(omit(itemToAdd, ['quantity']), omit(item, ['quantity']))
                );
                if (index < 0) {
                    addToCart.ecommerce.items.push(itemToAdd);
                } else {
                    addToCart.ecommerce.items[index].quantity =
                        addToCart.ecommerce.items[index].quantity + itemToAdd.quantity;
                }
            });
        }
        this.localStorageService.set('addToCart', addToCart);
    };

    setRemoveInfoAddToCart = (extendObj: DigitalDataEcommerceModel.ViewItemList): void => {
        const addToCart: any = this.localStorageService.get('addToCart') || { ecommerce: { items: [] } };
        if (extendObj && extendObj.items.length > 0) {
            extendObj.items.forEach((itemToRemove) => {
                const index: number = addToCart.ecommerce.items.findIndex((item) =>
                    isEqual(omit(itemToRemove, ['quantity']), omit(item, ['quantity']))
                );
                if (index >= 0 && itemToRemove.quantity === addToCart.ecommerce.items[index].quantity) {
                    addToCart.ecommerce.items.splice(index, 1);
                } else if (index >= 0 && itemToRemove.quantity < addToCart.ecommerce.items[index].quantity) {
                    addToCart.ecommerce.items[index].quantity =
                        addToCart.ecommerce.items[index].quantity - itemToRemove.quantity;
                }
            });
        }
        this.localStorageService.set('addToCart', addToCart);
    };

    /**
     * removes a set of attributes from digital_data object. If the input parameter is not an array, no modification will be done
     * @param {string[]} attributesArray an array with the String name of the attributes to be removed from datalager_general
     */
    removeDigitalDataInfo = (attributesArray: object): void => {
        let i: number = 0;
        if (angular.isArray(attributesArray)) {
            for (i = 0; i < attributesArray.length; i++) {
                if (angular.isString(attributesArray[i]) && this.digital_data[attributesArray[i]]) {
                    delete this.digital_data[attributesArray[i]];
                }
            }
        }
    };

    /**
     * Removes all datalayer objects info by initializing it to empty object
     */
    removeAllDigitalDataInfo = (): void => {
        this.digital_data = this.$window.digital_data = {};
    };

    /**
     * returns the current datalayer general
     */
    getDigitalData = (): object => {
        return this.digital_data;
    };

    /**
     * returns the current ecommerce datalayer
     */
    getDigitalDataEcommerce = (): object => {
        return this.digital_data && this.digital_data['ecommerce'] ? this.digital_data['ecommerce'] : null;
    };

    emitEvent = (event: string, eventObject: any): void => {
        this.$window.dataLayer.push(eventObject, { event: event });
    };

    emitViewEvent = (): void => {
        this.$window.dataLayer.push(this.digital_data, { event: 'view' });
    };

    /**
     * Reset the datalayer_general objects associating it to page window object.
     * @param {Object} initialGeneralObject the initial object of datalayer_general. if no object received, datalayer_general will be initialized with empty object
     */
    resetDigitalData = (initialGeneralObject: object): void => {
        this.digital_data = this.$window.digital_data = initialGeneralObject || {};
        this.localStorageService.set('confirmationDigitalInfo', this.digital_data);
    };
}
