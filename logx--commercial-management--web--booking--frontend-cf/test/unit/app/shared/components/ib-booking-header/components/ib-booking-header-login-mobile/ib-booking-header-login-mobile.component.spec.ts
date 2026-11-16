import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingHeaderLoginMobileComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-login-mobile/ib-booking-header-login-mobile.component';
import { BookingHeaderGreyBarTransformerService } from '@shared/components/ib-booking-header/services/transformers/ib-booking-header-grey-bar-transformer.service';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';

const fullHeaderModel = require( '../../mocks/HeaderModelRT.json' );
export class FakeWindowMock {
    constructor () {}
    innerWidth = 1024;
    location = {
        reload: () => {}
    };
};
export class FakeBookingHeaderGreyBarTransformerServiceMock {
    updateLoggedData = jasmine.createSpy( 'updateLoggedData' ).and.callFake( () => { return {}; } );
};
let fakeWindow;
let fakeCommonsSessionStorageService;
let fakeBookingHeaderGreyBarTransformerService;
describe('IbBookingHeaderLoginMobileComponent', () => {
    let component: IbBookingHeaderLoginMobileComponent;
    let fixture: ComponentFixture<IbBookingHeaderLoginMobileComponent>;
    fakeWindow = new FakeWindowMock();
    fakeCommonsSessionStorageService = new StorageServiceMock();
    fakeBookingHeaderGreyBarTransformerService = new FakeBookingHeaderGreyBarTransformerServiceMock();
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                IbBookingHeaderLoginMobileComponent
            ],
            imports: [
                TranslateModule.forRoot(),
                FormsModule,
                CommonModule
            ],
            providers: [
                { provide: WINDOW_TOKEN, useValue: fakeWindow},
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService},
                { provide: BookingHeaderGreyBarTransformerService, useValue: fakeBookingHeaderGreyBarTransformerService}
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingHeaderLoginMobileComponent);
        component = fixture.componentInstance;
        component.innerWidth = 1024;
        fixture.detectChanges();
    });

    it( 'should create', () => {
        expect(component).toBeTruthy();
    } );
    describe( 'when toggle is called', () => {
        it( 'it should toggle open to true property and set showIframe to true if collapse is closed', () => {
            component.open = false;
            component.showIframe = false;
            component.toggle();
            fixture.detectChanges();
            expect( component.open ).toBe( true );
            expect( component.showIframe ).toBe( true );
        } );
        it( 'it should toggle open to false property and set showIframe to true if collapse is open', () => {
            component.open = true;
            component.showIframe = true;
            component.toggle();
            fixture.detectChanges();
            expect( component.open ).toBe( false );
            expect( component.showIframe ).toBe( true );
        } );
    } );
    describe( 'when onResize is called', () => {
        it( 'it should call toggle if collapse is open', () => {
            spyOn( component, 'toggle' );
            component.open = true;
            fakeWindow.innerWidth = 768;
            component.onResize();
            fixture.detectChanges();
            expect( component.toggle ).toHaveBeenCalled();
        } );
    } );
    describe( 'when afterLogin is called', () => {
        it( 'it should should set loggedData and set isLogged to true ', () => {
            fakeCommonsSessionStorageService.set( 'headerModel', fullHeaderModel );
            component.model = fullHeaderModel.greyBarModel;
            component.model.login = {
                afterLogin: () => {}
            }
            component.afterLogin( {} );
            fixture.detectChanges();
            expect( component.model.loggedData ).toEqual( {} );
            expect( component.model.isLogged ).toBe( true );
        } );
        it( 'it should should set loggedData and set isLogged to true and window.localtion.reload', () => {
            fakeCommonsSessionStorageService.set( 'headerModel', fullHeaderModel );
            component.model = fullHeaderModel.greyBarModel;
            component.model.login = {
                afterLogin: null
            }
            component.afterLogin( {} );
            fixture.detectChanges();
            expect( component.model.loggedData ).toEqual( {} );
            expect( component.model.isLogged ).toBe( true );
        } );
    } );
});
