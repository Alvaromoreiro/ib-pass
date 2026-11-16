describe('FlightSearchEngineDetailsController test', function () {
    var controller, scope;

    var controllerDependencies = {
        '$filter': {}
    };

    var ctrlBinds = {
        'flightSearchDetailsModel': {},
        'timeZoneOptions': {}
    };

    beforeEach(function () {
        angular.mock.module('ib-flight-search-engine-details-module');
        inject(function ($componentController, $rootScope) {
            scope = $rootScope.$new();
            controller = $componentController('ibFlightSearchEngineDetails', controllerDependencies, ctrlBinds);
            controller.$onInit();

        });
    });

    it('When activate() is called, should asign date today to controller', function (done) {
        expect(controller.slideToggle).toBe(false)
        done();
    });
});
