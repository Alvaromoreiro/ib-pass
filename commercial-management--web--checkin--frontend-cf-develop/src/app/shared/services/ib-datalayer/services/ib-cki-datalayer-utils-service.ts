import * as angular from 'angular';
import dayjs from 'dayjs';
import { CkiDataLayerService } from './ib-cki-datalayer-service';
import { CkiDigitalDataService } from './ib-cki-digital-data-service';
import { CkiDatalayerConstantsType, SEAT_TYPE_MAP } from '../ib-cki-datalayer-constants';
import { CommonsUtilService } from 'ib-web-commons/dist/app/core/utils/ib-commons-utils-service';
import { CommonsUserUtilsService } from 'ib-web-commons/utils/ib-commons-user-utils.service';
import { CommonsConstantsType } from 'ib-web-commons/dist/constants';
import { MonetateUtilsService } from '@shared/services/ib-monetate/services/ib-monetate-utils';
import { HeaderModelLocalstorage, InsuranceAllianzFusionInfo, ShoppingBasket } from '@src/app/core/models/header-model/header.model';
import { MonetateConstantsType } from '@shared/services/ib-monetate/ib-monetate-constants';
import { AncillariesContext, DatalayerInfoInsurance } from '@src/app/core/models/ib-datalayer-utils/ib-datalayer-utils.model';

@Service('ib-datalayer-cki-module', ['CkiDataLayerService', '$rootScope', '$timeout', 'CommonsConstants',
    'localStorageService', 'CommonsUtilService', '$filter', 'CommonsUserUtilsService',
    'CkiDigitalDataService', 'CkiDatalayerConstants', 'MonetateUtilsService', 'MonetateConstants'], ['ib-commons-constants-module'])
export class CkiDatalayerUtilsService {
    public DATALAYER_ERROR_ATTR: string[] = [this.CkiDatalayerConstants.DATALAYER_INFO.ERROR_CODE, this.CkiDatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION, this.CkiDatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE];
    public DATALAYER_MODAL_ATTR: string[] = [this.CkiDatalayerConstants.DATALAYER_INFO.MODAL_ID];
    public DATALAYER_PROCESS_AND_STEP_ATTR: string[] = [this.CkiDatalayerConstants.DATALAYER_INFO.PROCESS, this.CkiDatalayerConstants.DATALAYER_INFO.STEP];
    public DIGITAL_DATA_PROCESS_AND_STEP_ATTR: string[] = [this.CkiDatalayerConstants.DIGITAL_DATA_INFO.PROCESS, this.CkiDatalayerConstants.DIGITAL_DATA_INFO.STEP];
    public LANG: string;
    public MARKET: string;
    constructor (
        private CkiDataLayerService: CkiDataLayerService,
        private $rootScope: CommonsRootScope,
        private $timeout: ng.ITimeoutService,
        private CommonsConstants: CommonsConstantsType,
        private localStorageService: ng.local.storage.ILocalStorageService,
        private CommonsUtilService: CommonsUtilService,
        private $filter: ng.FilterFactory,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private CkiDigitalDataService: CkiDigitalDataService,
        private CkiDatalayerConstants: CkiDatalayerConstantsType,
        private MonetateUtilsService: MonetateUtilsService,
        private MonetateConstants: MonetateConstantsType
    ) {
    }
    /**
     * Initialize the datalayer object
     */
    initializeDatalayer = (language: string, market: string, deviceType: string): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const initialDatalayer = {};
        if (!this.CkiDataLayerService.isDatalayerInit()) {
            this.LANG = language;
            this.MARKET = market;
            initialDatalayer[this.CkiDatalayerConstants.DATALAYER_INFO.LANGUAGE] = language;
            initialDatalayer[this.CkiDatalayerConstants.DATALAYER_INFO.MARKET] = market;
            initialDatalayer[this.CkiDatalayerConstants.DATALAYER_INFO.WEB_VERSION] = this.CkiDatalayerConstants.DATALAYER_VALUES.WEB_VERSION;
            initialDatalayer[this.CkiDatalayerConstants.DATALAYER_INFO.WEB_MODE] = deviceType;
            this.CkiDataLayerService.initDatalayer(initialDatalayer, {});
        }
        /* FINISH DELETE GA4 MIGRATION*/
        const initialDigitalData = {};
        if (!this.CkiDigitalDataService.isDigitalDataInit()) {
            this.LANG = language;
            this.MARKET = market;
            initialDigitalData[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.LANGUAGE] = language;
            initialDigitalData[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.MARKET] = market;
            initialDigitalData[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.WEB_VERSION] = this.CkiDatalayerConstants.DATALAYER_VALUES.WEB_VERSION;
            initialDigitalData[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.WEB_MODE] = deviceType;
            this.CkiDigitalDataService.initDigitalData(initialDigitalData);
        }
    };

    /**
     * Sends a datalayer event to the server
     * @param {String} type the event type. If it is not a String, no event will be sent
    */
    sendDatalayerEvent = (type: string): void => {
        if (angular.isString(type)) {
            this.$timeout(() => {
                /* INIT DELETE GA4 MIGRATION*/
                this.$rootScope.$broadcast('updateDatalayer');
                /* FINISH DELETE GA4 MIGRATION*/
                this.$rootScope.$broadcast('updateDigitalData');
            });
        }
    };

    /**
     * Extends the current datalayer information with the received info
     * @param {Object} datalayerInfo the information to extend current general datalayer info
     */
    /* INIT DELETE GA4 MIGRATION*/
    addDataLayerInfo = (datalayerInfo: object): void => {
        this.CkiDataLayerService.addDataLayerGeneralInfo(datalayerInfo);
    };
    /* FINISH DELETE GA4 MIGRATION*/
    addDigitalDataInfo = (datalayerInfo: object): void => {
        this.CkiDigitalDataService.addDigitalDataInfo(datalayerInfo);
    };

    /**
     * updates datalayer with the user logged info
     * @param {Object} customerData the user logged generalInfo information
     */
    /* INIT DELETE GA4 MIGRATION*/
    updateLoggedDatalayer = (customerData: CommonsDatalayerServiceTypes.CustomerDataDatalayer ) :void => {
        const extendDatalayer: object = {};
        const membershipData: CommonsDatalayerServiceTypes.MemberShipDatalayer = this.localStorageService.get('membershipData');
        let userLevel = '', userId = '', aviosCoins = 0, hashEID = '', userSegment = 0;
        if (customerData) {
            userLevel = customerData.category || ( customerData.generalInfo  && customerData.generalInfo.category ? customerData.generalInfo.category : '');
            aviosCoins = angular.isNumber(customerData.avios) ? customerData.avios : 0;
            hashEID = (customerData.hashEID) ? customerData.hashEID : '';
            userSegment = this.CkiDatalayerConstants.DATALAYER_USER_LEVELS[userLevel.toUpperCase()] || 0;

            if (this.CommonsUserUtilsService.isUserLoggedONB()) {
                userId = typeof membershipData?.clid === 'string' && membershipData.clid;
                userLevel = membershipData?.tierStatus?.status;

            } else {
                /* Despite the name it obtains the account identifier of IB0 too */
                const identifier = this.CommonsUserUtilsService.getFrequentFlyer();
                if (identifier !== 'NOT_FOUND') userId = identifier;
            }
            if (customerData.hashEID) {
                hashEID = customerData.hashEID;
            } else if(angular.isString(customerData.email)) {
                this.CommonsUtilService.sha256(customerData.email).then((hash) => {
                    hashEID = hash;
                    extendDatalayer[this.CkiDatalayerConstants.DATALAYER_INFO.HASH_EMAIL] = hashEID;
                    this.addDataLayerInfo(extendDatalayer);
                });
            }

            if(userLevel) extendDatalayer[this.CkiDatalayerConstants.DATALAYER_INFO.USER_LEVEL] = userLevel;
            if(userId) extendDatalayer[this.CkiDatalayerConstants.DATALAYER_INFO.USER_ID] = userId;
            extendDatalayer[this.CkiDatalayerConstants.DATALAYER_INFO.AVIOS_COINS] = aviosCoins;
            extendDatalayer[this.CkiDatalayerConstants.DATALAYER_INFO.USER_AVIOS] = aviosCoins;
            extendDatalayer[this.CkiDatalayerConstants.DATALAYER_INFO.HASH_EMAIL] = hashEID;
            extendDatalayer[this.CkiDatalayerConstants.DATALAYER_INFO.USER_SEGMENT] = userSegment;

            this.addDataLayerInfo(extendDatalayer);
            this.addDatalayerInfoHashEID(customerData);
        }
    };
    /* FINISH DELETE GA4 MIGRATION*/
    updateLoggedDigitalData = (customerData: CommonsDatalayerServiceTypes.CustomerDataDatalayer ) :void => {
        const extendDatalayer: object = {};
        const membershipData: CommonsDatalayerServiceTypes.MemberShipDatalayer = this.localStorageService.get('membershipData');
        let userLevel = '', aviosCoins = 0, userId = '', hashEID = '', userSegment = 0;

        if (customerData) {
            userLevel = customerData.category || ( customerData.generalInfo  && customerData.generalInfo.category ? customerData.generalInfo.category : '');
            aviosCoins = this.getAviosCoins(customerData);
            hashEID = (customerData.hashEID) ? customerData.hashEID : '';
            userSegment = this.CkiDatalayerConstants.DATALAYER_USER_LEVELS[userLevel.toUpperCase()] || 0;

            if (this.CommonsUserUtilsService.isUserLoggedONB()) {
                userId = typeof membershipData?.clid === 'string' && membershipData.clid;
                userLevel = membershipData?.tierStatus?.status;
            } else {
                /* Despite the name it obtains the account identifier of IB0 too */
                const identifier = this.CommonsUserUtilsService.getFrequentFlyer();
                if (identifier !== 'NOT_FOUND') userId = identifier;
            }

            if (customerData.hashEID) {
                hashEID = customerData.hashEID;
                extendDatalayer[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.HASH_EMAIL] = hashEID;
                this.addDigitalDataInfo(extendDatalayer);
            } else if(angular.isString(customerData.email)) {
                this.CommonsUtilService.sha256(customerData.email).then((hash) => {
                    hashEID = hash;
                    extendDatalayer[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.HASH_EMAIL] = hashEID;
                    this.addDigitalDataInfo(extendDatalayer);
                });
            }

            if(userLevel) extendDatalayer[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.USER_LEVEL] = userLevel;
            if(userId) extendDatalayer[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.USER_ID] = userId;
            if(hashEID) extendDatalayer[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.HASH_EMAIL] = hashEID;
            extendDatalayer[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.AVIOS_COINS] = aviosCoins;
            extendDatalayer[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.USER_AVIOS] = aviosCoins;
            extendDatalayer[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.USER_SEGMENT] = userSegment;

            this.addDigitalDataInfo(extendDatalayer);
            this.addDigitalDataInfoHashEID(customerData);
        }
    };

    getAviosCoins (customerData: CommonsDatalayerServiceTypes.CustomerDataDatalayer): number{
        let aviosGeneralInfo = customerData.generalInfo && customerData.generalInfo.avios
            ? customerData.generalInfo.avios
            : 0;
        return angular.isNumber(customerData.avios)
            ? customerData.avios
            : aviosGeneralInfo;
    }

    /**
     * Generates a datalayer String for Teleaf analytics
     * @return a String with the whole current datalayer info in a well formed structure for teleaf
     */
    generateDatalayerDOM = () => {
        let datalayerDOM: string = '<script type="text/javascript">';
        const datalayer_general = this.CkiDataLayerService.getDatalayerGeneral();
        const datalayer_ecommerce = this.CkiDataLayerService.getEcommerceDatalayer();
        let currentNodeValue;

        for (const currentNode in datalayer_general) {
            currentNodeValue = angular.isObject(datalayer_general[currentNode]) ? angular.toJson(datalayer_general[currentNode]) : datalayer_general[currentNode];
            datalayerDOM += ('datalayer_general[\'' + currentNode + '\']=\'' + currentNodeValue + '\';');
        }
        for (const currentNode in datalayer_ecommerce) {
            currentNodeValue = angular.isObject(datalayer_ecommerce[currentNode]) ? angular.toJson(datalayer_ecommerce[currentNode]) : datalayer_ecommerce[currentNode];
            datalayerDOM += ('datalayer_ecommerce[\'' + currentNode + '\']=\'' + currentNodeValue + '\';');
        }
        datalayerDOM += '</script>';
        return datalayerDOM;
    };


    /**
     * Generates a digital data String for Teleaf analytics
     * @return a String with the whole current digital data info in a well formed structure for teleaf
     */
    generateDigitalDataDOM = () => {
        let datalayerDOM: string = '<script type="text/javascript">';
        const digital_data = this.CkiDigitalDataService.getDigitalData();
        let currentNodeValue;

        for (const currentNode in digital_data) {
            currentNodeValue = angular.isObject(digital_data[currentNode]) ? angular.toJson(digital_data[currentNode]) : digital_data[currentNode];
            datalayerDOM += ('digital_data[\'' + currentNode + '\']=\'' + currentNodeValue + '\';');
        }
        datalayerDOM += '</script>';
        return datalayerDOM;
    };

    /**
     * removes a set of attributes from datalayer.
     * @param {string[]} datalayerAttributtes an array with the String name of the attributes to be removed from datalager
     */
    /* INIT DELETE GA4 MIGRATION*/
    removeDatalayerObjects = (datalayerAttributtes: object): void => {
        this.CkiDataLayerService.removeDatalayerGeneralInfo(datalayerAttributtes);
    };
    /* FINISH DELETE GA4 MIGRATION*/
    removeDigitalDataObjects = (datalayerAttributtes: object): void => {
        this.CkiDigitalDataService.removeDigitalDataInfo(datalayerAttributtes);
    };

    /**
     * Extends datalayer object with the quadrigam info and the extended info given
     * @param {String} quadrigam the String with the quadrigam to be set
     * @param {Object} extendedObject the extended object to be added to datalayer
     */
    /* INIT DELETE GA4 MIGRATION*/
    updateDatalayerWithQuadrigam = (quadrigam, extendedObject, isUserLogged) => {
        const extendDatalayer = {};

        if (angular.isObject(extendedObject)) {
            angular.extend(extendDatalayer, extendedObject);
        }

        if (angular.isString(quadrigam)) {
            quadrigam = quadrigam.replace(/\//g, '');
            extendDatalayer[this.CkiDatalayerConstants.DATALAYER_INFO.QUADRIGAM] = quadrigam;
            extendDatalayer[this.CkiDatalayerConstants.DATALAYER_INFO.CODE] = this.getTrackingCode(quadrigam);
        }

        extendDatalayer[this.CkiDatalayerConstants.DATALAYER_INFO.USER_STATE] = this.getUserState(isUserLogged);
        this.addDataLayerInfo(extendDatalayer);
    };
    /* FINISH DELETE GA4 MIGRATION*/
    updateDigitalDataWithQuadrigam = (quadrigam, extendedObject, isUserLogged) => {
        const extendDatalayer = {};

        if (angular.isObject(extendedObject) && extendedObject.eventCategory != 'ancillaries') {
            angular.extend(extendDatalayer, extendedObject);
        }

        if (angular.isString(quadrigam)) {
            extendDatalayer[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.QUADRIGAM] = quadrigam.replace(/\//g, '');
            extendDatalayer[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.CODE] = this.getTrackingCode(quadrigam);
        }

        extendDatalayer[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.USER_STATE] = this.getUserState(isUserLogged);
        this.addDigitalDataInfo(extendDatalayer);
    };

    /**
     * sends datalayer event with the current datalayer info and the datalayer error info
     * @param {Object} errorObject the object with the 'message', 'errorCode' y 'internalErrorCode' attributes
     */
    /* INIT DELETE GA4 MIGRATION*/
    sendDatalayerErrorEvent = (errorObject : CommonsDatalayerServiceTypes.ErrorObjectDatalayer) :void => {
        const extendedDatalayerInfo = {};
        if (angular.isObject(errorObject) && errorObject.errorCode) {
            if (errorObject.quadrigam) {
                this.updateDatalayerWithQuadrigam(errorObject.quadrigam, null, errorObject.isLogged);
            }
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE] =
                extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE] ?
                    `${extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE]}|${errorObject.internalErrorCode}` :
                    errorObject.internalErrorCode;
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ERROR_CODE] =
                extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ERROR_CODE] ?
                    `${extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ERROR_CODE]}|${errorObject.errorCode.toString()}` :
                    errorObject.errorCode.toString();
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION] =
                extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION] ?
                    `${extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION]}|${errorObject.message}` :
                    errorObject.message;
            if (errorObject.eventCategory) {
                extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.EVENT_CATEGORY] = errorObject.eventCategory;
            }
            if (errorObject.eventCategory) {
                extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.EVENT_ACTION] = errorObject.eventAction;
            }
            if (errorObject.eventLabel) {
                extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.EVENT_LABEL] = errorObject.eventLabel;
            }

            this.addDataLayerInfo(extendedDatalayerInfo);
            this.sendDatalayerEvent(this.CkiDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        }
    };
    /* FINISH DELETE GA4 MIGRATION*/
    sendDigitalDataErrorEvent = (errorObject : CommonsDatalayerServiceTypes.ErrorObjectDatalayer) :void => {
        const extendedDatalayerInfo = {};
        if (angular.isObject(errorObject) && errorObject.errorCode) {
            if (errorObject.quadrigam) {
                this.updateDigitalDataWithQuadrigam(errorObject.quadrigam, null, errorObject.isLogged);
            }
            // extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE] =
            //     extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE] ?
            //         `${extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE]}|${errorObject.internalErrorCode}` :
            //         errorObject.internalErrorCode;
            // extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ERROR_CODE] =
            //     extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ERROR_CODE] ?
            //         `${extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ERROR_CODE]}|${errorObject.errorCode.toString()}` :
            //         errorObject.errorCode.toString();
            // extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION] =
            //     extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION] ?
            //         `${extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION]}|${errorObject.message}` :
            //         errorObject.message;
            if (errorObject.eventCategory) {
                extendedDatalayerInfo[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.EVENT_CATEGORY] = errorObject.eventCategory;
            }
            if (errorObject.eventCategory) {
                extendedDatalayerInfo[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.EVENT_ACTION] = errorObject.eventAction;
            }
            if (errorObject.eventLabel) {
                extendedDatalayerInfo[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.EVENT_LABEL] = errorObject.eventLabel;
            }

            this.addDigitalDataInfo(extendedDatalayerInfo);
            this.sendDatalayerEvent(this.CkiDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        }
    };


    /**
     * removes the datalayer error attributes from datalayer object
     */
    removeDatalayerErrorAttrs = (): void => {
        /* INIT DELETE GA4 MIGRATION*/
        this.removeDatalayerObjects(this.DATALAYER_ERROR_ATTR);
        /* FINISH DELETE GA4 MIGRATION*/
        this.removeDigitalDataObjects(this.DATALAYER_ERROR_ATTR);
    };

    /**
     * sends datalayer event with the current datalayer info and the datalayer modal info
     * @param {Object} modalObject the modal object with its attributes ('idModal')
     */
    sendDatalayerModalEvent = (modalObject : CommonsDatalayerServiceTypes.ModalObjectDatalayer):void => {
        /* INIT DELETE GA4 MIGRATION*/
        const extendedDatalayerInfo = {};
        /* FINISH DELETE GA4 MIGRATION*/
        const extendedDigitalDataInfo = {};
        if (angular.isObject(modalObject)) {
            /* INIT DELETE GA4 MIGRATION*/
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.MODAL_ID] = modalObject.idModal || '""';
            this.addDataLayerInfo(extendedDatalayerInfo);
            /* FINISH DELETE GA4 MIGRATION*/
            // extendedDigitalDataInfo[this.CkiDatalayerConstants.DATALAYER_INFO.MODAL_ID] = modalObject.idModal || '""';
            this.addDigitalDataInfo(extendedDigitalDataInfo);
            this.sendDatalayerEvent(this.CkiDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        }
    };

    /**
     * removes the datalayer modal attributes from datalayer object
     */
    removeDatalayerModalAttrs = (): void => {
        /* INIT DELETE GA4 MIGRATION*/
        this.removeDatalayerObjects(this.DATALAYER_MODAL_ATTR);
        /* FINISH DELETE GA4 MIGRATION*/
        this.removeDigitalDataObjects(this.DATALAYER_MODAL_ATTR);
    };

    /**
     * Extends the current datalayer ecommerce information with the received info
     * @param {Object} datalayerInfo the information to extend current datalayer ecommerce info
     */
    addDataLayerEcommerceInfo = (datalayerInfo: object): void => {
        this.CkiDataLayerService.addDataLayerEcommerceInfo(datalayerInfo);
    };

    /**
     * Updates datalayer info with the nedded ancillaries information
     * @param updatePrices
     * @param ancillariesAction
     * @param totalQuantityBaggage
     * @param {Integer} baggagesPrice the total baggage price
     * @param totalQuantitySeats
     * @param {Integer} seatsPrice the total seat price
     * @param insuranceType
     * @param {Integer} insurancesPrice the total insurancesPrice
     * @param flexibilityPrice
     * @param totalQuantitySpeqs
     * @param speqsPrice
     */

    /**
     * updates the datalayer info with the flow init type
     * @param {String} initType the init type flow (locator or ibplus)
     */
    updateDatalayerInitType = (initType: string): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const extendedObject = {};
        extendedObject[this.CkiDatalayerConstants.DATALAYER_INFO.INIT_TYPE] = initType;
        this.addDataLayerInfo(extendedObject);
        /* FINISH DELETE GA4 MIGRATION*/

        const extendedDigitalDataInfo = {};
        extendedDigitalDataInfo[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.CHECKIN_BY] = initType;
        this.addDigitalDataInfo(extendedDigitalDataInfo);
    };

    /* INIT DELETE GA4 MIGRATION*/
    updateDatalayerForAncillaries = (
        updatePrices: boolean, ancillariesAction: string, totalQuantityBaggage: number,
        baggagesPrice: number, totalQuantitySeats: number, seatsPrice: number,
        insuranceType: string, insurancesPrice: number, flexibilityPrice: number, totalQuantitySpeqs: number,
        speqsPrice: number): void => {
        const extendedDatalayerInfo = {};
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_ACTION] = ancillariesAction;
        if (updatePrices) {
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.EVENT_CATEGORY] = this.CkiDatalayerConstants.DATALAYER_ANCILLARIES.ANCILLARIES;
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.EVENT_ACTION] = this.CkiDatalayerConstants.DATALAYER_EVENT_TYPES.CLICK;
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.EVENT_LABEL] = this.CkiDatalayerConstants.DATALAYER_LABEL.CONTINUAR;
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_SEATS] = totalQuantitySeats;
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_SEATS] = (seatsPrice > 0 ? this.CkiDatalayerConstants.DATALAYER_VALUES.YES + ' – ' + seatsPrice : this.CkiDatalayerConstants.DATALAYER_VALUES.NO);
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_PRICE_SEAT] = seatsPrice;
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_BAGGAGE] = totalQuantityBaggage;
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_BAGGAGES] = (baggagesPrice > 0 ? this.CkiDatalayerConstants.DATALAYER_VALUES.YES + ' – ' + baggagesPrice : this.CkiDatalayerConstants.DATALAYER_VALUES.NO);
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_PRICE_BAGGAGE] = baggagesPrice;
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_INSURANCE_TYPE] = insuranceType;
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_INSURANCES] = (insurancesPrice > 0 ? this.CkiDatalayerConstants.DATALAYER_VALUES.YES + ' – ' + insurancesPrice : this.CkiDatalayerConstants.DATALAYER_VALUES.NO);
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_FLEXIBILITY] = (flexibilityPrice > 0 ? this.CkiDatalayerConstants.DATALAYER_VALUES.YES + ' – ' + flexibilityPrice : this.CkiDatalayerConstants.DATALAYER_VALUES.NO);
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_SPEQS] = totalQuantitySpeqs;
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_SPEQS] = (speqsPrice > 0 ? this.CkiDatalayerConstants.DATALAYER_VALUES.YES + ' – ' + speqsPrice : this.CkiDatalayerConstants.DATALAYER_VALUES.NO);
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_PRICE_SPEQS] = speqsPrice;
        }
        this.addDataLayerInfo(extendedDatalayerInfo);
        this.localStorageService.set('confirmationDatalayerInfo', extendedDatalayerInfo);
    };
    /* FINISH DELETE GA4 MIGRATION*/
    addDigitalDataSeatsInfoByType (extendedDatalayerInfo, seatsByTypes, headerSeatName, seatsTotalDigitalDataName, seatsTotalPriceDigitalDataName) {
        const totalPrice = seatsByTypes.filter(seat => seat.type === headerSeatName).reduce((total, seat) => {
            return total + seat.amount;
        }, 0);
        const quanty = seatsByTypes.filter(seat => seat.type === headerSeatName).reduce((total, seat) => {
            return total + seat.quanty;
        }, 0);

        extendedDatalayerInfo[seatsTotalDigitalDataName]= quanty;
        extendedDatalayerInfo[seatsTotalPriceDigitalDataName]= totalPrice;

    }
    mapSeatsForDigitalData (headerModel, extendedDatalayerInfo) {
        const segments = headerModel.headerModel.shoppingBasket?.seats?.segments ?? [];
        const SI = this.CkiDatalayerConstants.DATALAYER_INFO.SEATSINFO;

        const seatsByTypes = segments.flatMap(segment => segment.seats);

        extendedDatalayerInfo[SI.SEATSTOTAL]      = seatsByTypes.reduce((sum, s) => sum + s.quanty, 0);
        extendedDatalayerInfo[SI.SEATSTOTALPRICE] = seatsByTypes.reduce((sum, s) => sum + s.amount, 0);

        for (const { format, totalKey, priceKey, matchEmpty } of SEAT_TYPE_MAP) {
            const hasType = seatsByTypes.some(seat => matchEmpty ? seat.type === '' : seat.type === format);
            if (hasType) {
                this.addDigitalDataSeatsInfoByType(extendedDatalayerInfo, seatsByTypes, format, totalKey, priceKey);
            }
        }
    }
    addDigitalDataBaggagesSpeqsInfoByType (extendedDatalayerInfo, ancillariesByTypes, headerAncillaryName, ancillaryTotalDigitalDataName, ancillaryTotalPriceDigitalDataName) {
        const totalPrice = ancillariesByTypes.filter(ancillary => ancillary.type === headerAncillaryName).reduce((total, ancillarie) => {
            return total + ancillarie.total;
        }, 0);
        const quanty = ancillariesByTypes.filter(ancillary => ancillary.type === headerAncillaryName).reduce((total, ancillarie) => {
            return total + ancillarie.quanty;
        }, 0);

        extendedDatalayerInfo[ancillaryTotalDigitalDataName]= quanty;
        extendedDatalayerInfo[ancillaryTotalPriceDigitalDataName]= totalPrice;
    }
    mapBaggagesForDigitalData (headerModel, extendedDatalayerInfo) {
        let baggagesByTypes = [];
        headerModel.headerModel.shoppingBasket?.baggages?.segments.map( segment => {
            segment.baggages.forEach(
                baggage =>
                    baggagesByTypes.push(baggage));
        });
        const baggagesTotalPrice = headerModel.headerModel.shoppingBasket?.baggages?.total.total;
        const baggagesTotalQuanty = baggagesByTypes.reduce((suma, objeto) => {return suma + objeto.quanty;}, 0);

        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESTOTAL]= baggagesTotalQuanty;
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESTOTALPRICE]= baggagesTotalPrice;

        if(headerModel.headerModel.shoppingBasket?.baggages?.segments.some((segment) => segment.baggages.some((baggage) => baggage.type === this.CkiDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_15))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, baggagesByTypes, this.CkiDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_15, this.CkiDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE15.BAGGAGES15TOTAL, this.CkiDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE15.BAGGAGES15PRICE);
        }if(headerModel.headerModel.shoppingBasket?.baggages.segments.some((segment) => segment.baggages.some((baggage) => baggage.type === this.CkiDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_23))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, baggagesByTypes, this.CkiDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_23, this.CkiDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE23.BAGGAGES23TOTAL, this.CkiDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE23.BAGGAGES23PRICE);
        }if(headerModel.headerModel.shoppingBasket?.baggages.segments.some((segment) => segment.baggages.some((baggage) => baggage.type === this.CkiDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_32))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, baggagesByTypes, this.CkiDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_32, this.CkiDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE32.BAGGAGES32TOTAL, this.CkiDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE32.BAGGAGES32PRICE);
        }
    }

    mapSpeqsForDigitalData (headerModel, extendedDatalayerInfo) {
        let speqsByTypes = [];
        headerModel.headerModel.shoppingBasket?.speqs?.segments.map( segment => {
            segment.speqs.forEach(
                speqs =>
                    speqsByTypes.push(speqs));
        });
        const speqsTotalPrice = headerModel.headerModel.shoppingBasket?.speqs?.total.total;
        const speqsTotalQuanty = speqsByTypes.reduce((suma, objeto) => {return suma + objeto.quanty;}, 0);
        //TODO: Haz un flujo y mira el nombre de los campos de los speqs en el objeto HeaderModel para ponerlo en las constantes.
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSTOTAL]= speqsTotalQuanty;
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSTOTALPRICE]= speqsTotalPrice;

        if(headerModel.headerModel.shoppingBasket?.speqs?.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.BICYCLE))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.BICYCLE, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.BICYCLE.SPEQSBICYCLETOTAL, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.BICYCLE.SPEQSBICYCLEPRICE);
        }if(headerModel.headerModel.shoppingBasket?.speqs?.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SURFBOARD))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SURFBOARD, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SURFBOARD.SPEQSSURFBOARDTOTAL, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SURFBOARD.SPEQSSURFBOARDPRICE);
        }if(headerModel.headerModel.shoppingBasket?.speqs?.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.GOLFEQUIPMENT))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.GOLFEQUIPMENT, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.GOLF_EQUIPMENT.SPEQSGOLFEQUIPMENTTOTAL, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.GOLF_EQUIPMENT.SPEQSGOLFEQUIPMENTPRICE);
        }if(headerModel.headerModel.shoppingBasket?.speqs?.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SKISNOW))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SKISNOW, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SKI_SNOW.SPEQSSKISNOWTOTAL, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SKI_SNOW.SPEQSSKISNOWPRICE);
        }if(headerModel.headerModel.shoppingBasket?.speqs?.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.FISHINGEQUIPMENT))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.FISHINGEQUIPMENT, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.FISHING_EQUIPMENT.SPEQSFISHINGEQUIPMENTTOTAL, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.FISHING_EQUIPMENT.SPEQSFISHINGEQUIPMENTPRICE);
        }if(headerModel.headerModel.shoppingBasket?.speqs?.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SCUBADIVING))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SCUBADIVING, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SCUBA_DIVING.SPEQSSCUBADIVINGTOTAL, this.CkiDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SCUBA_DIVING.SPEQSSCUBADIVINGPRICE);
        }
    }
    addDigitalDataFlexibilization (headerModel, extendedDatalayerInfo) {

        const flexibilityTotalPrice = headerModel.headerModel.shoppingBasket?.flexibilization?.info?.amount?.price;
        const flexibilityType = headerModel.headerModel.shoppingBasket?.flexibilization?.info?.type;

        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.FLEXIBILITY_INFO.FLEXIBILITY_TOTAL_PRICE]= flexibilityTotalPrice;
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.FLEXIBILITY_INFO.FLEXIBILTY_TYPE]= flexibilityType;
    }
    addDigitalDataInsurance (insuranceInfo, extendedDatalayerInfo) {
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.INSURANCE_POLICY] = insuranceInfo?.info?.offer;
    }
    addDigitalDataInsuranceAllianz (insuranceInfo: InsuranceAllianzFusionInfo, extendedDatalayerInfo: any) {
        let insuranceType = '';
        switch (insuranceInfo.code) {
                case this.CkiDatalayerConstants.ALLIANZ_FUSION_CODES.ASISTANCE_INSURANCE:
                    insuranceType = 'Asistencia';
                    break;
                case  this.CkiDatalayerConstants.ALLIANZ_FUSION_CODES.CANCEL_INSURANCE:
                    insuranceType = 'Anulacion';
                    break;
                case this.CkiDatalayerConstants.ALLIANZ_FUSION_CODES.TOTAL_INSURANCE:
                    insuranceType = 'Asistencia y Anulacion';
                    break;
        }
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.INSURANCE_TYPE] = insuranceType;
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.INSURANCE_TOTAL_PRICE] = insuranceInfo.total.total;
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.INSURANCE_POLICY] = insuranceInfo.info.description;
    }
    cleanDigitalDataParametersFromIncludesString (stringIncludesToDeleteInDigitalData) {
        const confirmationDigitalInfo = this.localStorageService.get('confirmationDigitalInfo');
        if(confirmationDigitalInfo) {
            const digitalInfoAsArray = Object.entries(confirmationDigitalInfo);
            const digitalDataFiltered = digitalInfoAsArray.filter(([key, value]) => (key.includes(stringIncludesToDeleteInDigitalData)));
            const digitalDataKeys = digitalDataFiltered.map( (element => element[0]));
            const dataDeleteDigitalData = digitalDataKeys.filter(elementToFilter => elementToFilter.includes(stringIncludesToDeleteInDigitalData));

            this.CkiDigitalDataService.removeDigitalDataInfo(dataDeleteDigitalData);
        }
    }
    /* FINISH DELETE GA4 MIGRATION*/

    private getAncShoppingBasket = (shoppingBasket: ShoppingBasket): AncillariesContext => {
        return {
            insurancePrice: shoppingBasket?.insurance?.total?.total,
            hasSeats: !!shoppingBasket?.seats?.hasSeats,
            hasBaggage: !!shoppingBasket?.baggages?.hasBaggage,
            hasSpeqs: !!shoppingBasket?.speqs?.hasSpeqs,
            hasFlexibilization: !!shoppingBasket?.flexibilization?.hasFlexibilization,
            hasInsurance: !!shoppingBasket?.insurance?.hasInsurance,
            hasInsuranceAllianzFusion: !!shoppingBasket?.insuranceAllianzFusionInfo?.hasInsuranceAllianzFusion,
            hasGlobickActivities: !!shoppingBasket?.globickActivities?.hasActivitiesGlobick,
            hasGlobickTransfer: !!shoppingBasket?.globickTransfers?.hasTransfersGlobick
        };
    };

    private updateDigitalDataForAncillaries = (
        updatePrices: boolean, 
        headerModel: HeaderModelLocalstorage, 
        insuranceType
    ): void => {
        const selectedInsurance: any = this.localStorageService.get('insuranceSelected');
        const shoppingBasket = headerModel.headerModel.shoppingBasket;
        const {
            insurancePrice,
            hasSeats,
            hasBaggage,
            hasSpeqs,
            hasFlexibilization,
            hasInsurance,
            hasInsuranceAllianzFusion,
            hasGlobickActivities,
            hasGlobickTransfer
        } = this.getAncShoppingBasket(shoppingBasket);
        let extendedDatalayerInfo = {};

        this.cleanParametersDigitalData(['Seats', 'Baggages', 'Speqs', 'flexibility', 'Insurance', 'Globick']);
        const dataInsurance = this.getDatalayerInfoInsurance({updatePrices, insuranceType, insurancePrice, provider: selectedInsurance?.provider});
        extendedDatalayerInfo = {...extendedDatalayerInfo, ...dataInsurance};

        if (hasSeats) this.mapSeatsForDigitalData(headerModel, extendedDatalayerInfo);
        if (hasBaggage) this.mapBaggagesForDigitalData(headerModel, extendedDatalayerInfo);
        if (hasSpeqs) this.mapSpeqsForDigitalData(headerModel, extendedDatalayerInfo);
        if (hasFlexibilization) this.addDigitalDataFlexibilization(headerModel, extendedDatalayerInfo);
        if (hasInsurance) this.addDigitalDataInsurance(shoppingBasket?.insurance, extendedDatalayerInfo);
        if (hasInsuranceAllianzFusion) {
            this.addDigitalDataInsuranceAllianz(shoppingBasket?.insuranceAllianzFusionInfo, extendedDatalayerInfo);
            this.addDigitalDataAllianzFusion(extendedDatalayerInfo, headerModel);
        } 
        if (hasGlobickActivities)this.addDigitalDataGlobickActivities(headerModel, extendedDatalayerInfo);
        if (hasGlobickTransfer) this.addDigitalDataGlobickTransfer(headerModel, extendedDatalayerInfo);

        this.addDigitalDataInfo(extendedDatalayerInfo);
        this.localStorageService.set('confirmationDigitalInfo', extendedDatalayerInfo);
    };

    private getDatalayerInfoInsurance = ({
        updatePrices,
        insuranceType,
        insurancePrice,
        provider
    }: DatalayerInfoInsurance) => {
        const { INSURANCE_TYPE, INSURANCE_TOTAL_PRICE, INSURANCE_PROVIDER } = this.CkiDatalayerConstants.DATALAYER_INFO;
        const extendedDatalayerInfo = {};

        if (updatePrices && insuranceType) {
            extendedDatalayerInfo[INSURANCE_TYPE] = insuranceType;
            extendedDatalayerInfo[INSURANCE_TOTAL_PRICE] = insurancePrice;
            extendedDatalayerInfo[INSURANCE_PROVIDER] = provider;
        }

        return extendedDatalayerInfo;
    };

    private cleanParametersDigitalData = (parameters: string[]) => {
        parameters.forEach((param) => this.cleanDigitalDataParametersFromIncludesString(param));
    };

    /**
     * Reset Datalayer ibcose
     */
    resetDatalayer = (): void => {
        const removeProps = (objData: object, propsNoRemove: string[], isDatalayer: boolean = false) => {
            const constants = isDatalayer ? this.CkiDatalayerConstants.DATALAYER_INFO : this.CkiDatalayerConstants.DIGITAL_DATA_INFO;
            const propsNoRemoveFilter = [];
            propsNoRemove.forEach(item => {
                if (constants[item]) propsNoRemoveFilter.push(constants[item]);
            });
            const propsObjData = Object.keys(objData);
            const arrPropsRemove = propsObjData.filter(prop => !propsNoRemoveFilter.includes(prop));

            arrPropsRemove.forEach(prop => delete objData[prop]);

            return objData;
        };

        /* INIT DELETE GA4 MIGRATION*/
        const datalayerPropsInit = ['LANGUAGE', 'MARKET', 'WEB_VERSION', 'WEB_MODE', 'INIT_TYPE', 'QUADRIGAM', 'CODE', 'USER_STATE', 'PROCESS', 'STEP', 'DYNAMIC_PRICING_SEAT'];
        let datalayerGeneral = this.CkiDataLayerService.getDatalayerGeneral();
        datalayerGeneral = removeProps(datalayerGeneral, datalayerPropsInit, true);
        this.CkiDataLayerService.resetDatalayer(datalayerGeneral);
        /* FINISH DELETE GA4 MIGRATION*/
        const digitalDataPropsInit = ['LANGUAGE', 'MARKET', 'WEB_VERSION', 'WEB_MODE', 'CHECKIN_BY', 'QUADRIGAM', 'CODE', 'USER_STATE', 'PROCESS', 'STEP'];
        let digitalData = this.CkiDigitalDataService.getDigitalData();
        digitalData = removeProps(digitalData, digitalDataPropsInit);
        this.CkiDigitalDataService.resetDigitalData(digitalData);
    };

    private applyFilters (value: string): string {
        return this.$filter('EliminateHyphenFilter')(this.$filter('EliminateAccentFilter')(value));
    }

    /**
     * Update datalayer (digitalData) event   
     * @param eventCategory 
     * @param eventAction 
     * @param eventLabel 
     * @param eventName 
     */
    updateDatalayerEvent = (eventCategory: string, eventAction: string, eventLabel: string, eventName: string = ''): void => {
        const {EVENT_CATEGORY, EVENT_ACTION, EVENT_LABEL, EVENT_NAME, EVENT_NAME_INTERACTION} = this.CkiDatalayerConstants.DIGITAL_DATA_INFO;
        const extendedDigitalDataInfo = {
            [EVENT_NAME]: this.applyFilters(eventName),
            [EVENT_LABEL]: this.applyFilters(eventLabel),
            [EVENT_CATEGORY]: this.applyFilters(eventCategory),
            [EVENT_ACTION]: this.applyFilters(eventAction)
        };
        this.CkiDigitalDataService.emitEvent(EVENT_NAME_INTERACTION, extendedDigitalDataInfo);
        
        this.MonetateUtilsService.updateDigitalDataMonetate();
        this.$timeout(() => this.$rootScope.$broadcast('sendUpdateToMonetate'));
    };

    updateDatalayerViewEvent = (): void => {
        this.CkiDigitalDataService.emitViewEvent();
    };

    /**
     * Generates datalayer for confirmation page (ONHOLD / NORMAL)
     * @param {Obj} confirmData the confirmation data
     * @returns {Obj} returns object with confirmation datalayer info
     */
    generateDatalayerConfirmation = (confirmData): void => {
        const getSliceData = (slices) => {
            const sliceData = {
                claseReserva: '',
                departureDates: { depDate: '', depTime: '' },
                tipoVuelo: '',
                fareFamily: '',
                OperadoraVuelo: '',
                estanciaDestino: ''
            };
            let returnFare = '';
            const slicesArray = Object.keys(slices);

            if (slicesArray.length === 2) {
                sliceData.tipoVuelo = this.CkiDatalayerConstants.FLIGHT_CODE_TYPE.ROUND_TRIP;
            } else if (slicesArray.length < 2) {
                sliceData.tipoVuelo = this.CkiDatalayerConstants.FLIGHT_CODE_TYPE.ONE_WAY;
            } else {
                sliceData.tipoVuelo = this.CkiDatalayerConstants.FLIGHT_CODE_TYPE.MULTI_TRAJECT;
            }

            const initDate = dayjs(slices[slicesArray[0]].departureDateParsed.originalDate);
            const endDate = dayjs(slices[slicesArray[slicesArray.length - 1]].departureDateParsed.originalDate);
            sliceData.estanciaDestino = endDate.diff(initDate, 'days') as unknown as string;


            for (let fIndex = 0; fIndex < slicesArray.length; fIndex++) {

                if (slicesArray.length > 2) {
                    sliceData.departureDates.depTime += sliceData.departureDates.depTime.length === 0 ? slices[slicesArray[fIndex]].departureDateParsed.dateTime : '-' + slices[slicesArray[fIndex]].departureDateParsed.dateTime;
                } else {
                    sliceData.departureDates.depTime += sliceData.departureDates.depTime.length === 0 ? this.CkiDatalayerConstants.DATALAYER_VALUES.DEPARTURE + ':' + slices[slicesArray[fIndex]].departureDateParsed.dateTime : '-' + this.CkiDatalayerConstants.DATALAYER_VALUES.RETURN + ':' + slices[slicesArray[1]].departureDateParsed.dateTime;
                }

                sliceData.departureDates.depDate += fIndex === 0 ? slices[slicesArray[fIndex]].departureDateParsed.formatedDate : '-' + slices[slicesArray[fIndex]].departureDateParsed.formatedDate;

                for (let tIndex = 0; tIndex < slices[slicesArray[fIndex]].segments.length; tIndex++) {
                    if (slicesArray.length > 2) {
                        sliceData.fareFamily += sliceData.fareFamily.length === 0 ? slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily : '-' + slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily;
                    } else {
                        if (fIndex === 0) {
                            sliceData.fareFamily += sliceData.fareFamily.length === 0 ? this.CkiDatalayerConstants.DATALAYER_VALUES.DEPARTURE + ':' + slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily : '-' + slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily;
                        } else {
                            returnFare += returnFare.length === 0 ? ';' + this.CkiDatalayerConstants.DATALAYER_VALUES.RETURN + ':' + slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily : '-' + slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily;
                        }
                    }

                    sliceData.claseReserva += sliceData.claseReserva.length === 0 ? slices[slicesArray[fIndex]].segments[tIndex].cabin.code : '|' + slices[slicesArray[fIndex]].segments[tIndex].cabin.code;

                    sliceData.OperadoraVuelo += sliceData.OperadoraVuelo.length === 0 ? slices[slicesArray[fIndex]].segments[tIndex].flight.operationalCarrier.code : '-' + slices[slicesArray[fIndex]].segments[tIndex].flight.operationalCarrier.code;

                }
                sliceData.fareFamily += returnFare;
            }

            return sliceData;
        };
        const getPassengerData = (pax) => {
            const paxData = {
                number: null,
                fFliyer: this.CkiDatalayerConstants.DATALAYER_VALUES.NO,
                types: '',
                precioPax: ''
            };
            let paxFare, paxTax, paxTPrice = 0;

            for (const p in pax) {

                paxFare = confirmData.generalInfo.passengerPrices[pax[p].type].fare;
                paxTax = confirmData.generalInfo.passengerPrices[pax[p].type].tax;
                paxTPrice = Math.round((paxFare + paxTax) * 100) / 100;
                paxData.precioPax += paxData.precioPax.length === 0 ? paxTPrice : ':' + paxTPrice;

                if (paxData.types.indexOf(pax[p].type) < 0) {
                    paxData.types += paxData.types.length === 0 ? this.CkiDatalayerConstants.DATALAYER_PASSENGER_TYPES[pax[p].type] : '|' + this.CkiDatalayerConstants.DATALAYER_PASSENGER_TYPES[pax[p].type];
                }
                if (pax[p].type !== 'INFANT') {
                    paxData.number = paxData.number ? paxData.number += 1 : 1;
                    if (pax[p].loyaltyCard !== 'PASSENGER_INFO_NO_LOYALTY_CARD') {
                        paxData.fFliyer = this.CkiDatalayerConstants.DATALAYER_VALUES.YES;
                    }
                }
            }
            return paxData;
        };
        const paxData = getPassengerData(confirmData.generalInfo.passengerInfo), sliceData = getSliceData(confirmData.generalInfo.flightInfo);
        const confDataLayer:CommonsDatalayerServiceTypes.ConfDataLayer = {
            antelacionCompra: '',
            claseReserva: sliceData.claseReserva,
            estanciaDestino: sliceData.estanciaDestino,
            fecha: sliceData.departureDates.depDate,
            horarioVuelo: sliceData.departureDates.depTime,
            moneda: confirmData.generalInfo.orderPrice.currency,
            nombreTarifas: sliceData.fareFamily,
            numeroPax: confirmData.generalInfo.passengersNumber,
            operadoraVuelo: sliceData.OperadoraVuelo,
            partnerLink: '',
            precioPax: paxData.precioPax,
            precioTotal: confirmData.generalInfo.orderPrice.total,
            precioTotalSinTasas: confirmData.generalInfo.orderPrice.fare,
            tarifaBarata: sliceData.claseReserva.indexOf('R') > -1 ? this.CkiDatalayerConstants.DATALAYER_VALUES.YES : this.CkiDatalayerConstants.DATALAYER_VALUES.NO,
            tipoPax: paxData.types,
            tipoVuelo: sliceData.tipoVuelo,
            titularIberiaPlus: paxData.fFliyer,
            trayectoBuscado: confirmData.generalInfo.origin.code + ',' + confirmData.generalInfo.destination.code,
            trayectoPais: confirmData.generalInfo.origin.city.countryCode + '-' + confirmData.generalInfo.destination.city.countryCode
        };
        this.addDataLayerInfo(confDataLayer);
    };

    updateAircraft = (aircraft:CommonsDatalayerServiceTypes.AircraftDatalayer):void =>{
        /* INIT DELETE GA4 MIGRATION: CKI*/
        const extendedDatalayerInfo = {};
        if (angular.isObject(aircraft)) {
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.AIRCRAFT] = aircraft;
            this.addDataLayerInfo(extendedDatalayerInfo);
        }
        /* FINISH DELETE GA4 MIGRATION*/
    };

    updatePnr = (): void => {
        const pnr = this.localStorageService.get('PNR');

        /* INIT DELETE GA4 MIGRATION*/
        this.addDataLayerInfo({
            [this.CkiDatalayerConstants.PNR_INFO.PROVIDER]: '',
            [this.CkiDatalayerConstants.PNR_INFO.REFERENCE]: pnr
        });
        /* FINISH DELETE GA4 MIGRATION*/

        this.addDigitalDataInfo({
            [this.CkiDatalayerConstants.DIGITAL_DATA_INFO.REFERENCE]: pnr
        });
    };

    /**
     * Updates datalayer info with the nedded upgrade information
     * @param {Boolean} isOfferSelected true if the user has selected an offer
     * @param {Boolean} isUpgradeFree true if the upgrade shown is free
     * @param {Array<Object>} selectedOffer the selected offer data
     * @param {Boolean} upgradingAccepted true if the users accepted the upgrade
     * @param {String} currencySymbol the currency symbol (Ej: '€' )
     */
    updateDatalayerForUpgrade = (isOfferSelected, isUpgradeFree, selectedOffer, upgradingAccepted, currencySymbol): void => {
        let i:number, upgradeAmount = 0;
        let dataLayerBookingType = '';
        const extendedDatalayerInfo = {};
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.UPGRADE_SHOWN] = isUpgradeFree ?
            this.CkiDatalayerConstants.DATALAYER_VALUES.FREE : this.CkiDatalayerConstants.DATALAYER_VALUES.PAYMENT;
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.UPGRADE_SENT] = upgradingAccepted && isOfferSelected
            ? this.CkiDatalayerConstants.DATALAYER_VALUES.YES : this.CkiDatalayerConstants.DATALAYER_VALUES.NO;
        if (isOfferSelected) {
            for (i = 0; i < selectedOffer.length; i++) {
                if (selectedOffer[i] && selectedOffer[i].offerSegmentClasses[0] && selectedOffer[i].offerSegmentClasses[0].cabinClass
                && selectedOffer[i].offerSegmentClasses[0].cabinClass.type) {
                    const actualSegmentBookingType = selectedOffer[i].offerSegmentClasses[0].cabinClass.type.charAt(0);
                    dataLayerBookingType = dataLayerBookingType === '' || this.CkiDatalayerConstants.SEGMENT_CABIN_PRIORITY[dataLayerBookingType] > this.CkiDatalayerConstants.SEGMENT_CABIN_PRIORITY[actualSegmentBookingType]
                        ? actualSegmentBookingType : dataLayerBookingType;
                }
                upgradeAmount += selectedOffer[i].totalAmount;
            }
            extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.BOOKING_CLASS] = dataLayerBookingType;
        }
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.UPGRADE_TOTAL] = upgradeAmount + currencySymbol;
        this.addDataLayerInfo(extendedDatalayerInfo);
    };

    /**
     * Add hashEID to datalayer info
     */
    /* INIT DELETE GA4 MIGRATION*/
    addDatalayerInfoHashEID = (customerData): void => {
        if(angular.isDefined(customerData) && angular.isObject(customerData) && angular.isObject(customerData.personalInfo) && angular.isString(customerData.personalInfo.contactEmail)) {
            this.CommonsUtilService.sha256(customerData.personalInfo.contactEmail).then((hash) => {
                this.addDataLayerInfo({hashEID: hash});
            });
        }
    };
    /* FINISH DELETE GA4 MIGRATION*/
    addDigitalDataInfoHashEID = (customerData): void => {
        if(angular.isDefined(customerData) && angular.isObject(customerData) && angular.isObject(customerData.personalInfo) && angular.isString(customerData.personalInfo.contactEmail)) {
            this.CommonsUtilService.sha256(customerData.personalInfo.contactEmail).then((hash) => {
                this.addDigitalDataInfo({HashEID: hash});
            });
        }
    };

    updateDatalayerInfo = (quadrigam): void => {
        const userLogged = this.localStorageService.get('userLogged');
        /* INIT DELETE GA4 MIGRATION*/
        this.updateDatalayerWithQuadrigam(quadrigam, null, userLogged);
        this.sendDatalayerEvent(this.CkiDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        /* FIN DELETE GA4 MIGRATION*/

        this.updateDigitalDataWithQuadrigam(quadrigam, null, userLogged);
        this.updateDatalayerViewEvent();
        this.updateMonetate(quadrigam);
    };

    setProcessAndStep = (process: string, step: string, quadrigam?: string): void => {
        const quadrigamLocal: string = quadrigam ? quadrigam : '';
        const stepLocal: string = (this.CkiDatalayerConstants.DIGITAL_DATA_STEP[quadrigam]) ? this.CkiDatalayerConstants.DIGITAL_DATA_STEP[quadrigam] : step ? step : '';
        let processLocal: string = process ? process : '';

        /* INIT DELETE GA4 MIGRATION*/
        const extendedDatalayerInfo = {};
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.PROCESS] = processLocal;
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.STEP] = stepLocal;
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.QUADRIGAM] = quadrigamLocal;
        this.addDataLayerInfo(extendedDatalayerInfo);
        /* FIN DELETE GA4 MIGRATION*/

        const extendedDigitalDataInfo = {};
        extendedDigitalDataInfo[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.PROCESS] = processLocal;
        extendedDigitalDataInfo[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.STEP] = stepLocal;
        extendedDigitalDataInfo[this.CkiDatalayerConstants.DIGITAL_DATA_INFO.QUADRIGAM] = quadrigamLocal;
        this.addDigitalDataInfo(extendedDigitalDataInfo);
    };

    removeProcessAndStep = () => {
        /* INIT DELETE GA4 MIGRATION*/
        this.removeDatalayerObjects(this.DATALAYER_PROCESS_AND_STEP_ATTR);
        /* FINISH DELETE GA4 MIGRATION*/
        this.removeDigitalDataObjects(this.DIGITAL_DATA_PROCESS_AND_STEP_ATTR);
    };

    updateProcessAndStep = (flowsApp: string[], process: string[], step: string[], quadrigam:string[]) :void =>{
        const idFlowApp = flowsApp.findIndex(item => item === this.localStorageService.get('flowApp'));
        idFlowApp !== -1 ? this.setProcessAndStep(process[idFlowApp], step[idFlowApp], quadrigam[idFlowApp]):'';
    };

    private getUserState = (isUserLogged: boolean): string => {
        const userLogged: any = this.localStorageService.get('userLogged');
        const logged: CommonsDatalayerServiceTypes.LoggedDatalayer | null = this.localStorageService.get('EstadoUsuario');
        let userState: string = this.CkiDatalayerConstants.DATALAYER_USER_STATES.ANONYMOUS;
        if (isUserLogged) {
            if (!this.CommonsUserUtilsService.getUserRole()) {
                this.CommonsUtilService.getUserTypeByToken();
            }
            userState =
                this.CommonsUserUtilsService.isIbPlus()
                    ? (this.CommonsUserUtilsService.isSoftUser() ? this.CkiDatalayerConstants.DATALAYER_USER_STATES.LOGGED_FF_SOFT : this.CkiDatalayerConstants.DATALAYER_USER_STATES.LOGGED_FF_HARD)
                    : (this.CommonsUserUtilsService.isSoftUser() ? this.CkiDatalayerConstants.DATALAYER_USER_STATES.LOGGED_IB_SOFT : this.CkiDatalayerConstants.DATALAYER_USER_STATES.LOGGED_IB_HARD);
            if (logged && logged.loggedBy) {
                userState = (logged.loggedBy === 'email') ? this.CkiDatalayerConstants.DATALAYER_USER_STATES.LOGGED_MAIL : userState;
            } else {
                userState = (userLogged === this.CommonsConstants.LOGIN_ONB) ? this.CkiDatalayerConstants.DATALAYER_USER_STATES.LOGGED_ONB : userState;
            }
        } else {
            userState = this.CkiDatalayerConstants.DATALAYER_USER_STATES.ANONYMOUS;
        }

        return userState;
    };

    /**
     * Generates the confirmation info of datalayer and stores it in session storage
     * @param ancillariesAction
     */
    setAncillariesAction = (ancillariesAction: object): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const confirmationDatalayerInfo = this.localStorageService.get('confirmationDatalayerInfo') || {};
        confirmationDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.ANCILLARIES_ACTION] = ancillariesAction;
        this.localStorageService.set('confirmationDatalayerInfo', confirmationDatalayerInfo);
        /* FINISH DELETE GA4 MIGRATION*/
    };

    setAncillariesDatalayer = ():void =>{
        const quantyTotalAncillaries = () => {
            if (headerModel.headerModel.shoppingBasket?.baggages?.hasBaggage) {
                for (let i = 0; i < headerModel.headerModel.shoppingBasket.baggages?.segments.length; i++) {
                    for (let j = 0; j < headerModel.headerModel.shoppingBasket?.baggages?.segments[i].baggages.length; j++) {
                        totalQuantityBaggage += headerModel.headerModel.shoppingBasket?.baggages?.segments[i].baggages[j].quanty;
                    }
                }
            }
            if (headerModel.headerModel.shoppingBasket?.seats?.hasSeats) {
                for (let i = 0; i < headerModel.headerModel.shoppingBasket?.seats?.segments.length; i++) {
                    totalQuantitySeats += headerModel.headerModel.shoppingBasket?.seats?.segments[i].quanty;
                }
            }
            if (headerModel.headerModel.shoppingBasket.insurance?.hasInsurance) {
                insuranceType = headerModel.headerModel.shoppingBasket?.insurance?.info.type;
            }
            if (headerModel.headerModel.shoppingBasket?.speqs?.hasSpeqs) {
                for (let i = 0; i < headerModel.headerModel.shoppingBasket?.speqs?.segments.length; i++) {
                    for (let j = 0; j < headerModel.headerModel.shoppingBasket?.speqs?.segments[i].speqs.length; j++) {
                        totalQuantitySpeqs += headerModel.headerModel.shoppingBasket?.speqs?.segments[i].speqs[j].quanty;
                    }
                }
            }
        };
        const headerModel:HeaderModelLocalstorage = this.localStorageService.get('headerModel');
        let insuranceType = '',
            totalQuantitySeats = 0,
            totalQuantityBaggage = 0,
            totalQuantitySpeqs = 0;
        quantyTotalAncillaries();

        /* INIT DELETE GA4 MIGRATION*/
        this.updateDatalayerForAncillaries(
            true,
            this.CkiDatalayerConstants.DATALAYER_EVENT_TYPES.CLICK,
            totalQuantityBaggage,
            headerModel.headerModel.shoppingBasket?.baggages?.hasBaggage ? headerModel.headerModel.shoppingBasket?.baggages?.total.total : 0,
            totalQuantitySeats,
            headerModel.headerModel.shoppingBasket?.seats?.hasSeats ? headerModel.headerModel.shoppingBasket?.seats?.total.total : 0,
            insuranceType,
            headerModel.headerModel.shoppingBasket?.insurance?.hasInsurance ? headerModel.headerModel.shoppingBasket?.insurance?.total.total : 0,
            headerModel.headerModel.shoppingBasket?.flexibilization?.hasFlexibilization ? headerModel.headerModel.shoppingBasket?.flexibilization?.info.amount.price : 0,
            totalQuantitySpeqs,
            headerModel.headerModel.shoppingBasket?.speqs?.hasSpeqs ? headerModel.headerModel.shoppingBasket?.speqs?.total.total : 0
        );
        /* FINISH DELETE GA4 MIGRATION*/

        this.updateDigitalDataForAncillaries(
            true,
            headerModel,
            insuranceType
        );
    };

    updateDatalayerEvents = (eventCategory: string, eventAction: string, eventLabel: string, eventName: string = ''): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const extendedDatalayerInfo = {
            [this.CkiDatalayerConstants.DATALAYER_INFO.EVENT_CATEGORY]: this.applyFilters(eventCategory),
            [this.CkiDatalayerConstants.DATALAYER_INFO.EVENT_ACTION]: this.applyFilters(eventAction),
            [this.CkiDatalayerConstants.DATALAYER_INFO.EVENT_LABEL]: this.applyFilters(eventLabel)
        };
        this.addDataLayerInfo(extendedDatalayerInfo);
        /* FINISH DELETE GA4 MIGRATION*/

        this.updateDatalayerEvent(eventCategory, eventAction, eventLabel, eventName);
    };

    updateDatalayerAndDontSend = (eventCategory:string, eventAction:string, eventLabel:string, eventName: string = ''): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const extendedDatalayerInfo = {};
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.EVENT_CATEGORY] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventCategory));
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.EVENT_ACTION] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventAction));
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.EVENT_LABEL] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventLabel));
        this.addDataLayerInfo(extendedDatalayerInfo);
        /* FINISH DELETE GA4 MIGRATION*/
    };

    /**
     * @name updateDiscountData
     * @description This method is used to add discounts info to datalayer and digitalData
     * @param discountArray Array of discounts
     */
    updateDiscountData = (discountArray: discountAppliedResponse[] = []): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const extendedDatalayerDataInfo = { descuentosAplicados: '' };
        /* FINISH DELETE GA4 MIGRATION*/
        const extendedDigitalDataInfo = { DiscountsApplied: '' };
        const discountsToString = (acc: string, current: discountAppliedResponse): string => {
            let discString = current?.type??'';
            switch (current.type) {
                    case this.CommonsConstants.DISCOUNT_TYPE.CORPORATE:
                        if (current.discountType === 'ODM') {
                            discString += `_${current.discountType}`;
                        }
                        discString += `_${current.corporateCodes}`;
                        break;
                    case this.CommonsConstants.DISCOUNT_TYPE.RESIDENT:
                        discString += `_${current.discountCode}`;
                        break;
                    case this.CommonsConstants.DISCOUNT_TYPE.LARGE_FAMILY:
                        discString += `_${current.discountType}`;
                        break;
                    case this.CommonsConstants.DISCOUNT_TYPE.PARTNER:
                        discString += `_${current.partner.partnerId}`;
                        break;
                    default:
                        break;
            }

            return acc += acc.length === 0 ? discString : `|${discString}`;
        };
        if (Array.isArray(discountArray)) {
            const discountStr: string = discountArray.reduce(discountsToString, '');
            extendedDigitalDataInfo.DiscountsApplied = discountStr;
            extendedDatalayerDataInfo.descuentosAplicados = discountStr;
            /* INIT DELETE GA4 MIGRATION*/
            this.addDataLayerInfo(extendedDatalayerDataInfo);
            /* FINISH DELETE GA4 MIGRATION*/
            this.addDigitalDataInfo(extendedDigitalDataInfo);

        }
    };

    getItemCategory2 = (slice: any): string => {
        const segmentsInfo: any[] = this.localStorageService.get('segmentsInfo') || [];
        const splitId = slice?.id?.split('_') || [];
        let category2: string = '';

        const getDataSegmentsInfo = (seg) => {
            if(splitId.length === 2) {
                if (splitId[0] === seg?.id) category2 = `${seg.origin?.code}`;
                if (splitId[1] === seg?.id) category2 += `-${seg.destination?.code}`;
            }
        };

        segmentsInfo.forEach(getDataSegmentsInfo);
        return category2;
    };

    getItemCategory3 = (event: string, outboundRoute: string, id: string): string => {
        let result: string = 'all';
        const selectedTripInfo: CommonsSelectedTripInfoModel.SelectedTripInfoModel[] = this.localStorageService.get('selectedTripInfo');
        const multiCitySearch = this.localStorageService.get('multiCitySearch');
        const isEventBeginOrAdd: boolean = event === 'begin_checkout' || event === 'add_shipping_info';

        if(multiCitySearch) {
            result = '1';
        } else if(!isEventBeginOrAdd && selectedTripInfo) {
            selectedTripInfo.forEach((element, i) => {
                element?.info?.segments.forEach( segment => {
                    if(outboundRoute === `${segment?.departure?.code}-${segment?.arrival?.code}`) {
                        result = (i+1).toString();
                    }
                });
            });
        }

        if (!isEventBeginOrAdd && result === 'all' && id) {
            const arrId = id.split('|');
            arrId.forEach((element, i) => {
                if(outboundRoute === element) {
                    result = (i+1).toString();
                }
            });

            if(outboundRoute !== 'all' && result === 'all' && arrId.length === 1) {
                result = '1';
            }
        }

        return result;
    };

    private addDigitalDataAllianzFusion (extendedDatalayerInfo: any, headerModel: HeaderModelLocalstorage) {
        const policyAllianz: any = this.localStorageService.get('policyAllianz');
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.INSURANCE_TYPE] = headerModel.headerModel.shoppingBasket.insuranceAllianzFusionInfo?.info?.description;
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.INSURANCE_TOTAL_PRICE] = headerModel.headerModel.shoppingBasket.insuranceAllianzFusionInfo?.total?.total;
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.INSURANCE_POLICY] = policyAllianz;
    }

    private addDigitalDataGlobickActivities (headerModelStorage: any, extendedDatalayerInfo: any) {
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.GLOBICK_ACTIVITIES] = headerModelStorage.headerModel.shoppingBasket.globickActivities?.info?.description?.length;
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.GLOBICK_ACTIVITIES_TOTAL_PRICE] = headerModelStorage.headerModel.shoppingBasket.globickActivities?.total?.total;
    }

    private addDigitalDataGlobickTransfer (headerModelStorage: any, extendedDatalayerInfo: any) {
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.GLOBICK_TRANSFER] = headerModelStorage.headerModel.shoppingBasket.globickTransfers?.info?.transferCar;
        extendedDatalayerInfo[this.CkiDatalayerConstants.DATALAYER_INFO.GLOBICK_TRANSFER_TOTAL_PRICE] = headerModelStorage.headerModel.shoppingBasket.globickTransfers?.total?.total;
    }

    getTrackingCode (quadrigam: string): string {
        return `${this.LANG}/${this.MARKET}/${quadrigam?.replace(/\//g, '') ?? ''}`;
    }

    setTrackingCode (quadrigam: string) {
        const isUserLogged = this.localStorageService.get('userLogged') ?? false;
        this.CkiDataLayerService.setProcessAndStep(quadrigam);

        /* INIT DELETE GA4 MIGRATION*/
        const extendedObject = {};
        this.updateDatalayerWithQuadrigam(quadrigam, extendedObject, isUserLogged);
        /* FIN DELETE GA4 MIGRATION*/
        const extendedDigitalDataInfo = {};
        this.updateDigitalDataWithQuadrigam(quadrigam, extendedDigitalDataInfo, isUserLogged);

        this.updateMonetate(quadrigam);
    }

    updateMonetate = (quadrigam: string) => {
        this.MonetateUtilsService.updateMonetateWithQuadrigam(this.MonetateConstants.MONETATE_INFO.SETPAGETYPE, quadrigam);
        this.$timeout(() => {
            /* INIT DELETE GA4 MIGRATION*/
            this.$rootScope.$broadcast('updateDatalayer');
            /* FIN DELETE GA4 MIGRATION*/
            this.$rootScope.$broadcast('updateDigitalData');
            this.$rootScope.$broadcast('sendUpdateToMonetate');
        });
    };
}
