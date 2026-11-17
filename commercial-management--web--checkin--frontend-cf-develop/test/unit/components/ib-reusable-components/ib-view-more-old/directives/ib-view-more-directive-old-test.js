describe('ibViewMoreOld directive', function () {
    var directive;
    var root;
    var link;
    var text;
    var fakeWindow;
    var wrapperPrototype;
    var querySelectorAllDescriptor;

    beforeEach(angular.mock.module('ib-view-more-old-module', function ($provide) {
        fakeWindow = document.createElement('div');
        $provide.value('$window', fakeWindow);
    }));

    beforeEach(inject(function (ibViewMoreOldDirective) {
        directive = ibViewMoreOldDirective[0];
        root = document.createElement('div');
        link = document.createElement('a');
        link.className = 'fc-collapse__moreInfo-link';
        text = document.createElement('div');
        text.className = 'ibe-collapse_moreInfo-text xui-collapse_moreInfo-text-close';

        var firstParagraph = document.createElement('p');
        var secondParagraph = document.createElement('p');
        firstParagraph.className = 'ibe-collapse_moreInfo-parr';
        secondParagraph.className = 'ibe-collapse_moreInfo-parr';
        firstParagraph.style.height = '35px';
        secondParagraph.style.height = '45px';
        text.appendChild(firstParagraph);
        text.appendChild(secondParagraph);
        root.appendChild(link);
        root.appendChild(text);
        document.body.appendChild(root);

        wrapperPrototype = Object.getPrototypeOf(angular.element(root));
        querySelectorAllDescriptor = Object.getOwnPropertyDescriptor(wrapperPrototype, 'querySelectorAll');
        wrapperPrototype.querySelectorAll = function (selector) {
            return this[0].querySelectorAll(selector);
        };
    }));

    afterEach(function () {
        if (querySelectorAllDescriptor) {
            Object.defineProperty(wrapperPrototype, 'querySelectorAll', querySelectorAllDescriptor);
        } else {
            delete wrapperPrototype.querySelectorAll;
        }
        if (root.parentNode) {
            root.parentNode.removeChild(root);
        }
    });

    it('opens and closes the text block when the link is clicked', function () {
        directive.link({}, root);
        var event = new MouseEvent('click', { bubbles: true, cancelable: true });

        link.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
        expect(text.style.height).toBe('80px');
        expect(text.classList.contains('xui-collapse_moreInfo-text-open')).toBe(true);
        expect(link.classList.contains('xui-collapse__moreInfo-link-open')).toBe(true);

        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        expect(text.style.height).toBe('3em');
        expect(text.classList.contains('xui-collapse_moreInfo-text-close')).toBe(true);
        expect(link.classList.contains('xui-collapse__moreInfo-link-open')).toBe(false);
    });

    it('recalculates the expanded height on resize', function () {
        directive.link({}, root);
        text.classList.remove('xui-collapse_moreInfo-text-close');
        text.classList.add('xui-collapse_moreInfo-text-open');

        fakeWindow.dispatchEvent(new Event('resize'));

        expect(text.style.height).toBe('80px');
    });
});