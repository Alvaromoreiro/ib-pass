import { IbMmBVoluntaryRefundsSummaryComponent } from '@src/components/ib-MmB-voluntary-refunds/components/ib-MmB-voluntary-refunds-summary/ib-MmB-voluntary-refunds-summary.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbMmbVoluntaryRefundsService } from '@src/components/ib-MmB-voluntary-refunds/services/ib-MmB-voluntary-refunds.service';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { of } from 'rxjs';

class IbCModalServiceMock {
    showGenericComponentModal = jasmine.createSpy('showGenericComponentModal').and.returnValue({result:Promise.resolve(''), componentInstance: {
        currentStep: undefined, getNewCurrentStep: undefined
    }});
};

let fakeIbMmbVoluntaryRefundsService = {
    updateWorkflowDatalayerInfo: jasmine.createSpy()
};

const fakeTranslateService = jasmine.createSpyObj<TranslateService>(['get']);

const SPANISH_LANGUAGE = 'es';
const SPANISH_TRANSLATIONS = {
  'ADULT': 'Adulto',
  'INFANT': 'Bebé',
  'CHILD': 'Niño',
  'ADULTS': 'Adultos',
  'INFANTS': 'Bebés',
  'CHILDS': 'Niños',
  'MMB_BOOKING_SEATS_TITLE': 'Reserva de asientos',
  'MMB_BOOKING_BAGGAGE_TITLE': 'Equipaje adicional',
  'MMB_VOLUNTARY_CHANGE_REASON_INFO_KEEP_CONDITION_3': 'Equipaje especial',
  'PRIORITY_BOARDING_TITLE': 'Prioridad de embarque'
};

describe('Component: IbMmBVoluntaryRefundsSummaryComponent', () => {
    let component: IbMmBVoluntaryRefundsSummaryComponent;
    let fixture: ComponentFixture<IbMmBVoluntaryRefundsSummaryComponent>;
    let fakeIbCModalService: IbCModalServiceMock;

    beforeEach(() => {
        fakeIbCModalService = new IbCModalServiceMock();
        TestBed.configureTestingModule({
            imports: [
                TranslateModule,
                TranslateTestingModule,
                TranslateTestingModule.withTranslations(SPANISH_LANGUAGE, SPANISH_TRANSLATIONS).withDefaultLanguage('es')
            ],
            declarations: [IbMmBVoluntaryRefundsSummaryComponent],
            providers: [
                { provide: IbCModalService, useValue: fakeIbCModalService },
                { provide: TranslateService, useValue: fakeTranslateService},
                { provide: IbMmbVoluntaryRefundsService, useValue: fakeIbMmbVoluntaryRefundsService}
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(IbMmBVoluntaryRefundsSummaryComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        fakeTranslateService.get.and.returnValue(of([
        'ADULT', 'INFANT', 'CHILD', 'ADULTS', 'INFANTS', 'CHILDS',
        'MMB_BOOKING_SEATS_TITLE',
        'MMB_BOOKING_BAGGAGE_TITLE',
        'MMB_VOLUNTARY_CHANGE_REASON_INFO_KEEP_CONDITION_3',
        'PRIORITY_BOARDING_TITLE']));
    });

    it('should create the component when init', () => {
        expect(component).toBeTruthy();
    });

    xit('when goConfirmModal is called should call showGenericComponentModal', () => {
        component.goConfirmModal({currentStep: 1});
        expect(fakeIbCModalService.showGenericComponentModal).toHaveBeenCalled();
    });

    it('should showModalAndClose is called', () => {
        component.currentStep = 0;
        component.steps = ['MMB_CASH_REFUND_MODAL_STEP_1_TITLE', 'MMB_CASH_REFUND_MODAL_STEP_3_TITLE'];
        component.showModalAndClose();
        expect(fakeIbCModalService.showGenericComponentModal).toHaveBeenCalled();
    });

    it('when translateSummaryTitleTables is called should select correct translations', () => {
        component.translateSummaryTitleTables();
        expect(component.passengerTypeAdultSingular = 'Adulto');
        expect(component.passengerTypeInfantSingular = 'Bebé');
        expect(component.passengerTypeChildSingular = 'Niño');
        expect(component.passengerTypeAdultPlural = 'Adultos');
        expect(component.passengerTypeInfantPlural = 'Bebés');
        expect(component.passengerTypeChildPlural = 'Niños');
    });

    it('when translatePassengerTypes is called should select correct translations', () => {
        component.translatePassengerTypes();
        expect(component.tableTitleAncillarieSeat = 'Reserva de asientos');
        expect(component.tableTitleAncillarieBaggage = 'Equipaje adicional');
        expect(component.tableTitleAncillarieSpecialEquipment = 'Equipaje especial');
        expect(component.tableTitleAncillariePriorityBoarding = 'Prioridad de embarque');
    });

    it('when setQuantityPassengerType is called should select correct translations', () => {
        let resultOfSetQuantityPassengerType1 = component.setQuantityPassengerType(1, 'ADULT');
        let resultOfSetQuantityPassengerType2 = component.setQuantityPassengerType(1, 'INFANT');
        let resultOfSetQuantityPassengerType3 = component.setQuantityPassengerType(1, 'CHILD');
        let resultOfSetQuantityPassengerType4 = component.setQuantityPassengerType(2, 'ADULT');
        let resultOfSetQuantityPassengerType5 = component.setQuantityPassengerType(2, 'INFANT');
        let resultOfSetQuantityPassengerType6 = component.setQuantityPassengerType(2, 'CHILD');
        expect(resultOfSetQuantityPassengerType1 = 'Adulto');
        expect(resultOfSetQuantityPassengerType2 = 'Bebé');
        expect(resultOfSetQuantityPassengerType3 = 'Niño');
        expect(resultOfSetQuantityPassengerType4 = 'Adultos');
        expect(resultOfSetQuantityPassengerType5 = 'Bebés');
        expect(resultOfSetQuantityPassengerType6 = 'Niños');
    });

    it('when setSummaryTableTitleByAncillarieType is called should select correct translations', () => {
        let resultOfSetSummaryTableTitleByAncillarieType = component.setSummaryTableTitleByAncillarieType('seat');
        let resultOfSetSummaryTableTitleByAncillarieType2 = component.setSummaryTableTitleByAncillarieType('baggage');
        let resultOfSetSummaryTableTitleByAncillarieType3 = component.setSummaryTableTitleByAncillarieType('specialEquipment');
        let resultOfSetSummaryTableTitleByAncillarieType4 = component.setSummaryTableTitleByAncillarieType('priorityBoarding');
        expect(resultOfSetSummaryTableTitleByAncillarieType = 'Reserva de asientos');
        expect(resultOfSetSummaryTableTitleByAncillarieType2 = 'Equipaje adicional');
        expect(resultOfSetSummaryTableTitleByAncillarieType3 = 'Equipaje especial');
        expect(resultOfSetSummaryTableTitleByAncillarieType4 = 'Prioridad de embarque');
    });
});
