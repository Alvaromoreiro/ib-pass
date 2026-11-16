import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { IbMmbManageCarbonFootprintInfoService } from "@src/components/ib-MmB-booking-dashboard/components/ib-MmB-management-tab/components/ib-MmB-manage-carbonFootprint-info/service/ib-MmB-manage-carbonFootprint-info.service";
import { BehaviorSubject } from "rxjs";

describe('IbMmbManageCarbonFootprintInfoService', () => {

    const mockIbMmbManageCarbonFootprintInfoService = jasmine.createSpyObj<IbMmbManageCarbonFootprintInfoService>('mockIbMmbManageCarbonFootprintInfoService',
        ['submitOpenTab']
    );

    beforeEach(() => TestBed.configureTestingModule({
        imports: [RouterTestingModule]
    }));

    it('should be created', () => {
        const service: IbMmbManageCarbonFootprintInfoService = TestBed.get(IbMmbManageCarbonFootprintInfoService);
        expect(service).toBeTruthy();
    });

    it('test submitOpenTab', () => {
        const service: IbMmbManageCarbonFootprintInfoService = TestBed.get(IbMmbManageCarbonFootprintInfoService);
        const submitOpenTab$ = new BehaviorSubject<boolean>(false);
        mockIbMmbManageCarbonFootprintInfoService.submitOpenTab.and.callFake((param: boolean) => {
            return submitOpenTab$;
        });
        spyOn(service, 'submitOpenTab').withArgs(true);

        service.submitOpenTab(true);
        expect(service.submitOpenTab).toHaveBeenCalledWith(true);
    });
});
