describe('BookingCalendarController test', function () {

    var controller, $scope, fakeBookingModalService, controllerDependencies, fakeBookingCalendarService, fakeServiceResponse, rootScope, $q;

    fakeBookingModalService = { 'closeAllCurrentModals': jasmine.createSpy() }
    fakeBookingCalendarService = { 'initRedemptionCalendar': jasmine.createSpy() };
    let fakeDatalayerUtilsService = {
        addDataLayerInfo: jasmine.createSpy(),
        sendDatalayerEvent:jasmine.createSpy(),
        updateDatalayerInteractionEvent:jasmine.createSpy()
    };
    let fakeDatalayerConstants ={
        'DATALAYER_INFO': {
            'EVENT': 'event',
            'EVENT_CATEGORY':'eventCategory',
            'EVENT_ACTION':'eventAction',
            'EVENT_LABEL':'eventLabel'
        },
        'DATALAYER_VALUES': {
            'CALENDAR':'Calendario',
            'INBOUND':'vuelta',
            'OUTBOUND':'ida'
        },
        'DATALAYER_EVENT_TYPES': {
            'VIEW': 'view',
            'LINK': 'link',
            'CLICK':'click'
        }

    }
    controllerDependencies = {
        '$scope': {},
        '$rootScope': {},

    };

    fakeServiceResponse = {
        'sliderModel': 'fakeSliderModel',
        'dates': ['fakeMonth','SecondfakeMonth'],
        'slice': 'fakeSliceModel',
        'monthIndex': 0,

    }

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-booking-calendar-module', function ($provide) {
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('BookingCalendarService', fakeBookingCalendarService);
            $provide.value('DatalayerUtilsService',fakeDatalayerUtilsService);
            $provide.value('DatalayerConstants',fakeDatalayerConstants);
        });
        inject(function ($rootScope, _$q_, $controller) {
            $q =_$q_;
            fakeBookingModalService.closeAllCurrentModals = jasmine.createSpy('closeAllCurrentModals').and.callFake(function () {
                angular.noop();
            });
            fakeBookingCalendarService.initRedemptionCalendar = jasmine.createSpy('initRedemptionCalendar').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(fakeServiceResponse);
                return deferred.promise;
            });

            rootScope = $rootScope;
            controllerDependencies.$scope = $rootScope.$new();
            $scope = $rootScope.$new();
            controllerDependencies.$rootScope = $rootScope;
            controller = $controller('BookingCalendarController', controllerDependencies);
            controller.originDestinations = {
                'origin':'PAR',
                'destination':'MAD'
            }
        });
    });


    describe('When the user clicks on monthly view and the controller inits the component', function () {

        xit('and call the service and this response ok and resolve the promise', function (done) {
            controller.$onInit();
            rootScope.$digest();
            expect(controller.model.actualSlice).toEqual({ 'sliderModel': 'fakeSliderModel', 'slice': 'fakeSliceModel', 'matrixModel': 'fakeMonth' });
            expect(controller.loadingGrid).toBe(false);
            done();
        });

        it('and call the service and this response ko and reject the promise', function (done) {
            fakeBookingCalendarService.initRedemptionCalendar = jasmine.createSpy('initRedemptionCalendar').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject({'error':'mockError'});
                return deferred.promise;
            });

            controller.$onInit();
            rootScope.$digest();
            expect(controller.loadingGrid).toBe(false);
            done();
        });
    });

    describe('When the user changes the month on the slider', function(){

        it('and the controller listen the event and changes the month',function(){
            controller.$onInit();
            rootScope.$digest();
            controllerDependencies.$scope.$emit('calendarChangeMonth',1);
            expect(controller.model.actualSlice.matrixModel).toEqual('SecondfakeMonth');
            expect(controller.model.monthIndex).toBe(1);

        });
    });
});
