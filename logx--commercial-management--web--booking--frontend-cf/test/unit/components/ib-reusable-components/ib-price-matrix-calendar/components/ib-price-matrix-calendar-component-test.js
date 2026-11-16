describe('ibPriceMatrixCalendar Component test', () => {
    let element;
    const fakeCurrencyService = {
        formatPriceWithoutSimbol: jasmine.createSpy('formatPriceWithoutSimbol').and.callFake(() => {
            return 'priceFormatted';
        })
    };
    const BookingPriceMatrixTransformer = {
        getCommercialsellingDataByMarket: jasmine.createSpy(),
        getURLFirstParameterByName: jasmine.createSpy(),
        getEndpoint: jasmine.createSpy(),
        getDeviceType: jasmine.createSpy(),
        getBackGroundURL: jasmine.createSpy(),
        getRelatedContent: jasmine.createSpy()
    };

    beforeEach(() => {
        angular.mock.module('ib-price-matrix-calendar', 'ib-commons-utils-module', ($provide) => {
            $provide.value('BookingAppConstants', {});
            $provide.value('BookingPriceMatrixTransformer', BookingPriceMatrixTransformer);
            $provide.value('CurrencyService', fakeCurrencyService);
        });
        inject(($rootScope, $compile, $injector, $templateCache, _BookingAppConstants_) => {
            const scope = $rootScope.$new();
            element = angular.element('<ib-price-matrix-calendar></ib-price-matrix-calendar>');
            //in template cache is where are stored the app templates
            $templateCache.put(_BookingAppConstants_.templatesRoute + 'ib-price-matrix-calendar.html', '<p>TestText</p>');
            element = $compile(element)(scope);
            scope.$apply();
        });
    });

    it('should render the text', (done) => {
        expect(element.find('p').text()).toBe('TestText');
        done();
    });

});
