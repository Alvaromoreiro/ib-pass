describe('Test of PmtAssFassAncillariesService', ()=>{
    let pmtAssFassAncillariesService, rootScope, scope, $q;

    const fakePmtAncillariesProxy = {
        getConfirmationAncillaries: jasmine.createSpy().and.callFake(() => {
            const deferred = $q.defer();
            const response = deferred.promise;
            deferred.resolve([]);
            return response;
        })
    };
    const fakePmtConstants = {
        ENDPOINTS: {
            DEFAULT: {
                ancillariesNewURI: 'newURI'
            }
        }
    };
    const fakeLocalStorageService = {
        get: jasmine.createSpy().and.callFake((key: string) => {
            if (key === 'flowId') {
                return 'flowId';
            }
            return null;
        })
    };
    const fakePmtUtilsService = {};
    const fakePmtHttpErrorFilter = {};

    beforeEach(()=>{
        angular.mock.module('ib-pmt-services-http-module', ($provide) => {
            $provide.value('PmtAncillariesProxy', fakePmtAncillariesProxy);
            $provide.value('PmtConstants', fakePmtConstants);
            $provide.value('localStorageService', fakeLocalStorageService);
            $provide.value('PmtUtilsService', fakePmtUtilsService);
            $provide.value('PmtHttpErrorFilter', fakePmtHttpErrorFilter);
        });

        inject((_PmtAssFassAncillariesService_, $rootScope, _$q_)=>{
            pmtAssFassAncillariesService = _PmtAssFassAncillariesService_;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            $rootScope.$apply();
            $q = _$q_;
        });
    });
    
    describe('when getConfirmationAncillaries is called', ()=> {
        it('should call v5 ancillaries endpoint', () => {
            pmtAssFassAncillariesService.getConfirmationAncillaries();

            rootScope.$digest();

            expect(fakePmtAncillariesProxy.getConfirmationAncillaries).toHaveBeenCalledWith('newURI', 'flowId');
        });
    });
});