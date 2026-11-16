import { TestBed } from '@angular/core/testing';
import { IbBookingUpsellingUtilsService } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/components/ib-booking-sliced-upselling/services/ib-booking-upselling-utils.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbCNormalizePipe } from 'ib-web-commons/pipes';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { Pipe } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { AJSGetDestinationsService } from '@src/app/shared/http-services/rdu-loc/ib-booking-areas-cities-list-bridge.service';
@Pipe({
    name: 'translate'
})
export class IbCNormalizePipeMock implements PipeTransform {
    public name = 'translate';

    public transform (query: string, ...args: any[]): unknown {
        return query.toLowerCase();
    }
};
const destinationAreas = require( './mocks/destinationAreasCitiesList.json' );
const { operators } = require( '../../feature/components/ib-booking-sliced-upselling-fare/mocks/ib-booking-sliced-upselling-fare.mocks.json' );
const trip = {
    info: {
        selectedFareFamily: {
            commercialNameES: 'basica'
        }
    },
    destinationCountry: 'ES',
    originCountry: 'ES'
} as AvailabilityTransformerModel.SelectedSlice;
const fares = [
    'basica',
    'basica-level',
    'optima',
    'confort',
    'optima-flex',
    'turista-premium-optima',
    'turista-premium-optima-flex',
    'business-optima',
    'business-confort'
];
class AJSGetDestinationsServiceMock {
    getDestinationAreasCitiesList =  jasmine.createSpy('getDestinationAreasCitiesList').and.returnValue(Promise.resolve(destinationAreas));
}

describe('IbBookingUpsellingUtilsService Test', () => {
    let service: IbBookingUpsellingUtilsService;
    let fakeIbCNormalizePipe;
    let fakeCommonsSessionStorageService;
    beforeEach( async () => {
        fakeIbCNormalizePipe = new IbCNormalizePipeMock();
        fakeCommonsSessionStorageService = new StorageServiceMock();
        TestBed.configureTestingModule({
            providers: [
                { provide: IbCNormalizePipe, useValue: fakeIbCNormalizePipe },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: AJSGetDestinationsService, useValue: new AJSGetDestinationsServiceMock()}

            ],
        } );
        fakeCommonsSessionStorageService.set('destinationAreasCitiesList', destinationAreas);
        service = TestBed.inject(IbBookingUpsellingUtilsService);
    });
    describe( 'When private normalizeFareName method is called', () => {
        it( 'should return a string', () => {
            const normalizeText = service[ 'normalizeFareName' ]( '' );
            expect( typeof normalizeText ).toBe( 'string' );
        });
    });
    describe( 'When public isForbiddenUpsell method is called', () => {
        it( 'should return a boolean', () => {
            const isForbiddenUpsell = service.isForbiddenUpsell( 'business-optima', 'business-confort' );
            expect( typeof isForbiddenUpsell ).toBe( 'boolean' );
            expect( isForbiddenUpsell ).toBeFalse();
        });
    });
    describe( 'When public isAnyValidOperator method is called', () => {
        it( 'should return a boolean', () => {
            const isAnyValidOperator = service.isAnyValidOperator( operators );
            expect( typeof isAnyValidOperator ).toBe( 'boolean' );
            expect( isAnyValidOperator ).toBeTrue();
        });
    });
    describe( 'When public checkUpsellingAvailableFares method is called', () => {
        it( 'should return a boolean', () => {
            const checkUpsellingAvailableFares = service.checkUpsellingAvailableFares( 'business-confort' );
            expect( typeof checkUpsellingAvailableFares ).toBe( 'boolean' );
            expect( checkUpsellingAvailableFares ).toBeTrue();
        });
    });
    describe( 'When public getInfoToShow method is called with respective commercialName', () => {
        fares.forEach( ( fare ) => {
            it( `should check ${fare}`, (done) => {
                trip.info.selectedFareFamily.commercialNameES = fare;
                service.getInfoToShow(trip).then((getInfoToShow) => {
                    expect( typeof getInfoToShow ).toBe( 'object' );
                    expect(typeof getInfoToShow.imgToshow).toEqual('string');
                    done();
                }, ()=> done.fail())
            });
        } );
    });
    describe( 'When public getInfoToShow method is called with exclusion origin or destination rare areas', () => {
        it( 'with destionationZone !== "LATAM" && originZone !== "ES" should show ', (done) => {
            const thisTrip = { ...trip };
            thisTrip.destinationCountry = 'JP';
            thisTrip.originCountry = 'US';
            thisTrip.info.selectedFareFamily.commercialNameES = fares[5];
            service.getInfoToShow(thisTrip).then((getInfoToShow) => {
                expect(getInfoToShow.fareExtrasToShow).toEqual(BookingAppConstants.UPSELLING.FARE.ECONOMY_OPTIMA_FLEX);
                done();
            });
        });
        it( 'with from business to optima with MA and MX should not return info to show', (done) => {
            const thisTrip = { ...trip };
            thisTrip.originCountry = 'MA';
            thisTrip.destinationCountry = 'MX';
            thisTrip.info.selectedFareFamily.commercialNameES = fares[7];
            service.getInfoToShow(thisTrip).then((getInfoToShow) => {
                expect(getInfoToShow).toEqual(null);
                done();
            }, ()=> done.fail())

        });
        it( 'with from business to optima with ES and MA should return info to show', (done) => {
            const thisTrip = { ...trip };
            thisTrip.originCountry = 'ES';
            thisTrip.destinationCountry = 'MA';
            thisTrip.info.selectedFareFamily.commercialNameES = fares[7];
            service.getInfoToShow( thisTrip ).then((getInfoToShow) => {
                expect(getInfoToShow.fareExtrasToShow).toEqual(BookingAppConstants.UPSELLING.FARE.BU_CONFORT);
                done();
            }, ()=> done.fail())
        });
        it( 'with from business to optima with MX and PR should not return info to show', (done) => {
            const thisTrip = { ...trip };
            thisTrip.originCountry = 'MX';
            thisTrip.destinationCountry = 'PR';
            thisTrip.info.selectedFareFamily.commercialNameES = fares[7];
            service.getInfoToShow( thisTrip ).then((getInfoToShow) => {
                expect(getInfoToShow).toEqual(null);
                done();
            }, ()=> done.fail())



        });
        it( 'with from business to optima with MA and ES should not return info to show', (done) => {
            const thisTrip = { ...trip };
            thisTrip.originCountry = 'MA';
            thisTrip.destinationCountry = 'ES';
            thisTrip.info.selectedFareFamily.commercialNameES = fares[7];
            service.getInfoToShow( thisTrip ).then((getInfoToShow) => {
                expect(getInfoToShow).toEqual(null);
                done();
            }, ()=> done.fail())

        });
        it( 'with from business to optima with PR and ES should not return info to show', (done) => {
            const thisTrip = { ...trip };
            thisTrip.originCountry = 'PR';
            thisTrip.destinationCountry = 'ES';
            thisTrip.info.selectedFareFamily.commercialNameES = fares[7];
            service.getInfoToShow( thisTrip ).then((getInfoToShow) => {
                expect(getInfoToShow).toEqual(null);
                done();
            }, ()=> done.fail())

        });
        it( 'with from business to optima with US and US should return info to show', (done) => {
            const thisTrip = { ...trip };
            thisTrip.originCountry = 'US';
            thisTrip.destinationCountry = 'US';
            thisTrip.info.selectedFareFamily.commercialNameES = fares[7];
            service.getInfoToShow( thisTrip ).then((getInfoToShow) => {
                expect(getInfoToShow.fareExtrasToShow).toEqual(BookingAppConstants.UPSELLING.FARE.BU_CONFORT_LATAM);
                done();
            }, ()=> done.fail())

        });
        it( 'with from business to optima with US and ES should return info to show', (done) => {
            const thisTrip = { ...trip };
            thisTrip.originCountry = 'US';
            thisTrip.destinationCountry = 'ES';
            thisTrip.info.selectedFareFamily.commercialNameES = fares[7];
            service.getInfoToShow( thisTrip ).then((getInfoToShow) => {
                expect(getInfoToShow.fareExtrasToShow).toEqual(BookingAppConstants.UPSELLING.FARE.BU_CONFORT_LATAM);
                done();
            }, ()=> done.fail())

        });
    });
    describe( 'When public getInfoToShow method is called with avoidCountries or destination rare areas', () => {
        it( 'with optima-flex destionationZone !== "LATAM" && originZone !== "ES" should not return info to show ', (done) => {
            const thisTrip = { ...trip };
            thisTrip.destinationCountry = 'MX';
            thisTrip.originCountry = 'US';
            thisTrip.info.selectedFareFamily.commercialNameES = fares[4];
            service.getInfoToShow( thisTrip ).then((getInfoToShow) => {
                expect(getInfoToShow).toEqual(null);
                done();
            }, ()=> done.fail())


        });
        it( 'with turista-premium-optima-flex destionationZone !== "LATAM" && originZone !== "ES" should not return info to show ', (done) => {
            const thisTrip = { ...trip };
            thisTrip.destinationCountry = 'MA';
            thisTrip.originCountry = 'JP';
            thisTrip.info.selectedFareFamily.commercialNameES = fares[6];
            service.getInfoToShow( thisTrip ).then((getInfoToShow) => {
                expect(getInfoToShow).toEqual(null);
                done();
            }, ()=> done.fail())
            return
        });
        it( 'with business-confort destionationZone !== "LATAM" && originZone !== "ES" should not return info to show ', (done) => {
            const thisTrip = { ...trip };
            thisTrip.destinationCountry = 'MA';
            thisTrip.originCountry = 'JP';
            thisTrip.info.selectedFareFamily.commercialNameES = fares[8];
            service.getInfoToShow( thisTrip ).then((getInfoToShow) => {
                expect(getInfoToShow).toEqual(null);
                done();
            }, ()=> done.fail())
            return
        });
    });
});
