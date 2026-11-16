import { TestBed } from '@angular/core/testing';
import { IbBookingMetasearchUtilsService } from '@pages/ib-booking-availability-page/components/ib-booking-availability-legacy/services/ib-booking-metasearch-utils.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BkiStorageConstants } from '@core/constants/ib-booking-storage-constants';
import { WINDOW_TOKEN } from '@core/config/ib-booking-app-tokens';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
class WindowMock {
    public location = {
        search: ''
    };
}

class ScopeMock {
    $emit = jasmine.createSpy('$emit');
}

// @ts-ignore
interface ServiceTest extends IbBookingMetasearchUtilsService {
    CommonsSessionStorageService: StorageServiceMock;
    redirectOpenJawsToMulticity: (info: any) => boolean;
    redirectToSlicedAvailability: (info: any) => boolean;
    window: WindowMock;

}


describe('IbBookingMetasearchUtilsService', () => {
    let service: ServiceTest;
    let scopeMock: any;


    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IbBookingMetasearchUtilsService,
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock },
                { provide: WINDOW_TOKEN, useClass: WindowMock }
            ]
        });
        service = TestBed.inject(IbBookingMetasearchUtilsService) as unknown as ServiceTest;
        scopeMock = new ScopeMock();
    });

    describe('redirectFlightSelection', () => {
        beforeEach(()=> {
            const {CommonsSessionStorageService} = service;
            CommonsSessionStorageService.clear();
            CommonsSessionStorageService.set(BkiStorageConstants.OPEN_JAW, false);
            scopeMock = new ScopeMock();
        });
        it('should call redirectToSlicedAvailability when is no other action taken', () => {
            service.redirectFlightSelection(scopeMock);
            expect(scopeMock.$emit).toHaveBeenCalledWith('forceSlicedAvailability');
        });

        it('should call redirectOpenJawsToMulticity and change query search', ()=>{
            const {CommonsSessionStorageService, window, redirectFlightSelection} = service;
            CommonsSessionStorageService.set(BkiStorageConstants.OPEN_JAW, true);
            redirectFlightSelection(scopeMock);
            expect(window.location.search).toContain('TripType=MultiCity');
            expect(scopeMock.$emit).not.toHaveBeenCalledWith('forceSlicedAvailability');
        });
    });


});