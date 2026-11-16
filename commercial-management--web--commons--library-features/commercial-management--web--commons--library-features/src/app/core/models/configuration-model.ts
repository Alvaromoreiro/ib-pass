namespace CommonsServiceTypes {
  export type CommonsProxyResponse<T = any> = {
    data?: T;
    code?: number;
    status?: any;
    access_token?: string;
    active?: boolean;
  };
  export type CommonsErrorProxyResponse<T = any> = {
    data?: T;
    errorCode?: any;
    status?: any;
    config?: any;
    requestURL?: string;
  };

  export type CommonsResponseAncillariesService = {
    message: string;
    errorCode?: number;
    internalErrorCode: string;
  };
  export type CommonsErrorResponseAncillariesService = {
    errorCode?: number;
    data: {
      errors: {
        reason: string;
        code: string;
      };
    };
  };
}
namespace CommonsErrorModels {
  export type GenericError = {
    errorCode: number;
    message: string;
    needsTranslate: boolean;
    internalErrorCode: string;
    originalError: any;
  };
}
