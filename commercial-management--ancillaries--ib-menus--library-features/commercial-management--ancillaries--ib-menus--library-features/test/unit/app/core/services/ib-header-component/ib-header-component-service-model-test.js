describe('ibHeaderComponentServiceModel test', () => {

    let $rootScope, ibHeaderComponentServiceModel;

    const fakeRx = {
        Subject: function () {
            return {
                onNext: function () {
                    return true;
                },
                subscribe: function () {
                    return true;
                },
                unsubscribe: function () {
                    return true;
                }
            };
        }
    };
    const fakeModel = {
        greyBarModel: {},
        redBarModel: {},
        stepBarModel: {}
    };
    beforeEach(() => {
        angular.mock.module('ib-header-component-module', 'LocalStorageModule', ($provide) => {
            $provide.value('rx', fakeRx);
        });
        inject((_$rootScope_, _ibHeaderComponentServiceModel_, _localStorageService_) => {
            $rootScope = _$rootScope_;
            ibHeaderComponentServiceModel = _ibHeaderComponentServiceModel_;
            $rootScope.$digest();
        });
    });

    describe('when functions is called ', () => {

        it('saveModel() is Called', (done) => {
            ibHeaderComponentServiceModel.saveModel(fakeModel);
            expect(ibHeaderComponentServiceModel.model).toEqual(fakeModel);
            done();
        });
        it('getSubscriptionToHeaderComponentModel() is Called', (done) => {
            ibHeaderComponentServiceModel.getSubscriptionToHeaderComponentModel();
            expect(ibHeaderComponentServiceModel).toBeDefined();
            done();
        });
        it('unSubscriptionToHeaderComponentModel() is Called', (done) => {
            ibHeaderComponentServiceModel.unSubscriptionToHeaderComponentModel();
            expect(ibHeaderComponentServiceModel).toBeDefined();
            done();
        });
        it('getModelService() is Called', (done) => {
            ibHeaderComponentServiceModel.saveModel(fakeModel);
            const result = ibHeaderComponentServiceModel.getModelService();
            expect(result).toEqual(fakeModel);
            done();
        });
        it('cleanModelService() is Called', (done) => {
            ibHeaderComponentServiceModel.cleanModelService();
            expect(ibHeaderComponentServiceModel.model).toBeNull();
            done();
        });
        it('saveGreyModelService() is Called', (done) => {
            ibHeaderComponentServiceModel.saveModel(fakeModel);
            ibHeaderComponentServiceModel.saveGreyModelService({});
            expect(ibHeaderComponentServiceModel.model).toBeDefined();
            done();
        });
        it('saveRedModelService() is Called', (done) => {
            ibHeaderComponentServiceModel.saveModel(fakeModel);
            ibHeaderComponentServiceModel.saveRedModelService({});
            expect(ibHeaderComponentServiceModel.model).toBeDefined();
            done();
        });
        it('saveStepModelService() is Called', (done) => {
            ibHeaderComponentServiceModel.saveModel(fakeModel);
            ibHeaderComponentServiceModel.saveStepModelService({});
            expect(ibHeaderComponentServiceModel.model).toBeDefined();
            done();
        });
        it('getGreyModelService() is Called', (done) => {
            ibHeaderComponentServiceModel.saveModel(fakeModel);
            const grey = ibHeaderComponentServiceModel.getGreyModelService();
            expect(grey).toEqual({});
            done();
        });
        it('getRedModelService() is Called', (done) => {
            ibHeaderComponentServiceModel.saveModel(fakeModel);
            const red = ibHeaderComponentServiceModel.getRedModelService();
            expect(red).toEqual({});
            done();
        });
        it('getStepModelService() is Called', (done) => {
            ibHeaderComponentServiceModel.saveModel(fakeModel);
            const step = ibHeaderComponentServiceModel.getStepModelService();
            expect(step).toEqual({});
            done();
        });
    });

});