import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AJSMmbModalService } from '@src/components/ib-reusable-components/ib-MmB-modal/services/upgraded/ib-Mmb-modal-service-bridge.service'; 
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbCPipeModule } from 'ib-web-commons/pipes';
import { IbMmbFareFamilyConditionsComponent } from '../../../../../src/components/ib-reusable-components/ib-mmb-fare-family-conditions/ib-mmb-fare-family-conditions.component';
import { MmBAppConstants } from '../../../../../src/ib-MmB-constants'; 
import { CommonsSessionStorageService } from 'ib-web-commons/utils'; // Ensure this import points to the right location

class MmbModalServiceMock {
    showGenericModal = jasmine.createSpy('showGenericModal').and.returnValue({result:Promise.resolve('')});
};

class CommonsSessionStorageServiceMock {
    get = jasmine.createSpy('get').and.callFake((key) => {
        if (key === 'userLogged') {
            return MmBAppConstants.LOGIN_ONB;
        }
        return null;
    });
}

const fakeSegment = {
    fareFamilyConditions:[{
        cabin: 'Básica',
        title: 'Equipaje de mano: 1 pieza',
        code: 'ASIENTOXL'
    }]
};
let fakeMmBModalService: MmbModalServiceMock;
let mockCommonsSessionStorageService: CommonsSessionStorageServiceMock;

const fakeSegmentSelected = [
    {
        cabin: "Básica",
        cabinType: "E",
        code: "EQMANO",
        name: "Equipaje de mano",
        title: "Equipaje de mano: 1 pieza",
        message: "Incluida 1 pieza hasta 10 kg (56x40x25cm) y 1 accesorio personal, en vuelos operados por las compañías oneworld. Para el resto de compañías, consultar con la operadora de vuelo.",
        units: 1
    }
];

describe('IbMmbFareFamilyConditionsComponent', () => {
  let component: IbMmbFareFamilyConditionsComponent;
  let fixture: ComponentFixture<IbMmbFareFamilyConditionsComponent>;

  beforeEach(async () => {
    fakeMmBModalService = new MmbModalServiceMock();
    mockCommonsSessionStorageService = new CommonsSessionStorageServiceMock();
    await TestBed.configureTestingModule({
      declarations: [ IbMmbFareFamilyConditionsComponent ],
      imports: [
        TranslateModule.forRoot(),
        CommonModule,
        IbCPipeModule
    ],
      providers:[
        { provide: AJSMmbModalService, useValue: fakeMmBModalService },
        { provide: CommonsSessionStorageService, useValue: mockCommonsSessionStorageService }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(IbMmbFareFamilyConditionsComponent);
    component = fixture.componentInstance;
    component.segment = fakeSegment;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFareFamilyIcon()', () => {
    let returnValue = component.getFareFamilyIcon('ASIENTO')
    expect(returnValue).toEqual('icon-asiento-normal');
  });

  it('should call getFareFamilyIcon()', () => {
    component.openModalConditions(new CustomEvent('evento'), fakeSegmentSelected)
    expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
  });

  it('should showGenericModal reject', () => {
    fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.returnValue({result:Promise.reject('')});
    component.openFareWindowModal(fakeSegmentSelected);
    expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
  });

  it('should checkCondition with segment upgradingBids', () => {
    component.checkCondition(fakeSegment.fareFamilyConditions, fakeSegment);
    expect(component).toBeTruthy();
  });

  it('should skip condition if user is logged and code is AVIO', () => {
    component.isOnbLogged = true;
    const fakeFareFamilyConditions = [{ title: 'Test Title', code: 'AVIO' }];
    
    component.checkCondition(fakeFareFamilyConditions, fakeSegment);
    
    expect(component.conditionItems.length).toBe(1);
  });
});
