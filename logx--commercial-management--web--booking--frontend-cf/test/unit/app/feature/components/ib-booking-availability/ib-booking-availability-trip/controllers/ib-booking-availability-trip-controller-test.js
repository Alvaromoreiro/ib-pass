describe('BookingAvailabilityTripController Test', () => {
    let scope, controller, q, fake;
    var fakeBookingAppConstants, fakeDatalayerConstants, mocks;

    // jasmine.getJSONFixtures().clearCache();
    // jasmine.getJSONFixtures().fixturesPath = 'base/test/mocks';
    // fakeBookingAppConstants = getJSONFixture('./constants/BookingAppConstants-mock.json');
    // fakeDatalayerConstants = getJSONFixture('./constants/DatalayerConstants-mock.json');

    var fakeBookingAppConstants = {
        LOGIN_ONB: 'ONB'
    };
    var fakeDatalayerConstants = {
        DATALAYER_INFO: {
            EVENT_CATEGORY: '',
            EVENT_ACTION: '',
            EVENT_LABEL: ''
        }
    };

    mocks = function () {

        this.BookingAppConstants = fakeBookingAppConstants;
        this.DatalayerConstants = fakeDatalayerConstants;
        this.BookingModalService = {
            showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(() => {
                let defer = q.defer();
                defer.resolve();
                return { result: defer.promise };
            })
        };
        this.DatalayerUtilsService = {
            removeDatalayerObjects: jasmine.createSpy('removeDatalayerObjects')
        };
        this.MonetateUtilsService = {
            addTrackProductDetail: jasmine.createSpy('addTrackProductDetail')
        };
    };

    beforeEach(() => {
        fake = new mocks();
        angular.mock.module('ib-booking-availability-module', 'LocalStorageModule', ($provide) => {
            $provide.value('BookingAppConstants', fake.BookingAppConstants);
            $provide.value('BookingModalService', fake.BookingModalService);
            $provide.value('DatalayerUtilsService', fake.DatalayerUtilsService);
            $provide.value('DatalayerConstants', fake.DatalayerConstants);
            $provide.value('MonetateUtilsService', fake.MonetateUtilsService);
        });

        inject(($controller, $rootScope, $q, localStorageService) => {
            q = $q;
            scope = $rootScope.$new();
            localStorageService.clearAll();

            controller = $controller('BookingAvailabilityTripController', {});

            scope.$digest();
        });

    });

    describe('When activate is called', () => {
        it(' and not exist getMarketOBPoints in localStorage', (done) => {
            inject(() => {
                controller.$onInit();
            });

            expect(controller.getMarketOBPoints).toBe(null);
            done();
        });

        it(' and exist getMarketOBPoints in localStorage', (done) => {
            inject((localStorageService) => {
                localStorageService.set('getMarketOBPoints', 'value');
                controller.$onInit();
            });

            expect(controller.getMarketOBPoints).toBe('value');
            done();
        });
    });


    describe('When openCalendarModal is called', () => {
        it(' and response is resolved', (done) => {

            controller.openCalendarModal();
            scope.$digest();

            expect(fake.DatalayerUtilsService.removeDatalayerObjects).toHaveBeenCalled();
            done();
        });

        it(' and response is rejected', (done) => {
            inject(() => {
                fake.BookingModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                    let defer = q.defer();
                    defer.reject();
                    return { result: defer.promise };
                });
            });

            controller.openCalendarModal();
            scope.$digest();

            expect(fake.DatalayerUtilsService.removeDatalayerObjects).toHaveBeenCalled();
            done();
        });
    });

});