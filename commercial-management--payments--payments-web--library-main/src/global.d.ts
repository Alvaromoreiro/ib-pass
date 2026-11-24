declare type CommonsGenericProxy = import('ib-web-commons').CommonsGenericProxy;
declare type CommonsRootScope = import('ib-web-commons').CommonsRootScope;
declare type DatalayerUtilsService = import('ib-web-commons').DatalayerUtilsService;
declare type CommonsHttpUtilsErrorService = import('ib-web-commons').CommonsHttpUtilsErrorService;
declare type CommonsUtilService = import('ib-web-commons').CommonsUtilService;
declare type RedirectionService = import('ib-web-commons').RedirectionService;
declare type DatalayerConstantsType = import('ib-web-commons').DatalayerConstantsType;
declare type CommonsUserUtilsService = import('ib-web-commons').CommonsUserUtilsService;
declare type PmtConstants = import('./app/core/ib-pmt-constants').PmtConstants;
declare type DatalayerGeneralConstantsType = import('ib-web-commons').DatalayerGeneralConstantsType;
declare type DatalayerBKIConstantsType = import('ib-web-commons').DatalayerBKIConstantsType;
declare type CommonsConstantsType = import('ib-web-commons').CommonsConstantsType;
declare type CurrencyService = import('ib-web-commons').CurrencyService;

interface Window {
    dataLayer: any[];
}
