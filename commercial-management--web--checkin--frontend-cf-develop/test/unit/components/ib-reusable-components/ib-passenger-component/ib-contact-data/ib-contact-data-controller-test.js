describe('ContactDataController test', function() {

    var scope, rootScope, controller, timeout;

    var bindings = {
        showData: {
            showUseForAll: {
                passengerId: '1',
                state: true,
                type: 'ADULT'
            }
        }
    };

    var controllerDependencies = {
        '$scope': {},
        '$timeout': {},
    };

    const fakeIbSessionConfigService = {
        isUserLogged: jasmine.createSpy('isUserLogged')
    };

    beforeEach(function() {
        angular.mock.module('ib-contact-data-module', ($provide) => {
            $provide.value('IbSessionConfigService', fakeIbSessionConfigService);
        });
        inject(function($controller, $rootScope) {
            rootScope = $rootScope;
            controllerDependencies.$scope = $rootScope.$new();
            controller = $controller('ContactDataController', controllerDependencies, bindings);
            controllerDependencies.$scope.$apply();
        });
    });

    describe('when state is checked', function() {
        it('should chek if state is true', function(done) {
            controller.showData.showUseForAll.state = true;
            expect(controller.showData.showUseForAll.state).toBe(true);
            done();
        });
        it('state to false', function(done) {
            spyOn(controllerDependencies.$scope, '$emit');
            controller.showData.showUseForAll.state = false;
            expect(bindings.showData.showUseForAll.state).toBe(false);
            expect(controllerDependencies.$scope.$emit).toBeDefined();
            done();
        });

    });

    describe('when useDataForAll is called', function() {
        it('should emit passengerId and type', function(done) {
            spyOn(controllerDependencies.$scope, '$emit');
            controller.useDataForAll();
            expect(controllerDependencies.$scope.$emit).toHaveBeenCalledWith('useDataForAll', undefined, undefined);
            done();
        });
    });

});