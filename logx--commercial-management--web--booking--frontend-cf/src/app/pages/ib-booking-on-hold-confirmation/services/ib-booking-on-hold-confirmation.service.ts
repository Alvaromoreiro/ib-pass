import { Injectable } from '@angular/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { CountriesListService } from '@src/app/shared/http-services/rdu-loc/ib-booking-countries-list.service';
import { StatesListService } from '@src/app/shared/http-services/rdu-loc/ib-booking-states-list.service';
import { IbBookingOnHoldConfirmationTransformerService } from '@pages/ib-booking-on-hold-confirmation/services/ib-booking-on-hold-confirmation-transformer.service';
import { OHImportResponse, OnHoldModel } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation-component-model';

@Injectable({providedIn: 'root'})

export class IbOnHoldConfirmationService {
    constructor (
        private IbBookingOnHoldConfirmationTransformerService: IbBookingOnHoldConfirmationTransformerService,
        private localStorageService: CommonsSessionStorageService,
        private CountriesListService: CountriesListService,
        private StatesListService: StatesListService
    ) {}

    getBookingInfo = (): Promise<OnHoldModel> => {
        return new Promise((resolve) => {
            const getBackgroundImagesSuccess = (data) => {
                let bookingInfo: OHImportResponse = this.localStorageService.get('bookingInfo');
                let onHoldConfirmationInfo = this.IbBookingOnHoldConfirmationTransformerService.transformOnHoldConfirmationInfo(bookingInfo, this.localStorageService.get('PNR'));
                this.localStorageService.set('cashAviosPossibilities', onHoldConfirmationInfo.generalInfo.cashAviosPossibilities);
                resolve(onHoldConfirmationInfo);
            };
            getBackgroundImagesSuccess(null);
        });
    };

    confirmOnHoldOrder = (selectedCountry) => {
        return new Promise((resolve, reject) => {
            const getCountriesSuccess = (countriesList) => {
                selectedCountry = selectedCountry || countriesList[0];
                this.StatesListService.getStatesList(selectedCountry && selectedCountry.code ? selectedCountry.code : countriesList && countriesList[0] ? countriesList[0].code : null)
                    .then((data) => resolve(data), (error) => reject(error));
            };
            this.CountriesListService.getCountriesList().then(getCountriesSuccess, () => {
                getCountriesSuccess([]);
            });
        });
    };

    getOriginDestination = (bookingInfo) => {
        const val = this.getOriginDestinations(bookingInfo);
        return bookingInfo.generalInfo.flightType !== BookingAppConstants.OH_FLIGHT_TYPES.MULTITRIP ? val[0]: val;
    };


    private getOriginDestinations = (bookingInfo) => {

        const slices = Object.values<any>(bookingInfo.generalInfo.flightInfo);
        if (slices.length > 1 && bookingInfo.generalInfo.flightType !== BookingAppConstants.OH_FLIGHT_TYPES.MULTITRIP) {
            slices.pop();
        }
        return slices.map((data) =>
            (
                {
                    originCity: data.departureCity.city,
                    destinationCity: data.arrivalCity.city,
                    dates: {
                        outboundFlight: data.departureDateParsed.originalDate,
                        formatedOutboundFlight: data.departureDateParsed.originalDate,
                        returnFlight: bookingInfo.generalInfo.returnFlight ? bookingInfo.generalInfo.returnFlight.date : null,
                        formatedReturnFlight: bookingInfo.generalInfo.returnFlight ? bookingInfo.generalInfo.returnFlight.date : null
                    },
                    passengers: bookingInfo.generalInfo.passengersNumber,
                    numAdults: bookingInfo.generalInfo.passengersNumber,
                    numChilds: 0,
                    numInfant: 0,
                    numSeniors: 0,
                    numTeenager: 0,
                    numYoung: 0,
                    tripType: bookingInfo.generalInfo.tripType + ''
                }
            ));
    };
}
