import { CommonModule } from '@angular/common';
import { Directive, ElementRef, Injector, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { UpgradeComponent } from '@angular/upgrade/static';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingGreyBarComponent } from '@shared/components/ib-booking-header/components/ib-booking-grey-bar/ib-booking-grey-bar.component';
import { BookingHeaderGreyBarTransformerService } from '@shared/components/ib-booking-header/services/transformers/ib-booking-header-grey-bar-transformer.service';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
const fullHeaderModel = require( '../../mocks/HeaderModelRT.json' );
export class FakeWindowMock {
    constructor () { }
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


@Directive( {
    selector: 'ib-ui-login-iframe-component'
} )
export class IbUiLoginIframeComponentDirectiveTest{
    @Input() onLogged;
    @Input() afterLogin;
    @Input() onError;
}



describe('IbBookingGreyBarComponent', () => {
    let component: IbBookingGreyBarComponent;
    let fixture: ComponentFixture<IbBookingGreyBarComponent>;
    fakeWindow = new FakeWindowMock();
    fakeCommonsSessionStorageService = new StorageServiceMock();
    fakeBookingHeaderGreyBarTransformerService = new FakeBookingHeaderGreyBarTransformerServiceMock();
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                IbBookingGreyBarComponent,
                IbUiLoginIframeComponentDirectiveTest,
            ],
            schemas: [
                NO_ERRORS_SCHEMA
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

            ]
        } ).compileComponents();

        fixture = TestBed.createComponent( IbBookingGreyBarComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
    describe( 'when responsive is called', () => {
        it( 'it set isMobile to false based on innerWidth', () => {
            component.isMobile = true;
            fakeWindow.innerWidth = 1024;
            component.responsive();
            fixture.detectChanges();
            expect( component.isMobile ).toBe( false );
        } );
        it( 'it set isMobile to true based on innerWidth', () => {
            component.isMobile = false;
            fakeWindow.innerWidth = 600;
            component.responsive();
            fixture.detectChanges();
            expect( component.isMobile ).toBe( true );
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
    describe( 'when hideLogin is called', () => {
        it( 'it set model.show to false', () => {
            component.model = fullHeaderModel.greyBarModel;
            component.hideLogin();
            fixture.detectChanges();
            expect( component.model.show ).toBe( false );
        } );
    } );
} );
