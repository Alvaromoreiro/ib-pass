namespace CommonsShortRegisterNamespace {
  export type IShortForm = {
    email: string;
    password: string;
  };
  export type CommonsShortSimpleRegisterModel = {
    email: string;
    password: string;
    name?: string;
    lastName?: string;
    phone?: {
      prefix: string;
      number: string;
    };
    magazine?: boolean;
  };

  export type CommonsShortSimpleFormRegisterModel = {
    email: string;
    password: string;
    name: string;
    lastName: string;
    phone: {
      prefix: string;
      number: string;
    };
    magazine: boolean;
  };
}
