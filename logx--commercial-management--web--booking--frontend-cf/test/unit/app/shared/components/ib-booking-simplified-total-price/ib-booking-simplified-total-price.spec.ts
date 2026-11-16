import angular from "angular";
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";
import { BookingAppConstants } from "@src/app/core/constants/ib-booking-constants";

class BookingModalServiceMock {
    showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => Promise.resolve());
}

const fakeFilter = () => {
    return (k:string) => k
}
class CommonsUserUtilsServiceMock {
    isIbPlusResponse = false;
    isSoftUserResponse = false;
    isIbZero = jasmine.createSpy('isIbZero').and.callFake(() => true);
    isIbPlus = jasmine.createSpy('isIbPlus').and.callFake(() => this.isIbPlusResponse);
    isSoftUser = jasmine.createSpy('isSoftUser').and.callFake(() => this.isSoftUserResponse);
}
const fakeElement = angular.element('<div>');

class ibSubscriptionPermissionServiceMock {
    reqMarketingPermission = jasmine.createSpy('reqMarketingPermission');
}

class ibBookingPriceDetailModalServiceMock {
    checkShouldShowCTA = jasmine.createSpy('checkShouldShowCTA');
}

let fakeScope;
let fakeEvent: Event;
let fakeRootScope;
let fakeBookingModalService;
let fakeCommonsUserUtilsService: CommonsUserUtilsServiceMock;
let fakeIbSubscriptionPermissionService: ibSubscriptionPermissionServiceMock;
let fakeLocalStorageService: StorageServiceMock;
let fakeIbBookingPriceDetailModalService: ibBookingPriceDetailModalServiceMock
let controller


describe('Test simplifiedTotalPrice', () => {
    fakeBookingModalService = new BookingModalServiceMock();
    fakeLocalStorageService = new StorageServiceMock();
    fakeCommonsUserUtilsService = new CommonsUserUtilsServiceMock();
    fakeIbSubscriptionPermissionService = new ibSubscriptionPermissionServiceMock();
    fakeIbBookingPriceDetailModalService = new ibBookingPriceDetailModalServiceMock();
    
    beforeEach(()=> {
        angular.mock.module('ib-booking-simplified-total-price-module', ($provide: any) => {
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('localStorageService', fakeLocalStorageService);
            $provide.value('$filter', fakeFilter);
            $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
            $provide.value('$element', fakeElement);
            $provide.value('BookingAppConstants', BookingAppConstants);
            $provide.value('ibSubscriptionPermissionService', fakeIbSubscriptionPermissionService);
            $provide.value('IbBookingPriceDetailModalService', fakeIbBookingPriceDetailModalService);
        });
        inject(function ($componentController, $rootScope) {
            fakeScope = $rootScope.$new();
            fakeRootScope = fakeScope;
            controller = $componentController('ibBookingSimplifiedTotalPrice',
                { $scope: fakeScope, $rootScope: fakeRootScope });
            fakeScope.$apply();
        })
    });

    describe('Test init component', () => {
        it('must be initialized', () => {
            controller.$onInit();
            expect(controller).toBeDefined();
        })

    });


});