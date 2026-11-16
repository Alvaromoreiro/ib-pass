import { TestBed } from "@angular/core/testing";
import { BookingAppConstants } from "@src/app/core/constants/ib-booking-constants";
import { IbBookingPetsFlowService } from "@src/app/shared/services/ib-utils/ib-bookig-pets-flow.service";
import { UrlUtilsService } from "@src/app/shared/services/ib-utils/ib-booking-url-utils.service";
class UrlUtilsServiceMock {
    public paramsMap = {
        [BookingAppConstants.BOOKING_PARAMS_NAMES.PETS_FLIGHT[0]]: 'false'
    }
    getURLFirstParameterByName = jasmine.createSpy( 'getURLFirstParameterByName' ).and.callFake( (paramName) => {
        return this.paramsMap[paramName] ?? paramName;
     } );
}
//@ts-ignore
interface ServiceTest extends IbBookingPetsFlowService {
    UrlUtilsService: UrlUtilsServiceMock
}

describe('IbBookingPetsFlowService', () => {
    let service: ServiceTest;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: UrlUtilsService, useClass:  UrlUtilsServiceMock},
                IbBookingPetsFlowService
            ]

        });

        service = TestBed.inject(IbBookingPetsFlowService) as unknown as ServiceTest;
    });

    describe('When isPetsFlow is called', () => {
        it('should return true when petsFlowToggle is active and pets flight parameter is true', () => {
            service.UrlUtilsService.paramsMap[BookingAppConstants.BOOKING_PARAMS_NAMES.PETS_FLIGHT[0]] = 'true';
            expect(service.isPetsFlow).toBeTrue();
        });
        it('should return false when petsFlight parameter is false', () => {
            service.UrlUtilsService.paramsMap[BookingAppConstants.BOOKING_PARAMS_NAMES.PETS_FLIGHT[0]] = 'false';
            expect(service.isPetsFlow).toBeFalse();
        });
    });
       

})