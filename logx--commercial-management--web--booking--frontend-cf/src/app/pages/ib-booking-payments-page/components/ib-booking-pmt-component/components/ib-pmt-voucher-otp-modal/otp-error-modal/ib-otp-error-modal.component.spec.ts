import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { IbCOtpErrorModalComponent } from './ib-otp-error-modal.component';


describe('IbCOtpErrorModalComponent', () => {
    let component: IbCOtpErrorModalComponent;
    let fixture: ComponentFixture<IbCOtpErrorModalComponent>;
    let activeModal: NgbActiveModal;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbCOtpErrorModalComponent],
            imports: [
                CommonModule,
                TranslateModule.forRoot()
            ],
            providers: [NgbActiveModal]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbCOtpErrorModalComponent);
        component = fixture.componentInstance;
        activeModal = TestBed.inject(NgbActiveModal);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize model on ngOnInit', () => {
        component.ngOnInit();
        expect(component.model.body).toBe('VOUCHER_CONTROLED_ERROR');
    });

    it('should call onClose and dismiss modal on close', () => {
        spyOn(activeModal, 'dismiss');
        component.close();
        expect(activeModal.dismiss).toHaveBeenCalledWith('CLOSE');
    });
});