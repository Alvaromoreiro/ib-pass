namespace CommonsLoginNamespace {
  export type CommonsLoginAuthResponse = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_expires_in: number;
  };
  export type CommonsLoginCustomerData = {
    category: string;
    avios: string;
    ibPlusNumber: string;
    otherStatuses: {
      isRedemptionEnabled: boolean;
    };
  };
  export type CommonsLoginError = {
    originalError: {
      data: {
        error: string;
      };
    };
    message: string;
    stateUserLogged: boolean;
    needsTranslate: boolean;
  };
  export type LoginFailureWCSData = {
    type: string;
    payload:
      | undefined
      | "parental-control"
      | "general"
      | "password-grant"
      | "repeated-email"
      | "store-session";
  };
}
