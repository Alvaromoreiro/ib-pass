describe('PmtCo2InfoService Test', () => {
    let PmtCo2InfoService;
    let rootScope;

    const fakePmtCo2InfoProxy = {
        getCo2Info: jasmine.createSpy()
    };
    const fakePmtConstants = {
        ENDPOINTS: {
            co2InfoURI: 'co2/getFootPrint',
            DEFAULT: {
                co2InfoURI: '/framework-services/rs/commons/v1/co2/getFootPrint'
            }
        }
    };
    const mockResponse = 'promesa';

    beforeEach(() => {
        angular.mock.module('ib-pmt-services-http-module', ($provide) => {
            $provide.value('PmtCo2InfoProxy', fakePmtCo2InfoProxy);
            $provide.value('PmtConstants', fakePmtConstants);
        });
        inject((_PmtCo2InfoService_, $rootScope) => {
            PmtCo2InfoService = _PmtCo2InfoService_;
            rootScope = $rootScope;
        });
    });

    describe('when getCo2Info Proxy resolves the promise', () => {
        beforeEach(inject(($q) => {
            fakePmtCo2InfoProxy.getCo2Info = jasmine.createSpy('getCo2Info').and.callFake(() => {
                const deferred = $q.defer();
                const response = deferred.promise;
                deferred.resolve(mockResponse);
                return response;
            });
        }));
        it('getCo2Info resolves the promise OK', (done) => {
            PmtCo2InfoService.getCo2Info().then((responseData) => {
                expect(responseData).toEqual('promesa');
                done();
            });
            rootScope.$digest();
        });
    });

});