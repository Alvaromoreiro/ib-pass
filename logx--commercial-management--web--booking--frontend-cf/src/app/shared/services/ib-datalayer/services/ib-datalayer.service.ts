import { Inject, Injectable } from '@angular/core';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
@Injectable(
    {providedIn: 'root'}
)
export class DataLayerService {
    public datalayer_general : object;
    public datalayer_ecommerce: object;
    constructor (
        @Inject(WINDOW_TOKEN) private $window: ng.IWindowService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {}

    /**
     * Initializes the datalayer_general and datalayer_ecommerce objects associating it to page window object.
     * @param {Object} initialGeneralObject the initial object of datalayer_general. if no object received, datalayer_general will be initialized with empty object
     * @param {Object} initialEcommerceObject the initial object of datalayer_ecommerce. if no object received, datalayer_ecommerce will be initialized with empty object
     */
    initDatalayer = (initialGeneralObject: object = {}, initialEcommerceObject: object = {}): void => {
        const confirmationDatalayerInfo =this.CommonsSessionStorageService.get('confirmationDatalayerInfo') ?? {};
        this.datalayer_general = this.$window.datalayer_general = this.$window.datalayer_general ?? confirmationDatalayerInfo;
        this.datalayer_ecommerce = this.$window.datalayer_ecommerce = this.$window.datalayer_ecommerce ?? {};
        Object.assign(this.datalayer_general, initialGeneralObject);
        Object.assign(this.datalayer_ecommerce, initialEcommerceObject);
    };

    /**
     * Returns if datalayer has been initialized
     */
    isDatalayerInit = ():boolean => {
        return (typeof(this.datalayer_general) === 'object') && (typeof(this.datalayer_ecommerce) === 'object');
    };

    /**
     * Extends the current datalayer general information with the extendObj object. If an attribute exists in the current
     * datalayer_general object, changes its value.
     * @param {Object} extendObj the object to extend the current datalayer_general object
     */
    addDataLayerGeneralInfo = (extendObj: unknown):void => {
        extendObj = extendObj || {};
        this.CommonsSessionStorageService.set('confirmationDatalayerInfo', Object.assign(this.datalayer_general, extendObj));
    };

    /**
     * Extends the current datalayer ecommerce information with the extendObj object. If an attribute exists in the current
     * datalayer_ecommerce object, changes its value.
     * @param {Object} extendObj the object to extend the current datalayer_ecommerce object
     */
    addDataLayerEcommerceInfo = (extendObj:object) :void => {
        extendObj = extendObj || {};
        Object.assign(this.datalayer_ecommerce, extendObj);
    };

    /**
     * removes a set of attributes from datalayer_general object. If the input parameter is not an array, no modification will be done
     * @param {Array<String>} attributesArray an array with the String name of the attributes to be removed from datalager_general
     */
    removeDatalayerGeneralInfo = (attributesArray: object) :void=> {
        let i: number = 0;
        if (Array.isArray(attributesArray)) {
            for (i = 0; i < attributesArray.length; i++) {
                delete this.datalayer_general[attributesArray[i]];
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
     * @deprecated Since 26.11.0
     * Sends to Google Tag Manager an event with the current datalayer_general and datalayer_ecommerce info
     * @param {String} type the event type for Google Tag Manager (Ej: 'view', 'link')
     */
    callUpdateTagManager = (type : string) => {
        void type;
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
}
downgradeToAJSService('DataLayerService', DataLayerService, 'ib-datalayer-bki-module');
