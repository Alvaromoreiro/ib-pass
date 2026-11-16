describe('textFormatter test', function () {

    var textFormatter;

    beforeEach(function () {
        angular.mock.module('ib-booking-filters-module', function ($provide) {
        });

        inject(function ($filter) {
            textFormatter = $filter('textFormatter');
        });
    });

    describe('when textFormatter is called', function () {

        it(' without parameters', function (done) {
            var result;

            result = textFormatter();

            expect(result).toBe(undefined);
            done();
        });
        
        it(' with only text', function (done) {
            var input = 'My name is {0} and I am {1} years old.';
            var expectedOutput = 'My name is {0} and I am {1} years old.';
            var result;

            result = textFormatter(input);

            expect(result).toBe(expectedOutput);
            done();
        });
        
        it(' with text and not enough values', function (done) {
            var input = 'My name is {0} and I am {1} years old.';
            var expectedOutput = 'My name is Pedro and I am {1} years old.';
            var result;

            result = textFormatter(input, 'Pedro');

            expect(result).toBe(expectedOutput);
            done();
        });
        
        it(' with text and enough values', function (done) {
            var input = 'My name is {0} and I am {1} years old.';
            var expectedOutput = 'My name is Pedro and I am 33 years old.';
            var result;

            result = textFormatter(input, 'Pedro', 33);

            expect(result).toBe(expectedOutput);
            done();
        });

    });
});