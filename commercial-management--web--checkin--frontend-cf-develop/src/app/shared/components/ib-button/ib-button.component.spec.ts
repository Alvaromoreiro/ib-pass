import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbButtonComponent } from './ib-button.component';

describe('IbButtonComponent', () => {
    let component: IbButtonComponent;
    let fixture: ComponentFixture<IbButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbButtonComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit clicked event when handleClick is executed', () => {
        spyOn(component.clicked, 'emit');

        component.handleClick();

        expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should render button', () => {
        const button = fixture.nativeElement.querySelector('button');

        expect(button).toBeTruthy();
    });

    it('should set type correctly', () => {
        component.type = 'submit';
        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('button');

        expect(button.getAttribute('type')).toBe('submit');
    });

    it('should apply secondary class when variant is secondary', () => {
        component.variant = 'secondary';
        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('button');

        expect(button.classList).toContain('secondary');
    });


    it('should apply big class when size is big', () => {
        component.size = 'big';
        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('button');

        expect(button.classList).toContain('button--big');
    });

    it('should render icon when icon is provided', () => {
        component.icon = 'my-icon';
        fixture.detectChanges();

        const icon = fixture.nativeElement.querySelector('.general-icon');

        expect(icon).toBeTruthy();
    });

    it('should not render icon when icon is not provided', () => {
        const icon = fixture.nativeElement.querySelector('.general-icon');

        expect(icon).not.toBeTruthy();
    });
});
