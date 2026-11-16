import angular from "angular";
import { filterFake } from '@test/mocks/constants/filterTranslate-mock';

describe('MmBManageHotelHolidaysInfoController test', () => {
    var controller, $scope, localStorageService, $rootScope;

    var fakeBookingInfo1 = {
        order: {
            bookingReferences: [{
                reference: 'V6X6LR',
                provider: 'IB'
            }]
        }
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-manage-hotel-holidays-info-module', 'LocalStorageModule', ($provide) => {
            $provide.value('$filter', filterFake);
        });
        inject(function (_$rootScope_, _localStorageService_, $controller) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            localStorageService.set('bookingInfo', fakeBookingInfo1);
            localStorageService.set('PNR', 'V6X6LR');
            localStorageService.set('checkinSurname', 'test');
            $rootScope.appMarket = 'ES';
            $rootScope.appLang = 'ES';
            controller = $controller('MmBManageHotelHolidaysInfoController', {
                $scope: $scope,
                $rootScope: $rootScope,
            });
        });

    });

    describe('when the component is created', () => {
        it('Should set popoverHolidays correctly', () => {
            controller.$onInit();
            expect(controller.popoverHolidays[1].path).toEqual(null);
        });
    });
});