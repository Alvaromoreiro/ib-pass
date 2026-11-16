// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-steps-module - factories', function() {

    beforeEach(function() {
        module('ib-steps-module');
    });

    describe('test for StepsTransformer', function() {

        var StepsTransformer;
        var StepsConstants;
        var $injector;

        beforeEach(function() {
            inject(function(_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                StepsConstants = $injector.get('StepsConstants');
                StepsTransformer = $injector.get('StepsTransformer');
            });
        });

        it('StepsTransformer should be defined', function() {

            expect(StepsTransformer).toBeDefined();
        });


        it('test for StepsTransformer.initSteps', function() {

            var headerModel = {
                hasSteps: true,
                steps: 'DEFAULT_STEPS',
                position: 'availability'
            };
            var ret = StepsTransformer.initSteps(headerModel);

            expect(StepsTransformer.initSteps).toBeDefined();
        });
    });
});