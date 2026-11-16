describe('ibDatePickerPopupComponent test', () => {
    var controller;

    var controllerDependencies = {
        '$filter': {}
    };

    beforeEach(() => {
        angular.mock.module('ib-flight-search-engine-module');
        inject(function ($componentController, $filter) {
            jasmine.clock().mockDate(new Date(2017, 6, 13, 13, 0));
            controller = $componentController('ibDatePickerPopupComponent', {
                $filter: $filter
            });
            controller.$onInit();
        });
    });

    it('When activate() is called, should asign date today to controller', (done) => {
        expect(controller.today).toEqual('13 de Jul, 2017')
        done();
    });
});
