import { MMBDigitalDataParametersToRemove } from './../model/ib-mmb-digital-data-params-to-deleate';
import * as angular from 'angular';
import dayjs from 'dayjs';
import { MmBDataLayerService } from './ib-MmB-datalayer-service';
import { MonetateUtilsService } from '@src/components/ib-reusable-components/ib-monetate/services/ib-monetate-utils';
import { MmBDigitalDataService } from './ib-MmB-digital-data-service';
import { MMBDatalayerConstants } from '../constants/ib-MmB-datalayer-constants';
import { AncillariesMMBConstants } from '@src/components/ib-MmB-ancillaries-page/constants/ib-MmB-ancillaries-constants';



@Service('ib-MmB-services-module', ['MmBDataLayerService', '$rootScope', '$timeout', 'MmBAppConstants',
    'localStorageService', 'CommonsUtilService', '$filter', 'CommonsUserUtilsService', 'MonetateUtilsService',
    'MmBDigitalDataService'], ['ib-monetate-module'])
export class MmBDatalayerUtilsService {
    public DATALAYER_ERROR_ATTR: string[] = [MMBDatalayerConstants.DATALAYER_INFO.ERROR_CODE, MMBDatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION, MMBDatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE];
    public DATALAYER_MODAL_ATTR: string[] = [MMBDatalayerConstants.DATALAYER_INFO.MODAL_ID];
    public DATALAYER_PROCESS_AND_STEP_ATTR: string[] = [MMBDatalayerConstants.DATALAYER_INFO.PROCESS, MMBDatalayerConstants.DATALAYER_INFO.STEP];
    public DIGITAL_DATA_PROCESS_AND_STEP_ATTR: string[] = [MMBDatalayerConstants.DatalayerGeneralConstants.PROCESS, MMBDatalayerConstants.DatalayerGeneralConstants.STEP];
    public LANG: string;
    public MARKET: string;
    constructor (
        private MmBDataLayerService: MmBDataLayerService,
        private $rootScope: any,
        private $timeout: ng.ITimeoutService,
        private MmBAppConstants: any,
        private localStorageService: ng.local.storage.ILocalStorageService,
        private CommonsUtilService: CommonsUtilService,
        private $filter: ng.FilterFactory,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private MonetateUtilsService: MonetateUtilsService,
        private MmBDigitalDataService: MmBDigitalDataService,
        private AncillariesConstants: AncillariesMMBConstants
    ) {
    }

    initializeDatalayer = (language: string, market: string, deviceType: string): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const initialDatalayer = {};
        this.LANG = language;
        this.MARKET = market;
        initialDatalayer[MMBDatalayerConstants.DATALAYER_INFO.LANGUAGE] = language;
        initialDatalayer[MMBDatalayerConstants.DATALAYER_INFO.MARKET] = market;
        initialDatalayer[MMBDatalayerConstants.DATALAYER_INFO.WEB_VERSION] = MMBDatalayerConstants.DATALAYER_VALUES.WEB_VERSION;
        initialDatalayer[MMBDatalayerConstants.DATALAYER_INFO.WEB_MODE] = deviceType;
        this.MmBDataLayerService.initDatalayer(initialDatalayer, {});

        /* FINISH DELETE GA4 MIGRATION*/
        const initialDigitalData = {};
        this.LANG = language;
        this.MARKET = market;
        initialDigitalData[MMBDatalayerConstants.DatalayerGeneralConstants.LANGUAGE] = language;
        initialDigitalData[MMBDatalayerConstants.DatalayerGeneralConstants.MARKET] = market;
        initialDigitalData[MMBDatalayerConstants.DatalayerGeneralConstants.WEB_VERSION] = MMBDatalayerConstants.DATALAYER_VALUES.WEB_VERSION;
        initialDigitalData[MMBDatalayerConstants.DatalayerGeneralConstants.WEB_MODE] = deviceType;
        this.MmBDigitalDataService.initDigitalData(initialDigitalData);

    };

    sendDatalayerEvent = (type: string): void => {
        if (angular.isString(type)) {
            /* INIT DELETE GA4 MIGRATION*/
            this.$rootScope.$broadcast('updateDatalayer');
            /* FINISH DELETE GA4 MIGRATION*/
            this.$rootScope.$broadcast('updateDigitalData');
            this.MmBDataLayerService.callUpdateTagManager(type);
        }
    };

    /* INIT DELETE GA4 MIGRATION*/
    addDataLayerInfo = (datalayerInfo: object): void => {
        this.MmBDataLayerService.addDataLayerGeneralInfo(datalayerInfo);
    };
    /* FINISH DELETE GA4 MIGRATION*/
    addDigitalDataInfo = (digital_data: object): void => {
        this.MmBDigitalDataService.addDigitalDataInfo(digital_data);
    };

    /* INIT DELETE GA4 MIGRATION*/
    updateLoggedDatalayer = (customerData: datalayerServiceTypes.CustomerDataDatalayer ) :void => {
        const extendDatalayer: object = {};
        const membershipData: datalayerServiceTypes.MemberShipDatalayer = this.localStorageService.get('membershipData');
        let userLevel = '', userId = '', aviosCoins = 0, hashEID = '', userSegment = 0;
        if (customerData) {
            userLevel = customerData.category || ( customerData.generalInfo  && customerData.generalInfo.category ? customerData.generalInfo.category : '');
            aviosCoins = angular.isNumber(customerData.avios) ? customerData.avios : 0;
            hashEID = (customerData.hashEID) ? customerData.hashEID : '';
            userSegment = MMBDatalayerConstants.DATALAYER_USER_LEVELS[userLevel.toUpperCase()] || 0;

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
                    extendDatalayer[MMBDatalayerConstants.DATALAYER_INFO.HASH_EMAIL] = hashEID;
                    this.addDataLayerInfo(extendDatalayer);
                });
            }

            if(userLevel) extendDatalayer[MMBDatalayerConstants.DATALAYER_INFO.USER_LEVEL] = userLevel;
            if(userId) extendDatalayer[MMBDatalayerConstants.DATALAYER_INFO.USER_ID] = userId;
            extendDatalayer[MMBDatalayerConstants.DATALAYER_INFO.AVIOS_COINS] = aviosCoins;
            extendDatalayer[MMBDatalayerConstants.DATALAYER_INFO.USER_AVIOS] = aviosCoins;
            extendDatalayer[MMBDatalayerConstants.DATALAYER_INFO.HASH_EMAIL] = hashEID;
            extendDatalayer[MMBDatalayerConstants.DATALAYER_INFO.USER_SEGMENT] = userSegment;

            this.addDataLayerInfo(extendDatalayer);
            this.addDatalayerInfoHashEID(customerData);
        }
    };
    /* FINISH DELETE GA4 MIGRATION*/
    updateLoggedDigitalData = (customerData: datalayerServiceTypes.CustomerDataDatalayer ) :void => {
        const extendDatalayer: object = {};
        const membershipData: datalayerServiceTypes.MemberShipDatalayer = this.localStorageService.get('membershipData');
        let userLevel = '', aviosCoins = 0, userId = '', hashEID = '', userSegment = 0;

        if (customerData) {
            userLevel = customerData.category || ( customerData.generalInfo  && customerData.generalInfo.category ? customerData.generalInfo.category : '');
            aviosCoins = this.getAviosCoins(customerData);
            hashEID = (customerData.hashEID) ? customerData.hashEID : '';
            userSegment = MMBDatalayerConstants.DATALAYER_USER_LEVELS[userLevel.toUpperCase()] || 0;

            if (this.CommonsUserUtilsService.isUserLoggedONB() && typeof membershipData?.clid === 'string') {
                userId = membershipData.clid;
            } else {
                /* Despite the name it obtains the account identifier of IB0 too */
                const identifier = this.CommonsUserUtilsService.getFrequentFlyer();
                if (identifier !== 'NOT_FOUND') userId = identifier;
            }

            if (customerData.hashEID) {
                hashEID = customerData.hashEID;
                extendDatalayer[MMBDatalayerConstants.DatalayerGeneralConstants.HASH_EMAIL] = hashEID;
                this.addDigitalDataInfo(extendDatalayer);
            } else if(angular.isString(customerData.email)) {
                this.CommonsUtilService.sha256(customerData.email).then((hash) => {
                    hashEID = hash;
                    extendDatalayer[MMBDatalayerConstants.DatalayerGeneralConstants.HASH_EMAIL] = hashEID;
                    this.addDigitalDataInfo(extendDatalayer);
                });
            }

            if(userLevel) extendDatalayer[MMBDatalayerConstants.DatalayerGeneralConstants.USER_LEVEL] = userLevel;
            if(userId) extendDatalayer[MMBDatalayerConstants.DatalayerGeneralConstants.USER_ID] = userId;
            if(hashEID) extendDatalayer[MMBDatalayerConstants.DatalayerGeneralConstants.HASH_EMAIL] = hashEID;
            extendDatalayer[MMBDatalayerConstants.DatalayerGeneralConstants.AVIOS_COINS] = aviosCoins;
            extendDatalayer[MMBDatalayerConstants.DatalayerGeneralConstants.USER_AVIOS] = aviosCoins;
            extendDatalayer[MMBDatalayerConstants.DatalayerGeneralConstants.USER_SEGMENT] = userSegment;

            this.addDigitalDataInfo(extendDatalayer);
            this.addDigitalDataInfoHashEID(customerData);
        }
    };

    private getAviosCoins (customerData: datalayerServiceTypes.CustomerDataDatalayer): number{
        let aviosGeneralInfo = customerData?.generalInfo?.avios ? customerData.generalInfo.avios : 0;
        return angular.isNumber(customerData.avios) ? customerData.avios : aviosGeneralInfo;
    }

    generateDatalayerDOM = () => {
        let datalayerDOM: string = '<script type="text/javascript">';
        const datalayer_general = this.MmBDataLayerService.getDatalayerGeneral();
        const datalayer_ecommerce = this.MmBDataLayerService.getEcommerceDatalayer();
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

    /* INIT DELETE GA4 MIGRATION*/
    removeDatalayerObjects = (datalayerAttributtes: object): void => {
        this.MmBDataLayerService.removeDatalayerGeneralInfo(datalayerAttributtes);
    };
    /* FINISH DELETE GA4 MIGRATION*/
    removeDigitalDataObjects = (datalayerAttributtes: object): void => {
        this.MmBDigitalDataService.removeDigitalDataInfo(datalayerAttributtes);
    };

    /* INIT DELETE GA4 MIGRATION*/
    updateDatalayerWithQuadrigam = (quadrigam, extendedObject, isUserLogged) => {
        const extendDatalayer = {};

        if (angular.isObject(extendedObject)) {
            angular.extend(extendDatalayer, extendedObject);
        }

        if (angular.isString(quadrigam)) {
            quadrigam = quadrigam.replace(/\//g, '');
            extendDatalayer[MMBDatalayerConstants.DATALAYER_INFO.QUADRIGAM] = quadrigam;
            extendDatalayer[MMBDatalayerConstants.DATALAYER_INFO.CODE] = `${this.LANG}/${this.MARKET}/${quadrigam}`;
        }

        extendDatalayer[MMBDatalayerConstants.DATALAYER_INFO.USER_STATE] = this.getUserState(isUserLogged);
        this.addDataLayerInfo(extendDatalayer);
    };
    /* FINISH DELETE GA4 MIGRATION*/
    updateDigitalDataWithQuadrigam = (quadrigam, extendedObject, isUserLogged) => {
        const extendDatalayer = {};

        if (angular.isObject(extendedObject) && extendedObject.eventCategory != 'ancillaries') {
            angular.extend(extendDatalayer, extendedObject);
        }

        if (angular.isString(quadrigam)) {
            extendDatalayer[MMBDatalayerConstants.DatalayerGeneralConstants.QUADRIGAM] = quadrigam.replace(/\//g, '');
            extendDatalayer[MMBDatalayerConstants.DatalayerGeneralConstants.CODE] = this.LANG + '/' + this.MARKET + '/' + quadrigam.replace(/\//g, '');
        }

        extendDatalayer[MMBDatalayerConstants.DatalayerGeneralConstants.USER_STATE] = this.getUserState(isUserLogged);
        this.addDigitalDataInfo(extendDatalayer);
    };

    /* INIT DELETE GA4 MIGRATION*/
    sendDatalayerErrorEvent = (errorObject : datalayerServiceTypes.ErrorObjectDatalayer) :void => {
        const extendedDatalayerInfo = {};
        if (angular.isObject(errorObject) && errorObject.errorCode) {
            if (errorObject.quadrigam) {
                this.updateDatalayerWithQuadrigam(errorObject.quadrigam, null, errorObject.isLogged);
            }
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE] =
                extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE] ?
                    `${extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE]}|${errorObject.internalErrorCode}` :
                    errorObject.internalErrorCode;
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ERROR_CODE] =
                extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ERROR_CODE] ?
                    `${extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ERROR_CODE]}|${errorObject.errorCode.toString()}` :
                    errorObject.errorCode.toString();
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION] =
                extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION] ?
                    `${extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION]}|${errorObject.message}` :
                    errorObject.message;
            if (errorObject.eventCategory) {
                extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.EVENT_CATEGORY] = errorObject.eventCategory;
            }
            if (errorObject.eventCategory) {
                extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.EVENT_ACTION] = errorObject.eventAction;
            }
            if (errorObject.eventLabel) {
                extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.EVENT_LABEL] = errorObject.eventLabel;
            }

            this.addDataLayerInfo(extendedDatalayerInfo);
            this.sendDatalayerEvent(MMBDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        }
    };
    /* FINISH DELETE GA4 MIGRATION*/

    removeDatalayerErrorAttrs = (): void => {
        /* INIT DELETE GA4 MIGRATION*/
        this.removeDatalayerObjects(this.DATALAYER_ERROR_ATTR);
        /* FINISH DELETE GA4 MIGRATION*/
        this.removeDigitalDataObjects(this.DATALAYER_ERROR_ATTR);
    };

    sendDatalayerModalEvent = (modalObject : datalayerServiceTypes.ModalObjectDatalayer):void => {
        /* INIT DELETE GA4 MIGRATION*/
        const extendedDatalayerInfo = {};
        /* FINISH DELETE GA4 MIGRATION*/
        const extendedDigitalDataInfo = {};
        if (angular.isObject(modalObject)) {
            /* INIT DELETE GA4 MIGRATION*/
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.MODAL_ID] = modalObject.idModal || '""';
            this.addDataLayerInfo(extendedDatalayerInfo);
            /* FINISH DELETE GA4 MIGRATION*/
            // extendedDigitalDataInfo[MMBDatalayerConstants.DATALAYER_INFO.MODAL_ID] = modalObject.idModal || '""';
            this.addDigitalDataInfo(extendedDigitalDataInfo);
            this.sendDatalayerEvent(MMBDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        }
    };

    removeDatalayerModalAttrs = (): void => {
        /* INIT DELETE GA4 MIGRATION*/
        this.removeDatalayerObjects(this.DATALAYER_MODAL_ATTR);
        /* FINISH DELETE GA4 MIGRATION*/
        this.removeDigitalDataObjects(this.DATALAYER_MODAL_ATTR);
    };

    addDataLayerEcommerceInfo = (datalayerInfo: object): void => {
        this.MmBDataLayerService.addDataLayerEcommerceInfo(datalayerInfo);
    };

    /* INIT DELETE GA4 MIGRATION*/
    updateDatalayerForAncillaries = (
        updatePrices: boolean, ancillariesAction: string, totalQuantityBaggage: number,
        baggagesPrice: number, totalQuantitySeats: number, seatsPrice: number,
        insuranceType: string, insurancesPrice: number, flexibilityPrice: number, totalQuantitySpeqs: number,
        speqsPrice: number): void => {
        const extendedDatalayerInfo = {};
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ANCILLARIES_ACTION] = ancillariesAction;
        if (updatePrices) {
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.EVENT_CATEGORY] = MMBDatalayerConstants.DATALAYER_ANCILLARIES.ANCILLARIES;
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.EVENT_ACTION] = MMBDatalayerConstants.DATALAYER_EVENT_TYPES.CLICK;
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.EVENT_LABEL] = MMBDatalayerConstants.DATALAYER_LABEL.CONTINUAR;
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_SEATS] = totalQuantitySeats;
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ANCILLARIES_SEATS] = (seatsPrice > 0 ? MMBDatalayerConstants.DATALAYER_VALUES.YES + ' – ' + seatsPrice : MMBDatalayerConstants.DATALAYER_VALUES.NO);
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_PRICE_SEAT] = seatsPrice;
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_BAGGAGE] = totalQuantityBaggage;
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ANCILLARIES_BAGGAGES] = (baggagesPrice > 0 ? MMBDatalayerConstants.DATALAYER_VALUES.YES + ' – ' + baggagesPrice : MMBDatalayerConstants.DATALAYER_VALUES.NO);
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_PRICE_BAGGAGE] = baggagesPrice;
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ANCILLARIES_INSURANCE_TYPE] = insuranceType;
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ANCILLARIES_INSURANCES] = (insurancesPrice > 0 ? MMBDatalayerConstants.DATALAYER_VALUES.YES + ' – ' + insurancesPrice : MMBDatalayerConstants.DATALAYER_VALUES.NO);
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ANCILLARIES_FLEXIBILITY] = (flexibilityPrice > 0 ? MMBDatalayerConstants.DATALAYER_VALUES.YES + ' – ' + flexibilityPrice : MMBDatalayerConstants.DATALAYER_VALUES.NO);
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_SPEQS] = totalQuantitySpeqs;
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ANCILLARIES_SPEQS] = (speqsPrice > 0 ? MMBDatalayerConstants.DATALAYER_VALUES.YES + ' – ' + speqsPrice : MMBDatalayerConstants.DATALAYER_VALUES.NO);
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.ANCILLARIES_TOTAL_PRICE_SPEQS] = speqsPrice;
        }
        this.addDataLayerInfo(extendedDatalayerInfo);
        this.localStorageService.set('confirmationDatalayerInfo', extendedDatalayerInfo);
        this.MmBDataLayerService.callUpdateTagManager(MMBDatalayerConstants.DATALAYER_EVENT_TYPES.LINK);
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
        headerModel.headerModel.shoppingBasket?.seats?.segments.map( segment => {segment.seats.forEach(seat => seatsByTypes.push(seat));});
        const seatsTotalPrice = seatsByTypes.reduce((suma, objeto) => {return suma + objeto.amount;}, 0);
        const seatsTotalQuanty = seatsByTypes.reduce((suma, objeto) => {return suma + objeto.quanty;}, 0);

        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSTOTAL]= seatsTotalQuanty;
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSTOTALPRICE]= seatsTotalPrice;

        if(headerModel.headerModel.shoppingBasket?.seats?.segments.some((segment) => segment.seats.some((seat) => seat.type === MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.UPFRONT))) {
            this.addDigitalDataSeatsInfoByType(extendedDatalayerInfo, seatsByTypes, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.UPFRONT, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.UPFRONT.SEATSEUPFRONTTOTAL, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.UPFRONT.SEATSEUPFRONTPRICE);
        }if(headerModel.headerModel.shoppingBasket?.seats?.segments.some((segment) => segment.seats.some((seat) => seat.type === MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.EXTRA_SIZE))) {
            this.addDigitalDataSeatsInfoByType(extendedDatalayerInfo, seatsByTypes, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.EXTRA_SIZE, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.XL.SEATSXLTOTAL, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.XL.SEATSXLPRICE);
        }if(headerModel.headerModel.shoppingBasket?.seats?.segments.some((segment) => segment.seats.some((seat) => seat.type === MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.EMERGENCY))) {
            this.addDigitalDataSeatsInfoByType(extendedDatalayerInfo, seatsByTypes, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.EMERGENCY, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.EMERGENCY.SEATSEMERGENCYTOTAL, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.EMERGENCY.SEATSEMERGENCYPRICE);
        }if(headerModel.headerModel.shoppingBasket?.seats?.segments.some((segment) => segment.seats.some((seat) => seat.type === MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.PROMO))) {
            this.addDigitalDataSeatsInfoByType(extendedDatalayerInfo, seatsByTypes, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.PROMO, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.PROMO.SEATSPROMOTOTAL, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.PROMO.SEATSPROMOPRICE);
        }if(headerModel.headerModel.shoppingBasket?.seats?.segments.some((segment) => segment.seats.some((seat) => seat.type === MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.INFANT))) {
            this.addDigitalDataSeatsInfoByType(extendedDatalayerInfo, seatsByTypes, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.INFANT, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.PASSENGER_WITH_INFANT.SEATSEINFANTTOTAL, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.PASSENGER_WITH_INFANT.SEATSEINFANTPRICE);
        }if(headerModel.headerModel.shoppingBasket?.seats?.segments.some((segment) => segment.seats.some((seat) => seat.type === MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.RESTRICTED_MOBILITY))) {
            this.addDigitalDataSeatsInfoByType(extendedDatalayerInfo, seatsByTypes, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATS_HEADER_FORMAT.RESTRICTED_MOBILITY, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.RESTRICTED_MOBILITY.SEATSRESTRICTEDMOBILITYTOTAL, MMBDatalayerConstants.DATALAYER_INFO.SEATSINFO.SEATSBYTYPE.RESTRICTED_MOBILITY.SEATSRESTRICTEDMOBILITYPRICE);
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

        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESTOTAL]= baggagesTotalQuanty;
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESTOTALPRICE]= baggagesTotalPrice;

        if(headerModel.headerModel.shoppingBasket?.baggages?.segments.some((segment) => segment.baggages.some((baggage) => baggage.type === MMBDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_15))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, baggagesByTypes, MMBDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_15, MMBDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE15.BAGGAGES15TOTAL, MMBDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE15.BAGGAGES15PRICE);
        }if(headerModel.headerModel.shoppingBasket?.baggages?.segments.some((segment) => segment.baggages.some((baggage) => baggage.type === MMBDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_23))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, baggagesByTypes, MMBDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_23, MMBDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE23.BAGGAGES23TOTAL, MMBDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE23.BAGGAGES23PRICE);
        }if(headerModel.headerModel.shoppingBasket?.baggages?.segments.some((segment) => segment.baggages.some((baggage) => baggage.type === MMBDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_32))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, baggagesByTypes, MMBDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_32, MMBDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE32.BAGGAGES32TOTAL, MMBDatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE32.BAGGAGES32PRICE);
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
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSTOTAL]= speqsTotalQuanty;
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSTOTALPRICE]= speqsTotalPrice;

        if(headerModel.headerModel.shoppingBasket?.speqs?.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.BICYCLE))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.BICYCLE, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.BICYCLE.SPEQSBICYCLETOTAL, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.BICYCLE.SPEQSBICYCLEPRICE);
        }if(headerModel.headerModel.shoppingBasket?.speqs?.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SURFBOARD))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SURFBOARD, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SURFBOARD.SPEQSSURFBOARDTOTAL, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SURFBOARD.SPEQSSURFBOARDPRICE);
        }if(headerModel.headerModel.shoppingBasket?.speqs?.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.GOLFEQUIPMENT))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.GOLFEQUIPMENT, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.GOLF_EQUIPMENT.SPEQSGOLFEQUIPMENTTOTAL, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.GOLF_EQUIPMENT.SPEQSGOLFEQUIPMENTPRICE);
        }if(headerModel.headerModel.shoppingBasket?.speqs?.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SKISNOW))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SKISNOW, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SKI_SNOW.SPEQSSKISNOWTOTAL, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SKI_SNOW.SPEQSSKISNOWPRICE);
        }if(headerModel.headerModel.shoppingBasket?.speqs?.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.FISHINGEQUIPMENT))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.FISHINGEQUIPMENT, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.FISHING_EQUIPMENT.SPEQSFISHINGEQUIPMENTTOTAL, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.FISHING_EQUIPMENT.SPEQSFISHINGEQUIPMENTPRICE);
        }if(headerModel.headerModel.shoppingBasket?.speqs?.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SCUBADIVING))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SCUBADIVING, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SCUBA_DIVING.SPEQSSCUBADIVINGTOTAL, MMBDatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SCUBA_DIVING.SPEQSSCUBADIVINGPRICE);
        }
    }
    addDigitalDataFlexibilization (headerModel, extendedDatalayerInfo) {

        const flexibilityTotalPrice = headerModel.headerModel.shoppingBasket?.flexibilization?.info?.amount?.price;
        const flexibilityType = headerModel.headerModel.shoppingBasket?.flexibilization?.info?.type;

        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.FLEXIBILITY_INFO.FLEXIBILITY_TOTAL_PRICE]= flexibilityTotalPrice;
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.FLEXIBILITY_INFO.FLEXIBILTY_TYPE]= flexibilityType;
    }

    addDigitalDataInsurance (insuranceInfo, extendedDatalayerInfo) {
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.INSURANCE_POLICY] = insuranceInfo?.info?.offer;
    }

    cleanDigitalDataParametersFromIncludesString (stringIncludesToDeleteInDigitalData) {
        const confirmationDigitalInfo = this.localStorageService.get('confirmationDigitalInfo');
        if(confirmationDigitalInfo) {
            const digitalInfoAsArray = Object.entries(confirmationDigitalInfo);
            const digitalDataFiltered = digitalInfoAsArray.filter(([key, value]) => (key.includes(stringIncludesToDeleteInDigitalData)));
            const digitalDataKeys = digitalDataFiltered.map( (element => element[0]));
            const dataDeleteDigitalData = digitalDataKeys.filter(elementToFilter => elementToFilter.includes(stringIncludesToDeleteInDigitalData));

            this.MmBDigitalDataService.removeDigitalDataInfo(dataDeleteDigitalData);
        }
    }
    /* FINISH DELETE GA4 MIGRATION*/
    updateDigitalDataForAncillaries = (
        updatePrices: boolean, ancillariesAction: string, headerModel: CommonsDatalayerServiceTypes.HeaderModel, insuranceType): void => {
            
        const extendedDatalayerInfo = {};

        this.cleanDigitalDataParameters();

        this.addAllianzFusionInsurance(headerModel,extendedDatalayerInfo);


        const insurancePrice = headerModel.headerModel.shoppingBasket?.insurance?.total?.total;
        const hasSeats = headerModel.headerModel.shoppingBasket?.seats?.hasSeats;
        const hasBaggage = headerModel.headerModel.shoppingBasket?.baggages?.hasBaggage;
        const hasSpeqs = headerModel.headerModel.shoppingBasket?.speqs?.hasSpeqs;
        const hasFlexibilization = headerModel.headerModel.shoppingBasket?.flexibilization?.hasFlexibilization;
        const hasInsurance= headerModel.headerModel.shoppingBasket?.insurance?.hasInsurance;
      

        if (updatePrices && insuranceType) {
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.INSURANCE_TYPE] = insuranceType;
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.INSURANCE_TOTAL_PRICE] = insurancePrice;
            extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.INSURANCE_PROVIDER] = "ALLIANZ";
        }
        if(hasSeats) this.mapSeatsForDigitalData(headerModel, extendedDatalayerInfo);

        if(hasBaggage) this.mapBaggagesForDigitalData(headerModel, extendedDatalayerInfo);
        if(hasSpeqs) this.mapSpeqsForDigitalData(headerModel, extendedDatalayerInfo);
        if(hasFlexibilization) this.addDigitalDataFlexibilization(headerModel, extendedDatalayerInfo);
        if(hasInsurance) this.addDigitalDataInsurance(headerModel.headerModel.shoppingBasket?.insurance, extendedDatalayerInfo);
  
        this.addDigitalDataInfo(extendedDatalayerInfo);
        this.localStorageService.set('confirmationDigitalInfo', extendedDatalayerInfo);
        this.MmBDataLayerService.callUpdateTagManager(MMBDatalayerConstants.DATALAYER_EVENT_TYPES.LINK);
    };

     cleanDigitalDataParameters(){
        const params = Object.values(MMBDigitalDataParametersToRemove)
        params.forEach(param => this.cleanDigitalDataParametersFromIncludesString(param) )
    }

     addAllianzFusionInsurance( headerModel: CommonsDatalayerServiceTypes.HeaderModel,extendedDatalayerInfo: any,){
        const hasAllianzFusionInsurance = headerModel.headerModel.shoppingBasket?.insuranceAllianzFusionInfo?.hasInsuranceAllianzFusion;
        const insuranceAllianzFusionPassengerInfo: any = this.localStorageService.get('insuranceAllianzFusionPassengerInfo') || {};
        if(!hasAllianzFusionInsurance) return 
        
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.INSURANCE_TYPE] = headerModel.headerModel.shoppingBasket.insuranceAllianzFusionInfo?.info?.description;
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.INSURANCE_TOTAL_PRICE] = headerModel.headerModel.shoppingBasket.insuranceAllianzFusionInfo?.total?.total;
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.INSURANCE_POLICY] = insuranceAllianzFusionPassengerInfo?.externalCode;
    }
    
    generateConfirmationDigitalDataObject = (): void => {
        const confirmationDatalayerInfo: object = this.localStorageService.get('confirmationDigitalInfo') || {};
        const paymentsInfo: any = this.localStorageService.get('paymentsInfo');
        confirmationDatalayerInfo[MMBDatalayerConstants.DatalayerGeneralConstants.STEP] = this.getStepFromQuadrigam(confirmationDatalayerInfo[MMBDatalayerConstants.DatalayerGeneralConstants.QUADRIGAM], MMBDatalayerConstants.DATALAYER_VIEWS.CONFIRMATION);
        this.MmBDigitalDataService.removeDigitalDataInfo([MMBDatalayerConstants.DatalayerBKIConstants.CASH_AVIOS_OFFER, MMBDatalayerConstants.DatalayerGeneralConstants.VOUCHER_SHOWN]);
        delete confirmationDatalayerInfo[MMBDatalayerConstants.DatalayerBKIConstants.CASH_AVIOS_OFFER];
        delete confirmationDatalayerInfo[MMBDatalayerConstants.DatalayerGeneralConstants.VOUCHER_SHOWN];
        confirmationDatalayerInfo[MMBDatalayerConstants.DatalayerGeneralConstants.CASH_AVIOS_USED] = paymentsInfo?.appliedDiscounts?.types?.AVIOS ? 'si' : 'no';
        confirmationDatalayerInfo[MMBDatalayerConstants.DatalayerGeneralConstants.VOUCHER_USED] = paymentsInfo?.appliedDiscounts?.types?.VOUCHER ? 'si' : 'no';
        this.addDigitalDataInfo(confirmationDatalayerInfo);
        this.localStorageService.set('confirmationDigitalInfo', confirmationDatalayerInfo);
    };

    updateTripDetailsDatalayerObject = (bookingInfo): void => {
        const datalayerObject = {};
        let passengersTypes = '', passengerCount = 0, segmentsAirports = '', segmentsDates = '', segmentsOperators = '';
        for (let i = 0; i < bookingInfo.passengers.length; i++) {
            passengersTypes += (passengersTypes.length === 0 ? '' : '-') + MMBDatalayerConstants.DATALAYER_PASSENGER_TYPES[bookingInfo.passengers[i].passengerType];
            if (bookingInfo.passengers[i].passengerType !== MMBDatalayerConstants.PASSENGERS_TYPES.INFANT) {
                passengerCount++;
            }
        }
        for (let i = 0; i < bookingInfo.order.slices.length; i++) {
            for (let j = 0; j < bookingInfo.order.slices[i].segments.length; j++) {
                segmentsAirports += (segmentsAirports.length === 0 ? '' : '-') + bookingInfo.order.slices[i].segments[j].departure.code + '-' + bookingInfo.order.slices[i].segments[j].arrival.code;
                segmentsDates += (segmentsDates.length === 0 ? '' : '-');
                if (bookingInfo.order.slices[i].segments[j].type !== MMBDatalayerConstants.SEGMENT_TYPES.OPEN) {
                    if (bookingInfo.order.slices[i].segments[j].departureDateTime && bookingInfo.order.slices[i].segments[j].arrivalDateTime) {
                        segmentsDates += bookingInfo.order.slices[i].segments[j].departureDateTime.split(' ')[0] + '-' + bookingInfo.order.slices[i].segments[j].arrivalDateTime.split(' ')[0];
                    }
                    segmentsOperators += (segmentsOperators.length === 0 ? '' : '-') + bookingInfo.order.slices[i].segments[j].flight.operationalDisclosure;
                } else {
                    segmentsDates += MMBDatalayerConstants.DATALAYER_VALUES.SEGMENT_OPEN;
                }
            }
        }
        datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.PASSENGER_TYPES] = passengersTypes;
        datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.TOTAL_PASSENGERS] = passengerCount;
        datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.ORIGIN_DESTINATIONS] = segmentsAirports;
        datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.SEGMENT_DATES] = segmentsDates;
        datalayerObject[MMBDatalayerConstants.DATALAYER_INFO.SEGMENT_OPERATORS] = segmentsOperators;
        this.addDataLayerInfo(datalayerObject);
    };

    updateDatalayerActionForAncillaries = (eventCategory, eventAction, eventLabel): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const extendedDatalayerInfo = {};
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.EVENT_CATEGORY] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventCategory));
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.EVENT_ACTION] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventAction));
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.EVENT_LABEL] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventLabel));
        this.addDataLayerInfo(extendedDatalayerInfo);
        this.MmBDataLayerService.callUpdateTagManager(MMBDatalayerConstants.DATALAYER_EVENT_TYPES.LINK);
        /* FINISH DELETE GA4 MIGRATION*/
    };

    updateDatalayerEvent = (eventCategory, eventAction, eventLabel, eventName: string = ''): void => {
        const extendedDigitalDataInfo = {};
        extendedDigitalDataInfo[MMBDatalayerConstants.DatalayerGeneralConstants.EVENT_CATEGORY] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventCategory));
        extendedDigitalDataInfo[MMBDatalayerConstants.DatalayerGeneralConstants.EVENT_ACTION] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventAction));
        extendedDigitalDataInfo[MMBDatalayerConstants.DatalayerGeneralConstants.EVENT_LABEL] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventLabel));
        extendedDigitalDataInfo[MMBDatalayerConstants.DatalayerGeneralConstants.EVENT_NAME] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventName));
        this.MmBDigitalDataService.emitEvent('interaction', extendedDigitalDataInfo);
    };

    updateDatalayerViewEvent = (): void => {
        this.MmBDigitalDataService.emitViewEvent();
    };

    updateDatalayerWithTaxs = (data): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const result = {};
        /* FINISH DELETE GA4 MIGRATION*/
        const resultTax = {};
        /* INIT DELETE GA4 MIGRATION*/
        result[MMBDatalayerConstants.DATALAYER_INFO.NOTAX] = this.addDecimalInPriceInfo(data.noTax);
        result[MMBDatalayerConstants.DATALAYER_INFO.TOTALTAX] = this.addDecimalInPriceInfo(data.totalTax);
        this.addDataLayerInfo(result);
        /* FINISH DELETE GA4 MIGRATION*/
        resultTax[MMBDatalayerConstants.DatalayerBKIConstants.TOTAL_PRICE_WITHOUT_TAXES] = this.addDecimalInPriceInfo(data.noTax);
        resultTax[MMBDatalayerConstants.DatalayerBKIConstants.TOTAL_TAXES] = this.addDecimalInPriceInfo(data.totalTax);
        this.addDigitalDataInfo(resultTax);
    };

    private addDecimalInPriceInfo = (price: number): string => {
        return price && Number(price) ? price.toFixed(2) : '0';
    };

    private mapLargeFamilyDiscountType = (discountType: string): string => {
        return this.MmBAppConstants.LARGE_FAMILY_DISCOUNT_TYPE_MAP?.[discountType?.toUpperCase()] || discountType;
    };

    //REFACTOR
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
                sliceData.tipoVuelo = MMBDatalayerConstants.FLIGHT_CODE_TYPE.ROUND_TRIP;
            } else if (slicesArray.length < 2) {
                sliceData.tipoVuelo = MMBDatalayerConstants.FLIGHT_CODE_TYPE.ONE_WAY;
            } else {
                sliceData.tipoVuelo = MMBDatalayerConstants.FLIGHT_CODE_TYPE.MULTI_TRAJECT;
            }

            const initDate = dayjs(slices[slicesArray[0]].departureDateParsed.originalDate);
            const endDate = dayjs(slices[slicesArray[slicesArray.length - 1]].departureDateParsed.originalDate);
            sliceData.estanciaDestino = endDate.diff(initDate, 'day') as unknown as string;


            for (let fIndex = 0; fIndex < slicesArray.length; fIndex++) {

                if (slicesArray.length > 2) {
                    sliceData.departureDates.depTime += sliceData.departureDates.depTime.length === 0 ? slices[slicesArray[fIndex]].departureDateParsed.dateTime : '-' + slices[slicesArray[fIndex]].departureDateParsed.dateTime;
                } else {
                    sliceData.departureDates.depTime += sliceData.departureDates.depTime.length === 0 ? MMBDatalayerConstants.DATALAYER_VALUES.DEPARTURE + ':' + slices[slicesArray[fIndex]].departureDateParsed.dateTime : '-' + MMBDatalayerConstants.DATALAYER_VALUES.RETURN + ':' + slices[slicesArray[1]].departureDateParsed.dateTime;
                }

                sliceData.departureDates.depDate += fIndex === 0 ? slices[slicesArray[fIndex]].departureDateParsed.formatedDate : '-' + slices[slicesArray[fIndex]].departureDateParsed.formatedDate;

                for (let tIndex = 0; tIndex < slices[slicesArray[fIndex]].segments.length; tIndex++) {
                    if (slicesArray.length > 2) {
                        sliceData.fareFamily += sliceData.fareFamily.length === 0 ? slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily : '-' + slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily;
                    } else {
                        if (fIndex === 0) {
                            sliceData.fareFamily += sliceData.fareFamily.length === 0 ? MMBDatalayerConstants.DATALAYER_VALUES.DEPARTURE + ':' + slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily : '-' + slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily;
                        } else {
                            returnFare += returnFare.length === 0 ? ';' + MMBDatalayerConstants.DATALAYER_VALUES.RETURN + ':' + slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily : '-' + slices[slicesArray[fIndex]].segments[tIndex].cabin.fareFamily;
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
                fFliyer: MMBDatalayerConstants.DATALAYER_VALUES.NO,
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
                    paxData.types += paxData.types.length === 0 ? MMBDatalayerConstants.DATALAYER_PASSENGER_TYPES[pax[p].type] : '|' + MMBDatalayerConstants.DATALAYER_PASSENGER_TYPES[pax[p].type];
                }
                if (pax[p].type !== 'INFANT') {
                    paxData.number = paxData.number ? paxData.number += 1 : 1;
                    if (pax[p].loyaltyCard !== 'PASSENGER_INFO_NO_LOYALTY_CARD') {
                        paxData.fFliyer = MMBDatalayerConstants.DATALAYER_VALUES.YES;
                    }
                }
            }
            return paxData;
        };
        const paxData = getPassengerData(confirmData.generalInfo.passengerInfo), sliceData = getSliceData(confirmData.generalInfo.flightInfo);
        const residentDiscount = confirmData.generalInfo?.specialDiscounts && confirmData.generalInfo?.specialDiscounts?.find( ( discount ) => discount.type === this.MmBAppConstants.DISCOUNT_TYPE.RESIDENT );
        const largeFamilyDiscount = confirmData.generalInfo?.specialDiscounts && confirmData.generalInfo?.specialDiscounts?.find( ( discount ) => discount.type === this.MmBAppConstants.DISCOUNT_TYPE.LARGE_FAMILY );
        const confDataLayer:datalayerServiceTypes.ConfDataLayer = {
            antelacionCompra: '',
            flightRatio: confirmData.generalInfo.flightRatio,
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
            tarifaBarata: sliceData.claseReserva.indexOf('R') > -1 ? MMBDatalayerConstants.DATALAYER_VALUES.YES : MMBDatalayerConstants.DATALAYER_VALUES.NO,
            tipoPax: paxData.types,
            tipoVuelo: sliceData.tipoVuelo,
            titularIberiaPlus: paxData.fFliyer,
            trayectoBuscado: confirmData.generalInfo.origin.code + ',' + confirmData.generalInfo.destination.code,
            trayectoPais: confirmData.generalInfo.origin.city.countryCode + '-' + confirmData.generalInfo.destination.city.countryCode
        };
        residentDiscount?.discountCode && ( confDataLayer[ MMBDatalayerConstants.DATALAYER_INFO.RESIDENT ] = residentDiscount.discountCode );
        largeFamilyDiscount?.discountType && ( confDataLayer[ MMBDatalayerConstants.DATALAYER_INFO.LARGE_FAMILY ] = this.mapLargeFamilyDiscountType(largeFamilyDiscount.discountType));
        this.addDataLayerInfo(confDataLayer);
    };

    updateDigitalDataForFlexFlights = (objectDigitalDataForFlexFlights) => {
        const bookingInfo = this.localStorageService.get<any>('bookingInfo');
        const slices = bookingInfo?.order?.slices;
        const digitalDataObject = {};
        const specialDiscounts = objectDigitalDataForFlexFlights.specialDiscounts ?? bookingInfo.order?.specialDiscounts;
        const residentDiscount = specialDiscounts?.find( ( discount ) => discount.type === this.MmBAppConstants.DISCOUNT_TYPE.RESIDENT );
        const largeFamilyDiscount = specialDiscounts?.find( ( discount ) => discount.type === this.MmBAppConstants.DISCOUNT_TYPE.LARGE_FAMILY );
        objectDigitalDataForFlexFlights.aviosEarned !== null ? digitalDataObject[ MMBDatalayerConstants.DATALAYER_MMB_INFO.AVIOS_EARNED ] = objectDigitalDataForFlexFlights.aviosEarned : angular.noop;
        if(objectDigitalDataForFlexFlights.changeAcceptance!== null){
            objectDigitalDataForFlexFlights.changeAcceptance ? digitalDataObject[ MMBDatalayerConstants.DATALAYER_MMB_INFO.CHANGE_ACCEPTANCE ] = MMBDatalayerConstants.DATALAYER_MMB_VALUES.TOTAL : digitalDataObject[ MMBDatalayerConstants.DATALAYER_MMB_INFO.CHANGE_ACCEPTANCE ] = MMBDatalayerConstants.DATALAYER_MMB_VALUES.PARTIAL;
        }
        objectDigitalDataForFlexFlights.changeType === 'ISSUED' ? digitalDataObject[ MMBDatalayerConstants.DATALAYER_MMB_INFO.CHANGE_TYPE ] = MMBDatalayerConstants.DATALAYER_MMB_VALUES.VOLUNTARY : digitalDataObject[ MMBDatalayerConstants.DATALAYER_MMB_INFO.CHANGE_TYPE ] = MMBDatalayerConstants.DATALAYER_MMB_VALUES.INVOLUTARY;
        digitalDataObject[ MMBDatalayerConstants.DATALAYER_MMB_INFO.FLIGHT_STATUS ] = objectDigitalDataForFlexFlights.flightStatus;
        (objectDigitalDataForFlexFlights.flightHaul!=null) && (digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.FLIGHT_HAUL] = objectDigitalDataForFlexFlights.flightHaul);
        objectDigitalDataForFlexFlights.originalAdvancePurchase!=null && (digitalDataObject[ MMBDatalayerConstants.DATALAYER_MMB_INFO.ORIGINAL_ADVANCE_PURCHASE ] = objectDigitalDataForFlexFlights.originalAdvancePurchase);
        objectDigitalDataForFlexFlights.originalDate != null && (digitalDataObject[ MMBDatalayerConstants.DATALAYER_MMB_INFO.ORIGINAL_DATE ] = objectDigitalDataForFlexFlights.originalDate);
        objectDigitalDataForFlexFlights.originalLengthStay !== null && (digitalDataObject[ MMBDatalayerConstants.DATALAYER_MMB_INFO.ORIGINAL_LENGTH_STAY ] = objectDigitalDataForFlexFlights.originalLengthStay);
        objectDigitalDataForFlexFlights.lengthStay !== null && (digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.LENGTH_STAY ] = objectDigitalDataForFlexFlights.lengthStay);
        objectDigitalDataForFlexFlights.pnrType != null && (digitalDataObject[ MMBDatalayerConstants.DATALAYER_MMB_INFO.PNR_TYPE] = objectDigitalDataForFlexFlights.pnrType);
        objectDigitalDataForFlexFlights.purchaseDate !== null && (digitalDataObject[MMBDatalayerConstants.DATALAYER_MMB_INFO.PURCHASE_DATE] = objectDigitalDataForFlexFlights.purchaseDate);
        objectDigitalDataForFlexFlights.purchaseType !== null && (digitalDataObject[ MMBDatalayerConstants.DATALAYER_MMB_INFO.PURCHASE_TYPE ] = objectDigitalDataForFlexFlights.purchaseType);
        digitalDataObject[ MMBDatalayerConstants.DATALAYER_MMB_INFO.SPECIAL_MEAL ] = objectDigitalDataForFlexFlights.specialMeal === true ? MMBDatalayerConstants.DATALAYER_MMB_VALUES.YES : MMBDatalayerConstants.DATALAYER_MMB_VALUES.NO;

        objectDigitalDataForFlexFlights.voucherDiscount ? digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.VOUCHER_DISCOUNT ] = objectDigitalDataForFlexFlights.voucherDiscount : angular.noop;
        objectDigitalDataForFlexFlights.aviosRedeemed ? digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.AVIOS_DISCOUNT ] = objectDigitalDataForFlexFlights.aviosRedeemed : angular.noop;
        objectDigitalDataForFlexFlights.flightType ? digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.FLIGHT_TYPE ] = objectDigitalDataForFlexFlights.flightType : angular.noop;
        objectDigitalDataForFlexFlights.rolCip ? digitalDataObject[ MMBDatalayerConstants.DatalayerGeneralConstants.ROL_CIP ] = objectDigitalDataForFlexFlights.rolCip : angular.noop;

        objectDigitalDataForFlexFlights.currency ? digitalDataObject[ MMBDatalayerConstants.DatalayerGeneralConstants.CURRENCY ] = objectDigitalDataForFlexFlights.currency : angular.noop;
        objectDigitalDataForFlexFlights.reference ? digitalDataObject[ MMBDatalayerConstants.DatalayerGeneralConstants.REFERENCE ] = objectDigitalDataForFlexFlights.reference : angular.noop;
        objectDigitalDataForFlexFlights.bookingClass ? digitalDataObject[ MMBDatalayerConstants.DatalayerGeneralConstants.BOOKING_CLASS ] = objectDigitalDataForFlexFlights.bookingClass : angular.noop;
        objectDigitalDataForFlexFlights.airportSeg ? digitalDataObject[ MMBDatalayerConstants.DatalayerGeneralConstants.ORIGIN_DESTINATIONS ] = objectDigitalDataForFlexFlights.airportSeg : angular.noop;
        objectDigitalDataForFlexFlights.searchCountries && (digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.SEARCH_COUNTRIES ] = objectDigitalDataForFlexFlights.searchCountries);
        objectDigitalDataForFlexFlights.advancePurchase && (digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.ADVANCE_PURCHASE ] = objectDigitalDataForFlexFlights.advancePurchase);
        objectDigitalDataForFlexFlights.searchOrigin && (digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.SEARCH_ORIGIN ] = objectDigitalDataForFlexFlights.searchOrigin);
        objectDigitalDataForFlexFlights.searchOD ? digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.SEARCH_OD ] = objectDigitalDataForFlexFlights.searchOD : angular.noop;
        objectDigitalDataForFlexFlights.searchDest ? digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.SEARCH_DEST ] = objectDigitalDataForFlexFlights.searchDest : angular.noop;
        if ( objectDigitalDataForFlexFlights.passengersInfo ) {
            digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.PAX_TOTAL ] = objectDigitalDataForFlexFlights.passengersInfo.totalAmount;
            digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.PAX_ADULT ] = objectDigitalDataForFlexFlights.passengersInfo.adults;
            digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.PAX_CHILD ] = objectDigitalDataForFlexFlights.passengersInfo.kids;
            digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.PAX_INFANT ] = objectDigitalDataForFlexFlights.passengersInfo.babies;
            digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.PAX_SENIOR ] = objectDigitalDataForFlexFlights.passengersInfo.seniors;
            digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.PAX_YOUNG ] = objectDigitalDataForFlexFlights.passengersInfo.young;
        }
        // if ( objectDigitalDataForFlexFlights.pricesInfo ) {
        //     digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.TOTAL_TAXES ] = this.addDecimalInPriceInfo(objectDigitalDataForFlexFlights.pricesInfo.totalTax);
        //     digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.TOTAL_PRICE_WITHOUT_TAXES ] = this.addDecimalInPriceInfo(objectDigitalDataForFlexFlights.pricesInfo.noTax);
        // }
        for(let i = 0; i < slices.length; i++) {
            objectDigitalDataForFlexFlights[`slice${i+1}OriginalDate`] && (digitalDataObject[ MMBDatalayerConstants.DATALAYER_MMB_INFO[`SLICE${i+1}_ORIGINAL_DATE`] ] = objectDigitalDataForFlexFlights[`slice${i+1}OriginalDate`]);
            objectDigitalDataForFlexFlights[`slice${i+1}Flights`] && (digitalDataObject[ `Slice${i+1}Flights` ] = objectDigitalDataForFlexFlights[`slice${i+1}Flights`]);
            objectDigitalDataForFlexFlights[`slice${i+1}Operator`] && (digitalDataObject[ `Slice${i+1}Operator` ] = objectDigitalDataForFlexFlights[`slice${i+1}Operator`]);
            objectDigitalDataForFlexFlights[`slice${i+1}Cabin`] && (digitalDataObject[ `Slice${i+1}Cabin` ] = objectDigitalDataForFlexFlights[`slice${i+1}Cabin`]);
            objectDigitalDataForFlexFlights[`slice${i+1}FareFamily`] && (digitalDataObject[ `Slice${i+1}FareFamily` ] = objectDigitalDataForFlexFlights[`slice${i+1}FareFamily`]);
            objectDigitalDataForFlexFlights[`slice${i+1}Routing`] && (digitalDataObject[ `Slice${i+1}Routing` ] = objectDigitalDataForFlexFlights[`slice${i+1}Routing`]);
        };
        residentDiscount?.discountCode && ( digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.RESIDENT_CODE ] = residentDiscount.discountCode );
        largeFamilyDiscount?.discountType && ( digitalDataObject[ MMBDatalayerConstants.DatalayerBKIConstants.LARGE_FAMILY ] = this.mapLargeFamilyDiscountType(largeFamilyDiscount.discountType));
        bookingInfo?.order?.orderId && ( digitalDataObject[ MMBDatalayerConstants.DATALAYER_INFO.ORDER_ID ] = bookingInfo?.order?.orderId );


        this.addDigitalDataInfo( digitalDataObject );
    };

    //NEED REFACTOR
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
                            datalayerObject[`slice${i+1}Haul`] = MMBDatalayerConstants.FLIGHT_RATIO_TYPES.SHORT;
                        } else if(hauls[j].haul === 'MH' || hauls[j].haul === 'Medio Radio') {
                            datalayerObject[`slice${i+1}Haul`] = MMBDatalayerConstants.FLIGHT_RATIO_TYPES.MEDIUM;
                        } else if(hauls[j].haul === 'LH' || hauls[j].haul === 'Largo Radio') {
                            datalayerObject[`slice${i+1}Haul`] = MMBDatalayerConstants.FLIGHT_RATIO_TYPES.LONG;
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

    /* INIT DELETE GA4 MIGRATION*/
    private addDatalayerInfoHashEID = (customerData): void => {
        if(angular.isDefined(customerData) && angular.isObject(customerData) && angular.isObject(customerData.personalInfo) && angular.isString(customerData.personalInfo.contactEmail)) {
            this.CommonsUtilService.sha256(customerData.personalInfo.contactEmail).then((hash) => {
                this.addDataLayerInfo({hashEID: hash});
            });
        }
    };
    /* FINISH DELETE GA4 MIGRATION*/
    private addDigitalDataInfoHashEID = (customerData): void => {
        if(angular.isDefined(customerData) && angular.isObject(customerData) && angular.isObject(customerData.personalInfo) && angular.isString(customerData.personalInfo.contactEmail)) {
            this.CommonsUtilService.sha256(customerData.personalInfo.contactEmail).then((hash) => {
                this.addDigitalDataInfo({HashEID: hash});
            });
        }
    };

    updateDatalayerEvents = (eventCategory:string, eventAction:string, eventLabel:string, eventName: string = ''): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const extendedDatalayerInfo = {};
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.EVENT_CATEGORY] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventCategory));
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.EVENT_ACTION] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventAction));
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.EVENT_LABEL] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventLabel));
        this.addDataLayerInfo(extendedDatalayerInfo);
        this.MmBDataLayerService.callUpdateTagManager(MMBDatalayerConstants.DATALAYER_EVENT_TYPES.LINK);
        /* FINISH DELETE GA4 MIGRATION*/

        this.updateDatalayerEvent(this.$filter('EliminateHyphenFilter')(this.$filter('EliminateAccentFilter')(eventCategory)),
            this.$filter('EliminateHyphenFilter')(this.$filter('EliminateAccentFilter')(eventAction)),
            this.$filter('EliminateHyphenFilter')(this.$filter('EliminateAccentFilter')(eventLabel)),
            this.$filter('EliminateHyphenFilter')(this.$filter('EliminateAccentFilter')(eventName))
        );
        this.MonetateUtilsService.updateDigitalDataMonetate();
        this.$rootScope.$broadcast('sendUpdateToMonetate');
    };

    updateDatalayerInfo = (process, step, quadrigam): void => {
         /* INIT DELETE GA4 MIGRATION*/
        this.updateDatalayerWithQuadrigam(quadrigam, null, this.localStorageService.get('userLogged'));
        /* FINISH DELETE GA4 MIGRATION*/
        this.updateDigitalDataWithQuadrigam(quadrigam, null, this.localStorageService.get('userLogged'));
        process && step ? this.setProcessAndStep(process, step, quadrigam) : this.removeProcessAndStep();
        /* INIT DELETE GA4 MIGRATION*/
        this.sendDatalayerEvent(MMBDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        /* FINISH DELETE GA4 MIGRATION*/
        this.updateDatalayerViewEvent();
        // this.MmBDataLayerService.callUpdateTagManager(MMBDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        this.$rootScope.$broadcast('updateMonetateInfo');
    };

    setProcessAndStep = (process: string, step: string, quadrigam?: string, quadrigamAsStep = true): void => {
        const quadrigamLocal: string = quadrigam ? quadrigam : '';
        const stepLocal: string = (MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam] && quadrigamAsStep) ? MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam] : step ? step : '';
        let processLocal: string = process ? process : '';

        /* INIT DELETE GA4 MIGRATION*/
        const extendedDatalayerInfo = {};
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.PROCESS] = processLocal;
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.STEP] = stepLocal;
        extendedDatalayerInfo[MMBDatalayerConstants.DATALAYER_INFO.QUADRIGAM] = quadrigamLocal;
        this.addDataLayerInfo(extendedDatalayerInfo);
        /* FIN DELETE GA4 MIGRATION*/

        const extendedDigitalDataInfo = {};
        extendedDigitalDataInfo[MMBDatalayerConstants.DatalayerGeneralConstants.PROCESS] = processLocal;
        extendedDigitalDataInfo[MMBDatalayerConstants.DatalayerGeneralConstants.STEP] = stepLocal;
        extendedDigitalDataInfo[MMBDatalayerConstants.DatalayerGeneralConstants.QUADRIGAM] = quadrigamLocal;
        this.addDigitalDataInfo(extendedDigitalDataInfo);
    };

    private removeProcessAndStep = () => {
        /* INIT DELETE GA4 MIGRATION*/
        this.removeDatalayerObjects(this.DATALAYER_PROCESS_AND_STEP_ATTR);
        /* FINISH DELETE GA4 MIGRATION*/
        this.removeDigitalDataObjects(this.DIGITAL_DATA_PROCESS_AND_STEP_ATTR);
    };

    private getStepFromQuadrigam = (quadrigam:string, defaultValue: string) => {
        const quadrigamToStep = {
            OHBKCF: MMBDatalayerConstants.DATALAYER_VIEWS.ONHOLD_CONFIRMATION,
            ATCPURC: MMBDatalayerConstants.DIGITAL_DATA_STEP.ATCPURC,
            ONHOLD: MMBDatalayerConstants.DATALAYER_VIEWS.ONHOLD_PAYMENT,
            default: defaultValue
        };
        return quadrigamToStep[quadrigam] || quadrigamToStep.default;
    };

    private getUserState = (isUserLogged: boolean): string => {
        const userLogged: any = this.localStorageService.get('userLogged');
        const logged: datalayerServiceTypes.LoggedDatalayer | null = this.localStorageService.get('EstadoUsuario');
        let userState: string = MMBDatalayerConstants.DATALAYER_USER_STATES.ANONYMOUS;
        if (isUserLogged) {
            if (!this.CommonsUserUtilsService.getUserRole()) {
                this.CommonsUtilService.getUserTypeByToken();
            }
            userState =
                this.CommonsUserUtilsService.isIbPlus()
                    ? (this.CommonsUserUtilsService.isSoftUser() ? MMBDatalayerConstants.DATALAYER_USER_STATES.LOGGED_FF_SOFT : MMBDatalayerConstants.DATALAYER_USER_STATES.LOGGED_FF_HARD)
                    : (this.CommonsUserUtilsService.isSoftUser() ? MMBDatalayerConstants.DATALAYER_USER_STATES.LOGGED_IB_SOFT : MMBDatalayerConstants.DATALAYER_USER_STATES.LOGGED_IB_HARD);
            if (logged && logged.loggedBy) {
                userState = (logged.loggedBy === 'email') ? MMBDatalayerConstants.DATALAYER_USER_STATES.LOGGED_MAIL : userState;
            } else {
                userState = (userLogged === this.MmBAppConstants.LOGIN_ONB) ? MMBDatalayerConstants.DATALAYER_USER_STATES.LOGGED_ONB : userState;
            }
        } else {
            userState = MMBDatalayerConstants.DATALAYER_USER_STATES.ANONYMOUS;
        }

        return userState;
    };

    getItemCategory3 = (outboundRoute: string, id: string, slices): string => {
        let result: string = 'all';

        slices.forEach((element, i) => {
            element?.segments.forEach( segment => {
                if(outboundRoute === `${segment?.departure?.code}-${segment?.arrival?.code}`) {
                    result = (i+1).toString();
                }
            });
        });

        if (result === 'all' && id) {
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

    setInsuranceEcommerce = (insurance: any, event: string) => {
        const digital_data_ecommerce: MMBDigitalDataEcommerceModel.ViewItemList = { items: [] };
        const id = this.CommonsUtilService.getIdItem('all');
        const item_brand = insurance?.provider ? insurance.provider.toLowerCase() : 'null';
        const item: MMBDigitalDataEcommerceModel.Item= {
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
            this.MmBDigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, event);
            if (event === MMBDatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART && !this.CommonsUtilService.checkIsAddToCart('insurance')) {
                this.MmBDigitalDataService.setAddInfoAddToCart(digital_data_ecommerce);
            } else {
                this.MmBDigitalDataService.setRemoveInfoAddToCart(digital_data_ecommerce);
            }
        }

    };

    private getItemCategory = (): string => {
        const flowApp = this.localStorageService.get('flowApp');
        switch (flowApp) {
                case this.AncillariesConstants.APPLICATION_FLOW.MMB: return 'mmb';
                default: return MMBDatalayerConstants.DATALAYER_VALUES.PURCHASE_CATEGORY.DIRECT.toLowerCase();
        }
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
                    case this.MmBAppConstants.DISCOUNT_TYPE.CORPORATE:
                        if (current.discountType === 'ODM') {
                            discString += `_${current.discountType}`;
                        }
                        discString += `_${current.corporateCodes}`;
                        break;
                    case this.MmBAppConstants.DISCOUNT_TYPE.RESIDENT:
                        discString += `_${current.discountCode}`;
                        break;
                    case this.MmBAppConstants.DISCOUNT_TYPE.LARGE_FAMILY:
                        discString += `_${current.discountType}`;
                        break;
                    case this.MmBAppConstants.DISCOUNT_TYPE.PARTNER:
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

    getAncillariesDigitalDataEcommerce = (typeAncillaries: string, event: string): void => {
        const digital_data_ecommerce: MMBDigitalDataEcommerceModel.ViewItemList = { items: [] };
        const ancillariesInfo: any = this.localStorageService.get('ancillariesInfo');
        const selectedTripInfo: any = this.localStorageService.get('selectedTripInfo');
        const confirmationDatalayerInfo: any = this.localStorageService.get('confirmationDatalayerInfo');

        if (ancillariesInfo) {
            let id = this.CommonsUtilService.getIdItem('all');
            ancillariesInfo?.ancillaries.forEach(anc => {
                if (typeAncillaries === 'baggages' && anc.type === 'BAGGAGE') {
                    anc.slices.forEach(slice => {
                        const itemCategory2: string = this.getItemCategory2(slice);
                        slice?.passengers[0]?.pieces.forEach(piece => {
                            const item: MMBDigitalDataEcommerceModel.Item= {
                                item_name: 'baggage',
                                item_id: id,
                                price: piece?.availablePriceRanges[0]?.amount,
                                item_brand: this.getBrandItem(slice?.id, slice?.id),
                                item_category: this.getItemCategory(),
                                item_category2: itemCategory2,
                                item_category3: this.getItemCategory3('baggage', itemCategory2, id),
                                item_variant: piece?.description.replace('Kg', 'kilos').replace('kg', 'kilos').replace(' ', '')
                            };
                            digital_data_ecommerce.items.push(item);
                        });
                    });
                } else if (typeAncillaries === 'seat' && anc.type === 'SEAT') {
                    const seatMap: any = this.localStorageService.get('seatMap');
                    const itemCategory2: string = this.getTripBySeats();
                    seatMap?.seatPriceInfo?.seatPrices?.forEach(seatPrice => {
                        const item: MMBDigitalDataEcommerceModel.Item= {
                            item_name: 'seat',
                            item_id: id,
                            price: seatPrice.amount,
                            item_brand: selectedTripInfo ? selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase() : this.getBrandItem(itemCategory2, null),
                            item_category: this.getItemCategory(),
                            item_category2: itemCategory2,
                            item_category3: this.getItemCategory3('seat', itemCategory2, id),
                            item_variant: seatPrice.type.toLowerCase()
                        };
                        digital_data_ecommerce.items.push(item);
                    });
                } else if (typeAncillaries === 'insurance' && anc.type === 'INSURANCE') {
                    id = this.CommonsUtilService.getIdItem('all');
                    anc.offers.forEach(offer => {
                        const item: MMBDigitalDataEcommerceModel.Item= {
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
                        const item: MMBDigitalDataEcommerceModel.Item= {
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

                } else if (typeAncillaries === 'special baggages' && anc.type === 'SPECIAL_EQUIPMENT') {
                    anc.slices.forEach(slice => {
                        const itemCategory2: string = this.getItemCategory2(slice);
                        slice?.passengers[0]?.pieces.forEach(piece => {
                            let item: MMBDigitalDataEcommerceModel.Item= {
                                item_name: 'special baggage',
                                item_id: id,
                                price: piece?.availablePriceRanges[0]?.amount,
                                item_brand: this.getBrandItem(slice?.id, slice?.id),
                                item_category: this.getItemCategory(),
                                item_category2: itemCategory2,
                                item_category3: this.getItemCategory3('special baggage', itemCategory2, id),
                                item_variant: this.getSpeqsVariant(piece)
                            };
                            digital_data_ecommerce.items.push(item);
                        });
                    });
                } else if (typeAncillaries === this.AncillariesConstants.DATALAYER_INFO.PRIORITY_BOARDING && anc.type === this.AncillariesConstants.ANCILLARIES_TYPES.PRIORITY_BOARDING) {
                    id = this.CommonsUtilService.getIdItem('all');
                    anc.segments.forEach(segment => {
                        const itemCategory2: string = this.getItemCategory2(this.CommonsUtilService.getSliceById(segment?.id));
                        const item: MMBDigitalDataEcommerceModel.Item= {
                            item_name: this.AncillariesConstants.DATALAYER_INFO.PRIORITY_BOARDING,
                            item_id: id,
                            price: segment?.passengers[0].amount,
                            item_brand: selectedTripInfo ? selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase() : this.getBrandItem(id, null),
                            item_category: this.getItemCategory(),
                            item_category2: itemCategory2,
                            item_category3: this.getItemCategory3(this.AncillariesConstants.DATALAYER_INFO.PRIORITY_BOARDING, itemCategory2, id),
                            item_variant: ''
                        };
                        digital_data_ecommerce.items.push(item);
                    });

                }
            });

            if(typeAncillaries === this.AncillariesConstants.DATALAYER_INFO.BUNDLE) {
                ancillariesInfo.bundles.forEach((bundle: any) => {
                    const item: MMBDigitalDataEcommerceModel.Item= {
                        item_name: this.AncillariesConstants.DATALAYER_INFO.BUNDLE,
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
            this.MmBDigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce, event);
        }
    };

    getItemCategory2 = (slice: any): string => {
        let category2: string = slice.id.substring(0, 3) + '-' + slice.id.substring(3, 6);

        return category2;
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

    private getSpeqsVariant = (piece: any): string => {
        switch (piece?.subtype) {
                case this.AncillariesConstants.SPEQS_SUBTYPE.SKI_SNOW: return this.AncillariesConstants.DATALAYER_INFO.SKI_SNOW;
                case this.AncillariesConstants.SPEQS_SUBTYPE.BICYCLE: return this.AncillariesConstants.DATALAYER_INFO.BICYCLE;
                case this.AncillariesConstants.SPEQS_SUBTYPE.GOLF_EQUIPMENT: return this.AncillariesConstants.DATALAYER_INFO.GOLF_EQUIPMENT;
                default: return '';
        }
    };
    private getTripBySeats = (): string => {
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


    setSelectItemAndAddToCartBundle (selectedBundle: any): void {
        const selectedTripInfo: any = this.localStorageService.get('selectedTripInfo');
        const id = this.CommonsUtilService.getIdItem('all');
        const digital_data_ecommerce_select_item: MMBDigitalDataEcommerceModel.ViewItemList = { items: [] };
        const digital_data_ecommerce_add_to_cart: MMBDigitalDataEcommerceModel.ViewItemList = { items: [] };
        const item: MMBDigitalDataEcommerceModel.Item= {
            item_name: this.AncillariesConstants.DATALAYER_INFO.BUNDLE,
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
            const item: MMBDigitalDataEcommerceModel.Item= {
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
            this.MmBDigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce_select_item, MMBDatalayerConstants.EVENTS_ECOMMERCE.SELECT_ITEM);
            this.MmBDigitalDataService.addDigitalDataEcommerceEvent(digital_data_ecommerce_add_to_cart, MMBDatalayerConstants.EVENTS_ECOMMERCE.ADD_TO_CART);
            this.MmBDigitalDataService.setAddInfoAddToCart(digital_data_ecommerce_add_to_cart);
        }
    }

    private getBundleItemTypeName (type: string): string {
        switch(type) {
                case this.AncillariesConstants.TYPE_ANCILLARIE.BAGGAGE:
                    return this.AncillariesConstants.DATALAYER_INFO.BAGGAGE;
                case this.AncillariesConstants.TYPE_ANCILLARIE.SPEQS:
                    return this.AncillariesConstants.DATALAYER_INFO.SPECIAL_EQUIPMENT;
                case this.AncillariesConstants.TYPE_ANCILLARIE.FLEXIBILITY:
                    return this.AncillariesConstants.DATALAYER_INFO.FLEXIBILITY_ON_DEMAND;
                case this.AncillariesConstants.TYPE_ANCILLARIE.PRIORITY_BOARDING:
                    return this.AncillariesConstants.DATALAYER_INFO.PRIORITY_BOARDING;
        }
    }

    private getBundleItemSubtypeName (subtype: string): string {
        switch(subtype) {
                case this.AncillariesConstants.ANCILLARIES_SUBTYPES.BAGGAGE_15:
                    return this.AncillariesConstants.DATALAYER_INFO.BAGGAGE + ' 15Kg';
                case this.AncillariesConstants.ANCILLARIES_SUBTYPES.BAGGAGE_23:
                    return this.AncillariesConstants.DATALAYER_INFO.BAGGAGE + ' 23Kg';
                case this.AncillariesConstants.ANCILLARIES_SUBTYPES.BAGGAGE_32:
                    return this.AncillariesConstants.DATALAYER_INFO.BAGGAGE + ' 32Kg';

                case this.AncillariesConstants.ANCILLARIES_SUBTYPES.BICYCLE:
                    return this.AncillariesConstants.DATALAYER_INFO.BICYCLE;
                case this.AncillariesConstants.ANCILLARIES_SUBTYPES.GOLF_EQUIPMENT:
                    return this.AncillariesConstants.DATALAYER_INFO.GOLF_EQUIPMENT;
                case this.AncillariesConstants.ANCILLARIES_SUBTYPES.SKI_SNOW:
                    return this.AncillariesConstants.DATALAYER_INFO.SKI_SNOW;

                case this.AncillariesConstants.ANCILLARIES_SUBTYPES.FLEXIBILITY_PACK:
                    return this.AncillariesConstants.DATALAYER_INFO.FLEXIBILITY_PACK;
                case this.AncillariesConstants.ANCILLARIES_SUBTYPES.FLIGHT_CHANGE:
                    return this.AncillariesConstants.DATALAYER_INFO.FLIGHT_CHANGE;
                case this.AncillariesConstants.ANCILLARIES_SUBTYPES.VOUCHER_REFUND:
                    return this.AncillariesConstants.DATALAYER_INFO.VOUCHER_REFUND;
                default:
                    return this.AncillariesConstants.DATALAYER_INFO.PRIORITY_BOARDING;
        }
    }

    /**
     * Generates the confirmation info of datalayer and stores it in session storage
     * @param ancillariesAction
     */
    setAncillariesAction = (ancillariesAction: object): void => {
        /* INIT DELETE GA4 MIGRATION*/
        const confirmationDatalayerInfo = this.localStorageService.get('confirmationDatalayerInfo') || {};
        confirmationDatalayerInfo[this.MmBAppConstants.DATALAYER_INFO.ANCILLARIES_ACTION] = ancillariesAction;
        this.localStorageService.set('confirmationDatalayerInfo', confirmationDatalayerInfo);
        /* FINISH DELETE GA4 MIGRATION*/
    };

    setAncillariesDatalayer = () => {
        const extendDatalayer: object = {};
        const bookingInfo: ImportOrderData.completeOrder = this.localStorageService.get('bookingInfo');
        let pnr:string = this.localStorageService.get('PNR') || bookingInfo.order.orderItems.find( orderItem => orderItem.type === 'flight').bookingReferences[0].reference,
        headerModel:any = this.localStorageService.get('headerModel'),
        ancillariesAction:string = this.localStorageService.get('ancillariesAction'),
        insuranceType = headerModel.headerModel.shoppingBasket.insurance?.info?.type,
        totalQuantitySeats = 0,
        totalQuantityBaggage = 0,
        totalQuantitySpeqs = 0;
        if (pnr && pnr.length > 0) {
            extendDatalayer[MMBDatalayerConstants.DatalayerGeneralConstants.REFERENCE] = pnr;
            this.addDataLayerInfo(extendDatalayer);
        }
        this.quantyTotalAncillaries(headerModel, totalQuantityBaggage, totalQuantitySeats, insuranceType, totalQuantitySpeqs);
        this.updateDatalayerForAncillaries(
            true,
            ancillariesAction,
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
        this.updateDigitalDataForAncillaries
        (
            true,
            MMBDatalayerConstants.DATALAYER_EVENT_TYPES.CLICK,
            headerModel,
            insuranceType
        );
    }

    private quantyTotalAncillaries = (headerModel, totalQuantityBaggage, totalQuantitySeats, insuranceType, totalQuantitySpeqs) => {
        let i, j;
        if (headerModel.headerModel.shoppingBasket.baggages.hasBaggage) {
            for (i = 0; i < headerModel.headerModel.shoppingBasket.baggages.segments.length; i++) {
                for (j = 0; j < headerModel.headerModel.shoppingBasket.baggages.segments[i].baggages.length; j++) {
                    totalQuantityBaggage += headerModel.headerModel.shoppingBasket.baggages.segments[i].baggages[j].quanty;
                }
            }
        }
        if (headerModel.headerModel.shoppingBasket.seats.hasSeats) {
            for (i = 0; i < headerModel.headerModel.shoppingBasket.seats.segments.length; i++) {
                totalQuantitySeats += headerModel.headerModel.shoppingBasket.seats.segments[i].quanty;
            }
        }
        if (headerModel.headerModel.shoppingBasket.insurance.hasInsurance) {
            insuranceType = headerModel.headerModel.shoppingBasket.insurance.info.type;
        }
        if (headerModel.headerModel.shoppingBasket.speqs.hasSpeqs) {
            for (i = 0; i < headerModel.headerModel.shoppingBasket.speqs.segments.length; i++) {
                for (j = 0; j < headerModel.headerModel.shoppingBasket.speqs.segments[i].speqs.length; j++) {
                    totalQuantitySpeqs += headerModel.headerModel.shoppingBasket.speqs.segments[i].speqs[j].quanty;
                }
            }
        }
    }

}
