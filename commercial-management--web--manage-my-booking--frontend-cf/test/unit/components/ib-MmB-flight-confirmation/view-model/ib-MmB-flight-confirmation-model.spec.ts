describe('FlightConfirmationModel test', () => {
    let FlightConfirmationModel;
    beforeEach(() => {
        angular.mock.module('ib-MmB-flight-confirmation-module', () => {});
        inject(function (_FlightConfirmationModel_) {
            FlightConfirmationModel = _FlightConfirmationModel_;
        });
    });

    it('initializeModel exists', () => {
        expect(FlightConfirmationModel.initializeModel).toBeDefined();
    })

    it('initializeModel its ok', () => {
        FlightConfirmationModel.initializeModel();
        expect(FlightConfirmationModel.selectedSegmentDetails).toEqual(null);
        expect(FlightConfirmationModel.oldSegmentInfo).toEqual(null);
        expect(FlightConfirmationModel.newSegmentInfo).toEqual(null);
    })
});
