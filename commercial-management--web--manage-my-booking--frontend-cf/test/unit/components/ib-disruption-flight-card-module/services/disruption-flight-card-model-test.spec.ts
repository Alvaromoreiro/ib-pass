'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-disruption-flight-card-module - services', function() {

    beforeEach(function() {
        angular.mock.module('ib-disruption-flight-card-module');
        
        angular.mock.module('LocalStorageModule');
    });

    describe('test for DisruptionFlightCardModel', function() {

        var DisruptionFlightCardModel;
        var $injector;

        beforeEach(function() {
            inject(function(_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                DisruptionFlightCardModel = $injector.get('DisruptionFlightCardModel');
            });
        });

        it('DisruptionFlightCardModel should be defined', function() {

            expect(DisruptionFlightCardModel).toBeDefined();
        });

    });
});