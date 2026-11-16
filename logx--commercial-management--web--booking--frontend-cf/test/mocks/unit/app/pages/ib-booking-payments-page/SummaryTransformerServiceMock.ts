import { Ancillarie, GenericSummaryItem, Trip } from 'commercial-management--digital--web-components-design--library/dist/components/layout/summary/Summary.model';

export class SummaryTransformerServiceMock {
    setTrips = jasmine.createSpy( 'setTrips' ).and.callFake( () => [] as Trip[] );
    setPassengers = jasmine.createSpy( 'setPassengers' ).and.callFake( () => [] as PassengerType[] );
    getAncillaries = jasmine.createSpy( 'getAncillaries' ).and.callFake( () => [] as Ancillarie[] );
    setOtherItemsFromBasket = jasmine.createSpy( 'setOtherItemsFromBasket' ).and.callFake( () => [] as GenericSummaryItem[] );
    titleCasePipe = jasmine.createSpy( 'titleCasePipe' ).and.callFake( () => '' );
}
