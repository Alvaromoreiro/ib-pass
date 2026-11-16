describe('IbHeaderComponentService test', () => {

    let $rootScope, IbHeaderComponentService;

    const fakeHeaderTransformer = {
        initHeader: jasmine.createSpy('initHeader').and.callFake(() => {
            return {};
        }),
        addSteps: jasmine.createSpy('addSteps').and.callFake(() => {
            return {};
        })
    };
    const fakeibGreyBarTransformer = {
        initGreyBar: jasmine.createSpy('initGreyBar').and.callFake(() => {
            return {};
        })
    };
    const fakeStepsTransformer = {
        initSteps: jasmine.createSpy('initSteps').and.callFake(() => {
            return {};
        })
    };
    const fakeibHeaderComponentServiceModel = {
        saveModel: jasmine.createSpy()
    };

    beforeEach(() => {
        angular.mock.module('ib-header-component-module', 'LocalStorageModule', ($provide) => {
            $provide.value('HeaderTransformer', fakeHeaderTransformer);
            $provide.value('ibGreyBarTransformer', fakeibGreyBarTransformer);
            $provide.value('StepsTransformer', fakeStepsTransformer);
            $provide.value('ibHeaderComponentServiceModel', fakeibHeaderComponentServiceModel);
        });
        inject((_$rootScope_, _IbHeaderComponentService_, _localStorageService_) => {
            $rootScope = _$rootScope_;
            IbHeaderComponentService = _IbHeaderComponentService_;
            $rootScope.$digest();
        });
    });

    describe('when functions is called ', () => {

        it('initializeHeader() is Called', (done) => {
            IbHeaderComponentService.initializeHeader({},{},{});
            expect(IbHeaderComponentService).toBeDefined();
            done();
        });
    });

});