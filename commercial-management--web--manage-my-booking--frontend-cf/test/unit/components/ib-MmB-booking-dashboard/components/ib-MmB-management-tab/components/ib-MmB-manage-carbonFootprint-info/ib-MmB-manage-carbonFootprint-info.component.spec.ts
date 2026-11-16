import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IbManageCarbonFootprintComponent } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-management-tab/components/ib-MmB-manage-carbonFootprint-info/ib-MmB-manage-carbonFootprint-info.component';
import { IbMmbManageCarbonFootprintInfoService } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-management-tab/components/ib-MmB-manage-carbonFootprint-info/service/ib-MmB-manage-carbonFootprint-info.service';
import { TranslatePipeMock } from 'test/unit/utils/pipe-mock.pipe';


describe('IbManageCarbonFootprintComponent', () => {
    let component: IbManageCarbonFootprintComponent;
    let fixture: ComponentFixture<IbManageCarbonFootprintComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IbManageCarbonFootprintComponent, TranslatePipeMock],
            imports: [],
            providers: [IbMmbManageCarbonFootprintInfoService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IbManageCarbonFootprintComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('test navigateCO2Modal', () => {

        spyOn(component.IbMmbManageCarbonFootprintInfoService, 'submitOpenTab');
        component.navigateCO2Modal();

        expect(component.IbMmbManageCarbonFootprintInfoService.submitOpenTab).toHaveBeenCalled();
    });
});
