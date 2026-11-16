import { TestBed } from "@angular/core/testing";
import { CallBookingFareServiceMock } from '@test/mocks/class/CallBookingFareService.mock';
import { CallBookingFare } from "@src/app/shared/http-services/sse-avm/ib-call-booking-fare.service";
import { BookingFareService } from "@src/app/shared/services/ib-booking-fare/ib-booking-fare.service";
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import { BkiStorageConstants } from "@src/app/core/constants/ib-booking-storage-constants";
import { BookingAppConstants } from "@src/app/core/constants/ib-booking-constants";
import { BookingAvailabilityConstants } from "@src/app/core/constants/ib-booking-availability-constants";
import { DigitalDataService } from "@src/app/shared/services/ib-datalayer/services/ib-digital-data.service";

class BookingUtilServiceMock {
    addDigitalDataInfo = jasmine.createSpy('addDigitalDataInfo').and.callFake(() => {});
}
// @ts-ignore
interface ServiceTest extends  BookingFareService{
    CallBookingFare: CallBookingFareServiceMock,
    CommonsSessionStorageService: StorageServiceMock,
    DigitalDataService: BookingUtilServiceMock
}


describe ("BookingFareService test", () => {
    let service: ServiceTest;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers:[
                {provide: CallBookingFare, useClass:  CallBookingFareServiceMock},
                {provide: CommonsSessionStorageService, useClass: StorageServiceMock},
                {provide: DigitalDataService, useClass: BookingUtilServiceMock},
                
            ]
        });
        service = TestBed.inject(BookingFareService) as any;
    });


    it('Test succesfull response in general case',  (done)=> {
        const {  DigitalDataService, CallBookingFare, CommonsSessionStorageService } = service;
        service.getBookingFare({}).then((response) => {
            expect(DigitalDataService.addDigitalDataInfo).toHaveBeenCalled();
            expect(CommonsSessionStorageService.get(BkiStorageConstants.OB_DISCOUNT_INFO)).toEqual([]);
            expect(CommonsSessionStorageService.get(BkiStorageConstants.FF_CONDITIONS_INFO)).toEqual(CallBookingFare.response.fareFamilyConditions);
            expect(CommonsSessionStorageService.get(BkiStorageConstants.FARE)).toEqual(CallBookingFare.response);
            done();
        });
    })

    it('Test succesfull with OB',  (done)=> {
        const { CallBookingFare, CommonsSessionStorageService } = service
        CommonsSessionStorageService.set(BkiStorageConstants.USER_LOGGED,  BookingAppConstants.LOGIN_ONB);
        CallBookingFare.response.offers[0].accrualQuote.qualificationPoints = 1;

        service.getBookingFare({}).then((response) => {
            expect(CommonsSessionStorageService.get(BkiStorageConstants.OB_POINTS)).toEqual(CallBookingFare.response.offers[0].accrualQuote);
            done();
        });
    })

    it('Test succesfull with OBDiscountInfo',  (done)=> {
        const { CallBookingFare, CommonsSessionStorageService } = service;
        CallBookingFare.response.offers[0].specialDiscountsApplied = [{type: BookingAvailabilityConstants.CORPORATE, discountType: 'discountType'}];
        (CallBookingFare.response.offers[0] as any).priceSpecialDiscount = {totalDiscount: 1} as any;
        
        service.getBookingFare({}).then((response) => {
            expect(CommonsSessionStorageService.get(BkiStorageConstants.OB_DISCOUNT_INFO)).toEqual([{corporateDiscountType: 'discountType', discount: 1}]);
            done();
        });
    })
});
