import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { IbTaxBreakdownModalComponent } from '@pages/ib-booking-on-hold-confirmation/components/ib-trip-info-on-hold-conf/components/ib-price-breakdown-on-hold-conf/components/ib-tax-breakdown-modal/ib-tax-breakdown-modal.component';

class NgbActiveModalMock {
    close = jasmine.createSpy('close').and.callFake(() => {});
}

describe('IbTaxBreakdownModal component ', () => {
    let component: IbTaxBreakdownModalComponent;
    let fixture: ComponentFixture<IbTaxBreakdownModalComponent>;
    const fakeNgbActiveModal = new NgbActiveModalMock();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbTaxBreakdownModalComponent],
            providers: [
                { provide: NgbActiveModal, useValue: fakeNgbActiveModal }
            ],
            imports: [TranslateModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(IbTaxBreakdownModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('on close ', () => {
        it('it should close active modal', () => {
            component.close();
            expect(fakeNgbActiveModal.close).toHaveBeenCalled();
        });
    });
});
