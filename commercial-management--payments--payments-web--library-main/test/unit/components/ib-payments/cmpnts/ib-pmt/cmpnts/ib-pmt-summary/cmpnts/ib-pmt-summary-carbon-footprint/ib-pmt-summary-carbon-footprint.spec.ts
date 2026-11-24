import { IbPmtSummaryCarbonFootprintComponent } from './../../../../../../../../../../src/components/ib-payments/cmpnts/ib-pmt/cmpnts/ib-pmt-summary/cmpnts/ib-pmt-summary-carbon-footprint/ib-pmt-summary-carbon-footprint.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'translate'
})
export class TranslateMockPipe implements PipeTransform {
    public name: string = 'translate';
  
    public transform (query: string, ...args: any[]): any {
        if (args && args.length > 0) {
            return query + JSON.stringify(args[0]);
        }
        return query;
    }
}
  
describe ('Test IbPmtSummaryCarbonFootprintComponent', ()=> {
    let component:IbPmtSummaryCarbonFootprintComponent ;
    let fixture: ComponentFixture<IbPmtSummaryCarbonFootprintComponent>;

    beforeEach(async () => {        
        await TestBed.configureTestingModule({
            declarations: [
                IbPmtSummaryCarbonFootprintComponent,
                TranslateMockPipe
            ]
        }).compileComponents();
    });

    beforeEach(function () {
        fixture = TestBed.createComponent(IbPmtSummaryCarbonFootprintComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe ('Test IbPmtSummaryCarbonFootprintComponent', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should display model values', () => {
            component.model = {
                kilosCo2Equivalent: 52.8,
                kilosCo2EquivalentFormatted: '52,8',
                total: 1.06,
                totalFormatted: '1,06€'
            };

            fixture.detectChanges();

            const carbonTitle = fixture.nativeElement.querySelector('.ib-summary-item__carbon-title');
            expect(carbonTitle.textContent).toBe('IBPURC_PAYMENTS_SUMMARY_CO2_FOOTPRINT_KILOS{"kilosCo2Equivalent":"52,8"}');
            const carbonPrice = fixture.nativeElement.querySelector('.ib-summary-item__carbon-price');
            expect(carbonPrice.textContent).toBe('1,06€');
        });                     
    });

});