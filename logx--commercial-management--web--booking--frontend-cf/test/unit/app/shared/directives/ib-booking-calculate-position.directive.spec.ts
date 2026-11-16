import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { IbBookingCalculatePositionDirective } from '@shared/directives/ib-booking-calculate-position.directive';

@Component({
    template: `
            <div id='ib-header-component'></div>
            <div class='container'></div>
            <div ibBookingCalculatePosition></div>`
})
class TestComponent { }


describe('IbBookingCalculatePositionDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let directiveInstance: IbBookingCalculatePositionDirective;
    let elementRef: ElementRef;
    const setWidthParams = (windowWidth: number, containerWidth?:number) => {
        Object.defineProperty(window, 'innerWidth', {
            value: windowWidth,
            writable: true,
        });
        fixture.nativeElement.querySelector('.container').style.width = `${containerWidth}px`
        window.dispatchEvent(new Event('resize'));
        fixture.detectChanges();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [IbBookingCalculatePositionDirective, TestComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        elementRef = fixture.debugElement.query(By.directive(IbBookingCalculatePositionDirective)).injector.get(ElementRef);
        fixture.detectChanges();

        directiveInstance = fixture.debugElement.query(
            By.directive(IbBookingCalculatePositionDirective)
        ).injector.get(IbBookingCalculatePositionDirective);
    });



    it('should create the directive', () => {
        expect(directiveInstance).toBeTruthy();
        expect(elementRef.nativeElement.getAttribute('data-rightpos')).toBeDefined();
    });

    describe('when showAndPosition is called', () => {
        it('should calculate and set positions of the element if innerWidth is 1280', () => {

            setWidthParams(1280,1280)

            expect(elementRef.nativeElement.style.top).toEqual('24px');
            expect(elementRef.nativeElement.style.right).toEqual('16px');
        });
        it('should calculate and set positions of the element if innerWidth is 1024', () => {

            setWidthParams(1024,1024)

            expect(elementRef.nativeElement.style.top).toEqual('24px');
            expect(elementRef.nativeElement.style.right).toEqual('16px');
        });
        it('should calculate and set positions of the element if innerWidth is 768', () => {

            setWidthParams(768,768)

            expect(elementRef.nativeElement.style.top).toEqual('24px');
            expect(elementRef.nativeElement.style.right).toEqual('8px');
        });
        it('should calculate and set positions of the element if innerWidth is 600', () => {

            setWidthParams(600)

            expect(elementRef.nativeElement.style.top).toEqual('24px');
            expect(elementRef.nativeElement.style.right).toEqual('16px');
        });
        it('should calculate and set positions of the element if innerWidth is 480', () => {

            setWidthParams(480)

            expect(elementRef.nativeElement.style.top).toEqual('24px');
            expect(elementRef.nativeElement.style.right).toEqual('16px');
        });
        it('should calculate and set positions of the element if innerWidth is 320', () => {

            setWidthParams(320)

            expect(elementRef.nativeElement.style.top).toEqual('4px');
            expect(elementRef.nativeElement.style.right).toEqual('16px');
        });
    });
});
