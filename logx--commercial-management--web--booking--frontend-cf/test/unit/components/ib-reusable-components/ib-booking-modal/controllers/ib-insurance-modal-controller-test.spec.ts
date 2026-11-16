import * as angular from 'angular';
import {StorageServiceMock} from '../../../../../mocks/Services/StorageServiceMock';

describe('InsuranceModalController test', () => {
    let controller,rootScope, scope;
    let fakeSessionStorage = new StorageServiceMock();
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

    beforeEach(() => {
        angular.mock.module('ib-booking-modal-module', ($provide) => {
            $provide.value('localStorageService', fakeSessionStorage);
            $provide.value('$uibModalInstance', fakeUibModalInstance);
            $provide.value('object', fakeObject);
        });

        inject(($controller, _$rootScope_,object) => {
            rootScope = _$rootScope_;
            scope = _$rootScope_.$new();
            controllerDependencies.$scope = scope;
            controllerDependencies.$rootScope = rootScope;
            controller = $controller('InsuranceModalController', controllerDependencies);
            scope.$digest();
        });

    });
    describe('when activate() is called ', () => {
        beforeEach(() => {
            fakeSessionStorage.set('selectedInsurance',true);
        });
        it('it will create a modal', () => {
            // controller.$onInit();
            expect(controller).toBeDefined();
            expect(controller.model.insurance).toEqual({originalTotalPrice:1});
        });
    });
    describe('when closeModal() is called ', () => {
        beforeEach(() => {
        });
        it('', () => {
            controller.close();
            expect(fakeUibModalInstance.dismiss).toHaveBeenCalled();
        });
    });
    xdescribe('when updateInfoModal() is called ', () => {
        beforeEach(() => {
        });
        it('', () => {
            spyOn(controllerDependencies.$scope,"$on");
            controllerDependencies.$scope.$on('updateInfoModal',{});
            // controller.updateInfoModal();
            expect(controller.model.insurance).toEqual({originalTotalPrice:1});
        });
    });
    describe('when changeInsuranceCountry() is called ', () => {
        beforeEach(() => {
        });
        it('', () => {
            controller.changeInsuranceCountry('ES');
            expect(controller.model.isModalLoading).toBeTrue();
        });
    });
    describe('when completeForm() is called ', () => {
        beforeEach(() => {
            controller.insuranceForm = {
                $submitted: true,
                $valid:true
            }
        });
        it('', () => {
            controller.completeForm();
            expect(fakeUibModalInstance.close).toHaveBeenCalledWith('cancel');
        });
    });
});
