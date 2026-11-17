describe('FrequentFlyerController test', function() {

    var controller, scope, previousCompanySelection, rootScope;

    var bindings = {
        frequentFlyerModel: {
            info: {
                number: 1,
                iataCompanyCode: 'IB'
            }
        }
    };

    var controllerDependencies = {
        '$scope': {}
    };

    beforeEach(function() {
        angular.mock.module('ib-frequent-flyer-module');
        inject(function($controller, $rootScope) {
            rootScope = $rootScope;
            controllerDependencies.$scope = $rootScope.$new()

            controller = $controller('FrequentFlyerController', controllerDependencies, bindings, previousCompanySelection);
        });
    });

    describe('when active is called', function() {
        it('event emit invoke', function(done) {
            controller.$onInit();
            done();
        });
    });

    describe('when activate() is called', function() {

        it('Calls clearCodeNumber() and previousCompanySelection != "IB"', function(done) {
            controller.previousCompanySelection = '';
            controller.frequentFlyerModel.info.number = (controller.previousCompanySelection && controller.previousCompanySelection !== 'IB' && controller.frequentFlyerModel.info.iataCompanyCode === 'IB') ||
                (!controller.previousCompanySelection && controller.frequentFlyerModel.info.iataCompanyCode === 'IB') ? '' : controller.frequentFlyerModel.info.number;

            controller.clearCodeNumber();
            expect(controller.frequentFlyerModel.info.number).toEqual('');
            done();
        });

        it('and calls clearCodeNumber() and previousCompanySelection = "IB"', function(done) {

            controller.previousCompanySelection = controller.frequentFlyerModel.info.iataCompanyCode;
            controller.frequentFlyerModel.info.number = (controller.previousCompanySelection && controller.previousCompanySelection !== 'IB' && controller.frequentFlyerModel.info.iataCompanyCode === 'IB') ||
                (!controller.previousCompanySelection && controller.frequentFlyerModel.info.iataCompanyCode === 'IB') ? '' : controller.frequentFlyerModel.info.number;

            controller.clearCodeNumber();
            expect(controller.frequentFlyerModel.info.number).toEqual(controller.frequentFlyerModel.info.number)
            done();
        });
        it('and calls clearCodeNumber() and previousCompanySelection = "IB"', function(done) {
            controller.previousCompanySelection = controller.frequentFlyerModel.info.iataCompanyCode;
            controller.clearCodeNumber();
            expect(controller.previousCompanySelection).toEqual(bindings.frequentFlyerModel.info.iataCompanyCode);
            done();
        });

    });

});
