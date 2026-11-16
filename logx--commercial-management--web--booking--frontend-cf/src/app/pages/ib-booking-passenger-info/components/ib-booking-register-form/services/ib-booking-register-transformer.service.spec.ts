import { TestBed } from '@angular/core/testing';
import { IbBookingRegisterFormDataService } from '@src/app/pages/ib-booking-passenger-info/components/ib-booking-register-form/services/ib-booking-register-form-data.service';
import { IbBookingRegisterTransformerService } from '@src/app/pages/ib-booking-passenger-info/components/ib-booking-register-form/services/ib-booking-register-transformer.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';

const fakeIbBookingRegisterFormDataService = {
    getEmail: jasmine.createSpy('getEmail').and.returnValue('test@gmail.com'),
    getPassword: jasmine.createSpy('getPassword').and.returnValue('password'),
    getName: jasmine.createSpy('getName').and.returnValue('Juan'),
    getLastName: jasmine.createSpy('getLastName').and.returnValue('Sanchez'),
    getMarketingCheck: jasmine.createSpy('getMarketingCheck').and.returnValue(true)
};

describe('IbBookingRegisterTransformerService', () => {
    let service: IbBookingRegisterTransformerService;
    let originalMarket: string;
    let originalLang: string;

    beforeAll(() => {
        originalMarket = BookingAppConstants.market;
        originalLang = BookingAppConstants.lang;
    });

    afterAll(() => {
        (BookingAppConstants as any).market = originalMarket;
        (BookingAppConstants as any).lang = originalLang;
    });

    beforeEach(() => {
        (BookingAppConstants as any).market = 'ES';
        (BookingAppConstants as any).lang = 'es';

        jasmine.clock().install();
        jasmine.clock().mockDate(new Date('2026-05-29T10:00:00Z'));

        TestBed.configureTestingModule({
            providers: [
                IbBookingRegisterTransformerService,
                { provide: IbBookingRegisterFormDataService, useValue: fakeIbBookingRegisterFormDataService }
            ]
        });
        service = TestBed.inject(IbBookingRegisterTransformerService);
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('Call transformFormRegister', () => {
        it('should return an EnrolMemberRequestV02 with the user-provided data', () => {
            const result = service.transformFormRegister();

            expect(result.person.personName.firstName).toEqual('Juan');
            expect(result.person.personName.familyName).toEqual('Sanchez');
            expect(result.person.email).toEqual('test@gmail.com');
            expect(result.securityProfile.password).toEqual('password');
        });

        it('should resolve countryOfResidence from BookingAppConstants.market', () => {
            const result = service.transformFormRegister();
            expect(result.person.countryOfResidence).toEqual('ES');
        });

        it('should resolve prefLanguage from BookingAppConstants.lang', () => {
            const result = service.transformFormRegister();
            expect(result.person.prefLanguage).toEqual('es');
        });

        it('should set enrolmentType to "NORMAL_ENROL"', () => {
            const result = service.transformFormRegister();
            expect(result.person.enrolmentType).toEqual('NORMAL_ENROL');
        });

        it('should set marketingPermissions from the register form data service', () => {
            const result = service.transformFormRegister();
            expect(result.marketingPermissions).toBeTrue();
        });

        it('should hardcode termsAndConditions.version to "2"', () => {
            const result = service.transformFormRegister();
            expect(result.termsAndConditions.version).toEqual('2');
        });

        it('should set termsAndConditions.acceptedDate in YYYY-MM-DD format', () => {
            const result = service.transformFormRegister();
            expect(result.termsAndConditions.acceptedDate).toEqual('2026-05-29');
        });

        it('should fallback to defaultMarket if market is undefined', () => {
            (BookingAppConstants as any).market = undefined;
            (BookingAppConstants as any).defaultMarket = 'ES';
            const result = service.transformFormRegister();
            expect(result.person.countryOfResidence).toEqual('ES');
        });

        it('should set invitationIdentifier to null', () => {
            const result = service.transformFormRegister();
            expect(result.invitationIdentifier).toBeNull();
        });

        it('should set secondFamilyName to empty string', () => {
            const result = service.transformFormRegister();
            expect(result.person.personName.secondFamilyName).toEqual('');
        });
    });
});