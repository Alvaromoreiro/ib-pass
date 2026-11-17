import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PassengerAdultChild } from '@src/app/core/models/ib-checkin-apis/ib-checkin-apis.model';
import {
    CheckinAppConstants,
    TravelAgencyQueryParameter
} from '@src/components/routing/ib-check-in-constants';
import { CommonsSessionStorageService, downgradeToAJSService, AJSRootScope } from 'ib-web-commons/utils';
import { BookingStorageKey, GenericStorageKey } from '@src/app/core/constants/ib-storage-keys.constants';
import { AJSWindow } from '@src/app/core/config/ib-checkin-app-tokens';

export interface AirlineLogo {
    companyURL: string;
    companyDisabledURL: string;
}

export interface AirlineLogoConfig {
    iataCompanyCode: string;
    url: string;
}

export interface PhoneCode {
    countryCode: string;
    code: string;
}

export interface MarketPrefix {
    countryCode: string;
    code: string;
}

export interface QueryParameterLookup {
    name: string;
}

function isObjectRecord (value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

enum DeviceType {
    DESKTOP = 'desktop',
    TABLET = 'tablet',
    MOBILE = 'mobile'
}


@Injectable({
    providedIn: 'root'
})
export class IbUtilsService {
    private static readonly DEVICE_BREAKPOINTS = {
        TABLET: 480,
        DESKTOP: 1024
    };

    constructor (
        @Inject(DOCUMENT) private readonly document: Document,
        @Inject(AJSWindow) private $window: ng.IWindowService,
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        private TranslateService: TranslateService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) { }

    setTitlePage (title, time = 0) {
        setTimeout(() => {
            this.$window.document.title = this.TranslateService.instant(title);
        }, time);
    }

    getPassengerType (passengerId: string): PassengerAdultChild {
        let cachedInfo: any = this.CommonsSessionStorageService.get(BookingStorageKey.bookingInfo);
        const passengerType: PassengerAdultChild = cachedInfo.passengers.find(passenger => passengerId === passenger.id)?.type || CheckinAppConstants.PASSENGERS_TYPES.ADULT;
        return passengerType || CheckinAppConstants.PASSENGERS_TYPES.ADULT as 'ADULT';
    }

    isResolutionToMobile (innerWidth: number = 768): boolean {
        return this.$window.innerWidth < innerWidth;
    }

    /**
     * Returns the value for the html metatag given.
     * @param {string} metaTagName - The metatag name for get the value
     * @returns {string} - The metatag value for the given metaTagName
     */
    getMetaTagValueByName (metaTagName: string): string {
        if (!metaTagName) {
            return '';
        }

        const element = this.document.getElementsByName(metaTagName).item(0);

        return element?.getAttribute('content') ?? '';
    }

    /**
     * Generates a query string parameter containing the application build number.
     *
     * @returns The build number query string when available; otherwise, an empty string.
     */
    generateBuildNumberQueryString (): string {
        const buildNumber = this.getMetaTagValueByName(GenericStorageKey.buildNumber);

        return buildNumber ? `?buildNumber=${encodeURIComponent(buildNumber)}` : '';
    }

    getParameterByName ({ name }: QueryParameterLookup): string | null {
        const targetUrl = this.$window.location.href;
        const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const results = new RegExp(`[?&]${escapedName}(=([^&#]*)|&|#|$)`, 'gi').exec(targetUrl);

        if (!results) {
            return null;
        }

        const value = results[2];

        if (!value) {
            return '';
        }

        const decodedValue = name !== 'code' ? value.replace(/\+/g, ' ') : value;

        return decodeURIComponent(decodedValue);
    }

    getTravelAgencies (name: TravelAgencyQueryParameter): boolean | null {
        const travelAgencies = this.getParameterByName({ name });

        return travelAgencies === null ? null : travelAgencies.toLowerCase() === 'true';
    }

    generatePassengersQueryString (passengersId: readonly unknown[] | null = []): string {
        const passengers = passengersId ?? [];

        if (passengers.length === 0) {
            return '';
        }

        const queryString = passengers.map(id => `passengerId=${String(id)}`).join('&');

        return `?${queryString}`;
    }

    cleanSpaces (value: string): string {
        return value.replace(/^\s+|\s+$/gm, '');
    }

    goIbCose = (): void => {
        this.$window.location.href = this.$window.location.pathname + this.$window.location.search;
    };

    removeParameterURL (url: string): string {
        return url.replace('paymentStatus=OK', '').replace('paymentStatus=KO', '');
    }

    filterMarket (market: string): string {
        const charsMarket = market.substring(0, 2);

        return /^[A-Za-z]+$/.test(charsMarket) ? charsMarket : market;
    }

    generateQueryString (params: unknown): string {
        if (!isObjectRecord(params)) {
            return '';
        }

        const queryParts: string[] = [];
        const passengerIds = params.passengersId;

        if (Array.isArray(passengerIds) && passengerIds.length > 0) {
            const passengersQueryString = this.generatePassengersQueryString(passengerIds);
            queryParts.push(passengersQueryString.substring(1));
        }

        const additionalQueryString = this.generateAdditionalQueryString(params);

        if (additionalQueryString) {
            queryParts.push(additionalQueryString);
        }

        const queryString = queryParts.join('&');

        return queryString ? `?${queryString}` : '';
    }

    private generateAdditionalQueryString (params: Record<string, unknown>): string {
        const queryParts: string[] = [];

        for (const key in params) {
            if (key !== 'passengersId') {
                queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`);
            }
        }

        return queryParts.join('&');
    }

    /**
     * Return the company logo url in the project.
     * @param {String} companyCode -The company code
     * @returns {String} - the company logo url that matches with its company code in the data on localStorage
     */
    getAirlineLogos (airlineCode?: string | null): AirlineLogo {
        const airlinesLogos = this.CommonsSessionStorageService.get<AirlineLogoConfig[]>('airlinesList') ?? [];

        const airlineLogo: AirlineLogo = {
            companyURL: `${CheckinAppConstants.aerolinesLogoUrl}logo_pos_generico.svg`,
            companyDisabledURL: `${CheckinAppConstants.aerolinesLogoUrl}logo_desact_generico.svg`
        };

        if (!airlineCode) {
            return airlineLogo;
        }

        for (const airline of airlinesLogos) {
            const [iataCompanyCode, status] = airline.iataCompanyCode.split('-');

            if (iataCompanyCode === airlineCode) {
                const logoUrl = `${CheckinAppConstants.aerolinesLogoUrl}${airline.url}`;

                if (status === 'dis') {
                    airlineLogo.companyDisabledURL = logoUrl;
                } else {
                    airlineLogo.companyURL = logoUrl;
                }
            }
        }

        return airlineLogo;
    }

    /**
     * Devuelve la URL del fondo de pagos según el ancho de la pantalla.
     */
    getPaymentsBackgroundUrl (): string {
        const getUrl = (width: 320 | 768 | 2000) => `/background/generico/disponibilidad_default_${width}.jpg`;
        const screenWidth = this.$window.innerWidth;
        let backgroundWidth: 320 | 768 | 2000 = 2000;

        if (screenWidth > 1024) {
            backgroundWidth = 2000;
        } else if (screenWidth > 480) {
            backgroundWidth = 768;
        } else {
            backgroundWidth = 320;
        }

        return getUrl(backgroundWidth);
    }

    getDeviceType (): DeviceType {
        const channel = this.CommonsSessionStorageService.get('channel');
    
        if (this.isMobileChannel(channel)) {
            return DeviceType.MOBILE;
        }
    
        return this.getDeviceTypeByWidth(this.$window.innerWidth);
    }
    
    private isMobileChannel (channel: unknown): boolean {
        return channel === 'mobi';
    }
    
    private getDeviceTypeByWidth (width: number): DeviceType {
        const { DESKTOP, TABLET } = IbUtilsService.DEVICE_BREAKPOINTS;
        if (width >= DESKTOP) {
            return DeviceType.DESKTOP;
        }
    
        if (width > TABLET) {
            return DeviceType.TABLET;
        }
    
        return DeviceType.MOBILE;
    }    
    
    Base64Decode (base64: string, utf8decode = false): string {
        const binaryText = this.$window.atob(base64);

        return utf8decode
            ? this.decodeUtf8Binary(binaryText)
            : binaryText;
    }

    private decodeUtf8Binary (binaryText: string): string {
        const bytes = new Uint8Array(binaryText.length);

        for (let index = 0; index < binaryText.length; index++) {
            bytes[index] = binaryText.charCodeAt(index);
        }

        return new TextDecoder('utf-8').decode(bytes);
    }

    getAppMarket () {
        return this.$rootScope?.appMarket ? this.$rootScope.appMarket : 'ES';
    }
    
    getAppLang () {
        return this.$rootScope?.appLang ? this.$rootScope.appLang : 'es';
    }
    
    getPrefixFromMarket (): MarketPrefix {
        const DEFAULT_PREFIX: MarketPrefix = {
            countryCode: 'ES',
            code: '34'
        };

        const market = this.getAppMarket();
        const phoneCodeList = this.CommonsSessionStorageService.get('phoneCodeList');

        if (!Array.isArray(phoneCodeList)) {
            return DEFAULT_PREFIX;
        }

        const prefix = (phoneCodeList as PhoneCode[]).find(
            ({ countryCode }) => countryCode === market
        );

        return prefix
            ? { countryCode: prefix.countryCode, code: prefix.code }
            : DEFAULT_PREFIX;
    }

    getBpSubscriptionMode (): boolean {
        const bookingInfo: CkiBookingInfo.BookingInfo = this.CommonsSessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO);

        return bookingInfo?.subscriptionEnabled ?? false;
    }

    isCC (): boolean {
        const bookingInfo: CkiBookingInfo.BookingInfo = this.CommonsSessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO);

        return bookingInfo?.carrierConnectEnabled ?? false;
    }
}

downgradeToAJSService('IbUtilsService', IbUtilsService, 'ib-shared-services-module');
