export type IbDatalayerInitModel = {
  language: string;
  market: string;
  deviceType: string;
};

export type IbDatalayerEvent = Record<string, string | number | boolean> & {
  eventCategory: string;
  eventAction: string;
  eventLabel: string;
  eventName: string;
};

export type IbDatalayerErrorEvent = {
  errorCode?: number;
  quadrigam?: string;
  isLogged?: string;
  internalErrorCode?: string;
  message?: string;
  eventCategory?: string;
  eventAction?: string;
  eventLabel?: string;
};

export type IbDatalayerModalInfo = {
  idModal?: string;
};

export type IbDatalayerUserInfo = {
  avios?: string | number | null;
  email?: string;
  hashEID?: string;
  category?: string;
};
