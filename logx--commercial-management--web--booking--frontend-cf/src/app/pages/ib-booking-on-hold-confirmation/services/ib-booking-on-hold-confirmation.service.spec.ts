import { TestBed } from '@angular/core/testing';
import { IbOnHoldConfirmationService } from '@src/app/pages/ib-booking-on-hold-confirmation/services/ib-booking-on-hold-confirmation.service';
import { CountriesListService } from '@src/app/shared/http-services/rdu-loc/ib-booking-countries-list.service';
import { StatesListService } from '@src/app/shared/http-services/rdu-loc/ib-booking-states-list.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { bookingInfoMock, transformedBookingInfo } from '@test/mocks/unit/app/pages/ib-booking-on-hold-confirmation/services/on-hold-booking-info-mock';
import { IbBookingOnHoldConfirmationTransformerService } from '@src/app/pages/ib-booking-on-hold-confirmation/services/ib-booking-on-hold-confirmation-transformer.service';

class CountriesListServiceMock {
    getCountriesList = jasmine.createSpy('getCountriesList');
}
class StatesListServiceMock {
    getStatesList = jasmine.createSpy('getStatesList');
}
class IbBookingOnHoldConfirmationTransformerServiceMock {
    transformOnHoldConfirmationInfo = jasmine.createSpy('transformOnHoldConfirmationInfo');
}

describe('IbBookingOnHoldConfirmationService', () => {
    let service: IbOnHoldConfirmationService;
    let fakeCommonsSessionStorageService: StorageServiceMock = new StorageServiceMock();
    let fakeCountriesListService = new CountriesListServiceMock();
    let fakeStatesListService = new StatesListServiceMock();
    let fakeIbBookingOnHoldConfirmationTransformerService = new IbBookingOnHoldConfirmationTransformerServiceMock();

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IbOnHoldConfirmationService,
                { provide: CountriesListService, useValue: fakeCountriesListService },
                { provide: StatesListService, useValue: fakeStatesListService },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: IbBookingOnHoldConfirmationTransformerService, useValue: fakeIbBookingOnHoldConfirmationTransformerService }
            ]
        });
        service = TestBed.inject(IbOnHoldConfirmationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('when confirmOnHoldOrder is called', () => {
        it('should return state list data if services returns 200', (done)=>{
            fakeCountriesListService.getCountriesList.and.returnValue(Promise.resolve('response'));
            fakeStatesListService.getStatesList.and.returnValue(Promise.resolve('response'));
            service.confirmOnHoldOrder({code:'ES'}).then((data)=>{
                expect(data).toEqual('response');
                done();
            }, done.fail);
        });
        it('should show an error if services rejects', (done)=>{
            fakeCountriesListService.getCountriesList.and.returnValue(Promise.reject('404 error'));
            fakeStatesListService.getStatesList.and.returnValue(Promise.reject('404 error'));
            service.confirmOnHoldOrder({code:'ES'}).then(()=>{}, (error)=>{
                expect(error).toEqual('404 error');
                done();
            });
        });
    });

    describe('when getBookingInfo is called', () => {
        it('should transform bookingInfo data', (done)=>{
            fakeCommonsSessionStorageService.set('bookingInfo', bookingInfoMock);
            fakeIbBookingOnHoldConfirmationTransformerService.transformOnHoldConfirmationInfo.and.returnValue(bookingInfoMock);
            service.getBookingInfo().then((data)=>{
                expect(data).toEqual(bookingInfoMock as any);
                expect(fakeCommonsSessionStorageService.get('cashAviosPossibilities')).toEqual(bookingInfoMock.generalInfo.cashAviosPossibilities);
                done();
            }, done.fail);
        });
    });

    describe('when getOriginDestination is called', () => {
        it('should format data accordingly when there is one slice', () => {
            let response = service.getOriginDestination(bookingInfoMock);
            expect(response).toEqual(transformedBookingInfo);
        });

    });

});
