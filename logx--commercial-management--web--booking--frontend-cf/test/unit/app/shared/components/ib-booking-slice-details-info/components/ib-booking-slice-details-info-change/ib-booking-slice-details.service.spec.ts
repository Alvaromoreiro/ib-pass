import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IbSliceDetailsComponentService } from '@src/app/shared/components/ib-booking-slice-details-info/ib-booking-slice-details.service';
import { IbBookingAppContainerRefService } from '@src/app/core/services/ib-booking-app-containerRef.service';
import { ComponentRef, ViewContainerRef } from '@angular/core';
import { IbBookingSliceDetailsInfoComponent } from '@src/app/shared/components/ib-booking-slice-details-info/ib-booking-slice-details-info.component';

class MockViewContainerRef {
    createComponent = jasmine.createSpy('createComponent').and.returnValue({
        instance: {
            toggle: jasmine.createSpy('toggle'),
        },
        destroy: jasmine.createSpy('destroy'),
    } as unknown as ComponentRef<IbBookingSliceDetailsInfoComponent>);
}

class MockIbBookingAppContainerRefService {
    appContainerRef = new MockViewContainerRef() as unknown as ViewContainerRef;
}

// @ts-ignore
interface TestService extends IbSliceDetailsComponentService {
    appContainerRef: MockViewContainerRef;
    currentRef: MockViewContainerRef;
}

describe('IbSliceDetailsComponentService', () => {
    let service: TestService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IbSliceDetailsComponentService,
                { provide: IbBookingAppContainerRefService, useClass: MockIbBookingAppContainerRefService },
            ],
        });

        service = TestBed.inject(IbSliceDetailsComponentService) as any;
    });

    it('should create and show the component when show is called', fakeAsync(() => {
        const mockModel = { id: 'slice1' } as any;
        service.show(mockModel);
        const componentRef = service.appContainerRef.createComponent.calls.mostRecent().returnValue;
        tick();

        componentRef.instance.toggle.and.callFake(() => {
            expect(service.appContainerRef.createComponent).toHaveBeenCalled();
            expect(componentRef.instance.sliceDetailsInfoModel).toBe(mockModel);
            expect(componentRef.instance.toggle).toHaveBeenCalled();
        });   
    }));

    it('should destroy the component when destroy is called', fakeAsync(() => {
        service.show({ id: 'slice1' } as any);
        tick();
        service.destroy();

        const componentRef = service.appContainerRef.createComponent.calls.mostRecent().returnValue;
        expect(componentRef.destroy).toHaveBeenCalled();
    }));
});
