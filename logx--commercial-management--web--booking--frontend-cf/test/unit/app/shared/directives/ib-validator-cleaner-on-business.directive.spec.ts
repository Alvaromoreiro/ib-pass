import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NgControl, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IbValidatorCleanerOnBusinessDirective } from '@src/app/shared/directives/ib-validator-cleaner-on-business.directive';

@Component({
    template: `<input name="testInput" [formControl]="control" ibValidatorCleanerOnBusiness="C" />`
})
class TestComponent {
    control = new FormControl('');
}

describe('IbValidatorCleanerOnBusinessDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let inputElement: HTMLInputElement;
    let directiveElement:any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [IbValidatorCleanerOnBusinessDirective, TestComponent],
            imports: [FormsModule, ReactiveFormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        directiveElement = fixture.debugElement.query(By.directive(IbValidatorCleanerOnBusinessDirective)).injector.get(NgControl)
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

            expect(component.control.value).toBe('C');
        });

        it('should not change the input value if it does not match the regex', () => {
            inputElement.value = null;
            inputElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            expect(component.control.value).toBe('C');
        });
    });
});
