import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { IbModalSbyComponent } from './ib-modal-sby.component';

describe('IbModalSbyComponent', () => {
    let component: IbModalSbyComponent;
    let fixture: ComponentFixture<IbModalSbyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbModalSbyComponent],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(IbModalSbyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize props with open = false and onPrimaryAction defined', () => {
        expect(component.props).toBeDefined();
        expect(component.props.open).toBeFalse();
        expect(typeof component.props.onPrimaryAction).toBe('function');
    });

    it('ngOnChanges should update props.open when openModal changes to true', () => {
        component.openModal = true;

        component.ngOnChanges({
            openModal: new SimpleChange(false, true, false)
        });

        expect(component.props.open).toBeTrue();
    });

    it('ngOnChanges should update props.open when openModal changes to false', () => {
        component.props = { ...component.props, open: true };
        component.openModal = false;

        component.ngOnChanges({
            openModal: new SimpleChange(true, false, false)
        });

        expect(component.props.open).toBeFalse();
    });

    it('props.onPrimaryAction should call onClick', () => {
        const onClickSpy = spyOn(component, 'onClick');

        component.props.onPrimaryAction?.();

        expect(onClickSpy).toHaveBeenCalled();
    });

    it('onClick should set openModal to false and emit openModalChange', () => {
        const emitSpy = spyOn(component.openModalChange, 'emit');

        component.openModal = true;

        component.onClick();

        expect(component.openModal).toBeFalse();
        expect(emitSpy).toHaveBeenCalledWith(false);
    });

    it('onClick + ngOnChanges should leave props.open as false', () => {
        component.openModal = true;
        component.ngOnChanges({
            openModal: new SimpleChange(false, true, false)
        });
        expect(component.props.open).toBeTrue();

        const emitSpy = spyOn(component.openModalChange, 'emit');
        component.onClick();
        expect(component.openModal).toBeFalse();
        expect(emitSpy).toHaveBeenCalledWith(false);

        component.ngOnChanges({
            openModal: new SimpleChange(true, false, false)
        });
        expect(component.props.open).toBeFalse();
    });

    it('should update props showWalletInfo if ngOnChanges is showWalletInfo', () => {
        component.showWalletInfo = true;

        component.ngOnChanges({
            showWalletInfo: new SimpleChange(false, true, false)
        });

        expect(component.props.showWalletInfo).toBe(true);
    });
});
