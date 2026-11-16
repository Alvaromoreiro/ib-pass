describe('literalFormatter test', function () {

    var literalFormatter;

    beforeEach(function () {
        angular.mock.module('ib-booking-filters-module', function ($provide) {
        });

        inject(function ($filter) {
            literalFormatter = $filter('literalFormatter');
        });
    });

    describe('when literalFormatter is called', function () {

        it(' without parameters', function () {
            expect(literalFormatter()).toBe('');
        });

        it(' input has open but no close label sintax', function () {
            var input = 'this is a input for test $$bold$$labels.';

            expect(literalFormatter(input)).toBe(input);
        });

        describe(' with text as first param', function () {
            describe(', no tag info as second param', function () {

                [
                    {
                        desc: ' and input text hasnt format labels return same text.',
                        input: 'This text dont have format labels',
                        expectedOutput: 'This text dont have format labels'
                    },
                    {
                        desc: ' and input text has a format label unregistered then only remove labels',
                        input: 'This text contains a label $$notexist$unregistered$$',
                        expectedOutput: 'This text contains a label unregistered'
                    },
                    {
                        desc: ' and input text has a format label registerd then replace label for html',
                        input: 'This text contains a label $$under$unregisted$$',
                        expectedOutput: 'This text contains a label <span class="ib-text ib-text--underline">unregisted</span>'
                    },
                    {
                        desc: ' and input text has two concat format labels registerd then replace label for html',
                        input: 'This text contains a label $$under+bold$unregisted$$',
                        expectedOutput: 'This text contains a label <span class="ib-text ib-text--underline ib-text--bold">unregisted</span>'
                    }
                ].forEach(function (testCase) {
                    it(testCase.desc, function () {
                        expect(literalFormatter(testCase.input)).toBe(testCase.expectedOutput);
                    });
                });
            });

            describe(', tag info as second param', function () {

                describe(', input use custom label', function () {

                    [
                        {
                            desc: ' and custom tag info used exists then replace it for html.',
                            input: 'This text uses a $$custom$custom label$$',
                            expectedOutput: 'This text uses a <div title="My title" class="myClass">custom label</div>',
                            customTagInfos: { custom: { tag: 'div', class: 'myClass', title: 'My title' } }
                        },
                        {
                            desc: ' and custom tag info used exists and use Array for class then replace it for html.',
                            input: 'This text uses a $$custom$custom label$$',
                            expectedOutput: 'This text uses a <div title="My title" class="myClass1 myClass2">custom label</div>',
                            customTagInfos: { custom: { tag: 'div', class: ['myClass1', 'myClass2', null], title: 'My title' } }
                        },
                        {
                            desc: ' and custom tag info used not exists then remove it.',
                            input: 'This text uses a $$notExist$custom label$$',
                            expectedOutput: 'This text uses a custom label',
                            customTagInfos: { custom: { tag: 'div', class: 'myClass', title: 'My title' } }
                        },
                        {
                            desc: ' and concat with custom label then append class of other labels.',
                            input: 'This text uses a $$custom+under+bold$custom label$$',
                            expectedOutput: 'This text uses a <div title="My title" class="myClass ib-text ib-text--underline ib-text--bold">custom label</div>',
                            customTagInfos: { custom: { tag: 'div', class: 'myClass', title: 'My title' } }
                        },
                        {
                            desc: ' and custom label use attribute without value',
                            input: 'This text uses a $$custom$custom label$$',
                            expectedOutput: 'This text uses a <div disabled>custom label</div>',
                            customTagInfos: { custom: { tag: 'div', disabled: '' } }
                        }
                    ].forEach(function (testCase) {
                        it(testCase.desc, function () {
                            expect(literalFormatter(testCase.input, testCase.customTagInfos)).toBe(testCase.expectedOutput);
                        });
                    });
                });

                describe(' override default labels', function () {

                    var overrideInput = 'This text uses a default $$under$label$$ with override';

                    [
                        {
                            desc: ' adding new properties',
                            expectedOutput: 'This text uses a default <span title="My title" class="ib-text ib-text--underline">label</span> with override',
                            customTagInfos: { under: { title: 'My title' } }
                        },
                        {
                            desc: ' replacing original properties',
                            expectedOutput: 'This text uses a default <div class="newClass1 newClass2">label</div> with override',
                            customTagInfos: { under: { tag: 'div', class: 'newClass1 newClass2' } }
                        },
                        {
                            desc: ' replacing original class using Array',
                            expectedOutput: 'This text uses a default <span class="newClass1 newClass2">label</span> with override',
                            customTagInfos: { under: { class: ['newClass1', 'newClass2'] } }
                        }
                    ].forEach(function (testCase) {
                        it(testCase.desc, function () {
                            expect(literalFormatter(overrideInput, testCase.customTagInfos)).toBe(testCase.expectedOutput);
                        });
                    });
                });
            });
        });
    });
});
