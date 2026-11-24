describe('PmtCo2ICalculateService Test', () => {
    let PmtCo2CalcServiceHttp;
    let rootScope;
    const fakePmtCo2CalcProxy = {
        getCo2Calc: jasmine.createSpy()
    };
    const fakePmtConstants = {
        ENDPOINTS: {
            Co2CalculateURI: 'co2/getFootPrint',
            DEFAULT: {
                Co2CalculateURI: '/framework-services/rs/commons/v1/co2/getFootPrint'
            }
        }
    };
    const mockResponse = 'promesa';

    beforeEach(() => {
        angular.mock.module('ib-pmt-services-http-module', ($provide) => {
            $provide.value('PmtCo2CalcProxy', fakePmtCo2CalcProxy);
            $provide.value('PmtConstants', fakePmtConstants);
        });
        inject((_PmtCo2CalcServiceHttp_, $rootScope) => {
            PmtCo2CalcServiceHttp = _PmtCo2CalcServiceHttp_;
            rootScope = $rootScope;
        });
    });

    describe('when getCo2Calc Proxy resolves the promise', () => {
        beforeEach(inject(($q) => {
            fakePmtCo2CalcProxy.getCo2Calc = jasmine.createSpy('getCo2Calc').and.callFake(() => {
                const deferred = $q.defer();
                const response = deferred.promise;
                deferred.resolve(mockResponse);
                return response;
            });
        }));
        it('getCo2Calc resolves the promise OK', (done) => {
            PmtCo2CalcServiceHttp.getCo2Calc().then((responseData) => {
                expect(responseData).toEqual('promesa');
                done();
            });
            rootScope.$digest();
        });
    });

});