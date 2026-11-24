import angular from 'angular';

interface TrimTestScope extends ng.IScope {
    model: { value: string };
}

describe('ibTrimOnBlur directive', () => {
    let $compile: ng.ICompileService;
    let $rootScope: ng.IRootScopeService;
    let scope: TrimTestScope;

    beforeEach(() => {
        angular.mock.module('ib-reusable-module');
        inject((_$compile_: ng.ICompileService, _$rootScope_: ng.IRootScopeService) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function compileInput (initialValue: string): ng.IAugmentedJQuery {
        scope = $rootScope.$new() as TrimTestScope;
        scope.model = { value: initialValue };
        const element = $compile('<input type="text" ng-model="model.value" ib-trim-on-blur />')(scope);
        scope.$digest();
        return element;
    }

    function flushTrim (): void {
        scope.$digest();
    }

    function setDomValueAndTrigger (element: ng.IAugmentedJQuery, domValue: string, eventName: string): void {
        element.val(domValue);
        element.triggerHandler(eventName);
        flushTrim();
    }

    it('should trim leading and trailing spaces on blur', () => {
        const element = compileInput('');
        setDomValueAndTrigger(element, '  John  ', 'blur');

        expect(scope.model.value).toBe('John');
        expect(element.val()).toBe('John');
    });

    it('should trim on change (browser autofill commit)', () => {
        const element = compileInput('');
        setDomValueAndTrigger(element, '  Jane  ', 'change');

        expect(scope.model.value).toBe('Jane');
        expect(element.val()).toBe('Jane');
    });

    it('should trim on input when the field is not focused (autofill)', () => {
        const element = compileInput('');
        setDomValueAndTrigger(element, '  Autofill  ', 'input');

        expect(scope.model.value).toBe('Autofill');
        expect(element.val()).toBe('Autofill');
    });

    it('should not change the model when there is nothing to trim', () => {
        const element = compileInput('John');
        setDomValueAndTrigger(element, 'John', 'blur');

        expect(scope.model.value).toBe('John');
        expect(element.val()).toBe('John');
    });

    it('should trim to empty string when input contains only spaces', () => {
        const element = compileInput('');
        setDomValueAndTrigger(element, '   ', 'blur');

        expect(scope.model.value).toBe('');
        expect(element.val()).toBe('');
    });

    it('should not trim on compile, only on blur/change/autofill', () => {
        const element = compileInput('  Jane  ');

        expect(scope.model.value).toBe('  Jane  ');

        setDomValueAndTrigger(element, '  Jane  ', 'blur');

        expect(scope.model.value).toBe('Jane');
    });

    it('should remove listeners on destroy', () => {
        const element = compileInput('  test  ');
        scope.$destroy();
        element.val('  test  ');
        element.triggerHandler('blur');
        element.triggerHandler('change');
        element.triggerHandler('input');

        expect(scope.model.value).toBe('  test  ');
    });

    it('should trim whitespace edges', () => {
        const element = compileInput('');
        const raw = ' \t Juan \n ';
        setDomValueAndTrigger(element, raw, 'blur');

        expect(scope.model.value).toBe('Juan');
        expect(element.val()).toBe('Juan');
    });

    it('should trim all configured edge filler characters', () => {
        const fillers = [
            '\u2800', // Braille Pattern Blank
            '\u3164', // Hangul Filler
            '\u115F', // Hangul Choseong Filler
            '\u1160', // Hangul Jungseong Filler
            '\uFFA0', // Halfwidth Hangul Filler
            '\u200B', // Zero Width Space
            '\u200C', // Zero Width Non-Joiner
            '\u200D', // Zero Width Joiner
            '\uFEFF', // BOM / ZWNBSP
            '\u2060', // Word Joiner
            '\u00AD', // Soft Hyphen
            '\u180E' // Mongolian Vowel Separator
        ];

        fillers.forEach((filler) => {
            const element = compileInput('');
            setDomValueAndTrigger(element, `${filler}USUARIO TEST0${filler}`, 'blur');
            expect(scope.model.value).toBe('USUARIO TEST0');
            expect(element.val()).toBe('USUARIO TEST0');
        });
    });

    it('should keep internal spaces and only strip edge fillers', () => {
        const element = compileInput('');
        setDomValueAndTrigger(element, '\u3164USUARIO TEST0  ', 'change');

        expect(scope.model.value).toBe('USUARIO TEST0');
    });
});
