import {MonetateConstantsType} from '../ib-monetate-constants';

@Service('ib-monetate-bki-module', ['$window', 'MonetateConstants', 'localStorageService'])
export class MonetateService {
    public monetateQ:[];
    public totalProductCollection = [];


    constructor ( private $window: ng.IWindowService,
        private MonetateConstants: MonetateConstantsType,
        private localStorageService: ng.local.storage.ILocalStorageService) {
    }

    /**
    * Initializes the monetateQ and datalayer_ecommerce objects associating it to page window object.
    */
    initMonetate = () :void => {
        this.monetateQ = this.$window.monetateQ = this.$window.monetateQ || [];
    };

    checkMonetateQ = ():boolean => !!this.$window.monetateQ;

    /**
    * Extends the current monetate information with the page type
    * @param {Object} extendObj the object to extend the current monetateQ object
    */
    addMonetatePageType = (pageType:object):void => {
        if (this.checkMonetateQ()) {
            this.$window.monetateQ.push(pageType);
        }
    };

    /**
    * Extends the current monetate information with the extendObj object. If an attribute exists in the current
    * monetateQ object, changes its value.
    * @param {Object} extendObj the object to extend the current monetateQ object
    */
    addMonetateGeneralInfo = (extendObj:object): void => {
        if (this.checkMonetateQ()) {
            extendObj = extendObj || {};
            this.$window.monetateQ.push(extendObj);
        }
    };

    /**
    * Sends an event with the current monetateQ info
    */
    sendUpdateToMonetate = ():void => {
        if (this.checkMonetateQ()) {
            this.$window.monetateQ.push([this.MonetateConstants.MONETATE_INFO.TRACKDATA]);
        }
    };

    sendMonetatePageType = ():void => {
        if (this.checkMonetateQ()) {
            this.$window.monetateQ.push([
                'setPageType',
                this.localStorageService.get('close')
            ]);

            this.$window.monetateQ.push([this.MonetateConstants.MONETATE_INFO.TRACKDATA]);
        }
        
    };


    /**
    * Returns the current monetateQ object
    */
    getMonetateGeneral = ():object => {
        return this.monetateQ;
    };

    trackAncillariesProductsAdded = (productCollection: CommonsMonetateModels.CartProductDetails[] | CommonsMonetateModels.PurchaseProduct[], where: string): void => {
        let functionApplied = '';
        if (where === this.MonetateConstants.TRACK_PLACE.CART) {
            this.totalProductCollection = this.totalProductCollection.concat(productCollection);
            //Remove duplicities
            this.totalProductCollection =  [...new Map(this.totalProductCollection.map((v: CommonsMonetateModels.CartProductDetails) => [v.productId, v])).values()];
            this.totalProductCollection.map(product => product.unitPrice !== '0' ? product.isAncillary = true : product.isAncillary = false);
            this.localStorageService.set('addedCartProducts', this.totalProductCollection);

            functionApplied = this.MonetateConstants.FUNCTIONS.ADDCARTROWS;
        } else {
            functionApplied = this.MonetateConstants.FUNCTIONS.ADDPURCHASEROWS;
        }
        if (this.checkMonetateQ()) {
            this.$window.monetateQ.push([
                functionApplied,
                productCollection
            ]);
        }
    };
    /* 
        Update an substute the string that identifies the main product  of the flow
        Used in BKI  - availability
    */
    addProductDetails = (details: string[] = []) => {
        if (this.checkMonetateQ()) {
            this.$window.monetateQ.push([
                this.MonetateConstants.FUNCTIONS.ADDPRODUCTDETAILS,
                details
            ]);
        }
    };
}
