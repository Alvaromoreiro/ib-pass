describe('ContentPreprocessorService test', () => {
    let ContentPreprocessorService, deferred;

    beforeEach(() => {
        angular.mock.module('ib-content-parser-module', () => { });
        inject((_ContentPreprocessorService_, $q) => {
            ContentPreprocessorService = _ContentPreprocessorService_;
            deferred = $q.defer();
        });
    });

    describe('when processContent is called', () => {
        it('its returns correct content', () => {
            expect(ContentPreprocessorService.processContent('<a ib-link-content-parser href="#" target="_blank"')).toBeDefined();
            deferred.resolve();
        });

        it('its returns correct content', () => {
            expect(ContentPreprocessorService.processContent('<a ib-link-content-parser href="#" target="_blank"', 'test')).toBeDefined();
            deferred.resolve();
        });
    });
});
