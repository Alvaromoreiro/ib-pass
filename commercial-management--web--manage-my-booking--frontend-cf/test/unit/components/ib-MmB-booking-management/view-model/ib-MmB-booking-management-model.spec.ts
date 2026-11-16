describe('BookingManagementModel test', () =>  {
    let BookingManagementModel;
    beforeEach(() => {
        angular.mock.module('ib-MmB-booking-management-module', () => {});
        inject((_BookingManagementModel_) => {
            BookingManagementModel = _BookingManagementModel_;
        });
    });

    it('initializeModel exists', () => {
        expect(BookingManagementModel.initializeModel).toBeDefined();
    })

    it('initializeModel its ok', () => {
        BookingManagementModel.initializeModel();
        expect(BookingManagementModel.initializeModel).toBeDefined();
        expect(BookingManagementModel.passengers).not.toBeDefined();
        expect(BookingManagementModel.optionalInformation).not.toBeDefined();
        expect(BookingManagementModel.bookingCode).not.toBeDefined();
        expect(BookingManagementModel.hasSavedChangesSuccess).toEqual(false);
        expect(BookingManagementModel.showSpecialNeeds).toEqual(true);
        expect(BookingManagementModel.haveSpecialPassenger).toEqual(false);
        expect(BookingManagementModel.showCopyOfTickets).toEqual(null);
    })
});
