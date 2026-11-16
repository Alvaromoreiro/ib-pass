namespace CommonsModalsModels {
  export type FilterData = {
    cabinType: {
      description: string;
      value: string;
      enable: string;
    };
    avios?: {
      value: string;
      enable: boolean;
    };
    price?: {
      initFormatValue: string;
      endFormatValue: string;
      value: string[];
      enable: boolean;
    };
    departureHours?: {
      description: {
        min: string;
        max: string;
      };
      value: string[];
      enable: boolean;
    };
    arrivalHours?: {
      description: {
        min: string;
        max: string;
      };
      value: string[];
      enable: boolean;
    };
    stopsNumber1?: string;
    stopsNumber2?: string;
    stopsNumber3?: string;
  };

  export type ModalObject = {
    animation: boolean;
    templateUrl: string;
    controller: any;
    controllerAs: string;
    size?: string;
    windowClass: string;
    resolve: {
      object: () => object;
    };
    windowTemplateUrl?: string;
    backdrop?: string;
    keyboard?: boolean;
  };

  export type ModalObjectComponent = {
    animation: boolean;
    component: string;
    size?: string;
    windowClass: string;
    resolve: {
      object: () => Record<string, any>;
    };
    windowTemplateUrl?: string;
    backdrop?: string;
    keyboard?: boolean;
  };

  export type GenericComponentModalModel = {
    showCloseButton?: boolean;
    showHeader?: boolean;
    showCancelButton?: boolean;
    dismissOnCancel?: boolean;
    title?: string;
    titleTranslateParams?: Record<string, string>;
    subtitle?: string;
    body?: string;
    extraBody?: string;
    accept?: string;
    cancel?: string;
    isUpgradingBids?: boolean;
  };

  export type BackMainHeaderModalModel = {
    header: {
      title: string;
      subtitle?: string;
      btn: {
        close: {
          text: string;
          title: string;
        };
      };
    };
    body: {
      text: string;
    };
    btn: {
      accept: {
        text: string;
        title: string;
      };
      close: {
        text: string;
        title: string;
      };
    };
  };

  export type GenericErrorComponentModalModel = {
    needsTranslate?: boolean;
    hideClose?: boolean;
    hideFooter?: boolean;
    title?: string | CommonsErrorsModel.CommonsErrorMessageList;
    message?: string;
    messageList?: CommonsErrorsModel.CommonsErrorMessageList[];
    internalErrorCode?: string;
    redirect?: string;
  } & Partial<CommonsErrorsModel.CommonsErrorsResponseGeneral>;
}
