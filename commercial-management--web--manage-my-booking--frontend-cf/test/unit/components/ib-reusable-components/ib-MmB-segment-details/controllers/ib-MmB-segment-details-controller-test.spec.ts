describe('MmBSegmentDetailsController test', function () {
    var $controller, $rootScope, $scope, controller, result;

    var fakeBookingManagementConstants = {
        'SEGMENT_OPTION': {
            'SEAT': 'SEAT',
            'BOARDING': 'BOARDING',
            'CHECKIN': 'CHECKIN',
            'MODIFY': 'MODIFY'
        },
        'SEGMENT_OPTION_STEP': {
            'SEAT': 'DO_SEAT_MAP',
            'BOARDING': 'DO_BOARDING',
            'FLY_NOW_CKI': 'DO_FLY_NOW_CKI',
            'FLY_NOW_MMB': 'DO_FLY_NOW_MMB',
            'FLIGHT_PASSENGER_CKI': 'FLIGHT_PASSENGER_CKI'
        }
    };

    var fakeAppConstants = {
        iconsRoute:'/test',
        lang:'es',
        defaultLang: 'us'
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-segment-details-module','ib-MmB-services-module', function($provide) {
            $provide.value('BookingManagementConstants', fakeBookingManagementConstants);
            $provide.value('MmBAppConstants', fakeAppConstants);
        });
        inject(function (_$controller_, _$rootScope_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $scope = $rootScope.$new();
            controller = $controller('MmBSegmentDetailsController', { $scope: $scope });
        });
    });

    describe('when activate() function is called', function () {
        it('should do nothing' , function() {
            controller.showPreHeader = false;
            spyOn(controller,'$onInit');
            controller.$onInit();
            expect(controller.$onInit).toHaveBeenCalled();
        });

        it('should set paIconUrl with correct value if showPreHeader is true' , function() {
            controller.showPreHeader = true;
            fakeAppConstants.lang = 'us';
            controller.$onInit();
            expect(controller.paIconUrl).toEqual('/test/puente_aereo/logo_pte_aero_short_us.png');
        });
    });

    describe('when selectOption() function is called', function () {
        it('should emit correct object' , function() {
            spyOn($scope,'$emit');
            controller.selectOption('selectedOption');
            expect($scope.$emit).toHaveBeenCalledWith('optionSelected', { segmentInfo: undefined, selectedOption: 'selectedOption' });
        });
    });

    describe('when showSegmentError() function is called', function () {
        it('should emit correct object' , function() {
            controller.segmentModel= {segmentStatus: 'test'};
            spyOn($scope,'$emit');
            controller.showSegmentError('selectedOption');
            expect($scope.$emit).toHaveBeenCalledWith('showSegmentError', 'test' );
        });
    })

    describe('when openFareConditionsModal() function is called', function () {
        it('should emit correct object' , function() {
            controller.segmentModel= {cabinClass: 'test'};
            spyOn($scope,'$emit');
            controller.openFareConditionsModal('big','yes','yes');
            expect($scope.$emit).toHaveBeenCalledWith('openFareConditionsModal', { size: 'big', template: 'yes', animation: 'yes', isBlocked: false, fareFamily: undefined });
        });
    })

    describe('when getOptionTitlel() function is called', function () {
        it('should return correct data' , function() {
            result = controller.getOptionTitle('SEAT');
            expect(result).toEqual('IBCOAC_MMB_SEGMENT_DETAILS_SEAT_TITLE');
        });
    })

    describe('when getOptionTitlel() function is called', function () {
        it('should return correct data' , function() {
            result = controller.getOptionTitle('BOARDING');
            expect(result).toEqual('IBCOAC_MMB_SEGMENT_DETAILS_BOARDING_TITLE');
        });
    })

    describe('when getOptionTitlel() function is called', function () {
        it('should return correct data' , function() {
            result = controller.getOptionTitle('CHECKIN');
            expect(result).toEqual('IBCOAC_MMB_SEGMENT_DETAILS_CHECKIN_TITLE');
        });
    })

    describe('when getOptionTitlel() function is called', function () {
        it('should return correct data' , function() {
            result = controller.getOptionTitle('MODIFY');
            expect(result).toEqual('IBCOAC_MMB_SEGMENT_DETAILS_MODIFY_TITLE');
        });
    })

    describe('when getOptionTitlel() function is called', function () {
        it('should return correct data' , function() {
            result = controller.getOptionTitle('');
            expect(result).toEqual('');
        });
    })
});
