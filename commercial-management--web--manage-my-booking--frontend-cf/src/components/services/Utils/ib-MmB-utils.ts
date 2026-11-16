import * as angular from 'angular';
import { MmBDatalayerUtilsService } from '@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service';
import { MMBDatalayerConstants } from '../ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';
import { MmBAppConstantsType } from '@src/app/core/models/mmb-constants-model';

@Service(
    'ib-MmB-services-module',
    ['IbCAuthTokenService', '$window', 'CommonsSessionStorageService', 'MmBAppConstants', '$filter', 'MmBModalService', '$sce', '$rootScope', 
        'CurrencyService', '$cookies', 'MmBDatalayerUtilsService', 'DatalayerUniqueKeysService'],
    []
)
export class MmBUtilService {
    constructor (
        private IbCAuthTokenService: IbCAuthTokenService,
        private $window: angular.IWindowService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private MmBAppConstants: MmBAppConstantsType,
        private $filter: ng.FilterFactory,
        private MmBModalService,
        private $sce: ng.ISCEService,
        private $rootScope: any,
        private CurrencyService: CurrencyService,
        private $cookies: angular.cookies.ICookiesService,
        private MmBDatalayerUtilsService: MmBDatalayerUtilsService,
        private DatalayerUniqueKeysService: DatalayerUniqueKeysService,
    ) {}

    updateDinamicPricingDatalayer = () => {
        const isDP = this.getDynamicPPricingCookieParameter();
        let datalayerObject = {};
        isDP ? datalayerObject = { Dynamic_pricing_seat: MMBDatalayerConstants.DATALAYER_VALUES.YES } : datalayerObject = { Dynamic_pricing_seat: MMBDatalayerConstants.DATALAYER_VALUES.NO };
        /* INIT DELETE GA4 MIGRATION*/
        this.MmBDatalayerUtilsService.addDataLayerInfo(datalayerObject);
        /* FINISH DELETE GA4 MIGRATION*/
        this.MmBDatalayerUtilsService.addDigitalDataInfo(datalayerObject);
    };

    private getDynamicPPricingCookieParameter = () => {
        const isDPCookie = this.$cookies.get(this.MmBAppConstants.COOKIES.DYNAMIC_PRICING);
        return isDPCookie;
    };

    getDeviceType = () => {
        let width;
        let deviceType = '';
        const channel = this.CommonsSessionStorageService.get('channel');
        if (channel === 'mobi') {
            deviceType = 'mobile';
        } else {
            width = this.$window.innerWidth;
            if (width != null) {
                if (width > 1024) {
                    deviceType = 'desktop';
                } else if (width > 480 && width < 1025) {
                    deviceType = 'tablet';
                } else if (width < 481) {
                    deviceType = 'mobile';
                };
            };
        };
        return deviceType;
    };

    refreshToken = () => {
        return new Promise((resolve, reject) => {
            if (this.CommonsSessionStorageService.get('userLogged')) {
                this.IbCAuthTokenService.refreshUserLoggedToken().then(() => resolve(null), () => {
                    this.CommonsSessionStorageService.set('userLogged', false);
                    this.IbCAuthTokenService.getAnonymousToken().then(() => resolve(null), () => resolve(null));
                });
            } else {
                this.IbCAuthTokenService.getAnonymousToken().then(() => resolve(null), () => resolve(null));
            }
        });
    };

    isUserLogged = () => {
        if (!this.CommonsSessionStorageService.get('userLogged')) {
            this.$cookies.remove('userLogged');
        } else {
            this.$cookies.put('userLogged', 'true');
        }
        return this.CommonsSessionStorageService.get('userLogged');
    };

    getDateFormatted = (day, month, year) => {
        const parsedDay = day < 10 ? '0' + day : day;
        const parsedMonth = month < 10 ? '0' + month : month;
        return year + '-' + parsedMonth + '-' + parsedDay;
    };

    initStorage = () => {
        let itemsToRemoveSessionStorage = ['paySucces', 'contactData', 'savedDataContactSuccess', 'bookingsList', 'redirectionPaymentCallback', 'bookingInfo',
            'otherFees', 'selectInsurance', 'headerModelLocal', 'ancillariesAvailablePassengers', 'ancillariesAvailableSegments', 'headerModel',
            'seatMapSegment', 'currency', 'flightsInfo', 'orderItemsInfo','selectedPaymentData','commercialInfo','insuranceSelected','breakDownInfo','seatsQuanty',
            'PaymentMethods', 'availableDiscounts','discountSelected','deleteVoucher','selectedLoggedCard','selectedAviosDisccount','flowId','PNR',
            'userLogged','segments','passengers','checkinSurname','selectedIssuerCountry','passengerBaggagesTrips','specialMealsTempInfo',
            'flowApp','frequentFlyersCompanies','ancillariesInfo','breakdownInfo','pmtModelInfo','paymentsInfo','voucherInfo','issueOrderInfo',
            'hasSelectedInsurance','marketSaved','currentSeatsInfo','updateSeatLocal','seatsSelectedInfoData','updateSeatFlights','ffLocal',
            'specialMealsTempInfoAux','specialNeed','modifyFFOrSpecialNeed','specialMealsCopy','segmentsAvailable','mmbAncillariesPaymentSummaryModel',
            'showAlertFlexibilization','typeDisruptionFlow','commercialSellingData','voucherOrderItems','paymentRedirection', 'hasPreorderAncillarie',
            'cashEmailNotification','fareFamilyConditions','summaryCVBounds','flexibilityConditions','fareFamilyConditionsConditions','refundPercentage',
            'specialNeedsPassengers','specialNeedsPassengersEdit','deepLinkParams','deepLinkData','disruptionPeriodsInfo','blackOutPeriodsData',
            'textBlackoutPeriods','textAllowedPeriods','allowedPeriods','isCheckedAllPassengers','selectedPriorityBoarding','totalPricePriorityBoarding',
            'disruptionSeatChangeCapabilities','paymentpassengerIdIBV','pnrChannel','unifiedNotIberiaOP','isUnifiedFlow','unifiedOfferType',
            'unifiedOptionalData','warningDowngradeSameFlightAndTime','warningDowngradeDiffFlightOrTime','downgradeSlice','downgradeCodes',
            'retrieveReservation','waitingListPurchased','confirmationDatalayerInfo','confirmationDigitalInfo','invoiceList','listInvoices',
            'newRequestInvoices','newRequestInvoicesFailure','blockedContinueSection','isRefreshCall','cashPriceInfo','prioritySegmentPutRequest',
            'passengerSpeqsTrips', 'pmtMthdsBidsTransformed', 'oldSeatsConfig','longHaulAircrafts','seatMapTourAircrafts','mealsInfo',
            'addToCart', 'avisReservationFlow', 'dataUmnrCompleted'
        ]
        this.CommonsSessionStorageService.clearAll(/(?!(ib-MmB-app).*)^(ib-[\w\-]+-app\.[\w\-]+)/i, { withPrefix: false });
        itemsToRemoveSessionStorage.forEach((item) => {
            this.CommonsSessionStorageService.remove(item);
        });

        this.removeAncillariesKeys();
        
        sessionStorage.removeItem(this.MmBAppConstants.COOKIES.BOOKING_INFO);
        this.DatalayerUniqueKeysService.clear();
        if (!this.isUserLogged()) {
            this.CommonsSessionStorageService.remove('customerData');
        };
    };

    private removeAncillariesKeys = (): void => {
        // UPGRADE KEYS
        this.CommonsSessionStorageService.remove('ancillariesPutAfterUpgBids');
        this.CommonsSessionStorageService.remove('flowUpgradeMMB');
        this.CommonsSessionStorageService.remove('sessionUpgradeInfo');
        this.CommonsSessionStorageService.remove('totalAmountBids');
        this.CommonsSessionStorageService.remove('totalAviosAmountFormatted');
        this.CommonsSessionStorageService.remove('UPG_BIDS_AVIOS');
        this.CommonsSessionStorageService.remove('flowUpgrade');
        this.CommonsSessionStorageService.remove('upgBidPutMade');
        this.CommonsSessionStorageService.remove('urlBidFlow');

        //SEAT KEYS
        this.CommonsSessionStorageService.remove('seatsSelectedInfoData');
        this.CommonsSessionStorageService.remove('seatInfoConfirmation');
    };

    getParameterByName = (name, url) => {
        let regex;
        let results;
        if (!url) url = this.$window.location.href;
        name = name.replace(/([[\]\\])/g, '\\$&');
        regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'gi');
        results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return null;
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    };

    getCompanyLogo = (companyCode) => {
        let coIndex = 0, coFound = false, companiesLogos: any = this.CommonsSessionStorageService.get('airlinesLogoList') || [];
        let airlineLogo = {
            'companyURL': this.MmBAppConstants.iconsRoute + this.MmBAppConstants.airlinesLogoBaseRoute + 'logo_pos_generico.svg',
            'companyDisabledURL': this.MmBAppConstants.iconsRoute + this.MmBAppConstants.airlinesLogoBaseRoute + 'logo_desact_generico.svg'
        };
        if (companyCode) {
            while (!coFound && coIndex < companiesLogos.length) {
                if (companiesLogos[coIndex].iataCompanyCode === companyCode) {
                    coFound = true;
                    airlineLogo.companyURL = this.MmBAppConstants.iconsRoute + this.MmBAppConstants.airlinesLogoBaseRoute + companiesLogos[coIndex].url;
                    airlineLogo.companyDisabledURL = this.MmBAppConstants.iconsRoute + this.MmBAppConstants.airlinesLogoBaseRoute + companiesLogos[coIndex].url_dis;
                }
                coIndex++;
            }
        }
        return airlineLogo;
    };

    getBasicSegmentInformation = (serviceSegmentInfo, sliceId) => {
        let auxSegment = {
            'id': serviceSegmentInfo.id,
            'type': serviceSegmentInfo.type,
            'flown': serviceSegmentInfo.flown,
            'ckiStatus': angular.copy(serviceSegmentInfo.ckiStatus),
            'departure': angular.copy(serviceSegmentInfo.departure),
            'departureCity': angular.copy(serviceSegmentInfo.departureCity),
            'departureDateTime': serviceSegmentInfo.departureDateTime,
            'transformedDepartureDate': serviceSegmentInfo.departureDateTime && this.$filter('DateFormatFilter')(serviceSegmentInfo.departureDateTime),
            'arrival': angular.copy(serviceSegmentInfo.arrival),
            'arrivalCity': angular.copy(serviceSegmentInfo.arrivalCity),
            'arrivalDateTime': serviceSegmentInfo.arrivalDateTime,
            'sliceId': sliceId,
            'transformedArrivalDate': serviceSegmentInfo.arrivalDateTime && this.$filter('DateFormatFilter')(serviceSegmentInfo.arrivalDateTime),
            'segment': this.addSegmentProp(serviceSegmentInfo),
            'cabinClass': angular.copy(serviceSegmentInfo.cabin)
        };
        angular.extend(auxSegment.segment, this.getCompanyLogo(serviceSegmentInfo.flight && serviceSegmentInfo.flight.operationalCarrier
            && serviceSegmentInfo.flight.operationalCarrier.code));
        return auxSegment;
    };

    private addSegmentProp = (serviceSegmentInfo) => {
        let segmentProp = {};
        if (serviceSegmentInfo.flight) {
            segmentProp = {
                'numberFlight': serviceSegmentInfo.flight.marketingCarrier && serviceSegmentInfo.flight.marketingFlightNumber && serviceSegmentInfo.flight.marketingCarrier.code ? serviceSegmentInfo.flight.marketingCarrier.code + serviceSegmentInfo.flight.marketingFlightNumber : serviceSegmentInfo.flight.operationalCarrier.code + serviceSegmentInfo.flight.operationalFlightNumber,
                'operatedBy': serviceSegmentInfo.flight.marketingCarrier.code !== serviceSegmentInfo.flight.operationalCarrier.code ? serviceSegmentInfo.flight.operationalCarrier.code : ''
            };
        };
        return segmentProp;
    };

    setFareFamilyConditions = (fareFamilyInfo) => {
        let conditions = this.CommonsSessionStorageService.get('fareFamilyConditions') || {};
        if (fareFamilyInfo.length > 0) {
            this.CommonsSessionStorageService.set('fareFamilyConditionsConditions', fareFamilyInfo);
        }
        fareFamilyInfo = fareFamilyInfo || [];
        for (let i = 0; i < fareFamilyInfo.length; i++) {
            if (!conditions[fareFamilyInfo[i].commercialCode]) {
                conditions[fareFamilyInfo[i].commercialCode] = fareFamilyInfo[i];
            }
        }
        this.CommonsSessionStorageService.set('fareFamilyConditions', conditions);
        return conditions;
    };

    openFareFamilyConditionsModal = (event, data) => {
        let modelFareFamily = this.CommonsSessionStorageService.get('fareFamilyConditions')[data.fareFamily] || {};
        angular.extend(modelFareFamily, { 'idModal': MMBDatalayerConstants.DATALAYER_MODAL_ID.FARE_CONDITIONS });
        this.MmBModalService.showGenericModal(data.isBlocked, data.template, modelFareFamily).result.then(angular.noop, angular.noop);
    };

    getOldManageAppErrorMessage = (errorCode) => {
        const messages = {
            '001': 'ERROR_OLD_MMB_001',
            '002': 'ERROR_OLD_MMB_002',
            '003': 'ERROR_OLD_MMB_003',
            '004': 'ERROR_OLD_MMB_004',
            '005': 'ERROR_OLD_MMB_005',
            '006': 'ERROR_OLD_MMB_006',
            '007': 'ERROR_OLD_MMB_007',
            '008': 'ERROR_OLD_MMB_008',
            '009': 'ERROR_OLD_MMB_009',
            '010': 'ERROR_OLD_MMB_010',
            '011': 'ERROR_OLD_MMB_011',
            '012': 'ERROR_OLD_MMB_012',
            '013': 'ERROR_OLD_MMB_013',
            '014': 'ERROR_OLD_MMB_014',
            '015': 'ERROR_OLD_MMB_015',
            '016': 'ERROR_OLD_MMB_016',
            '017': 'ERROR_OLD_MMB_017',
            '018': 'ERROR_OLD_MMB_018',
            '019': 'ERROR_OLD_MMB_019',
            '020': 'ERROR_OLD_MMB_020',
            '021': 'ERROR_OLD_MMB_021'
        };
        return messages[errorCode];
    };

    getRelatedContent = (relatedContent) => {
        let returnRelatedContent = {};
        if (relatedContent) {
            for (let i = 0; i < relatedContent.length; i++) {
                returnRelatedContent[relatedContent[i].key] = this.$sce.trustAsHtml(relatedContent[i].value);
            }
        }
        return returnRelatedContent;
    };

    getBackGroundURL = (destinationCityCode) => {
        let imageResolution = this.$window.innerWidth > 1024 ?
            this.MmBAppConstants.DESTINATION_IMAGE_SIZE.desktop :
            (this.$window.innerWidth > 480 && this.$window.innerWidth < 1024) ?
                this.MmBAppConstants.DESTINATION_IMAGE_SIZE.tablet :
                this.$window.innerWidth < 481 ?
                    this.MmBAppConstants.DESTINATION_IMAGE_SIZE.mobile :
                    this.MmBAppConstants.DESTINATION_IMAGE_SIZE.desktop;
        const backgroundURL = this.$window.location.origin + '/wcs/imagenes/destinos/calculadoraAvios/' + destinationCityCode.toUpperCase() + imageResolution;

        return backgroundURL;
    };

    isMobile = () => {
        let isMobile = this.$rootScope.isMobile ||
        { 'general': this.$window.innerWidth < 768, 'header': this.$window.innerWidth < 1024 };
        angular.element(this.$window).on('resize', () => {
            this.$rootScope.isMobile = { 'general': this.$window.innerWidth < 768, 'header': this.$window.innerWidth < 1024 };
        });
        return isMobile;
    };

    getCompanyURL = (companyCode) => {
        let airlinesLogo: any = this.CommonsSessionStorageService.get('airlinesLogoList') || [], i = 0, found = false, companyURL = '';
        while (!found && i < airlinesLogo.length) {
            if (airlinesLogo[i].iataCompanyCode === companyCode) {
                found = true;
                companyURL = this.MmBAppConstants.airlinesLogoBaseRoute + airlinesLogo[i].url;
            }
            i++;
        };
        if (!found) {
            companyURL = this.MmBAppConstants.airlinesLogoBaseRoute + this.MmBAppConstants.defaultAirlineLogo;
        };
        return companyURL;
    };

    getURLFirstParameterByName = (paramsName) => {
        let paramValue = null, i = 0;
        if (angular.isArray(paramsName)) {
            while (paramValue == null && i < paramsName.length) {
                if (angular.isString(paramsName[i])) {
                    paramValue = this.getParameterByName(paramsName[i], null);
                }
                i++;
            }
        } else if (angular.isString(paramsName)) {
            paramValue = this.getParameterByName(paramsName, null);
        }
        return paramValue;
    };

    getEndpoint = (key) => {
        return (this.CommonsSessionStorageService.get('endpoints') || {})[key];
    };

    getElementsByProperty = (array, parameter, canBeRepeated) => {
        let transformedObject = {};
        if (canBeRepeated) {
            this.forToElementsByPropertyRepeated(array,transformedObject,parameter);
        } else {
            for (let i = 0; i < array.length; i++) {
                transformedObject[array[i][parameter]] = array[i];
            };
        };
        return transformedObject;
    };

    private forToElementsByPropertyRepeated = (array,transformedObject,parameter) => {
        for (let i = 0; i < array.length; i++) {
            transformedObject[array[i][parameter]] = transformedObject[array[i][parameter]] || [];
            transformedObject[array[i][parameter]].push(array[i]);
        };
    };

    generateVoucherSummaryModel = (orderItems, slicesModel, currency) => {
        let segmentsInfo = [], slicesInfo, returnInfo = { 'passengersInfo': [], 'slicesInfo': null, 'hasBaggage': false, 'hasSeat': false, 'totalPrice': { 'totalPriceFormmated': '', 'total': 0 } };
        angular.forEach(slicesModel, (slice) => {
            angular.forEach(slice.segments, (segment) => {
                segmentsInfo.push({
                    'id': segment.id,
                    'origin': segment.departureCity,
                    'destination': segment.arrivalCity
                });
            });
        });
        slicesInfo = this.generateSlicesInfoVoucher(slicesModel,segmentsInfo);
        this.generateInfoVoucher(orderItems,returnInfo,currency,slicesInfo);
        returnInfo.slicesInfo = slicesInfo;
        returnInfo.totalPrice.totalPriceFormmated = this.CurrencyService.formatPrice(currency, returnInfo.totalPrice.total, true, false);
        return returnInfo;
    };

    private generateSlicesInfoVoucher = (slicesModel,segmentsInfo) => {
        let slices = [], i, segmentList, sliceOrigin, sliceDestination;
        angular.forEach(slicesModel, (slice) => {
            segmentList = [];
            angular.forEach(slice.segments, (segmentSlice) => {
                for (i = 0; i < segmentsInfo.length; i++) {
                    if (segmentSlice.id === segmentsInfo[i].id) {
                        segmentList.push(segmentsInfo[i]);
                    }
                    if (i === 0) sliceOrigin = segmentSlice.departure.city;
                    sliceDestination = segmentSlice.arrival.city;
                };
            });
            slices.push({ 'sliceId': slice.sliceId, 'segments': segmentList, 'ancillaries': [], 'hasBaggage': false, 'hasSeat': false, 'sliceOrigin': sliceOrigin, 'sliceDestination': sliceDestination });
        });
        return slices;
    };

    private generateInfoVoucher = (orderItems,returnInfo,currency,slicesInfo) => {
        orderItems.forEach((item) => {
            if (item.price && item.price.fare >= 0) {
                switch (item.type) {
                    case 'flight':
                        this.generatePassengerInfoVoucher(returnInfo, item, currency);
                        returnInfo.totalPrice.total += this.isItemPriceTotal(item);
                        break;
                    case 'baggage':
                        this.generateBaggageInfoVoucher(item, slicesInfo, currency);
                        returnInfo.totalPrice.total += this.isItemPriceFare(item);
                        returnInfo.hasBaggage = true;
                        break;
                    case 'seat':
                        this.generateSeatsInfoVocuher(item, slicesInfo, currency);
                        returnInfo.totalPrice.total += this.isItemPriceFare(item);
                        returnInfo.hasSeat = true;
                        break;
                };
            };
        });
    };

    private isItemPriceFare = (item) => {
        return (item.price.fare ? item.price.fare : this.isItemPriceTotal(item));
    };

    private isItemPriceTotal = (item) => {
        return (item.price.total ? item.price.total : 0);
    };

    private generatePassengerInfoVoucher = (returnInfo, passenger, currency) => {
        angular.forEach(passenger.passengerPrices, (pas) => {
            if (!pas.price) return;
            let paramsAddOrUpdatePassengerInfo = { passengersInfo: returnInfo.passengersInfo, pas, currency: currency, partialSlice:null, CurrencyService: this.CurrencyService, isVoucher: true };
            this._addOrUpdatePassengerInfo(paramsAddOrUpdatePassengerInfo);
        });
    };

    private _addOrUpdatePassengerInfo = (params) => {
        let { passengersInfo, pas, currency, partialSlice, CurrencyService, isVoucher } = params;
        const type = pas.passengerId.slice(0, pas.passengerId.length - 3);
        const existingIndex = passengersInfo.findIndex(
            (info) => info.type === type && info.farePrice === pas.price.fare
        );
        if (existingIndex !== -1) {
            const info = passengersInfo[existingIndex];
            info.amount++;
            info.totalPrice += pas.price.total;
            info.totalPriceFormatted = CurrencyService.formatPrice(currency, info.totalPrice, true, false);
        } else {
            const base: any = {
                type: type,
                typePlural: 'SOME_' + type,
                amount: 1,
                farePrice: pas.price.fare,
                farePriceFormatted: CurrencyService.formatPrice(currency, pas.price.fare, true, false),
                taxPrice: pas.price.tax,
                taxPriceFormatted: CurrencyService.formatPrice(currency, pas.price.tax, true, false),
                totalPrice: pas.price.total,
                totalPriceFormatted: CurrencyService.formatPrice(currency, pas.price.total, true, false),
                ticketingFeePrice: undefined,
                ticketingFeePriceFormatted: undefined,
                partialSlice: undefined
            };
            if (!isVoucher) {
                base.ticketingFeePrice = pas.price.ticketingFee;
                base.ticketingFeePriceFormatted = CurrencyService.formatPrice(currency, pas.price.ticketingFee, true, false);
                base.partialSlice = partialSlice;
            }
            passengersInfo.push(base);
        };
    };

    private _addOrUpdateAncillary(params) {
        let { slice,ancillaryType,matchFn,createFn,updateFn } = params;
        let found = false;
        for (let i = 0; i < slice.ancillaries.length; i++) {
            if (slice.ancillaries[i].type === ancillaryType && matchFn(slice.ancillaries[i])) {
                updateFn(slice.ancillaries[i]);
                found = true;
                break;
            };
        };
        if (!found) {
            slice.ancillaries.push(createFn());
        };
    };

    private generateSeatsInfoVocuher = (seat, slicesInfo, currency) => {
        angular.forEach(slicesInfo, (slice) => {
            angular.forEach(slice.segments, (segmentSlice) => {
                if (segmentSlice.id !== seat.segmentId) return;
                segmentSlice.hasSeat = true;
                let paramsAddOrUpdateAncillary = { 
                    slice, 
                    ancillaryType: this.MmBAppConstants.ANCILLARIES_IMPORT_ORDER_TYPE.SEAT, 
                    matchFn: (anc) => anc.segmentId === segmentSlice.id && anc.price === seat.price.fare, 
                    createFn: () => ({
                        type: this.MmBAppConstants.ANCILLARIES_IMPORT_ORDER_TYPE.SEAT,
                        price: seat.price.fare,
                        amount: 1,
                        priceFormatted: this.CurrencyService.formatPrice(currency, seat.price.fare, true, false),
                        priceTotalFormatted: this.CurrencyService.formatPrice(currency, seat.price.fare, true, false),
                        segmentId: segmentSlice.id
                    }),
                    updateFn: (anc) => {
                        anc.amount++;
                        anc.priceTotalFormatted = this.CurrencyService.formatPrice(
                            currency,
                            anc.amount * anc.price,
                            true,
                            false
                        );
                    }
                };
                this._addOrUpdateAncillary(paramsAddOrUpdateAncillary);
                slice.hasSeat = true;
            });
        });
    };

     private generateBaggageInfoVoucher = (baggage, slicesInfo, currency) => {
        angular.forEach(slicesInfo, (slice) => {
            if (slice.sliceId !== baggage.sliceId) return;

            const idx = this._findBaggageAncillaryIndex(slice.ancillaries, baggage, this.MmBAppConstants.ANCILLARIES_IMPORT_ORDER_TYPE.BAGGAGE);
            if (idx !== -1) {
                const anc = slice.ancillaries[idx];
                anc.amount += baggage.amount;
                anc.price += baggage.price.fare;
                anc.priceTotalFormatted = this.CurrencyService.formatPrice(currency, anc.price, true, false);
            } else {
                slice.ancillaries.push({
                    type: this.MmBAppConstants.ANCILLARIES_IMPORT_ORDER_TYPE.BAGGAGE,
                    price: baggage.price.fare,
                    unitaryPrice: baggage.price.fare / baggage.amount,
                    amount: baggage.amount,
                    priceFormatted: this.CurrencyService.formatPrice(currency, baggage.price.fare / baggage.amount, true, false),
                    priceTotalFormatted: this.CurrencyService.formatPrice(currency, baggage.price.fare, true, false)
                });
                slice.hasBaggage = true;
            };
        });
    };

    private isTypeSeat = (slice, i, seat) => {
        return (slice.ancillaries[i].type === this.MmBAppConstants.ANCILLARIES_IMPORT_ORDER_TYPE.SEAT && slice.ancillaries[i].price === seat.price.fare && slice.ancillaries[i].segmentId === seat.segmentId);
    };

    private isTypeBaggage = (slice, i, baggage) => {
        return (slice.ancillaries[i].type === this.MmBAppConstants.ANCILLARIES_IMPORT_ORDER_TYPE.BAGGAGE && (slice.ancillaries[i].unitaryPrice === baggage.price.fare / baggage.amount || slice.ancillaries[i].price === baggage.price.fare));
    };
    
    generateSummaryModel = (orderItems, slicesModel, isVoucher, isPartialRefund) => {
        let segmentsInfo = [];
        let cashCurrenciesList;
        let returnInfo: any = {
            'passengersInfo': [],
            'slicesInfo': null,
            'hasBaggage': false,
            'hasSeat': false,
            'hasFlex': false,
            'hasSpeqs': false,
            'hasPriorityBoarding': false,
            'priorityBoarding': {
                'type': '',
                'price': {
                    'fare': 0,
                    'tax': 0,
                    'total': 0,
                    'totalPriceFormmated': ''
                },
                'units': 0
            },
            'flexibilization': {
                'type': '',
                'price': {
                    'fare': 0,
                    'tax': 0,
                    'total': 0,
                    'totalPriceFormmated': ''
                },
                'units': 0,
                'subtype': ''
            },
            'totalPrice': {
                'totalPriceFormmated': '',
                'total': 0
            },
            'isPartialRefund': false,
            'totalPassengers': 0
        };

        isVoucher
            ? cashCurrenciesList = this.CommonsSessionStorageService.get('voucherCurrenciesList')
            : cashCurrenciesList = this.CommonsSessionStorageService.get('cashCurrenciesList');

        angular.forEach(slicesModel, (slice) => {
            angular.forEach(slice.segments, (segment) => {
                segmentsInfo.push({
                    'id': segment.id,
                    'origin': segment.departureCity,
                    'destination': segment.arrivalCity
                });
            });
        });

        const slicesInfo = this._generateSlicesInfoForSummary(slicesModel, segmentsInfo);
        let paramsInfoSummary = { orderItems, slicesInfo, cashCurrenciesList, isPartialRefund, returnInfo };
        this._generateInfoForSummary(paramsInfoSummary);

        returnInfo.slicesInfo = slicesInfo;
        if (isPartialRefund) returnInfo.isPartialRefund = true;
        return returnInfo;
    };

    private _generateSlicesInfoForSummary(slicesModel, segmentsInfo) {
        return slicesModel.map(slice =>
            this._buildSliceInfoForSummary(slice, segmentsInfo)
        );
    };

    private _buildSliceInfoForSummary(slice, segmentsInfo) {
        let segmentList = [];
        let sliceOrigin = null;
        let sliceDestination = null;
        let originSet = false;

        angular.forEach(slice.segments, (segmentSlice, idx) => {
            for (let i = 0; i < segmentsInfo.length; i++) {
                if (segmentSlice.id === segmentsInfo[i].id) {
                    segmentList.push(segmentsInfo[i]);
                }
                if (i === 0 && !originSet) {
                    sliceOrigin = segmentSlice.departure.city;
                }
                originSet = true;
                sliceDestination = segmentSlice.arrival.city;
            }
        });

        return {
            sliceId: slice.sliceId,
            segments: segmentList,
            ancillaries: [],
            hasBaggage: false,
            hasSeat: false,
            sliceOrigin,
            sliceDestination
        };
    }

    private _generateInfoForSummary(params) {
        let { orderItems, slicesInfo, cashCurrenciesList, isPartialRefund, returnInfo } = params;
        const getCurrencyToFormat = (currencyCode) => {
            let currencyObject = {}, currencyFound = false, currencyIndex = 0;
            while (!currencyFound && currencyIndex < cashCurrenciesList.length) {
                if (currencyCode === cashCurrenciesList[currencyIndex].code) {
                    currencyFound = true;
                    currencyObject = cashCurrenciesList[currencyIndex];
                } else
                    currencyIndex++;
            }
            return currencyObject;
        };

        angular.forEach(orderItems, (item) => {
            let paramsOrderItemForSummary = { item, orderItems, slicesInfo, isPartialRefund, returnInfo, getCurrencyToFormat };
            this._handleOrderItemForSummary(paramsOrderItemForSummary);
        });
    };

    private _handleOrderItemForSummary(params) {
        let {item, orderItems, slicesInfo, isPartialRefund, returnInfo, getCurrencyToFormat} = params;
        switch (item.type.toLowerCase()) {
            case 'flight':
                let paramsFlightOrderItem = { item, orderItems, slicesInfo, isPartialRefund, returnInfo, getCurrencyToFormat };
                this._handleFlightOrderItem(paramsFlightOrderItem);
                break;
            case 'baggage':
                this._handleBaggageOrderItem(item, slicesInfo, returnInfo, getCurrencyToFormat);
                break;
            case 'seat':
                this._handleSeatOrderItem(item, slicesInfo, returnInfo, getCurrencyToFormat);
                break;
            case 'specialequipment':
                this._handleSpecialEquipmentOrderItem(item, slicesInfo, returnInfo, getCurrencyToFormat);
                break;
            case 'flexibilityondemand':
                this._handleFlexibilityOnDemandOrderItem(item, returnInfo, getCurrencyToFormat);
                break;
            case 'priorityboarding':
                this._handlePriorityBoardingOrderItem(item, slicesInfo, returnInfo, getCurrencyToFormat);
                break;
        };
    };

    private _handleFlightOrderItem(params) {
        let { item, orderItems, slicesInfo, isPartialRefund, returnInfo, getCurrencyToFormat } = params;
        let paramsPassengerInfoSummary = {
            passenger: item.passengerPrices,
            sliceIds: item.sliceIds,
            slicesInfo,
            isPartialRefund,
            returnInfo,
            getCurrencyToFormat
        };
        this._generatePassengerInfoForSummary(paramsPassengerInfoSummary);
        if (this.CommonsSessionStorageService.get('refundFees') && orderItems[0].price.ticketingFee > 0) {
            returnInfo.ticketingFee = true;
        } else {
            returnInfo.ticketingFee = false;
        };
    };

    private _handleBaggageOrderItem(item, slicesInfo, returnInfo, getCurrencyToFormat) {
        this._generateBaggageInfoForSummary(item, slicesInfo, getCurrencyToFormat);
        returnInfo.hasBaggage = true;
    };

    private _handleSeatOrderItem(item, slicesInfo, returnInfo, getCurrencyToFormat) {
        this._generateSeatsInfoForSummary(item, slicesInfo, getCurrencyToFormat);
        returnInfo.hasSeat = true;
    };

    private _handleSpecialEquipmentOrderItem(item, slicesInfo, returnInfo, getCurrencyToFormat) {
        this._generateSpeqsInfoForSummary(item, slicesInfo, getCurrencyToFormat);
        returnInfo.hasSpeqs = true;
    };

    private _handleFlexibilityOnDemandOrderItem(item, returnInfo, getCurrencyToFormat) {
        this._generateFlexInfoForSummary(item, returnInfo, getCurrencyToFormat);
        returnInfo.hasFlex = true;
    };

    private _handlePriorityBoardingOrderItem(item, slicesInfo, returnInfo, getCurrencyToFormat) {
        this._generatePriorityBoardingForSummary(item, slicesInfo, getCurrencyToFormat);
        returnInfo.hasPriorityBoarding = true;
    };

    private _findPartialSlice(sliceIds, slicesInfo, isPartialRefund) {
        if (!sliceIds || !isPartialRefund) return null;
        for (let i = 0; i < slicesInfo.length; i++) {
            for (let j = 0; j < sliceIds.length; j++) {
                if (slicesInfo[i].id === sliceIds[j].id) {
                    return slicesInfo[i];
                };
            };
        };
        return null;
    };

    private _generatePassengerInfoForSummary(params) {
        let { passenger, sliceIds, slicesInfo, isPartialRefund, returnInfo, getCurrencyToFormat } = params;
        const partialSlice = this._findPartialSlice(sliceIds, slicesInfo, isPartialRefund);

        angular.forEach(passenger, (pas) => {
            returnInfo.totalPassengers++;
            if (!pas.price) return;
            let paramsAddOrUpdatePassengerInfo = { passengersInfo: returnInfo.passengersInfo, pas, currency: getCurrencyToFormat(pas.price.currency), partialSlice, CurrencyService: this.CurrencyService, isVoucher: false };
            this._addOrUpdatePassengerInfo(paramsAddOrUpdatePassengerInfo);
        });
    };

    private _generateBaggageInfoForSummary(item, slicesInfo, getCurrencyToFormat) {
        angular.forEach(slicesInfo, (slice) => {
            if (slice.sliceId !== item.sliceId) return;

            const idx = this._findBaggageAncillaryIndex(slice.ancillaries, item, this.MmBAppConstants.ANCILLARIES_IMPORT_ORDER_TYPE.BAGGAGE);
            const currencyObject = getCurrencyToFormat(item.price.currency);

            if (idx !== -1) {
                this._updateBaggageAncillary(slice.ancillaries[idx], item, currencyObject);
            } else {
                this._addNewBaggageAncillary(slice, item, currencyObject);
            };
        });
    };

    private _findBaggageAncillaryIndex(ancillaries, baggage, type) {
        for (let i = 0; i < ancillaries.length; i++) {
            if (this.isTypeBaggage({ ancillaries }, i, baggage)) {
                return i;
            };
        };
        return -1;
    };

    private _updateAncillaryAmountAndPrice(ancillary, amount, price, currencyObject) {
        ancillary.amount += amount;
        ancillary.price += price;
        ancillary.priceTotalFormatted = this.CurrencyService.formatPrice(
            this.CurrencyService.getCurrencyObject(currencyObject),
            ancillary.price,
            true,
            false
        );
    };

    private _updateBaggageAncillary(ancillary, baggage, currencyObject) {
        this._updateAncillaryAmountAndPrice(ancillary, baggage.amount, baggage.price.fare, currencyObject);
    };

    private _createAncillaryObject(params) {
        let { type, price, amount, currencyObject, extraFields } = params;
        return {
            type,
            price,
            unitaryPrice: price / amount,
            amount,
            priceFormatted: this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(currencyObject), price / amount, true, false),
            priceTotalFormatted: this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(currencyObject), price, true, false),
            ...extraFields
        };
    };

    private _addNewBaggageAncillary(slice, baggage, currencyObject) {
        let paramsAncillaryObject = { type: this.MmBAppConstants.ANCILLARIES_IMPORT_ORDER_TYPE.BAGGAGE, price: baggage.price.fare, amount: baggage.amount, currencyObject, extraFields: {} };
        slice.ancillaries.push(
            this._createAncillaryObject(paramsAncillaryObject)
        );
        slice.hasBaggage = true;
    };

    private _generateSeatsInfoForSummary(item, slicesInfo, getCurrencyToFormat) {
        function addNewSeat(slice, seat, segmentSlice, currencyObject, CurrencyService, MmBAppConstants) {
            slice.ancillaries.push({
                'type': MmBAppConstants.ANCILLARIES_IMPORT_ORDER_TYPE.SEAT,
                'price': seat.price.fare,
                'amount': 1,
                'priceFormatted': CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currencyObject), seat.price.fare, true, false),
                'priceTotalFormatted': CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currencyObject), seat.price.fare, true, false),
                'segmentId': segmentSlice.id
            });
            slice.hasSeat = true;
        };

        angular.forEach(slicesInfo, (slice) => {
            angular.forEach(slice.segments, (segmentSlice) => {
                if (segmentSlice.id !== item.segmentId) return;
                segmentSlice.hasSeat = true;
                let found = false;
                let currencyObject: any = null;

                if (slice.ancillaries.length > 0) {
                    for (let i = 0; i < slice.ancillaries.length && !found; i++) {
                        if (this.isTypeSeat(slice, i, item)) {
                            found = true;
                            currencyObject = getCurrencyToFormat(item.price.currency);
                            slice.ancillaries[i].amount++;
                            slice.ancillaries[i].priceTotalFormatted = this.CurrencyService.formatPrice(
                                this.CurrencyService.getCurrencyObject(currencyObject),
                                slice.ancillaries[i].amount * slice.ancillaries[i].price,
                                true,
                                false
                            );
                        };
                    };
                };
                if (!found) {
                    currencyObject = getCurrencyToFormat(item.price.currency);
                    addNewSeat(slice, item, segmentSlice, currencyObject, this.CurrencyService, this.MmBAppConstants);
                };
            });
        });
    };

    private _generateFlexInfoForSummary(item, returnInfo, getCurrencyToFormat) {
        let currencyObject: any = {};
        currencyObject = getCurrencyToFormat(item.price.currency);
        returnInfo.flexibilization.type = item.type;
        returnInfo.flexibilization.price.fare = item.price.fare;
        returnInfo.flexibilization.price.priceFormmated = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(currencyObject), item.price.fare, true, false);
        returnInfo.flexibilization.price.tax = item.price.tax;
        returnInfo.flexibilization.price.total += item.price.total;
        returnInfo.flexibilization.price.totalPriceFormmated = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(currencyObject), returnInfo.flexibilization.price.total, true, false);
        returnInfo.flexibilization.subtype = item.subtype;
        returnInfo.flexibilization.units += 1;
        returnInfo.totalPrice.total += item.price.total;
        returnInfo.totalPrice.totalPriceFormmated = this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(currencyObject), returnInfo.totalPrice.total, true, false);
    };

    private _generatePriorityBoardingForSummary(item, slicesInfo, getCurrencyToFormat) {
        angular.forEach(slicesInfo, (slice) => {
            this._processPriorityBoardingForSlice(slice, item, getCurrencyToFormat);
        });
    };

    private _processPriorityBoardingForSlice(slice, item, getCurrencyToFormat) {
        for (let i = 0; i < slice.segments.length; i++) {
            if (item.segmentId === slice.segments[i].id) {
                const idx = this._findPriorityBoardingAncillaryIndex(slice.ancillaries);
                const currencyObject = getCurrencyToFormat(item.price.currency);
                if (idx !== -1) {
                    this._updatePriorityBoardingAncillary(slice.ancillaries[idx], item, currencyObject);
                } else {
                    this._addNewPriorityBoardingAncillary(slice, item, currencyObject);
                };
                break;
            };
        };
    };

    private _findPriorityBoardingAncillaryIndex(ancillaries) {
        for (let j = 0; j < ancillaries.length; j++) {
            if (ancillaries[j].type === this.MmBAppConstants.ANCILLARIES_IMPORT_ORDER_TYPE.PRIORITY_BOARDING) {
                return j;
            };
        };
        return -1;
    };

    private _updatePriorityBoardingAncillary(ancillary, item, currencyObject) {
        ancillary.amount += 1;
        ancillary.price += item.price.fare;
        ancillary.priceTotalFormatted = this.CurrencyService.formatPrice(
            this.CurrencyService.getCurrencyObject(currencyObject),
            ancillary.price,
            true,
            false
        );
    };

    private _addNewPriorityBoardingAncillary(slice, item, currencyObject) {
        slice.ancillaries.push({
            'type': this.MmBAppConstants.ANCILLARIES_IMPORT_ORDER_TYPE.PRIORITY_BOARDING,
            'price': item.price.fare,
            'unitaryPrice': item.price.fare,
            'amount': 1,
            'priceFormatted': this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(currencyObject), item.price.fare, true, false),
            'priceTotalFormatted': this.CurrencyService.formatPrice(this.CurrencyService.getCurrencyObject(currencyObject), item.price.fare, true, false)
        });
        slice.hasPriorityBoarding = true;
    };

    private _generateSpeqsInfoForSummary(item, slicesInfo, getCurrencyToFormat) {
        function addNewSpeq(slice, speq, currencyObject, CurrencyService, MmBAppConstants) {
            slice.ancillaries.push({
                'type': MmBAppConstants.ANCILLARIES_IMPORT_ORDER_TYPE.SPEQS,
                'price': speq.price.fare,
                'unitaryPrice': speq.price.fare / speq.amount,
                'amount': speq.amount,
                'priceFormatted': CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currencyObject), speq.price.fare / speq.amount, true, false),
                'priceTotalFormatted': CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currencyObject), speq.price.fare, true, false)
            });
            slice.hasSpeqs = true;
        };

        angular.forEach(slicesInfo, (slice) => {
            if (slice.sliceId !== item.sliceId) return;

            let found = false;
            let currencyObject: any = null;

            if (slice.ancillaries.length > 0) {
                for (let i = 0; i < slice.ancillaries.length && !found; i++) {
                    if (this.isSpeqsUnitaryPrice(slice, i, item)) {
                        found = true;
                        currencyObject = getCurrencyToFormat(item.price.currency);
                        slice.ancillaries[i].amount += item.amount;
                        slice.ancillaries[i].price += item.price.fare;
                        slice.ancillaries[i].priceTotalFormatted = this.CurrencyService.formatPrice(
                            this.CurrencyService.getCurrencyObject(currencyObject),
                            slice.ancillaries[i].price,
                            true,
                            false
                        );
                    };
                };
            };
            if (!found) {
                currencyObject = getCurrencyToFormat(item.price.currency);
                addNewSpeq(slice, item, currencyObject, this.CurrencyService, this.MmBAppConstants);
            };
        });
    };

    private isSpeqsUnitaryPrice = (slice, i, speq) => {
        return (slice.ancillaries[i].type === this.MmBAppConstants.ANCILLARIES_IMPORT_ORDER_TYPE.SPEQS && (slice.ancillaries[i].unitaryPrice === speq.price.fare / speq.amount || slice.ancillaries[i].price === speq.price.fare));
    };

    removeAllParams = () => {
        const url = window.location.href.split('?')[0];
        return url.substring(0, url.length - 1);
    };

    formatDisruptionAndFlexibilizationDates = (dates, type) => {
        let formattedString = '';
        switch (type) {
                case 'BLACKOUT':
                    formattedString = this.formatBlackoutDates(dates);
                    break;
                case 'ALLOWED_PERIODS':
                    formattedString = this.formatAllowedPeriodDates(dates);
                    break;
                case 'FLEXIBILIZATION_RANGE':
                    formattedString = this.formatFlexibilizationDates(dates);
                    break;
                default:
                    break;
        };

        return formattedString;
    };

    private formatBlackoutDates = (datesList) => {
        const fromContraction = this.$filter('translate')('MMB_FLIGHT_CHANGE_CONTRACTION_FROM_1');
        const toContraction = this.$filter('translate')('MMB_FLIGHT_CHANGE_CONTRACTION_TO_1');
        const fromContractionLast = this.$filter('translate')('MMB_FLIGHT_CHANGE_CONTRACTION_TO_3');
        const zhAndjpLastTag = this.$filter('translate')('MMB_FLIGHT_CHANGE_BLACKOU_ZH_AND_JP_TAG');

        const formatItem = (item, isLast, hasMultiple) => {
            if (!item.dateFrom || !item.dateTo) return '';
            const formattedDateFrom = this.$filter('DateFormatFilter')(item.dateFrom);
            const formattedDateTo = this.$filter('DateFormatFilter')(item.dateTo);
            if (isLast && hasMultiple) {
                return (fromContractionLast + ' ' + formattedDateFrom.formatedDate + ' ' + toContraction + ' ' + formattedDateTo.formatedDate + zhAndjpLastTag);
            }
            return (fromContraction + ' ' + formattedDateFrom.formatedDate + ' ' + toContraction + ' ' + formattedDateTo.formatedDate + ', ');
        };

        if (!Array.isArray(datesList) || datesList.length < 1) return '';

        const hasMultiple = datesList.length > 1;
        let formattedString = '';
        datesList.forEach((item, idx) => {
            const isLast = idx === datesList.length - 1;
            formattedString += formatItem(item, isLast, hasMultiple);
        });

        return formattedString;
    };

    private formatAllowedPeriodDates = (date) => {
        let formattedDateTo;
        let formattedString = '';
        if (date && date.length >= 1) {
            if (date[0].dateTo) {
                formattedDateTo = this.$filter('DateFormatFilter')(date[0].dateTo);
                formattedString = formattedDateTo.formatedDate;
            }
        };
        return formattedString;
    };

    private formatFlexibilizationDates = (dateList) => {
        let formattedDateSince, formattedDateLimit, betweenContraction = this.$filter('translate')('MMB_FLIGHT_CHANGE_CONTRACTION_TO_2');
        let formattedString = '';
        if (dateList?.since && dateList?.limit) {
            formattedDateSince = this.$filter('DateFormatFilter')(dateList.since);
            formattedDateLimit = this.$filter('DateFormatFilter')(dateList.limit);
            formattedString = formattedDateSince.formatedDate + ' ' + betweenContraction + ' ' + formattedDateLimit.formatedDate + '';
        };
        return formattedString;
    };

    orderItemContained = (orderItems, typeList) => {
        var i = 0, found = false, transformedData;
        transformedData = this.getElementsByProperty(orderItems, 'type', true);
        while(i<typeList.length && !found){
            if(transformedData[typeList[i]]){
                found = true;
            }
            i++;
        }
        return found;
    };
};
