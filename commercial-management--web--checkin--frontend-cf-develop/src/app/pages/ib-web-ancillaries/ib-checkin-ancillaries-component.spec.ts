import * as angular from 'angular';
describe('test for ancillariesCtrl', () => {
    let ibAncillariesWeb;
    let bindings = {};
    const controllerDependencies: { scope: ng.IScope; rootScope: ng.IRootScopeService } = {
        scope: {} as ng.IScope,
        rootScope: {} as ng.IRootScopeService
    };
    beforeEach(angular.mock.module('LocalStorageModule', 'ib-checkin-ancillaries-module'));
    beforeEach(() => {
        inject((_$rootScope_, _$componentController_, _$window_) => {
            controllerDependencies.rootScope = _$rootScope_;
            controllerDependencies.scope = controllerDependencies.rootScope.$new();
            ibAncillariesWeb = _$componentController_('ibAncillariesWeb', controllerDependencies, bindings); //1 parametro nombre componente, el segundo las dependencias
            //y el tercero los bindings
            controllerDependencies.scope.$digest();
            //ibAncillariesWeb.$onInit();
        });
    });
    describe('ibAncillariesWeb is init', () => {
        it('ibAncillariesWeb should be defined', () => {
            expect(ibAncillariesWeb).toBeDefined();
            controllerDependencies.rootScope.$digest();
        });
    });
});
