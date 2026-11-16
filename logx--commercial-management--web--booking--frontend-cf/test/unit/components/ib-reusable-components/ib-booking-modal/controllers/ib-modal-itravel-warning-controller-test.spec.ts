import * as angular from 'angular';

describe('ITravelWarningModalController test', () => {
    let controller,rootScope, scope;
    const controllerDependencies = {
        $scope: {$on:(functionName,modal)=>{}},
        $rootScope: {newFare:'',$broadcast:()=>{}},
        filter: {},
        window:{}
    };

    const fakeUibModalInstance = {
        dismiss: jasmine.createSpy('dismiss'),
        close: jasmine.createSpy('close'),
        result: Promise.resolve()
    }
    const fakeObject = {
        insuranceCountry: {
            requiredFields:[{}]
        },
        passengers:[{isComplete:false}],
        insurance:{},
        info:[{
            originalTotalPrice:1
        },{
            originalTotalPrice:2
        }]
    }
    const fakeDatalayerUtilsService = {
        sendDatalayerEvent: jasmine.createSpy('sendDatalayerEvent'),
        setProcessAndStep: jasmine.createSpy('setProcessAndStep'),
        sendDatalayerModalEvent: jasmine.createSpy('sendDatalayerModalEvent'),
    };

    beforeEach(() => {
        angular.mock.module('ib-booking-modal-module', ($provide) => {
            $provide.value('$uibModalInstance', fakeUibModalInstance);
            $provide.value('object', fakeObject);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
        });

        inject(($controller, _$rootScope_,object,$filter) => {
            rootScope = _$rootScope_;
            scope = _$rootScope_.$new();
            controllerDependencies.$scope = scope;
            controllerDependencies.$rootScope = rootScope;
            controllerDependencies.filter = $filter;
            controller = $controller('ITravelWarningModalController', controllerDependencies);
            scope.$digest();
        });

    });
    describe('when activate() is called ', () => {
        beforeEach(() => {
        });
        it('it will create a modal', () => {
            // controller.$onInit();
            expect(controller).toBeDefined();
            expect(fakeDatalayerUtilsService.sendDatalayerModalEvent).toHaveBeenCalled();
        });
    });
    describe('when checkItravelAgain() is called ', () => {
        beforeEach(() => {
        });
        it('', () => {
            controller.checkItravelAgain();
            expect(fakeUibModalInstance.dismiss).toHaveBeenCalled();
        });
    });
    describe('when acceptModal() is called ', () => {
        beforeEach(() => {
        });
        it('', () => {
            controller.accept();
            expect(fakeUibModalInstance.close).toHaveBeenCalled();
        });
    });
});
