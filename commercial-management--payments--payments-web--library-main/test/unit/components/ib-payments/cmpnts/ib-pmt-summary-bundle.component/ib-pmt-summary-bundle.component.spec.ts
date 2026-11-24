import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbPmtSummaryBundleComponent } from '../../../../../../src/components/ib-payments/cmpnts/ib-pmt/cmpnts/ib-pmt-summary/cmpnts/ib-pmt-summary-bundle/ib-pmt-summary-bundle.component';

xdescribe('IbPmtSummaryBundleComponent', () => {
    let component: IbPmtSummaryBundleComponent;
    let fixture: ComponentFixture<IbPmtSummaryBundleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ IbPmtSummaryBundleComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbPmtSummaryBundleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
