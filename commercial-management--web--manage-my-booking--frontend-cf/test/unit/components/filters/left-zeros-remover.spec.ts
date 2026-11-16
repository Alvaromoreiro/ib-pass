describe('LeftZerosRemoverFilter test', function () {
    'use strict'; 
    
    var $filter;
    var result;

    beforeEach(function () {
        angular.mock.module('ib-MmB-filters-module');
  
        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });

    it('should remove left 0', function (done) {
        result = $filter('LeftZerosRemover')("0texto");
        expect(result).toEqual("texto");
        done();
    });

});