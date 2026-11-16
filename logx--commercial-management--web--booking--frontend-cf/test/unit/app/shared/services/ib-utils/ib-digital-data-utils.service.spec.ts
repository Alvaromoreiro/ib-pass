import { TestBed } from '@angular/core/testing';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { IbCUserUtilsServiceMock } from '../../../../../mocks/Services/IBCUserUtilsServiceMock';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { CommonsSessionStorageService, IbCTokenUtilsService, IbCUserUtilsService } from 'ib-web-commons/utils';
import { IbCTokenUtilsServiceMock } from '../../../../../mocks/Services/IbCTokenUtilsServiceMock';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import { DigitalDataValues, DigitalDataConstants, DigitalDataProcess, DigitalDataSteps } from '@src/app/core/constants/ib-digital-data-constants';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
const digital_data = require( '../mocks/DigitalDataRTStepRecap.json' );
class DigitalDataServiceMock {
    initDigitalData = () => {
        const data = {};
        data[ DigitalDataConstants.WEB_MODE ] = 'test';
        window[ 'digital_data' ] = data;
    }
    addDigitalDataInfo = jasmine.createSpy('addDigitalDataInfo').and.callFake(( info ) => {
        const data = window[ 'digital_data' ];
        Object.assign( data, info );
        window[ 'digital_data' ] = data;
    });
    getDigitalData = jasmine.createSpy( 'getDigitalData' ).and.callFake( () => {
        return window[ 'digital_data' ] ? window[ 'digital_data' ] : digital_data;
    } );
    emitViewEvent = jasmine.createSpy( 'emitViewEvent' );
    getDigitalDataProcess = jasmine.createSpy( 'getDigitalDataProcess' ).and.returnValue( digital_data[ DigitalDataConstants.PROCESS ] );
}
const roleIberia = 'ROLE_MEMBER_ZERO';
const roleIberiaPlus = 'ROLE_IBERIA_PLUS';
type UpdateQuadrigamPropsType = {
    service: DigitalDataUtilsService;
    isIbplusResponse: boolean | null;
    isUserLoggedResponse: boolean | null;
    role: string | null;
    soft: boolean | null;
};
let fakeDigitalDataService: DigitalDataServiceMock;
let fakeCommonsSessionStorageService: StorageServiceMock;
let fakeIbCUserUtilsService: IbCUserUtilsServiceMock;
let fakeIbCTokenUtilsService: IbCTokenUtilsServiceMock;
const testUpdateQuadrigam = ( { service, isIbplusResponse, isUserLoggedResponse, role, soft }: UpdateQuadrigamPropsType ) => {
    fakeIbCUserUtilsService.isIbplusResponse = isIbplusResponse;
    fakeIbCUserUtilsService.isUserLoggedResponse = isUserLoggedResponse;
    fakeCommonsSessionStorageService.set( BkiStorageConstants.USER_LOGGED, fakeIbCUserUtilsService.isUserLoggedResponse );
    if ( role !== null ) {
        fakeCommonsSessionStorageService.set( BkiStorageConstants.USER_STATE, role );
        fakeIbCUserUtilsService.getUserRole = jasmine.createSpy( 'getUserRole' ).and.callFake( () => role );
    }
    if (soft !== null ) fakeIbCUserUtilsService.isSoftUser = jasmine.createSpy( 'isSoftUser' ).and.callFake( () => soft );
    const data = window[ 'digital_data' ];
    data[ DigitalDataConstants.WEB_MODE ] = DigitalDataValues.WEB_VERSION;
    service.updateDigitalDataWithQuadrigam( BookingAppConstants.QUADRIGAMS.RECAP, data );
    const digital_data = fakeDigitalDataService.getDigitalData();
    expect( digital_data[ DigitalDataConstants.QUADRIGAM ] ).toEqual( BookingAppConstants.QUADRIGAMS.RECAP );
    expect( fakeDigitalDataService.addDigitalDataInfo ).toHaveBeenCalled();
};
describe('DigitalDataUtilsService Test', () => {
    let service: DigitalDataUtilsService;
    fakeIbCUserUtilsService = new IbCUserUtilsServiceMock();
    fakeCommonsSessionStorageService = new StorageServiceMock();
    fakeDigitalDataService = new DigitalDataServiceMock();
    fakeIbCTokenUtilsService = new IbCTokenUtilsServiceMock();
    beforeEach( async () => {
        TestBed.configureTestingModule( {
            providers: [
                { provide: DigitalDataService, useValue: fakeDigitalDataService },
                { provide: IbCUserUtilsService, useValue: fakeIbCUserUtilsService },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: IbCTokenUtilsService, useValue: fakeIbCTokenUtilsService }
            ],
        } );
        service = TestBed.inject( DigitalDataUtilsService );
    });
    it( 'should be created', () => {
        expect( service ).toBeTruthy();
    } );

    describe( 'when getProcess is called', () => {
        it( 'should return the process value', () => {
            window[ 'digital_data' ] = {...digital_data};
            const result = service.getProcess();
            expect( result ).toBe( DigitalDataProcess.BOOKING_SLICED );
        });
    });
    describe( 'when setProcessAndStep is called', () => {
        beforeEach( () => {
            fakeDigitalDataService.initDigitalData();
        } );
        it( 'should return the process value without quadrigam', () => {
            service.setProcessAndStep( DigitalDataProcess.BOOKING_SLICED, DigitalDataSteps.RECAP );
            const data = window[ 'digital_data' ];
            expect( data[ DigitalDataConstants.PROCESS ] ).toBe( DigitalDataProcess.BOOKING_SLICED );
            expect( data[ DigitalDataConstants.STEP ] ).toBe( DigitalDataSteps.RECAP );
            expect( fakeDigitalDataService.addDigitalDataInfo ).toHaveBeenCalled();
        });
        it( 'should return the process value with quadrigam', () => {
            service.setProcessAndStep( DigitalDataProcess.BOOKING_SLICED, DigitalDataSteps.RECAP, BookingAppConstants.QUADRIGAMS.RECAP );
            const data = window[ 'digital_data' ];
            expect( data[ DigitalDataConstants.PROCESS ] ).toBe( DigitalDataProcess.BOOKING_SLICED );
            expect( data[ DigitalDataConstants.STEP ] ).toBe( DigitalDataSteps.RECAP );
            expect( data[ DigitalDataConstants.QUADRIGAM ] ).toBe( BookingAppConstants.QUADRIGAMS.RECAP );
            expect( fakeDigitalDataService.addDigitalDataInfo ).toHaveBeenCalled();
        });
    } );
    describe( 'when emitViewEvent is called', () => {
        it( 'should call digital data service emitViewEvent', () => {
            service.emitViewEvent();
            expect( fakeDigitalDataService.emitViewEvent ).toHaveBeenCalled();
        });
    } );
    describe( 'when updateDigitalDataWithQuadrigam is called', () => {
        beforeEach( () => {
            fakeDigitalDataService.initDigitalData();
        } );
        it( 'should set new quadrigam and update with not userLogged and not a softUser', () => {
            testUpdateQuadrigam( {service: service, isIbplusResponse: false, isUserLoggedResponse: false, role: null, soft: null} );
        } );
        it( 'should set new quadrigam and update with userLogged and not a softUser', () => {
            testUpdateQuadrigam( {service: service, isIbplusResponse: true, isUserLoggedResponse: true, role: roleIberiaPlus, soft: null} );
        });
        it( 'should  set new quadrigam and update with softUser', () => {
            testUpdateQuadrigam( {service: service, isIbplusResponse: false, isUserLoggedResponse: true, role: roleIberia, soft: true} );
        });
        afterEach( () => {
            fakeCommonsSessionStorageService.clear();
        } );
    } );

    describe( 'when updatePreviousPageQuadrigam is called', () => {
        beforeEach( () => {
            fakeDigitalDataService.initDigitalData();
        } );
        it( 'should set previousPage with current quadrigam value', () => {
            const currentQuadrigam = BookingAppConstants.QUADRIGAMS.RECAP;
            const data = window[ 'digital_data' ];
            data[ DigitalDataConstants.QUADRIGAM ] = currentQuadrigam;
            
            service.updatePreviousPageQuadrigam();
            
            expect( fakeDigitalDataService.addDigitalDataInfo ).toHaveBeenCalledWith( {
                [ DigitalDataConstants.PREVIOUS_PAGE ]: currentQuadrigam
            } );
        } );
        it( 'should set previousPage with empty string when quadrigam is not defined', () => {
            const data = window[ 'digital_data' ];
            delete data[ DigitalDataConstants.QUADRIGAM ];
            
            service.updatePreviousPageQuadrigam();
            
            expect( fakeDigitalDataService.addDigitalDataInfo ).toHaveBeenCalledWith( {
                [ DigitalDataConstants.PREVIOUS_PAGE ]: ''
            } );
        } );
        it( 'should set previousPage with empty string when quadrigam is null', () => {
            const data = window[ 'digital_data' ];
            data[ DigitalDataConstants.QUADRIGAM ] = null;
            
            service.updatePreviousPageQuadrigam();
            
            expect( fakeDigitalDataService.addDigitalDataInfo ).toHaveBeenCalledWith( {
                [ DigitalDataConstants.PREVIOUS_PAGE ]: ''
            } );
        } );
        afterEach( () => {
            fakeCommonsSessionStorageService.clear();
        } );
    } );

    afterAll( () => {
        fakeCommonsSessionStorageService.clear();
    } );
});
