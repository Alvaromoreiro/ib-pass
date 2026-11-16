
export type SeekerTripOption = {
    description: string;
    code: number;
};
export type SeekerCitiesModel = {
    listGroups: string[];
    listCities: SeekerCityModel[];
};
export type SeekerAreasModel = {
    cities: SeekerCitiesModel;
    origin: SeekerCityModel;
    destiny: SeekerCityModel;
};
export type SeekerCabinModel = {
    code: string;
    description: string;
    cabinClass: string;
};
export type SeekerCityModel = {
    code: string;
    description: string;
    country: string;
    countryLong: string;
    group: string;
    selected: boolean;
};
export type SeekerPassengerModel = {
    passengerType: string;
    minPassenger: number;
    maxPassengers: number;
    infoAge: string;
    count: number;
    isActive: boolean;
    isHidden: boolean;
    showMessage: boolean;
};
export type SeekerAdvancedSearchModel = {
    payWithAvios: boolean;
    payWithPoints: boolean;
    resetToggleCounter: boolean;
    specialTypeAvailableLastSearch: boolean;
    specialPassengerTypeHasError: boolean;
    aviosChecked: boolean;
    showDatepicker: boolean;
    tripOptions: SeekerTripOption[];
    tripOptionSelected: SeekerTripOption;
    cityOrigin: SeekerCityModel;
    cityDestiny: SeekerCityModel;
    cities: SeekerCitiesModel;
    originAllowedCities: SeekerCitiesModel;
    destinationAllowedCities: SeekerCitiesModel;
    passengersSelected: SeekerPassengerModel[];
    passengersConditions: PassengerSelectorCondition;
    selectedOutbondDate: Date;
    selectedReturnDate: Date;
    flexDates: boolean;
    passengers: SeekerPassengerInfoModel;
    discountResident: LocalDiscountConfigItem;
    discountFamily: LocalDiscountConfigItem;
    desFamilyConfig: LocalDiscountConfigModel;
    desResiConfig: LocalDiscountConfigModel;
    typeCabins: SeekerCabinModel[];
    cabinSelected: SeekerCabinModel;
    stops?: StopModel[];
    stopOptionSelected?: StopModel;
    nights?: NightModel[];
    nightOptionSelected?: NightModel;
    isPetFlight?:boolean;
};
export type StopModel = {
    description: string;
    code?: number;
};
export type NightModel = {
    allowed?: boolean;
    description: string;
    code?: number;
};
export type LocalDiscountConfigItem = {
    description: string;
    value: string;
    checked?: boolean;
};
export type LocalDiscountConfigModel = {
    type: string;
    name: string;
    subname?: string;
    items: LocalDiscountConfigItem[];
};
export type DataRangePickerDateCalendarModel = {
    minDateRange?: number;
    maxDateRange?: number;
};

export type PassengerSelectorModel  = {
    maxPassengers: number;
};
export type PassengerSelectorCondition = {
    passengersCount: number;
    passengersWithInfants: number;
    totalAdults: number;
    maxChilds: number;
};
export type PassengerSelectorType = {
    isHidden: boolean;
    showMessage: boolean;
    minPassenger: number;
    passengerType: string;
    count: number;
};

export type SeekerPassengerInfoModel = {
    numberPassengers: number;
    numAdults: number;
    numSeniors: number;
    numYouth: number;
    numTeenager: number;
    numChilds: number;
    numInfants: number;
};

export type SeekerStorageSearch = {
    expirationTimestamp?: number;
    iataOrigen: string;
    iataDestino: string;
    fechaIda: {
        day: string;
        month: string;
        year: string;
    };
    fechaVuelta: {
        day: string;
        month: string;
        year: string;
    };
    fechasFlexibles: boolean;
    adultos: number;
    niños: number;
    bebes: number;
    senior: number;
    joven: number;
    tarifa: string;
    residentes: string;
    familia: string;
    pagoAvios: boolean;
    pagoPuntos: boolean;
    youngType: string;
};
export type SeekerStorageSearchList = SeekerStorageSearch[];
