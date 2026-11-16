import * as angular from 'angular';
import { CommonsCookiesService } from './storage-utils/ib-commons-cookies.service';
import { CommonsUserUtilsService } from './ib-commons-user-utils.service';
import { CommonsConstantsType } from '../constants/ib-commons-constants';
import { CommonsHttpServicesConstantsType } from '../constants/ib-commons-http-service-constants';
import { PrefixResponse } from '../models/http-services/rdu-loc/ib-prefix.model';
import { IbCTokenUtilsService } from './ib-commons-token-utils.service';
import { RedirectionService } from '../utils/ib-commons-redirection.service';

@Service('ib-commons-utils-module',
    [
    '$window',
    'localStorageService',
    '$rootScope',
    'CommonsConstants',
    '$cookies',
    '$filter',
    '$location',
    'CommonsCookiesService',
    '$document',
    'CommonsUserUtilsService',
    'CommonsHttpServicesConstants',
    'IbCTokenUtilsService',
    'RedirectionService'
    ])
export class CommonsUtilService {

    public COOKIES = this.CommonsHttpServicesConstants.COOKIES;

    constructor (
        private $window: ng.IWindowService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $rootScope: CommonsRootScope,
        private CommonsConstants: CommonsConstantsType,
        private $cookies: ng.cookies.ICookiesService,
        private $filter: ng.IFilterService,
        private $location: ng.ILocationService,
        private CommonsCookiesService: CommonsCookiesService,
        private $document: ng.IDocumentService,
        private CommonsUserUtilsService: CommonsUserUtilsService,
        private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
        private IbCTokenUtilsService: IbCTokenUtilsService,
        private RedirectionService: RedirectionService
    ) {}

    ////////////////
    /**
     * Returns the type of the device depending on the channel and the width of the screen.
     * @returns {String} - returns a string. desktop|tablet|mobile
     */
    getDeviceType = (): string => {
        let deviceType: string = '';
        const channel: string = this.localStorageService.get('channel');
        if (channel === 'mobi') {
            deviceType = 'mobile';
        } else {
            const width = this.$window.innerWidth;
            if (width !== null) {
                if (width >= 1024) {
                    deviceType = 'desktop';
                } else if (width > 480 && width < 1024) {
                    deviceType = 'tablet';
                } else
                    deviceType = 'mobile';
            }
        }
        return deviceType;
    };
    keydownInput = (dataIn): Array<boolean> => {
        dataIn.onblur = false;
        dataIn.keydown = true;
        dataIn.dynamicError = false;
        dataIn.importError = false;
        return dataIn;
    };

    resetFields = (dataIn): Array<boolean> => {
        dataIn.onblur = false;
        dataIn.dynamicPrice = null;
        dataIn.keydown = false;
        dataIn.focused = false;
        dataIn.customPrice = null;
        dataIn.dynamicError = false;
        dataIn.importError = false;
        return dataIn;
    };
    ////////////////
    /**
     * Returns if screen type is mobile or not depending on screen size.
     * @returns {Boolean} - returns a boolean.
     */
    isMobile = (): boolean => {
        const isMobile: boolean = this.$rootScope.isMobile || {
            general: this.$window.innerWidth < 768,
            header: this.$window.innerWidth < 1024
        };
        angular.element(this.$window).on('resize', () => {
            const documentRef = this.$document[0] as Document;
            const idLoginHeader = documentRef.getElementById('iframeloginId') as HTMLIFrameElement;
            const idLoginOthers = documentRef.getElementById('iframeReusableLoginId') as HTMLIFrameElement;
            this.$rootScope.isMobile = {
                general: this.$window.innerWidth < 768,
                header: this.$window.innerWidth < 1024
            };
            let size = '';
            if (this.$window.innerWidth >= 768) {
                size = 'ibLoginSizeDesktop';
            } else if (this.$window.innerWidth < 768 && this.$window.innerWidth >= 480) {
                size = 'ibLoginSizeSM';
            } else if (this.$window.innerWidth < 480) {
                size = 'ibLoginSizeXS';
            }
            if (idLoginHeader && idLoginOthers && idLoginHeader.contentWindow && idLoginOthers.contentWindow) {
                idLoginHeader.contentWindow.postMessage(size, '*');
                idLoginOthers.contentWindow.postMessage(size, '*');
            } else if (idLoginHeader && idLoginHeader.contentWindow) {
                idLoginHeader.contentWindow.postMessage(size, '*');
            } else if (idLoginOthers && idLoginOthers.contentWindow) {
                idLoginOthers.contentWindow.postMessage(size, '*');
            }
        });
        return isMobile;
    };

    /**
     * Returns a specific endpoint using the key parameter
     * @param {String} key
     */

    getEndpoint = (key: string): string => {
        return (this.localStorageService.get('endpoints') || {})[key];
    };

    /**
     * Returns a specific segment using the segmentId, if the function dont found the segment return a empty object
     * @param {Integer} segmentId
     * @param {Array} slices
     */
    getSegmentDetailsById = (segmentId: number, slices: Array<any>): object => {
        let sliceIndex: number = 0, segmentFounded: boolean = false, segmentIndex: number, segmentInfo: object = {};
        while (!segmentFounded && sliceIndex < slices.length) {
            segmentIndex = 0;
            while (!segmentFounded && segmentIndex < slices[sliceIndex].segments.length) {
                if (slices[sliceIndex].segments[segmentIndex].id === segmentId) {
                    segmentFounded = true;
                    segmentInfo = {
                        origin: slices[sliceIndex].segments[segmentIndex].departure,
                        arrival: slices[sliceIndex].segments[segmentIndex].arrival
                    };
                }
                segmentIndex++;
            }
            sliceIndex++;
        }
        return segmentInfo;
    };
    getSegmentsInfo = (): string[] => {
        const bookingInfo: any = this.localStorageService.get('bookingInfo');
        let i: number, segment: any;
        const segments: string[] = this.localStorageService.get('segmentsInfo') || [];
        for (i = 0; i < bookingInfo.outwardSegments.length; i++) {
            segment = {
                id: bookingInfo.outwardSegments[i].id.toString(),
                origin: {
                    description: bookingInfo.outwardSegments[i].departure.airport.description,
                    code: bookingInfo.outwardSegments[i].departure.airport.code
                },
                destination: {
                    description: bookingInfo.outwardSegments[i].arrival.airport.description,
                    code: bookingInfo.outwardSegments[i].arrival.airport.code
                }
            };
            segments.push(segment);
        }

        for (i = 0; i < bookingInfo.returnSegments.length; i++) {
            segment = {
                id: bookingInfo.returnSegments[i].id.toString(),
                origin: {
                    description: bookingInfo.returnSegments[i].departure.airport.description,
                    code: bookingInfo.returnSegments[i].departure.airport.code
                },
                destination: {
                    description: bookingInfo.returnSegments[i].arrival.airport.description,
                    code: bookingInfo.returnSegments[i].arrival.airport.code
                }
            };
            segments.push(segment);

        }

        for (i = 0; i < bookingInfo.airShuttleSegments.length; i++) {
            segment = {
                id: bookingInfo.airShuttleSegments[i].id.toString(),
                origin: {
                    description: bookingInfo.airShuttleSegments[i].departure.airport.description,
                    code: bookingInfo.airShuttleSegments[i].departure.airport.code
                },
                destination: {
                    description: bookingInfo.airShuttleSegments[i].arrival.airport.description,
                    code: bookingInfo.airShuttleSegments[i].arrival.airport.code
                }
            };
            segments.push(segment);

        }

        this.localStorageService.set('segmentsInfo', segments);
        return segments;
    };


    getSliceDetailsById = (segmentId: number, slices: Array<any>): object => {
        return {};
    };
    /**
     * @deprecated Use the one from IbCTokenUtilsService instead
     * This functions get the loged codified token and return tier level decodified.
     *  @returns {String} tier Level.
     *  */
    getTierLevelByToken = () => {
        let infoToken = null, resultJsonToken = null, roles: any = null, tierLevel: string = null,
            accessToken: string = this.localStorageService.get('loggedToken') || null;
        if (accessToken) {
            try {
                accessToken = accessToken.split('.')[1];
                infoToken = decodeURIComponent(this.$window.atob(accessToken));
                resultJsonToken = JSON.parse(infoToken);
                roles = resultJsonToken.realm_access.roles;
                tierLevel = roles.find((el) => el.startsWith(this.CommonsConstants.ROLE_CARD_PAT));
                return tierLevel.split(this.CommonsConstants.ROLE_CARD_PAT)[1];
            } catch (error) {
                return tierLevel;
            }
        }
        return tierLevel;
    };

    /**
     * @deprecated Use the one from IbCTokenUtilsService instead
     */
    getUserTypeByToken = (): void => {
        let infoToken = null, resultJsonToken = null, roles: any = null, userType: string = null,
            accessToken: string = this.localStorageService.get('loggedToken') || this.CommonsCookiesService.getCookie('IBERIACOM_SSO_ACCESS');
        if (accessToken) {
            accessToken = accessToken.split('.')[1];
            infoToken = decodeURIComponent(this.$window.atob(accessToken));
            resultJsonToken = JSON.parse(infoToken);
            roles = resultJsonToken.realm_access.roles;
            userType = roles.find((el) => el === this.CommonsConstants.ROLE_IBERIA);
            if (!userType) {
                userType = roles.find((el) => el === this.CommonsConstants.ROLE_IBERIA_PLUS);
            }
            this.$rootScope.userTypeIberia = userType;
            this.CommonsUserUtilsService.setUserRole(userType);
        }
    };

    /**
     * Return the FF number of the user's session
     * This value is collected by three variables in the user's session
     * @deprecated Use the CommonsUserUtilsService.getFrequentFlyer() instead
     * @return {string}
     */
    getFFUser = (): string => {
        const response = this.CommonsUserUtilsService.getFrequentFlyer();
        if (response === 'NOT_FOUND') {
            this.CommonsUserUtilsService.logout();
            this.RedirectionService.redirectToLoginPage(this.$location.absUrl());
        }
        return response;
    };

    /**
     * This functions get the loged codified token from cookies and return user name  decodified.
     * This is neccesary for call service and get information user.
     *  @deprecated Use the IbCTokenUtilsService.getFrequentFlyerFromToken() instead
     *  @returns {string} userName of user logged.
     *  */
    getMemberIdFromCookie = (): string | null => {
        return this.IbCTokenUtilsService.getFrequentFlyerFromToken();
    };
    /**
     * This functions get the loged codified token and return user name  decodified.
     * This is neccesary for call service and get information user.
     * @deprecated Use the IbCTokenUtilsService.getFrequentFlyerFromToken() instead
     *  @returns {String} userName of user logged.
     *  */
    getMemberIdByToken = (): string | null => {
        return this.IbCTokenUtilsService.getFrequentFlyerFromToken();
    };

    /**
     * This functions get the loged user number with the getmemberIdbytoken and
     * if not by the customerData session variable.
     * @deprecated Use the CommonsUserUtilsService.getFrequentFlyer() instead
     * @returns {String} userNumber of user logged.
     *  */
    getMemberId = (): string => {
        return this.CommonsUserUtilsService.getFrequentFlyer();
    };

    private getAlarmsInfo = () => {
        return [
            {
                number: 1,
                params: [
                    '25'
                ]
            },
            {
                number: 5,
                params: [
                    'DEVOLUCIONES DE CORREO',
                    '20/02/2020'
                ]
            },
            {
                number: 7,
                params: []
            }
        ];
    };

    /**
     * @deprecated This is probably not working as expected because telecomAddresses does not exist in members
     * @param dataPerson
     */
    private getTelecomAddresses = (dataPerson: any): any => {
        let telecomAddress: object = {},
            phone: object = null,
            mobile: object = null;
        if (angular.isObject(dataPerson) && angular.isArray(dataPerson.telecomAddresses)) {
            for (let i = 0; i < dataPerson.telecomAddresses.length; i++) {
                const telecom = dataPerson.telecomAddresses[i];
                if (telecom.type === this.CommonsConstants.TELECOM_ADDRESSES.TYPE.PERSONAL && telecom.preferenceIndicator) {
                    switch (telecom.deviceType) {
                            case this.CommonsConstants.TELECOM_ADDRESSES.DEVICE_TYPE.PHONE:
                                phone = telecom;
                                break;
                            case this.CommonsConstants.TELECOM_ADDRESSES.DEVICE_TYPE.MOBILE:
                                mobile = telecom;
                                break;
                            default:
                                break;
                    }
                }
            }

            if (mobile !== null) {
                telecomAddress = mobile;
            } else if (phone !== null) {
                telecomAddress = phone;
            }
        }
        return telecomAddress;
    };

    /**
     * @function getAviosInfo
     * This functions returns the amount according to the type of account
     * @param {object} accountsData
     * @returns {Number} transformedObject
     */
    getAviosInfo = (accountsData) => {
        let isReward0 = false, hasOutstandingLoan = false, totalAvios = null, aviosReward = null, aviosLoan = null, totalReward = null;
        angular.forEach(accountsData, (account) => {
            const type = account.type ?? account.accountType;
            switch (type) {
                    case this.CommonsConstants.ACCOUNT_TYPES.REWARD:
                        aviosReward = account.balance.amount;
                        isReward0 = (aviosReward === 0);
                        break;
                    case this.CommonsConstants.ACCOUNT_TYPES.LOAN:
                        hasOutstandingLoan = ((account.outstandingLoan && account.outstandingLoan.amount && account.outstandingLoan.amount > 0));
                        aviosLoan = hasOutstandingLoan ? -account.outstandingLoan.amount : account.balance.amount;
                        break;
                    case this.CommonsConstants.ACCOUNT_TYPES.TOTAL_REWARD:
                        totalReward = account.balance.amount;
                        break;
                    default:
                        break;
            }
        });
        totalAvios = isReward0 && hasOutstandingLoan ? aviosLoan : Math.max(aviosReward, totalReward);

        return totalAvios;
    };

    /**
     * This functions return model customerData with the model for use in all apps.
     * @param {Array} loginData its Array with thre objects with all data neccesary to generate loggin info.
     * @returns {Object} customerData, its the object neccesary to print all info about user.
     *  */
    getModelCustomerData = (loginData): CustomerDataCommons => {

        const membersData = loginData[0].memberPersonalDetails,
            accountsData = loginData[0].accounts,
            recognitionsLevelData = membersData.schemes,
            partners = loginData[0].partners,
            customerData = {
                generalInfo: {
                    category: recognitionsLevelData[0].recognitionLevel.recognitionLevelIdentifier,
                    avios: this.getAviosInfo(accountsData),
                    aviosTransformed: null,
                    hashEID: null
                },
                personalInfo: {
                    ibPlusNumber: membersData.identifier,
                    name: membersData.person.personName.firstName,
                    surname1: membersData.person.personName.familyName,
                    surname2: membersData.person.personName.secondFamilyName,
                    gender: membersData.person.gender,
                    contactEmail: membersData.person.emailAddress.email,
                    telecomAddresses: this.getTelecomAddresses(membersData.person),
                    alarms: this.getAlarmsInfo() // De donde sacamos esta info
                },
                beneficiaries: {
                    ibPlusNumber: membersData.identifier
                },
                //TENEMOS QUE SABER DE DONDE SACAR ESTA INFO.
                largeFamilyInfo: {
                    category: null,
                    docNumber: null,
                    zipCode: null
                },
                // TENEMOS QUE SABER DE DONDE SACAR ESTA INFO
                residentInfo: {
                    area: -1
                },
                // acceptedTermsAndConditions: membersData.termsAndConditions ? true : false
                acceptedTermsAndConditions: false,
                otherStatuses: {
                    isRedemptionEnabled: membersData.otherStatuses ? membersData.otherStatuses.isRedemptionEnabled : true
                },
                partners: partners
            };
        return customerData;
    };

    /**
     * This functions return model customerData with the model for use in all apps.
     * @param {Array} loginData its Array with thre objects with all data neccesary to generate loggin info.
     * @returns {Object} customerData, its the object neccesary to print all info about user.
     *  */
    getModelIbCustomerData = (loginData) => {

        const personalData = loginData[0];
        const contactData = loginData[1];
        const customerData = {
            generalInfo: {
                hashEID: null
            },
            personalInfo: {
                name: personalData.name,
                surname1: personalData.lastName?.includes('@') ? '' : personalData.lastName,
                gender: personalData.gender,
                contactEmail: contactData.email,
                telecomAddresses: {
                    deviceType: 'MOBILE',
                    type: 'PERSONAL',
                    preferenceIndicator: true,
                    number: contactData.phone.number,
                    countryDiallingCode: contactData.phone.prefix
                },
                alarms: this.getAlarmsInfo() // De donde sacamos esta info
            },
            //TENEMOS QUE SABER DE DONDE SACAR ESTA INFO.
            largeFamilyInfo: {
                category: null,
                docNumber: null,
                zipCode: null
            },
            // TENEMOS QUE SABER DE DONDE SACAR ESTA INFO
            residentInfo: {
                area: -1
            },
            // acceptedTermsAndConditions: membersData.termsAndConditions ? true : false
            acceptedTermsAndConditions: false
        };
        return customerData;
    };

    /**
     * @deprecated Use the IbCUserStoreRepositoryService.logoutUser() instead
     */
    removeLoggedInfo = () => {
        const deleteloggedcookies = () => {
            const expires = new Date('01 Jan 1970 00:00:00 UTC');
            this.$cookies.remove('IBERIACOM_SSO_ACCESS');
            this.$cookies.remove('IBERIACOM_SSO_ACCESS_TO');
            this.$cookies.remove('IBERIACOM_SSO_REFRESH');
            this.$cookies.remove('IBERIACOM_SSO_REFRESH_TO');
            this.$cookies.remove('IBERIACOM_SSO_ONB_ACCESS');
            this.$cookies.remove('IBERIACOM_SSO_ONB_ACCESS_TO');
            this.$cookies.remove('IBERIACOM_SSO_ONB_REFRESH');
            this.$cookies.remove('IBERIACOM_SSO_ONB_REFRESH_TO');
            this.$cookies.remove('IBERIACOM_SSO_INFO');
            this.$cookies.remove('userLogged');
            // Delete also Session storage info
            this.localStorageService.remove('customerData');
            this.localStorageService.remove('customerDataOB');
            /* OB-Compatibility IBPLUS */
            if ($('#loggedUserDefaults').attr('data-inte-integrationHost') !== 'null' && $('#loggedUserDefaults').attr('data-inte-ibplusLogoutURL') !== 'null') { // OB Compatibility IBPLUS
                this.$cookies.put('IBERIACOM_IDENTIFICATION', '', { path: '/', expires });
            }
            if (this.$window.obLogoutXML !== 'null') { // OB Compatibility
                this.$cookies.put('IBERIACOM_SSO_CIP', '', { path: '/', expires });
            }
        };
        deleteloggedcookies();
        this.localStorageService.remove('accessToken');
        this.localStorageService.remove('customerData');
        this.localStorageService.remove('retrieveMemberDetail');
        this.localStorageService.remove('listAccounts');
        this.localStorageService.remove('listSchemesWithTiers');
        this.localStorageService.remove('loggedInfo');
        this.localStorageService.remove('userLoggedBookingInfo');
        this.localStorageService.remove('bookingsList');
        this.localStorageService.remove('loggedToken');
        this.localStorageService.remove('refreshToken');
        this.localStorageService.remove('userLogged');
        this.localStorageService.remove('username');
        this.localStorageService.remove('typeOfCard');
        this.localStorageService.remove('linksList');
        this.localStorageService.remove('memberData');
        this.localStorageService.remove('tierLevel');
        this.localStorageService.remove('benefits');
    };


    getFareIcon = (icon: string): string => {
        const fareIcons = Object.values(this.CommonsConstants.FARE_ICON);
        const found = fareIcons.find((item: any) => item.CASE === icon);
        return found ? found.TYPE : '';
    };

    /**
     * Create hash on SHA256
     * @param {String} str
     * @returns {String} hash.
     */
    sha256 = (str) => {
        const hex = (buffer) => {
            const hexCodes = [];
            const view = new DataView(buffer);
            for (let i = 0; i < view.byteLength; i += 4) {
                // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
                const value = view.getUint32(i);
                // toString(16) will give the hex representation of the number without padding
                const stringValue = value.toString(16);
                // We use concatenation and slice for padding
                const padding = '00000000';
                const paddedValue = (padding + stringValue).slice(-padding.length);
                hexCodes.push(paddedValue);
            }
            // Join all the hex strings into one
            return hexCodes.join('');
        };

        // We transform the string into an arraybuffer.
        const buffer = new TextEncoder().encode(str);
        return crypto.subtle.digest('SHA-256', buffer).then((hash) => {
            return hex(hash);
        });
    };

    fiterTextOptionOnhold = () => {
        const textOnhold = { modalText: '' };
        const OnHoldInfo: any = this.localStorageService.get('onHoldShowInfo') || null;
        if (OnHoldInfo) {
            if (OnHoldInfo.maxFreeTime !== 0 && OnHoldInfo.moreTimePrice === 0) {
                textOnhold.modalText = textOnhold.modalText = this.$filter('translate')('ONHOLD_OPTION_TEXT_FREE');
                textOnhold.modalText = textOnhold.modalText.replace('XXXMAXXXX', OnHoldInfo.holdTimes);
            } else if (OnHoldInfo.maxFreeTime === 0) {
                textOnhold.modalText = this.$filter('translate')('ONHOLD_OPTION_TEXT_PAY');
                textOnhold.modalText = textOnhold.modalText.replace('XXXMAXXXX', OnHoldInfo.holdTimes);
                textOnhold.modalText = textOnhold.modalText.replace('XXX12XXX', OnHoldInfo.minPrice);
            } else {
                textOnhold.modalText = this.$filter('translate')('ONHOLD_OPTION_TEXT_FREE_AND_PAY');
                textOnhold.modalText = textOnhold.modalText.replace('XXX12XXX', OnHoldInfo.minPrice);
                textOnhold.modalText = textOnhold.modalText.replace('XXXMAXXXX', OnHoldInfo.holdTimes.slice(3, 5));
                textOnhold.modalText = textOnhold.modalText.replace('XXXMINXXX', OnHoldInfo.maxFreeTime.toString());
            }
        }
        return textOnhold;
    };

    translateTextAndAddVariable = (textToTranslate: string, variable: any, textToReplace: string) => {
        let transformedtext: string = '';
        if (this.conditionTranslateText(textToTranslate, variable, textToReplace)) {
            transformedtext = this.$filter('translate')(textToTranslate);
            transformedtext = transformedtext.replace(textToReplace, variable);
        }
        return transformedtext;
    };

    private conditionTranslateText = (textToTranslate, variable, textToReplace):boolean => {
        return (textToTranslate && variable && textToReplace);
    };

    translateTextAndAddVariablesArray = (textToTranslate: string, variableList: Array<any>, textToReplaceList: Array<string>) => {
        let transformedtext: string = '';
        if (this.conditionTranslateTextArray(textToTranslate, variableList, textToReplaceList)) {
            transformedtext = this.$filter('translate')(textToTranslate);
            for (let i = 0; i < variableList.length; i++) {
                transformedtext = transformedtext.replace(textToReplaceList[i], variableList[i]);
            }
        }
        return transformedtext;
    };

    private conditionTranslateTextArray = (textToTranslate, variableList, textToReplaceList):boolean => {
        return (textToTranslate && variableList[0] && textToReplaceList[0]);
    };

    setTitlePage = (title: string): void => {
        this.$window.document.title = this.$filter('translate')(title);
    };

    isAvailableLightBox = (): boolean => {
        const onHoldLightBoxShowed = this.localStorageService.get('OnholdLightBoxShowed');
        const activeLightBoxOnHold = this.localStorageService.get('activeLightBoxOnHold');
        const actualStepFlow = this.localStorageService.get('actualStepFlow');
        const flowApp = this.localStorageService.get('flowApp');
        const fareData: CommonsUtilsModels.FareDataModel = this.localStorageService.get('fareData');
        const isRedemptionFlow = this.$rootScope.isRedemptionFlow;
        let toBeShow = false;
        if (fareData && fareData.offers && fareData.offers.length > 0) {
            fareData.offers.forEach((offer) => {
                if (offer.onHoldOptions && offer.onHoldOptions.length > 0) {
                    toBeShow = true;
                }
            });
        }
        return this.$window.innerWidth >= this.CommonsConstants.LIGHTBOX.INNERWIDTH
            && !onHoldLightBoxShowed
            && (activeLightBoxOnHold)
            && (
                actualStepFlow === this.CommonsConstants.STEP_FLOW.PAYMENT ||
                actualStepFlow === this.CommonsConstants.STEP_FLOW.ANCILLARIES
            )
            && flowApp === this.CommonsConstants.APP_TYPES.BOOKING
            && !isRedemptionFlow
            && toBeShow;
    };

    getFormatedDate = (date, format) => {
        const language = this.$rootScope.appLang;
        const commercialData: CommonsCommercialData = this.localStorageService.get('commercialData');
        let formatedDate = null, oldFormattedDate = null;
        let foundedLanguage = false, languageIndex = 0, dateFormatByLanguage = null;
        if (language && commercialData && commercialData.languages) {
            while (!foundedLanguage && languageIndex < commercialData.languages.length) {
                if (commercialData.languages[languageIndex].code === language.toLowerCase()) {
                    dateFormatByLanguage = commercialData.languages[languageIndex].dateFormat[format];
                    foundedLanguage = true;
                }
                languageIndex++;
            }
            oldFormattedDate = foundedLanguage && dateFormatByLanguage ? this.$filter('date')(date, dateFormatByLanguage) : this.$filter('date')(date, commercialData.languages[0].dateFormat.short);
            formatedDate = foundedLanguage && dateFormatByLanguage ? this.$filter('date')(new Date(date), dateFormatByLanguage) : this.$filter('date')(new Date(date), commercialData.languages[0].dateFormat.short);
        } else {
            formatedDate = this.$filter('date')(new Date(date));
            oldFormattedDate = this.$filter('date')(date);
        }
        if (oldFormattedDate !== formatedDate) {
            formatedDate = oldFormattedDate;
        }
        return { formatedDate: formatedDate, dateFormatByLanguage: dateFormatByLanguage };
    };

    /**
     * Checks if an array has the "default option" at his first position
     * @param {*} defaultOption
     * @param {*} array
     */
    hasDefaultOption = (defaultOption, array) => {
        return array[0] === defaultOption;
    };

    /**
     * Returns the market from url
     * @returns {string} - returns an string made from params
     */
    getParameterByName = (name, url?) => {
        if (!url) url = this.$window.location.href;
        name = name.replace(/[\\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return null;
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    };

    /**
         * Returns the value of the first param found
         * @param  {Array<String>} paramsName - An array with the possible names of an URL param
         * @returns {String} - The value of the first param found in the array
         */
    getURLFirstParameterByName = (paramsName: Array<string>) => {
        let paramValue = null, i = 0, countPassenger = null;
        if (angular.isArray(paramsName)) {
            while (paramValue === null && i < paramsName.length) {
                if (angular.isString(paramsName[i])) {
                    if (this.CommonsConstants.BOOKING_PARAMS_NAMES.ADULT.indexOf(paramsName[i]) !== -1 || this.CommonsConstants.BOOKING_PARAMS_NAMES.CHILD.indexOf(paramsName[i]) !== -1 || this.CommonsConstants.BOOKING_PARAMS_NAMES.INFANT.indexOf(paramsName[i]) !== -1 || this.CommonsConstants.BOOKING_PARAMS_NAMES.SENIOR.indexOf(paramsName[i]) !== -1 || this.CommonsConstants.BOOKING_PARAMS_NAMES.YOUNG.indexOf(paramsName[i]) !== -1 || this.CommonsConstants.BOOKING_PARAMS_NAMES.TEENAGER.indexOf(paramsName[i]) !== -1) {
                        countPassenger = countPassenger || 0;
                        if (this.getParameterByName(paramsName[i])) {
                            countPassenger += parseInt(this.getParameterByName(paramsName[i]));
                        }
                    } else {
                        paramValue = this.getParameterByName(paramsName[i]);
                    }
                }
                i++;
            }
            paramValue = countPassenger ? countPassenger : paramValue;
        } else if (angular.isString(paramsName)) {
            paramValue = this.getParameterByName(paramsName);
        }
        return paramValue;
    };
    isDiscountTypePartnerEquivalent = (discountType): boolean => {
        return discountType === this.CommonsConstants.DISCOUNT_TYPE.DUMBO || discountType === this.CommonsConstants.DISCOUNT_TYPE.PLUTO;
    };
    
    getProcess = (): string => {
        const { isShuttleFlow, isRedemptionFlow, userLogged, searchFlightType, flowApp, isHMAD, availabilityType, isPetFlight } = {
            isShuttleFlow: this.localStorageService.get( 'isShuttleFlow' ),
            isRedemptionFlow: this.localStorageService.get( 'isRedemptionFlow' ),
            userLogged: this.localStorageService.get( 'userLogged' ),
            searchFlightType: this.localStorageService.get( 'searchFlightType' ),
            flowApp: this.localStorageService.get( 'flowApp' ),
            isHMAD: this.localStorageService.get( 'isHMAD' ),
            availabilityType: this.localStorageService.get( 'availabilityType' ),
            isPetFlight: this.getURLFirstParameterByName( this.CommonsConstants.BOOKING_PARAMS_NAMES.PETS )
        };
        const flashOffer: string | null = this.getURLFirstParameterByName( this.CommonsConstants.BOOKING_PARAMS_NAMES.IS_FLASH_OFFER );
        const conditions = [
            { check: isShuttleFlow && isRedemptionFlow, process: this.CommonsConstants.PROCESS.SHUTTLE_REDEPMTION },
            { check: isShuttleFlow, process: this.CommonsConstants.PROCESS.SHUTTLE },
            { check: isPetFlight, process: this.CommonsConstants.PROCESS.PETS },
            { check: userLogged === 'ONB' && searchFlightType === 'redemptionFlight', process: this.CommonsConstants.PROCESS.BOOKING_OB_REDEMPTION },
            { check: flowApp === 'BBKIOH', process: this.CommonsConstants.PROCESS.ON_HOLD },
            { check: userLogged === 'ONB', process: this.CommonsConstants.PROCESS.BOOKING_OB },
            { check: searchFlightType === 'redemptionFlight', process: this.CommonsConstants.PROCESS.REDEMPTION },
            { check: searchFlightType === 'metasearchFlight', process: this.CommonsConstants.PROCESS.METASEARCH },
            { check: searchFlightType === 'multiCityFlight' && isHMAD, process: this.CommonsConstants.PROCESS.HMAD_STOP_OVER },
            { check: searchFlightType === 'multiCityFlight', process: this.CommonsConstants.PROCESS.MULTI_TRIP },
            { check: !!flashOffer, process: this.CommonsConstants.PROCESS.FLASH_OFFERS },
            { check: availabilityType === 'SLICE_BY_SLICE', process: this.CommonsConstants.PROCESS.BOOKING_SLICED }
        ];
        const found = conditions.find( c => c.check );
        
        return found ? found.process : this.CommonsConstants.PROCESS.BOOKING;
    };

    getTypeSearch = (isDigitalData?: boolean): string => {
        let typeSearch: string = '';
        const fareType = this.getURLFirstParameterByName(this.CommonsConstants.BOOKING_PARAMS_NAMES.FARE_TYPE);
        const typeSearchConstants = isDigitalData ? this.CommonsConstants.TYPE_SEARCH_DIGITAL_DATA : this.CommonsConstants.TYPE_SEARCH;
        switch (fareType) {
                case 'B': typeSearch = typeSearchConstants.PREMIUM_CABIN; break;
                case 'R': typeSearch = typeSearchConstants.LOW_COST; break;
                case 'N': typeSearch = typeSearchConstants.FLEXIBLE; break;
                case 'E': typeSearch = typeSearchConstants.TURIST; break;
                default:
        }
        return typeSearch;
    };
    checkMayorAge = (year: number | string, month: number | string, day: number | string, mayorAge: number | string = 18): boolean => {
        const toNum = (el: number | string): number => typeof (el) === 'string' ? parseInt(el) : el;

        return new Date(toNum(year) + toNum(mayorAge), toNum(month) - 1, toNum(day)) <= new Date();
    };

    getIdItem = (type: string): string => {
        let idItem: string = '';
        const flowApp = this.localStorageService.get('flowApp');

        switch (flowApp) {
                case this.CommonsConstants.APP_TYPES.CHECKIN:
                    const segmentsInfo: any[] = this.localStorageService.get('segmentsInfo') || [];
                    const ancillariesSlices: any[] = this.localStorageService.get('ancillariesSlices') || [];
                    const arrIdItems: any[] = [];
                    ancillariesSlices.forEach(slice => {
                        const splitId = slice.id.split('_');
                        idItem = '';
                        segmentsInfo.forEach(seg => {
                            if (splitId.length === 2 && splitId[0] === seg?.id) {
                                idItem = `${seg.origin?.code}`;
                            }

                            if (splitId.length === 2 && splitId[1] === seg?.id) {
                                idItem += `-${seg.destination?.code}`;
                            }
                        });
                        arrIdItems.push(idItem);
                    });
                    if (arrIdItems.length > 0) {
                        idItem = arrIdItems.join('|');
                    }

                    break;

                default:
                // BKI and MMB
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
                    break;
        }

        return idItem;
    };

    getBrandItem = (origin: string): string => {
        let brandItem: string = '';
        const selectedTripInfo: any = this.localStorageService.get('selectedTripInfo');
        if (selectedTripInfo) {
            if (selectedTripInfo.length > 1 && origin !== selectedTripInfo[0].origin) {
                brandItem = selectedTripInfo[1].info.segments[0].flight.operationalCarrier.name.toLowerCase();
            } else {
                brandItem = selectedTripInfo[0].info.segments[0].flight.operationalCarrier.name.toLowerCase();
            }
        }
        return brandItem;
    };

    getSpeqsVariant = (type: string): string => {
        switch (type) {
                case this.CommonsConstants.SPEQS_SUBTYPE.SKI_SNOW: return 'ski';
                case this.CommonsConstants.SPEQS_SUBTYPE.BICYCLE: return 'bike';
                case this.CommonsConstants.SPEQS_SUBTYPE.GOLF_EQUIPMENT: return 'golf';
                default: return '';
        }
    };

    convertDateIntoString = (date: Date): string => {
        let day: string, month: string, year: string;
        day = date.getDate().toString();
        day = day.padStart(2, '0');
        month = (date.getMonth() + 1).toString();
        month = month.padStart(2, '0');
        year = date.getFullYear().toString();

        return [day, month, year].join('/');
    };

    getSliceById = (id: string): object => {
        let sliceById: object;
        const ancillariesInfo: any = this.localStorageService.get('ancillariesInfo');
        ancillariesInfo?.slices.forEach(slice => {
            slice?.segmentIds.forEach(segmentId => {
                if (segmentId === id) {
                    sliceById = slice;
                }
            });
        });
        return sliceById;
    };

    checkIsAddToCart = (itemName: string): boolean => {
        let isAddToCart: boolean = false;
        const addToCart: any = this.localStorageService.get('addToCart') || { ecommerce: { items: [] } };
        addToCart.ecommerce.items.forEach(item => {
            if (item.item_name === itemName) {
                isAddToCart = true;
            }
        });
        return isAddToCart;
    };

    /**
     * Get app market
     * @returns {String} The value is app market
     */
    getAppMarket = (): string => {
        return this.$rootScope?.appMarket ? this.$rootScope.appMarket : 'ES';
    };

    /**
     * Get data prefix from market
     * @returns {object} the value is data prefix
     */
    getPrefixFromMarket = (): object => {
        const market: string = this.getAppMarket();
        const phoneCodeList: any = this.localStorageService.get('phoneCodeList');
        const result: any = {
            countryCode: 'ES',
            code: '34'
        };

        if(Array.isArray(phoneCodeList)) {
            phoneCodeList.forEach(prefix => {
                if(prefix.countryCode === market) {
                    result.code = prefix.code;
                    result.countryCode = prefix.countryCode;
                }
            });
        }

        return result;
    };

    getCountryCodeFromPrefix = (prefix: string): string => {
        const phoneCodeList: PrefixResponse[] = this.localStorageService.get('phoneCodeList') || [];
        return (phoneCodeList.find(phoneCode =>
            phoneCode.code === prefix))?.countryCode || '';

    };

    isFlowAppByQuadrigam = (flowApp, ...types:string[]) => {
        return types.includes(flowApp);
    };

    checkSpecificWarningCheckOut = (sliceId) => {
        const reshopConditions: any = this.localStorageService.get('reshopConditions');
        const isActiveDeinvoicing: boolean = this.localStorageService.get('isActiveDeinvoicing');
        return (isActiveDeinvoicing && reshopConditions) ? this.checkGeneralWarningCheckOut(reshopConditions) || this.checkWarningCheckOutBySliceId(reshopConditions, sliceId) : false;
    };

    getDataModalDeinvoicing = () => {
        const changeFlightsCV = this.localStorageService.get('changeFlightsCV');
        const slices = this.localStorageService.get('flightsInfo');
        let flightsSegments = [];
        angular.forEach(changeFlightsCV, (flight) => {
            angular.forEach(slices, (slice) => {
                if(flight.originalSliceId == slice.sliceId && this.checkSpecificWarningCheckOut(slice.sliceId)){
                    flightsSegments.push({
                        'sliceID': slice.sliceId,
                        'operatedBy': slice.flight.operationalCarrier.code,
                        'flightNumber': slice.flight.operationalFlightNumber,
                        'arrivalTerminal':slice.arrivalCity.terminal,
                        'departureTerminal':slice.departureCity.terminal,
                        'departureDateTime': slice.departureDateParsed.dateTime,
                        'departureDateDay': slice.departureDateParsed.day,
                        'departureDateMonth': slice.departureDateParsed.month,
                        'departureDateYear': slice.departureDateParsed.year,
                        'arrivalDateTime': slice.arrivalDateParsed.dateTime,
                        'arrivalDateDay': slice.arrivalDateParsed.day,
                        'arrivalDateMonth': slice.arrivalDateParsed.month,
                        'arrivalDateYear': slice.arrivalDateParsed.year
                            
                    });
                }
            });
        });
        return flightsSegments;
    };

    private checkGeneralWarningCheckOut = (reshopConditions) => {
        const hasCheckoutWarning = (changes) =>
            changes?.enabled &&
            Array.isArray(changes.warnings) &&
            changes.warnings.some(
                (warning) =>
                    warning.code === 'SLICE_WITH_CHECKED_SEGMENT' ||
                    warning.code === 'ORDER_WITH_EARLY_CHECKING_DONE'
            );

        return (
            hasCheckoutWarning(reshopConditions.voluntaryChanges) ||
            hasCheckoutWarning(reshopConditions.involuntaryChanges)
        );
    };

    private hasCheckoutWarningCode = (warning) =>
        warning?.code === 'SLICE_WITH_CHECKED_SEGMENT' ||
        warning?.code === 'ORDER_WITH_EARLY_CHECKING_DONE';

    private hasSliceCheckoutWarning = (changes, sliceId) =>
        changes?.enabled &&
        Array.isArray(changes.slices) &&
        changes.slices.some(
            (slice) =>
                slice?.enabled &&
                slice?.sliceId === sliceId &&
                Array.isArray(slice.warnings) &&
                slice.warnings.some(this.hasCheckoutWarningCode)
        );

    private checkWarningCheckOutBySliceId = (reshopConditions, sliceId) =>
        this.hasSliceCheckoutWarning(reshopConditions?.voluntaryChanges, sliceId) ||
        this.hasSliceCheckoutWarning(reshopConditions?.involuntaryChanges, sliceId);

    checkWarningCheckOut = () => {
        const reshopConditions: any = this.localStorageService.get('reshopConditions');
        return reshopConditions ? this.checkGeneralWarningCheckOut(reshopConditions) || this.checkWarningCheckOutBySlice(reshopConditions) : false;
    };

    private hasAnySliceCheckoutWarning = (changes) =>
        changes?.enabled &&
        Array.isArray(changes.slices) &&
        changes.slices.some(
            (slice) =>
                slice?.enabled &&
                Array.isArray(slice.warnings) &&
                slice.warnings.some(this.hasCheckoutWarningCode)
        );

    private checkWarningCheckOutBySlice = (reshopConditions) =>
        this.hasAnySliceCheckoutWarning(reshopConditions?.voluntaryChanges) ||
        this.hasAnySliceCheckoutWarning(reshopConditions?.involuntaryChanges);
}
