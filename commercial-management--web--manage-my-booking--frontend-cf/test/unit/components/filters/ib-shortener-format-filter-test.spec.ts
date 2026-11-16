describe('ShortenerFormarFilter test', function () {
    'use strict'; 
  
    var $filter;
    var stringTest;
    var result;
    var length;
  
    beforeEach(function () {
        angular.mock.module('ib-MmB-filters-module');
  
        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });
    
    describe('Call the filter convertToTitleCase with a parameter', function () {
        
        it('should return to correct string', function (done) {
            stringTest = 'correct';
            result = $filter('titleCaseFilter')(stringTest);
            expect(result).toEqual('Correct');
            done();
        });

        it('should return to empty string', function (done) {
            stringTest = '';
            result = $filter('titleCaseFilter')(stringTest);
            expect(result).toEqual('');
            done();
        });

    });

    
    describe('Call the filter shortenerString with a parameter', function () {

        it('should return to empty string', function (done) {
            stringTest = '';
            result = $filter('ShortenerFormatFilter')(stringTest);
            expect(result).toEqual('');
            done();
        });

        it('should return to string with a length of 3', function (done) {
            stringTest = 'Test';
            result = $filter('ShortenerFormatFilter')(stringTest);
            expect(result).toEqual('Tes');
            done();
        });
    });

    describe('Call the filter shortenerString with 2 parameters', function () {

        it('should return to empty string', function (done) {
            stringTest = '';
            length = 0;
            result = $filter('ShortenerFormatFilter')(stringTest, length);
            expect(result).toEqual('');
            done();
        });

        it('should return to string with a length of 3', function (done) {
            stringTest = 'Test';
            length = 0;
            result = $filter('ShortenerFormatFilter')(stringTest, length);
            expect(result).toEqual('Tes');
            done();
        });
    
        it('should return to string with a length of parameter length', function (done) {
            stringTest = 'testing';
            length = 4;
            result = $filter('ShortenerFormatFilter')(stringTest, length);
            expect(result).toEqual('test');
            done();
        });

    });

    describe('Call the filter shortenerString with 3 parameters', function () {

        it('should return to empty string', function (done) {
            stringTest = '';
            length = 0;
            result = $filter('ShortenerFormatFilter')(stringTest, length, true);
            expect(result).toEqual('');
            done();
        });

        it('should return to capitalized string with a length of 3', function (done) {
            stringTest = 'test';
            length = 0;
            result = $filter('ShortenerFormatFilter')(stringTest, length, true);
            expect(result).toEqual('Tes');
            done();
        });

        it('should return to capitalized string with a length of parameter length', function (done) {
            stringTest = 'testing';
            length = 4;
            result = $filter('ShortenerFormatFilter')(stringTest, length, true);
            expect(result).toEqual('Test');
            done();
        });

    });
    
    describe('Call the filter shortenerString with 4 parameters', function () {

        it('should return to empty string', function (done) {
            stringTest = '';
            length = 0;
            result = $filter('ShortenerFormatFilter')(stringTest, length, false, true);
            expect(result).toEqual('');
            done();
        });

        it('should return to lowercase string with a length of 3', function (done) {
            stringTest = 'test';
            length = 0;
            result = $filter('ShortenerFormatFilter')(stringTest, length, false, true);
            expect(result).toEqual('tes');
            done();
        });
        
        it('should return to lowercase string with a length of parameter length', function (done) {
            stringTest = 'testing';
            length = 4;
            result = $filter('ShortenerFormatFilter')(stringTest, length, false, true);
            expect(result).toEqual('test');
            done();
        }); 

    });

});





