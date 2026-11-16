export class IbBookingCurrencyUtilsServiceMock {
    getPriceFormatted = jasmine.createSpy( 'getPriceFormatted' ).and.callFake( () => '100€' );
}
