import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { IbSuggestLoginModalComponent } from '@src/app/shared/components/ib-suggest-login-modal/ib-suggest-login-modal.component';

import { NgbActiveModalMock } from 'test/mocks/class/NgbActiveModalMock';

describe('IbSuggestLoginModalComponent', () => {
    let component: IbSuggestLoginModalComponent;
    let fixture: ComponentFixture<IbSuggestLoginModalComponent>;
    let fakeNgbActiveModal: NgbActiveModalMock = new NgbActiveModalMock();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbSuggestLoginModalComponent],
            imports: [
                CommonModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: NgbActiveModal, useValue: fakeNgbActiveModal }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbSuggestLoginModalComponent);
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
