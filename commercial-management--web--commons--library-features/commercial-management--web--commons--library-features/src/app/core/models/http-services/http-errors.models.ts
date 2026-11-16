export type GeneralResponseError = {
  errors: GeneralResponseErrorInfo[];
};

export type GeneralResponseErrorInfo = {
  code: string;
  reason: string;
  timeStamp: string;
  uuid?: unknown | null;
};

export type DefaultResponseError = {
  error: string; // eslint-disable-next-line
  error_description: string;
};

export interface AglResponseError {
  code: string;
  businessMessage: string;
  developerMessage: string;
  developerLink: string;
  childError?: AglResponseError[];
  path?: string;
}

export type ProcessedHttpError = {
  errorCode?: number;
  requestURL?: string;
  errorInfo?: ProcessedHttpErrorInfo[];
};

export type ProcessedHttpErrorInfo = {
  message: string;
  needsTranslate: boolean;
  internalErrorCode: string;
};
