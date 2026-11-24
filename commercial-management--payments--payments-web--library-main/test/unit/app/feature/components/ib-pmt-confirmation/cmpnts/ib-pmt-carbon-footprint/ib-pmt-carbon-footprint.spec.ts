describe('test for ibPmtCarbonFootprint', function () {
   
    let ibPmtCarbonFootprint;
    let bindings = {
        model : jasmine.createSpy()
    };
    var fake$scope = {
        '$on': jasmine.createSpy()
    };

    beforeEach(function () {
        angular.mock.module('ib-pmt-carbon-footprint-module', function ($provide) {
            $provide.value('$scope ', fake$scope );
        });
        inject(function (_$rootScope_, _$componentController_) {

            ibPmtCarbonFootprint = _$componentController_('ibPmtCarbonFootprint', {}, bindings);

        });
    });
    describe('ibPmtCarbonFootprint is init', function () {
        it('ibPmtCarbonFootprint should be defined', function (done) {
            expect(ibPmtCarbonFootprint).toBeDefined();
            done();
        });
    });
});
