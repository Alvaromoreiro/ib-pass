'use strict';
jasmine.getEnv().allowRespy(true);
describe('test ibInputsController', function() {
    beforeEach(function() {
        angular.mock.module('ib-inputs', function($provide){

        });
    });

    describe('test for RefundDoubtsAndRightsController', function() {

        var ibInputsController;
        var $controller;
        var $injector;

        beforeEach(function() {
            inject(function(_$controller_, _$injector_) {
                $controller = _$controller_;
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key];
                    return clone
                } , {});
                ibInputsController = $controller('ibInputsController', {});
            });
        });

        it('ibInputsController should be defined', function() {

            expect(ibInputsController).toBeDefined();
        });
    });
});
