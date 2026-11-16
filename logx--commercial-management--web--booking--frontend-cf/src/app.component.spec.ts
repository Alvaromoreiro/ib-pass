import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RootScopeMock } from 'test/mocks/class/RootScopeMock';
import { IbBookingAppContainerRefServiceMock } from '@test-mocks/Services/IbBookingAppContainerRefServiceMock';
import { CUSTOM_ELEMENTS_SCHEMA, ViewContainerRef } from '@angular/core';
import { IbBookingMetaTagsServiceMock } from '@test-mocks/Services/IbBookingMetaTagsServiceMock';
import { BookingTranslateFactoryServiceMock } from '@test-mocks/Services/BookingTranslateFactoryServiceMock';
import { AJSRootScope } from 'ib-web-commons/utils';
import { IbBookingAppContainerRefService } from '@src/app/core/services/ib-booking-app-containerRef.service';
import { IbBookingMetaTagsService } from '@src/app/core/services/ib-booking-meta-tags.service';
import { BookingTranslateFactoryService } from '@src/app/core/services/ib-booking-translate-factory.service';
import { lastValueFrom } from 'rxjs';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { BookingNavigationService } from '@src/app/shared/services/ib-utils/ib-booking-navigation.service';
import { BookingNavigationServiceMock } from '@test-mocks/Services/BookingNavigationServiceMock';
import { NavigationManagerService } from '@src/app/core/services/navigation/ib-booking-navigation-manager.service';
import { NavigationManagerServiceMock } from '@test-mocks/Services/NavigationManagerServiceMock';
import { BookingUserActivityService } from '@src/app/core/services/ib-booking-user-activity.service';
import { BookingUserActivityServiceMock } from '@test-mocks/Services/BookingUserActivityServiceMock';

class ViewContainerRefMock {}
class WindowMock {
    dispatchEvent = ( event: CustomEvent ) => {
        window.dispatchEvent( event );
    };
    addEventListener = ( evName: string = '', callback: ( args: unknown ) => void ) => {
        window.addEventListener( `${ evName }`, callback );
    };
}
describe('AppComponent test', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let fakeWindow: WindowMock;

   
    beforeEach( async () => {
        fakeWindow = new WindowMock();
        await TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: ViewContainerRef, useClass: ViewContainerRefMock },
                { provide: IbBookingAppContainerRefService, useClass: IbBookingAppContainerRefServiceMock },
                { provide: IbBookingMetaTagsService, useClass: IbBookingMetaTagsServiceMock },
                { provide: BookingTranslateFactoryService, useClass: BookingTranslateFactoryServiceMock },
                { provide: AJSRootScope, useClass: RootScopeMock },
                { provide: WINDOW_TOKEN, useValue: fakeWindow },
                { provide: BookingNavigationService, useClass: BookingNavigationServiceMock },
                { provide: NavigationManagerService, useClass: NavigationManagerServiceMock },
                { provide: BookingUserActivityService, useClass: BookingUserActivityServiceMock }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    } );

    describe( 'should init', ( ) => {
        it( 'should call initMetaTags', fakeAsync(( ) => {
            component.ngOnInit();
            component[ 'BookingTranslateFactoryService' ].isReady.next( true );
            flushMicrotasks();
            lastValueFrom( component.translationsReady ).then( (data) => {
                expect( data ).toBe( true );
                expect( component[ 'IbBookingMetaTagsService' ].initMetaTags ).toHaveBeenCalled();
                expect( component[ 'NavigationManagerService' ].init ).toHaveBeenCalled();
                expect( component[ 'BookingUserActivityService' ].initActivityWorker ).toHaveBeenCalled();
            });
        } ) );
    });

    describe ('Test angularjs-navigate custom event listener', () => {
        it( 'should go throw listener', fakeAsync( () => {
            const customEvent = new CustomEvent( 'angularjs-navigate', {
                detail: { path: 'availability' }
            } );
            fakeWindow.dispatchEvent( customEvent );
            flushMicrotasks();
            tick();
            expect( component[ 'BookingNavigationService' ].navigateTo ).toHaveBeenCalled();
        } ) );
    });
});
