import * as angular from 'angular';
import { DatalayerConstants } from '../constants/ib-datalayer-constants';
import { DataLayerService } from './ib-datalayer.service';
import { DigitalDataService } from './ib-digital-data.service';
import { DatalayerGeneralConstants } from '../constants/ib-datalayer-general-constants';
import { DatalayerBKIConstants } from '../constants/ib-datalayer-bki-constants';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { insuranceSelected } from '@src/app/core/models/generic-models/generic-models';
import { DigitalDataPropertiesUtilsService } from './ib-digital-data-properties-utils.service';

@Service('ib-datalayer-bki-module', ['DataLayerService', '$rootScope', '$timeout', 'CommonsConstants',
    'localStorageService', 'CommonsUtilService', '$filter', 'CommonsUserUtilsService', 'MonetateUtilsService',
    'DigitalDataService', 'CommonsSessionStorageService', 'DigitalDataPropertiesUtilsService'], ['ib-commons-constants-module', 'ib-monetate-bki-module'])
export class DatalayerUtilsService {
    public DATALAYER_ERROR_ATTR: string[] = [DatalayerConstants.DATALAYER_INFO.ERROR_CODE, DatalayerConstants.DATALAYER_INFO.ERROR_DESCRIPTION, DatalayerConstants.DATALAYER_INFO.INTERNAL_ERROR_CODE];
    public DATALAYER_MODAL_ATTR: string[] = [DatalayerConstants.DATALAYER_INFO.MODAL_ID];
    public LANG: string;
    public MARKET: string;
    private DEPRECATED_DATALAYER_FUNCTIONS = [
        'addDataLayerInfo',
        'updateLoggedDatalayer',
        'removeDatalayerObjects',
        'updateDatalayerWithQuadrigam',
        'sendDatalayerErrorEvent',
        'addDatalayerInfoHashEID',
        'generateConfirmationDatalayerObject',
        'setAncillariesAction',
        'updateDatalayerActionForAncillaries',
        'addShuttleDatalayer'
    ] as const;

    public addDataLayerInfo!: (...args: any[]) => void;
    public updateLoggedDatalayer!: (...args: any[]) => void;
    public removeDatalayerObjects!: (...args: any[]) => void;
    public updateDatalayerWithQuadrigam!: (...args: any[]) => void;
    public sendDatalayerErrorEvent!: (...args: any[]) => void;
    public addDatalayerInfoHashEID!: (...args: any[]) => void;
    public generateConfirmationDatalayerObject!: (...args: any[]) => void;
    public setAncillariesAction!: (...args: any[]) => void;
    public updateDatalayerActionForAncillaries!: (...args: any[]) => void;
    public addShuttleDatalayer!: (...args: any[]) => void;
    
    constructor (
        private DataLayerService: DataLayerService,
        private $rootScope: CommonsRootScope,
        private $timeout: ng.ITimeoutService,
        private CommonsConstants: CommonsConstantsType,
        private localStorageService: ng.local.storage.ILocalStorageService,
        private CommonsUtilService: CommonsUtilService,
        private $filter: ng.FilterFactory,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private MonetateUtilsService: MonetateUtilsService,
        private DigitalDataService: DigitalDataService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private DigitalDataPropertiesUtilsService: DigitalDataPropertiesUtilsService
    ) {
        this.addCompatibiltyDatalayerVoidFunctions();
    }

    
    private addCompatibiltyDatalayerVoidFunctions = (): void => {
        const compatibilityFunction = (...args: unknown[]): void => {
            void args;
        };

        this.DEPRECATED_DATALAYER_FUNCTIONS.forEach((functionName) => {
            this[functionName] = compatibilityFunction;
        });
    };
    
    /**
     * Initialize the datalayer object
     */
    public initializeDatalayer = (language: string, market: string, deviceType: string): void => {
        const initialDigitalData = {};
        if (!this.DigitalDataService.isDigitalDataInit()) {
            this.LANG = language;
            this.MARKET = market;
            initialDigitalData[DatalayerGeneralConstants.LANGUAGE] = language;
            initialDigitalData[DatalayerGeneralConstants.MARKET] = market;
            initialDigitalData[DatalayerGeneralConstants.WEB_VERSION] = DatalayerConstants.DATALAYER_VALUES.WEB_VERSION;
            initialDigitalData[DatalayerGeneralConstants.WEB_MODE] = deviceType;
            this.DigitalDataService.initDigitalData(initialDigitalData);
        }
    };

    /**
     * Set the initial params of the datalayer object at availability
     */
    public setDatalayerAvailabilityInitialParams = (language: string, market: string, deviceType: string): void => {
        const initialDigitalData = {};
        this.LANG = language;
        this.MARKET = market;
        initialDigitalData[DatalayerGeneralConstants.LANGUAGE] = language;
        initialDigitalData[DatalayerGeneralConstants.MARKET] = market;
        initialDigitalData[DatalayerGeneralConstants.WEB_VERSION] = DatalayerConstants.DATALAYER_VALUES.WEB_VERSION;
        initialDigitalData[DatalayerGeneralConstants.WEB_MODE] = deviceType;
        this.addDigitalDataInfo(initialDigitalData);
    };

    /**
     * Sends a datalayer event to the server
     * @param {String} type the event type. If it is not a String, no event will be sent
    */
    public sendDatalayerEvent = (type: string): void => {
        if (angular.isString(type)) {
            this.$timeout(() => {
                this.$rootScope.$broadcast('updateDigitalData');
            });
        }
    };

    /**
     * Extends the current datalayer information with the received info
     * @param {unknown} datalayerInfo the information to extend current general datalayer info
     */
    public addDigitalDataInfo = (datalayerInfo: unknown): void => {
        this.DigitalDataService.addDigitalDataInfo(datalayerInfo);
    };

    /**
     * updates datalayer with the user logged info
     * @param {Object} customerData the user logged generalInfo information
     */
    public updateLoggedDigitalData = (customerData: CommonsDatalayerServiceTypes.CustomerDataDatalayer ) :void => {
        const extendDatalayer: object = {};
        let userLevel = '', aviosCoins = 0, userId = '', hashEID = '', userSegment = 0;

        if (customerData) {
            userLevel = customerData.category || ( customerData?.generalInfo?.category ?? '');
            aviosCoins = this.getAviosCoins(customerData);
            hashEID = customerData?.hashEID ?? '';
            userSegment = DatalayerConstants.DATALAYER_USER_LEVELS[userLevel.toUpperCase()] ?? 0;

            ({userId, userLevel} = this.setUserIdLevel(userId, userLevel));
            this.setHashEID(customerData, hashEID, extendDatalayer);

            userLevel && (extendDatalayer[DatalayerGeneralConstants.USER_LEVEL] = userLevel);
            userId && (extendDatalayer[DatalayerGeneralConstants.USER_ID] = userId);
            extendDatalayer[DatalayerGeneralConstants.AVIOS_COINS] = aviosCoins;
            extendDatalayer[DatalayerGeneralConstants.USER_AVIOS] = aviosCoins;
            extendDatalayer[DatalayerGeneralConstants.USER_SEGMENT] = userSegment;

            this.addDigitalDataInfo(extendDatalayer);
            this.addDigitalDataInfoHashEID(customerData);
            this.addDigitalDataMemberInfo();
        }
    };

    private setUserIdLevel = (userId:string, userLevel:string) => {
        const membershipData: CommonsDatalayerServiceTypes.MemberShipDatalayer = this.localStorageService.get('membershipData');
        if (this.CommonsUserUtilsService.isUserLoggedONB()) {
            userId = typeof membershipData?.clid === 'string' && membershipData.clid;
            userLevel = membershipData?.tierStatus?.status;
        } else {
            /* Despite the name it obtains the account identifier of IB0 too */
            const identifier = this.CommonsUserUtilsService.getFrequentFlyer();
            identifier !== 'NOT_FOUND' && (userId = identifier);
        }
        return {userId, userLevel};
    };
    
    private setHashEID = (customerData, hashEID, extendDatalayer) => {
        if (customerData.hashEID) {
            hashEID = customerData.hashEID;
            extendDatalayer[DatalayerGeneralConstants.HASH_EMAIL] = hashEID;
            this.addDigitalDataInfo(extendDatalayer);
        } else if(angular.isString(customerData.email)) {
            this.CommonsUtilService.sha256(customerData.email).then((hash) => {
                hashEID = hash;
                extendDatalayer[DatalayerGeneralConstants.HASH_EMAIL] = hashEID;
                this.addDigitalDataInfo(extendDatalayer);
            });
        }
        hashEID && (extendDatalayer[DatalayerGeneralConstants.HASH_EMAIL] = hashEID);
    };

    private getAviosCoins (customerData: CommonsDatalayerServiceTypes.CustomerDataDatalayer): number{
        let aviosGeneralInfo = customerData.generalInfo && customerData.generalInfo.avios
            ? customerData.generalInfo.avios
            : 0;
        return angular.isNumber(customerData.avios)
            ? customerData.avios
            : aviosGeneralInfo;
    }

    /**
     * Updates digital data avios
     * @param {Object} avios the user logged generalInfo information for get avios user.
     */
    updateLoggedDigitalDataAvios = (avios: string): void => {
        const extendDigitalData: object = {};
        if (avios) {
            extendDigitalData[DatalayerGeneralConstants.AVIOS_COINS] = avios;
            this.addDigitalDataInfo(extendDigitalData);
        }
    };

    /**
     * removes a set of attributes from datalayer.
     * @param {Array<String>} datalayerAttributtes an array with the String name of the attributes to be removed from datalager
     */
    public removeDigitalDataObjects = (datalayerAttributtes: object): void => {
        this.DigitalDataService.removeDigitalDataInfo(datalayerAttributtes);
    };

    /**
     * Extends datalayer object with the quadrigam info and the extended info given
     * @param {String} quadrigam the String with the quadrigam to be set
     * @param {Object} extendedObject the extended object to be added to datalayer
     */
    public updateDigitalDataWithQuadrigam = (quadrigam, extendedObject, isUserLogged) => {
        const extendDatalayer = {};
        const nonNullAndObject = extendedObject != null && typeof extendedObject === 'object';

        if (nonNullAndObject && extendedObject.eventCategory != 'ancillaries') {
            Object.assign(extendDatalayer, extendedObject);
        }

        if (typeof quadrigam === 'string') {
            extendDatalayer[DatalayerGeneralConstants.QUADRIGAM] = quadrigam.replace(/\//g, '');
            extendDatalayer[DatalayerGeneralConstants.CODE] = this.LANG + '/' + this.MARKET + '/' + quadrigam.replace(/\//g, ''); 
        }
        extendDatalayer[DatalayerGeneralConstants.USER_STATE] = this.getUserState(isUserLogged);
        this.addDigitalDataInfo(extendDatalayer);
    };

    /**
     * sends datalayer event with the current datalayer info and the datalayer error info
     * @param {Object} errorObject the object with the 'message', 'errorCode' y 'internalErrorCode' attributes
     */
    public sendDigitalDataErrorEvent = (errorObject : CommonsDatalayerServiceTypes.ErrorObjectDatalayer) :void => {
        const extendedDatalayerInfo = {};
        if (angular.isObject(errorObject) && errorObject.errorCode) {
            if (errorObject.quadrigam) {
                this.updateDigitalDataWithQuadrigam(errorObject.quadrigam, null, errorObject.isLogged);
            }
            if (errorObject.eventCategory) {
                extendedDatalayerInfo[DatalayerGeneralConstants.EVENT_CATEGORY] = errorObject.eventCategory;
            }
            if (errorObject.eventCategory) {
                extendedDatalayerInfo[DatalayerGeneralConstants.EVENT_ACTION] = errorObject.eventAction;
            }
            if (errorObject.eventLabel) {
                extendedDatalayerInfo[DatalayerGeneralConstants.EVENT_LABEL] = errorObject.eventLabel;
            }

            this.addDigitalDataInfo(extendedDatalayerInfo);
            this.sendDatalayerEvent(DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        }
    };

    /**
     * removes the datalayer error attributes from datalayer object
     */
    public removeDatalayerErrorAttrs = (): void => {
        this.removeDigitalDataObjects(this.DATALAYER_ERROR_ATTR);
    };

    /**
     * sends datalayer event with the current datalayer info and the datalayer modal info
     * @param {Object} modalObject the modal object with its attributes ('idModal')
     */
    public sendDatalayerModalEvent = (modalObject : CommonsDatalayerServiceTypes.ModalObjectDatalayer):void => {
        const extendedDigitalDataInfo = {};
        if (angular.isObject(modalObject)) {
            this.addDigitalDataInfo(extendedDigitalDataInfo);
            this.sendDatalayerEvent(DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        }
    };

    /**
     * removes the datalayer modal attributes from datalayer object
     */
    public removeDatalayerModalAttrs = (): void => {
        this.removeDigitalDataObjects(this.DATALAYER_MODAL_ATTR);
    };

    /**
     * Extends the current datalayer ecommerce information with the received info
     * @param {Object} datalayerInfo the information to extend current datalayer ecommerce info
     */
    public addDataLayerEcommerceInfo = (datalayerInfo: object): void => {
        this.DataLayerService.addDataLayerEcommerceInfo(datalayerInfo);
    };

    
    private addDigitalDataSeatsInfoByType (extendedDatalayerInfo, seatsByTypes, headerSeatName, seatsTotalDigitalDataName, seatsTotalPriceDigitalDataName) {
        const totalPrice = seatsByTypes.filter(seat => seat.type === headerSeatName).reduce((total, seat) => {
            return total + seat.amount;
        }, 0);
        const quanty = seatsByTypes.filter(seat => seat.type === headerSeatName).reduce((total, seat) => {
            return total + seat.quanty;
        }, 0);

        extendedDatalayerInfo[seatsTotalDigitalDataName]= quanty;
        extendedDatalayerInfo[seatsTotalPriceDigitalDataName]= totalPrice;

    }
    
    private mapSeatsForDigitalData (headerModel, extendedDatalayerInfo) {
        const segments = headerModel.headerModel.shoppingBasket.seats.segments;
        const SI = DatalayerConstants.DATALAYER_INFO.SEATSINFO;

        const seatsByTypes = segments.flatMap(segment => segment.seats);

        extendedDatalayerInfo[SI.SEATSTOTAL]      = seatsByTypes.reduce((sum, s) => sum + s.quanty, 0);
        extendedDatalayerInfo[SI.SEATSTOTALPRICE] = seatsByTypes.reduce((sum, s) => sum + s.amount, 0);

        for (const { format, totalKey, priceKey, matchEmpty } of DatalayerConstants.SEAT_TYPE_MAP) {
            const hasType = seatsByTypes.some(seat =>
                matchEmpty ? seat.type === '' : seat.type === format
            );
            if (hasType) {
                this.addDigitalDataSeatsInfoByType(extendedDatalayerInfo, seatsByTypes, format, totalKey, priceKey);
            }
        }
    }
    private addDigitalDataBaggagesSpeqsInfoByType (extendedDatalayerInfo, ancillariesByTypes, headerAncillaryName, ancillaryTotalDigitalDataName, ancillaryTotalPriceDigitalDataName) {
        const totalPrice = ancillariesByTypes.filter(ancillary => ancillary.type === headerAncillaryName).reduce((total, ancillarie) => {
            return total + ancillarie.total;
        }, 0);
        const quanty = ancillariesByTypes.filter(ancillary => ancillary.type === headerAncillaryName).reduce((total, ancillarie) => {
            return total + ancillarie.quanty;
        }, 0);

        extendedDatalayerInfo[ancillaryTotalDigitalDataName]= quanty;
        extendedDatalayerInfo[ancillaryTotalPriceDigitalDataName]= totalPrice;
    }
    
    private mapBaggagesForDigitalData (headerModel, extendedDatalayerInfo) {
        let baggagesByTypes = [];
        headerModel.headerModel.shoppingBasket.baggages.segments.map( segment => {
            segment.baggages.forEach(
                baggage =>
                    baggagesByTypes.push(baggage));
        });
        const baggagesTotalPrice = headerModel.headerModel.shoppingBasket.baggages.total.total;
        const baggagesTotalQuanty = baggagesByTypes.reduce((suma, objeto) => {return suma + objeto.quanty;}, 0);

        extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESTOTAL]= baggagesTotalQuanty;
        extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESTOTALPRICE]= baggagesTotalPrice;

        if(headerModel.headerModel.shoppingBasket.baggages?.segments.some((segment) => segment.baggages.some((baggage) => baggage.type === DatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_15))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, baggagesByTypes, DatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_15, DatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE15.BAGGAGES15TOTAL, DatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE15.BAGGAGES15PRICE);
        }if(headerModel.headerModel.shoppingBasket.baggages.segments.some((segment) => segment.baggages.some((baggage) => baggage.type === DatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_23))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, baggagesByTypes, DatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_23, DatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE23.BAGGAGES23TOTAL, DatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE23.BAGGAGES23PRICE);
        }if(headerModel.headerModel.shoppingBasket.baggages.segments.some((segment) => segment.baggages.some((baggage) => baggage.type === DatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_32))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, baggagesByTypes, DatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGES_HEADER_FORMAT.BAGGAGE_32, DatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE32.BAGGAGES32TOTAL, DatalayerConstants.DATALAYER_INFO.BAGGAGESINFO.BAGGAGESBYTYPE.BAGGAGE32.BAGGAGES32PRICE);
        }
    }

    private mapSpeqsForDigitalData (headerModel, extendedDatalayerInfo) {
        let speqsByTypes = [];
        headerModel.headerModel.shoppingBasket.speqs.segments.map( segment => {
            segment.speqs.forEach(
                speqs =>
                    speqsByTypes.push(speqs));
        });
        const speqsTotalPrice = headerModel.headerModel.shoppingBasket.speqs.total.total;
        const speqsTotalQuanty = speqsByTypes.reduce((suma, objeto) => {return suma + objeto.quanty;}, 0);
        extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSTOTAL]= speqsTotalQuanty;
        extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSTOTALPRICE]= speqsTotalPrice;

        if(headerModel.headerModel.shoppingBasket.speqs?.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.BICYCLE))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.BICYCLE, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.BICYCLE.SPEQSBICYCLETOTAL, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.BICYCLE.SPEQSBICYCLEPRICE);
        }if(headerModel.headerModel.shoppingBasket.speqs.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SURFBOARD))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SURFBOARD, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SURFBOARD.SPEQSSURFBOARDTOTAL, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SURFBOARD.SPEQSSURFBOARDPRICE);
        }if(headerModel.headerModel.shoppingBasket.speqs.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.GOLFEQUIPMENT))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.GOLFEQUIPMENT, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.GOLF_EQUIPMENT.SPEQSGOLFEQUIPMENTTOTAL, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.GOLF_EQUIPMENT.SPEQSGOLFEQUIPMENTPRICE);
        }if(headerModel.headerModel.shoppingBasket.speqs.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SKISNOW))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SKISNOW, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SKI_SNOW.SPEQSSKISNOWTOTAL, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SKI_SNOW.SPEQSSKISNOWPRICE);
        }if(headerModel.headerModel.shoppingBasket.speqs.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.FISHINGEQUIPMENT))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.FISHINGEQUIPMENT, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.FISHING_EQUIPMENT.SPEQSFISHINGEQUIPMENTTOTAL, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.FISHING_EQUIPMENT.SPEQSFISHINGEQUIPMENTPRICE);
        }if(headerModel.headerModel.shoppingBasket.speqs.segments.some((segment) => segment.speqs.some((speqs) => speqs.type === DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SCUBADIVING))) {
            this.addDigitalDataBaggagesSpeqsInfoByType(extendedDatalayerInfo, speqsByTypes, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQS_HEADER_FORMAT.SCUBADIVING, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SCUBA_DIVING.SPEQSSCUBADIVINGTOTAL, DatalayerConstants.DATALAYER_INFO.SPEQSINFO.SPEQSBYTYPE.SCUBA_DIVING.SPEQSSCUBADIVINGPRICE);
        }
    }
    
    private addDigitalDataFlexibilization (headerModel, extendedDatalayerInfo) {
        const flexibilityTotalPrice = headerModel.headerModel.shoppingBasket?.flexibilization?.info?.amount?.price;
        const flexibilityType = this.getFlexType();

        extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.FLEXIBILITY_INFO.FLEXIBILITY_TOTAL_PRICE]= flexibilityTotalPrice;
        extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.FLEXIBILITY_INFO.FLEXIBILTY_TYPE]= flexibilityType;
    }
    
    private getFlexType () {
        const flexibilization: any = this.localStorageService.get('selectedFlex');
        let flexType;
        switch(flexibilization.subtype) {
                case DatalayerConstants.FLEXIBILITY_TYPE_CODES.REFUND:
                    flexType = DatalayerConstants.FLEXIBILITY_TYPES.REFUND;
                    break;
                case DatalayerConstants.FLEXIBILITY_TYPE_CODES.FLIGHT:
                    flexType = DatalayerConstants.FLEXIBILITY_TYPES.FLIGHT;
                    break;
                case DatalayerConstants.FLEXIBILITY_TYPE_CODES.PACK:
                    flexType = DatalayerConstants.FLEXIBILITY_TYPES.PACK;
                    break;
                default:
                    flexType = null;
        }
        return flexType;
    }
    
    private cleanDigitalDataParametersFromIncludesString (stringIncludesToDeleteInDigitalData) {
        const confirmationDigitalInfo = this.CommonsSessionStorageService.get('confirmationDigitalInfo');
        if(confirmationDigitalInfo) {
            const digitalInfoAsArray = Object.entries(confirmationDigitalInfo);
            const digitalDataFiltered = digitalInfoAsArray.filter(([key, value]) => (key.includes(stringIncludesToDeleteInDigitalData)));
            const digitalDataKeys = digitalDataFiltered.map( (element => element[0]));
            const dataDeleteDigitalData = digitalDataKeys.filter(elementToFilter => elementToFilter.includes(stringIncludesToDeleteInDigitalData));

            this.DigitalDataService.removeDigitalDataInfo(dataDeleteDigitalData);
        }
    }
    
    private getProviderAndPolicyInsurance () {
        const insuranceInfo = this.getAncillariesInfoByType(BookingAppConstants.ANCILLARIES_TYPES.INSURANCE);
        const insuranceSelected: insuranceSelected = this.localStorageService.get('insuranceSelected');
        return {
            provider: insuranceInfo[0]?.provider,
            policy: insuranceSelected?.id
        };
    }
    
    private getAncillariesInfoByType (ancillaryType) {
        const {ancillaries}: any = this.localStorageService.get('ancillariesInfo');

        return ancillaries.filter((ancillary) => ancillary.type === ancillaryType);
    }
    
    private updateDigitalDataForAncillaries = (updatePrices: boolean, ancillariesAction: string, headerModel: CommonsDatalayerServiceTypes.HeaderModel, insuranceType): void => {
        const extendedDatalayerInfo = {};
        const insurancePrice = headerModel.headerModel.shoppingBasket.insurance?.total?.total;
        const hasSeats = headerModel.headerModel.shoppingBasket.seats.hasSeats;
        const hasBaggage = headerModel.headerModel.shoppingBasket.baggages.hasBaggage;
        const hasSpeqs = headerModel.headerModel.shoppingBasket.speqs.hasSpeqs;
        const hasFlexibilization = headerModel.headerModel.shoppingBasket.flexibilization.hasFlexibilization;
        const hasAllianzFusionInsurance = headerModel.headerModel.shoppingBasket?.insuranceAllianzFusionInfo?.hasInsuranceAllianzFusion;
        const hasGlobickActivities =  headerModel.headerModel.shoppingBasket?.globickActivities?.hasActivitiesGlobick;
        const hasGlobickTransfer =  headerModel.headerModel.shoppingBasket?.globickTransfers?.hasTransfersGlobick;

        this.cleanDigitalDataParametersFromIncludesString('Seats');
        this.cleanDigitalDataParametersFromIncludesString('Baggages');
        this.cleanDigitalDataParametersFromIncludesString('Speqs');
        this.cleanDigitalDataParametersFromIncludesString('flexibility');
        this.cleanDigitalDataParametersFromIncludesString('Globick');
        this.cleanDigitalDataParametersFromIncludesString('Insurance');

        if (updatePrices && insuranceType) {
            const providerAndPolicyInsurance = this.getProviderAndPolicyInsurance();
            extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.INSURANCE_TYPE] = insuranceType;
            extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.INSURANCE_TOTAL_PRICE] = insurancePrice;
            if(providerAndPolicyInsurance.provider) extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.INSURANCE_PROVIDER] = providerAndPolicyInsurance.provider;
            if(providerAndPolicyInsurance.policy) extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.INSURANCE_POLICY] = providerAndPolicyInsurance.policy;
        }
        if(hasSeats)this.mapSeatsForDigitalData(headerModel, extendedDatalayerInfo);
        if(hasBaggage) this.mapBaggagesForDigitalData(headerModel, extendedDatalayerInfo);
        if(hasSpeqs) this.mapSpeqsForDigitalData(headerModel, extendedDatalayerInfo);
        if(hasFlexibilization) this.addDigitalDataFlexibilization(headerModel, extendedDatalayerInfo);
        if (hasAllianzFusionInsurance) this.addDigitalDataAllianzFusion(extendedDatalayerInfo, headerModel);
        if(hasGlobickActivities)this.addDigitalDataGlobickActivities(headerModel, extendedDatalayerInfo);
        if (hasGlobickTransfer) this.addDigitalDataGlobickTransfer(headerModel, extendedDatalayerInfo);


        this.addDigitalDataInfo(extendedDatalayerInfo);
    };

    /**
     * Generates datalayer for availability
     * @param {Obj} availabilityData the availability data
     * @returns {Obj} returns object with availability datalayer info
     */
    /* INIT DELETE GA4 MIGRATION*/
    public generateDatalayerAvailability = ( availabilityData ): object => {
        void availabilityData;
        return {};
    };
    /* FINISH DELETE GA4 MIGRATION*/

    /**
     * Generates datalayer for passengers view
     * @param {Obj} slices the passengers data
     * @returns {Obj} returns object with passengers datalayer info
     */
    /* INIT DELETE GA4 MIGRATION*/
    public generateDatalayerPassengers = ( slices, priceInfo, currency, haul ): object => {
        void slices;
        void priceInfo;
        void currency;
        void haul;
        return {};
    };
    /* FINISH DELETE GA4 MIGRATION*/

    /**
     * Generates datalayer for payments view
     * @param {Obj} paymentData the passengers data
     * @param {Obj} orderData the order data
     * @returns {Obj} returns object with payments datalayer info
     */
    /* INIT DELETE GA4 MIGRATION*/
    public generateDatalayerPayments = ( paymentData, orderData ): object => {
        void paymentData;
        void orderData;
        return {};
    };
    /* FINISH DELETE GA4 MIGRATION*/
    
    public generateDigitalDataPayments = (paymentData, orderData): object => {
        const datalayerObject: object = this.localStorageService.get('confirmationDigitalInfo') || {};
        const paymentsInfo: any = this.localStorageService.get('paymentsInfo');
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
        datalayerObject[DatalayerGeneralConstants.STEP] = this.getStepFromQuadrigam(datalayerObject[DatalayerGeneralConstants.QUADRIGAM], DatalayerConstants.DATALAYER_VIEWS.PAYMENTS);
        datalayerObject[DatalayerBKIConstants.CASH_AVIOS_OFFER] = paymentsInfo?.availableDiscounts?.AVIOS?.available || paymentsInfo?.appliedDiscounts?.types?.AVIOS ?
            DatalayerConstants.DATALAYER_VALUES.YES : DatalayerConstants.DATALAYER_VALUES.NO;
        datalayerObject[DatalayerGeneralConstants.VOUCHER_SHOWN] = (paymentsInfo?.availableDiscounts?.VOUCHER?.available || paymentData?.paymentMethods[0].type === 'VOUCHER' || paymentsInfo?.appliedDiscounts?.types?.VOUCHER) ? DatalayerConstants.DATALAYER_VALUES.YES : DatalayerConstants.DATALAYER_VALUES.NO;
        datalayerObject[DatalayerBKIConstants.TOTAL_PRICE] = tPrice;
        datalayerObject[DatalayerBKIConstants.TOTAL_PRICE_WITHOUT_TAXES] = noFee;
        datalayerObject[DatalayerGeneralConstants.QUANTITY] = orderData && orderData.order && orderData.order.orderItems ? orderData.order.orderItems.length.toString() : '0';
        if (orderData && orderData.order && orderData.order.orderItems) {
            while (!foundedSpecialNeeds && specialNeedsIndex < orderData.order.orderItems.length) {
                if (orderData.order.orderItems[specialNeedsIndex].type === this.CommonsConstants.passengerTypes.SPECIAL_NEEDS) {
                    foundedSpecialNeeds = true;
                }
                specialNeedsIndex++;
            }
        }
        datalayerObject[DatalayerBKIConstants.PMR] =
            foundedSpecialNeeds ? DatalayerConstants.DATALAYER_VALUES.YES : DatalayerConstants.DATALAYER_VALUES.NO;
        this.addDigitalDataInfo(datalayerObject);
        return datalayerObject;
    };

    /**
     * Generates the confirmation info of datalayer and stores it in session storage
     * @param ancillariesAction
     */
    public generateConfirmationDigitalDataObject = (): void => {
        const confirmationDatalayerInfo: object = this.localStorageService.get('confirmationDigitalInfo') || {};
        const paymentsInfo: any = this.localStorageService.get('paymentsInfo');
        const pmtModel: any = this.localStorageService.get('pmtModelInfo');
        confirmationDatalayerInfo[DatalayerGeneralConstants.STEP] = this.getStepFromQuadrigam(confirmationDatalayerInfo[DatalayerGeneralConstants.QUADRIGAM], DatalayerConstants.DATALAYER_VIEWS.CONFIRMATION);
        this.DigitalDataService.removeDigitalDataInfo([DatalayerBKIConstants.CASH_AVIOS_OFFER, DatalayerGeneralConstants.VOUCHER_SHOWN]);
        delete confirmationDatalayerInfo[DatalayerBKIConstants.CASH_AVIOS_OFFER];
        delete confirmationDatalayerInfo[DatalayerGeneralConstants.VOUCHER_SHOWN];
        confirmationDatalayerInfo[DatalayerGeneralConstants.CASH_AVIOS_USED] = this.getCodeFromCashAviosUsed(paymentsInfo);
        confirmationDatalayerInfo[DatalayerGeneralConstants.VOUCHER_USED] = paymentsInfo?.appliedDiscounts?.types?.VOUCHER ? 'si' : 'no';
        confirmationDatalayerInfo[DatalayerBKIConstants.VOUCHER_RECORD] = confirmationDatalayerInfo[DatalayerGeneralConstants.VOUCHER_USED] === 'si' ? this.CommonsSessionStorageService.get('PNR') : '';
        this.updateDigitalDataWithQuadrigam(pmtModel.quadrigams.confirmation, confirmationDatalayerInfo, this.localStorageService.get('userLogged'));
    };

    /**
     * Generates numberPassengers for DatalayerInfo if the user add new passengers to search flights
     * @param passengers
     */
    public getPassengersMetasearch = (passengers: CommonsDatalayerServiceTypes.PassengerDatalayer[]) :CommonsDatalayerServiceTypes.PassengerInfoDatalayer => {
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
     * reset Datalayer
     */
    public resetDatalayer = (): void => {
        const elementsDataLayer = [];
        const dataLayerModelVC: object = this.localStorageService.get('cvDatalayer');
        const userState: string = DatalayerConstants.DATALAYER_INFO.USER_STATE;
        const totalPriceWOutTax = DatalayerConstants.DATALAYER_VOLUNTARYCHANGES.TOTAL_PRICE_WITHOUT_TAX;
        const totalPrice = DatalayerConstants.DATALAYER_VOLUNTARYCHANGES.TOTAL_PRICE;
        Object.keys(dataLayerModelVC).forEach((element) => {
            if (element.toString() !== userState && element.toString() !== totalPriceWOutTax &&
                element.toString() !== totalPrice) {
                elementsDataLayer.push(element.toString());
            }
        });
        this.removeDigitalDataObjects(elementsDataLayer);
    };

    /**
     * Updates datalayer info with the nedded ancillaries information
     * @param {Integer} baggagesPrice the total baggage price
     * @param {Integer} seatsPrice the total seat price
     * @param {Integer} insurancesPrice the total insurancesPrice
     */
    public updateDatalayerEvent = (eventCategory, eventAction, eventLabel, eventName): void => {
        const extendedDigitalDataInfo = {};
        extendedDigitalDataInfo[DatalayerGeneralConstants.EVENT_CATEGORY] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventCategory));
        extendedDigitalDataInfo[DatalayerGeneralConstants.EVENT_ACTION] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventAction));
        extendedDigitalDataInfo[DatalayerGeneralConstants.EVENT_LABEL] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventLabel));
        extendedDigitalDataInfo[DatalayerGeneralConstants.EVENT_NAME] = this.$filter('EliminateHyphenFilter')(
            this.$filter('EliminateAccentFilter')(eventName));
        this.DigitalDataService.emitEvent('interaction', extendedDigitalDataInfo);
    };

    public updateDatalayerViewEvent = (): void => {
        this.DigitalDataService.emitViewEvent();
    };

    public updateDatalayerInteractionEvent = (): void => {
        this.DigitalDataService.emitInteractionEvent();
    };

    public updatePnr = (pnr:CommonsDatalayerServiceTypes.PnrDataLayer):void =>{
        const extendedDigitalDataInfo = {};
        if (angular.isObject(pnr)) {
            extendedDigitalDataInfo[DatalayerBKIConstants.PROVIDER] = pnr.provider;
            extendedDigitalDataInfo[DatalayerGeneralConstants.REFERENCE] = pnr.reference;
            this.addDigitalDataInfo(extendedDigitalDataInfo);
        }
    };

    public setAncillariesDatalayer = ():void =>{
        const headerModel:CommonsDatalayerServiceTypes.HeaderModel = this.localStorageService.get('headerModel');
        let insuranceType = '',
            totalQuantitySeats = 0,
            totalQuantityBaggage = 0,
            totalQuantitySpeqs = 0;
        this.quantyTotalAncillaries(totalQuantityBaggage, totalQuantitySeats, totalQuantitySpeqs, insuranceType);

        this.updateDigitalDataForAncillaries(
            true,
            DatalayerConstants.DATALAYER_EVENT_TYPES.CLICK,
            headerModel,
            insuranceType
        );
    };
    
    private quantyTotalAncillaries = (totalQuantityBaggage, totalQuantitySeats, totalQuantitySpeqs, insuranceType) => {
        const headerModel:CommonsDatalayerServiceTypes.HeaderModel = this.localStorageService.get('headerModel');
        if (headerModel.headerModel.shoppingBasket.baggages.hasBaggage) {
            totalQuantityBaggage = this.getAncillarieQuantity(headerModel.headerModel.shoppingBasket.baggages.segments, 'baggages');
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
            totalQuantitySpeqs = this.getAncillarieQuantity(headerModel.headerModel.shoppingBasket.speqs.segments, 'speqs');
        }
    };

    private getAncillarieQuantity = (segments, segmentType:string):number => {
        let quantity = 0;
        segments.forEach(segment => {
            segment[segmentType].forEach(type => {
                quantity += type.quanty;
            });
        });
        return quantity;
    };

    /**
     * Updates datalayer info with the nedded upgrade information
     * @param {Boolean} isOfferSelected true if the user has selected an offer
     * @param {Boolean} isUpgradeFree true if the upgrade shown is free
     * @param {Array<Object>} selectedOffer the selected offer data
     * @param {Boolean} upgradingAccepted true if the users accepted the upgrade
     * @param {String} currencySymbol the currency symbol (Ej: '€' )
     */
    public updateDatalayerForUpgrade = (isOfferSelected, isUpgradeFree, selectedOffer, upgradingAccepted, currencySymbol): void => {
        let i:number, upgradeAmount = 0;
        let dataLayerBookingType = '';
        const extendedDatalayerInfo = {};
        extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.UPGRADE_SHOWN] = isUpgradeFree ?
            DatalayerConstants.DATALAYER_VALUES.FREE : DatalayerConstants.DATALAYER_VALUES.PAYMENT;
        extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.UPGRADE_SENT] = upgradingAccepted && isOfferSelected
            ? DatalayerConstants.DATALAYER_VALUES.YES : DatalayerConstants.DATALAYER_VALUES.NO;
        if (isOfferSelected) {
            for (i = 0; i < selectedOffer.length; i++) {
                if (selectedOffer[i] && selectedOffer[i].offerSegmentClasses[0] && selectedOffer[i].offerSegmentClasses[0].cabinClass
                && selectedOffer[i].offerSegmentClasses[0].cabinClass.type) {
                    const actualSegmentBookingType = selectedOffer[i].offerSegmentClasses[0].cabinClass.type.charAt(0);
                    dataLayerBookingType = dataLayerBookingType === '' || DatalayerConstants.SEGMENT_CABIN_PRIORITY[dataLayerBookingType] > DatalayerConstants.SEGMENT_CABIN_PRIORITY[actualSegmentBookingType]
                        ? actualSegmentBookingType : dataLayerBookingType;
                }
                upgradeAmount += selectedOffer[i].totalAmount;
            }
            extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.BOOKING_CLASS] = dataLayerBookingType;
        }
        extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.UPGRADE_TOTAL] = upgradeAmount + currencySymbol;
        this.addDataLayerInfo(extendedDatalayerInfo);
    };

    /**
     * Add hashEID to datalayer info
     */
    public addDigitalDataInfoHashEID = (customerData): void => {
        if(angular.isDefined(customerData) && angular.isObject(customerData) && angular.isObject(customerData.personalInfo) && angular.isString(customerData.personalInfo.contactEmail)) {
            this.CommonsUtilService.sha256(customerData.personalInfo.contactEmail).then((hash) => {
                this.addDigitalDataInfo({HashEID: hash});
            });
        }
    };

    private addDigitalDataMemberInfo = () => {
        const retrieveMemberInfo = this.localStorageService.get<CustomerDataCommons>('customerData');
        const partners = retrieveMemberInfo?.partners ?? [];
        const memberStr = partners.reduce((acc, partnerInfo, i) => (acc + (i!==0 ? ',': '' ) +partnerInfo.partnerProduct.productName), '');
        if (memberStr.length > 0) {
            this.addDigitalDataInfo({[DatalayerGeneralConstants.MEMBER]: memberStr});

        }
    };

    private addDigitalDataAllianzFusion (extendedDatalayerInfo: any, headerModelStorage: any) {
        const policyAllianz: any = this.localStorageService.get('policyAllianz');
        extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.INSURANCE_TYPE] = headerModelStorage.headerModel.shoppingBasket.insuranceAllianzFusionInfo?.info?.description;
        extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.INSURANCE_TOTAL_PRICE] = headerModelStorage.headerModel.shoppingBasket.insuranceAllianzFusionInfo?.total?.total;
        extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.INSURANCE_POLICY] = policyAllianz;
    }

    private addDigitalDataGlobickActivities (headerModelStorage: any, extendedDatalayerInfo: any) {
        extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.GLOBICK_ACTIVITIES] = headerModelStorage.headerModel.shoppingBasket.globickActivities?.info?.description?.length;
        extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.GLOBICK_ACTIVITIES_TOTAL_PRICE] = headerModelStorage.headerModel.shoppingBasket.globickActivities?.total?.total;
    }

    private addDigitalDataGlobickTransfer (headerModelStorage: any, extendedDatalayerInfo: any) {
        extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.GLOBICK_TRANSFER] = headerModelStorage.headerModel.shoppingBasket.globickTransfers?.info?.transferCar;
        extendedDatalayerInfo[DatalayerConstants.DATALAYER_INFO.GLOBICK_TRANSFER_TOTAL_PRICE] = headerModelStorage.headerModel.shoppingBasket.globickTransfers?.total?.total;
    }


    public getTripType (availabilityData) {
        const availabilityType: any = this.CommonsSessionStorageService.get('availabilityType');
        const bookingUrlParams:any = this.CommonsSessionStorageService.get('bookingUrlParams');
        if (availabilityType === 'SLICE_BY_SLICE') {
            return bookingUrlParams.tripType === '2' ? DatalayerConstants.DATALAYER_VALUES.RETURN_TRIP : DatalayerConstants.DATALAYER_VALUES.ONE_WAY_TRIP;
        }
        return availabilityData.originDestinations.length === 2 ? DatalayerConstants.DATALAYER_VALUES.RETURN_TRIP : DatalayerConstants.DATALAYER_VALUES.ONE_WAY_TRIP;
    }
    
    public updateDatalayerWithEvents = (eventCategory, eventAction, eventLabel): void => {
        const extendedDigitalDataInfo = {};
        extendedDigitalDataInfo[DatalayerGeneralConstants.EVENT_CATEGORY] = eventCategory;
        extendedDigitalDataInfo[DatalayerGeneralConstants.EVENT_ACTION] = eventAction;
        extendedDigitalDataInfo[DatalayerGeneralConstants.EVENT_LABEL] = eventLabel;

        this.addDigitalDataInfo(extendedDigitalDataInfo);
    };

    /* INIT DELETE GA4 MIGRATION*/
    public addDestinationInfoDatalayer = ( destinationInfo: CommonsDatalayerServiceTypes.OriginDestinationDatalayer, slices ) => {
        void destinationInfo;
        void slices;
    };
    /* FINISH DELETE GA4 MIGRATION*/

    public addDestinationInfoDigitalData = (destinationInfo:CommonsDatalayerServiceTypes.OriginDestinationDatalayer, slices) => {
        const extendedDigitalDataInfo = {};
        const generalInfo : CommonsDatalayerServiceTypes.GeneralInfoDatalayer= this.localStorageService.get('bookingUrlParams');
        const bookingInfo:CommonsDatalayerServiceTypes.OriginDestinationDatalayer = this.localStorageService.get('originDestination');
        const largeFamilyValue = this.changeLargeFamilyValue(generalInfo.largeFamilyType);
        extendedDigitalDataInfo[DatalayerBKIConstants.OFFERDEST] = destinationInfo.destinationCity.code;
        extendedDigitalDataInfo[DatalayerBKIConstants.OFFERDESTNAME] = destinationInfo.destinationCity.description;
        extendedDigitalDataInfo[DatalayerBKIConstants.PROCESS] = DatalayerConstants.DATALAYER_FLASH_OFFERS.PROCESS;
        extendedDigitalDataInfo[DatalayerBKIConstants.PROCESS_START] = DatalayerConstants.LANG + '/' + DatalayerConstants.MARKET + '/' + DatalayerConstants.QUADRIGAMS.LANDING_FLASH;
        extendedDigitalDataInfo[DatalayerBKIConstants.FLIGHT_TYPE] = this.getTripType(slices.availabilityData);
        extendedDigitalDataInfo[DatalayerBKIConstants.SEARCH_CITY] = destinationInfo.destinationCity.code;
        extendedDigitalDataInfo[DatalayerBKIConstants.SEARCH_DEST] = destinationInfo.destinationCity.code;
        extendedDigitalDataInfo[DatalayerBKIConstants.SEARCH_DEST_NAME] = destinationInfo.destinationCity.description;
        extendedDigitalDataInfo[DatalayerBKIConstants.SEARCH_COUNTRY] = DatalayerConstants.MARKET;
        extendedDigitalDataInfo[DatalayerBKIConstants.SEARCH_ORIGIN] = destinationInfo.originCity.code;
        extendedDigitalDataInfo[DatalayerBKIConstants.SEARCH_ORIGIN_NAME] = destinationInfo.originCity.description;
        extendedDigitalDataInfo[DatalayerBKIConstants.ADVANCE_PURCHASE] =
        Math.round((new Date(bookingInfo.dates.formatedOutboundFlight).getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24)).toString();

        extendedDigitalDataInfo[DatalayerBKIConstants.LENGTH_STAY] =
        bookingInfo.dates.formatedReturnFlight && bookingInfo.dates.formatedOutboundFlight ?
            Math.round(((new Date(bookingInfo.dates.formatedReturnFlight).getTime() - new Date(bookingInfo.dates.formatedOutboundFlight).getTime()) / (1000 * 60 * 60 * 24))).toString() :
            '0';
        extendedDigitalDataInfo[DatalayerBKIConstants.PAX_ADULT] = bookingInfo.numAdults.toString();
        extendedDigitalDataInfo[DatalayerBKIConstants.PAX_TOTAL] = bookingInfo.numberPassengrsWithoutInfant.toString();
        extendedDigitalDataInfo[DatalayerBKIConstants.PAX_PRICE] = this.calculatePassengersPrice();
        largeFamilyValue && (extendedDigitalDataInfo[DatalayerBKIConstants.LARGE_FAMILY] =  largeFamilyValue);
        generalInfo.resident && (extendedDigitalDataInfo[DatalayerBKIConstants.RESIDENT_CODE] = generalInfo.resident);
        extendedDigitalDataInfo[DatalayerBKIConstants.CHEAPEST_FARE] = DatalayerConstants.DATALAYER_VALUES.NO;
        extendedDigitalDataInfo[DatalayerBKIConstants.SEARCH_OD] = '';
        extendedDigitalDataInfo[DatalayerBKIConstants.SEARCH_COUNTRIES] = '';
        for (let oIndex = 0; oIndex < slices.availabilityData.originDestinations.length; oIndex++) {
            extendedDigitalDataInfo[DatalayerBKIConstants.SEARCH_OD] +=
                (extendedDigitalDataInfo[DatalayerBKIConstants.SEARCH_OD].length > 0 ? ',' : '') +
                slices.availabilityData.originDestinations[oIndex].origin.code;
            extendedDigitalDataInfo[DatalayerBKIConstants.SEARCH_OD] +=
                slices.availabilityData.originDestinations.length > 1 ? '' : ((extendedDigitalDataInfo[DatalayerBKIConstants.SEARCH_OD].length > 0 ? ',' : '') + slices.availabilityData.originDestinations[oIndex].destination.code);
            extendedDigitalDataInfo[DatalayerBKIConstants.SEARCH_COUNTRIES] +=
                (extendedDigitalDataInfo[DatalayerBKIConstants.SEARCH_COUNTRIES].length > 0 ? '-' : '') +
                slices.availabilityData.originDestinations[oIndex].originCity.country.code;
            extendedDigitalDataInfo[DatalayerBKIConstants.SEARCH_COUNTRIES] +=
                slices.availabilityData.originDestinations.length > 1 ? '' : ((extendedDigitalDataInfo[DatalayerBKIConstants.SEARCH_COUNTRIES].length > 0 ? '-' : '') + slices.availabilityData.originDestinations[oIndex].destinationCity.country.code);
        }
        this.addDigitalDataInfo(extendedDigitalDataInfo);

        this.updateDatalayerEvent(
            DatalayerConstants.DATALAYER_INFO.FLASHOFFER,
            DatalayerConstants.DATALAYER_INFO.RESERVE_OFER,
            destinationInfo.destinationCity.code.toLowerCase(),
            DatalayerGeneralConstants.EVENT_NAME_INTERACTION);
    };

    private calculatePassengersPrice = ():string => {
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
    
    public updateDatalayerEvents = (eventCategory:string, eventAction:string, eventLabel:string, eventName: string = ''): void => {
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

    private checkModelCountryCode = (model: any): string => {
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
    
    public addShuttleDigitalData = (flowApp: string, model) => {
        const extendedDatalayerInfo = {};
        const generalInfo: CommonsDatalayerServiceTypes.GeneralInfoDatalayer= this.localStorageService.get('bookingUrlParams');
        const bookingInfo: CommonsDatalayerServiceTypes.OriginDestinationDatalayer = this.localStorageService.get('originDestination');
        const cardTypeSelected: CommonsDatalayerServiceTypes.TypeCardDatalayer = this.localStorageService.get('typeCardIberiaPay');
        const cardSelectedLogged: CommonsDatalayerServiceTypes.TypeCardDatalayer = this.localStorageService.get('selectedLoggedCard');
        const redemptionFlow: boolean = this.localStorageService.get('isRedemptionFlow');
        const largeFamilyValue:string  = this.changeLargeFamilyValue(generalInfo.largeFamilyType);
        let departureCountryCode: string = '';
        let arrivalCountryCode: string = '';

        switch(flowApp) {
                case DatalayerConstants.FLOWS.SHUTTLE: {
                    if(bookingInfo.tripType === '2') {
                        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_CITY] = model.fareShuttleModel.slices[1].originCityCode;
                        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_DEST] = model.fareShuttleModel.slices[1].originCityCode;
                        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_DEST_NAME] = model.fareShuttleModel.slices[1].originCity;
                    } else {
                        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_CITY] = model.fareShuttleModel.slices[0].destinationCityCode;
                        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_DEST] = model.fareShuttleModel.slices[0].destinationCityCode;
                        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_DEST_NAME] = model.fareShuttleModel.slices[0].destinationCity;
                    }
                    extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_COUNTRY] = model.fareShuttleModel.marketCode;
                    extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_ORIGIN] = model.fareShuttleModel.slices[0].originCityCode;
                    extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_ORIGIN_NAME] = model.fareShuttleModel.slices[0].originCity;
                    extendedDatalayerInfo[DatalayerBKIConstants.ADVANCE_PURCHASE] = DatalayerConstants.SHUTTLE_OPEN;
                    extendedDatalayerInfo[DatalayerBKIConstants.LENGTH_STAY] = DatalayerConstants.SHUTTLE_OPEN;
                    extendedDatalayerInfo[DatalayerBKIConstants.PAX_ADULT] = bookingInfo.numAdults.toString();
                    extendedDatalayerInfo[DatalayerBKIConstants.PAX_TOTAL] = bookingInfo.numAdults + bookingInfo.numChilds +
                        bookingInfo.numSeniors + bookingInfo.numTeenager + bookingInfo.numYoung;
                    extendedDatalayerInfo[DatalayerBKIConstants.PROCESS_START] = DatalayerConstants.LANG + '/' + DatalayerConstants.MARKET + '/' + generalInfo.searchOrigin;
                    extendedDatalayerInfo[DatalayerBKIConstants.FLIGHT_TYPE] = bookingInfo.tripType === '2' ? DatalayerConstants.DATALAYER_VALUES.RETURN_TRIP : DatalayerConstants.DATALAYER_VALUES.ONE_WAY_TRIP;
                    extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_OD] = '';
                    extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_COUNTRIES] = '';
                    extendedDatalayerInfo[DatalayerBKIConstants.FLIGHT_HAUL] = DatalayerConstants.FLIGHT_RATIO_TYPES.SHORT;
                    extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_TYPE] = this.getTypeSearch(true);
                    extendedDatalayerInfo[DatalayerGeneralConstants.PROCESS] = this.DigitalDataPropertiesUtilsService.setProcess();
                    extendedDatalayerInfo[DatalayerGeneralConstants.STEP] = DatalayerConstants.DATALAYER_VIEWS.FARE;
                    extendedDatalayerInfo[DatalayerGeneralConstants.USER_SEGMENT] = bookingInfo.tripType;
                    for (let oIndex = 0; oIndex < model.fareShuttleModel.slices.length; oIndex++) {
                        departureCountryCode = this.checkModelCountryCode(model.fareShuttleModel.slices[oIndex].segments[0].departure);
                        arrivalCountryCode = this.checkModelCountryCode(model.fareShuttleModel.slices[oIndex].segments[0].arrival);

                        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_OD] +=
                            (extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_OD].length > 0 ? ',' : '') +
                            model.fareShuttleModel.slices[oIndex].originCityCode;
                        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_OD] +=
                            model.fareShuttleModel.slices.length > 1 ? '' : ((extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_OD].length > 0 ? ',' : '') + model.fareShuttleModel.slices[oIndex].destinationCityCode);
                        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_COUNTRIES] +=
                            (extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_COUNTRIES].length > 0 ? '-' : '') + departureCountryCode;
                        extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_COUNTRIES] +=
                            model.fareShuttleModel.slices.length > 1 ? '' : ((extendedDatalayerInfo[DatalayerBKIConstants.SEARCH_COUNTRIES].length > 0 ? '-' : '') + arrivalCountryCode);
                    }
                    break;
                }
                case DatalayerConstants.FLOWS.PASSENGERS: {
                    largeFamilyValue && (extendedDatalayerInfo[DatalayerBKIConstants.LARGE_FAMILY] = largeFamilyValue);
                    generalInfo.resident && (extendedDatalayerInfo[DatalayerBKIConstants.RESIDENT_CODE] = generalInfo.resident);
                    extendedDatalayerInfo[DatalayerBKIConstants.PAX_PRICE] = this.calculatePassengersPrice();
                    extendedDatalayerInfo[DatalayerBKIConstants.PROCESS_START] = DatalayerConstants.LANG + '/' + DatalayerConstants.MARKET + '/' + generalInfo.searchOrigin;
                    extendedDatalayerInfo[DatalayerBKIConstants.SLICE_1_RESULTS] = 1;
                    bookingInfo.tripType=== '2' ? extendedDatalayerInfo[DatalayerBKIConstants.SLICE_2_RESULTS] = 1: '';
                    extendedDatalayerInfo[DatalayerBKIConstants.CHEAPEST_FARE] = DatalayerConstants.DATALAYER_VALUES.NO;
                    extendedDatalayerInfo[DatalayerGeneralConstants.QUADRIGAM] = redemptionFlow ? DatalayerConstants.QUADRIGAMS.SHUTTLE_REDEMPTION_PASSENGERS:DatalayerConstants.QUADRIGAMS.SHUTTLE_PASSENGERS_CODE;
                    extendedDatalayerInfo[DatalayerGeneralConstants.CODE] = this.LANG + '/' + this.MARKET + '/' + extendedDatalayerInfo[DatalayerGeneralConstants.QUADRIGAM];
                    extendedDatalayerInfo[DatalayerGeneralConstants.STEP] = DatalayerConstants.DATALAYER_VIEWS.PASSENGERS;
                    break;
                }
                case DatalayerConstants.FLOWS.PAYMENTS: {
                    const paymentsInfo: any = this.localStorageService.get('paymentsInfo');
                    this.setAncillariesDatalayer();
                    extendedDatalayerInfo[DatalayerGeneralConstants.QUADRIGAM] = redemptionFlow ? DatalayerConstants.QUADRIGAMS.SHUTTLE_REDEMPTION_PAYMENTS: DatalayerConstants.QUADRIGAMS.SHUTTLE_PAYMENTS;
                    extendedDatalayerInfo[DatalayerGeneralConstants.CODE] = this.LANG + '/' + this.MARKET + '/' + extendedDatalayerInfo[DatalayerGeneralConstants.QUADRIGAM];
                    extendedDatalayerInfo[DatalayerGeneralConstants.STEP] = DatalayerConstants.DATALAYER_VIEWS.PAYMENTS;
                    extendedDatalayerInfo[DatalayerBKIConstants.CASH_AVIOS_OFFER] = paymentsInfo?.availableDiscounts?.AVIOS?.available || paymentsInfo?.appliedDiscounts?.types?.AVIOS ?
                        DatalayerConstants.DATALAYER_VALUES.YES : DatalayerConstants.DATALAYER_VALUES.NO;
                    extendedDatalayerInfo[DatalayerGeneralConstants.VOUCHER_SHOWN] = (paymentsInfo?.availableDiscounts?.VOUCHER?.available || paymentsInfo?.appliedDiscounts?.types?.VOUCHER) ? DatalayerConstants.DATALAYER_VALUES.YES : DatalayerConstants.DATALAYER_VALUES.NO;

                    break;
                }
                case DatalayerConstants.FLOWS.CONFIRMATION: {
                    const paymentsInfo: any = this.localStorageService.get('paymentsInfo');
                    cardSelectedLogged ?
                        extendedDatalayerInfo[DatalayerGeneralConstants.PAYMENT_METHOD] = cardSelectedLogged.cardTypeCode:
                        extendedDatalayerInfo[DatalayerGeneralConstants.PAYMENT_METHOD] = cardTypeSelected;
                    extendedDatalayerInfo[DatalayerGeneralConstants.QUADRIGAM] = redemptionFlow ? DatalayerConstants.QUADRIGAMS.SHUTTLE_REDEMPTION_CONFIRMATION :DatalayerConstants.QUADRIGAMS.SHUTTLE_CONFIRMATION;
                    extendedDatalayerInfo[DatalayerGeneralConstants.CODE] = this.LANG + '/' + this.MARKET + '/' + extendedDatalayerInfo[DatalayerGeneralConstants.QUADRIGAM];
                    extendedDatalayerInfo[DatalayerGeneralConstants.STEP] = DatalayerConstants.DATALAYER_VIEWS.CONFIRMATION;
                    extendedDatalayerInfo[DatalayerGeneralConstants.CASH_AVIOS_USED] = paymentsInfo?.appliedDiscounts?.types?.AVIOS ? 'si' : 'no';
                    extendedDatalayerInfo[DatalayerGeneralConstants.VOUCHER_USED] = paymentsInfo?.appliedDiscounts?.types?.VOUCHER ? 'si' : 'no';
                    break;
                }
        }
        this.addDigitalDataInfo(extendedDatalayerInfo);
    };

    public updateDatalayerInfo = (quadrigam): void => {
        this.updateDatalayerWithQuadrigam(quadrigam, null, this.localStorageService.get('userLogged'));
        this.updateDigitalDataWithQuadrigam(quadrigam, null, this.localStorageService.get('userLogged'));
        this.sendDatalayerEvent(DatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
        this.$timeout(() => {
            this.$rootScope.$broadcast('updateDatalayer');
            this.$rootScope.$broadcast('sendUpdateToMonetate');
        });
    };

    public generateBbkiDataPayments = (productsObject, issuedInfoData): void => {
        let ditialDataInfo;
        if (this.localStorageService.get('confirmationDigitalDataCallBack')) {
            ditialDataInfo = this.localStorageService.get('confirmationDigitalDataCallBack');
            this.localStorageService.remove('confirmationDigitalDataCallBack');
        } else {
            ditialDataInfo = {};
        }

        ditialDataInfo[DatalayerBKIConstants.PMR] = productsObject.generalInfo[DatalayerBKIConstants.PMR] ? DatalayerConstants.DATALAYER_VALUES.YES : DatalayerConstants.DATALAYER_VALUES.NO;
        ditialDataInfo[DatalayerGeneralConstants.ORDER_ID] = issuedInfoData.order.orderId;
        this.addDigitalDataInfo(ditialDataInfo);
    };

    public generateBbkiRedemptionDataPayments = (productsObject, issuedInfoData): void => {
        let ditialDataInfo;
        if (this.localStorageService.get('confirmationDigitalDataCallBack')) {
            ditialDataInfo = this.localStorageService.get('confirmationDigitalDataCallBack');
            this.localStorageService.remove('confirmationDigitalDataCallBack');
        } else {
            ditialDataInfo = {};
        }

        ditialDataInfo[DatalayerBKIConstants.PMR] = productsObject.generalInfo[DatalayerBKIConstants.PMR] ? DatalayerConstants.DATALAYER_VALUES.YES : DatalayerConstants.DATALAYER_VALUES.NO;
        ditialDataInfo[DatalayerGeneralConstants.ORDER_ID] = issuedInfoData.order.orderId;
        this.addDigitalDataInfo(ditialDataInfo);
    };

    public changeLargeFamilyValue = (largeFamilyType: string): string => {
        if(largeFamilyType === this.CommonsConstants.LARGE_FAMILY_TYPES[0].code){
            return  this.CommonsConstants.LARGE_FAMILY_TYPES[0].name;
        }
        if(largeFamilyType === this.CommonsConstants.LARGE_FAMILY_TYPES[1].code){
            return this.CommonsConstants.LARGE_FAMILY_TYPES[1].name;

        }
        return null;
    };

    public getItemCategory3 = (event: string, outboundRoute: string, id: string): string => {
        let result: string = 'all';
        const selectedTripInfo: CommonsSelectedTripInfoModel.SelectedTripInfoModel[] = this.localStorageService.get('selectedTripInfo');

        if(selectedTripInfo) {
            selectedTripInfo.forEach((element, i) => {
                element?.info?.segments.forEach( segment => {
                    if(outboundRoute === `${segment?.departure?.code}-${segment?.arrival?.code}`) {
                        result = (i+1).toString();
                    }
                });
            });
        }

        result = this.getItemCategory3ById(result, id, outboundRoute);

        return result;
    };

    private getItemCategory3ById = (result, id, outboundRoute) => {
        let isOW :boolean;
        if (result === 'all' && id) {
            const arrId = id.split('|');
            arrId.forEach((element, i) => {
                if(outboundRoute === element) {
                    result = (i+1).toString();
                }
            });
            isOW = result === 'all' && arrId.length === 1;
            if(outboundRoute !== 'all' && isOW) {
                result = '1';
            }
        }
        return result;
    };

    public getItemCategory2 = (slice: any): string => {
        const flowApp = this.localStorageService.get('flowApp');
        let category2: string = '';
        // BKI
        category2 = slice.id.substring(0, 3) + '-' + slice.id.substring(3, 6);
        return category2;
    };

    public setProcessAndStep = (process: string, step: string, quadrigam?: string): void => {
        const quadrigamLocal: string = quadrigam ? quadrigam : '';
        const stepLocal: string = (DatalayerConstants.DATALAYER_ANCILLARIES_STEPS[quadrigam]) ? DatalayerConstants.DATALAYER_ANCILLARIES_STEPS[quadrigam] : step ? step : '';
        let processLocal: string = process ? process : '';

        const extendedDigitalDataInfo = {};
        extendedDigitalDataInfo[DatalayerGeneralConstants.PROCESS] = processLocal;
        extendedDigitalDataInfo[DatalayerGeneralConstants.STEP] = stepLocal;
        extendedDigitalDataInfo[DatalayerGeneralConstants.QUADRIGAM] = quadrigamLocal;
        this.addDigitalDataInfo(extendedDigitalDataInfo);
    };
    
    /**
     * @name updateDiscountData
     * @description This method is used to add discounts info to datalayer and digitalData
     * @param discountArray Array of discounts
     */
    public updateDiscountData = (discountArray: discountAppliedResponse[] = []): void => {
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
            this.addDigitalDataInfo(extendedDigitalDataInfo);
        }
    };

    public updateProcessAndStep = (flowsApp: string[], process: string[], step: string[], quadrigam:string[]) :void =>{
        const idFlowApp = flowsApp.findIndex(item => item === this.localStorageService.get('flowApp'));
        idFlowApp !== -1 ? this.setProcessAndStep(process[idFlowApp], step[idFlowApp], quadrigam[idFlowApp]):'';
    };

    public getStepFromQuadrigam = (quadrigam:string, defaultValue: string) => {
        const quadrigamToStep = {
            OHBKCF: DatalayerConstants.DATALAYER_VIEWS.ONHOLD_CONFIRMATION,
            ONHOLD: DatalayerConstants.DATALAYER_VIEWS.ONHOLD_PAYMENT,
            default: defaultValue
        };
        return quadrigamToStep[quadrigam] || quadrigamToStep.default;
    };

    private getUserState = (isUserLogged: boolean): string => {
        const userLogged: any = this.localStorageService.get('userLogged');
        const logged: CommonsDatalayerServiceTypes.LoggedDatalayer | null = this.localStorageService.get('EstadoUsuario');
        let userState: string = DatalayerConstants.DATALAYER_USER_STATES.ANONYMOUS;
        if (isUserLogged) {
            if (!this.CommonsUserUtilsService.getUserRole()) {
                this.CommonsUtilService.getUserTypeByToken();
            }
            userState =
                this.CommonsUserUtilsService.isIbPlus()
                    ? (this.CommonsUserUtilsService.isSoftUser() ? DatalayerConstants.DATALAYER_USER_STATES.LOGGED_FF_SOFT : DatalayerConstants.DATALAYER_USER_STATES.LOGGED_FF_HARD)
                    : (this.CommonsUserUtilsService.isSoftUser() ? DatalayerConstants.DATALAYER_USER_STATES.LOGGED_IB_SOFT : DatalayerConstants.DATALAYER_USER_STATES.LOGGED_IB_HARD);
            if (logged && logged.loggedBy) {
                userState = (logged.loggedBy === 'email') ? DatalayerConstants.DATALAYER_USER_STATES.LOGGED_MAIL : userState;
            } else {
                userState = (userLogged === this.CommonsConstants.LOGIN_ONB) ? DatalayerConstants.DATALAYER_USER_STATES.LOGGED_ONB : userState;
            }
        } else {
            userState = DatalayerConstants.DATALAYER_USER_STATES.ANONYMOUS;
        }

        return userState;
    };

    private getCabinType = ():string => {
        const urlParams:any = this.CommonsSessionStorageService.get('bookingUrlParams')??{};
        return urlParams.preferredCabin ?? urlParams.metasearchMainCabin ?? urlParams.beginFareType ??'';
    };

    public  getTypeSearch = (isDigitalData?: boolean): string => {
        const fareType = this.getCabinType().toUpperCase();
        const typeSearchConstants = isDigitalData ? DatalayerConstants.DIGITAL_DATA_TYPE_SEARCH : DatalayerConstants.DATALAYER_TYPE_SEARCH;
        const typeSearchMap = {
            'R': typeSearchConstants.LOW_COST,
            'N': typeSearchConstants.FLEXIBLE,
            'B': typeSearchConstants.PREMIUM_CABIN,
            'E': typeSearchConstants.LOW_COST,
            'ECONOMY': typeSearchConstants.LOW_COST,
            'BUSINESS': typeSearchConstants.PREMIUM_CABIN,
            'PREMIUMECONOMY': typeSearchConstants.PREMIUM_CABIN,
            'PREMIUMTOURIST': typeSearchConstants.PREMIUM_CABIN
        };
        return typeSearchMap[fareType] ?? typeSearchMap.R;
    };

    public getCodeFromCashAviosUsed = (paymentsInfo: any): string => {
        return paymentsInfo?.appliedDiscounts?.types?.AVIOS || paymentsInfo?.appliedDiscounts?.types?.AVIOS_REDEMPTION || paymentsInfo?.fullAvios ? 'si' : 'no';
    };

    

}
