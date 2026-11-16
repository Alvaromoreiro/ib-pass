import { InjectionToken } from "@angular/core";

export const AJSRootScope = new InjectionToken("$rootScope");

export function rootScopeFactory(i: any) {
  return i.get("$rootScope");
}

export const rootScopeProvider = {
  provide: AJSRootScope,
  useFactory: rootScopeFactory,
  deps: ["$injector"],
};

export interface CommonsRootScope extends ng.IRootScopeService {
  defaultImages: DefaultImages[];
  isAvailability: boolean;
  appLang: string;
  appMarket: string;
  routes: RoutesRootScope;
  serviceURI: string;
  hideAdvancedSearch: boolean;
  phonesList: object;
  phonesListIBV: object;
  fullWidth: boolean;
  backGroundImage: string;
  paymentBackgroundImageUrl: string;
  isMobile: any;
  isRedemptionFlow: boolean;
  loginCustomerData: CommonsLoginCustomerData;
  customerData: any;
  isLogged: boolean | "ONB" | null;
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
}

interface TimeSession {
  openedModal: boolean;
  startTime: any;
  failedKeepAliveService: boolean;
  timerActivate: boolean;
}

interface RoutesRootScope {
  icons: string;
  images: string;
  templates: string;
  links: string;
  pdf?: string;
}

interface CommonsLoginCustomerData {
  category: string;
  avios: string;
  ibPlusNumber: string;
  otherStatuses: {
    isRedemptionEnabled: boolean;
  };
}

interface DefaultImages {
  url: string;
  active: boolean;
}

interface GOOGLE_ADS_BANNER_ID {
  TYPE_0: string;
  TYPE_1: string;
  TYPE_2: string;
  TYPE_3: string;
}
