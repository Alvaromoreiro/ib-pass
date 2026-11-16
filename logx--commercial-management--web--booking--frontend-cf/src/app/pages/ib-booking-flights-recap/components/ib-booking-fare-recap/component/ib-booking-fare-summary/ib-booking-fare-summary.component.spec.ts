import { TestBed } from '@angular/core/testing';
import { IbBookingFareSummaryComponent } from '@pages/ib-booking-flights-recap/components/ib-booking-fare-recap/component/ib-booking-fare-summary/ib-booking-fare-summary.component';
describe ('Test IbBookingFareSummaryComponent', () => {
    let component: IbBookingFareSummaryComponent;
    const renderConditionsSet = new Set<string>(
        ['REEMBOLSO', 'EQMANO', 'EQBODEGA']);
    const fareFamilyExample =  {
        conditions: [
            { code: 'EQMANO', extendedInfo: { conditionStatus: true } },
            { code: 'EQBODEGA', extendedInfo: { conditionStatus: false } },
            { code: 'ASIENTO', extendedInfo: { conditionStatus: true } },
            { code: 'COMIDA', extendedInfo: { conditionStatus: false } },
            { code: 'CAMBIO', extendedInfo: { conditionStatus: true } },
            { code: 'EMBARQUE', extendedInfo: { conditionStatus: false } },
            { code: 'REEMBOLSO', extendedInfo: { conditionStatus: true } }
        ],
        conditionsPriority : ['REEMBOLSO', 'EQMANO', 'EQBODEGA', 'ASIENTO', 'COMIDA', 'CAMBIO', 'EMBARQUE' ]
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [IbBookingFareSummaryComponent],
            imports: [],
            providers: []
        }).compileComponents();
        component = TestBed.createComponent(IbBookingFareSummaryComponent).componentInstance;
        component.fareFamily = fareFamilyExample as any;
        
    });

    describe('Test ngOnInit', () => {
        it('Test get ordered conditions priority filter by render condition list', () => {
            component.renderConditionsSet = renderConditionsSet;
            component.ngOnInit();
            expect(component.fareConditionsList.length).toEqual(renderConditionsSet.size);
            let i = 0;
            for(let code of component.renderConditionsSet) {
                expect(component.fareConditionsList[i].condition.code).toEqual(code);
                i++;
            }
        });
        it('Test get ordered conditions priority filter by condition status', () => {
            component.renderConditionsSet = null;
            component.ngOnInit();
            expect(component.fareConditionsList.length).toEqual(4);
            expect(component.fareConditionsList[0].condition.code).toEqual('REEMBOLSO');
            expect(component.fareConditionsList[1].condition.code).toEqual('EQMANO');
            expect(component.fareConditionsList[2].condition.code).toEqual('ASIENTO');
            expect(component.fareConditionsList[3].condition.code).toEqual('CAMBIO');
        });
        it('Test when filterRenderCondition is called with null', () => {
            const conditionElement = null;
            const result = component['filterRenderCondition'](conditionElement);
            expect(result).toBe(false);
        });
    });

});