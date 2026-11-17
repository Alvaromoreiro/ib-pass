import * as angular from 'angular';
import { CkiDatalayerConstantsType, CkiDatalayerConstants } from '../ib-cki-datalayer-constants';
import { CkiDigitalDataService } from './ib-cki-digital-data-service';

@Service('ib-datalayer-cki-module', ['CkiDatalayerConstants', 'CkiDigitalDataService', 'localStorageService', '$window', 'CheckinAppConstants'])
export class CkiDataLayerService {
    public datalayer_general : object;
    public datalayer_ecommerce: object;
    constructor (
        private CkiDatalayerConstants: CkiDatalayerConstantsType,
        private CkiDigitalDataService: CkiDigitalDataService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $window : ng.IWindowService,
        private CheckinAppConstants: CheckinAppConstants
    ) { }

    digitalDataEcommerceEventAPIS = (): void => {
        const digitalDataEcommerce = { items: [] };
        this.CkiDigitalDataService.addDigitalDataEcommerceEvent(digitalDataEcommerce, this.CkiDatalayerConstants.EVENTS_ECOMMERCE.BEGIN_CHECKOUT);
        this.CkiDigitalDataService.addDigitalDataEcommerceEvent(digitalDataEcommerce, this.CkiDatalayerConstants.EVENTS_ECOMMERCE.ADD_SHIPPING_INFO);
    };

    setProcessAndStep = (quadrigam: string): void => {
        const isFlowDuplicated = this.localStorageService.get('isFlowDuplicated');
        const step = this.CkiDatalayerConstants.DATALAYER_FLOW_CKI[quadrigam] || '';
        const quadrigamsDesInvoicing = [this.CheckinAppConstants.QUADRIGAM.UN_RECOVERY, this.CheckinAppConstants.QUADRIGAM.UN_SEARCH, this.CheckinAppConstants.QUADRIGAM.UN_CONFIRM];
        const quadrigamLocal: string = quadrigam ? quadrigam : '';
        const stepLocal: string = (this.CkiDatalayerConstants.DIGITAL_DATA_STEP[quadrigam]) ? this.CkiDatalayerConstants.DIGITAL_DATA_STEP[quadrigam] : step;
        let process = isFlowDuplicated ? this.CkiDatalayerConstants.DATALAYER_FLOW_CKI.PROCESS_DUPLICATE : this.CkiDatalayerConstants.DATALAYER_FLOW_CKI.PROCESS;
        if(quadrigamsDesInvoicing.includes(quadrigam)) process = this.CkiDatalayerConstants.DATALAYER_FLOW_CKI.PROCESS_DESINVOICING;
        let processLocal: string = process ? process : '';

        /* INIT DELETE GA4 MIGRATION*/
        const extendedDatalayerInfo = {};
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.PROCESS] = processLocal;
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.STEP] = stepLocal;
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.QUADRIGAM] = quadrigamLocal;
        this.addDataLayerGeneralInfo(extendedDatalayerInfo);
        /* FIN DELETE GA4 MIGRATION*/

        const extendedDigitalDataInfo = {};
        extendedDigitalDataInfo[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.PROCESS] = processLocal;
        extendedDigitalDataInfo[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.STEP] = stepLocal;
        extendedDigitalDataInfo[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.QUADRIGAM] = quadrigamLocal;
        this.addDigitalDataInfo(extendedDigitalDataInfo);
    };

    addDigitalDataInfo = (datalayerInfo: object): void => {
        this.CkiDigitalDataService.addDigitalDataInfo(datalayerInfo);
    };

    /**
     * Initializes the datalayer_general and datalayer_ecommerce objects associating it to page window object.
     * @param {Object} initialGeneralObject the initial object of datalayer_general. if no object received, datalayer_general will be initialized with empty object
     * @param {Object} initialEcommerceObject the initial object of datalayer_ecommerce. if no object received, datalayer_ecommerce will be initialized with empty object
     */
    initDatalayer = (initialGeneralObject: object, initialEcommerceObject : object) :void=> {
        initialGeneralObject = initialGeneralObject || {};
        initialEcommerceObject = initialEcommerceObject || {};
        this.datalayer_general = this.$window.datalayer_general = this.$window.datalayer_general || {};
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
     * @param {string[]} attributesArray an array with the String name of the attributes to be removed from datalager_general
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

    /**
     * Reset the datalayer_general objects associating it to page window object.
     * @param {Object} initialGeneralObject the initial object of datalayer_general. if no object received, datalayer_general will be initialized with empty object
     */
    resetDatalayer = (initialGeneralObject: object): void => {
        this.datalayer_general = this.$window.datalayer_general = initialGeneralObject || {};
        this.localStorageService.set('confirmationDatalayerInfo', this.datalayer_general);
    };

}
