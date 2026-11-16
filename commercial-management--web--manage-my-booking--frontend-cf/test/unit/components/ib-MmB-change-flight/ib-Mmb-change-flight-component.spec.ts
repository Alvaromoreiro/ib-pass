
describe('ib-Mmb-change-flight-controller test', () => {

    var $componentController, $rootScope, $scope, controller, $uibModalInstance, $localStorageService;

    var fakeMmBModalService = {
        'showGenericModal': jasmine.createSpy(),
        'showWaitingModal': jasmine.createSpy(),
        'finishWaiting': jasmine.createSpy(),
        'showGenericError': jasmine.createSpy()
    };
    var fakeChangeFlightService = {
        'initializeModelInfo': jasmine.createSpy('initializeModelInfo').and.callFake(() => {
            return fakeChangeFlightModel;
        }),
        'getFlightAvailability': jasmine.createSpy().and.callFake((model) =>  {
            var deferred = $q.defer();
            if(model.correct){
                deferred.resolve(availavilityResponse);
            }else{
                deferred.reject('KO');
            }

            return deferred.promise;
        }),
        'getTimeZoneList': jasmine.createSpy('getTimeZoneList').and.callFake(() => {
            return '';
        }),
    };
    var fakeChangeFlightModel = {
        selectedSegmentInfo: {
            departure: {
                code: ''
            },
            arrival: {
                code: ''
            }
        },
        availabilityInfo: 'availabilityInfo',
        searchEngineModel: {
            selectedDate: '',
            selectedTimeZone :''
        },
        hasAvailability: false,
        initializeModel: jasmine.createSpy('initializeModel').and.callFake(() => {
            return fakeChangeFlightModel
        })
    };
    var fakeMmBAppConstants = {
        QUADRIGAM: {
            'CHANGE_FLIGHT': 'TCADVS',
            'CHANGE_FLIGHT_DISPO': 'TCFLPA',
        },
        PAGES_URL: {
            'FLIGHT_CONFIRMATION': '/tcfrev'
        }
    };
    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'updateDigitalDataWithQuadrigam': jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(() => { }),
        'updateDatalayerViewEvent': jasmine.createSpy('updateDatalayerViewEvent').and.callFake(() => { }),
        'setProcessAndStep': jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy()
    };
    var fakeDatalayerConstants = {
        DATALAYER_INFO: {
            DEPARTURE_AIRPORT: 'aeropuertoOrigen',
            ARRIVAL_AIRPORT: 'aeropuertoDestino',
            TOTAL_AVAILABILITY: 'resultadosBusqueda'
        },
        DATALAYER_EVENT_TYPES: {
            VIEW: 'view'
        },
        DIGITAL_DATA_PROCESS: {
            TCADVS: 'TCADVS',
            TCFLPA: 'TCFLPA'
        },
        DIGITAL_DATA_STEP: {
            TCADVS: 'TCADVS',
            TCFLPA: 'TCFLPA'
        }
    };
    var fakeMmBUtilService = {
        'isUserLogged':  jasmine.createSpy()
    };
    var $q, $location;
    var availavilityResponse = {
        'slices':[

        ]
    }

    beforeEach(() => {
        angular.mock.module('ib-Mmb-change-flight-module', 'LocalStorageModule', function($provide) {
            $provide.value('ChangeFlightService', fakeChangeFlightService);
            $provide.value('ChangeFlightModel', fakeChangeFlightModel);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
        });
        inject(function (_$componentController_, _$rootScope_, _localStorageService_, _$q_, _$location_) {
            $localStorageService = _localStorageService_;
            $q = _$q_,
            $componentController = _$componentController_;
            $rootScope = _$rootScope_;
            $location = _$location_
            $scope = $rootScope.$new();
            $uibModalInstance = jasmine.createSpyObj('$uibModalInstance', ['close', 'dismiss']);
            spyOn($location, 'path');
            fakeMmBModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() => {
                return {
                    result: $q.when({})
                };
            });
            controller = $componentController('ibChangeFlightComponent',  {
                $scope: $scope,
                $rootScope: $rootScope,
                $uibModalInstance: $uibModalInstance,
                $localStorageService: $localStorageService
            });
        });
    });

    describe('When $onInit method is called', () => {

        var modelInitialized = fakeChangeFlightService.initializeModelInfo();
        it('The model should be defined', (done) => {
            controller.$onInit();
            expect(controller.model).toBeDefined();
            expect(modelInitialized).toEqual(fakeChangeFlightModel);
            done();
        });
        it('MmBModalService.finishWaiting() is called', (done) => {
            expect(controller.model.selectedSegmentInfo).toEqual(fakeChangeFlightModel.selectedSegmentInfo);
            expect(controller.model.timeZonesList).toEqual(fakeChangeFlightModel.timeZonesList);
            expect(controller.model.searchEngineModel).toEqual(fakeChangeFlightModel.searchEngineModel);
            done();
        });
    });
    describe('when searchAvailavility() is called', () => {
        it('ChangeFlightService.getFlightAvailability() is called with vm.model with correct resolve', (done) => {
            controller.model.searchEngineModel = {
                selectedDate: '',
                selectedTimeZone :''
            };
            controller.model.correct = true;
            $rootScope.$broadcast('daySelectedInfo', {selectedDate:'1',selectedTimeZone:'2'});
            $rootScope.$digest();
            controller.model.hasAvailability = true;
            controller.model.selectedDate = '';
            controller.model.selectedTimeZone = '';
            controller.model.availabilityInfo = {};
            expect(controller.model.selectedDate).toBeDefined();
            expect(controller.model.selectedTimeZone).toBeDefined();
            expect(controller.model.availabilityInfo).toEqual({});
            done();
        });
        it('ChangeFlightService.getFlightAvailability() is called with vm.model and the service fail', (done) => {
            controller.model.searchEngineModel = {
                selectedDate: '',
                selectedTimeZone :''
            };
            controller.model.correct = false;
            $rootScope.$broadcast('daySelectedInfo', {selectedDate:'1',selectedTimeZone:'2'});
            $rootScope.$digest();
            controller.model.hasAvailability = true;
            controller.model.selectedDate = '';
            controller.model.selectedTimeZone = '';
            controller.model.availabilityInfo = {};
            expect(controller.model.selectedDate).toBeDefined();
            expect(controller.model.selectedTimeZone).toBeDefined();
            expect(controller.model.availabilityInfo).toEqual({});
            done();
        });
    });
    describe('when changeZoneList() is called', () => {
        it('ChangeFlightService.getTimeZoneList() is called', (done) => {
            $rootScope.$broadcast('changeZoneList', {});
            controller.model.timeZonesList = [{}];
            expect(controller.model.timeZonesList).toEqual([{}]);
            done();
        });
    });
    describe('when selectSlice() is called', () => {
        it('Should execute  $location.path function correctly with FLIGHT_CONFIRMATION', (done) => {
            $rootScope.$broadcast('sliceSelected', {});
            expect($location.path).toHaveBeenCalled();
            done();
        });
    });
});
