

import { AvailabilityTransformerModel } from 'ib-web-ancillaries';
import { of, throwIfEmpty } from 'rxjs';

export class BKMCallItineraryServiceMock {
    public outboundResponse = { code: 200, data: {fareFamilyConditions: ['a']} };
    public inboundResponse = { code: 200, data: {fareFamilyConditions: ['a']} }
    public getOutboundItinerary = jasmine.createSpy('getOutboundItinerary').and.callFake(
        (requestData:  AvailabilityTransformerModel.ItineraryRequestData) => {
            return of(this.outboundResponse).pipe(throwIfEmpty(() => new Error()));
        }
    );
    public getReturnItinerary = jasmine.createSpy('getReturnItinerary').and.callFake(
        (responseId: string, offerId: string, sliceId: number) => {
            return of(this.inboundResponse).pipe(throwIfEmpty(() => new Error()));
        }
    );

}