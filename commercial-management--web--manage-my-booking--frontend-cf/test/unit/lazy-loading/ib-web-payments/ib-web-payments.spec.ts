import angular from 'angular';
import '../../../../src/lazy-loading/ib-web-payments';

describe('ib-web-payments-templates lazy-loading', () => {
    let $templateCache: angular.ITemplateCacheService;

    beforeEach(() => {
        angular.mock.module('ib-web-payments-templates');
    });

    beforeEach(inject(['$templateCache', (_$templateCache_: angular.ITemplateCacheService) => {
        $templateCache = _$templateCache_;
    }]));

    it('defined $templateCache', () => {
        expect($templateCache).toBeDefined();
    });
});
