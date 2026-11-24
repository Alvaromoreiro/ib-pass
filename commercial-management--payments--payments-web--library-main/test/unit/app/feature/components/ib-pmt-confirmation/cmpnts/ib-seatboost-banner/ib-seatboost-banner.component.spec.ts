import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IbSeatboostBannerComponent } from '../../../../../../../../src/app/feature/components/ib-pmt-cki-confirmation/cmpnts/ib-seatboost-banner/ib-seatboost-banner.component';
import { DatalayerUtilsServiceInjection, DatalayerUtilsServiceType } from 'ib-web-commons/ib-datalayer';

describe('IbSeatboostBannerComponent', () => {
    let component: IbSeatboostBannerComponent;
    let fixture: ComponentFixture<IbSeatboostBannerComponent>;
    let compiled: DebugElement;
    let datalayerMock: Partial<DatalayerUtilsServiceType> & { updateDatalayerEvent: jasmine.Spy };

    beforeEach(async () => {
        datalayerMock = {
            updateDatalayerEvent: jasmine.createSpy('updateDatalayerEvent')
        };

        await TestBed.configureTestingModule({
            imports: [
                IbSeatboostBannerComponent,
                TranslateModule.forRoot()
            ],
            providers: [
                TranslateService,
                { provide: DatalayerUtilsServiceInjection, useValue: datalayerMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbSeatboostBannerComponent);
        component = fixture.componentInstance;
        compiled = fixture.debugElement;
        fixture.detectChanges();
    });

    afterEach(() => {
        if (datalayerMock && datalayerMock.updateDatalayerEvent) {
            datalayerMock.updateDatalayerEvent.calls.reset();
        }
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });


    describe('Component properties', () => {
        it('should have redirectionUrl input property', () => {
            expect(component.redirectionUrl).toBeDefined();
            expect(component.redirectionUrl).toBe('');
        });

        it('should update redirectionUrl when input changes', () => {
            const testUrl = 'https://example.com/seatboost';
            component.redirectionUrl = testUrl;
            fixture.detectChanges();
            
            expect(component.redirectionUrl).toBe(testUrl);
        });

        it('should return correct banner image path', () => {
            const bannerImage = component.bannerImage;
            expect(bannerImage).toContain('seatboost/seatboost.png');
        });

        it('should return correct Iberia icon path', () => {
            const iberiaIcon = component.iberiaIcon;
            expect(iberiaIcon).toContain('ib-logo-desktop-default-white.svg');
        });

        it('should return correct SeatBoost icon path', () => {
            const seatbootsIcon = component.seatbootsIcon;
            expect(seatbootsIcon).toContain('seatboost/seatboost.png');
        });
    });

    describe('handleClick method', () => {
        let windowOpenSpy: jasmine.Spy;

        beforeEach(() => {
            windowOpenSpy = spyOn(window, 'open');
            datalayerMock.updateDatalayerEvent.calls.reset();
        });

        it('should open new window with redirectionUrl when handleClick is called', () => {
            const testUrl = 'https://example.com/seatboost';
            component.redirectionUrl = testUrl;
            
            component.handleClick();
            
            expect(windowOpenSpy).toHaveBeenCalledWith(testUrl, '_blank');
            expect(datalayerMock.updateDatalayerEvent).toHaveBeenCalledWith('', 'clic', 'seatboost', 'interaccion');
        });

        it('should not open window if redirectionUrl is empty', () => {
            component.redirectionUrl = '';
            
            component.handleClick();
            
            expect(windowOpenSpy).not.toHaveBeenCalled();
            expect(datalayerMock.updateDatalayerEvent).not.toHaveBeenCalled();
        });

        it('should not open window if redirectionUrl is undefined', () => {
            component.redirectionUrl = undefined as any;
            
            component.handleClick();
            
            expect(windowOpenSpy).not.toHaveBeenCalled();
            expect(datalayerMock.updateDatalayerEvent).not.toHaveBeenCalled();
        });

        it('should trigger handleClick when button is clicked', () => {
            spyOn(component, 'handleClick');
            const button = compiled.query(By.css('.redirect-btn'));
            
            button.nativeElement.click();
            
            expect(component.handleClick).toHaveBeenCalled();
        });

        it('should call window.open and analytics when button is clicked with valid URL', () => {
            const testUrl = 'https://example.com/seatboost';
            component.redirectionUrl = testUrl;
            fixture.detectChanges();
            
            const button = compiled.query(By.css('.redirect-btn'));
            button.nativeElement.click();
            
            expect(windowOpenSpy).toHaveBeenCalledWith(testUrl, '_blank');
            expect(datalayerMock.updateDatalayerEvent).toHaveBeenCalledWith('', 'clic', 'seatboost', 'interaccion');
        });
    });

    describe('Analytics method', () => {
        it('sendAnalyticsEvent should call datalayer update with expected args', () => {
            component.sendAnalyticsEvent();
            expect(datalayerMock.updateDatalayerEvent).toHaveBeenCalledWith('', 'clic', 'seatboost', 'interaccion');
        });
    });

    describe('Edge cases', () => {
        it('should handle missing PmtConstants gracefully', () => {
            expect(() => {
                const _ = component.bannerImage;
                const __ = component.iberiaIcon;
                const ___ = component.seatbootsIcon;
            }).not.toThrow();
        });

        it('should handle multiple clicks on button', () => {
            const windowOpenSpy = spyOn(window, 'open');
            const testUrl = 'https://example.com/seatboost';
            component.redirectionUrl = testUrl;
            fixture.detectChanges();
            
            const button = compiled.query(By.css('.redirect-btn'));
            
            button.nativeElement.click();
            button.nativeElement.click();
            button.nativeElement.click();

            expect(windowOpenSpy).toHaveBeenCalledTimes(3);
            expect(windowOpenSpy).toHaveBeenCalledWith(testUrl, '_blank');

            expect(datalayerMock.updateDatalayerEvent).toHaveBeenCalledTimes(3);
            expect(datalayerMock.updateDatalayerEvent).toHaveBeenCalledWith('', 'clic', 'seatboost', 'interaccion');
        });
    });
});
