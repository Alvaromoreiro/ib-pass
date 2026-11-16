describe('WordNumberFormatFilter test', function () {
    'use strict'; 
    
    var $filter;
    var type;
    var number;
    var Outexpected;
    var result;

    beforeEach(function () {
        angular.mock.module('ib-MmB-filters-module');
  
        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });

    it('should return to correctly formatted string', function (done) {
        number = 1;
        type = 'test';
        Outexpected = 'test'
        result = $filter('WordNumberFormatFilter')(type,number);
        expect(result).toEqual(Outexpected);
        done();
    });
    
    it('should return to correctly formatted string', function (done) {
        number = 5;
        type = 'test';
        Outexpected = 'SOME_test'
        result = $filter('WordNumberFormatFilter')(type,number);
        expect(result).toEqual(Outexpected);
        done();
    });  


});