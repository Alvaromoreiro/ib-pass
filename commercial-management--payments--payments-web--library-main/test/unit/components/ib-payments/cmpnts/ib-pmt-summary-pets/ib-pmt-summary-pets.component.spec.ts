import { TestBed } from '@angular/core/testing';
import { TranslateMockPipe } from 'test/mocks/Pipes/TranslatePipeMock';
import { IbCLinkMockPipe } from 'test/mocks/Pipes/LinksPipeMock';
import { IbPmtBkiSummaryPetsComponent } from 'src/components/ib-payments/cmpnts/ib-pmt/cmpnts/ib-pmt-summary/cmpnts/ib-pmt-bki-summary-pets/ib-pmt-bki-summary-pets.component';


describe('IbPmtBkiSummaryPetsComponent', () => {
    let component: IbPmtBkiSummaryPetsComponent;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                IbPmtBkiSummaryPetsComponent,
                TranslateMockPipe,
                IbCLinkMockPipe
            ]
        }).compileComponents();
        const fixture = TestBed.createComponent(IbPmtBkiSummaryPetsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });
});