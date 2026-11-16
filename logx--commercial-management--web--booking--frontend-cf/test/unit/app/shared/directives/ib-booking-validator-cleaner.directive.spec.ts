import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IbBookingValidatorCleanerDirective } from '@src/app/shared/directives/ib-booking-validator-cleaner.directive';

@Component({
    template: `<input [(ngModel)]="testValue" ibBookingValidatorCleaner="[^a-zA-Z0-9]">`
})
class TestComponent {
    testValue: string = '';
}

describe('IbBookingValidatorCleanerDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let inputElement: HTMLInputElement;
    let directiveElement:any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [IbBookingValidatorCleanerDirective, TestComponent],
            imports: [FormsModule, ReactiveFormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        directiveElement = fixture.debugElement.query(By.directive(IbBookingValidatorCleanerDirective)).injector.get(NgControl)
        inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        fixture.detectChanges();
    });

    it('should create the directive', () => {;
        expect(directiveElement).toBeTruthy();
        expect(component).toBeTruthy();
    });

    describe('onInputChange', () => {
        it('should clean the input value based on the regex', () => {
            inputElement.value = 'Hello@World!';
            inputElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            expect(component.testValue).toBe('HelloWorld');
        });

        it('should not change the input value if it does not match the regex', () => {
            inputElement.value = 'HelloWorld123';
            inputElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            expect(component.testValue).toBe('HelloWorld123');
        });
    });

    describe('Input property', () => {
        it('should accept a regex value', () => {
            const directive = new IbBookingValidatorCleanerDirective(directiveElement);
            directive.regex = '[^0-9]';
            expect(directive.regex).toBe('[^0-9]');
        });
    });
});
