import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/services/StorageServiceMock';
import { IbPmtBkiSummaryPassengersComponent } from '../../../../../../../../src/components/ib-payments/cmpnts/ib-pmt/cmpnts/ib-pmt-summary/cmpnts/ib-pmt-bki-summary-passengers/ib-pmt-bki-summary-passengers.component';

describe('IbPmtBkiSummaryPassengersComponent', () => {
    let component: IbPmtBkiSummaryPassengersComponent;
    let fixture: ComponentFixture<IbPmtBkiSummaryPassengersComponent>;

    const fakeRootScope = {
        isPointsOBFlow: false,
        isRedemptionFlow: false,
        $broadcast: (event, ...args)=>{}
    };
    let fakeCommonsSessionStorageService = new StorageServiceMock();

    beforeEach(async () => {
        fakeCommonsSessionStorageService.clear();
        await TestBed.configureTestingModule({
            declarations: [ IbPmtBkiSummaryPassengersComponent ],
            providers:[
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService }]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbPmtBkiSummaryPassengersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call openTaxesModal', () => {
        spyOn(fakeRootScope, '$broadcast');
        component.openTaxesModal({});
        expect(fakeRootScope.$broadcast).toHaveBeenCalledWith('openSummaryModalTaxesEvent', 'ib-modal-payment-taxes.html', {});
    });
    it('should call trackByFn', () => {
        let returnValue = component.trackByFn(1);
        expect(returnValue).toEqual(1);
    });
});
