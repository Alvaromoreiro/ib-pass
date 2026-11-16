import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BookingPaymentErrorModalComponent } from '@pages/ib-booking-payments-page/components/ib-booking-payment-error-modal/ib-booking-payment-error-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

describe('BookingPaymentErrorModalComponent', () => {
    let component: BookingPaymentErrorModalComponent;
    let fixture: ComponentFixture<BookingPaymentErrorModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BookingPaymentErrorModalComponent],
            imports: [TranslateModule.forRoot()],
            providers: [NgbActiveModal],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
        fixture = TestBed.createComponent(BookingPaymentErrorModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });



    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize default values in ngOnInit', () => {
        component.model = {};
        component.ngOnInit();
        expect(component.showHeader).toBeTrue();
        expect(component.dismissOnCancel).toBeTrue();
        expect(component.titleTranslateParams).toEqual({});
        expect(component.modalTitle).toBe('MODAL_ERROR_TITLE');
        expect(component.body).toEqual([]);
    });

    it('should map action buttons and wrap their actions', () => {
        const mockAction = jasmine.createSpy('mockAction');
        component.model = {
            actionButtons: [
                { text: 'Test', action: mockAction, id: 'test-id' }
            ]
        };
        component.ngOnInit();
        expect(component.actionButtons).toBeDefined();
        expect(component.actionButtons?.length).toBe(1);
        component.actionButtons?.[0].action();
        expect(mockAction).toHaveBeenCalled();
    });

    it('should handle string body and convert it to an array', () => {
        component.model = { body: 'Single string body' };
        component.ngOnInit();
        expect(component.body).toEqual(['Single string body']);
    });

    it('should handle array body as is', () => {
        const bodyArray = ['Line 1', 'Line 2'];
        component.model = { body: bodyArray };
        component.ngOnInit();
        expect(component.body).toEqual(bodyArray);
    });
});