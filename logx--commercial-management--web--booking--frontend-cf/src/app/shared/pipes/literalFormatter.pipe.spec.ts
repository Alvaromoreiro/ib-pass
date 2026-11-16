import { LiteralFormatterPipe } from "@src/app/shared/pipes/literalFormatter.pipe";

interface DefaultTagInfo {
    tag: string;
    class: string;
    href?: string;
    target?: string;
    title?: string;
}

interface DefaultTags {
    bold?: DefaultTagInfo;
    under?: DefaultTagInfo;
    link?: DefaultTagInfo;
    sub?: DefaultTagInfo;
    custom?: DefaultTagInfo;
}

const tagsInfo: DefaultTags = {
    sub: {
        tag: "sub",
        class: "sub",
    },
    link: {
        tag: "a",
        class: "link link-underline",
        href: "example",
        target: "_blank",
    },
    custom: {
        tag: "div",
        class: "myClass",
        title: "My title",
    },
};

describe("LiteralFormatterPipe test", () => {
    let pipe: LiteralFormatterPipe;

    interface TransformTestCase {
        title: string;
        input: string;
        expected: string;
        tags?: DefaultTags;
    }

    beforeEach(() => {
        pipe = new LiteralFormatterPipe();
    });

    it("should create an instance", () => {
        expect(pipe).toBeTruthy();
    });

    describe("if passed only the first argument (input string) ", () => {
        describe("and it has correct input", () => {
            const formatCases: TransformTestCase[] = [
                {
                    title: "should format text with default bold tag",
                    input: "This is $$bold$bold text$$.",
                    expected: 'This is <span class="text-bold">bold text</span>.',
                },
                {
                    title: "should format text with default underline tag",
                    input: "This is $$under$underlined text$$.",
                    expected:
                        'This is <span class="text-underline">underlined text</span>.',
                },
                {
                    title: "should format text with default link tag",
                    input: "Visit $$link$our site$$ for more information.",
                    expected:
                        'Visit <a href="example" target="_blank" class="link link-underline">our site</a> for more information.',
                    tags: tagsInfo,
                },
                {
                    title: "should concatenate classes in one tag",
                    input: "This is $$bold+under$styled text$$.",
                    expected:
                        'This is <span class="text-bold text-underline">styled text</span>.',
                },
            ];

            formatCases.forEach(({ title, input, expected, tags }) => {
                it(title, () => {
                    expect(pipe.transform(input, tags)).toBe(expected);
                });
            });
        });

        describe("and it has incorrect input, it should ", () => {
            const invalidCases: TransformTestCase[] = [
                {
                    title: "return the same string if there are no placeholders",
                    input: "This is a plain string.",
                    expected: "This is a plain string.",
                },
                {
                    title:
                        " remain the same if the tags are malformed (no closing tag).",
                    input: "this is a input for test $$bold$$labels.",
                    expected: "this is a input for test $$bold$$labels.",
                },
                {
                    title:
                        " remove placeholders if input text has an unregistered label",
                    input:
                        "This text contains a label that $$notexist$does not exist$$",
                    expected: "This text contains a label that does not exist",
                },
            ];

            invalidCases.forEach(({ title, input, expected }) => {
                it(title, () => {
                    expect(pipe.transform(input)).toBe(expected);
                });
            });

            it("return an empty string if input is null or undefined", () => {
                expect(pipe.transform(null)).toBe("");
                expect(pipe.transform(undefined)).toBe("");
            });
        });
    });

    describe("if also passed a second argument, it should ", () => {
        it("should return a sub tag with sub class", () => {
            const input = "This is $$sub$sub text$$.";
            const expected = 'This is <sub class="sub">sub text</sub>.';

            expect(pipe.transform(input, tagsInfo)).toBe(expected);
        });
    });

    describe(" when overriding existing properties, should", () => {
        const overrideCases: TransformTestCase[] = [
            {
                title: " work upon adding new properties",
                input: "This text uses a default $$under$label$$ with override",
                expected:
                    'This text uses a default <span title="My title" class="text-underline">label</span> with override',
                tags: {
                    under: {
                        title: "My title",
                        tag: "span",
                        class: "text-underline",
                    },
                },
            },
            {
                title: " replace original properties",
                input: "This text uses a default $$under$label$$ with override",
                expected:
                    'This text uses a default <div class="newClass1 newClass2">label</div> with override',
                tags: {
                    under: {
                        tag: "div",
                        class: "newClass1 newClass2",
                    },
                },
            },
        ];

        overrideCases.forEach(({ title, input, expected, tags }) => {
            it(title, () => {
                expect(pipe.transform(input, tags)).toBe(expected);
            });
        });

        it(" concat with custom label then append class of other labels.", () => {
            const input = "This text uses a $$custom+under+bold$custom label$$";
            const expectedOutput =
                'This text uses a <div title="My title" class="myClass text-underline text-bold">custom label</div>';

            const result = pipe.transform(input, tagsInfo);

            expect(result).toBe(expectedOutput);
        });
    });
});
