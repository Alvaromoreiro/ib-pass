import { Injectable } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { OutboundSelectedDurationType } from '@src/app/core/models/ib-booking-availability/slice-by-slice-availability.models';

@Injectable({providedIn: 'root'})
export class IbSliceUtilsService {
    constructor ( ) { }
    public setDurationType ( stops = 0, techStops = 0): OutboundSelectedDurationType {
        let stopsString: string = '';
        if ( stops > 0 ) {
            stopsString = stops > 1? 'SOME_AVAILABILITY_STOPSNUMBER_FILTER' : 'AVAILABILITY_STOPSNUMBER_FILTER';
            return { stops: stops, text: stopsString };
        }
        if ( techStops > 0 ) {
            return { stops: techStops, text: 'AVAILABILITY_TECH_STOP' };
        }
        return { stops: 0, text: 'AVAILABILITY_SLICE_INFO_NONSTOP_FLIGHT' };

    }
    public getFlightFareClass ( fare: string ): string {
        let fareClass: string = '';
        switch ( fare ) {
                case BookingAppConstants.FARE_CABIN_TYPE.BUSINESS_CLASS:
                    fareClass = `${BookingAppConstants.CABIN_TYPES.BUSINESS.toLowerCase()}`;
                    break;
                case BookingAppConstants.FARE_CABIN_TYPE.TURIST_PREMIUM_T:
                    fareClass = `${BookingAppConstants.CABIN_TYPES.PREMIUM_TOURIST.toLowerCase()}`;
                    break;
                case BookingAppConstants.FARE_CABIN_TYPE.TURIST_PREMIUM:
                    fareClass = `${BookingAppConstants.CABIN_TYPES.PREMIUMECONOMY.toLowerCase()}`;
                    break;
                default:
                    fareClass = `${BookingAppConstants.CABIN_TYPES.ECONOMY.toLowerCase()}`;
                    break;
        }
        return fareClass;
    }
}
