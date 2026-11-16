export interface SisterCitiesRequestModel {
    disruptionType: string;
    disruptionId: number;
    cities: CityModel [];
}

export interface CityModel {
    code: string;
    description: string;
    sisterCities: SisterCitiesModel[];
}

export interface SisterCitiesModel {
    code: string;
    country: CountryModel;
    description: string;
    latitude: number;
    longitude: number;
    timezone: string;
}

export interface CountryModel {
    code: string;
    description: string;
}

export const DEFAULT_COUNTRY_MODEL: CountryModel = {
    code: '',
    description: ''
};

export const DEFAULT_SISTER_CITIES_MODEL: SisterCitiesModel = {
    code: '',
    country: DEFAULT_COUNTRY_MODEL,
    description: '',
    latitude: 0,
    longitude: 0,
    timezone: '',
};

export const DEFAULT_CITY_MODEL: CityModel = {
    code: '',
    description: '',
    sisterCities: [DEFAULT_SISTER_CITIES_MODEL]
};

export const DEFAULT_SISTER_CITIES_REQUEST_MODEL: SisterCitiesRequestModel = {
    disruptionType: '',
    disruptionId: 0,
    cities: [DEFAULT_CITY_MODEL]
};

