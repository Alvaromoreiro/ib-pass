import { OutboundSelectedDurationType } from '@src/app/core/models/ib-booking-availability/slice-by-slice-availability.models';

export class IbSliceUtilsServiceMock {
    setDurationType = jasmine.createSpy('setDurationType').and.callFake(() => <OutboundSelectedDurationType>{ stops: 0, text: 'AVAILABILITY_SLICE_INFO_NONSTOP_FLIGHT' });
    getFlightFareClass = jasmine.createSpy('getFlightFareClass').and.callFake(()=>'');
}
