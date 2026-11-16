import { TestBed } from "@angular/core/testing";
import { IbMmbVoluntaryRefundsService } from "@src/components/ib-MmB-voluntary-refunds/services/ib-MmB-voluntary-refunds.service";
import { AJSMmBDatalayerUtilsService } from "@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service-bridge.service";

describe('Test IbMmbVoluntaryRefundsService', () => {
    let service: any;
    let fakeMmBDatalayerUtilsService = {
        updateDatalayerInfo: jasmine.createSpy().and.returnValue('')
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: AJSMmBDatalayerUtilsService, useValue: fakeMmBDatalayerUtilsService }
            ]
        });
        service = TestBed.inject(IbMmbVoluntaryRefundsService);

        window['digital_data'] = {Process: 'test'}
    });

    describe('Test service exists', () => {
        it('Should be defined', (done)=> {
            expect(service).toBeDefined();
            done();
        });
    });

    describe('Test updateWorkflowDatalayerInfo', () => {
        it('Should not return nothing', (done) => {
            service.updateWorkflowDatalayerInfo();
            expect(fakeMmBDatalayerUtilsService.updateDatalayerInfo).toHaveBeenCalled();
            done();
        });
    });
});
