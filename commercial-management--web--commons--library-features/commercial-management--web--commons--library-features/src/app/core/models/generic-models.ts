// eslint-disable-next-line @typescript-eslint/ban-types
interface FunctionDecorator extends Omit<Function, 'name'> {
    name?: string;
}
// @ts-ignore
interface FunctionDecoratorFilter extends Omit<ng.IFilterFunction, "name"> {
  name?: string;
}

interface PipeTransformStatic {
  new (...args: any[]): PipeTransform;
}

interface PipeTransform {
  transform(value: any, ...args: any[]): any;
}
interface ScopeDigest extends ng.IScope {
  $$postDigest: any;
}
interface CommonsRootScope extends ng.IRootScopeService {
    defaultImages: defaultImages[];
    isAvailability: boolean;
    appLang: string;
    appMarket: string;
    routes: RoutesRootScope;
    serviceURI: string;
    hideAdvancedSearch: boolean;
    phonesList: object;
    phonesListIBV: object;
    fullWidth: boolean;
    isFixed?: boolean;
    backGroundImage: string;
    paymentBackgroundImageUrl: string;
    isMobile: any;
    isRedemptionFlow: boolean;
    loginCustomerData: CommonsLoginNamespace.CommonsLoginCustomerData;
    customerData: CustomerDataCommons;
    isLogged: any;
    keepAlive?: any;
    flowName?: string;
    timeSession?: TimeSession;
    keepAliveRefreshFlow?: boolean;
    membershipData?: any;
    appMarketDescription?: any;
    categoryCard?: string;
    patterns?: any;
    lengthPatterns?: any;
    menuView?: boolean;
    production?: string;
    userTypeIberia?: string | null;
    generateDatalayerDOM?: any;
    generateDigitalDataDOM?: any;
    googleMapURI?: string;
    GOOGLE_ADS_URIS?: GOOGLE_ADS_BANNER_ID;
    BANNER_IDS?: GOOGLE_ADS_BANNER_ID;
    closeSession: () => void;
    isPointsOBFlow?: boolean;
    block?: boolean;
    isShuttleFlow: boolean;
    showMainHeader?: boolean;
    showHeaders: boolean;
    pmtPatterns: any;
    rootScope: boolean;
    loadedLinks?: boolean;
}

interface GOOGLE_ADS_BANNER_ID {
  TYPE_0: string;
  TYPE_1: string;
  TYPE_2: string;
  TYPE_3: string;
}

type defaultImages = {
  url: string;
  active: boolean;
};

type RoutesRootScope = {
  icons: string;
  images: string;
  templates: string;
  links: string;
  pdf?: string;
};

type CustomerDataCommons = {
  personalInfo?: personalInfo;
  generalInfo?: generalInfo;
  beneficiaries?: beneficiariesInfo;
  largeFamilyInfo?: largeFamilyInfo;
  residentInfo?: residentInfo;
  acceptedTermsAndConditions?: boolean;
  otherStatuses?: otherStatusesInfo;
  partners?: partnersInfo[];
};

type personalInfo = {
  ibPlusNumber?: string;
  name?: string;
  surname1?: string;
  surname2?: string;
  gender?: string;
  email?: string;
  partnersInfoBKI?: Array<partnerDiscountInfoBKI>;
  applyPartersDiscounts?: boolean;
  contactEmail?: string;
  telecomAddresses: Record<string, any>;
  alarms: AlarmsInfo[];
  dumboInfo?: {
    percentDiscount: string;
    voucherId: string;
  };
};

type AlarmsInfo = {
  number: number;
  params: string[];
};

type partnerDiscountInfoBKI = {
  partnerIdentifier: string;
  percentDiscount: number;
  productDescription: string;
  userTier: string;
  isSelected: boolean;
  userMustFly?: boolean;
};
type discountAppliedResponse = {
  type: string;
  percentDiscount: number;
  totalDiscount: number;
  description: string;
  discountType: string;
  corporateCodes?: string;
  partner?: discountAppliedResponsePartner;
  userMustFly?: boolean;
  discountCode?: string;
};
type discountAppliedResponsePartner = {
  partnerId: string;
  productId: string;
};

type generalInfo = {
  name?: string;
  surname?: string;
  avios?: string;
  ibPlusNumber?: string;
  category?: string;
  pinStatus?: string;
  lockStatus?: string;
  loginAttempts?: number;
  hasElectronicId?: boolean;
  secretQuestionCode?: string;
  program?: string;
  aviosTransformed?: string;
  hashEID?: string;
};

type beneficiariesInfo = {
  ibPlusNumber?: string;
};

type largeFamilyInfo = {
  category?: string;
  docNumber?: string;
  zipCode?: string;
};

type residentInfo = {
  area?: number;
};

type otherStatusesInfo = {
  isRedemptionEnabled?: boolean;
};

type partnersInfo = {
  partnerIdentifier?: string;
  partnerName?: string;
  type?: string;
  partnerProduct?: partnerProductInfo;
};

type partnerProductInfo = {
  identifier?: string;
  productName?: string;
  percentDiscount?: number;
  productDescription?: string;
  productTier?: string;
  startDate?: string;
  priority?: string;
  userMustFly: boolean;
};

type commercialData = {
  currency: {
    groupingSeparator?: string;
  };
  dumboInfo?: {
    bonusCode: string;
    bonusDiscount: string;
    bonusText: string;
    bonusTier: string;
  };
};

type CommonsCommercialData = {
  currency: Currency;
  languages: Language[];
  market: Market;
  marketFlags: MarketFlags;
  sessionTimeLifeInMinutes: number;
  maxSearchTime: number;
  minSearchTime: number;
  passengerTypes: PassengerType[];
  discounts: CommercialDiscount[];
  defaultValues: DefaultValues;
  roundingPolicy: string;
  availabilityPriceShowPolicy: string;
  mainCities: MainCities;
};
type DateFormat = {
  long: string;
  medium: string;
  short: string;
};

type Language = {
  dateFormat: DateFormat;
  code: string;
  description: string;
};

type Market = {
  code: string;
  description: string;
};

type MarketFlags = {
  allowedNameCorrection: boolean;
  allowedAncillaries: boolean;
  allowedFlightChange: boolean;
  allowedRefund: boolean;
  allowedCashAndAviosWithVoucher: boolean;
};

type PassengerType = {
  passengerType: string;
  description: string;
};

type CommercialDataCity = {
  code: string;
  description: string;
  countryCode: string;
  countryDescription?: any;
  timezone: string;
  gaCode: number;
  arCode: number;
  saCode: number;
  latitude: number;
  longitude: number;
};
type CommercialDiscount = {
  code: string;
  description: string;
  countries: string[];
  cities: CommercialDataCity[];
  relatedField: string;
  type: string;
};

type DefaultPaxTypeNumber = {
  passengerType: string;
  number: number;
};

type DefaultPhonePrefix = {
  code: string;
  description: string;
  countryCode: string;
};

type DefaultValues = {
  defaultPaxType: string;
  defaultPaxTypeNumbers: DefaultPaxTypeNumber[];
  maxPaxNumber: number;
  defaultPhonePrefix: DefaultPhonePrefix;
};
type Normal = {
  code: string;
  description: string;
  timezone: string;
  country: Country;
};

type Redemption = {
  code: string;
  description: string;
  timezone: string;
  country: Country;
};
type Country = {
  code: string;
  description: string;
};
type MainCities = {
  normal: Normal;
  redemption: Redemption;
};
type Currency = {
    code: string;
    description: string;
    symbol: string;
    alignment: string;
    groupingSeparator: string;
    decimalSeparator: string;
    decimals: number;
    recommendedDisplay: string;
    roundingPolicy?: string;
};
type TimeSession = {
  openedModal: boolean;
  startTime: any;
  failedKeepAliveService: boolean;
  timerActivate: boolean;
  closeModalTimeWaiting?: boolean;
};
type AngularJSComponent = {
  bindings?: Record<string, string>;
  controllerAs?: string;
  templateUrl: any[];
  controller: any;
};
type LocalDiscountConfig = {
  type: string;
  name: string;
  subname?: string;
  items: {
    description: string;
    value: string;
  }[];
};
type AreasStorage = {
  data: any;
  locale: string;
};
