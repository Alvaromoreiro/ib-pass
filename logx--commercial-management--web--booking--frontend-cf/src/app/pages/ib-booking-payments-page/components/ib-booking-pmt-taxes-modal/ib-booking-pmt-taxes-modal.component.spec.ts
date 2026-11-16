import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Taxes } from '@src/app/core/models/ib-booking-payments/ib-booking-summary-model';
import { IbPmtTaxesModalComponent } from '@src/app/pages/ib-booking-payments-page/components/ib-booking-pmt-taxes-modal/ib-booking-pmt-taxes-modal.component';
import { NgbActiveModalMock } from '@test-mocks/class/NgbActiveModalMock';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
describe('IbPmtTaxesModalComponent', () => {
    let component: IbPmtTaxesModalComponent;
    let fixture: ComponentFixture<IbPmtTaxesModalComponent>;
    let fakeNgbActiveModal: NgbActiveModalMock = new NgbActiveModalMock();
    beforeEach( async () => {
        await TestBed.configureTestingModule({
            declarations: [IbPmtTaxesModalComponent],
            imports: [
                CommonModule,
                TranslateModule.forRoot()
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            providers: [
                { provide: NgbActiveModal, useValue: fakeNgbActiveModal }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent( IbPmtTaxesModalComponent );
        component = fixture.componentInstance;
        component.model = <Taxes[]> [];
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    } );
    describe( 'When close is called', () => {
        it( 'should call fakeNgbActiveModal.close', () => {
            component.close();
            fixture.detectChanges();
            expect( fakeNgbActiveModal.close ).toHaveBeenCalled();
        });
    });
    describe( 'When dismiss is called', () => {
        it( 'should call fakeNgbActiveModal.dismiss', () => {
            component.dismiss();
            fixture.detectChanges();
            expect( fakeNgbActiveModal.dismiss ).toHaveBeenCalled();
        });
    });
});
