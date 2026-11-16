import { BookingPassengerInfoErrorManager } from "@src/app/pages/ib-booking-passenger-info/services/ib-booking-passenger-info-error-management-service";
import angular from "angular";
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";
const BKIConstants  =  require('../../../../mocks/constants/BookingAppConstants-mock.json')

class RootScopeMock {
    public $broadcast = jasmine.createSpy('$broadcast')
};
class BookingPassengerInfoServiceMock {
    public goToRecoveryFlow = jasmine.createSpy('goToRecoveryFlow');
}
class BookingModalServiceMock {
    public showGenericModal = jasmine.createSpy('showGenericModal').and.returnValue({result : Promise.resolve()});
    public showGenericError = jasmine.createSpy('showGenericError').and.returnValue({result : Promise.resolve()});
}
class LocationMock {
    public path = jasmine.createSpy('path')
}

let fakeRootScope: RootScopeMock;
let fakeBookingPassengerInfoService: BookingPassengerInfoServiceMock;
let fakeBookingModalService: BookingModalServiceMock;
let fakeLocation: LocationMock;
const CommonsSessionStorageService = new StorageServiceMock()
let service: BookingPassengerInfoErrorManager;

describe('BookingPassengerInfoErrorManager test', () => {

    beforeEach(() => {
        // Init module
        fakeRootScope = new RootScopeMock();
        fakeBookingPassengerInfoService = new BookingPassengerInfoServiceMock();
        fakeBookingModalService = new BookingModalServiceMock();
        fakeLocation = new LocationMock();
        CommonsSessionStorageService.clear();

        angular.mock.module('ib-booking-passenger-info-module', ($provide) => {
            $provide.value('$rootScope', fakeRootScope);
            $provide.value('BookingPassengerInfoService', fakeBookingPassengerInfoService);
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('$location', fakeLocation);
            $provide.value('CommonsSessionStorageService', CommonsSessionStorageService);
            $provide.value('BookingAppConstants', BKIConstants);
        });

        inject((_BookingPassengerInfoErrorManager_) => {
            service = _BookingPassengerInfoErrorManager_;
        })
    });

    describe('When error data does not match any configuration', () => {
        it('and errorData is null', () => {
            fakeBookingModalService.showGenericError = jasmine.createSpy('showGenericError').and.returnValue({ result: Promise.resolve() });
            service.processError(null);
            expect(fakeBookingModalService.showGenericError).toHaveBeenCalled()

        });
        it('and errorData has default treatment', () => {
            const error = { errorCode: 0, internalErrorCode: 'Def', needsTranslate: false }
            fakeBookingModalService.showGenericError = jasmine.createSpy('showGenericError').and.returnValue({ result: Promise.resolve() });
            service.processError(error);
            expect(fakeBookingModalService.showGenericError).toHaveBeenCalled()

        });
    });

    it('When errordata matches resident error', () => {
        const error = { errorCode: 400, internalErrorCode: 'PAC_UTILS_E0005', needsTranslate: false }
        service.processError(error);
        expect(fakeRootScope.$broadcast).toHaveBeenCalledWith('updateResidentErrors', error);
    });

    it('When errordata matches unexpected technical exception', () => {
        const error = { errorCode: 500, internalErrorCode: 'FRAM_B0006', needsTranslate: false }
        service.processError(error);
        expect(fakeBookingModalService.showGenericError).toHaveBeenCalledWith({
            title: 'PASSENGERS_INTERNAL_ERROR_TITLE',
            message: 'PASSENGERS_INTERNAL_ERROR_MESSAGE',
            needsTranslate: true
        });
    });
    describe('When error data matches extendedDirect Warning', () => {
        it('When user accepts', (done) => {
            fakeBookingModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.returnValue({result : Promise.resolve()});
            fakeBookingPassengerInfoService.goToRecoveryFlow.and.callFake(() => {
                expect(fakeBookingModalService.showGenericModal).toHaveBeenCalled()
                done();
            })
            const error = { errorCode: 410, internalErrorCode: 'SSE_ORM_9122', needsTranslate: false }
            service.processError(error);
        });
         it('When user cancels', (done) => {
             const error = { errorCode: 410, internalErrorCode: 'SSE_ORM_9122', needsTranslate: false }
            fakeBookingModalService.showGenericModal= jasmine.createSpy('showGenericModal').and.returnValue({result : Promise.reject()});
            fakeRootScope.$broadcast.and.callFake((...args) => {
                expect(fakeBookingModalService.showGenericModal).toHaveBeenCalled()
                expect(args).toEqual(['backToMainRoot', true]);
                done();
            })
             service.processError(error);
        });

    });
    describe('When error data matches availability Warning', () => {
        beforeEach(() => {
            CommonsSessionStorageService.clear();
        })
        it('When user accepts', (done) => {
            fakeBookingModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.returnValue({result : Promise.resolve()});
            fakeLocation.path.and.callFake((...args) => {
                expect(fakeBookingModalService.showGenericModal).toHaveBeenCalled()
                expect(args).toEqual(['/availability']);
                done();
            })
            const error = { errorCode: 409, internalErrorCode: 'SSE_ORM_9002', needsTranslate: false }
            service.processError(error);
        });
        it('When user accepts and is Metasearch', (done) => {
            CommonsSessionStorageService.set('searchFlightType',BKIConstants.SEARCH_FLIGHT_TYPE.METASEARCH)
            fakeBookingModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.returnValue({result : Promise.resolve()});
            fakeLocation.path.and.callFake((...args) => {
                expect(fakeBookingModalService.showGenericModal).toHaveBeenCalled()
                expect(args).toEqual(['/availability']);
                const metaerror = CommonsSessionStorageService.get('metasearchOrderError');
                expect(metaerror).toBe(true);
                done();
            })
            const error = { errorCode: 409, internalErrorCode: 'SSE_ORM_9002', needsTranslate: false }
            service.processError(error);
        });
         it('When user cancels', (done) => {
             const error = { errorCode: 409, internalErrorCode: 'SSE_ORM_9002', needsTranslate: false }
            fakeBookingModalService.showGenericModal= jasmine.createSpy('showGenericModal').and.returnValue({result : Promise.reject()});
            fakeRootScope.$broadcast.and.callFake((...args) => {
                expect(fakeBookingModalService.showGenericModal).toHaveBeenCalled()
                expect(args).toEqual(['backToMainRoot', true]);
                done();
            })
             service.processError(error);
        });

    });


})

