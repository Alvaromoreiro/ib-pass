describe('EliminateWordsFilter filter test', function () {

    var eliminateWordsFilter;

    beforeEach(function () {
        angular.mock.module('ib-booking-filters-module', function ($provide) {
        });

        inject(function ($filter) {
            eliminateWordsFilter = $filter('EliminateWordsFilter');
        });
    });

    describe('when EliminateWordsFilter is called', function () {

        describe('removing a single word', function () {

            [
                {
                    desc: 'removes the word when it appears once',
                    text: 'Hello world',
                    words: 'world',
                    expectedOutput: 'Hello '
                },
                {
                    desc: 'removes all occurrences when the word appears multiple times',
                    text: 'Hello world world',
                    words: 'world',
                    expectedOutput: 'Hello  '
                },
                {
                    desc: 'returns the original text when the word is not found',
                    text: 'Hello world',
                    words: 'foo',
                    expectedOutput: 'Hello world'
                },
                {
                    desc: 'is case-sensitive and does not remove a word with different casing',
                    text: 'Hello World',
                    words: 'world',
                    expectedOutput: 'Hello World'
                }
            ].forEach(function (testCase) {
                it(testCase.desc, function () {
                    expect(eliminateWordsFilter(testCase.text, testCase.words)).toBe(testCase.expectedOutput);
                });
            });
        });

        describe('removing multiple words', function () {

            [
                {
                    desc: 'removes all listed words from the text',
                    text: 'Hello beautiful world',
                    words: 'Hello world',
                    expectedOutput: ' beautiful '
                },
                {
                    desc: 'removes each word globally when they appear multiple times',
                    text: 'foo bar foo bar',
                    words: 'foo bar',
                    expectedOutput: '   '
                },
                {
                    desc: 'returns the original text when none of the words are found',
                    text: 'Hello world',
                    words: 'foo baz',
                    expectedOutput: 'Hello world'
                }
            ].forEach(function (testCase) {
                it(testCase.desc, function () {
                    expect(eliminateWordsFilter(testCase.text, testCase.words)).toBe(testCase.expectedOutput);
                });
            });
        });
    });
});
