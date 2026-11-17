describe('ibLinkContentParser directive', function () {
    var directive;
    var attrs;
    var linkElement;
    var utils;
    var storage;
    var anchorScroll;
    var modalService;
    var linkElement;

    beforeEach(angular.mock.module('ib-content-parser-module', function ($provide) {
        attrs = { href: '/terms#conditions', contentInfo: 'terms', contentid: 'modal-1' };
        linkElement = document.createElement('a');
        utils = {
            isExternalLink: jasmine.createSpy('isExternalLink').and.returnValue(false),
            isInternalLink: jasmine.createSpy('isInternalLink').and.returnValue(false),
            isModalLink: jasmine.createSpy('isModalLink').and.returnValue(false),
            searchModalContent: jasmine.createSpy('searchModalContent').and.returnValue({})
        };
        storage = { get: jasmine.createSpy('get').and.returnValue({ modals: [] }) };
        anchorScroll = jasmine.createSpy('anchorScroll');
        modalService = { showGenericModal: jasmine.createSpy('showGenericModal') };
        $provide.value('ContentParserUtilsService', utils);
        $provide.value('localStorageService', storage);
        $provide.value('$anchorScroll', anchorScroll);
        $provide.value('ModalService', modalService);
        $provide.value('$document', {});
    }));

    beforeEach(inject(function (ibLinkContentParserDirective) {
        directive = ibLinkContentParserDirective[0];
    }));

    it('opens external links in a new tab without intercepting their click', function () {
        utils.isExternalLink.and.returnValue(true);
        directive.link({}, linkElement, attrs);
        linkElement.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        expect(linkElement.getAttribute('target')).toBe('_blank');
    });

    it('scrolls to the fragment for internal links', function () {
        utils.isInternalLink.and.returnValue(true);
        directive.link({}, linkElement, attrs);
        var event = new MouseEvent('click', { bubbles: true, cancelable: true });

        linkElement.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
        expect(anchorScroll).toHaveBeenCalledWith('conditions');
    });

    it('rewrites modal links and loads the logged-in GDPR content key', function () {
        attrs.contentInfo = 'gdprInfo';
        storage.get.and.callFake(function (key) {
            return key === 'userLogged' ? true : { modals: [] };
        });
        utils.isModalLink.and.returnValue(true);
        directive.link({}, linkElement, attrs);

        linkElement.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        expect(linkElement.getAttribute('href')).toBe('javascript:void(0)');
        expect(attrs.contentInfo).toBe('gdprInfoIBPRIVACIBP');
        expect(attrs.template).toBe('ib-generic-external-modal.html');
        expect(storage.get).toHaveBeenCalledWith('gdprInfoIBPRIVACIBP');
    });
});