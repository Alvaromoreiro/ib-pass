describe('ContentParserUtilsService Test', function () {
    var ContentParserUtilsService, $sce;

    var fakeExternalLink = {
        link: 'test/',
        href: '#'
    };

    var fakeInternalLink = {
        link: 'test/',
        href: '/'
    };

    var fakeModalLink = {
        link: 'test/'
    };

    var fakeInfo = [
        { code: 0 },
        { code: 1 },
        { code: 2 }
    ];

    beforeEach(function () {
        angular.mock.module('ib-content-parser-module', function () { });
        inject(function (_ContentParserUtilsService_, _$sce_) {
            $sce = _$sce_;
            ContentParserUtilsService = _ContentParserUtilsService_;
        });
    });

    describe('When isExternalLink() is called', function () {
        it('It return false if link contain href="#"', function (done) {
            var returnedInfo = ContentParserUtilsService.isExternalLink(fakeExternalLink);
            expect(returnedInfo).toEqual(false);
            done();
        });
    });

    describe('When isInternalLink() is called', function () {
        it('It return false if link not contain href="#"', function (done) {
            var returnedInfo = ContentParserUtilsService.isInternalLink(fakeInternalLink);
            expect(returnedInfo).toEqual(false);
            done();
        });
    });

    describe('When isModalLink() is called', function () {
        it('It return true if link not contain href', function (done) {
            var returnedInfo = ContentParserUtilsService.isModalLink(fakeModalLink);
            expect(returnedInfo).toEqual(true);
            done();
        });
    });

    describe('When searchModalContent() is called', function () {
        it('It return correct info index if have contentId', function (done) {
            var returnedInfo = ContentParserUtilsService.searchModalContent(fakeInfo, 2);
            expect(returnedInfo).toEqual({ code: 2});
            done();
        });

        it('It return correct info index if not have contentId', function (done) {
            var returnedInfo = ContentParserUtilsService.searchModalContent(fakeInfo);
            expect(returnedInfo).toEqual({ code: 0});
            done();
        });
    });
});
