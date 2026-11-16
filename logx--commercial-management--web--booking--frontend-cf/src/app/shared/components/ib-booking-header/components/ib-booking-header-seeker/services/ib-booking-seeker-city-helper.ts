import { SeekerAreasModel, SeekerCitiesModel, SeekerCityModel } from '@src/app/core/models/ib-booking-availability/header-seeker-model';

export type BuildCitiesModelInterface ={
    cities: SeekerCitiesModel;
    citiesOutsideSpain: any;
    cityOrigin: SeekerCityModel;
    cityDestiny: SeekerCityModel;
};
export class IbBookingCitySeekerCityService {
    private isHMad: boolean;
    private trips: any[];
    private destinationAreasCitiesList: any[];
    
    constructor (isHMad, trips, destinationAreasCitiesList) {
        this.isHMad = isHMad;
        this.trips = trips;
        this.destinationAreasCitiesList = destinationAreasCitiesList;
    }

  
    buildCitiesModel (citiesData: SeekerAreasModel) {
        const cities = this.resolveCitiesForMarket(citiesData);
        const citiesOutsideSpain = this.filterCitiesOutsideSpain(cities);
        return{cities, citiesOutsideSpain, cityOrigin: citiesData.origin, cityDestiny: this.resolveCityDestiny(citiesData)};
    }
    
    
    resolveCitiesForMarket (citiesData: SeekerAreasModel) {
        if (!this.isHMad) {
            return citiesData.cities;
        }

        return {
            ...citiesData.cities,
            listCities: citiesData.cities.listCities.filter(
                city => city.code !== 'MAD'
            )
        };
    }
    
    filterCitiesOutsideSpain (cities) {
        return {
            ...cities,
            listCities: cities.listCities.filter(
                city => city.country !== 'ES'
            )
        };
    }

    resolveCityDestiny (citiesData: SeekerAreasModel): SeekerCityModel {
        if (!this.isHMad) {
            return citiesData.destiny;
        }

        const destinationTrip =
        this.trips[1]?.destinyCode === 'MAD'
            ? this.trips[1]?.originCode
            : this.trips[1]?.destinyCode;

        const cityInfo =
        this.destinationAreasCitiesList
            .flatMap(region =>
                region.cities.find(city => city.code === destinationTrip)
            )
            .find(Boolean);

        return {
            code: cityInfo.code,
            description: cityInfo.description,
            country: cityInfo.country.code,
            countryLong: cityInfo.country.description,
            selected: false
        } as SeekerCityModel;
    }
    
    
}
