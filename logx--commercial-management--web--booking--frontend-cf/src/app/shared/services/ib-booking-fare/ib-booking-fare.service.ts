import { Injectable } from '@angular/core';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { CallBookingFare } from '@shared/http-services/sse-avm/ib-call-booking-fare.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { FareDataModel } from '@src/app/core/models/generic-models/fare-models';
import { BookingAvailabilityConstants } from '@src/app/core/constants/ib-booking-availability-constants';
import { BookingHttpErrorModel } from '@src/app/core/models/generic-models/generic-models';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
@Injectable ({providedIn:'root'})
export class BookingFareService {
    constructor (
        private CallBookingFare: CallBookingFare,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private DigitalDataService: DigitalDataService
        
    ){}


    private setOnPointsStorage = (fare: FareDataModel) => {
        const userLogged = this.CommonsSessionStorageService.get(BkiStorageConstants.USER_LOGGED);
        if ( userLogged === BookingAppConstants.LOGIN_ONB) {
            if (fare.offers[0].accrualQuote.qualificationPoints !== null) {
                this.CommonsSessionStorageService.set(BkiStorageConstants.OB_POINTS, fare.offers[0].accrualQuote);
            }
        }
    };

    private setObDiscountInfo = (fare: FareDataModel) => {
        let index = 0, obIndex = 0;
        const offer = fare.offers[0];
        const oBDiscountInfo = [];
        while (offer.specialDiscountsApplied.length > index) {
            if (offer.specialDiscountsApplied[index].type === BookingAvailabilityConstants.CORPORATE) {
                oBDiscountInfo[obIndex] = {};
                oBDiscountInfo[obIndex].corporateDiscountType = offer.specialDiscountsApplied[index].discountType;
                oBDiscountInfo[obIndex].discount = offer.priceSpecialDiscount && offer.priceSpecialDiscount.totalDiscount ? offer.priceSpecialDiscount.totalDiscount : this.CommonsSessionStorageService.get('formatedPriceDifference');
                obIndex++;
            }
            index++;
        }
        this.CommonsSessionStorageService.set(BkiStorageConstants.OB_DISCOUNT_INFO, oBDiscountInfo);
    };

    private addFlightHaul = (fare: FareDataModel) => {
        const flightHaul = { FlightHaul: fare.offers[0].flightRatio };
        this.DigitalDataService.addDigitalDataInfo(flightHaul);

        this.CommonsSessionStorageService.set(BkiStorageConstants.FF_CONDITIONS_INFO, fare.fareFamilyConditions);
    };
    private setFareDataStorage = (fare: FareDataModel) => {
        this.CommonsSessionStorageService.set(BkiStorageConstants.FARE, fare);
    };

    public getBookingFare = (getBookingFareData) => {
        return new Promise<FareDataModel>( (resolve, reject) => {
            this.CallBookingFare.postFarePromised(getBookingFareData)
                .then(
                    (response)=>{
                        const data: FareDataModel = response.data as FareDataModel;
                        this.setFareDataStorage(data);
                        this.setOnPointsStorage(data);
                        this.setObDiscountInfo(data);
                        this.addFlightHaul(data);
                        resolve(response.data as FareDataModel);
                    }
                )
                .catch(
                    (response) => {
                        reject(response as BookingHttpErrorModel);
                    }
                );
        });
    };
}
downgradeToAJSService(
    BookingFareService.name,
    BookingFareService,
    'ib-booking-services-module', []);
