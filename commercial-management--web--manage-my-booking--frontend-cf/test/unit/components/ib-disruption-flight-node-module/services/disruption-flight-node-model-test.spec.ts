
describe('test for module ib-disruption-flight-node-module - services', function() {

    var mWindow = window;

    beforeEach(function() {
        angular.mock.module('ib-disruption-flight-node-module');
        
        angular.mock.module('LocalStorageModule');
    });

    describe('test for DisruptionFlightNodeModel', function() {

        var DisruptionFlightNodeModel;
        var $injector;

        beforeEach(function() {
            inject(function(_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                DisruptionFlightNodeModel = $injector.get('DisruptionFlightNodeModel');
            });
        });

        it('DisruptionFlightNodeModel should be defined', function() {

            expect(DisruptionFlightNodeModel).toBeDefined();
        });

    });
});