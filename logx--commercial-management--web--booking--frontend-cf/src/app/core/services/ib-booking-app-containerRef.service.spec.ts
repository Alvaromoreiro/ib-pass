import { TestBed } from '@angular/core/testing';
import { ViewContainerRef } from '@angular/core';
import { IbBookingAppContainerRefService } from './ib-booking-app-containerRef.service';

describe('IbBookingAppContainerRefService', () => {
    let service: IbBookingAppContainerRefService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [IbBookingAppContainerRefService]
        });
        service = TestBed.inject(IbBookingAppContainerRefService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set and get appContainerRef correctly', () => {
        const mockViewContainerRef = {} as ViewContainerRef;

        service.appContainerRef = mockViewContainerRef;
        expect(service.appContainerRef).toBe(mockViewContainerRef);
    });
});