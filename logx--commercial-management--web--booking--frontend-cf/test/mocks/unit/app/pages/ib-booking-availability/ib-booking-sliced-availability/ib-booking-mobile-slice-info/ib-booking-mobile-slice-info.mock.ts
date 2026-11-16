import type { SliceSegment } from '@src/app/core/models/ib-booking-availability/ib-booking-mobile-slice-info-flight.model';

export class IbBookingMobileSliceInfoMockClass {
    #segments: SliceSegment[]  = require( './Segments-mock.json' );
    #sliceInfoModel: any  = require( './SliceInfoModel-mock.json' );

    get segments () {
        return structuredClone(this.#segments); // Return a deep copy of the property value to prevent mutations during tests
    }

    get sliceInfoModel () {
        return structuredClone(this.#sliceInfoModel); // Return a deep copy of the property value to prevent mutations during tests
    }
}


