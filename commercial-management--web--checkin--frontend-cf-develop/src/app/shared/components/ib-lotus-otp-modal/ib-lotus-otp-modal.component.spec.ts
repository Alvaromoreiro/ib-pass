import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AJSRootScope, CommonsRootScope } from 'ib-web-commons/utils';
import { OtpFormStatesEnum, OtpModalModel } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-otp-model';
import { LiteralFormatterPipe } from '@src/app/shared/pipes/literalFormatter.pipe';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IbLotusOtpModalComponent } from './ib-lotus-otp-modal.component';

describe('IbLotusOtpModalComponent', () => {
    let component: IbLotusOtpModalComponent;
    let fixture: ComponentFixture<IbLotusOtpModalComponent>;
    let mockActiveModal: jasmine.SpyObj<NgbActiveModal>;
    let mockRootScope: jasmine.SpyObj<CommonsRootScope>;

    beforeEach(async () => {
        mockActiveModal = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']);
        mockRootScope = jasmine.createSpyObj('CommonsRootScope', ['']);

        await TestBed.configureTestingModule({
            declarations: [IbLotusOtpModalComponent, LiteralFormatterPipe, IbCLinkPipe],
            schemas: [ NO_ERRORS_SCHEMA ],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: NgbActiveModal, useValue: mockActiveModal },
                { provide: AJSRootScope, useValue: mockRootScope }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbLotusOtpModalComponent);
        component = fixture.componentInstance;
        component.model = {
            sessionId: 'test-session-id',
            voucherCode: 'test-voucher-code',
            flowId: 'test-flow-id',
            email: 'test@example.com'
        } as OtpModalModel;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize ccLinkTag and textsModel on ngOnInit', () => {
        spyOn(component['IbCLinkPipe'], 'transform').and.returnValue('test-link');
        spyOn(component['TranslateService'], 'instant').and.returnValue('test-translation');
        spyOn(component['LiteralFormatterPipe'], 'transform').and.returnValue('formatted-text');

        component.ngOnInit();

        expect(component.ccLinkTag.link.href).toBe('test-link');
        expect(component.ccLinkTag.link.title).toBe('test-translation');
        expect(component.textsModel.EXPLANATION).toBe('formatted-text');
        expect(component.textsModel.CC_TEXT).toBe('formatted-text');
    });

    it('should close the modal with the correct state', () => {
        const state = OtpFormStatesEnum.SUCCESS;
        component.close(state);
        expect(mockActiveModal.close).toHaveBeenCalledWith({ sessionId: component.model.sessionId, state });
    });

    it('should dismiss the modal with the correct state', () => {
        const state = OtpFormStatesEnum.ERROR;
        component.dismiss(state);
        expect(mockActiveModal.dismiss).toHaveBeenCalledWith({ sessionId: component.model.sessionId, state });
    });

    it('should dismiss the modal with CLOSED state if no state is provided', () => {
        component.dismiss();
        expect(mockActiveModal.dismiss).toHaveBeenCalledWith({ sessionId: component.model.sessionId, state: OtpFormStatesEnum.CLOSED });
    });

    it('should handle resendCode success', async () => {
        await component.resendCode();

        expect(mockActiveModal.dismiss).toHaveBeenCalledWith({ sessionId: 'test-session-id', state: OtpFormStatesEnum.RESEND_CODE });
    });

    it('should update states correctly in onOtpStatesUpdate', () => {
        component.onOtpStatesUpdate({ state: OtpFormStatesEnum.LOADING });
        expect(component.showLoading).toBeTrue();

        component.onOtpStatesUpdate({ state: OtpFormStatesEnum.PRISTINE });
        expect(component.sendNewDisabled).toBeTrue();

        component.onOtpStatesUpdate({ state: OtpFormStatesEnum.ALLOWED_RESEND_TIME });
        expect(component.sendNewDisabled).toBeFalse();

        component.onOtpStatesUpdate({ state: OtpFormStatesEnum.SUCCESS });
        expect(mockActiveModal.close).toHaveBeenCalledWith({ sessionId: component.model.sessionId, state: OtpFormStatesEnum.SUCCESS });
    });

    it('should update error state correctly in onOtpStatesUpdate', () => {
        component.onOtpStatesUpdate({ state: OtpFormStatesEnum.ERROR });
        expect(mockActiveModal.dismiss).toHaveBeenCalledWith({ sessionId: component.model.sessionId, state: OtpFormStatesEnum.ERROR });
    });
});