import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipeMock } from 'test/mocks/pipes/TranslatePipeMock';
import { UserActivityModalComponent } from '@src/app/shared/components/ib-booking-user-activity-modal/ib-booking-user-activity-modal.component';
import { UserActivityModalUtilsService } from '@src/app/shared/components/ib-booking-user-activity-modal/services/ib-user-activity-modal-utils.service';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { NgbActiveModalMock } from 'test/mocks/class/NgbActiveModalMock';
import { RootScopeMock } from 'test/mocks/class/RootScopeMock';
import { TranslateServiceMock } from 'test/mocks/Services/TranslateServiceAngularMock';
import ODs from '../../../../../mocks/Responses/LocalOriginDestinationMadBio-mock.json';
import MULTICITY_ODs from '../../../../../mocks/Responses/meta-search/LocalOriginDestinationMulticityMetasearch-mock.json';
import PAOPEN_ODs from '../../../../../mocks/Responses/puente-aereo/LocalOriginDestinationsPaOpen-mock.json';
import PAOPEN_URL_PARAMS from '../../../../../mocks/Responses/puente-aereo/LocalBookingUrlParamsPaOpen-mock.json';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
export class UserActivityModalUtilsServiceMock {
    controlFlow = jasmine.createSpy( 'controlFlow' );
    setTravelInfoPassAvail = jasmine.createSpy( 'setTravelInfoPassAvail' ).and.returnValue(['1 pasajero']);
}
class BookingUtilServiceMock {
    getFormatedDate = jasmine.createSpy( 'getFormatedDate' ).and.returnValue( '' );
}
// const fakeOriginDestinationMulticityStopOver = require('../../../../mocks/Responses/LocalBookingUrlParamsStopOver-mock.json');
// const fakeBookingUrlParamsPaOpen = require('../../../../mocks/Responses/puente-aereo/LocalBookingUrlParamsPaOpen-mock.json');
// const fakeOriginDestinationsPaOpen = require('../../../../mocks/Responses/puente-aereo/LocalOriginDestinationsPaOpen-mock.json');
// const fakeIgnoreOrderResponse = require('../../../../mocks/Responses/IgnoreOrderResponse-mock.json');
// const fakeLocalCreateOrderData = require('../../../../mocks/Responses/LocalCreateOrderData-mock.json');
class ExtendedRootScopeMock extends RootScopeMock {
    isRedemptionFlow: false;
    isAvailability: false;
    isPointsOBFlow: false;
}
// @ts-ignore
interface ComponentTest extends UserActivityModalComponent {
    rootScope: ExtendedRootScopeMock,
    BookingUtilService: BookingUtilServiceMock,
    CommonsSessionStorageService: StorageServiceMock,
    TranslateService: TranslateServiceMock,
    UserActivityModalUtilsService: UserActivityModalUtilsServiceMock,
    NgbActiveModal: NgbActiveModalMock
}

describe('UserActivityModalComponent', () => {
    let component: ComponentTest;
    let fixture: ComponentFixture<UserActivityModalComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserActivityModalComponent, TranslatePipeMock],
            imports: [
                CommonModule
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: AJSRootScope, useClass: ExtendedRootScopeMock },
                { provide: AJSBookingUtilsService, useClass: BookingUtilServiceMock },
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock },
                { provide: TranslateService, useValue: new TranslateServiceMock() },
                { provide: UserActivityModalUtilsService, useClass: UserActivityModalUtilsServiceMock },
                { provide: NgbActiveModal, useClass: NgbActiveModalMock },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(UserActivityModalComponent);
        component = fixture.componentInstance as unknown as ComponentTest;
        component.CommonsSessionStorageService.set( BkiStorageConstants.ORIGIN_DESTINATIONS, ODs );
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    } );
    it( 'sould close', () => {
        component.close();
        expect( component.NgbActiveModal.close ).toHaveBeenCalled();
    });
    it( 'sould controlFlow', () => {
        component.controlFlow( false );
        expect( component.UserActivityModalUtilsService.controlFlow ).toHaveBeenCalled();
    } );
    it( 'should go throw multicity', () => {
        component.CommonsSessionStorageService.remove( BkiStorageConstants.ORIGIN_DESTINATIONS );
        component.CommonsSessionStorageService.set( BkiStorageConstants.SEARCH_FLIGHT_TYPE, 'multiCityFlight' );
        component.CommonsSessionStorageService.set( BkiStorageConstants.MULTICITY, true );
        component.CommonsSessionStorageService.set( BkiStorageConstants.ORIGIN_DESTINATIONS_MULTICITY, MULTICITY_ODs );
        component.ngOnInit();
        expect( component.isMultiCity ).toEqual( true );
    } );
    it( 'should go throw PA OPEN', () => {
        const pa_params = { ...PAOPEN_URL_PARAMS, tripType: '2' };
        component.CommonsSessionStorageService.set( BkiStorageConstants.ORIGIN_DESTINATIONS, PAOPEN_ODs );
        component.CommonsSessionStorageService.set( BkiStorageConstants.BOOKING_URL_PARAMS, pa_params );
        component.CommonsSessionStorageService.set( BkiStorageConstants.SHUTTLE_FLOW, true );
        component.ngOnInit();
        expect( component.isPaOpen ).toEqual( true );
    } );
    it( 'should go throw STOPOVER', () => {
        component.rootScope.destinationCity = null;
        component.CommonsSessionStorageService.set( BkiStorageConstants.HOLA_MADRID, true );
        component.CommonsSessionStorageService.set( BkiStorageConstants.OPEN_JAW, true );
        component.CommonsSessionStorageService.set( BkiStorageConstants.SEARCH_FLIGHT_TYPE, 'metasearchFlight' );
        component.CommonsSessionStorageService.set( BkiStorageConstants.ORIGIN_DESTINATIONS_MULTICITY, MULTICITY_ODs );
        component.ngOnInit();
        expect( component.isStopOver ).toEqual( true );
    } );
});
