import * as angular from 'angular';
import dayjs from 'dayjs';
import {CommonsUtilService} from '../../utils/ib-commons-utils-service';
import {DatalayerConstantsType} from '../ib-datalayer-constants';
import {DataLayerService} from './ib-datalayer-service';
import {CommonsUserUtilsService} from '../../utils/ib-commons-user-utils.service';
import {MonetateUtilsService} from '../../ib-monetate/services/ib-monetate-utils';
import {CommonsConstantsType} from '../../constants/ib-commons-constants';
import { DigitalDataService } from './ib-digital-data-service';
import { DatalayerGeneralConstantsType } from '../constants/ib-datalayer-general-constants';
import { DatalayerBKIConstantsType } from '../constants/ib-datalayer-bki-constants';
import { DatalayerCKIConstantsType } from '../constants/ib-datalayer-cki-constants';
import { DatalayerMMBConstantsType } from '../constants/ib-datalayer-mmb-constants';
import {CommonsSessionStorageService} from 'ib-web-commons/utils';

@Service('ib-datalayer-module', ['DataLayerService', 'DatalayerConstants', '$rootScope', '$timeout', 'CommonsConstants',
    'localStorageService', 'CommonsUtilService', '$filter', 'CommonsUserUtilsService', 'MonetateUtilsService',
    'DigitalDataService', 'DatalayerGeneralConstants', 'DatalayerBKIConstants', '$cookies', 'DatalayerCKIConstants', 'DatalayerMMBConstants', 'CommonsSessionStorageService' ], ['ib-commons-constants-module', 'ib-monetate-module'])
export class DatalayerUtilsService {
    public DATALAYER_ERROR_ATTR: string[] = [this.DatalayerConstants.DATALAYER_INFO.ERROR_CODE, this.DatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION, this.DatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE];
    public DATALAYER_MODAL_ATTR: string[] = [this.DatalayerConstants.DATALAYER_INFO.MODAL_ID];
    public LANG: string;
    public MARKET: string;
    constructor (
        private DataLayerService: DataLayerService,
        private DatalayerConstants: DatalayerConstantsType,
        private $rootScope: CommonsRootScope,
        private $timeout: ng.ITimeoutService,
        private CommonsConstants: CommonsConstantsType,
        private localStorageService: ng.local.storage.ILocalStorageService,
        private CommonsUtilService: CommonsUtilService,
        private $filter: ng.FilterFactory,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private MonetateUtilsService: MonetateUtilsService,
        private DigitalDataService: DigitalDataService,
        private DatalayerGeneralConstants: DatalayerGeneralConstantsType,
        private DatalayerBKIConstants: DatalayerBKIConstantsType,
        private $cookies: angular.cookies.ICookiesService,
        private DatalayerCKIConstants: DatalayerCKIConstantsType,
        private DatalayerMMBConstants: DatalayerMMBConstantsType,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {
    }
    /**
     * Initialize the datalayer object
     */
    initializeDatalayer = (language: string, market: string, deviceType: string): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const initialDatalayer = {};
        if (!this.DataLayerService.isDatalayerInit()) {
            this.LANG = language;
            this.MARKET = market;
            initialDatalayer[this.DatalayerConstants.DATALAYER_INFO.LANGUAGE] = language;
            initialDatalayer[this.DatalayerConstants.DATALAYER_INFO.MARKET] = market;
            initialDatalayer[this.DatalayerConstants.DATALAYER_INFO.WEB_VERSION] = this.DatalayerConstants.DATALAYER_VALUES.WEB_VERSION;
            initialDatalayer[this.DatalayerConstants.DATALAYER_INFO.WEB_MODE] = deviceType;
            this.DataLayerService.initDatalayer(initialDatalayer, {});
        }
        /* FINISH DELETE GA4 MIGRATION*/
        const initialDigitalData = {};
        if (!this.DigitalDataService.isDigitalDataInit()) {
            this.LANG = language;
            this.MARKET = market;
            initialDigitalData[this.DatalayerGeneralConstants.LANGUAGE] = language;
            initialDigitalData[this.DatalayerGeneralConstants.MARKET] = market;
            initialDigitalData[this.DatalayerGeneralConstants.WEB_VERSION] = this.DatalayerConstants.DATALAYER_VALUES.WEB_VERSION;
            initialDigitalData[this.DatalayerGeneralConstants.WEB_MODE] = deviceType;
            this.DigitalDataService.initDigitalData(initialDigitalData);
        }
    };

    /**
     * Set the initial params of the datalayer object at availability
     */
    setDatalayerAvailabilityInitialParams = (language: string, market: string, deviceType: string): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const initialDatalayer = {};
        this.LANG = language;
        this.MARKET = market;
        initialDatalayer[this.DatalayerConstants.DATALAYER_INFO.LANGUAGE] = language;
        initialDatalayer[this.DatalayerConstants.DATALAYER_INFO.MARKET] = market;
        initialDatalayer[this.DatalayerConstants.DATALAYER_INFO.WEB_VERSION] = this.DatalayerConstants.DATALAYER_VALUES.WEB_VERSION;
        initialDatalayer[this.DatalayerConstants.DATALAYER_INFO.WEB_MODE] = deviceType;
        this.addDataLayerInfo(initialDatalayer);
        /* FINISH DELETE GA4 MIGRATION*/
        const initialDigitalData = {};
        this.LANG = language;
        this.MARKET = market;
        initialDigitalData[this.DatalayerGeneralConstants.LANGUAGE] = language;
        initialDigitalData[this.DatalayerGeneralConstants.MARKET] = market;
        initialDigitalData[this.DatalayerGeneralConstants.WEB_VERSION] = this.DatalayerConstants.DATALAYER_VALUES.WEB_VERSION;
        initialDigitalData[this.DatalayerGeneralConstants.WEB_MODE] = deviceType;
        this.addDigitalDataInfo(initialDigitalData);
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
            /* INIT DELETE GA4 MIGRATION*/
            this.DataLayerService.callUpdateTagManager(type);
        }
    };

    /**
     * Extends the current datalayer information with the received info
     * @param {Object} datalayerInfo the information to extend current general datalayer info
     */
    /* INIT DELETE GA4 MIGRATION*/
    addDataLayerInfo = (datalayerInfo: object): void => {
        this.DataLayerService.addDataLayerGeneralInfo(datalayerInfo);
    };
    /* FINISH DELETE GA4 MIGRATION*/
    addDigitalDataInfo = (datalayerInfo: object): void => {
        this.DigitalDataService.addDigitalDataInfo(datalayerInfo);
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
            userSegment = this.DatalayerConstants.DATALAYER_USER_LEVELS[userLevel.toUpperCase()] || 0;

            if (this.CommonsUserUtilsService.isUserLoggedONB() && typeof membershipData?.clid === 'string') {
                userId = membershipData.clid;
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
                    extendDatalayer[this.DatalayerConstants.DATALAYER_INFO.HASH_EMAIL] = hashEID;
                    this.addDataLayerInfo(extendDatalayer);
                });
            }

            if(userLevel) extendDatalayer[this.DatalayerConstants.DATALAYER_INFO.USER_LEVEL] = userLevel;
            if(userId) extendDatalayer[this.DatalayerConstants.DATALAYER_INFO.USER_ID] = userId;
            extendDatalayer[this.DatalayerConstants.DATALAYER_INFO.AVIOS_COINS] = aviosCoins;
            extendDatalayer[this.DatalayerConstants.DATALAYER_INFO.USER_AVIOS] = aviosCoins;
            extendDatalayer[this.DatalayerConstants.DATALAYER_INFO.HASH_EMAIL] = hashEID;
            extendDatalayer[this.DatalayerConstants.DATALAYER_INFO.USER_SEGMENT] = userSegment;

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
            userSegment = this.DatalayerConstants.DATALAYER_USER_LEVELS[userLevel.toUpperCase()] || 0;

            if (this.CommonsUserUtilsService.isUserLoggedONB() && typeof membershipData?.clid === 'string') {
                userId = membershipData.clid;
            } else {
                /* Despite the name it obtains the account identifier of IB0 too */
                const identifier = this.CommonsUserUtilsService.getFrequentFlyer();
                if (identifier !== 'NOT_FOUND') userId = identifier;
            }

            if (customerData.hashEID) {
                hashEID = customerData.hashEID;
                extendDatalayer[this.DatalayerGeneralConstants.HASH_EMAIL] = hashEID;
                this.addDigitalDataInfo(extendDatalayer);
            } else if(angular.isString(customerData.email)) {
                this.CommonsUtilService.sha256(customerData.email).then((hash) => {
                    hashEID = hash;
                    extendDatalayer[this.DatalayerGeneralConstants.HASH_EMAIL] = hashEID;
                    this.addDigitalDataInfo(extendDatalayer);
                });
            }

            if(userLevel) extendDatalayer[this.DatalayerGeneralConstants.USER_LEVEL] = userLevel;
            if(userId) extendDatalayer[this.DatalayerGeneralConstants.USER_ID] = userId;
            if(hashEID) extendDatalayer[this.DatalayerGeneralConstants.HASH_EMAIL] = hashEID;
            extendDatalayer[this.DatalayerGeneralConstants.AVIOS_COINS] = aviosCoins;
            extendDatalayer[this.DatalayerGeneralConstants.USER_AVIOS] = aviosCoins;
            extendDatalayer[this.DatalayerGeneralConstants.USER_SEGMENT] = userSegment;

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

    /* INIT DELETE GA4 MIGRATION */
    /**
     * Updates datalayer avios
     * @param {Object} avios the user logged generalInfo information for get avios user.
     */
    updateLoggedDatalayerAvios = (avios: string): void => {
        const extendDatalayer: object = {};
        if (avios) {
            extendDatalayer[this.DatalayerConstants.DATALAYER_INFO.AVIOS_COINS] = avios;
            this.addDataLayerInfo(extendDatalayer);
        }
    };
    /* FINISH DELETE GA4 MIGRATION */

    /**
     * Updates digital data avios
     * @param {Object} avios the user logged generalInfo information for get avios user.
     */
    updateLoggedDigitalDataAvios = (avios: string): void => {
        const extendDigitalData: object = {};
        if (avios) {
            extendDigitalData[this.DatalayerGeneralConstants.AVIOS_COINS] = avios;
            this.addDigitalDataInfo(extendDigitalData);
        }
    };


    /**
     * Generates a datalayer String for Teleaf analytics
     * @return a String with the whole current datalayer info in a well formed structure for teleaf
     */
    generateDatalayerDOM = () => {
        let datalayerDOM: string = '<script type="text/javascript">';
        const datalayer_general = this.DataLayerService.getDatalayerGeneral();
        const datalayer_ecommerce = this.DataLayerService.getEcommerceDatalayer();
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
        const digital_data = this.DigitalDataService.getDigitalData();
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
     * @param {Array<String>} datalayerAttributtes an array with the String name of the attributes to be removed from datalager
     */
    /* INIT DELETE GA4 MIGRATION*/
    removeDatalayerObjects = (datalayerAttributtes: object): void => {
        this.DataLayerService.removeDatalayerGeneralInfo(datalayerAttributtes);
    };
    /* FINISH DELETE GA4 MIGRATION*/
    removeDigitalDataObjects = (datalayerAttributtes: object): void => {
        this.DigitalDataService.removeDigitalDataInfo(datalayerAttributtes);
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
            extendDatalayer[this.DatalayerConstants.DATALAYER_INFO.QUADRIGAM] = quadrigam;
            extendDatalayer[this.DatalayerConstants.DATALAYER_INFO.CODE] = `${this.LANG}/${this.MARKET}/${quadrigam}`;
        }

        extendDatalayer[this.DatalayerConstants.DATALAYER_INFO.USER_STATE] = this.getUserState(isUserLogged);
        this.addDataLayerInfo(extendDatalayer);
    };
    /* FINISH DELETE GA4 MIGRATION*/
    updateDigitalDataWithQuadrigam = (quadrigam, extendedObject, isUserLogged) => {
        const extendDatalayer = {};

        if (angular.isObject(extendedObject) && extendedObject.eventCategory != 'ancillaries') {
            angular.extend(extendDatalayer, extendedObject);
        }

        if (angular.isString(quadrigam)) {
            extendDatalayer[this.DatalayerGeneralConstants.QUADRIGAM] = quadrigam.replace(/\//g, '');
            extendDatalayer[this.DatalayerGeneralConstants.CODE] = this.LANG + '/' + this.MARKET + '/' + quadrigam.replace(/\//g, '');
        }

        extendDatalayer[this.DatalayerGeneralConstants.USER_STATE] = this.getUserState(isUserLogged);
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
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE] =
                extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE] ?
                    `${extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE]}|${errorObject.internalErrorCode}` :
                    errorObject.internalErrorCode;
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ERROR_CODE] =
                extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ERROR_CODE] ?
                    `${extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ERROR_CODE]}|${errorObject.errorCode.toString()}` :
                    errorObject.errorCode.toString();
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION] =
                extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION] ?
                    `${extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION]}|${errorObject.message}` :
                    errorObject.message;
            if (errorObject.eventCategory) {
                extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.EVENT_CATEGORY] = errorObject.eventCategory;
            }
            if (errorObject.eventCategory) {
                extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.EVENT_ACTION] = errorObject.eventAction;
            }
            if (errorObject.eventLabel) {
                extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.EVENT_LABEL] = errorObject.eventLabel;
            }

            this.addDataLayerInfo(extendedDatalayerInfo);
            this.sendDatalayerEvent(this.DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        }
    };
    /* FINISH DELETE GA4 MIGRATION*/
    sendDigitalDataErrorEvent = (errorObject : CommonsDatalayerServiceTypes.ErrorObjectDatalayer) :void => {
        const extendedDatalayerInfo = {};
        if (angular.isObject(errorObject) && errorObject.errorCode) {
            if (errorObject.quadrigam) {
                this.updateDigitalDataWithQuadrigam(errorObject.quadrigam, null, errorObject.isLogged);
            }
            // extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE] =
            //     extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE] ?
            //         `${extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE]}|${errorObject.internalErrorCode}` :
            //         errorObject.internalErrorCode;
            // extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ERROR_CODE] =
            //     extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ERROR_CODE] ?
            //         `${extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ERROR_CODE]}|${errorObject.errorCode.toString()}` :
            //         errorObject.errorCode.toString();
            // extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION] =
            //     extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION] ?
            //         `${extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION]}|${errorObject.message}` :
            //         errorObject.message;
            if (errorObject.eventCategory) {
                extendedDatalayerInfo[this.DatalayerGeneralConstants.EVENT_CATEGORY] = errorObject.eventCategory;
            }
            if (errorObject.eventCategory) {
                extendedDatalayerInfo[this.DatalayerGeneralConstants.EVENT_ACTION] = errorObject.eventAction;
            }
            if (errorObject.eventLabel) {
                extendedDatalayerInfo[this.DatalayerGeneralConstants.EVENT_LABEL] = errorObject.eventLabel;
            }

            this.addDigitalDataInfo(extendedDatalayerInfo);
            this.sendDatalayerEvent(this.DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        }
    };

    sendDatalayerErrorCompleteEvent = (errorObject : CommonsDatalayerServiceTypes.ErrorObjectDatalayer):void =>{

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
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.MODAL_ID] = modalObject.idModal || '""';
            this.addDataLayerInfo(extendedDatalayerInfo);
            /* FINISH DELETE GA4 MIGRATION*/
            // extendedDigitalDataInfo[this.DatalayerConstants.DATALAYER_INFO.MODAL_ID] = modalObject.idModal || '""';
            this.addDigitalDataInfo(extendedDigitalDataInfo);
            this.sendDatalayerEvent(this.DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
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
        this.DataLayerService.addDataLayerEcommerceInfo(datalayerInfo);
    };

    /**
     * updates the datalayer info with the flow init type
     * @param {String} initType the init type flow (locator or ibplus)
     */
    updateDatalayerInitType = (initType: string): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const extendedObject = {};
        extendedObject[this.DatalayerConstants.DATALAYER_INFO.INIT_TYPE] = initType;
        this.addDataLayerInfo(extendedObject);
        /* FINISH DELETE GA4 MIGRATION*/

        const extendedDigitalDataInfo = {};
        extendedDigitalDataInfo[this.DatalayerCKIConstants.CHECKIN_BY] = initType;
        this.addDigitalDataInfo(extendedDigitalDataInfo);
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
    /* INIT DELETE GA4 MIGRATION*/
    updateDatalayerForAncillaries = (
        updatePrices: boolean, ancillariesAction: string, totalQuantityBaggage: number,
        baggagesPrice: number, totalQuantitySeats: number, seatsPrice: number,
        insuranceType: string, insurancesPrice: number, flexibilityPrice: number, totalQuantitySpeqs: number,
        speqsPrice: number): void => {
        const extendedDatalayerInfo = {};
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_ACTION] = ancillariesAction;
        if (updatePrices) {
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.EVENT_CATEGORY] = this.DatalayerConstants.DATALAYER_ANCILLARIES.ANCILLARIES;
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.EVENT_ACTION] = this.DatalayerConstants.DATALAYER_EVENT_TYPES.CLICK;
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.EVENT_LABEL] = this.DatalayerConstants.DATALAYER_LABEL.CONTINUAR;
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_SEATS] = totalQuantitySeats;
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_SEATS] = (seatsPrice > 0 ? this.DatalayerConstants.DATALAYER_VALUES.YES + ' – ' + seatsPrice : this.DatalayerConstants.DATALAYER_VALUES.NO);
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_PRICE_SEAT] = seatsPrice;
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_BAGGAGE] = totalQuantityBaggage;
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_BAGGAGES] = (baggagesPrice > 0 ? this.DatalayerConstants.DATALAYER_VALUES.YES + ' – ' + baggagesPrice : this.DatalayerConstants.DATALAYER_VALUES.NO);
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_PRICE_BAGGAGE] = baggagesPrice;
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_INSURANCE_TYPE] = insuranceType;
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_INSURANCES] = (insurancesPrice > 0 ? this.DatalayerConstants.DATALAYER_VALUES.YES + ' – ' + insurancesPrice : this.DatalayerConstants.DATALAYER_VALUES.NO);
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_FLEXIBILITY] = (flexibilityPrice > 0 ? this.DatalayerConstants.DATALAYER_VALUES.YES + ' – ' + flexibilityPrice : this.DatalayerConstants.DATALAYER_VALUES.NO);
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_SPEQS] = totalQuantitySpeqs;
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_SPEQS] = (speqsPrice > 0 ? this.DatalayerConstants.DATALAYER_VALUES.YES + ' – ' + speqsPrice : this.DatalayerConstants.DATALAYER_VALUES.NO);
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_PRICE_SPEQS] = speqsPrice;
        }
        this.addDataLayerInfo(extendedDatalayerInfo);
        this.localStorageService.set('confirmationDatalayerInfo', extendedDatalayerInfo);
        this.DataLayerService.callUpdateTagManager(this.DatalayerConstants.DATALAYER_EVENT_TYPES.LINK);
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
        let seatsByTypes = [];
        headerModel.headerModel.shoppingBasket.seats.segments.map( segment => {segment.seats.forEach(seat => seatsByTypes.push(seat));});
        const seatsTotalPrice = seatsByTypes.reduce((suma, objeto) => {return suma + objeto.amount;}, 0);
        const seatsTotalQuanty = seatsByTypes.reduce((suma, objeto) => {return suma + objeto.quanty;}, 0);

        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSTOTAL]= seatsTotalQuanty;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSTOTALPRICE]= seatsTotalPrice;

        if(headerModel.headerModel.shoppingBasket.seats?.segments.some((segment) => segment.seats.some((seat) => seat.type === this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.UPFRONT))) {
            this.addDigitalDataSeatsInfoByType(extendedDatalayerInfo, seatsByTypes, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.UPFRONT, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.UPFRONT.SEATSEUPFRONTTOTAL, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.UPFRONT.SEATSEUPFRONTPRICE);
        }if(headerModel.headerModel.shoppingBasket.seats.segments.some((segment) => segment.seats.some((seat) => seat.type === this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.EXTRA_SIZE))) {
            this.addDigitalDataSeatsInfoByType(extendedDatalayerInfo, seatsByTypes, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.EXTRA_SIZE, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.XL.SEATSXLTOTAL, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.XL.SEATSXLPRICE);
        }if(headerModel.headerModel.shoppingBasket.seats.segments.some((segment) => segment.seats.some((seat) => seat.type === this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.EMERGENCY))) {
            this.addDigitalDataSeatsInfoByType(extendedDatalayerInfo, seatsByTypes, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.EMERGENCY, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.EMERGENCY.SEATSEMERGENCYTOTAL, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.EMERGENCY.SEATSEMERGENCYPRICE);                
        }if(headerModel.headerModel.shoppingBasket.seats.segments.some((segment) => segment.seats.some((seat) => seat.type === this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.PROMO))) {
            this.addDigitalDataSeatsInfoByType(extendedDatalayerInfo, seatsByTypes, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.PROMO, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.PROMO.SEATSPROMOTOTAL, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.PROMO.SEATSPROMOPRICE);
        }if(headerModel.headerModel.shoppingBasket.seats.segments.some((segment) => segment.seats.some((seat) => seat.type === this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.INFANT))) {
            this.addDigitalDataSeatsInfoByType(extendedDatalayerInfo, seatsByTypes, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.INFANT, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.PASSENGER_WITH_INFANT.SEATSEINFANTTOTAL, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.PASSENGER_WITH_INFANT.SEATSEINFANTPRICE);
        }if(headerModel.headerModel.shoppingBasket.seats.segments.some((segment) => segment.seats.some((seat) => seat.type === this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.RESTRICTED_MOBILITY))) {
            this.addDigitalDataSeatsInfoByType(extendedDatalayerInfo, seatsByTypes, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.RESTRICTED_MOBILITY, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.RESTRICTED_MOBILITY.SEATSRESTRICTEDMOBILITYTOTAL, this.DatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.RESTRICTED_MOBILITY.SEATSRESTRICTEDMOBILITYPRICE);
        }
    }
    addDigitalDataBagaggesSpeqsInfoByType (extendedDatalayerInfo, ancillariesByTypes, headerAncillaryName, ancillaryTotalDigitalDataName, ancillaryTotalPriceDigitalDataName) {
        const totalPrice = ancillariesByTypes.filter(ancillary => ancillary.type === headerAncillaryName).reduce((total, ancillarie) => {
            return total + ancillarie.total;
        }, 0);
        const quanty = ancillariesByTypes.filter(ancillary => ancillary.type === headerAncillaryName).reduce((total, ancillarie) => {
            return total + ancillarie.quanty;
        }, 0);
    
        extendedDatalayerInfo[ancillaryTotalDigitalDataName]= quanty;
        extendedDatalayerInfo[ancillaryTotalPriceDigitalDataName]= totalPrice;
    }
    mapBagaggesForDigitalData (headerModel, extendedDatalayerInfo) {
        let bagaggesByTypes = [];
        headerModel.headerModel.shoppingBasket.baggages.segments.map( segment => {
            segment.baggages.forEach(
                baggage => 
                    bagaggesByTypes.push(baggage));
        });
        const baggagesTotalPrice = headerModel.headerModel.shoppingBasket.baggages.total.total;
        const baggagesTotalQuanty = bagaggesByTypes.reduce((suma, objeto) => {return suma + objeto.quanty;}, 0);

        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.BAGAGGESINFO.BAGAGGESTOTAL]= baggagesTotalQuanty;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.BAGAGGESINFO.BAGAGGESTOTALPRICE]= baggagesTotalPrice;

        if(headerModel.headerModel.shoppingBasket.baggages?.segments.some((segment) => segment.baggages.some((baggage) => baggage.type === this.DatalayerConstants.DATALAYER_INFO.BAGAGGESINFO.BAGAGGES_HEADER_FORMAT.BAGGAGE_15))) {
            this.addDigitalDataBagaggesSpeqsInfoByType(extendedDatalayerInfo, bagaggesByTypes, this.DatalayerConstants.DATALAYER_INFO.BAGAGGESINFO.BAGAGGES_HEADER_FORMAT.BAGGAGE_15, this.DatalayerConstants.DATALAYER_INFO.BAGAGGESINFO.BAGAGGESBYTYPE.BAGAGGE15.BAGAGGES15TOTAL, this.DatalayerConstants.DATALAYER_INFO.BAGAGGESINFO.BAGAGGESBYTYPE.BAGAGGE15.BAGAGGES15PRICE);
        }if(headerModel.headerModel.shoppingBasket.baggages.segments.some((segment) => segment.baggages.some((baggage) => baggage.type === this.DatalayerConstants.DATALAYER_INFO.BAGAGGESINFO.BAGAGGES_HEADER_FORMAT.BAGGAGE_23))) {
            this.addDigitalDataBagaggesSpeqsInfoByType(extendedDatalayerInfo, bagaggesByTypes, this.DatalayerConstants.DATALAYER_INFO.BAGAGGESINFO.BAGAGGES_HEADER_FORMAT.BAGGAGE_23, this.DatalayerConstants.DATALAYER_INFO.BAGAGGESINFO.BAGAGGESBYTYPE.BAGAGGE23.BAGAGGES23TOTAL, this.DatalayerConstants.DATALAYER_INFO.BAGAGGESINFO.BAGAGGESBYTYPE.BAGAGGE23.BAGAGGES23PRICE);
        }if(headerModel.headerModel.shoppingBasket.baggages.segments.some((segment) => segment.baggages.some((baggage) => baggage.type === this.DatalayerConstants.DATALAYER_INFO.BAGAGGESINFO.BAGAGGES_HEADER_FORMAT.BAGGAGE_32))) {
            this.addDigitalDataBagaggesSpeqsInfoByType(extendedDatalayerInfo, bagaggesByTypes, this.DatalayerConstants.DATALAYER_INFO.BAGAGGESINFO.BAGAGGES_HEADER_FORMAT.BAGGAGE_32, this.DatalayerConstants.DATALAYER_INFO.BAGAGGESINFO.BAGAGGESBYTYPE.BAGAGGE32.BAGAGGES32TOTAL, this.DatalayerConstants.DATALAYER_INFO.BAGAGGESINFO.BAGAGGESBYTYPE.BAGAGGE32.BAGAGGES32PRICE);
        }
    }
    
    mapSpeqsForDigitalData (headerModel, extendedDatalayerInfo) {
        let speqsByTypes = [];
        headerModel.headerModel.shoppingBasket.speqs.segments.map( segment => {
            segment.speqs.forEach(
                speqs => 
                    speqsByTypes.push(speqs));
        });
        const speqsTotalPrice = headerModel.headerModel.shoppingBasket.speqs.total.total;
        const speqsTotalQuanty = speqsByTypes.reduce((suma, objeto) => {return suma + objeto.quanty;}, 0);
        //TODO: Haz un flujo y mira el nombre de los campos de los speqs en el objeto HeaderModel para ponerlo en las constantes.
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSTOTAL]= speqsTotalQuanty;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSTOTALPRICE]= speqsTotalPrice;

        if(headerModel.headerModel.shoppingBasket.speqs?.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.BICYCLE))) {
            this.addDigitalDataBagaggesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.BICYCLE, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.BICYCLE.SPEQSBICYCLETOTAL, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.BICYCLE.SPEQSBICYCLEPRICE);
        }if(headerModel.headerModel.shoppingBasket.speqs.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SURFBOARD))) {
            this.addDigitalDataBagaggesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SURFBOARD, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.FISHING_EQUIPMENT.SPEQSFISHINGEQUIPMENTTOTAL, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.FISHING_EQUIPMENT.SPEQSFISHINGEQUIPMENTPRICE);
        }if(headerModel.headerModel.shoppingBasket.speqs.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.GOLFEQUIPMENT))) {
            this.addDigitalDataBagaggesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SKISNOW, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.GOLF_EQUIPMENT.SPEQSGOLFEQUIPMENTTOTAL, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.GOLF_EQUIPMENT.SPEQSGOLFEQUIPMENTPRICE);
        }if(headerModel.headerModel.shoppingBasket.speqs.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SKISNOW))) {
            this.addDigitalDataBagaggesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SKISNOW, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SKI_SNOW.SPEQSSKISNOWTOTAL, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SKI_SNOW.SPEQSSKISNOWPRICE);
        }if(headerModel.headerModel.shoppingBasket.speqs.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.FISHINGEQUIPMENT))) {
            this.addDigitalDataBagaggesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.FISHINGEQUIPMENT, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.FISHING_EQUIPMENT.SPEQSFISHINGEQUIPMENTTOTAL, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.FISHING_EQUIPMENT.SPEQSFISHINGEQUIPMENTPRICE);
        }if(headerModel.headerModel.shoppingBasket.speqs.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SCUBADIVING))) {
            this.addDigitalDataBagaggesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SCUBADIVING, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SCUBA_DIVING.SPEQSSCUBADIVINGTOTAL, this.DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SCUBA_DIVING.SPEQSSCUBADIVINGPRICE);
        }
    }
    addDigitalDataFlexibilization (headerModel, extendedDatalayerInfo) {

        const flexibilityTotalPrice = headerModel.headerModel.shoppingBasket?.flexibilization?.info?.amount?.price;
        const flexibilityType = headerModel.headerModel.shoppingBasket?.flexibilization?.info?.items[0]?.concepts[0]?.description;

        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.FLEXIBILITY_INFO.FLEXIBILITY_TOTAL_PRICE]= flexibilityTotalPrice;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.FLEXIBILITY_INFO.FLEXIBILTY_TYPE]= flexibilityType;
    }

    private addDigitalDataGlobickActivities (headerModelStorage: any, extendedDatalayerInfo: any) {
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.GLOBICK_ACTIVITIES] = headerModelStorage.headerModel.shoppingBasket.globickActivities?.info?.description;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.GLOBICK_ACTIVITIES_TOTAL_PRICE] = headerModelStorage.headerModel.shoppingBasket.globickActivities?.total?.total;
    }

    private addDigitalDataGlobickTransfer (headerModelStorage: any, extendedDatalayerInfo: any) {
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.GLOBICK_TRANSFER] = headerModelStorage.headerModel.shoppingBasket.globickTransfers?.info?.transferCar;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.GLOBICK_TRANSFER_TOTAL_PRICE] = headerModelStorage.headerModel.shoppingBasket.globickTransfers?.total?.total;
    }

    private removeKeyFromDigitalData (value: string, extendedDatalayerInfo: any) {
        const confirmationDigitalInfo = this.localStorageService.get('confirmationDigitalInfo');
        if (!confirmationDigitalInfo) return;
        const keysContainsValue = Object.keys(confirmationDigitalInfo).filter((elem: string) => elem.toLowerCase().includes(value.toLowerCase()));
        keysContainsValue.forEach(key => delete extendedDatalayerInfo[key]);
        this.DigitalDataService.removeDigitalDataInfo(keysContainsValue);
    }
    getProviderAndPolicyInsurance () {
        const insuranceInfo = this.getAncillariesInfoByType(this.DatalayerMMBConstants.ANCILLARIES_TYPES.INSURANCE);
        const insuranceSelected: any = this.localStorageService.get('insuranceSelected');
        return {
            provider: insuranceInfo[0]?.provider,
            policy: insuranceSelected?.id
        };
    }
    getAncillariesInfoByType (ancillaryType) {
        const {ancillaries}: any = this.localStorageService.get('ancillariesInfo');

        return ancillaries.filter((ancillary) => ancillary.type === ancillaryType);
    }
    /* FINISH DELETE GA4 MIGRATION*/
    private updateDigitalDataForAncillaries = (
        updatePrices: boolean, ancillariesAction: string, headerModel: CommonsDatalayerServiceTypes.HeaderModel, insuranceType): void => {
        const extendedDatalayerInfo = {};
        const insurancePrice = headerModel.headerModel.shoppingBasket.insurance?.total?.total;
        const hasSeats = headerModel.headerModel.shoppingBasket.seats.hasSeats;
        const hasBaggage = headerModel.headerModel.shoppingBasket.baggages.hasBaggage;
        const hasSpeqs = headerModel.headerModel.shoppingBasket.speqs.hasSpeqs;
        const hasFlexibilization = headerModel.headerModel.shoppingBasket.flexibilization.hasFlexibilization;
        const hasGlobickActivities = headerModel.headerModel.shoppingBasket?.globickActivities?.hasActivitiesGlobick;
        const hasGlobickTransfer = headerModel.headerModel.shoppingBasket?.globickTransfers?.hasTransfersGlobick;

        
        if (updatePrices && insuranceType) {
            const providerAndPolicyInsurance = this.getProviderAndPolicyInsurance();
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.INSURANCE_TYPE] = insuranceType;
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.INSURANCE_TOTAL_PRICE] = insurancePrice;
            if(providerAndPolicyInsurance.provider) extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.INSURANCE_PROVIDER] = providerAndPolicyInsurance.provider;
            if(providerAndPolicyInsurance.policy) extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.INSURANCE_POLICY] = providerAndPolicyInsurance.policy;
        }
        if(hasSeats) this.mapSeatsForDigitalData(headerModel, extendedDatalayerInfo);
        
        if(hasBaggage) this.mapBagaggesForDigitalData(headerModel, extendedDatalayerInfo);
        if(hasSpeqs) this.mapSpeqsForDigitalData(headerModel, extendedDatalayerInfo);
        if(hasFlexibilization) this.addDigitalDataFlexibilization(headerModel, extendedDatalayerInfo);
        this.removeKeyFromDigitalData('Globick', extendedDatalayerInfo);
        this.removeKeyFromDigitalData('Insurance', extendedDatalayerInfo);
        if (hasGlobickActivities) this.addDigitalDataGlobickActivities(headerModel, extendedDatalayerInfo);
        if (hasGlobickTransfer) this.addDigitalDataGlobickTransfer(headerModel, extendedDatalayerInfo);


        this.addDigitalDataInfo(extendedDatalayerInfo);
        this.localStorageService.set('confirmationDigitalInfo', extendedDatalayerInfo);
        this.DataLayerService.callUpdateTagManager(this.DatalayerConstants.DATALAYER_EVENT_TYPES.LINK);
    };

    /**
     * Generates datalayer for availability
     * @param {Obj} availabilityData the availability data
     * @returns {Obj} returns object with availability datalayer info
     */
    /* INIT DELETE GA4 MIGRATION*/
    generateDatalayerAvailability = (availabilityData): object => {
        const datalayerObject = {}, generalInfo : CommonsDatalayerServiceTypes.GeneralInfoDatalayer= this.localStorageService.get('bookingUrlParams');
        let isMultipleTrip:boolean = false;
        let typeSearch : string = this.CommonsUtilService.getTypeSearch();
        const bookingInfo:CommonsDatalayerServiceTypes.OriginDestinationDatalayer = this.localStorageService.get('originDestination');
        isMultipleTrip = this.localStorageService.get('multiCitySearch');
        // datalayerObject[this.DatalayerConstants.DATALAYER_INFO.DYNAMIC_PRICING] = !!this.$cookies.get(this.CommonsConstants.COOKIES.DYNAMIC_PRICING) ? 1 : 0;
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_CITY] = '';
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_ORIGIN] = '';
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_DEST] = '';
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_COUNTRY] = '';
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ADVANCE_PURCHASE] = '';
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_DATES] = '';
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCHED_TRIP] = '';
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP] = '';
        if(typeSearch && typeSearch.length > 0) {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TYPE_SEARCH] = typeSearch;
        }
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.FLIGHT_RATIO] = availabilityData.flightRatio ? availabilityData.flightRatio : '';
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.PROCESS] = this.CommonsUtilService.getProcess();
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.STEP] = this.DatalayerConstants.DATALAYER_VIEWS.DISPO;
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.LARGE_FAMILY] = generalInfo.largeFamilyType ?
            generalInfo.largeFamilyType : this.DatalayerConstants.DATALAYER_VALUES.NO;
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.RESIDENT] = generalInfo.resident ?
            generalInfo.resident : this.DatalayerConstants.DATALAYER_VALUES.NO;
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ENTRY_POINT] =
            `${this.CommonsConstants.lang}/${this.CommonsConstants.market}/${generalInfo.searchOrigin ? generalInfo.searchOrigin : ''}`;
        if (generalInfo.codeTracking) {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.CODE_TRACKING] = generalInfo.codeTracking;
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.USER_SEGMENT] = this.DatalayerConstants.DATALAYER_USER_LEVELS.COLECTIVO;
        }
        if (generalInfo.travelAgent) {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.CODE_TRACKING] =
                `${this.DatalayerConstants.DATALAYER_PREFIX.AGENTS}${generalInfo.travelAgent}`;
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.USER_SEGMENT] = this.DatalayerConstants.DATALAYER_USER_LEVELS.PSEUDOAGENCIA;
        }
        if (isMultipleTrip) {
            const bookingInfoMulti : CommonsDatalayerServiceTypes.OriginDestinationMulticityDatalayer[] = this.localStorageService.get('originDestinationMulticity');
            for (let i = 0; i < bookingInfoMulti.length; i++) {
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TOTAL_PASSENGERS] = bookingInfoMulti[i].numberPassengrsWithoutInfant.toString();
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_CITY] +=
                    `${datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_CITY].length > 0 ? '-' : ''}${bookingInfoMulti[i].destinationCity.code}`;
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_ORIGIN] +=
                    `${datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_ORIGIN].length > 0 ? '-' : ''}${bookingInfoMulti[i].originCity.code}`;
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_DEST] +=
                    `${datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_DEST].length > 0 ? '-' : ''}${bookingInfoMulti[i].destinationCity.code}`;
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_COUNTRY] +=
                    `${datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_COUNTRY].length > 0 ? '-' : ''}${bookingInfoMulti[i].originCity.country.code}`;
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ADVANCE_PURCHASE] +=
                    `${datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ADVANCE_PURCHASE].length > 0 ? '-' : ''}${Math.round((new Date(bookingInfoMulti[i].dates.formatedOutboundFlight).getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24)).toString()
                    }`;
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_DATES] +=
                    `${datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_DATES].length > 0 ? '-' : ''}${bookingInfoMulti[i].dates.outboundFlight ?
                        bookingInfoMulti[i].dates.outboundFlight.split('-')[2] + '/' + bookingInfoMulti[i].dates.outboundFlight.split('-')[1] + '/' + bookingInfoMulti[i].dates.outboundFlight.split('-')[0] :
                        ''
                    }`;
            }
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.DESTINATION_STAY] = '0';
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TRIP_TYPE] = this.DatalayerConstants.DATALAYER_VALUES.MULTIPLE_TRIP;

        } else {
            let tempAdvancePurchase:number = 0;
            if (bookingInfo.originCity && bookingInfo.destinationCity) {
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TOTAL_PASSENGERS] = bookingInfo.numberPassengrsWithoutInfant.toString();
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_CITY] = bookingInfo.destinationCity.code;
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_ORIGIN] = bookingInfo.originCity.code;
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_ORIGIN_NAME] = bookingInfo.originCity.description;
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_DEST] = bookingInfo.destinationCity.code;
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_DEST_NAME] = bookingInfo.destinationCity.description;
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCH_COUNTRY] = bookingInfo.originCity.country.code;
            }
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.DESTINATION_STAY] =
                bookingInfo.dates.formatedReturnFlight && bookingInfo.dates.formatedOutboundFlight ?
                    Math.round(((new Date(bookingInfo.dates.formatedReturnFlight).getTime() - new Date(bookingInfo.dates.formatedOutboundFlight).getTime()) / (1000 * 60 * 60 * 24))).toString() :
                    '0';

            tempAdvancePurchase = Math.round((new Date(bookingInfo.dates.formatedOutboundFlight).getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24)) >= 0 ? Math.round((new Date(bookingInfo.dates.formatedOutboundFlight).getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24)) : 0;
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ADVANCE_PURCHASE] = tempAdvancePurchase.toString();

            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_DATES] =
                `${bookingInfo.dates.outboundFlight ? bookingInfo.dates.outboundFlight.split('-')[2] + '/' + bookingInfo.dates.outboundFlight.split('-')[1] + '/' + bookingInfo.dates.outboundFlight.split('-')[0] : ''}-${bookingInfo.dates.returnFlight ? bookingInfo.dates.returnFlight.split('-')[2] + '/' + bookingInfo.dates.returnFlight.split('-')[1] + '/' + bookingInfo.dates.returnFlight.split('-')[0] : ''
                }`;

            if (availabilityData.originDestinations.length === 1) {
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TRIP_TYPE] = this.DatalayerConstants.DATALAYER_VALUES.ONE_WAY_TRIP;
                if (!this.$rootScope.isRedemptionFlow) {
                    datalayerObject[this.DatalayerConstants.DATALAYER_INFO.OUTBOUND_RESULTS] = availabilityData.originDestinations[0].slices.length.toString();
                }
            } else {
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TRIP_TYPE] = this.DatalayerConstants.DATALAYER_VALUES.RETURN_TRIP;
                if (!this.$rootScope.isRedemptionFlow) {
                    datalayerObject[this.DatalayerConstants.DATALAYER_INFO.OUTBOUND_RESULTS] = availabilityData.originDestinations[0].slices.length.toString();
                    datalayerObject[this.DatalayerConstants.DATALAYER_INFO.INBOUND_RESULTS] = availabilityData.originDestinations[1].slices.length.toString();
                }
            }
        }
        for (let oIndex = 0; oIndex < availabilityData.originDestinations.length; oIndex++) {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCHED_TRIP] +=
                (datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCHED_TRIP].length > 0 ? ',' : '') +
                availabilityData.originDestinations[oIndex].origin;
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCHED_TRIP] +=
                availabilityData.originDestinations.length > 1 ? '' : ((datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEARCHED_TRIP].length > 0 ? ',' : '') + availabilityData.originDestinations[oIndex].destination);
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP] +=
                (datalayerObject[this.DatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP].length > 0 ? '-' : '') +
                availabilityData.originDestinations[oIndex].originCity.countryCode;
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP] +=
                availabilityData.originDestinations.length > 1 ? '' : ((datalayerObject[this.DatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP].length > 0 ? '-' : '') + availabilityData.originDestinations[oIndex].destinationCity.countryCode);

            if (isMultipleTrip && oIndex === 0) {
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.MULTIPLE_TRIP_RESULTS + oIndex] = availabilityData.originDestinations[oIndex].slices.length.toString();
            }
        }
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.OUTBOUND_ROUTE] = availabilityData.originDestinations[0].origin + ',' + availabilityData.originDestinations[0].destination;
        if (availabilityData?.originDestinations[1]) datalayerObject[this.DatalayerConstants.DATALAYER_INFO.RETURN_ROUTE] = availabilityData?.originDestinations[1]?.origin + ',' + availabilityData?.originDestinations[1]?.destination;
        if (bookingInfo?.numAdults) datalayerObject[this.DatalayerConstants.DATALAYER_INFO.NUM_ADDULTS] = bookingInfo.numAdults.toString();
        if (bookingInfo?.numChilds) datalayerObject[this.DatalayerConstants.DATALAYER_INFO.NUM_CHILDS] = bookingInfo.numChilds.toString();
        if (bookingInfo?.numInfant) datalayerObject[this.DatalayerConstants.DATALAYER_INFO.NUM_INFANTS] = bookingInfo.numInfant.toString();
        if (bookingInfo?.numSeniors) datalayerObject[this.DatalayerConstants.DATALAYER_INFO.NUM_SENIOR] = bookingInfo.numSeniors.toString();
        if (bookingInfo?.numYoung) datalayerObject[this.DatalayerConstants.DATALAYER_INFO.NUM_YOUNG] = bookingInfo.numYoung.toString();
        if (bookingInfo?.numTeenager) datalayerObject[this.DatalayerConstants.DATALAYER_INFO.NUM_TENNEAGER] = bookingInfo.numTeenager.toString();
        this.localStorageService.set('confirmationDatalayerInfo', datalayerObject);
        return datalayerObject;
    };
    /* FINISH DELETE GA4 MIGRATION*/

    /**
     * Generates datalayer for passengers view
     * @param {Obj} slices the passengers data
     * @returns {Obj} returns object with passengers datalayer info
     */
    /* INIT DELETE GA4 MIGRATION*/
    generateDatalayerPassengers = (slices, priceInfo, currency, haul): object => {
        const datalayerObject: object = this.localStorageService.get('confirmationDatalayerInfo') || {};
        const fareData: any = this.localStorageService.get('fareData') || {};
        let departureDateTimeMulti: string, departureDateTimeOutbound: string, departureDateTimeReturn: string, cabinClass = '',
            isMultipleTrip: boolean = false;
        const fareFamilies: string[] = [], cabins: string[] = [];
        const getCabinsInfoMulti = (segments): string => {
            let i = 0, cabinInfo = '';
            for (i; i < segments.length; i++) {
                cabinInfo += (cabinInfo.length > 0 ? ',' : '') + segments[i].cabin.bookingClass;
            }
            return cabinInfo;
        };

        isMultipleTrip = this.localStorageService.get('multiCitySearch');
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.CABINS] = '';
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.FF_OUTBOUND] = fareData?.fareFamilyConditions[0]?.commercialName ? fareData.fareFamilyConditions[0].commercialName.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.FF_RETURN] = fareData?.fareFamilyConditions[1]?.commercialName ? fareData.fareFamilyConditions[1].commercialName.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : (fareData?.offers[0]?.slices[1] && fareData?.fareFamilyConditions[0]?.commercialName) ? fareData.fareFamilyConditions[0].commercialName.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.STEP] = this.DatalayerConstants.DATALAYER_VIEWS.PASSENGERS;

        if (slices.length > 0 && slices[0].departureDateTime && slices[0].departureDateTime.split(' ').length >= 1) {
            departureDateTimeOutbound = slices[0].departureDateTime.split(' ')[1];
        } else {
            departureDateTimeOutbound = 'IBOPEN';
        }

        if (slices.length > 1 && slices[1].departureDateTime && slices[1].departureDateTime.split(' ').length >= 1) {
            departureDateTimeReturn = slices[1].departureDateTime.split(' ')[1];
        } else {
            departureDateTimeReturn = 'IBOPEN';
        }

        if (slices && slices.length > 0) {
            if (slices.length === 1 && slices[0].segments.length > 0) {
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.STOPS_NUMBER] = 'IDA:' + slices[0].stopsNumber;
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_HOUR] = 'IDA:' + departureDateTimeOutbound;
            } else if (slices.length === 2 && slices[0].segments.length > 0 && slices[1].segments.length > 0 && !isMultipleTrip) {
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.STOPS_NUMBER] = 'IDA:' + slices[0].stopsNumber + '-VUELTA:' + slices[1].stopsNumber;
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_HOUR] =
                    'IDA:' + departureDateTimeOutbound + '-VUELTA:' + departureDateTimeReturn;
            } else {
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.STOPS_NUMBER] = '';
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_HOUR] = '';
                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.FARE_NAMES] = '';
            }
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ORIGIN_DESTINATIONS] = '';
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ORIGIN_DESTINATIONS] = this.$rootScope.isRedemptionFlow ? slices[0].segments[0].departure.city.code + '-' + slices[0].segments[slices[0].segments.length - 1].arrival.city.code : slices[0].segments[0].departure.code + '-' + slices[0].segments[slices[0].segments.length - 1].arrival.code;
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_OPERATORS] = '';
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.FLIGHTS_NUMBER] = '';
            for (let i = 0; i < slices.length; i++) {
                if (slices[i].segments.length > 0) {
                    if (slices[i].departureDateTime && slices[i].departureDateTime.split(' ').length) {
                        departureDateTimeMulti = slices[i].departureDateTime.split(' ')[1];
                    } else {
                        departureDateTimeMulti = 'IBOPEN';
                    }

                    for (let j = 0; j < slices[i].segments.length; j++) {
                        fareFamilies[i] = fareFamilies[i] || '';
                        cabins[i] = cabins[i] || '';
                        fareFamilies[i] += (fareFamilies[i].length > 0 ? ',' : '') + (slices[i].segments[j].cabin.fareFamily || this.DatalayerConstants.DATALAYER_VALUES.FARE_FAMILY_STANDARD);
                        cabins[i] += (cabins[i].length > 0 ? ',' : '') + (slices[i].segments[j].cabin.bookingClass || this.DatalayerConstants.DATALAYER_VALUES.CABIN_FAMILY_STANDARD);
                        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.FLIGHTS_NUMBER] +=
                            (datalayerObject[this.DatalayerConstants.DATALAYER_INFO.FLIGHTS_NUMBER].length > 0 ? '-' : '') +
                            slices[i].segments[j].flight.operationalDisclosure + (slices[i].segments[j].flight.operationalFlightNumber || slices[i].segments[j].flight.marketingFlightNumber);
                        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_OPERATORS] +=
                            (datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_OPERATORS].length > 0 ? '-' : '') +
                            slices[i].segments[j].flight.operationalDisclosure;
                        if (slices[i].segments[j].cabin && angular.isString(slices[i].segments[0].cabin.bookingClass)) {
                            cabinClass = cabinClass === '' || this.DatalayerConstants.SEGMENT_CABIN_PRIORITY[cabinClass] > this.DatalayerConstants.SEGMENT_CABIN_PRIORITY[slices[i].segments[j].cabin.bookingClass.charAt(0)]
                                ? slices[i].segments[j].cabin.bookingClass.charAt(0) : cabinClass;
                        }
                    }
                    if (isMultipleTrip) {
                        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.STOPS_NUMBER] +=
                            (datalayerObject[this.DatalayerConstants.DATALAYER_INFO.STOPS_NUMBER].length > 0 ? '-' : '') + slices[i].stopsNumber;
                        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_HOUR] +=
                            (datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_HOUR].length > 0 ? '-' : '') + departureDateTimeMulti;
                        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.FARE_NAMES] +=
                            (datalayerObject[this.DatalayerConstants.DATALAYER_INFO.FARE_NAMES].length > 0 ? '-' : '') + fareFamilies[i];
                        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.CABINS] += (datalayerObject[this.DatalayerConstants.DATALAYER_INFO.CABINS].length > 0 ? '-' : '') + getCabinsInfoMulti(slices[i].segments);
                    } else {
                        if (fareFamilies.length === 1) {
                            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.FARE_NAMES] = 'IDA:' + fareFamilies[0];
                        } else {
                            if (fareFamilies.length === 2) {
                                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.FARE_NAMES] = 'IDA:' + fareFamilies[0] + '-VUELTA:' + fareFamilies[1];
                            } else {
                                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.FARE_NAMES] = '';
                            }
                        }
                        if (cabins.length === 1) {
                            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.CABINS] = 'IDA:' + cabins[0];
                        } else {
                            if (cabins.length === 2) {
                                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.CABINS] = 'IDA:' + cabins[0] + '-VUELTA:' + cabins[1];
                            } else {
                                datalayerObject[this.DatalayerConstants.DATALAYER_INFO.CABINS] = '';
                            }
                        }
                    }
                }
            }
        }
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.IB_PLUS_HOLDER] = this.localStorageService.get('userLogged') ? this.DatalayerConstants.DATALAYER_VALUES.YES : this.DatalayerConstants.DATALAYER_VALUES.NO;
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.BOOKING_CLASS] = cabinClass;
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.CURRENCY] = currency;

        if (this.$rootScope.isRedemptionFlow) {
            const tempTotalPrice = priceInfo && priceInfo.price && priceInfo.price.totalCash ? priceInfo.price.totalCash.toString().replace(',', '.') : '0';
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TOTAL_PRICE] = tempTotalPrice.substr(0, tempTotalPrice.length - 1);
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.PASSENGER_PRICE] = priceInfo?.fareCashPerPassenger ? priceInfo.fareCashPerPassenger : 0;
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TOTAL_PRICE_AVIOS] = priceInfo && priceInfo.price && priceInfo.price.totalAvios ? priceInfo.price.totalAvios : 0;
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TOTAL_PRICE_TAXES] = priceInfo && priceInfo.tax ? priceInfo.tax : 0;
        } else {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TOTAL_PRICE] = priceInfo && priceInfo.total ? priceInfo.total : 0;
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TOTAL_PRICE_WITHOUT_FEE] = priceInfo && priceInfo.fare ? priceInfo.fare : 0;
        }
        for(let i = 0; i < slices.length; i++) {
            datalayerObject[`slice${i+1}Origin`] = (slices[i].origin) ? slices[i].origin : slices[i].segments[0].departure.city.code;
            datalayerObject[`slice${i+1}Destination`] = (slices[i].destination) ? slices[i].destination : slices[i].segments[(slices[i].segments.length)-1].arrival.city.code;
            datalayerObject[`slice${i+1}Cabin`] = slices[i].segments.length>1 ? getCabinsInfoMulti(slices[i].segments) : slices[i].segments[0].cabin.bookingClass;
            datalayerObject[`slice${i+1}FareRegistration`] = slices[i].segments[0].cabin.fareFamily;
            datalayerObject[`slice${i+1}Stops`] = slices[i].stopsNumber;
            if(slices[i].departureDateTime){
                let departureYear = slices[i].departureDateTime.substring(0, 4);
                let departureMonth = slices[i].departureDateTime.substring(5, 7);
                let departureDay = slices[i].departureDateTime.substring(8, 10);
                datalayerObject[`slice${i+1}Date`] = departureDay + '/' + departureMonth + '/' + departureYear;
                let departureHour = slices[i].departureDateTime.substring(11, 13);
                let departureMinute = slices[i].departureDateTime.substring(14, 16);
                datalayerObject[`slice${i+1}Hour`] = departureHour + ':' + departureMinute;
            }
            let sliceRoute = slices[i].segments[0].departure.city.code + '-' + slices[i].segments[0].arrival.city.code;
            for(let j = 1; j < slices[i].segments.length; j++){
                sliceRoute = sliceRoute + '-' + slices[i].segments[j].arrival.city.code;
            }
            datalayerObject[`slice${i+1}Route`] = sliceRoute;
            if(haul === 'SH' || haul === 'DO' || haul === 'Corto Radio') {
                datalayerObject[`slice${i+1}Haul`] = this.DatalayerConstants.FLIGHT_RATIO_TYPES.SHORT;
            } else if(haul === 'MH' || haul === 'Medio Radio') {
                datalayerObject[`slice${i+1}Haul`] = this.DatalayerConstants.FLIGHT_RATIO_TYPES.MEDIUM;
            } else if(haul === 'LH' || haul === 'Largo Radio') {
                datalayerObject[`slice${i+1}Haul`] = this.DatalayerConstants.FLIGHT_RATIO_TYPES.LONG;
            }
            if(isMultipleTrip) {
                datalayerObject[`slice${i+1}Origin`] = slices[i].segments[0].departure.code;
                datalayerObject[`slice${i+1}Destination`] = slices[i].segments[datalayerObject[`slice${i+1}Stops`]].arrival.code;
            }
            let fareFamily:string = '';
            slices[i].segments.forEach(segment => {
                this.CommonsSessionStorageService.get<CommonsFareFamilyConditionsInfo.FareFamilyConditionsInfo[]>('fareFamilyConditionsInfo').forEach((fare) => {
                    if(fare.commercialCode === segment.cabin.fareFamily) {
                        fareFamily+= (fareFamily==='' ? '' : ', ') + fare.commercialNameES;
                    }
                });
            });
            datalayerObject[`slice${i+1}FareFamilyName`] =  this.$filter('EliminateAccentFilter')(fareFamily).split('-')
                .map((word) => this.$filter('CapitalLetterFilter')(word)).join(' ');

        }
        this.localStorageService.set('confirmationDatalayerInfo', datalayerObject);
        return datalayerObject;
    };
    /* FINISH DELETE GA4 MIGRATION*/

    /* INIT DELETE GA4 MIGRATION*/
    generateDatalayerAncillaries = (): object => {
        const datalayerObject: object = this.localStorageService.get('confirmationDatalayerInfo') || {};
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.STEP] = this.DatalayerConstants.DATALAYER_VIEWS.ANCILLARIES;
        this.addDataLayerInfo(datalayerObject);
        this.localStorageService.set('confirmationDatalayerInfo', datalayerObject);
        return datalayerObject;
    };
    /* FINISH DELETE GA4 MIGRATION*/

    /**
     * Generates datalayer for payments view
     * @param {Obj} paymentData the passengers data
     * @param {Obj} orderData the order data
     * @returns {Obj} returns object with payments datalayer info
     */
    /* INIT DELETE GA4 MIGRATION*/
    generateDatalayerPayments = (paymentData, orderData): object => {
        const datalayerObject: object = this.localStorageService.get('confirmationDatalayerInfo') || {};
        const paymentsInfo: any = this.localStorageService.get('paymentsInfo');
        const flowApp = this.localStorageService.get('flowApp');
        const paymentQuadrigamByFlow = this.DatalayerConstants.PAYMENT_QUADRIGAM_BY_FLOW[flowApp as keyof typeof this.DatalayerConstants.PAYMENT_QUADRIGAM_BY_FLOW];
 
        let foundedSpecialNeeds: boolean = false, specialNeedsIndex: number = 0, tPrice: number,
            noFee: number;

        if (!this.localStorageService.get('isOnHoldOrder')) {
            tPrice = paymentData && paymentData.paymentMethods && paymentData.paymentMethods[0].total ? paymentData.paymentMethods[0].total : 0;
            const oldTPrice = orderData && orderData.order && orderData.order.price ? orderData.order.price.total : 0;
            const tPriceDif = tPrice - oldTPrice;
            const oldNoFee = orderData && orderData.order && orderData.order.price ? orderData.order.price.fare : 0;
            noFee = oldNoFee + tPriceDif;
        } else {
            tPrice = orderData && orderData.order && orderData.order.price ? orderData.order.price.total : 0;
            noFee = orderData && orderData.order && orderData.order.price ? orderData.order.price.fare : 0;
        }

        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.STEP] = this.getStepFromQuadrigam(datalayerObject[this.DatalayerConstants.DATALAYER_INFO.QUADRIGAM], this.DatalayerConstants.DATALAYER_VIEWS.PAYMENTS);
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.OFFERED_CASH_AVIOS] = paymentsInfo?.availableDiscounts?.AVIOS?.available || paymentsInfo?.appliedDiscounts?.types?.AVIOS ?
            this.DatalayerConstants.DATALAYER_VALUES.YES : this.DatalayerConstants.DATALAYER_VALUES.NO;
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.OFFERED_VOUCHER] = paymentsInfo?.availableDiscounts?.VOUCHER?.available || paymentData?.paymentMethods[0].type === 'VOUCHER' || paymentsInfo?.appliedDiscounts?.types?.VOUCHER ? 'si' : 'no';
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TOTAL_PRICE] = tPrice;
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TOTAL_PRICE_WITHOUT_FEE] = noFee;
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.QUANTITY_ORDER_ITEMS] = orderData && orderData.order && orderData.order.orderItems ? orderData.order.orderItems.length.toString() : '0';
        if(paymentQuadrigamByFlow) {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.QUADRIGAM] = paymentQuadrigamByFlow;
        }
        if(datalayerObject[this.DatalayerConstants.DATALAYER_INFO.CODE]) {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.CODE] = datalayerObject[this.DatalayerConstants.DATALAYER_INFO.CODE].split('/').map((part, i, arr) => arr.length -1 === i ? paymentQuadrigamByFlow : part).join('/');
        }
        if (orderData && orderData.order && orderData.order.orderItems) {
            while (!foundedSpecialNeeds && specialNeedsIndex < orderData.order.orderItems.length) {
                if (orderData.order.orderItems[specialNeedsIndex].type === this.CommonsConstants.passengerTypes.SPECIAL_NEEDS) {
                    foundedSpecialNeeds = true;
                }
                specialNeedsIndex++;
            }
        }
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.REDUCED_MOBILITY] =
            foundedSpecialNeeds ? this.DatalayerConstants.DATALAYER_VALUES.YES : this.DatalayerConstants.DATALAYER_VALUES.NO;
        this.addDataLayerInfo(datalayerObject);
        this.localStorageService.set('confirmationDatalayerInfo', datalayerObject);
        return datalayerObject;
    };
    /* FINISH DELETE GA4 MIGRATION*/
    generateDigitalDataPayments = (paymentData, orderData): object => {
        const datalayerObject: object = this.localStorageService.get('confirmationDigitalInfo') || {};
        const paymentsInfo: any = this.localStorageService.get('paymentsInfo');
        const flowApp = this.localStorageService.get('flowApp');
        const paymentQuadrigamByFlow = this.DatalayerConstants.PAYMENT_QUADRIGAM_BY_FLOW[flowApp as keyof typeof this.DatalayerConstants.PAYMENT_QUADRIGAM_BY_FLOW];
 
        let foundedSpecialNeeds: boolean = false, specialNeedsIndex: number = 0, tPrice: number,
            noFee: number;

        if (!this.localStorageService.get('isOnHoldOrder')) {
            tPrice = paymentData && paymentData.paymentMethods && paymentData.paymentMethods[0].total ? paymentData.paymentMethods[0].total : 0;
            const oldTPrice = orderData && orderData.order && orderData.order.price ? orderData.order.price.total : 0;
            const tPriceDif = tPrice - oldTPrice;
            const oldNoFee = orderData && orderData.order && orderData.order.price ? orderData.order.price.fare : 0;
            noFee = oldNoFee + tPriceDif;
        } else {
            tPrice = orderData && orderData.order && orderData.order.price ? orderData.order.price.total : 0;
            noFee = orderData && orderData.order && orderData.order.price ? orderData.order.price.fare : 0;
        }
        datalayerObject[this.DatalayerGeneralConstants.STEP] = this.getStepFromQuadrigam(datalayerObject[this.DatalayerGeneralConstants.QUADRIGAM], this.DatalayerConstants.DATALAYER_VIEWS.PAYMENTS);
        datalayerObject[this.DatalayerBKIConstants.CASH_AVIOS_OFFER] = paymentsInfo?.availableDiscounts?.AVIOS?.available || paymentsInfo?.appliedDiscounts?.types?.AVIOS ?
            this.DatalayerConstants.DATALAYER_VALUES.YES : this.DatalayerConstants.DATALAYER_VALUES.NO;
        datalayerObject[this.DatalayerGeneralConstants.VOUCHER_SHOWN] = (paymentsInfo?.availableDiscounts?.VOUCHER?.available || paymentData?.paymentMethods[0].type === 'VOUCHER' || paymentsInfo?.appliedDiscounts?.types?.VOUCHER) ? this.DatalayerConstants.DATALAYER_VALUES.YES : this.DatalayerConstants.DATALAYER_VALUES.NO;
        datalayerObject[this.DatalayerBKIConstants.TOTAL_PRICE] = tPrice;
        datalayerObject[this.DatalayerBKIConstants.TOTAL_PRICE_WITHOUT_TAXES] = noFee;
        datalayerObject[this.DatalayerGeneralConstants.QUANTITY] = orderData && orderData.order && orderData.order.orderItems ? orderData.order.orderItems.length.toString() : '0';
        if(paymentQuadrigamByFlow) {
            datalayerObject[this.DatalayerGeneralConstants.QUADRIGAM] = paymentQuadrigamByFlow;
        }
        if(datalayerObject[this.DatalayerGeneralConstants.CODE]) {
            datalayerObject[this.DatalayerGeneralConstants.CODE] = datalayerObject[this.DatalayerGeneralConstants.CODE].split('/').map((part, i, arr) => arr.length -1 === i ? paymentQuadrigamByFlow : part).join('/');
        }
        if (orderData && orderData.order && orderData.order.orderItems) {
            while (!foundedSpecialNeeds && specialNeedsIndex < orderData.order.orderItems.length) {
                if (orderData.order.orderItems[specialNeedsIndex].type === this.CommonsConstants.passengerTypes.SPECIAL_NEEDS) {
                    foundedSpecialNeeds = true;
                }
                specialNeedsIndex++;
            }
        }
        datalayerObject[this.DatalayerBKIConstants.PMR] =
            foundedSpecialNeeds ? this.DatalayerConstants.DATALAYER_VALUES.YES : this.DatalayerConstants.DATALAYER_VALUES.NO;
        this.addDigitalDataInfo(datalayerObject);
        this.localStorageService.set('confirmationDigitalInfo', datalayerObject);
        return datalayerObject;
    };

    /**
     * Updates datalayer for payments and confirmation view
     * @param {Obj} paymentData the payments data
     * @returns {Obj} returns object with payments datalayer info
     */
    /* INIT DELETE GA4 MIGRATION*/
    updateDatalayerInfoPayments = (paymentData : CommonsDatalayerServiceTypes.PaymentDataDatalayer): object => {
        const confirmationDatalayerInfo: CommonsDatalayerServiceTypes.ConfirmationDatalayerInfo = {
            generalInfo: this.localStorageService.get('confirmationDatalayerInfo') || {},
            ecommerce: {}
        };
        const issueOrderData :CommonsDatalayerServiceTypes.IssueOrderDataDatalayer= this.localStorageService.get('issueOrderData');
        const fareData :CommonsDatalayerServiceTypes.FareDataDatalayer= this.localStorageService.get('fareData');
        const originDestinationData :CommonsDatalayerServiceTypes.OriginDestinationDatalayer= this.localStorageService.get('originDestination');
        const getTransaction = (issueOrderData, fareData) : CommonsDatalayerServiceTypes.GetTransactionDatalayer => {
            return {
                id: issueOrderData.bookingReferences[0].reference,
                affiliation: this.CommonsConstants.market,
                revenue: issueOrderData.price.total,
                tax: fareData.offers[0].price.tax,
                shipping: fareData.offers[0].price.fare
            };
        };
        const getProducts = (issueOrderData: CommonsDatalayerServiceTypes.IssueOrderDataDatalayer,
            originDestinationData:CommonsDatalayerServiceTypes.OriginDestinationDatalayer,
            paymentData:CommonsDatalayerServiceTypes.PaymentDataDatalayer):CommonsDatalayerServiceTypes.getProduct =>{
            const products:CommonsDatalayerServiceTypes.getProduct = [];
            const prodCount : CommonsDatalayerServiceTypes.ProductDatalayer []= [];
            let flightInfo, orderItemId, orderItemType, orderItemPrice, orderItemKey, orderItemAmount,  passUnits = 0, itemTypeComp;

            for (const p in paymentData.summaryInfo.passengers.generalData) {
                if (p !== this.DatalayerConstants.PASSENGERS_TYPES.INFANT) {
                    passUnits += paymentData.summaryInfo.passengers.generalData[p][0].number;
                }
            }

            for (let j = 0; j < issueOrderData.orderItems.length; j++) {

                orderItemType = issueOrderData.orderItems[j].type;
                itemTypeComp = orderItemType === this.DatalayerConstants.DATALAYER_ECOMMERCE.TYPE_FLIGHT;

                if (issueOrderData.orderItems[j].segmentId) {
                    flightInfo = this.CommonsUtilService.getSegmentDetailsById(issueOrderData.orderItems[j].segmentId, issueOrderData.slices);
                } else {
                    if (issueOrderData.orderItems[j].sliceId) {
                        flightInfo = this.CommonsUtilService.getSliceDetailsById(issueOrderData.orderItems[j].sliceId, issueOrderData.slices);
                    } else {
                        flightInfo = null;
                    }
                }
                orderItemId = flightInfo ? `${flightInfo.origin.code}-${flightInfo.arrival.code}` :
                    `${originDestinationData.originCity.code}-${originDestinationData.destinationCity.code}`;
                orderItemPrice = itemTypeComp ? issueOrderData.orderItems[j].price.fare / passUnits : issueOrderData.orderItems[j].price.fare;
                if (itemTypeComp) {
                    orderItemAmount = passUnits;
                } else {
                    if (issueOrderData.orderItems[j].amount) {
                        orderItemAmount = issueOrderData.orderItems[j].amount;
                    } else {
                        orderItemAmount = 1;
                    }
                }
                orderItemKey = orderItemType + '_' + orderItemId + '_' + orderItemPrice;

                if (prodCount[orderItemKey]) {
                    prodCount[orderItemKey].quantity += orderItemAmount;
                } else {
                    prodCount[orderItemKey] = {
                        name: orderItemType,
                        id: orderItemId,
                        category: paymentData.isOnHoldOrder || this.localStorageService.get('isOnHoldOrder') ?
                            this.DatalayerConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.ON_HOLD : this.DatalayerConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.DIRECT,
                        quantity: orderItemAmount,
                        precio: orderItemPrice
                    };
                }
            }

            for (const el in prodCount) {
                products.push(prodCount[el]);
            }

            return products;
        };
        if (paymentData.paymentInfo.selectedCard) {
            confirmationDatalayerInfo.generalInfo[this.DatalayerConstants.DATALAYER_INFO.CREDITCARD_TYPE] = paymentData.paymentInfo.selectedCard.cardTypeCode;
        }
        confirmationDatalayerInfo.generalInfo[this.DatalayerConstants.DATALAYER_INFO.VOUCHER] = (issueOrderData.paymentMethod &&
            (issueOrderData.paymentMethod.associatedDiscount && issueOrderData.paymentMethod.associatedDiscount.type === 'VOUCHER')) ||
            issueOrderData.paymentMethod.type === 'VOUCHER' ? this.DatalayerConstants.DATALAYER_VALUES.YES : this.DatalayerConstants.DATALAYER_VALUES.NO;
        if (issueOrderData.paymentMethod && issueOrderData.paymentMethod.associatedDiscount) {
            if (issueOrderData.paymentMethod.associatedDiscount.type === 'VOUCHER') {
                confirmationDatalayerInfo.generalInfo[this.DatalayerConstants.DATALAYER_INFO.PAYMENT_METHOD] = this.DatalayerConstants.DATALAYER_VALUES.PAYMENT_METHODS.CASH_VOUCHER;
            } else {
                if (issueOrderData.paymentMethod.associatedDiscount.type === 'AVIOS') {
                    confirmationDatalayerInfo.generalInfo[this.DatalayerConstants.DATALAYER_INFO.PAYMENT_METHOD] = this.DatalayerConstants.DATALAYER_VALUES.PAYMENT_METHODS.CASH_AVIOS;
                } else {
                    confirmationDatalayerInfo.generalInfo[this.DatalayerConstants.DATALAYER_INFO.PAYMENT_METHOD] = this.DatalayerConstants.DATALAYER_VALUES.PAYMENT_METHODS.CASH;
                }
            }
        } else {
            if (issueOrderData.paymentMethod.type === 'VOUCHER') {
                confirmationDatalayerInfo.generalInfo[this.DatalayerConstants.DATALAYER_INFO.PAYMENT_METHOD] = this.DatalayerConstants.DATALAYER_VALUES.PAYMENT_METHODS.VOUCHER;
            } else {
                confirmationDatalayerInfo.generalInfo[this.DatalayerConstants.DATALAYER_INFO.PAYMENT_METHOD] = this.DatalayerConstants.DATALAYER_VALUES.PAYMENT_METHODS.CASH;
            }
        }
        confirmationDatalayerInfo.ecommerce[this.DatalayerConstants.DATALAYER_ECOMMERCE.CURRENCY] = paymentData.currencyCode;
        confirmationDatalayerInfo.ecommerce[this.DatalayerConstants.DATALAYER_ECOMMERCE.TRANSACTION] = getTransaction(issueOrderData.order, fareData);
        confirmationDatalayerInfo.ecommerce[this.DatalayerConstants.DATALAYER_ECOMMERCE.PRODUCTS] = getProducts(issueOrderData.order, originDestinationData, paymentData);
        return confirmationDatalayerInfo;
    };
    /* FINISH DELETE GA4 MIGRATION*/
    updateDigitalDataInfoPayments = (paymentData : CommonsDatalayerServiceTypes.PaymentDataDatalayer): object => {
        const confirmationDatalayerInfo: CommonsDatalayerServiceTypes.ConfirmationDigitalDataInfo = {
            generalInfo: this.localStorageService.get('confirmationDigitalDataInfo') || {}
        };
        const issueOrderData :CommonsDatalayerServiceTypes.IssueOrderDataDatalayer= this.localStorageService.get('issueOrderData');
        const fareData :CommonsDatalayerServiceTypes.FareDataDatalayer= this.localStorageService.get('fareData');
        const originDestinationData :CommonsDatalayerServiceTypes.OriginDestinationDatalayer= this.localStorageService.get('originDestination');
        const getTransaction = (issueOrderData, fareData) : CommonsDatalayerServiceTypes.GetTransactionDatalayer => {
            return {
                id: issueOrderData.bookingReferences[0].reference,
                affiliation: this.CommonsConstants.market,
                revenue: issueOrderData.price.total,
                tax: fareData.offers[0].price.tax,
                shipping: fareData.offers[0].price.fare
            };
        };
        const getProducts = (issueOrderData: CommonsDatalayerServiceTypes.IssueOrderDataDatalayer,
            originDestinationData:CommonsDatalayerServiceTypes.OriginDestinationDatalayer,
            paymentData:CommonsDatalayerServiceTypes.PaymentDataDatalayer):CommonsDatalayerServiceTypes.getProduct =>{
            const products:CommonsDatalayerServiceTypes.getProduct = [];
            const prodCount : CommonsDatalayerServiceTypes.ProductDatalayer []= [];
            let flightInfo, orderItemId, orderItemType, orderItemPrice, orderItemKey, orderItemAmount,  passUnits = 0, itemTypeComp;

            for (const p in paymentData.summaryInfo.passengers.generalData) {
                if (p !== this.DatalayerConstants.PASSENGERS_TYPES.INFANT) {
                    passUnits += paymentData.summaryInfo.passengers.generalData[p][0].number;
                }
            }

            for (let j = 0; j < issueOrderData.orderItems.length; j++) {

                orderItemType = issueOrderData.orderItems[j].type;
                itemTypeComp = orderItemType === this.DatalayerConstants.DATALAYER_ECOMMERCE.TYPE_FLIGHT;

                if (issueOrderData.orderItems[j].segmentId) {
                    flightInfo = this.CommonsUtilService.getSegmentDetailsById(issueOrderData.orderItems[j].segmentId, issueOrderData.slices);
                } else {
                    if (issueOrderData.orderItems[j].sliceId) {
                        flightInfo = this.CommonsUtilService.getSliceDetailsById(issueOrderData.orderItems[j].sliceId, issueOrderData.slices);
                    } else {
                        flightInfo = null;
                    }
                }
                orderItemId = flightInfo ? `${flightInfo.origin.code}-${flightInfo.arrival.code}` :
                    `${originDestinationData.originCity.code}-${originDestinationData.destinationCity.code}`;
                orderItemPrice = itemTypeComp ? issueOrderData.orderItems[j].price.fare / passUnits : issueOrderData.orderItems[j].price.fare;
                if (itemTypeComp) {
                    orderItemAmount = passUnits;
                } else {
                    if (issueOrderData.orderItems[j].amount) {
                        orderItemAmount = issueOrderData.orderItems[j].amount;
                    } else {
                        orderItemAmount = 1;
                    }
                }
                orderItemKey = orderItemType + '_' + orderItemId + '_' + orderItemPrice;

                if (prodCount[orderItemKey]) {
                    prodCount[orderItemKey].quantity += orderItemAmount;
                } else {
                    prodCount[orderItemKey] = {
                        name: orderItemType,
                        id: orderItemId,
                        category: paymentData.isOnHoldOrder || this.localStorageService.get('isOnHoldOrder') ?
                            this.DatalayerConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.ON_HOLD : this.DatalayerConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.DIRECT,
                        quantity: orderItemAmount,
                        precio: orderItemPrice
                    };
                }
            }

            for (const el in prodCount) {
                products.push(prodCount[el]);
            }

            return products;
        };
        if (paymentData.paymentInfo.selectedCard) {
            confirmationDatalayerInfo.generalInfo[this.DatalayerGeneralConstants.PAYMENT_METHOD] = paymentData.paymentInfo.selectedCard.cardTypeCode;
        }
        confirmationDatalayerInfo.generalInfo[this.DatalayerGeneralConstants.VOUCHER_USED] = (issueOrderData.paymentMethod &&
            (issueOrderData.paymentMethod.associatedDiscount && issueOrderData.paymentMethod.associatedDiscount.type === 'VOUCHER')) ||
            issueOrderData.paymentMethod.type === 'VOUCHER' ? this.DatalayerConstants.DATALAYER_VALUES.YES : this.DatalayerConstants.DATALAYER_VALUES.NO;
        if (issueOrderData.paymentMethod && issueOrderData.paymentMethod.associatedDiscount) {
            if (issueOrderData.paymentMethod.associatedDiscount.type === 'VOUCHER') {
                confirmationDatalayerInfo.generalInfo[this.DatalayerGeneralConstants.PAYMENT_METHOD] = this.DatalayerConstants.DATALAYER_VALUES.PAYMENT_METHODS.CASH_VOUCHER;
            } else {
                if (issueOrderData.paymentMethod.associatedDiscount.type === 'AVIOS') {
                    confirmationDatalayerInfo.generalInfo[this.DatalayerGeneralConstants.PAYMENT_METHOD] = this.DatalayerConstants.DATALAYER_VALUES.PAYMENT_METHODS.CASH_AVIOS;
                } else {
                    confirmationDatalayerInfo.generalInfo[this.DatalayerGeneralConstants.PAYMENT_METHOD] = this.DatalayerConstants.DATALAYER_VALUES.PAYMENT_METHODS.CASH;
                }
            }
        } else {
            if (issueOrderData.paymentMethod.type === 'VOUCHER') {
                confirmationDatalayerInfo.generalInfo[this.DatalayerGeneralConstants.PAYMENT_METHOD] = this.DatalayerConstants.DATALAYER_VALUES.PAYMENT_METHODS.VOUCHER;
            } else {
                confirmationDatalayerInfo.generalInfo[this.DatalayerGeneralConstants.PAYMENT_METHOD] = this.DatalayerConstants.DATALAYER_VALUES.PAYMENT_METHODS.CASH;
            }
        }
        // confirmationDatalayerInfo.ecommerce[this.DatalayerGeneralConstants.CURRENCY] = paymentData.currencyCode;
        // confirmationDatalayerInfo.ecommerce[this.DatalayerConstants.DATALAYER_ECOMMERCE.TRANSACTION] = getTransaction(issueOrderData.order, fareData);
        // confirmationDatalayerInfo.ecommerce[this.DatalayerConstants.DATALAYER_ECOMMERCE.PRODUCTS] = getProducts(issueOrderData.order, originDestinationData, paymentData);
        return confirmationDatalayerInfo;
    };

    /**
     * Generates the confirmation info of datalayer and stores it in session storage
     * @param ancillariesAction
     */
    setAncillariesAction = (ancillariesAction: object): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const confirmationDatalayerInfo = this.localStorageService.get('confirmationDatalayerInfo') || {};
        confirmationDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_ACTION] = ancillariesAction;
        this.localStorageService.set('confirmationDatalayerInfo', confirmationDatalayerInfo);
        /* FINISH DELETE GA4 MIGRATION*/
    };

    /* INIT DELETE GA4 MIGRATION*/
    generateConfirmationDatalayerObject = (): void => {
        const confirmationDatalayerInfo: object = this.localStorageService.get('confirmationDatalayerInfo') || {};
        const paymentsInfo: any = this.localStorageService.get('paymentsInfo');
        const pmtModel: any = this.localStorageService.get('pmtModelInfo');
        const datalayerProcess = this.getProcessFromQuadrigam(pmtModel.quadrigams.confirmation);
        datalayerProcess && (confirmationDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.PROCESS] = datalayerProcess);
        confirmationDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.STEP] = this.getStepFromQuadrigam(pmtModel.quadrigams.confirmation, this.DatalayerConstants.DATALAYER_VIEWS.CONFIRMATION);
        this.DataLayerService.removeDatalayerGeneralInfo([this.DatalayerConstants.DATALAYER_INFO.OFFERED_CASH_AVIOS, this.DatalayerConstants.DATALAYER_INFO.OFFERED_VOUCHER]);
        delete confirmationDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.OFFERED_CASH_AVIOS];
        delete confirmationDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.OFFERED_VOUCHER];
        confirmationDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.USED_CASH_AVIOS] = paymentsInfo?.appliedDiscounts?.types?.AVIOS ? 'si' : 'no';
        confirmationDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.USED_VOUCHER] = paymentsInfo?.appliedDiscounts?.types?.VOUCHER ? 'si' : 'no';
        this.updateDatalayerWithQuadrigam(pmtModel.quadrigams.confirmation, confirmationDatalayerInfo, this.localStorageService.get('userLogged'));
        this.localStorageService.set('confirmationDatalayerInfo', confirmationDatalayerInfo);
    };
    /* FINISH DELETE GA4 MIGRATION*/
    generateConfirmationDigitalDataObject = (): void => {
        const confirmationDatalayerInfo: object = this.localStorageService.get('confirmationDigitalInfo') || {};
        const paymentsInfo: any = this.localStorageService.get('paymentsInfo');
        const pmtModel: any = this.localStorageService.get('pmtModelInfo');
        const digitalDataProcess = this.getProcessFromQuadrigam(pmtModel.quadrigams.confirmation);
        digitalDataProcess && (confirmationDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.PROCESS] = digitalDataProcess);
        confirmationDatalayerInfo[this.DatalayerGeneralConstants.STEP] = this.getStepFromQuadrigam(pmtModel.quadrigams.confirmation, this.DatalayerConstants.DATALAYER_VIEWS.CONFIRMATION);
        this.DigitalDataService.removeDigitalDataInfo([this.DatalayerBKIConstants.CASH_AVIOS_OFFER, this.DatalayerGeneralConstants.VOUCHER_SHOWN]);
        delete confirmationDatalayerInfo[this.DatalayerBKIConstants.CASH_AVIOS_OFFER];
        delete confirmationDatalayerInfo[this.DatalayerGeneralConstants.VOUCHER_SHOWN];
        confirmationDatalayerInfo[this.DatalayerGeneralConstants.CASH_AVIOS_USED] = paymentsInfo?.appliedDiscounts?.types?.AVIOS ? 'si' : 'no';
        confirmationDatalayerInfo[this.DatalayerGeneralConstants.VOUCHER_USED] = paymentsInfo?.appliedDiscounts?.types?.VOUCHER ? 'si' : 'no';
        this.updateDigitalDataWithQuadrigam(pmtModel.quadrigams.confirmation, confirmationDatalayerInfo, this.localStorageService.get('userLogged'));
        this.localStorageService.set('confirmationDigitalInfo', confirmationDatalayerInfo);
    };

    /**
     * Generates numberPassengers for DatalayerInfo if the user add new passengers to search flights
     * @param passengers
     */
    getPassengersMetasearch = (passengers: CommonsDatalayerServiceTypes.PassengerDatalayer[]) :CommonsDatalayerServiceTypes.PassengerInfoDatalayer => {
        const passengersInfo :CommonsDatalayerServiceTypes.PassengerInfoDatalayer= { numberPassengers: 0, numberPassengrsWithoutInfant: 0, numAdults: 0, numChilds:0, numInfant: 0,  numSeniors:0, numYoung:0, numTeenager:0 };
        let infantCount:number = 0;
        for (let i = 0; i < passengers.length; i++) {
            passengersInfo.numberPassengers = passengersInfo.numberPassengers + parseInt(String(passengers[i].count));
            if (passengers[i].passengerType === this.CommonsConstants.passengerTypes.infant) {
                infantCount = passengers[i].count;
                passengersInfo.numInfant = passengers[i].count;
            } else if (passengers[i].passengerType === this.CommonsConstants.passengerTypes.child) {
                passengersInfo.numChilds = passengers[i].count;
            } else if (passengers[i].passengerType === this.CommonsConstants.passengerTypes.young) {
                passengersInfo.numYoung = passengers[i].count;
            } else if (passengers[i].passengerType === this.CommonsConstants.passengerTypes.adult) {
                passengersInfo.numAdults = passengers[i].count;
            } else if (passengers[i].passengerType === this.CommonsConstants.passengerTypes.senior) {
                passengersInfo.numSeniors = passengers[i].count;
            }
        }
        passengersInfo.numberPassengrsWithoutInfant = passengersInfo.numberPassengers - infantCount;
        return passengersInfo;
    };


    /**
     * Adds to datalayer the information required by the booking
     * @param {Object} bookingInfo the booking information recovery from retrieve order service
     */
    updateTripDetailsDatalayerObject = (bookingInfo): void => {
        const datalayerObject = {};
        let passengersTypes = '', passengerCount = 0, segmentsAirports = '', segmentsDates = '', segmentsOperators = '';
        for (let i = 0; i < bookingInfo.passengers.length; i++) {
            passengersTypes += (passengersTypes.length === 0 ? '' : '-') + this.DatalayerConstants.DATALAYER_PASSENGER_TYPES[bookingInfo.passengers[i].passengerType];
            if (bookingInfo.passengers[i].passengerType !== this.DatalayerConstants.PASSENGERS_TYPES.INFANT) {
                passengerCount++;
            }
        }
        for (let i = 0; i < bookingInfo.order.slices.length; i++) {
            for (let j = 0; j < bookingInfo.order.slices[i].segments.length; j++) {
                segmentsAirports += (segmentsAirports.length === 0 ? '' : '-') + bookingInfo.order.slices[i].segments[j].departure.code + '-' + bookingInfo.order.slices[i].segments[j].arrival.code;
                segmentsDates += (segmentsDates.length === 0 ? '' : '-');
                if (bookingInfo.order.slices[i].segments[j].type !== this.DatalayerConstants.SEGMENT_TYPES.OPEN) {
                    if (bookingInfo.order.slices[i].segments[j].departureDateTime && bookingInfo.order.slices[i].segments[j].arrivalDateTime) {
                        segmentsDates += bookingInfo.order.slices[i].segments[j].departureDateTime.split(' ')[0] + '-' + bookingInfo.order.slices[i].segments[j].arrivalDateTime.split(' ')[0];
                    }
                    segmentsOperators += (segmentsOperators.length === 0 ? '' : '-') + bookingInfo.order.slices[i].segments[j].flight.operationalDisclosure;
                } else {
                    segmentsDates += this.DatalayerConstants.DATALAYER_VALUES.SEGMENT_OPEN;
                }
            }
        }
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.PASSENGER_TYPES] = passengersTypes;
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TOTAL_PASSENGERS] = passengerCount;
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ORIGIN_DESTINATIONS] = segmentsAirports;
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_DATES] = segmentsDates;
        datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_OPERATORS] = segmentsOperators;
        this.addDataLayerInfo(datalayerObject);
    };

    /**
     * reset Datalayer
     */
    resetDatalayer = (): void => {
        const elementsDataLayer = [];
        const dataLayerModelVC: object = this.localStorageService.get('cvDatalayer');
        const userState: string = this.DatalayerConstants.DATALAYER_INFO.USER_STATE;
        const totalPriceWOutTax = this.DatalayerConstants.DATALAYER_VOLUNTARYCHANGES.TOTAL_PRICE_WITHOUT_TAX;
        const totalPrice = this.DatalayerConstants.DATALAYER_VOLUNTARYCHANGES.TOTAL_PRICE;
        Object.keys(dataLayerModelVC).forEach((element) => {
            if (element.toString() !== userState && element.toString() !== totalPriceWOutTax &&
                element.toString() !== totalPrice) {
                elementsDataLayer.push(element.toString());
            }
        });
        /* INIT DELETE GA4 MIGRATION*/
        this.removeDatalayerObjects(elementsDataLayer);
        /* FINISH DELETE GA4 MIGRATION*/
        this.removeDigitalDataObjects(elementsDataLayer);
    };

    /**
     * Updates datalayer info with the nedded ancillaries information
     * @param {Integer} baggagesPrice the total baggage price
     * @param {Integer} seatsPrice the total seat price
     * @param {Integer} insurancesPrice the total insurancesPrice
     */
    updateDatalayerActionForAncillaries = (eventCategory, eventAction, eventLabel): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const extendedDatalayerInfo = {};
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.EVENT_CATEGORY] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventCategory));
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.EVENT_ACTION] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventAction));
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.EVENT_LABEL] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventLabel));
        this.addDataLayerInfo(extendedDatalayerInfo);
        this.DataLayerService.callUpdateTagManager(this.DatalayerConstants.DATALAYER_EVENT_TYPES.LINK);
        /* FINISH DELETE GA4 MIGRATION*/
    };

    updateDatalayerEvent = (eventCategory, eventAction, eventLabel, eventName): void => {
        const extendedDigitalDataInfo = {};
        extendedDigitalDataInfo[this.DatalayerGeneralConstants.EVENT_CATEGORY] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventCategory));
        extendedDigitalDataInfo[this.DatalayerGeneralConstants.EVENT_ACTION] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventAction));
        extendedDigitalDataInfo[this.DatalayerGeneralConstants.EVENT_LABEL] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventLabel));
        extendedDigitalDataInfo[this.DatalayerGeneralConstants.EVENT_NAME] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventName));
        this.DigitalDataService.emitEvent('interaction', extendedDigitalDataInfo);
    };

    updateDatalayerViewEvent = (): void => {
        this.DigitalDataService.emitViewEvent();
    };

    updateDatalayerInteractionEvent = (): void => {
        this.DigitalDataService.emitInteractionEvent();
    };

    /**
     * Updates datalayer with taxes info
     */
    updateDatalayerWithTaxs = (data): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const result = {};
        /* FINISH DELETE GA4 MIGRATION*/
        const resultTax = {};
        /* INIT DELETE GA4 MIGRATION*/
        result[this.DatalayerConstants.DATALAYER_INFO.NOTAX] = this.addDecimalInPriceInfo(data.noTax);
        result[this.DatalayerConstants.DATALAYER_INFO.TOTALTAX] = this.addDecimalInPriceInfo(data.totalTax);
        this.addDataLayerInfo(result);
        /* FINISH DELETE GA4 MIGRATION*/
        resultTax[this.DatalayerBKIConstants.TOTAL_PRICE_WITHOUT_TAXES] = this.addDecimalInPriceInfo(data.noTax);
        resultTax[this.DatalayerBKIConstants.TOTAL_TAXES] = this.addDecimalInPriceInfo(data.totalTax);
        this.addDigitalDataInfo(resultTax);
    };

    private addDecimalInPriceInfo = (price: number): string => {
        return price && Number(price) ? price.toFixed(2) : '0';
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
                sliceData.tipoVuelo = this.DatalayerConstants.FLIGHT_CODE_TYPE.ROUND_TRIP;
            } else if (slicesArray.length < 2) {
                sliceData.tipoVuelo = this.DatalayerConstants.FLIGHT_CODE_TYPE.ONE_WAY;
            } else {
                sliceData.tipoVuelo = this.DatalayerConstants.FLIGHT_CODE_TYPE.MULTI_TRAJECT;
            }

            const initDate = dayjs(slices[slicesArray[0]].departureDateParsed.originalDate);
            const endDate = dayjs(slices[slicesArray[slicesArray.length - 1]].departureDateParsed.originalDate);
            sliceData.estanciaDestino = endDate.diff(initDate, 'days') as unknown as string;


            for (let fIndex = 0; fIndex < slicesArray.length; fIndex++) {

                if (slicesArray.length > 2) {
                    sliceData.departureDates.depTime += sliceData.departureDates.depTime.length === 0 ? slices[slicesArray[fIndex]].departureDateParsed.dateTime : '-' + slices[slicesArray[fIndex]].departureDateParsed.dateTime;
                } else {
                    sliceData.departureDates.depTime += sliceData.departureDates.depTime.length === 0 ? this.DatalayerConstants.DATALAYER_VALUES.DEPARTURE + ':' + slices[slicesArray[fIndex]].departureDateParsed.dateTime : '-' + this.DatalayerConstants.DATALAYER_VALUES.RETURN + ':' + slices[slicesArray[1]].departureDateParsed.dateTime;
                }

                sliceData.departureDates.depDate += fIndex === 0 ? slices[slicesArray[fIndex]].departureDateParsed.formatedDate : '-' + slices[slicesArray[fIndex]].departureDateParsed.formatedDate;

                for (let tIndex = 0; tIndex < slices[slicesArray[fIndex]].segments.length; tIndex++) {
                    if (slicesArray.length > 2) {
                        sliceData.fareFamily += sliceData.fareFamily.length === 0 ? slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily : '-' + slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily;
                    } else {
                        if (fIndex === 0) {
                            sliceData.fareFamily += sliceData.fareFamily.length === 0 ? this.DatalayerConstants.DATALAYER_VALUES.DEPARTURE + ':' + slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily : '-' + slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily;
                        } else {
                            returnFare += returnFare.length === 0 ? ';' + this.DatalayerConstants.DATALAYER_VALUES.RETURN + ':' + slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily : '-' + slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily;
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
                fFliyer: this.DatalayerConstants.DATALAYER_VALUES.NO,
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
                    paxData.types += paxData.types.length === 0 ? this.DatalayerConstants.DATALAYER_PASSENGER_TYPES[pax[p].type] : '|' + this.DatalayerConstants.DATALAYER_PASSENGER_TYPES[pax[p].type];
                }
                if (pax[p].type !== 'INFANT') {
                    paxData.number = paxData.number ? paxData.number += 1 : 1;
                    if (pax[p].loyaltyCard !== 'PASSENGER_INFO_NO_LOYALTY_CARD') {
                        paxData.fFliyer = this.DatalayerConstants.DATALAYER_VALUES.YES;
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
            tarifaBarata: sliceData.claseReserva.indexOf('R') > -1 ? this.DatalayerConstants.DATALAYER_VALUES.YES : this.DatalayerConstants.DATALAYER_VALUES.NO,
            tipoPax: paxData.types,
            tipoVuelo: sliceData.tipoVuelo,
            titularIberiaPlus: paxData.fFliyer,
            trayectoBuscado: confirmData.generalInfo.origin.code + ',' + confirmData.generalInfo.destination.code,
            trayectoPais: confirmData.generalInfo.origin.city.countryCode + '-' + confirmData.generalInfo.destination.city.countryCode
        };
        this.addDataLayerInfo(confDataLayer);
    };

    /**
     * Creates and feeds MMB datalayer_general with flight information (mainly flex/non flex flight info).
     * @param {*} pnrType
     * @param {*} flightsStatus
     * @param {*} orderItemsInfo
     * @param {*} flightType
     * @param {*} originalFlightDate
     * @param {*} originalIssueDate
     * @param {*} anticipationDays
     * @param {*} voucherDiscount
     * @param {*} daysInDestination
     */
    updateDatalayerForFlexFlights = (pnrType, flightsStatus, orderItemsInfo, flightType, originalFlightDate,
        originalIssueDate, anticipationDays, voucherDiscount, daysInDestination, aviosRedeemed, passengersInfo,
        originDestinations, countries, cabinClass, stopsPerSlice, identifierList, carrier, pricesInfo) => {
        const datalayerObject = {};

        pnrType ? datalayerObject[this.DatalayerConstants.DATALAYER_INFO.PNR_TYPE] = pnrType : angular.noop;
        flightsStatus ? datalayerObject[this.DatalayerConstants.DATALAYER_INFO.FLIGHTS_STATUS] = flightsStatus : angular.noop;
        flightType ? datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TRIP_TYPE] = flightType : angular.noop;
        originalFlightDate ? datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ORIGINAL_FLIGHT_DATE] = originalFlightDate : angular.noop;
        originalIssueDate ? datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ISSUE_DATE] = originalIssueDate : angular.noop;
        anticipationDays ? datalayerObject[this.DatalayerConstants.DATALAYER_INFO.DIFFERENCE_BETWEEN_ORIGINAL_AND_NEW_DATES] = anticipationDays : angular.noop;
        voucherDiscount ? datalayerObject[this.DatalayerConstants.DATALAYER_INFO.VOUCHER_DISCOUNT_AMOUNT] = voucherDiscount : angular.noop;
        daysInDestination ? datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ORIGINAL_DESTINATION_STAY] = daysInDestination : angular.noop;
        aviosRedeemed ? datalayerObject[this.DatalayerConstants.DATALAYER_INFO.AVIOS_DISCOUNT_AMOUNT] = aviosRedeemed : angular.noop;
        countries ? datalayerObject[this.DatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP] = countries : angular.noop;
        originDestinations ? datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ORIGIN_DESTINATIONS] = originDestinations : angular.noop;
        cabinClass ? datalayerObject[this.DatalayerConstants.DATALAYER_INFO.CABINS] = cabinClass : angular.noop;
        stopsPerSlice ? datalayerObject[this.DatalayerConstants.DATALAYER_INFO.STOPS_NUMBER] = stopsPerSlice : angular.noop;
        identifierList ? datalayerObject[this.DatalayerConstants.DATALAYER_INFO.FLIGHTS_NUMBER] = identifierList : angular.noop;
        carrier ? datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_OPERATORS] = carrier : angular.noop;

        if (passengersInfo) {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TOTAL_PASSENGERS] = passengersInfo.totalAmount;
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.NUM_ADDULTS] = passengersInfo.adults;
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.NUM_CHILDS] = passengersInfo.kids;
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.NUM_INFANTS] = passengersInfo.babies;
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.NUM_SENIOR] = passengersInfo.seniors;
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.NUM_YOUNG] = passengersInfo.young;
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.NUM_TENNEAGER] = passengersInfo.teenagers;
        }

        if (orderItemsInfo.hasSeats) {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_SEATS] = this.DatalayerConstants.DATALAYER_VALUES.YES + '-' + orderItemsInfo.seatsPrice;
        } else {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_SEATS] = this.DatalayerConstants.DATALAYER_VALUES.NO;
        }

        if (orderItemsInfo.hasBaggages) {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_BAGGAGES] = this.DatalayerConstants.DATALAYER_VALUES.YES + '-' + orderItemsInfo.baggagesPrice;
        } else {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_BAGGAGES] = this.DatalayerConstants.DATALAYER_VALUES.NO;
        }

        if (orderItemsInfo.hasInsurance) {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_INSURANCES] = this.DatalayerConstants.DATALAYER_VALUES.YES + '-' + orderItemsInfo.insurancePrice;
        } else {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.ANCILLARIES_INSURANCES] = this.DatalayerConstants.DATALAYER_VALUES.NO;
        }

        if (orderItemsInfo.hasSpecialNeeds) {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SPECIAL_NEEDS] = this.DatalayerConstants.DATALAYER_VALUES.YES;
        } else {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SPECIAL_NEEDS] = this.DatalayerConstants.DATALAYER_VALUES.NO;
        }

        if (orderItemsInfo.hasSpecialMeal) {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SPECIAL_MEALS] = this.DatalayerConstants.DATALAYER_VALUES.YES;
        } else {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.SPECIAL_MEALS] = this.DatalayerConstants.DATALAYER_VALUES.NO;
        }

        if (pricesInfo) {
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.TOTALTAX] = pricesInfo.totalTax;
            datalayerObject[this.DatalayerConstants.DATALAYER_INFO.NOTAX] = pricesInfo.noTax;
        }

        this.addDataLayerInfo(datalayerObject);
    };

    /**
    * Creates and feeds MMB digital_data with flight information (mainly flex/non flex flight info).
    * @param {*} aviosEarned
    * @param {*} changeAcceptance
    * @param {*} changeType
    * @param {*} flightStatus
    * @param {*} originalAdvancePurchase
    * @param {*} originalDate
    * @param {*} originalLengthStay
    * @param {*} pnrType
    * @param {*} purchaseDate
    * @param {*} purchaseType
    * @param {*} slice1OriginalDate
    * @param {*} slice2OriginalDate
    * @param {*} slice3OriginalDate
    * @param {*} slice4OriginalDate
    * @param {*} specialMeal
    */
    updateDigitalDataForFlexFlights = (objectDigitalDataForFlexFlights) => {
        const digitalDataObject = {};
        objectDigitalDataForFlexFlights.aviosEarned !== null ? digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.AVIOS_EARNED ] = objectDigitalDataForFlexFlights.aviosEarned : angular.noop;
        if(objectDigitalDataForFlexFlights.changeAcceptance!== null){
            objectDigitalDataForFlexFlights.changeAcceptance ? digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.CHANGE_ACCEPTANCE ] = this.DatalayerMMBConstants.DATALAYER_MMB_VALUES.TOTAL : digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.CHANGE_ACCEPTANCE ] = this.DatalayerMMBConstants.DATALAYER_MMB_VALUES.PARTIAL;
        }
        objectDigitalDataForFlexFlights.changeType === 'ISSUED' ? digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.CHANGE_TYPE ] = this.DatalayerMMBConstants.DATALAYER_MMB_VALUES.VOLUNTARY : digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.CHANGE_TYPE ] = this.DatalayerMMBConstants.DATALAYER_MMB_VALUES.INVOLUTARY;
        digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.FLIGHT_STATUS ] = objectDigitalDataForFlexFlights.flightStatus;
        digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.ORIGINAL_ADVANCE_PURCHASE ] = objectDigitalDataForFlexFlights.originalAdvancePurchase;
        digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.ORIGINAL_DATE ] = objectDigitalDataForFlexFlights.originalDate;
        objectDigitalDataForFlexFlights.originalLengthStay !== null ? digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.ORIGINAL_LENGTH_STAY ] = objectDigitalDataForFlexFlights.originalLengthStay : angular.noop;
        digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.PNR_TYPE ] = objectDigitalDataForFlexFlights.pnrType;
        digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.PURCHASE_DATE ] = objectDigitalDataForFlexFlights.purchaseDate;
        objectDigitalDataForFlexFlights.purchaseType !== null ? digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.PURCHASE_TYPE ] = objectDigitalDataForFlexFlights.purchaseType : angular.noop;
        objectDigitalDataForFlexFlights.slice1OriginalDate !== null ? digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.SLICE1_ORIGINAL_DATE ] = objectDigitalDataForFlexFlights.slice1OriginalDate : angular.noop;
        objectDigitalDataForFlexFlights.slice2OriginalDate !== null ? digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.SLICE2_ORIGINAL_DATE ] = objectDigitalDataForFlexFlights.slice2OriginalDate : angular.noop;
        objectDigitalDataForFlexFlights.slice3OriginalDate !== null ? digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.SLICE3_ORIGINAL_DATE ] = objectDigitalDataForFlexFlights.slice3OriginalDate : angular.noop;
        objectDigitalDataForFlexFlights.slice4OriginalDate !== null ? digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.SLICE4_ORIGINAL_DATE ] = objectDigitalDataForFlexFlights.slice4OriginalDate : angular.noop;
        digitalDataObject[ this.DatalayerMMBConstants.DATALAYER_MMB_INFO.SPECIAL_MEAL ] = objectDigitalDataForFlexFlights.specialMeal === true ? this.DatalayerMMBConstants.DATALAYER_MMB_VALUES.YES : this.DatalayerMMBConstants.DATALAYER_MMB_VALUES.NO;

        objectDigitalDataForFlexFlights.voucherDiscount ? digitalDataObject[ this.DatalayerBKIConstants.VOUCHER_DISCOUNT ] = objectDigitalDataForFlexFlights.voucherDiscount : angular.noop;
        objectDigitalDataForFlexFlights.aviosRedeemed ? digitalDataObject[ this.DatalayerBKIConstants.AVIOS_DISCOUNT ] = objectDigitalDataForFlexFlights.aviosRedeemed : angular.noop;
        objectDigitalDataForFlexFlights.flightType ? digitalDataObject[ this.DatalayerBKIConstants.FLIGHT_TYPE ] = objectDigitalDataForFlexFlights.flightType : angular.noop;
        objectDigitalDataForFlexFlights.rolCip ? digitalDataObject[ this.DatalayerGeneralConstants.ROL_CIP ] = objectDigitalDataForFlexFlights.rolCip : angular.noop;

        objectDigitalDataForFlexFlights.currency ? digitalDataObject[ this.DatalayerGeneralConstants.CURRENCY ] = objectDigitalDataForFlexFlights.currency : angular.noop;
        objectDigitalDataForFlexFlights.reference ? digitalDataObject[ this.DatalayerGeneralConstants.REFERENCE ] = objectDigitalDataForFlexFlights.reference : this.localStorageService.get('ib-booking-app.PNR');
        objectDigitalDataForFlexFlights.bookingClass ? digitalDataObject[ this.DatalayerGeneralConstants.BOOKING_CLASS ] = objectDigitalDataForFlexFlights.bookingClass : angular.noop;
        objectDigitalDataForFlexFlights.airportSeg ? digitalDataObject[ this.DatalayerGeneralConstants.ORIGIN_DESTINATIONS ] = objectDigitalDataForFlexFlights.airportSeg : angular.noop;
        if ( objectDigitalDataForFlexFlights.passengersInfo ) {
            digitalDataObject[ this.DatalayerBKIConstants.PAX_TOTAL ] = objectDigitalDataForFlexFlights.passengersInfo.totalAmount;
            digitalDataObject[ this.DatalayerBKIConstants.PAX_ADULT ] = objectDigitalDataForFlexFlights.passengersInfo.adults;
            digitalDataObject[ this.DatalayerBKIConstants.PAX_CHILD ] = objectDigitalDataForFlexFlights.passengersInfo.kids;
            digitalDataObject[ this.DatalayerBKIConstants.PAX_INFANT ] = objectDigitalDataForFlexFlights.passengersInfo.babies;
            digitalDataObject[ this.DatalayerBKIConstants.PAX_SENIOR ] = objectDigitalDataForFlexFlights.passengersInfo.seniors;
            digitalDataObject[ this.DatalayerBKIConstants.PAX_YOUNG ] = objectDigitalDataForFlexFlights.passengersInfo.young;
        }
        if ( objectDigitalDataForFlexFlights.pricesInfo ) {
            digitalDataObject[ this.DatalayerBKIConstants.TOTAL_TAXES ] = this.addDecimalInPriceInfo(objectDigitalDataForFlexFlights.pricesInfo.totalTax);
            digitalDataObject[ this.DatalayerBKIConstants.TOTAL_PRICE_WITHOUT_TAXES ] = this.addDecimalInPriceInfo(objectDigitalDataForFlexFlights.pricesInfo.noTax);
        }

        this.addDigitalDataInfo( digitalDataObject );
    };

    /**
     * Creates and feeds MMB datalayer_general with flight information (mainly flex/non flex flight info).
     * @param {*} info
     */
    updateSlicesDatalayerForFlexFlights = (info, summary) => {
        const slices = info.order.slices;
        const datalayerObject = {};
        let hauls;
        for(let i = 0; i < slices.length; i++) {
            datalayerObject[`slice${i+1}Origin`] = slices[i].segments[0].departure.code;
            datalayerObject[`slice${i+1}Destination`] = slices[i].segments[slices[i].stopsNumber].arrival.code;
            datalayerObject[`slice${i+1}Cabin`] = slices[i].segments[0].cabin.bookingClass;
            datalayerObject[`slice${i+1}FareRegistration`] = slices[i].segments[0].cabin.fareFamily;
            datalayerObject[`slice${i+1}Stops`] = slices[i].stopsNumber;
            if(slices[i].departureDateTime){
                let departureYear = slices[i].departureDateTime.substring(0, 4);
                let departureMonth = slices[i].departureDateTime.substring(5, 7);
                let departureDay = slices[i].departureDateTime.substring(8, 10);
                datalayerObject[`slice${i+1}Date`] = departureDay + '/' + departureMonth + '/' + departureYear;
                let departureHour = slices[i].departureDateTime.substring(11, 13);
                let departureMinute = slices[i].departureDateTime.substring(14, 16);
                datalayerObject[`slice${i+1}Hour`] = departureHour + ':' + departureMinute;
            }
            let sliceRoute = slices[i].segments[0].departure.city.code + '-' + slices[i].segments[0].arrival.city.code;
            for(let j = 1; j < slices[i].segments.length; j++){
                sliceRoute = sliceRoute + '-' + slices[i].segments[j].arrival.city.code;
            }
            datalayerObject[`slice${i+1}Route`] = sliceRoute;
            if(summary!==null) {
                hauls = summary.context.segments;
                for(let j = 0; j < hauls.length; j++) {
                    if(hauls[j].departureDate === slices[i].departureDateTime) {
                        if(hauls[j].haul === 'SH' || hauls[j].haul === 'DO' || hauls[j].haul === 'Corto Radio') {
                            datalayerObject[`slice${i+1}Haul`] = this.DatalayerConstants.FLIGHT_RATIO_TYPES.SHORT;
                        } else if(hauls[j].haul === 'MH' || hauls[j].haul === 'Medio Radio') {
                            datalayerObject[`slice${i+1}Haul`] = this.DatalayerConstants.FLIGHT_RATIO_TYPES.MEDIUM;
                        } else if(hauls[j].haul === 'LH' || hauls[j].haul === 'Largo Radio') {
                            datalayerObject[`slice${i+1}Haul`] = this.DatalayerConstants.FLIGHT_RATIO_TYPES.LONG;
                        }
                    }
                }
                if(sessionStorage.getItem('ib-booking-app.fareFamilyConditionsInfo')!==null){
                    JSON.parse(sessionStorage.getItem('ib-booking-app.fareFamilyConditionsInfo')).forEach((fare, index) => {
                        if(fare.commercialCode === datalayerObject[`slice${i+1}FareRegistration`]) {
                            let sanitizeFareFamilyName =  this.$filter('EliminateAccentFilter')(fare.commercialNameES);
                            datalayerObject[`slice${i+1}FareFamilyName`] = sanitizeFareFamilyName.split('-')
                                .map((word) => this.$filter('CapitalLetterFilter')(word)).join(' ');
                        }
                    });
                }
            } else {
                datalayerObject[`slice${i+1}Haul`] = null;
                datalayerObject[`slice${i+1}FareFamilyName`] = null;
            }
        }
        this.addDataLayerInfo(datalayerObject);
    };
    updateAircraft = (aircraft:CommonsDatalayerServiceTypes.AircraftDatalayer):void =>{
        /* INIT DELETE GA4 MIGRATION: CKI*/
        const extendedDatalayerInfo = {};
        if (angular.isObject(aircraft)) {
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.AIRCRAFT] = aircraft;
            this.addDataLayerInfo(extendedDatalayerInfo);
        }
        /* FINISH DELETE GA4 MIGRATION*/
    };

    updatePnr = (pnr:CommonsDatalayerServiceTypes.PnrDataLayer):void =>{
        /* INIT DELETE GA4 MIGRATION*/
        const extendedDatalayerInfo = {};
        if (angular.isObject(pnr)) {
            extendedDatalayerInfo[this.DatalayerConstants.PNR_INFO.PROVIDER] = pnr.provider;
            extendedDatalayerInfo[this.DatalayerConstants.PNR_INFO.REFERENCE] = pnr.reference;
            this.addDataLayerInfo(extendedDatalayerInfo);
        }
        /* FINISH DELETE GA4 MIGRATION*/
        const extendedDigitalDataInfo = {};
        if (angular.isObject(pnr)) {
            extendedDigitalDataInfo[this.DatalayerBKIConstants.PROVIDER] = pnr.provider;
            extendedDigitalDataInfo[this.DatalayerGeneralConstants.REFERENCE] = pnr.reference;
            this.addDigitalDataInfo(extendedDigitalDataInfo);
        }
    };

    setAncillariesDatalayer = ():void =>{
        const quantyTotalAncillaries = () => {

            if (headerModel.headerModel.shoppingBasket.baggages.hasBaggage) {
                for (let i = 0; i < headerModel.headerModel.shoppingBasket.baggages.segments.length; i++) {
                    for (let j = 0; j < headerModel.headerModel.shoppingBasket.baggages.segments[i].baggages.length; j++) {
                        totalQuantityBaggage += headerModel.headerModel.shoppingBasket.baggages.segments[i].baggages[j].quanty;
                    }
                }
            }
            if (headerModel.headerModel.shoppingBasket.seats.hasSeats) {
                for (let i = 0; i < headerModel.headerModel.shoppingBasket.seats.segments.length; i++) {
                    totalQuantitySeats += headerModel.headerModel.shoppingBasket.seats.segments[i].quanty;
                }
            }
            if (headerModel.headerModel.shoppingBasket.insurance.hasInsurance) {
                insuranceType = headerModel.headerModel.shoppingBasket.insurance.info.type;
            }
            if (headerModel.headerModel.shoppingBasket.speqs.hasSpeqs) {
                for (let i = 0; i < headerModel.headerModel.shoppingBasket.speqs.segments.length; i++) {
                    for (let j = 0; j < headerModel.headerModel.shoppingBasket.speqs.segments[i].speqs.length; j++) {
                        totalQuantitySpeqs += headerModel.headerModel.shoppingBasket.speqs.segments[i].speqs[j].quanty;
                    }
                }
            }
        };
        const headerModel:CommonsDatalayerServiceTypes.HeaderModel = this.localStorageService.get('headerModel');
        let insuranceType = '',
            totalQuantitySeats = 0,
            totalQuantityBaggage = 0,
            totalQuantitySpeqs = 0;
        quantyTotalAncillaries();

        /* INIT DELETE GA4 MIGRATION*/
        this.updateDatalayerForAncillaries(
            true,
            this.DatalayerConstants.DATALAYER_EVENT_TYPES.CLICK,
            totalQuantityBaggage,
            headerModel.headerModel.shoppingBasket.baggages.hasBaggage ? headerModel.headerModel.shoppingBasket.baggages.total.total : 0,
            totalQuantitySeats,
            headerModel.headerModel.shoppingBasket.seats.hasSeats ? headerModel.headerModel.shoppingBasket.seats.total.total : 0,
            insuranceType,
            headerModel.headerModel.shoppingBasket.insurance.hasInsurance ? headerModel.headerModel.shoppingBasket.insurance.total.total : 0,
            headerModel.headerModel.shoppingBasket.flexibilization.hasFlexibilization ? headerModel.headerModel.shoppingBasket.flexibilization.info.amount.price : 0,
            totalQuantitySpeqs,
            headerModel.headerModel.shoppingBasket.speqs.hasSpeqs ? headerModel.headerModel.shoppingBasket.speqs.total.total : 0
        );
        /* FINISH DELETE GA4 MIGRATION*/

        this.updateDigitalDataForAncillaries(
            true,
            this.DatalayerConstants.DATALAYER_EVENT_TYPES.CLICK,
            headerModel,
            insuranceType
        );
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
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.UPGRADE_SHOWN] = isUpgradeFree ?
            this.DatalayerConstants.DATALAYER_VALUES.FREE : this.DatalayerConstants.DATALAYER_VALUES.PAYMENT;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.UPGRADE_SENT] = upgradingAccepted && isOfferSelected
            ? this.DatalayerConstants.DATALAYER_VALUES.YES : this.DatalayerConstants.DATALAYER_VALUES.NO;
        if (isOfferSelected) {
            for (i = 0; i < selectedOffer.length; i++) {
                if (selectedOffer[i] && selectedOffer[i].offerSegmentClasses[0] && selectedOffer[i].offerSegmentClasses[0].cabinClass
                && selectedOffer[i].offerSegmentClasses[0].cabinClass.type) {
                    const actualSegmentBookingType = selectedOffer[i].offerSegmentClasses[0].cabinClass.type.charAt(0);
                    dataLayerBookingType = dataLayerBookingType === '' || this.DatalayerConstants.SEGMENT_CABIN_PRIORITY[dataLayerBookingType] > this.DatalayerConstants.SEGMENT_CABIN_PRIORITY[actualSegmentBookingType]
                        ? actualSegmentBookingType : dataLayerBookingType;
                }
                upgradeAmount += selectedOffer[i].totalAmount;
            }
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.BOOKING_CLASS] = dataLayerBookingType;
        }
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.UPGRADE_TOTAL] = upgradeAmount + currencySymbol;
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

    updateDatalayerWithEvents = (eventCategory, eventAction, eventLabel): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const extendedDatalayerInfo = {};
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.EVENT_CATEGORY] = eventCategory;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.EVENT_ACTION] = eventAction;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.EVENT_LABEL] = eventLabel;

        this.addDataLayerInfo(extendedDatalayerInfo);
        /* FINISH DELETE GA4 MIGRATION*/
        const extendedDigitalDataInfo = {};
        extendedDigitalDataInfo[this.DatalayerGeneralConstants.EVENT_CATEGORY] = eventCategory;
        extendedDigitalDataInfo[this.DatalayerGeneralConstants.EVENT_ACTION] = eventAction;
        extendedDigitalDataInfo[this.DatalayerGeneralConstants.EVENT_LABEL] = eventLabel;

        this.addDigitalDataInfo(extendedDigitalDataInfo);
    };
    /* INIT DELETE GA4 MIGRATION*/
    addDestinationInfoDatalayer = (destinationInfo:CommonsDatalayerServiceTypes.OriginDestinationDatalayer, slices) => {
        const extendedDatalayerInfo = {};
        const generalInfo : CommonsDatalayerServiceTypes.GeneralInfoDatalayer= this.localStorageService.get('bookingUrlParams');
        const bookingInfo:CommonsDatalayerServiceTypes.OriginDestinationDatalayer = this.localStorageService.get('originDestination');
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.OFFERDEST] = destinationInfo.destinationCity.code;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.OFFERDESTNAME] = destinationInfo.destinationCity.description;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.PROCESS] = this.DatalayerConstants.DATALAYER_FLASH_OFFERS.PROCESS;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ENTRY_POINT] = this.DatalayerConstants.LANG + '/' + this.DatalayerConstants.MARKET + '/' + this.DatalayerConstants.QUADRIGAMS.LANDING_FLASH;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.TRIP_TYPE] = slices.availabilityData.originDestinations.length === 2 ? this.DatalayerConstants.DATALAYER_VALUES.RETURN_TRIP : this.DatalayerConstants.DATALAYER_VALUES.ONE_WAY_TRIP;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_CITY] = destinationInfo.destinationCity.code;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_DEST] = destinationInfo.destinationCity.code;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_DEST_NAME] = destinationInfo.destinationCity.description;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_COUNTRY] = this.DatalayerConstants.MARKET;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_ORIGIN] = destinationInfo.originCity.code;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_ORIGIN_NAME] = destinationInfo.originCity.description;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ADVANCE_PURCHASE] =
        Math.round((new Date(bookingInfo.dates.formatedOutboundFlight).getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24)).toString();

        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.DESTINATION_STAY] =
        bookingInfo.dates.formatedReturnFlight && bookingInfo.dates.formatedOutboundFlight ?
            Math.round(((new Date(bookingInfo.dates.formatedReturnFlight).getTime() - new Date(bookingInfo.dates.formatedOutboundFlight).getTime()) / (1000 * 60 * 60 * 24))).toString() :
            '0';
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.LARGE_FAMILY] = generalInfo.largeFamilyType ?
            generalInfo.largeFamilyType : this.DatalayerConstants.DATALAYER_VALUES.NO;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_DATES] = this.generateTxtSegmentDates(destinationInfo.dates);
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.NUM_ADDULTS] = generalInfo.adult.toString();
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.TOTAL_PASSENGERS] = bookingInfo.numberPassengrsWithoutInfant.toString();
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.PASSENGER_PRICE] = this.calculatePassengersPrice();
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.RESIDENT] = generalInfo.resident ?
            generalInfo.resident : this.DatalayerConstants.DATALAYER_VALUES.NO;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.CHEAPER_FARE] = this.DatalayerConstants.DATALAYER_VALUES.NO;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCHED_TRIP] = '';
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP] = '';
        for (let oIndex = 0; oIndex < slices.availabilityData.originDestinations.length; oIndex++) {
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCHED_TRIP] +=
                (extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCHED_TRIP].length > 0 ? ',' : '') +
                slices.availabilityData.originDestinations[oIndex].origin.code;
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCHED_TRIP] +=
                slices.availabilityData.originDestinations.length > 1 ? '' : ((extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCHED_TRIP].length > 0 ? ',' : '') + slices.availabilityData.originDestinations[oIndex].destination.code);
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP] +=
                (extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP].length > 0 ? '-' : '') +
                slices.availabilityData.originDestinations[oIndex].originCity.country.code;
            extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP] +=
                slices.availabilityData.originDestinations.length > 1 ? '' : ((extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP].length > 0 ? '-' : '') + slices.availabilityData.originDestinations[oIndex].destinationCity.country.code);
        }
        this.addDataLayerInfo(extendedDatalayerInfo);

        this.updateDatalayerActionForAncillaries(
            this.DatalayerConstants.DATALAYER_INFO.FLASHOFFER,
            this.DatalayerConstants.DATALAYER_INFO.RESERVE_OFER,
            destinationInfo.destinationCity.code.toLowerCase());
    };
    /* FINISH DELETE GA4 MIGRATION*/

    addDestinationInfoDigitalData = (destinationInfo:CommonsDatalayerServiceTypes.OriginDestinationDatalayer, slices) => {
        const extendedDigitalDataInfo = {};
        const generalInfo : CommonsDatalayerServiceTypes.GeneralInfoDatalayer= this.localStorageService.get('bookingUrlParams');
        const bookingInfo:CommonsDatalayerServiceTypes.OriginDestinationDatalayer = this.localStorageService.get('originDestination');
        extendedDigitalDataInfo[this.DatalayerBKIConstants.OFFERDEST] = destinationInfo.destinationCity.code;
        extendedDigitalDataInfo[this.DatalayerBKIConstants.OFFERDESTNAME] = destinationInfo.destinationCity.description;
        extendedDigitalDataInfo[this.DatalayerBKIConstants.PROCESS] = this.DatalayerConstants.DATALAYER_FLASH_OFFERS.PROCESS;
        extendedDigitalDataInfo[this.DatalayerBKIConstants.PROCESS_START] = this.DatalayerConstants.LANG + '/' + this.DatalayerConstants.MARKET + '/' + this.DatalayerConstants.QUADRIGAMS.LANDING_FLASH;
        extendedDigitalDataInfo[this.DatalayerBKIConstants.FLIGHT_TYPE] = slices.availabilityData.originDestinations.length === 2 ? this.DatalayerConstants.DATALAYER_VALUES.RETURN_TRIP : this.DatalayerConstants.DATALAYER_VALUES.ONE_WAY_TRIP;
        extendedDigitalDataInfo[this.DatalayerBKIConstants.SEARCH_CITY] = destinationInfo.destinationCity.code;
        extendedDigitalDataInfo[this.DatalayerBKIConstants.SEARCH_DEST] = destinationInfo.destinationCity.code;
        extendedDigitalDataInfo[this.DatalayerBKIConstants.SEARCH_DEST_NAME] = destinationInfo.destinationCity.description;
        extendedDigitalDataInfo[this.DatalayerBKIConstants.SEARCH_COUNTRY] = this.DatalayerConstants.MARKET;
        extendedDigitalDataInfo[this.DatalayerBKIConstants.SEARCH_ORIGIN] = destinationInfo.originCity.code;
        extendedDigitalDataInfo[this.DatalayerBKIConstants.SEARCH_ORIGIN_NAME] = destinationInfo.originCity.description;
        extendedDigitalDataInfo[this.DatalayerBKIConstants.ADVANCE_PURCHASE] =
        Math.round((new Date(bookingInfo.dates.formatedOutboundFlight).getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24)).toString();

        extendedDigitalDataInfo[this.DatalayerBKIConstants.LENGTH_STAY] =
        bookingInfo.dates.formatedReturnFlight && bookingInfo.dates.formatedOutboundFlight ?
            Math.round(((new Date(bookingInfo.dates.formatedReturnFlight).getTime() - new Date(bookingInfo.dates.formatedOutboundFlight).getTime()) / (1000 * 60 * 60 * 24))).toString() :
            '0';
        extendedDigitalDataInfo[this.DatalayerBKIConstants.LARGE_FAMILY] = generalInfo.largeFamilyType ?
            generalInfo.largeFamilyType : this.DatalayerConstants.DATALAYER_VALUES.NO;
        //extendedDigitalDataInfo[this.DatalayerBKIConstants.SEGMENT_DATES] = destinationInfo.dates.formatedOutboundFlight+ '-' + destinationInfo.dates.formatedReturnFlight;
        extendedDigitalDataInfo[this.DatalayerBKIConstants.PAX_ADULT] = generalInfo.adult.toString();
        extendedDigitalDataInfo[this.DatalayerBKIConstants.PAX_TOTAL] = bookingInfo.numberPassengrsWithoutInfant.toString();
        extendedDigitalDataInfo[this.DatalayerBKIConstants.PAX_PRICE] = this.calculatePassengersPrice();
        extendedDigitalDataInfo[this.DatalayerBKIConstants.RESIDENT_CODE] = generalInfo.resident ?
            generalInfo.resident : this.DatalayerConstants.DATALAYER_VALUES.NO;
        extendedDigitalDataInfo[this.DatalayerBKIConstants.CHEAPEST_FARE] = this.DatalayerConstants.DATALAYER_VALUES.NO;
        extendedDigitalDataInfo[this.DatalayerBKIConstants.SEARCH_OD] = '';
        extendedDigitalDataInfo[this.DatalayerBKIConstants.SEARCH_COUNTRIES] = '';
        for (let oIndex = 0; oIndex < slices.availabilityData.originDestinations.length; oIndex++) {
            extendedDigitalDataInfo[this.DatalayerBKIConstants.SEARCH_OD] +=
                (extendedDigitalDataInfo[this.DatalayerBKIConstants.SEARCH_OD].length > 0 ? ',' : '') +
                slices.availabilityData.originDestinations[oIndex].origin.code;
            extendedDigitalDataInfo[this.DatalayerBKIConstants.SEARCH_OD] +=
                slices.availabilityData.originDestinations.length > 1 ? '' : ((extendedDigitalDataInfo[this.DatalayerBKIConstants.SEARCH_OD].length > 0 ? ',' : '') + slices.availabilityData.originDestinations[oIndex].destination.code);
            extendedDigitalDataInfo[this.DatalayerBKIConstants.SEARCH_COUNTRIES] +=
                (extendedDigitalDataInfo[this.DatalayerBKIConstants.SEARCH_COUNTRIES].length > 0 ? '-' : '') +
                slices.availabilityData.originDestinations[oIndex].originCity.country.code;
            extendedDigitalDataInfo[this.DatalayerBKIConstants.SEARCH_COUNTRIES] +=
                slices.availabilityData.originDestinations.length > 1 ? '' : ((extendedDigitalDataInfo[this.DatalayerBKIConstants.SEARCH_COUNTRIES].length > 0 ? '-' : '') + slices.availabilityData.originDestinations[oIndex].destinationCity.country.code);
        }
        this.addDigitalDataInfo(extendedDigitalDataInfo);

        this.updateDatalayerEvent(
            this.DatalayerConstants.DATALAYER_INFO.FLASHOFFER,
            this.DatalayerConstants.DATALAYER_INFO.RESERVE_OFER,
            destinationInfo.destinationCity.code.toLowerCase(),
            this.DatalayerGeneralConstants.EVENT_NAME_INTERACTION);
    };

    calculatePassengersPrice = ():string => {
        const fareData :CommonsDatalayerServiceTypes.FareDataDatalayer= this.localStorageService.get('fareData');
        let i, j, passengerPrice = '';
        if (fareData.offers && fareData.offers.length > 0) {
            for (i = 0; i < fareData.offers[0].offerItems.length; i++) {
                for (j = 0; j < fareData.offers[0].offerItems[i].passengerIds.length; j++) {
                    passengerPrice += (passengerPrice.length > 0 ? ' : ' : '') +
                    fareData.offers[0].offerItems[i].price.total;
                }
            }
        }
        return passengerPrice;
    };
    calculateCheaperFare = (slices):boolean => {
        let i, bestPriceSelected = true;
        for (i = 0; i < slices.selectedSlices.length; i++) {
            bestPriceSelected = bestPriceSelected && slices.selectedSlices[i].info.bestPrice
                && slices.selectedSlices[i].info.slicePrice === slices.selectedSlices[i].info.selectedFareFamily.farePriceToCalculate;
        }
        return bestPriceSelected;
    };

    updateDatalayerEvents = (eventCategory:string, eventAction:string, eventLabel:string, eventName: string = ''): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const extendedDatalayerInfo = {};
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.EVENT_CATEGORY] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventCategory));
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.EVENT_ACTION] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventAction));
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.EVENT_LABEL] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventLabel));
        this.addDataLayerInfo(extendedDatalayerInfo);
        this.DataLayerService.callUpdateTagManager(this.DatalayerConstants.DATALAYER_EVENT_TYPES.LINK);
        /* FINISH DELETE GA4 MIGRATION*/

        this.updateDatalayerEvent(this.$filter('EliminateHyphenFilter')(this.$filter('EliminateAccentFilter')(eventCategory)),
            this.$filter('EliminateHyphenFilter')(this.$filter('EliminateAccentFilter')(eventAction)),
            this.$filter('EliminateHyphenFilter')(this.$filter('EliminateAccentFilter')(eventLabel)),
            this.$filter('EliminateHyphenFilter')(this.$filter('EliminateAccentFilter')(eventName))
        );
        this.MonetateUtilsService.updateDigitalDataMonetate();
        this.$timeout(() => {
            this.$rootScope.$broadcast('sendUpdateToMonetate');
        });
    };

    checkModelCountryCode = (model: any): string => {
        const existCityCountryCode: boolean = model.city?.countryCode;
        const existCountryCode: boolean = model.country?.code;
        let countryCode: string = '';

        if(existCityCountryCode) {
            countryCode = model.city.countryCode;
        } else if(existCountryCode) {
            countryCode = model.country.code;
        }

        return countryCode;
    };

    /* INIT DELETE GA4 MIGRATION*/
    addShuttleDatalayer = (flowApp: string, model) => {
        const extendedDatalayerInfo = {};
        const generalInfo: CommonsDatalayerServiceTypes.GeneralInfoDatalayer= this.localStorageService.get('bookingUrlParams');
        const bookingInfo: CommonsDatalayerServiceTypes.OriginDestinationDatalayer = this.localStorageService.get('originDestination');
        const cardTypeSelected: CommonsDatalayerServiceTypes.TypeCardDatalayer = this.localStorageService.get('typeCardIberiaPay');
        const cardSelectedLogged: CommonsDatalayerServiceTypes.TypeCardDatalayer = this.localStorageService.get('selectedLoggedCard');
        const redemptionFlow: boolean = this.localStorageService.get('isRedemptionFlow');
        let departureCountryCode: string = '';
        let arrivalCountryCode: string = '';
        let typeSearch: string = this.CommonsUtilService.getTypeSearch();
        switch(flowApp) {
                case this.DatalayerConstants.FLOWS.SHUTTLE: {
                    if(bookingInfo.tripType === '2') {
                        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_CITY] = model.fareShuttleModel.slices[1].originCityCode;
                        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_DEST] = model.fareShuttleModel.slices[1].originCityCode;
                        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_DEST_NAME] = model.fareShuttleModel.slices[1].originCity;
                        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_DATES] = this.DatalayerConstants.SHUTTLE_OPEN + '-' + this.DatalayerConstants.SHUTTLE_OPEN;
                    } else {
                        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_CITY] = model.fareShuttleModel.slices[0].destinationCityCode;
                        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_DEST] = model.fareShuttleModel.slices[0].destinationCityCode;
                        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_DEST_NAME] = model.fareShuttleModel.slices[0].destinationCity;
                        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEGMENT_DATES] = this.DatalayerConstants.SHUTTLE_OPEN;
                    }
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_COUNTRY] = model.fareShuttleModel.marketCode;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_ORIGIN] = model.fareShuttleModel.slices[0].originCityCode;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_ORIGIN_NAME] = model.fareShuttleModel.slices[0].originCity;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ADVANCE_PURCHASE] = this.DatalayerConstants.SHUTTLE_OPEN;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.DESTINATION_STAY] = this.DatalayerConstants.SHUTTLE_OPEN;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.NUM_ADDULTS] = bookingInfo.numAdults.toString();
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.TOTAL_PASSENGERS] = bookingInfo.numAdults + bookingInfo.numChilds +
                        bookingInfo.numSeniors + bookingInfo.numTeenager + bookingInfo.numYoung;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ENTRY_POINT] = this.DatalayerConstants.LANG + '/' + this.DatalayerConstants.MARKET + '/' + this.DatalayerConstants.QUADRIGAMS.SHUTTLE_HOME;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.TRIP_TYPE] = bookingInfo.tripType === '2' ? this.DatalayerConstants.DATALAYER_VALUES.RETURN_TRIP : this.DatalayerConstants.DATALAYER_VALUES.ONE_WAY_TRIP;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCHED_TRIP] = '';
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP] = '';
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.FLIGHT_RATIO] = this.DatalayerConstants.FLIGHT_RATIO_TYPES.SHORT;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.OUTBOUND_ROUTE] = extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_ORIGIN] + ',' + extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_DEST];
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.RETURN_ROUTE] = extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_DEST] + ',' + extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCH_ORIGIN];
                    if(typeSearch && typeSearch.length > 0) {
                        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.TYPE_SEARCH] = typeSearch;
                    }
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.PROCESS] = this.CommonsUtilService.getProcess();
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.STEP] = this.DatalayerConstants.DATALAYER_VIEWS.DISPO;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.USER_SEGMENT] = bookingInfo.tripType;
                    for (let oIndex = 0; oIndex < model.fareShuttleModel.slices.length; oIndex++) {
                        departureCountryCode = this.checkModelCountryCode(model.fareShuttleModel.slices[oIndex].segments[0].departure);
                        arrivalCountryCode = this.checkModelCountryCode(model.fareShuttleModel.slices[oIndex].segments[0].arrival);

                        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCHED_TRIP] +=
                            (extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCHED_TRIP].length > 0 ? ',' : '') +
                            model.fareShuttleModel.slices[oIndex].originCityCode;
                        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCHED_TRIP] +=
                            model.fareShuttleModel.slices.length > 1 ? '' : ((extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.SEARCHED_TRIP].length > 0 ? ',' : '') + model.fareShuttleModel.slices[oIndex].destinationCityCode);
                        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP] +=
                            (extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP].length > 0 ? '-' : '') + departureCountryCode;
                        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP] +=
                            model.fareShuttleModel.slices.length > 1 ? '' : ((extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.COUNTRY_TRIP].length > 0 ? '-' : '') + arrivalCountryCode);
                    }
                    break;
                }
                case this.DatalayerConstants.FLOWS.PASSENGERS: {
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.DYNAMIC_PRICING_SEAT] = model.dynamicPricingSeat;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.DYNAMIC_PRICING] = '';
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.LARGE_FAMILY] = generalInfo.largeFamilyType ?
                        generalInfo.largeFamilyType : this.DatalayerConstants.DATALAYER_VALUES.NO;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.PASSENGER_PRICE] = this.calculatePassengersPrice();
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.RESIDENT] = generalInfo.resident ?
                        generalInfo.resident : this.DatalayerConstants.DATALAYER_VALUES.NO;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.ENTRY_POINT] = this.DatalayerConstants.LANG + '/' + this.DatalayerConstants.MARKET + '/' + generalInfo.searchOrigin;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.OUTBOUND_RESULTS] = 1;
                    bookingInfo.tripType=== '2' ? extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.INBOUND_RESULTS] = 1: '';
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.CHEAPER_FARE] = this.DatalayerConstants.DATALAYER_VALUES.NO;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.QUADRIGAM] = redemptionFlow ? this.DatalayerConstants.QUADRIGAMS.SHUTTLE_REDEMPTION_PASSENGERS:this.DatalayerConstants.QUADRIGAMS.SHUTTLE_PASSENGERS_CODE;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.CODE] = this.LANG + '/' + this.MARKET + '/' + extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.QUADRIGAM];
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.STEP] = this.DatalayerConstants.DATALAYER_VIEWS.PASSENGERS;
                    break;
                }
                case this.DatalayerConstants.FLOWS.PAYMENTS: {
                    const paymentsInfo: any = this.localStorageService.get('paymentsInfo');
                    this.setAncillariesDatalayer();
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.QUADRIGAM] = redemptionFlow ? this.DatalayerConstants.QUADRIGAMS.SHUTTLE_REDEMPTION_PAYMENTS:this.DatalayerConstants.QUADRIGAMS.SHUTTLE_PAYMENTS;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.CODE] = this.LANG + '/' + this.MARKET + '/' + extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.QUADRIGAM];
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.STEP] = this.DatalayerConstants.DATALAYER_VIEWS.PAYMENTS;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.OFFERED_CASH_AVIOS] = paymentsInfo?.availableDiscounts?.AVIOS?.available || paymentsInfo?.appliedDiscounts?.types?.AVIOS ?
                        this.DatalayerConstants.DATALAYER_VALUES.YES : this.DatalayerConstants.DATALAYER_VALUES.NO;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.OFFERED_VOUCHER] = paymentsInfo?.availableDiscounts?.VOUCHER?.available || paymentsInfo?.appliedDiscounts?.types?.VOUCHER ? 'si' : 'no';

                    break;
                }
                case this.DatalayerConstants.FLOWS.CONFIRMATION: {
                    const paymentsInfo: any = this.localStorageService.get('paymentsInfo');
                    cardSelectedLogged ?
                        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.CREDITCARD_TYPE] = cardSelectedLogged.cardTypeCode:
                        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.CREDITCARD_TYPE] = cardTypeSelected;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.QUADRIGAM] = redemptionFlow ? this.DatalayerConstants.QUADRIGAMS.SHUTTLE_REDEMPTION_CONFIRMATION: this.DatalayerConstants.QUADRIGAMS.SHUTTLE_CONFIRMATION;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.CODE] = this.LANG + '/' + this.MARKET + '/' + extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.QUADRIGAM];
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.STEP] = this.DatalayerConstants.DATALAYER_VIEWS.CONFIRMATION;
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.USED_CASH_AVIOS] = paymentsInfo?.appliedDiscounts?.types?.AVIOS ? 'si' : 'no';
                    extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.USED_VOUCHER] = paymentsInfo?.appliedDiscounts?.types?.VOUCHER ? 'si' : 'no';

                    break;
                }
        }
        this.addDataLayerInfo(extendedDatalayerInfo);
    };
    /* FINISH DELETE GA4 MIGRATION*/
    addShuttleDigitalData = (flowApp: string, model) => {
        const extendedDatalayerInfo = {};
        const generalInfo: CommonsDatalayerServiceTypes.GeneralInfoDatalayer= this.localStorageService.get('bookingUrlParams');
        const bookingInfo: CommonsDatalayerServiceTypes.OriginDestinationDatalayer = this.localStorageService.get('originDestination');
        const cardTypeSelected: CommonsDatalayerServiceTypes.TypeCardDatalayer = this.localStorageService.get('typeCardIberiaPay');
        const cardSelectedLogged: CommonsDatalayerServiceTypes.TypeCardDatalayer = this.localStorageService.get('selectedLoggedCard');
        const redemptionFlow: boolean = this.localStorageService.get('isRedemptionFlow');
        let departureCountryCode: string = '';
        let arrivalCountryCode: string = '';

        switch(flowApp) {
                case this.DatalayerConstants.FLOWS.SHUTTLE: {
                    if(bookingInfo.tripType === '2') {
                        extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_CITY] = model.fareShuttleModel.slices[1].originCityCode;
                        extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_DEST] = model.fareShuttleModel.slices[1].originCityCode;
                        extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_DEST_NAME] = model.fareShuttleModel.slices[1].originCity;
                    } else {
                        extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_CITY] = model.fareShuttleModel.slices[0].destinationCityCode;
                        extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_DEST] = model.fareShuttleModel.slices[0].destinationCityCode;
                        extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_DEST_NAME] = model.fareShuttleModel.slices[0].destinationCity;
                    }
                    extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_COUNTRY] = model.fareShuttleModel.marketCode;
                    extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_ORIGIN] = model.fareShuttleModel.slices[0].originCityCode;
                    extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_ORIGIN_NAME] = model.fareShuttleModel.slices[0].originCity;
                    extendedDatalayerInfo[this.DatalayerBKIConstants.ADVANCE_PURCHASE] = this.DatalayerConstants.SHUTTLE_OPEN;
                    extendedDatalayerInfo[this.DatalayerBKIConstants.LENGTH_STAY] = this.DatalayerConstants.SHUTTLE_OPEN;
                    extendedDatalayerInfo[this.DatalayerBKIConstants.PAX_ADULT] = bookingInfo.numAdults.toString();
                    extendedDatalayerInfo[this.DatalayerBKIConstants.PAX_TOTAL] = bookingInfo.numAdults + bookingInfo.numChilds +
                        bookingInfo.numSeniors + bookingInfo.numTeenager + bookingInfo.numYoung;
                    extendedDatalayerInfo[this.DatalayerBKIConstants.PROCESS_START] = this.DatalayerConstants.LANG + '/' + this.DatalayerConstants.MARKET + '/' + this.DatalayerConstants.QUADRIGAMS.SHUTTLE_HOME;
                    extendedDatalayerInfo[this.DatalayerBKIConstants.FLIGHT_TYPE] = bookingInfo.tripType === '2' ? this.DatalayerConstants.DATALAYER_VALUES.RETURN_TRIP : this.DatalayerConstants.DATALAYER_VALUES.ONE_WAY_TRIP;
                    extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_OD] = '';
                    extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_COUNTRIES] = '';
                    extendedDatalayerInfo[this.DatalayerBKIConstants.FLIGHT_HAUL] = this.DatalayerConstants.FLIGHT_RATIO_TYPES.SHORT;
                    extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_TYPE] = this.CommonsUtilService.getTypeSearch();
                    extendedDatalayerInfo[this.DatalayerGeneralConstants.PROCESS] = this.CommonsUtilService.getProcess();
                    extendedDatalayerInfo[this.DatalayerGeneralConstants.STEP] = this.DatalayerConstants.DATALAYER_VIEWS.DISPO;
                    extendedDatalayerInfo[this.DatalayerGeneralConstants.USER_SEGMENT] = bookingInfo.tripType;
                    for (let oIndex = 0; oIndex < model.fareShuttleModel.slices.length; oIndex++) {
                        departureCountryCode = this.checkModelCountryCode(model.fareShuttleModel.slices[oIndex].segments[0].departure);
                        arrivalCountryCode = this.checkModelCountryCode(model.fareShuttleModel.slices[oIndex].segments[0].arrival);

                        extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_OD] +=
                            (extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_OD].length > 0 ? ',' : '') +
                            model.fareShuttleModel.slices[oIndex].originCityCode;
                        extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_OD] +=
                            model.fareShuttleModel.slices.length > 1 ? '' : ((extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_OD].length > 0 ? ',' : '') + model.fareShuttleModel.slices[oIndex].destinationCityCode);
                        extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_COUNTRIES] +=
                            (extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_COUNTRIES].length > 0 ? '-' : '') + departureCountryCode;
                        extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_COUNTRIES] +=
                            model.fareShuttleModel.slices.length > 1 ? '' : ((extendedDatalayerInfo[this.DatalayerBKIConstants.SEARCH_COUNTRIES].length > 0 ? '-' : '') + arrivalCountryCode);
                    }
                    break;
                }
                case this.DatalayerConstants.FLOWS.PASSENGERS: {
                    //extendedDatalayerInfo[this.DatalayerBKIConstants.DYNAMIC_PRICING_SEAT] = model.dynamicPricingSeat;
                    extendedDatalayerInfo[this.DatalayerBKIConstants.LARGE_FAMILY] = this.changeLargeFamilyValue(generalInfo.largeFamilyType);
                    extendedDatalayerInfo[this.DatalayerBKIConstants.PAX_PRICE] = this.calculatePassengersPrice();
                    extendedDatalayerInfo[this.DatalayerBKIConstants.RESIDENT_CODE] = generalInfo.resident ?
                        generalInfo.resident : this.DatalayerConstants.DATALAYER_VALUES.NO;
                    extendedDatalayerInfo[this.DatalayerBKIConstants.PROCESS_START] = this.DatalayerConstants.LANG + '/' + this.DatalayerConstants.MARKET + '/' + generalInfo.searchOrigin;
                    extendedDatalayerInfo[this.DatalayerBKIConstants.SLICE_1_RESULTS] = 1;
                    bookingInfo.tripType=== '2' ? extendedDatalayerInfo[this.DatalayerBKIConstants.SLICE_2_RESULTS] = 1: '';
                    extendedDatalayerInfo[this.DatalayerBKIConstants.CHEAPEST_FARE] = this.DatalayerConstants.DATALAYER_VALUES.NO;
                    extendedDatalayerInfo[this.DatalayerGeneralConstants.QUADRIGAM] = redemptionFlow ? this.DatalayerConstants.QUADRIGAMS.SHUTTLE_REDEMPTION_PASSENGERS:this.DatalayerConstants.QUADRIGAMS.SHUTTLE_PASSENGERS_CODE;
                    extendedDatalayerInfo[this.DatalayerGeneralConstants.CODE] = this.LANG + '/' + this.MARKET + '/' + extendedDatalayerInfo[this.DatalayerGeneralConstants.QUADRIGAM];
                    extendedDatalayerInfo[this.DatalayerGeneralConstants.STEP] = this.DatalayerConstants.DATALAYER_VIEWS.PASSENGERS;
                    break;
                }
                case this.DatalayerConstants.FLOWS.PAYMENTS: {
                    const paymentsInfo: any = this.localStorageService.get('paymentsInfo');
                    this.setAncillariesDatalayer();
                    extendedDatalayerInfo[this.DatalayerGeneralConstants.QUADRIGAM] = redemptionFlow ? this.DatalayerConstants.QUADRIGAMS.SHUTTLE_REDEMPTION_PAYMENTS: this.DatalayerConstants.QUADRIGAMS.SHUTTLE_PAYMENTS;
                    extendedDatalayerInfo[this.DatalayerGeneralConstants.CODE] = this.LANG + '/' + this.MARKET + '/' + extendedDatalayerInfo[this.DatalayerGeneralConstants.QUADRIGAM];
                    extendedDatalayerInfo[this.DatalayerGeneralConstants.STEP] = this.DatalayerConstants.DATALAYER_VIEWS.PAYMENTS;
                    extendedDatalayerInfo[this.DatalayerBKIConstants.CASH_AVIOS_OFFER] = paymentsInfo?.availableDiscounts?.AVIOS?.available || paymentsInfo?.appliedDiscounts?.types?.AVIOS ?
                        this.DatalayerConstants.DATALAYER_VALUES.YES : this.DatalayerConstants.DATALAYER_VALUES.NO;
                    extendedDatalayerInfo[this.DatalayerGeneralConstants.VOUCHER_SHOWN] = (paymentsInfo?.availableDiscounts?.VOUCHER?.available || paymentsInfo?.appliedDiscounts?.types?.VOUCHER) ? this.DatalayerConstants.DATALAYER_VALUES.YES : this.DatalayerConstants.DATALAYER_VALUES.NO;

                    break;
                }
                case this.DatalayerConstants.FLOWS.CONFIRMATION: {
                    const paymentsInfo: any = this.localStorageService.get('paymentsInfo');
                    cardSelectedLogged ?
                        extendedDatalayerInfo[this.DatalayerGeneralConstants.PAYMENT_METHOD] = cardSelectedLogged.cardTypeCode:
                        extendedDatalayerInfo[this.DatalayerGeneralConstants.PAYMENT_METHOD] = cardTypeSelected;
                    extendedDatalayerInfo[this.DatalayerGeneralConstants.QUADRIGAM] = redemptionFlow ? this.DatalayerConstants.QUADRIGAMS.SHUTTLE_REDEMPTION_CONFIRMATION :this.DatalayerConstants.QUADRIGAMS.SHUTTLE_CONFIRMATION;
                    extendedDatalayerInfo[this.DatalayerGeneralConstants.CODE] = this.LANG + '/' + this.MARKET + '/' + extendedDatalayerInfo[this.DatalayerGeneralConstants.QUADRIGAM];
                    extendedDatalayerInfo[this.DatalayerGeneralConstants.STEP] = this.DatalayerConstants.DATALAYER_VIEWS.CONFIRMATION;
                    extendedDatalayerInfo[this.DatalayerGeneralConstants.CASH_AVIOS_USED] = paymentsInfo?.appliedDiscounts?.types?.AVIOS ? 'si' : 'no';
                    extendedDatalayerInfo[this.DatalayerGeneralConstants.VOUCHER_USED] = paymentsInfo?.appliedDiscounts?.types?.VOUCHER ? 'si' : 'no';

                    break;
                }
        }
        this.addDigitalDataInfo(extendedDatalayerInfo);
    };

    updateDatalayerInfo = (quadrigam): void => {
        this.updateDatalayerWithQuadrigam(quadrigam, null, this.localStorageService.get('userLogged'));
        this.updateDigitalDataWithQuadrigam(quadrigam, null, this.localStorageService.get('userLogged'));
        this.sendDatalayerEvent(this.DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        this.$timeout(() => {
            this.$rootScope.$broadcast('updateDatalayer');
            this.$rootScope.$broadcast('sendUpdateToMonetate');
        });
    };

    generateBbkiDataPayments = (productsObject, issuedInfoData): void => {
        let ditialDataInfo;
        if (this.localStorageService.get('confirmationDigitalDataCallBack')) {
            ditialDataInfo = this.localStorageService.get('confirmationDigitalDataCallBack');
            this.localStorageService.remove('confirmationDigitalDataCallBack');
        } else {
            ditialDataInfo = {};
        }

        ditialDataInfo[this.DatalayerBKIConstants.PMR] = productsObject.generalInfo[this.DatalayerBKIConstants.PMR] ? this.DatalayerConstants.DATALAYER_VALUES.YES : this.DatalayerConstants.DATALAYER_VALUES.NO;
        ditialDataInfo[this.DatalayerGeneralConstants.ORDER_ID] = issuedInfoData.order.orderId;
        this.addDigitalDataInfo(ditialDataInfo);
    };

    generateBbkiRedemptionDataPayments = (productsObject, issuedInfoData): void => {
        let ditialDataInfo;
        if (this.localStorageService.get('confirmationDigitalDataCallBack')) {
            ditialDataInfo = this.localStorageService.get('confirmationDigitalDataCallBack');
            this.localStorageService.remove('confirmationDigitalDataCallBack');
        } else {
            ditialDataInfo = {};
        }

        ditialDataInfo[this.DatalayerBKIConstants.PMR] = productsObject.generalInfo[this.DatalayerBKIConstants.PMR] ? this.DatalayerConstants.DATALAYER_VALUES.YES : this.DatalayerConstants.DATALAYER_VALUES.NO;
        ditialDataInfo[this.DatalayerGeneralConstants.ORDER_ID] = issuedInfoData.order.orderId;
        this.addDigitalDataInfo(ditialDataInfo);
    };

    changeLargeFamilyValue = (largeFamilyType: string): string => {
        if(largeFamilyType === this.CommonsConstants.LARGE_FAMILY_TYPES[0].code){
            largeFamilyType = this.CommonsConstants.LARGE_FAMILY_TYPES[0].name;

        } else if(largeFamilyType === this.CommonsConstants.LARGE_FAMILY_TYPES[1].code){
            largeFamilyType = this.CommonsConstants.LARGE_FAMILY_TYPES[1].name;

        } else largeFamilyType = this.DatalayerConstants.DATALAYER_VALUES.NO;

        return largeFamilyType;
    };

    generateTxtSegmentDates = (dates: any): string => {
        const formatedOutboundFlight: string = (dates?.formatedOutboundFlight) ? dates.formatedOutboundFlight : '';
        const formatedReturnFlight = (dates?.formatedReturnFlight) ? '-' + dates.formatedReturnFlight : '';
        return `${formatedOutboundFlight}${formatedReturnFlight}`;
    };

    getItemCategory3 = (event: string, outboundRoute: string, id: string): string => {
        let result: string = 'all';
        const selectedTripInfo: CommonsSelectedTripInfoModel.SelectedTripInfoModel[] = this.localStorageService.get('selectedTripInfo');
        const multiCitySearch = this.localStorageService.get('multiCitySearch');
        const isEventBeginOrAdd: boolean = event === 'begin_checkout' || event === 'add_shipping_info';

        if(!isEventBeginOrAdd && selectedTripInfo) {
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

    getItemCategory2 = (slice: any): string => {
        const flowApp = this.localStorageService.get('flowApp');
        let category2: string = '';

        switch (flowApp) {
                case this.CommonsConstants.APP_TYPES.CHECKIN:
                    const segmentsInfo: any[] = this.localStorageService.get('segmentsInfo') || [];
                    const splitId = slice?.id?.split('_') || [];
                    segmentsInfo.forEach(seg => {
                        if (splitId.length === 2 &&  splitId[0] === seg?.id) {
                            category2 = `${seg.origin?.code}`;
                        }

                        if (splitId.length === 2 &&  splitId[1] === seg?.id) {
                            category2 += `-${seg.destination?.code}`;
                        }
                    });

                    break;

                default:
                    // BKI
                    category2 = slice.id.substring(0, 3) + '-' + slice.id.substring(3, 6);
                    break;
        }
        return category2;
    };

    setProcessAndStep = (process: string, step: string, quadrigam?: string): void => {
        const quadrigamLocal: string = quadrigam ? quadrigam : '';
        const stepLocal: string = (this.DatalayerConstants.DATALAYER_ANCILLARIES_STEPS[quadrigam]) ? this.DatalayerConstants.DATALAYER_ANCILLARIES_STEPS[quadrigam] : step ? step : '';
        const flowApp: string = this.localStorageService.get('flowApp');
        const isFlowDuplicated: any = this.localStorageService.get('isFlowDuplicated') || false;
        const quadrigamsDesInvoicing = ['UNCOAC', 'UNCOSE', 'UNCONF'];
        let processLocal: string = process ? process : '';

        if(flowApp === this.CommonsConstants.APP_TYPES.CHECKIN && !quadrigamsDesInvoicing.includes(quadrigam)) {
            processLocal = isFlowDuplicated ? this.DatalayerConstants.DATALAYER_FLOW_CKI.PROCESS_DUPLICATE : this.DatalayerConstants.DATALAYER_FLOW_CKI.PROCESS;
        }

        /* INIT DELETE GA4 MIGRATION*/
        const extendedDatalayerInfo = {};
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.PROCESS] = processLocal;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.STEP] = stepLocal;
        extendedDatalayerInfo[this.DatalayerConstants.DATALAYER_INFO.QUADRIGAM] = quadrigamLocal;
        this.addDataLayerInfo(extendedDatalayerInfo);
        /* FIN DELETE GA4 MIGRATION*/

        const extendedDigitalDataInfo = {};
        extendedDigitalDataInfo[this.DatalayerGeneralConstants.PROCESS] = processLocal;
        extendedDigitalDataInfo[this.DatalayerGeneralConstants.STEP] = stepLocal;
        extendedDigitalDataInfo[this.DatalayerGeneralConstants.QUADRIGAM] = quadrigamLocal;
        this.addDigitalDataInfo(extendedDigitalDataInfo);
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

    updateProcessAndStep = (flowsApp: string[], process: string[], step: string[], quadrigam:string[]) :void =>{
        const idFlowApp = flowsApp.findIndex(item => item === this.localStorageService.get('flowApp'));
        idFlowApp !== -1 ? this.setProcessAndStep(process[idFlowApp], step[idFlowApp], quadrigam[idFlowApp]):'';
    };

    getStepFromQuadrigam = (quadrigam:string, defaultValue: string) => {
        const quadrigamToStep = {
            OHMTDT: this.DatalayerMMBConstants.DIGITAL_DATA_STEP.OHMTDT,
            OHBKCF: this.DatalayerConstants.DATALAYER_VIEWS.ONHOLD_CONFIRMATION,
            ATCPURC: this.DatalayerMMBConstants.DIGITAL_DATA_STEP.ATCPURC,
            ONHOLD: this.DatalayerConstants.DATALAYER_VIEWS.ONHOLD_PAYMENT,
            CNCLIT: this.DatalayerMMBConstants.DIGITAL_DATA_STEP.CNCLIT,
            default: defaultValue
        };
        return quadrigamToStep[quadrigam] || quadrigamToStep.default;
    };

    getProcessFromQuadrigam = (quadrigam:string) => {
        const quadrigamToProcess = {
            RTBKCF: this.DatalayerMMBConstants.DIGITAL_DATA_PROCESS.RTBKCF
        };
        return quadrigamToProcess[quadrigam] || null;
    };

    private getUserState = (isUserLogged: boolean): string => {
        const userLogged: any = this.localStorageService.get('userLogged');
        const logged: CommonsDatalayerServiceTypes.LoggedDatalayer | null = this.localStorageService.get('EstadoUsuario');
        let userState: string = this.DatalayerConstants.DATALAYER_USER_STATES.ANONYMOUS;
        if (isUserLogged) {
            if (!this.CommonsUserUtilsService.getUserRole()) {
                this.CommonsUtilService.getUserTypeByToken();
            }
            userState =
                this.CommonsUserUtilsService.isIbPlus()
                    ? (this.CommonsUserUtilsService.isSoftUser() ? this.DatalayerConstants.DATALAYER_USER_STATES.LOGGED_FF_SOFT : this.DatalayerConstants.DATALAYER_USER_STATES.LOGGED_FF_HARD)
                    : (this.CommonsUserUtilsService.isSoftUser() ? this.DatalayerConstants.DATALAYER_USER_STATES.LOGGED_IB_SOFT : this.DatalayerConstants.DATALAYER_USER_STATES.LOGGED_IB_HARD);
            if (logged && logged.loggedBy) {
                userState = (logged.loggedBy === 'email') ? this.DatalayerConstants.DATALAYER_USER_STATES.LOGGED_MAIL : userState;
            } else {
                userState = (userLogged === this.CommonsConstants.LOGIN_ONB) ? this.DatalayerConstants.DATALAYER_USER_STATES.LOGGED_ONB : userState;
            }
        } else {
            userState = this.DatalayerConstants.DATALAYER_USER_STATES.ANONYMOUS;
        }

        return userState;
    };
}