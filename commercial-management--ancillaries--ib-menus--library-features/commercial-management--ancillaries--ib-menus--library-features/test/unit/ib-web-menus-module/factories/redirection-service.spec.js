// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-web-menus-module - factories', function() {

    beforeEach(function() {
        module('ib-web-menus-module');
    });

    describe('test for RedirectionService', function() {

        var RedirectionService;
        var $window;
        var $injector;

        beforeEach(function() {
            inject(function(_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                $window = $injector.get('$window');
                RedirectionService = $injector.get('RedirectionService');
            });
        });

        it('RedirectionService should be defined', function() {

            expect(RedirectionService).toBeDefined();
        });


        it('test for RedirectionService.externalRedirect', function() {
            expect(RedirectionService.externalRedirect).toBeDefined();
        });
    });
});