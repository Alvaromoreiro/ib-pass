describe('IbecoseAccordionController test', function () {

    var controller;

    beforeEach(angular.mock.module('ib-check-in-search'));

    beforeEach(inject(function ($controller) {
        controller = $controller('IbecoseAccordionController', {});
    }));

    describe('toggleAllItems is called', function () {
        it('and accordionState is "ACC_EXPAND_ALL" accordionState should be "ACC_HIDE_ALL"', function (done) {
            controller.accordionState = 'ACC_EXPAND_ALL';
            controller.toggleAllItems();
            expect(controller.accordionState).toBe('ACC_HIDE_ALL');
            done();
        });
    });

    describe('toggleAllItems is called', function () {
        it('and accordionState is not "ACC_EXPAND_ALL" accordionState should be "ACC_EXPAND_ALL"', function (done) {
            controller.accordionState = 'test';
            controller.toggleAllItems();
            expect(controller.accordionState).toBe('ACC_EXPAND_ALL');
            done();
        });
    });
});