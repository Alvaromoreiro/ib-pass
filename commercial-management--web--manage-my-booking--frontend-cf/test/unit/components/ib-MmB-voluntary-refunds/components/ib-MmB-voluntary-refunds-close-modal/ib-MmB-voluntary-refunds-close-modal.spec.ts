import { TestBed, ComponentFixture } from '@angular/core/testing';
import { IbMmBVoluntaryRefundsCloseModalComponent } from '@src/components/ib-MmB-voluntary-refunds/components/ib-MmB-voluntary-refunds-close-modal/ib-MmB-voluntary-refunds-close-modal.component';
import { TranslatePipeMock } from '@test/unit/utils/pipe-mock.pipe';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IbMmbVoluntaryRefundsService } from '@src/components/ib-MmB-voluntary-refunds/services/ib-MmB-voluntary-refunds.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from '@test/unit/utils/StorageServiceMock';


class NgbActiveModalMock {
    close = jasmine.createSpy('close').and.returnValue({result:Promise.resolve('')});
};

class NgbModalMock {
    dismissAll = jasmine.createSpy('dismissAll').and.returnValue({});
}


describe('Component: IbMmBVoluntaryRefundsCloseModalComponent', () => {
    let component: IbMmBVoluntaryRefundsCloseModalComponent;
    let fixture: ComponentFixture<IbMmBVoluntaryRefundsCloseModalComponent>;
    let fakeIbMmbVoluntaryRefundsService = {
        updateWorkflowDatalayerInfo: jasmine.createSpy()
    };
    let fakeNgbActiveModalService: NgbActiveModalMock = new NgbActiveModalMock();
    let fakeNgbModal: NgbModalMock = new NgbModalMock();
    let fakeCommonsSessionStorageService: any = new StorageServiceMock();


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                IbMmBVoluntaryRefundsCloseModalComponent,
                TranslatePipeMock
            ],
            providers: [
                { provide: NgbActiveModal, useValue: fakeNgbActiveModalService },
                { provide: NgbModal, useValue: fakeNgbModal },
                { provide: IbMmbVoluntaryRefundsService, useValue: fakeIbMmbVoluntaryRefundsService },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(IbMmBVoluntaryRefundsCloseModalComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create the component when init', () => {
        expect(component).toBeTruthy();
    });

    it('should ngOnInit', (done) => {
        spyOn(component, 'ngOnInit');
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        done();
    });

    it('should close modal when closeModal is called', () => {
        component.closeModal();
        expect(fakeNgbActiveModalService.close).toHaveBeenCalled();
    });

    it('should close all modals when closeAllModal is called', () => {
        component.closeAllModal();
        expect(fakeNgbModal.dismissAll).toHaveBeenCalled();
    });
});
