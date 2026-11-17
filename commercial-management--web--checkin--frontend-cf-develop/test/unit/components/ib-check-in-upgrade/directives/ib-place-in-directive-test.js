describe('placeIn directive', function () {
    var directive;
    var fakeWindow;
    var element;
    var reference;

    beforeEach(angular.mock.module('ib-check-in-upgrade-module', function ($provide) {
        fakeWindow = document.createElement('div');
        fakeWindow.innerWidth = 500;
        reference = document.createElement('div');
        reference.setAttribute('data-place-in-reference', '');
        reference.style.cssText = 'position:absolute;left:100px;width:200px;height:10px';
        element = document.createElement('div');
        element.setAttribute('place-in', 'w-center');
        element.setAttribute('data-breakpoint', '768');
        element.style.cssText = 'position:absolute;width:40px;height:10px';
        element.offset = jasmine.createSpy('offset');
        element.css = jasmine.createSpy('css');
        reference.appendChild(element);
        document.body.appendChild(reference);
        $provide.value('$window', fakeWindow);
    }));

    beforeEach(inject(function (placeInDirective) {
        directive = placeInDirective[0];
    }));

    afterEach(function () {
        if (reference.parentNode) {
            reference.parentNode.removeChild(reference);
        }
    });

    it('centers the element below the breakpoint and clears its position above it', function () {
        directive.link({}, element);

        expect(element.offset).toHaveBeenCalledWith({ left: 180 });

        fakeWindow.innerWidth = 1024;
        angular.element(fakeWindow).triggerHandler('resize');

        expect(element.css).toHaveBeenCalledWith({ left: '' });
    });
});