describe('DurationFormatFilter test', function () {
    'use strict'; 
    
    var $filter;
    var numberDuration;
    var stringTest;
    var result;

    beforeEach(function () {
        angular.mock.module('ib-MmB-filters-module');
  
        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });

    it('should return to correctly formatted string', function (done) {
        numberDuration = 333;
        stringTest = '05h 33min.';
        result = $filter('DurationFormatFilter')(numberDuration);
        expect(result).toEqual(stringTest);
        done();
    }); 


});