import { TestBed } from '@angular/core/testing';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { IbSliceUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-slice-utils.service';
describe('IbSliceUtilsService Test', () => {
    let service: IbSliceUtilsService;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [],
        });
        service = TestBed.inject(IbSliceUtilsService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    } );

    describe( 'When setDurationType is called', () => {
        it( 'should return correct stops and text for 2 stops', () => {
            const result = service.setDurationType( 2, 0 );
            expect( typeof result === 'object' ).toBeTruthy();
            expect( result ).toEqual( { stops: 2, text: 'SOME_AVAILABILITY_STOPSNUMBER_FILTER' } );
        } );
        it('should return correct stops and text for 1 stop', () => {
            const result = service.setDurationType( 1, 0 );
            expect( typeof result === 'object' ).toBeTruthy();
            expect( result ).toEqual( { stops: 1, text: 'AVAILABILITY_STOPSNUMBER_FILTER' } );
        } );
        it('should return correct stops and text for 1 tech stop', () => {
            const result = service.setDurationType( 0, 1 );
            expect( typeof result === 'object' ).toBeTruthy();
            expect( result ).toEqual( { stops: 1, text: 'AVAILABILITY_TECH_STOP' } );
        });
        it('should return correct text for nonstop flight', () => {
            const result = service.setDurationType( 0, 0 );
            expect( typeof result === 'object' ).toBeTruthy();
            expect( result ).toEqual( { stops: 0, text: 'AVAILABILITY_SLICE_INFO_NONSTOP_FLIGHT' } );
        });
    } );
    describe( 'getFlightFareClass', () => {
        it( 'should return "business" for BUSINESS_CLASS fare', () => {
            const result = service.getFlightFareClass( BookingAppConstants.FARE_CABIN_TYPE.BUSINESS_CLASS );
            expect( result ).toBe( 'business' );
        });

        it( 'should return "premium tourist" for TURIST_PREMIUM_T fare', () => {
            const result = service.getFlightFareClass( BookingAppConstants.FARE_CABIN_TYPE.TURIST_PREMIUM_T );
            expect( result ).toBe( 'premiumtourist' );
        });

        it( 'should return "premium economy" for TURIST_PREMIUM fare', () => {
            const result = service.getFlightFareClass( BookingAppConstants.FARE_CABIN_TYPE.TURIST_PREMIUM );
            expect( result ).toBe( 'premiumeconomy' );
        });

        it( 'should return "economy" for unknown fare types', () => {
            const result = service.getFlightFareClass( 'unknown_fare' );
            expect( result ).toBe( 'economy' );
        });

        it( 'should return "economy" for an empty string fare', () => {
            const result = service.getFlightFareClass( '' );
            expect( result ).toBe( 'economy' );
        });

    });
});
