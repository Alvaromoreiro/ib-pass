namespace UiComponentsModel {
  export type FlightCardComponentFlightInfo = {
    flightData: {
      type: string;
    };
  };
  export type StepInfoUiComponent = {
    name: string;
    isActive: boolean;
  };
  export interface DateRangePickerScope extends angular.IScope {
    ibUiDaterangepickerCtrl: {
      model: {
        isopenDateGone: boolean;
        clickInput: boolean;
        keypressClose: boolean;
        isopenDateReturn: boolean;
        dateOptions: {
          numberOfMonths: number;
        };
        dateOptionsStart: {
          numberOfMonths: number;
        };
        dateOptionsEnd: {
          numberOfMonths: number;
        };
        iStart: number;
        iEnd: number;
        textFormat: string;
      };
    };
  }
  export interface DatePickerFunction extends JQuery<HTMLElement> {
    datepicker?: Function;
  }
  export type DataRangePickerModel = {
    newDate: {
      date: Date;
      day: string;
      month: string;
      year: string;
    };
    iStart: number;
    iEnd: number;
    isopenDateGone: boolean;
    isopenDateReturn: boolean;
    inputDateGone: string;
    inputDateReturn: string;
    lang: string;
    textFormat: string;
    afterUpdate: boolean;
    whatTime: boolean;
    focusedStart: boolean;
    focusedReturn: boolean;
    todayDate: string;
    dataHourRestriction: number;
    dataHour?: number;
    dateRestriction: Date;
    datePattern: string;
    keypressClose: boolean;
    clickInput: boolean;
    dateOptions: {
      changeYear: boolean;
      changeMonth: boolean;
      minDate: number;
      maxDate: number;
      numberOfMonths: number;
      dateFormat: string;
      firstDay: number;
      hideIfNoPrevNext: boolean;
      stepMonths: number;
    };
    validation: {
      required: string;
      pattern: string;
      minValid: string;
      maxValid: string;
      restrictionValid: string;
    };
    dateOptionsStart?: {};
    dateOptionsEnd?: {};
  };
  export type DataRangePickerDateCalendar = {
    minDateRange?: number;
    maxDateRange?: number;
  };

  export type DataRangePickerInputDate = {
    selectedOutbondDate?: Date;
    selectedReturnDate?: Date;
  };
  export interface Dolar extends JQueryStatic {
    datepicker?: {
      setDefaults?: Function;
      regional?: string[];
    };
  }
  export type SummaryFareTrip = {
    name: string;
  };
  export type Image = {
    title?: string;
    url?: string;
    defaultUrl?: string;
  };
}
