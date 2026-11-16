import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { IbSpecialNeedsModalComponent } from '@pages/ib-booking-on-hold-confirmation/components/ib-trip-info-on-hold-conf/components/ib-passenger-info-on-hold-conf/components/ib-special-needs-modal/ib-special-needs-modal.component';

class NgbActiveModalMock {
    close = jasmine.createSpy('close').and.callFake(()=>{});
}

describe('IbSpecialNeedsModalComponent', () => {
    let component: IbSpecialNeedsModalComponent;
    let fixture: ComponentFixture<IbSpecialNeedsModalComponent>;
    const fakeNgbActiveModal = new NgbActiveModalMock();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbSpecialNeedsModalComponent],
            providers: [
                { provide: NgbActiveModal, useValue: fakeNgbActiveModal }
            ],
            imports:[
                TranslateModule.forRoot()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(IbSpecialNeedsModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe('Call close', () => {
        it('should close active modal', () => {
            component.close();
            expect(fakeNgbActiveModal.close).toHaveBeenCalled();
        });
    });
});
