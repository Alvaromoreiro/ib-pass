describe('ibLinkContentParser Directive Test', function () {
    var scope, el, document, $anchorScroll, localStorage;

    var fakeMmBModalService = {
        showGenericModal: jasmine.createSpy()
    };

    beforeEach(function () {
        angular.mock.module('ib-content-parser-module', 'LocalStorageModule', function ($provide) {
            $provide.value('MmBModalService', fakeMmBModalService);
        });
    });

    describe('When form is submitted', function () {
        beforeEach(inject(function ($rootScope, $compile, $document, _localStorageService_) {
            scope = $rootScope.$new();
            document = $document;
            localStorage = _localStorageService_;
            el = $compile('<a class="ib-link" href="test" ib-link-content-parser></a>')(scope);
            scope.$apply();
        }));
        it('Check the directive when element isExternalLink', function (done) {
            scope.$digest();
            expect(el.attr('target')).toEqual('_blank');
            done();
        });
    });

    describe('When form is submitted', function () {
        beforeEach(inject(function ($rootScope, $compile, $document, _localStorageService_) {
            scope = $rootScope.$new();
            document = $document;
            localStorage = _localStorageService_;
            el = $compile('<a class="ib-link" ib-link-content-parser></a>')(scope);
            scope.$apply();
        }));
        it('Check the directive when element isModalLink', function (done) {
            scope.$digest();
            expect(el.attr('href')).toEqual('javascript:void(0)');
            done();
        });
    });

    describe('When form is submitted', function () {
        beforeEach(inject(function ($rootScope, $compile, $document, _$anchorScroll_, _localStorageService_) {
            scope = $rootScope.$new();
            document = $document;
            $anchorScroll = _$anchorScroll_;
            localStorage = _localStorageService_;
            el = $compile('<a class="ib-link" href="#test" ib-link-content-parser></a>')(scope);
            scope.$apply();
        }));
        it('Check the directive when click and element isInternalLink', function (done) {
            browserTrigger(el,'click');
            expect(el.attr('href')).toEqual('#test');
            scope.$digest();
            done();
        });
    });
});
