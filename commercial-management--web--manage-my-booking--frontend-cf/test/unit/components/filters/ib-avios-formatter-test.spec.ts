describe('AviosFormatted test', function () {
    'use strict';

    var expectedResult;
    var idTest;
    var aviosfilter;


    var fakecommercialInfo = {
        'currency' : {
            'groupingSeparator': '/'
        }
    }

    var fakeLocalStorageService = {
        'get' : jasmine.createSpy('get').and.callFake(function(){
            return fakecommercialInfo;
        }),
    };


    beforeEach(function () {
        angular.mock.module('ib-MmB-filters-module', function ($provide) {
            $provide.value('localStorageService', fakeLocalStorageService);

        });

        inject(function ($filter) {
            aviosfilter = $filter('aviosFormatter', {});
        });

    });

    describe('when getAviosFormatted is called', function(){
        it('should be able to format 500', function (done) {
            expectedResult = '500';
            idTest = 500;
            expect(aviosfilter(idTest)).toEqual(expectedResult);
            done();
        });
    });
});
