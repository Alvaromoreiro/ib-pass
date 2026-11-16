
import angular from "angular";
class IbCModalServiceMock {
    showGenericComponentModal = jasmine.createSpy('showGenericComponentModal').and.returnValue({result:Promise.resolve(''), componentInstance: {
        dataModelRefund: undefined
    }});
};


describe('ibMmbManagePassengersInfoComponent test', () => {
    let $rootScope, $scope, controller;

    let fakeBookingDashboardConstants = {
        'TABS' : {'passengers': ''},
        'APIS_STATUS_COMPLETE' : ['status1']
    };
    let fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        updateDatalayerInfo: jasmine.createSpy()
    };
    let fakeMmBAppConstants = {
        PASSENGER_TYPES: {'infant': 'INFANT'}, 
        QUADRIGAM: {'ADD_APIS': 'ADD_APIS'},
        TOGGLE: {
            isActiveUmnr: true
        },
        UMNR_DATA: {
            SESSION_STORAGE_KEY: 'dataUmnrCompleted'
        }
    };
    let fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {VIEW: 'view'},
        DIGITAL_DATA_PROCESS: {
            MOAPIS: 'test'
        },
        DIGITAL_DATA_STEP: {
            MOAPIS: 'test'
        }
    };

    let fakeIbCModalService: IbCModalServiceMock;

    let fakeIbMmbUmnrUtilsService = {
        isActiveUMNR: jasmine.createSpy(),
        isDataUmnrCompleted: jasmine.createSpy(),
    };

    beforeEach(() => {
        fakeIbCModalService = new IbCModalServiceMock();
        angular.mock.module('ib-MmB-manage-passengers-info-module', 'LocalStorageModule', function($provide) {
            $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('IbCModalService', fakeIbCModalService);
            $provide.value('IbMmbUmnrUtilsService', fakeIbMmbUmnrUtilsService);
        });
        inject(($componentController, _$rootScope_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $componentController('ibMmbManagePassengersInfo', { $scope: $scope, $rootScope: $rootScope });
        });
    })

    describe('OnInit', () => {
        it('onInit with related empty' , () => {
            controller.related;
            controller.model = {};
            controller.$onInit();
            expect(controller.model.related).not.toBeDefined();
        });

        it('onInit with related with values' , () => {
            controller.related = [{'key': 'APIS_DOCUMENT_INFO'}];
            controller.model = {};
            controller.$onInit();
            expect(controller.model.related).toEqual(undefined);
        });
    });

    describe('methods', () => {
        it('changePassData its ok with ADULT' , (done) => {
            spyOn($scope, '$emit');
            controller.model = [{'passengerType': 'ADULT'}];
            controller.changePassData(0);
            expect($scope.$emit).toHaveBeenCalled();
            done();
        });

        it('changePassData its ok with INFANT' , (done) => {
            spyOn($rootScope, '$emit');
            controller.model = [{'passengerType': 'INFANT', 'relatedPassengerId': 'ADULT_01'}, {'passengerId': 'ADULT_01'}];
            controller.changePassData(0);
            expect($scope.$emit).toHaveBeenCalled();
            done();
        });

        it('goToPassengersTab its ok' , (done) => {
            spyOn($rootScope, '$emit');
            controller.goToPassengersTab(0);
            expect($rootScope.$emit).toHaveBeenCalledWith('changeTabEvent', '', 0);
            done();
        });

        it('statusApisInfoComplete its ok', (done) => {
            expect(controller.statusApisInfoComplete('passengerID', 'passengerID', 'status1')).toEqual(true);
            done();
        })
    });

});
