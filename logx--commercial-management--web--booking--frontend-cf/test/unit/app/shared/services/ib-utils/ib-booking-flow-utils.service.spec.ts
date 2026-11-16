import { TestBed } from '@angular/core/testing';

import { IbBookingFlowUtilsService } from '../../../../../../src/app/shared/services/ib-utils/ib-booking-flow-utils.service';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { AdaptativeMobileFlows } from '@src/app/core/constants/ib-booking-maps';
class FakeRootScopeMock {
    public isMobile = {
        general: true,
        header: true
    };
    isPointsOBFlow = false;
}
let fakeRootScope;
let fakeCommonsSessionStorageService;
describe('IbBookingFlowUtilsService', () => {
    let service: IbBookingFlowUtilsService;
    fakeRootScope = new FakeRootScopeMock();
    fakeCommonsSessionStorageService = new StorageServiceMock();
    beforeEach(() => {
        TestBed.configureTestingModule( {
            providers: [
                { provide: AJSRootScope, useValue: fakeRootScope},
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService},
            ]
        } );
        service = TestBed.inject(IbBookingFlowUtilsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    describe('When checkAdaptativeMobileView is called', () => {
        it('should return false', () => {
            fakeCommonsSessionStorageService.set( 'adaptativeMobileFlow', false );
            fakeCommonsSessionStorageService.set( 'bookingHeaderMobileForced', false );
            fakeCommonsSessionStorageService.remove( 'searchFlightType' );
            fakeCommonsSessionStorageService.remove( 'actualStepFlow' );
            fakeRootScope.isMobile = {};
            const adaptative = service.checkAdaptativeMobileView();
            expect( adaptative ).toBe( false );
        });
        it('should return true', () => {
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'availability' );
            fakeCommonsSessionStorageService.set( 'searchFlightType', 'availabilityFlight' );
            fakeCommonsSessionStorageService.set( 'bookingHeaderMobileForced', true );
            fakeCommonsSessionStorageService.set( 'adaptativeMobileFlow', true );
            fakeRootScope.isMobile = {
                general: true,
                header: true
            };
            const adaptative = service.checkAdaptativeMobileView();
            expect( adaptative ).toBe( true );
        });
    });
});
