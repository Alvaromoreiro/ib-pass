
import { TestBed, ComponentFixture, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { IbBookingCollapseDirective } from '@shared/directives/ib-booking-collapse.directive';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';

@Component({
    template: `
        <div ibBookingCollapse collapseContainer="testContainer" [blockScrollMobile]="true" collapseTrigger="testTrigger" collapsed="true" class="directiveDiv">
            <div testContainer class="container">
                <button testTrigger class="button"></button>
            </div>
        </div>
    `
})
export class TestComponent {
    collapsed = true;
}
export class FakeWindowMock {
    public innerWidth = 1280;
    public outerWidth = 1280;
    public innerHeight = 800;
    public outerHeight = 800;
    public resizeTo = ( width: number, height: number ) => {
        this.outerWidth = width;
        this.outerHeight = height;
        this.innerWidth = width;
        this.innerHeight = height;
    };
    public resize = ( event: Event ) => {
        window.dispatchEvent( event );
    };
    public dispatchEvent = ( event: Event ) => {
        window.dispatchEvent( event )
    };
};
let fakeWindow;
describe( 'IbBookingCollapseDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let directive: any;
    fakeWindow = new FakeWindowMock();

    beforeEach( () => {
        TestBed.configureTestingModule( {
            declarations: [ IbBookingCollapseDirective, TestComponent ],
            providers: [
                { provide: WINDOW_TOKEN, useValue: fakeWindow }
            ]
        } );
        fixture = TestBed.createComponent( TestComponent );
        component = fixture.componentInstance;
        directive = fixture.debugElement.query( By.css( 'div' ) );
        fixture.detectChanges();
    });

    it('should add collapse classes and attributes on click', () => {
        expect( component ).toBeDefined();
        expect( directive ).toBeDefined();
    });

    describe( 'When event Click event is emited', () => {
        it( 'And is in the element directive, should add collapse-open class', () => {
            const buttonTriggerCollapse = fixture.debugElement.nativeElement.querySelector( '.button' );
            const divContainerCollapse = fixture.debugElement.nativeElement.querySelector( '.container' );
            buttonTriggerCollapse.click();
            fixture.detectChanges();
            expect( buttonTriggerCollapse.classList.contains( 'collapse-open' ) ).toBe( true );
            expect( divContainerCollapse.classList.contains( 'collapse-open' ) ).toBe( true );
        } );
        it( 'And is not in the element directive, should add collapse-closed class', () => {
            const newElementDiv = fixture.nativeElement.appendChild( document.createElement( 'div' ) );
            const directiveDiv = fixture.debugElement.nativeElement.querySelector( '.directiveDiv' );
            directiveDiv.collapsed = false;
            newElementDiv.click();
            fixture.detectChanges();
            const buttonTriggerCollapse = fixture.debugElement.nativeElement.querySelector( '.button' );
            const divContainerCollapse = fixture.debugElement.nativeElement.querySelector( '.container' );
            expect( buttonTriggerCollapse.classList.contains( 'collapse-closed' ) ).toBe( true );
            expect( divContainerCollapse.classList.contains( 'collapse-closed' ) ).toBe( true );
        } );
    });
    describe( 'When window resize occurs ', () => {
        it( 'should close the collapse container', () => {
            const collapseNode = document.querySelector( '[ibBookingCollapse]' );
            const buttonTriggerCollapse = fixture.debugElement.nativeElement.querySelector( '.button' );
            buttonTriggerCollapse.click();
            fakeWindow.dispatchEvent( new Event( 'resize' ) );
            fakeWindow.resizeTo( 600, 480 );
            fixture.detectChanges();
            expect( collapseNode.getAttribute( 'collapsed' ) ).toBe( 'true' );
        } );
    } );
    describe( 'When escape key is pressed and keyup event occurs', () => {
        it( 'should close the collapse container', () => {
            const collapseNode = document.querySelector( '[ibBookingCollapse]' );
            const buttonTriggerCollapse = fixture.debugElement.nativeElement.querySelector( '.button' );
            buttonTriggerCollapse.click();
            document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'escape'}));
            fixture.detectChanges();
            expect( collapseNode.getAttribute( 'collapsed' ) ).toBe( 'true' );
        } );
    } );
});
