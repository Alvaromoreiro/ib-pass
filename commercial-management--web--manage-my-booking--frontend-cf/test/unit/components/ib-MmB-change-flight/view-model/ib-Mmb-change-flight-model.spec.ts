describe('ChangeFlightModel test', function () {
    var ChangeFlightModel;
    beforeEach(function () {
        angular.mock.module('ib-Mmb-change-flight-module', function () {});
        inject(function (_ChangeFlightModel_) {
            ChangeFlightModel = _ChangeFlightModel_;
        });
    });

    it('initializeModel exists', function(){
        expect(ChangeFlightModel.initializeModel).toBeDefined();
    })

    it('initializeModel its ok', function(){
        ChangeFlightModel.initializeModel();
        expect(ChangeFlightModel.selectedSegmentInfo).toBeDefined();
        expect(ChangeFlightModel.availabilityInfo).toBeDefined();
        expect(ChangeFlightModel.searchEngineModel).toBeDefined();
        expect(ChangeFlightModel.hasAvailability).toEqual(false);
    })
});
