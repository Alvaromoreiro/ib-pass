describe('BookingNameModel', () => {
    let BookingNameModel;

    beforeEach(() => {
        angular.mock.module('ib-booking-name');

        inject((_BookingNameModel_) => {
            BookingNameModel = _BookingNameModel_;
        });
    });

    it('Init prop name as empty', () => {
        expect(BookingNameModel.name).toBe('');
    });

    it('prop name modify', () => {
        BookingNameModel.name = 'Juan';
        expect(BookingNameModel.name).toBe('Juan');
    });
});
