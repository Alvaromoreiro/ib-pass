import { TestBed } from '@angular/core/testing';
import { IbPmtPetsWarningComponent } from 'src/components/ib-payments/cmpnts/ib-pmt-confirmation/cmpnts/ib-pmt-pets-warning/ib-pmt-pets-warning.component';
import { TranslateMockPipe } from 'test/mocks/Pipes/TranslatePipeMock';
import { IbCLinkMockPipe } from 'test/mocks/Pipes/LinksPipeMock';


describe('IbPmtPetsWarningComponent', () => {
    let component: IbPmtPetsWarningComponent;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                IbPmtPetsWarningComponent,
                TranslateMockPipe,
                IbCLinkMockPipe
            ]
        }).compileComponents();
        const fixture = TestBed.createComponent(IbPmtPetsWarningComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });
});