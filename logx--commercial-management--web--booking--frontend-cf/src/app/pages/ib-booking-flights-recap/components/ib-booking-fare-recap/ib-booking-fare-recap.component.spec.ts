import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { IbBookingFareRecapComponent } from '@src/app/pages/ib-booking-flights-recap/components/ib-booking-fare-recap/ib-booking-fare-recap.component';
import { TranslateServiceMock } from '@test-mocks/Services/TranslateServiceAngularMock';
describe('Test IbBookingFareRecapComponent', ()=> {
    let component: IbBookingFareRecapComponent;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [IbBookingFareRecapComponent],
            imports: [],
            providers: [
                { provide: TranslateService, useValue : new TranslateServiceMock() }
            ]
        }).compileComponents();
        component = TestBed.createComponent(IbBookingFareRecapComponent).componentInstance;
    });
    describe('Test ngOnInit', () => {
        it ('Test title creation', () => {
            component.fareFamilies = [{commercialName: 'test1'}, {commercialName: 'test2'}, {commercialName: 'test3'}] as any;
            spyOn(component as any, 'orderFareFamiliesBySlice').and.callFake(() => {
                component.orderedFareFamilies = component.fareFamilies;
            });
            component.ngOnInit();
            expect(component.collapseTitle).toEqual('REVIEW_FARE_SELECTION test1, test2REVIEW_FARE_SELECTION_AND test3');
        });
    });

    describe('Test toggleOpen', () => {
        it('When will change to open', () => {
            component.isOpen = false;
            component.toggleOpen();
            expect(component.isOpen).toBe(true);
            expect(component.showColapseContent).toBe(true);
        });
        it('When will change to close', fakeAsync(() => {
            component.isOpen = true;
            component.toggleOpen();
            expect(component.isOpen).toBe(false);
            tick(351);
            expect(component.showColapseContent).toBe(false);
        }));

    });
    describe('Test getConditionsSet', () => {
        it('Should set renderConditinsSet to defaultConditionsSet for "Largo Radio"', () => {
            component.flightRatio = 'Largo Radio';
            component.ngOnInit();
            expect(component.renderConditionsSet).toEqual(component['defaultConditionsSet']);
        });

        it('Should set renderConditionsSet to shortRadiusConditionsSet for "Corto radio"', () => {
            component.flightRatio = 'Corto radio';
            component.ngOnInit();
            expect(component.renderConditionsSet).toEqual(component['shortRadiusConditionsSet']);
        });

        it('Should set renderConditionsSet to shortRadiusConditionsSet for "Medio radio"', () => {
            component.flightRatio = 'Medio radio';
            component.ngOnInit();
            expect(component.renderConditionsSet).toEqual(component['shortRadiusConditionsSet']);
        });

        it('Should set renderConditionsSet to defaultConditionsSet for undefined flightRatio', () => {
            component.flightRatio = undefined;
            component.ngOnInit();
            expect(component.renderConditionsSet).toEqual(component['defaultConditionsSet']);
        });

        it('Should set renderConditionsSet to defaultConditionsSet for unknown flightRatio', () => {
            component.flightRatio = 'Unknown radio';
            component.ngOnInit();
            expect(component.renderConditionsSet).toEqual(component['defaultConditionsSet']);
        });

        describe('Test orderFareFamiliesBySlice', () => {
            it('Should order fareFamilies by slicesInfo', () => {
                component.fareFamilies = [
                    { commercialCode: 'A', commercialName: 'Fare A' },
                    { commercialCode: 'B', commercialName: 'Fare B' },
                    { commercialCode: 'C', commercialName: 'Fare C' }
                ] as any;

                component.slicesInfo = [
                    { info: { selectedFareFamily: { commercialCode: 'C' } } },
                    { info: { selectedFareFamily: { commercialCode: 'A' } } }
                ] as any;

                component.ngOnInit();
                expect(component.orderedFareFamilies).toEqual([
                    { commercialCode: 'C', commercialName: 'Fare C' },
                    { commercialCode: 'A', commercialName: 'Fare A' }
                ] as any);
            });

            it('Should set orderedFareFamilies to fareFamilies if only one fareFamily exists', () => {
                component.fareFamilies = [
                    { commercialCode: 'A', commercialName: 'Fare A' }
                ] as any;

                component.slicesInfo = [
                    { info: { selectedFareFamily: { commercialCode: 'A' } } }
                ] as any;

                component.ngOnInit();
                expect(component.orderedFareFamilies).toEqual(component.fareFamilies);
            });

            it('Should handle empty slicesInfo gracefully', () => {
                component.fareFamilies = [
                    { commercialCode: 'A', commercialName: 'Fare A' },
                    { commercialCode: 'B', commercialName: 'Fare B' }
                ] as any;

                component.slicesInfo = undefined;

                component.ngOnInit();
                expect(component.orderedFareFamilies).toEqual([]);
            });
        });
    });
});

