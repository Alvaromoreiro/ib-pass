import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { IbSoftLoginModalComponent } from '@shared/components/ib-soft-login-modal/ib-soft-login-modal.component';
import { NgbActiveModalMock } from 'test/mocks/class/NgbActiveModalMock';

describe('IbSoftLoginModalComponent', () => {
    let component: IbSoftLoginModalComponent;
    let fixture: ComponentFixture<IbSoftLoginModalComponent>;
    let fakeNgbActiveModal: NgbActiveModalMock = new NgbActiveModalMock();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbSoftLoginModalComponent],
            imports: [
                CommonModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: NgbActiveModal, useValue: fakeNgbActiveModal }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbSoftLoginModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe('When close is called', () => {
        it('should call fakeNgbActiveModal.close', () => {
            component.close();
            fixture.detectChanges();
            expect(fakeNgbActiveModal.close).toHaveBeenCalled();
        });
    });
    describe('When dismiss is called', () => {
        it('should call fakeNgbActiveModal.dismiss', () => {
            component.dismiss();
            fixture.detectChanges();
            expect(fakeNgbActiveModal.dismiss).toHaveBeenCalled();
        });
    });
});
