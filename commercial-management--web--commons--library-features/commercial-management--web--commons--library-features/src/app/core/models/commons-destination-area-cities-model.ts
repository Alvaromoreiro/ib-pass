namespace CommonsDestinationAreaCitiesModel {
  export interface DestinationAreaCitiesListModel {
    code: string;
    description: string;
    cities: City[];
  }

  export interface City {
    code: string;
    description: string;
    country: Country;
  }

  export interface Country {
    code: string;
    description: string;
  }
}
