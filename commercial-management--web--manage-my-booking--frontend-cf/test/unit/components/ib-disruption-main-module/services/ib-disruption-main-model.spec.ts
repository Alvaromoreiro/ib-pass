
describe('test for module ib-disruption-main-module - services', function() {

    beforeEach(function() {
        angular.mock.module('ib-disruption-main-module');
        
        angular.mock.module('LocalStorageModule');
    });

    describe('test for DisruptionModel', function() {

        var DisruptionModel;
        var $injector;

        beforeEach(function() {
            inject(function(_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                DisruptionModel = $injector.get('DisruptionModel');
            });
        });

        it('DisruptionModel should be defined', function() {

            expect(DisruptionModel).toBeDefined();
        });


        it('test for DisruptionModel.initializeModel', function() {

            DisruptionModel.initializeModel();

            expect(DisruptionModel.initializeModel).toBeDefined();
        });
    });
});