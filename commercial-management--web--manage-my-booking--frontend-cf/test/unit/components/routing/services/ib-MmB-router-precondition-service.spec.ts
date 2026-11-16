describe('MmBRouterPreconditionsService', () => {
    let MmBRouterPreconditionsService, defaultState = '/ibmtdt', defaultTransitionEvaluator = angular.noop, defaultOtherwise = '/chktrp';

    let fakeAddOnService = {
        initAddOn: jasmine.createSpy('initAddOn').and.callFake(() => {
            return {};
        })
    };

    let fakeMmBUtilService = {
        getURLFirstParameterByName: jasmine.createSpy('getURLFirstParameterByName').and.callFake(() => {
            return 'hola';
        })
    }


    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-pmt-utils-module', 'ib-MmB-routing-module', ($provide) => {
            $provide.value('MmBAppConstants', {});
            $provide.value('AddOnService', fakeAddOnService);
            $provide.value('MmBUtilService', fakeMmBUtilService);
        });
        inject((_MmBRouterPreconditionsService_) => {
            MmBRouterPreconditionsService = _MmBRouterPreconditionsService_;
        });
    });

    describe('When registerPreCondition is called', () => {

        it('and state is null or is not a string, an excepcion should be thrown', (done) => {
            expect(() => {
                MmBRouterPreconditionsService.registerPreCondition(null, defaultTransitionEvaluator, defaultOtherwise);
            }).toThrow('Must provide state name');
            expect(() => {
                MmBRouterPreconditionsService.registerPreCondition(2, defaultTransitionEvaluator, defaultOtherwise);
            }).toThrow('Must provide state name');
            done();
        });

        it('and transitionEvaluator is null or is not a function, an excepcion should be thrown', (done) => {
            expect(() => {
                MmBRouterPreconditionsService.registerPreCondition(defaultState, null, defaultOtherwise);
            }).toThrow('Must provide transitionEvaluator');
            expect(() => {
                MmBRouterPreconditionsService.registerPreCondition(defaultState, 2, defaultOtherwise);
            }).toThrow('Must provide transitionEvaluator');
            done();
        });

        it('and state is already register in the service, an excepcion should be thrown', (done) => {
            MmBRouterPreconditionsService.preConditions[defaultState] = {};
            expect(() => {
                MmBRouterPreconditionsService.registerPreCondition(defaultState, defaultTransitionEvaluator, defaultOtherwise);
            }).toThrow('Pre-condition already registered');
            MmBRouterPreconditionsService.preConditions = {};
            done();
        });

        it('and state is valid and is not already registered in the service, the precondition should be registered', (done) => {
            var transitionEvaluator = () => {
                return true;
            };
            MmBRouterPreconditionsService.registerPreCondition(defaultState, transitionEvaluator, defaultOtherwise);
            expect(MmBRouterPreconditionsService.preConditions[defaultState].otherwise).toEqual(defaultOtherwise);
            expect(MmBRouterPreconditionsService.preConditions[defaultState].transitionEvaluator).toEqual(transitionEvaluator);
            MmBRouterPreconditionsService.preConditions = {};
            done();
        });
    });

    describe('When canTransition is called', () => {

        it('and state is not registered, return value should be true', (done) => {
            expect(MmBRouterPreconditionsService.canTransition(defaultState)).toBe(true);
            done();
        });

        it('and state is registered, return value should be transitionEvaluator returned value', (done) => {
            var transitionEvaluator = () => {
                return false;
            };
            MmBRouterPreconditionsService.registerPreCondition(defaultState, transitionEvaluator, defaultOtherwise);
            expect(MmBRouterPreconditionsService.canTransition(defaultState)).toBe(false);
            MmBRouterPreconditionsService.preConditions = {};
            done();
        });

    });

    describe('When otherwise is called', () => {

        it('and state is not registered, empty string should be returned', (done) => {
            expect(MmBRouterPreconditionsService.otherwise(defaultState)).toEqual('');
            done();
        });

        it('and state is registered, return value should be state otherwhise value', (done) => {
            MmBRouterPreconditionsService.registerPreCondition(defaultState, defaultTransitionEvaluator, defaultOtherwise);
            expect(MmBRouterPreconditionsService.otherwise(defaultState)).toBe(defaultOtherwise);
            MmBRouterPreconditionsService.preConditions = {};
            done();
        });

    });

});
