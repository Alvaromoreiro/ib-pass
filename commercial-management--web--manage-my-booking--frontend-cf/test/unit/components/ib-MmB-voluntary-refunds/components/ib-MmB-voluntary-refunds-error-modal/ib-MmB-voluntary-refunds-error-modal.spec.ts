import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TranslateServiceMock } from '@test/mocks/services/translate-service-angular-mock';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IbMmBVoluntaryRefundsErrorModalComponent } from '@src/components/ib-MmB-voluntary-refunds/components/ib-MmB-voluntary-refunds-error-modal/ib-MmB-voluntary-refunds-error-modal.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IbMmbVoluntaryRefundsService } from '@src/components/ib-MmB-voluntary-refunds/services/ib-MmB-voluntary-refunds.service';


class NgbActiveModalMock {
    close = jasmine.createSpy('close').and.returnValue({});
};

class IbMmbVoluntaryRefundsServiceMock {
    updateWorkflowDatalayerInfo = jasmine.createSpy('updateWorkflowDatalayerInfo').and.returnValue({});
};

class NgbModalMock {
    dismissAll = jasmine.createSpy('dismissAll').and.returnValue({});
}

describe('Component: IbMmBVoluntaryRefundsErrorModalComponent', () => {
    let component: IbMmBVoluntaryRefundsErrorModalComponent;
    let fixture: ComponentFixture<IbMmBVoluntaryRefundsErrorModalComponent>;
    let fakeTranslate: TranslateServiceMock;
    let fakeNgbActiveModalService: NgbActiveModalMock = new NgbActiveModalMock();
    let fakeIbMmbVoluntaryRefundsService:IbMmbVoluntaryRefundsServiceMock = new IbMmbVoluntaryRefundsServiceMock();
    let fakeNgbModal: NgbModalMock = new NgbModalMock();

    beforeEach(() => {
        fakeTranslate = new TranslateServiceMock();


        TestBed.configureTestingModule({
            imports: [
                TranslateModule,
            ],
            declarations: [
                IbMmBVoluntaryRefundsErrorModalComponent
            ],
            providers: [
                { provide: TranslateService, useValue: fakeTranslate},
                { provide: NgbActiveModal, useValue: fakeNgbActiveModalService },
                { provide: NgbModal, useValue: fakeNgbModal },
                { provide: IbMmbVoluntaryRefundsService, useValue: fakeIbMmbVoluntaryRefundsService},
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(IbMmBVoluntaryRefundsErrorModalComponent);
        component = fixture.componentInstance;
    });

    it('should create the component when init', () => {
        expect(component).toBeTruthy();
    });

    it('should IbMmBVoluntaryRefundsErrorModalComponent called', () => {
        component.ngOnInit();
        expect(fakeIbMmbVoluntaryRefundsService.updateWorkflowDatalayerInfo).toHaveBeenCalled();
    });
    it('should NgbActiveModalService called', () => {
        component.closeModal();
        expect(fakeNgbActiveModalService.close).toHaveBeenCalled();
    });
    it('should NgbModal called', () => {
        component.accept();
        expect(fakeNgbActiveModalService.close).toHaveBeenCalled();
    });
});
