import * as angular from 'angular';
import 'angular-mocks';

import { InitCheckInApp } from './ib-check-in-app';
import { IRootScopeExt } from '@src/app/core/models/generic-models/generic-models';
import { CkiDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service';
import { AJSModalServiceType } from '@src/app/shared/services/ib-modal/ib-modal-service-bridge.service';
import { IComponentUtils } from '@src/components/services/Utils/bridges/ib-component-utils-bridge.service';
import { IbCLinksService } from 'ib-web-commons/app/core/http-services/angular-statics/services/ib-links-service';
import { CommonsGetWcsPhonesService } from 'ib-web-commons/app/core/http-services/wcs/ib-get-wcs-phones-service';
import { DatalayerUtilsService } from 'ib-web-commons/app/core/ib-datalayer/services/ib-datalayer-utils-service';
import { CommonsKeepAliveUtilsService } from 'ib-web-commons/app/core/ib-keep-alive/ib-keep-alive-utils-service';
import { CommonsLanguageAndMarketService } from 'ib-web-commons/app/core/utils/ib-commons-language-and-market-service';
import { TranslateFactoryService } from 'ib-web-commons/utils';
import { MonetateUtilsService } from '@src/app/shared/services/ib-monetate/services/ib-monetate-utils';
import { SecurityOtpService } from 'ib-web-commons/security';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';
import { CheckinFlowService } from '@src/app/shared/services/checkin-flow.service';


// ------------------ MOCKS ------------------
const mockCheckinAppConstants: Partial<CheckinAppConstants> = {
    flowName: 'CHECKIN',
    otpServicesURI: '/otp',
    CHECKIN_FIELDS_LENGTH: {
        PHONE_NUMBER_MAX_LENGTH: 0,
        EMAIL_MAX_LENGTH: 0,
        NUMBER_IB_PLUS_MAX_LENGTH: 0,
        NUMBER_FF_MAX_LENGTH: 0,
        NAME_SURNAME: 0,
        MAX_LENGTH_ZIP_CODE: 0,
        MIN_LENGTH_NAME: 0,
        MAX_LENGTH_NAME: 0,
        MIN_LENGTH_ZIP_CODE_PAYMENT: 0,
        MAX_LENGTH_ZIP_CODE_PAYMENT: 0,
        MAX_LENGTH_SURNAME: 0,
        APIS_DOCUMENT_MAX_LENGTH: 0,
        APIS_DNI_PSTS_MAX_LENGTH: 0,
        ADDRESS_MAX_LENGTH: 0
    },
    CHECKIN_PATTERNS: {
        GROUP_RESERVATION_NAME_PATTERN: undefined,
        NAME_SURNAME_PATTERN: undefined,
        NAME_SURNAME_CLEANER: '',
        EMAIL_PATTERN_OLD: '',
        EMAIL_PATTERN: undefined,
        PHONE_PATTERN_ES: undefined,
        PHONE_PATTERN: undefined,
        PHONE_CLEANER: '',
        CVV_PATTERN: undefined,
        CVV_CLEANER: '',
        CREDIT_CARD_NUMBER_PATTERN: undefined,
        CREDIT_CARD_NUMBER_CLEANER: '',
        CARD_NUMBER_PATTERN: undefined,
        CARD_NUMBER_CLEANER: '',
        DOCS_PATTERN: undefined,
        DOCS_CLEANER: '',
        PNR_PATTERN: undefined,
        PNR_CLEANER: '',
        NUMBER_IB_PLUS_PATTERN: undefined,
        NUMBER_IB_PLUS_CLEANER: '',
        DEEPLINK_PARAMS_DATA_SPLITTER: '',
        GET_PARAMS_AND: '',
        QUERY_START: '',
        QUERY_GLOBAL_MOD: '',
        QUERY_SEPARATOR: '',
        GET_PARAMS_EQUAL: '',
        GET_LANG: undefined,
        GET_MARKET: undefined,
        REMOVE_SURNAME: undefined,
        REMOVE_PNR: undefined
    },
    GOOGLE_ADS_URIS: {
        TYPE_0: '',
        TYPE_1: '',
        TYPE_2: '',
        TYPE_3: ''
    },
    BANNER_IDS: {
        TYPE_0: '',
        TYPE_1: '',
        TYPE_2: '',
        TYPE_3: ''
    },
    servicesURI: '/services',
    iconsRoute: '/icons',
    imagesRoute: '/images',
    METAS: {
        es: {
            'META-TITLE': 'meta',
            'META-AUTHOR': '',
            'META-DESCRIPTION': '',
            'META-KEYWORDS': ''
        },
        ca: undefined,
        de: undefined,
        en: undefined,
        fr: undefined,
        it: undefined,
        ja: undefined,
        nl: undefined,
        pt: undefined,
        ru: undefined,
        zh: undefined
    },
    TOGGLE: {
        isSoftUserHideEnabled: true,
        ocrEnable: false
    },
    WCS: { PHONE_TYPES: {
        SALES: 'SALES',
        IBHOLIDAYS: ''
    } }
};

const mockRouterConstants: Partial<CheckinRouterConstants> = {
    templatesRoute: '/templates'
};

const mockLanguageService: Partial<CommonsLanguageAndMarketService> = {
    init: jasmine.createSpy().and.returnValue({ market: 'ES', language: 'es' })
};
const mockIbUtilsService: Partial<IbUtilsService> = {
    filterMarket: jasmine.createSpy().and.returnValue('ES'),
    getPaymentsBackgroundUrl: jasmine.createSpy().and.returnValue('bg.jpg'),
    getDeviceType: jasmine.createSpy().and.returnValue('desktop')
};

const mockCheckinFlowService: Partial<CheckinFlowService> = {
    backToMain: jasmine.createSpy(),
    iniPhonesList: jasmine.createSpy().and.returnValue([]),
    updatePhonesList: jasmine.createSpy()
};

const mockSessionStorage: Partial<CommonsSessionStorageService> = {
    setPrefix: jasmine.createSpy(),
    set: jasmine.createSpy(),
    remove: jasmine.createSpy()
};

const mockCommonsUtilService: Partial<CommonsUtilService> = {
    isMobile: jasmine.createSpy().and.returnValue(false),
    getParameterByName: jasmine.createSpy().and.returnValue(null)
};

const mockDatalayer: Partial<DatalayerUtilsService> = {
    initializeDatalayer: jasmine.createSpy()
};

const mockCkiDatalayer: Partial<CkiDatalayerUtilsService> = {
    initializeDatalayer: jasmine.createSpy(),
    generateDatalayerDOM: jasmine.createSpy()
};

const mockLinksService: Partial<IbCLinksService> = {
    getLinks: jasmine.createSpy().and.returnValue(Promise.resolve())
};

const mockPhonesService: Partial<CommonsGetWcsPhonesService> = {
    getPhoneByCode: jasmine.createSpy().and.returnValue(Promise.resolve())
};

const mockTranslateFactory: Partial<TranslateFactoryService> = {
    setLanguage: jasmine.createSpy()
};

const mockKeepAlive: Partial<CommonsKeepAliveUtilsService> = {
    initKeepAlive: jasmine.createSpy()
};

const mockAddOn: Partial<AddOnService> = {
    initAddOn: jasmine.createSpy()
};

const mockMonetate: Partial<MonetateUtilsService> = {
    initializeMonetate: jasmine.createSpy()
};

const mockComponentUtils: Partial<IComponentUtils> = {
    resizeHeightListElements: jasmine.createSpy()
};

const mockOcLazyLoad = {
    load: jasmine.createSpy()
};

const mockTranslate :Partial<angular.translate.ITranslateService> = {
    use: jasmine.createSpy()
};

const mockSecurityOtpService: Partial<SecurityOtpService> = {
    initialize: jasmine.createSpy()
};

const mockWindow: Partial<ng.IWindowService> = {
    location: {
        pathname: '/test',
        search: '',
        ancestorOrigins: undefined,
        hash: '',
        host: '',
        hostname: '',
        href: 'http://localhost:9006/',
        origin: '',
        port: '',
        protocol: '',
        assign: function (url: string | URL): void {
            throw new Error('Function not implemented.');
        },
        reload: function (): void {
            throw new Error('Function not implemented.');
        },
        replace: function (url: string | URL): void {
            throw new Error('Function not implemented.');
        }
    }
};
const CommonsAncillariesService: Partial<CommonsAncillariesService> = {};
const ModalService: Partial<AJSModalServiceType> = {};

const getInstance = ($rootScope: IRootScopeExt) => new InitCheckInApp(
    $rootScope,
    mockWindow as ng.IWindowService,
    mockTranslate as angular.translate.ITranslateService,
    mockOcLazyLoad,
    mockRouterConstants as CheckinRouterConstants,
    mockLanguageService as CommonsLanguageAndMarketService,
    mockCheckinAppConstants as CheckinAppConstants,
    mockComponentUtils as IComponentUtils,
    mockAddOn as AddOnService,
    mockDatalayer as DatalayerUtilsService,
    mockCkiDatalayer as CkiDatalayerUtilsService,
    mockLinksService as IbCLinksService,
    mockMonetate as MonetateUtilsService,
    mockPhonesService as CommonsGetWcsPhonesService,
    mockKeepAlive as CommonsKeepAliveUtilsService,
    mockTranslateFactory as TranslateFactoryService,
    mockSessionStorage as CommonsSessionStorageService,
    mockCommonsUtilService as CommonsUtilService,
    CommonsAncillariesService as CommonsAncillariesService,
    ModalService as AJSModalServiceType,
    mockSecurityOtpService as SecurityOtpService,
    mockIbUtilsService as IbUtilsService,
    mockCheckinFlowService as CheckinFlowService
);


describe('Test InitCheckInApp', () => {

    let $rootScope: IRootScopeExt;
    let instance: InitCheckInApp;

    beforeEach(inject((_$rootScope_) => {
        $rootScope = _$rootScope_;
    }));

    beforeEach(() => {
        instance = getInstance($rootScope);
    });

    it('should delegate backToMainRoot to CheckinFlowService', () => {
        instance['onBackToMainRoot']({} as ng.IAngularEvent, true);

        expect(mockCheckinFlowService.backToMain).toHaveBeenCalledWith(true);
    });

    it('should initialize language and market', async () => {
        await instance.activate();

        expect($rootScope.appLang).toBe('es');
        expect($rootScope.appMarket).toBe('ES');
        expect(mockTranslate.use).toHaveBeenCalledWith('es');
        expect(mockTranslateFactory.setLanguage).toHaveBeenCalledWith('es');
    });

    it('should initialize business constants', async () => {
        await instance.activate();

        expect($rootScope.flowName).toBe('CHECKIN');
        expect($rootScope.serviceURI).toBe('/services');
    });

    it('should initialize routes', async () => {
        await instance.activate();

        expect($rootScope.routes.templates).toBe('/templates');
    });

    it('should initialize datalayer services', async () => {
        await instance.activate();

        expect(mockDatalayer.initializeDatalayer).toHaveBeenCalled();
        expect(mockCkiDatalayer.initializeDatalayer).toHaveBeenCalled();
    });

    it('should not prevent route change if no MD/PaRes', () => {
        const event = { preventDefault: jasmine.createSpy() };

        instance['onRouteChangeStart'](event);

        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should prevent route change and clean URL if MD and PaRes exist', () => {

        const event = { preventDefault: jasmine.createSpy() };

        mockWindow.location.href = 'http://localhost:9006/?language=es&market=es&MD=true&PaRes=true#!/test';

        instance['onRouteChangeStart'](event);

        expect(event.preventDefault).toHaveBeenCalled();
    });

});