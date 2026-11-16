namespace IbUiSearchBoxComponentModel {
  export type amountEvent = {
    onblur: boolean;
    dynamicPrice: string;
    keydown: boolean;
    focused: boolean;
    customPrice: number;
    dynamicError: boolean;
    importError: boolean;
  };

  export type Model = {
    catalog: any;
    filters: {
      origin: string;
      destination: string;
      //dates: string;
      price: number;
    };
  };

  export type DateCalendar = {
    outboundDate: Date;
    returnDate: Date;
  };
}
