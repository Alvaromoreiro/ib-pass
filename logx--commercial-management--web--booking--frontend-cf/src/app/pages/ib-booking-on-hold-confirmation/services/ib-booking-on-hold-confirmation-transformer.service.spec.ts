import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { IbBookingOnHoldConfirmationTransformerService } from '@pages/ib-booking-on-hold-confirmation/services/ib-booking-on-hold-confirmation-transformer.service';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { AJSCurrencyService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { TranslateServiceMock } from '@test-mocks/Services/TranslateServiceAngularMock';
import { onHoldInfoMock } from '@test/mocks/unit/app/pages/ib-booking-on-hold-confirmation/services/on-hold-booking-info-mock';
import { IbOnHoldConfirmationUtilsService } from '@src/app/pages/ib-booking-on-hold-confirmation/services/ib-booking-on-hold-confirmation-utils.service';
import dayjs from 'dayjs';

class CurrencyServiceMock {
    formatPrice = jasmine.createSpy().and.callFake((symbol, value) => {
        return `${value} €`;
    });
    formatAvios = jasmine.createSpy().and.callFake((symbol, value) => {
        return `${value} Avios`;
    });
    getCurrenciesAsMap = jasmine.createSpy().and.returnValue({
        EUR:{
            suffixSymbol: false,
            decimalSeparator: '',
            numberDecimals: 0,
            groupingSeparator: '',
            currencySymbol: '€',
            description: '5€'
        }});
}
class BookingUtilsServiceMock {
    getRelatedContent = jasmine.createSpy('getRelatedContent').and.returnValue({CONFIRM_ONHOLD_CONDITIONS:{}});
    getBackGroundURL = jasmine.createSpy('getBackGroundURL').and.returnValue('background/MAD.jpg');
    getCompanyURL = jasmine.createSpy('getCompanyURL').and.returnValue({
        logo:'iconos/logo_IB_pos.svg',
        logoMin: null
    });
    getFormatedDate = jasmine.createSpy('getFormatedDate').and.returnValue({
        formatedDate: null
    });
}
class DomSanitizerMock {
    bypassSecurityTrustHtml = jasmine.createSpy('bypassSecurityTrustHtml').and.callFake((value) => {
        return `${value}`;
    });
}

class IbOnHoldConfirmationUtilsServiceMock {
    isMultiCityTrip = jasmine.createSpy('isMultiCityTrip').and.returnValue(false);
}

describe('IbBookingOnHoldConfirmationTransformerService', () => {
    let service: IbBookingOnHoldConfirmationTransformerService;
    let fakeCurrencyService = new CurrencyServiceMock();
    let fakeBookingUtilsService = new BookingUtilsServiceMock();
    let fakeCommonsSessionStorageService: StorageServiceMock = new StorageServiceMock();
    let fakeTranslateService = new TranslateServiceMock();
    let fakeDomSanitizer = new DomSanitizerMock();
    let fakeIbOnHoldConfirmationUtilsServiceMock = new IbOnHoldConfirmationUtilsServiceMock();

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers:[
                IbBookingOnHoldConfirmationTransformerService,
                { provide: AJSCurrencyService, useValue: fakeCurrencyService },
                { provide: AJSBookingUtilsService, useValue: fakeBookingUtilsService },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: TranslateService, useValue: fakeTranslateService },
                { provide: DomSanitizer, useValue: fakeDomSanitizer },
                { provide: IbOnHoldConfirmationUtilsService, useValue: fakeIbOnHoldConfirmationUtilsServiceMock}
            ]
        });
        service = TestBed.inject(IbBookingOnHoldConfirmationTransformerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('When transformOnHoldConfirmationInfo is called', () => {
        beforeEach(()=>{
            fakeCommonsSessionStorageService.set('bookingInfo', onHoldInfoMock);
        });
        it('it will return a transformed import response object', ()=>{
            const passengerResult = onHoldInfoMock.passengers.map( passenger => ( {
                ...passenger,
                personalInfo: {
                    ...passenger.personalInfo,
                    lastSurname: ''
                }
            } ) );
            let resultValue = service.transformOnHoldConfirmationInfo( onHoldInfoMock, 'J6GV6' );
            expect(resultValue.generalInfo.remainingTime).toEqual(dayjs().add(4316, 'minute').format());
            expect(resultValue.generalInfo.flightInfo.MADBCN20250615112500.segments.length).toEqual(1);
            expect(resultValue.generalInfo.flightInfo.MADBCN20250615112500.departureCity.code).toEqual('MAD');
            expect(resultValue.generalInfo.flightInfo.BCNMAD20250629091500.segments.length).toEqual(1);
            expect(resultValue.generalInfo.flightInfo.BCNMAD20250629091500.departureCity.code).toEqual('BCN');
            expect(resultValue.passengers).toEqual(passengerResult);
            expect(resultValue.warnings).toEqual(onHoldInfoMock.warnings);
        });
    });
});
