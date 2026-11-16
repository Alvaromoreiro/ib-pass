import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { IbBookingFareContainerComponent } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/components/common/ib-booking-fare-container/ib-booking-fare-container.component';
import { ElementRef } from '@angular/core';



describe('IbBookingFareContainerComponent', () => {
    let component: IbBookingFareContainerComponent;
    let fixture: ComponentFixture<IbBookingFareContainerComponent>;
    let elementRefMock: ElementRef;

    beforeEach(() => {
        elementRefMock = {
            nativeElement: {
                querySelector: jasmine.createSpy('querySelector').and.returnValue({
                    scrollLeft: 0,
                    scrollWidth: 1000,
                    offsetWidth: 500,
                    querySelector: jasmine.createSpy('querySelector').and.returnValue(null)
                })
            }
        };

        TestBed.configureTestingModule({
            declarations: [IbBookingFareContainerComponent],
            providers: [
                { provide: ElementRef, useValue: elementRefMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingFareContainerComponent);
        component = fixture.componentInstance;
    });

    it('should set displayType to LIST if redemption, multiCity, or metaSearchInfo is true', () => {
        component.redemption = true;
        component.ngOnInit();
        expect(component.displayType).toBe(component.displayTypesEnum.LIST);

        component.redemption = false;
        component.multiCity = true;
        component.ngOnInit();
        expect(component.displayType).toBe(component.displayTypesEnum.LIST);

        component.multiCity = false;
        component.metaSearchInfo = true;
        component.ngOnInit();
        expect(component.displayType).toBe(component.displayTypesEnum.LIST);
    });

    it('should set displayType to CAROUSEL if fareFamilies length is greater than 3', () => {
        component.redemption = false;
        component.multiCity = false;
        component.metaSearchInfo = false;
        component.fareFamilies = new Array(4).fill({} as AvailabilityTransformerModel.FareFamilyCondition);
        component.ngOnInit();
        expect(component.displayType).toBe(component.displayTypesEnum.CAROUSEL);
    });

    it('should set displayType to MOSAIC if fareFamilies length is 3 or less', () => {
        component.redemption = false;
        component.multiCity = false;
        component.metaSearchInfo = false;
        component.fareFamilies = new Array(3).fill({} as AvailabilityTransformerModel.FareFamilyCondition);
        component.ngOnInit();
        expect(component.displayType).toBe(component.displayTypesEnum.MOSAIC);
    });

    it('should set fareContainer and call onScrollAction and initCarouselScrollSub in ngAfterViewInit', () => {
        const comp: any = component;
        spyOn(comp, 'onScrollAction');
        spyOn(comp, 'initCarouselScrollSub');

        component.ngAfterViewInit();

        expect(comp.onScrollAction).toHaveBeenCalled();
        expect(comp.initCarouselScrollSub).toHaveBeenCalled();
    });

    it('should call onScrollAction and focus on checked radio input on resize', () => {
        const comp: any = component;
        spyOn(comp, 'onScrollAction');
        const mockInput = document.createElement('input');
        mockInput.type = 'radio';
        mockInput.checked = true;
        spyOn(mockInput, 'focus');
        component ['fareContainer'] = JSON.parse(JSON.stringify(elementRefMock.nativeElement));
        Object.assign(component['fareContainer'] , {
            querySelector : jasmine.createSpy().and.returnValue(mockInput),
            scrollBy: jasmine.createSpy('scrollBy')

        });
        component.onResize();

        expect(comp.onScrollAction).toHaveBeenCalled();
        expect(mockInput.focus).toHaveBeenCalled();
    });

    it('should update scroll limits in onScrollAction', () => {
        component.ngAfterViewInit();
        component['fareContainer'] = JSON.parse(JSON.stringify(elementRefMock.nativeElement));
        Object.assign(component['fareContainer'] , {
            scrollLeft: 0,
            scrollWidth: 1000,
            offsetWidth: 500,

        });
        component['onScrollAction']();
        expect(component.scrollLimitLeft).toBeTrue();
        expect(component.scrollLimitRight).toBeFalse();

        component['fareContainer'].scrollLeft = 500;
        component['onScrollAction']();
        expect(component.scrollLimitLeft).toBeFalse();
        expect(component.scrollLimitRight).toBeTrue();
    });

    it('should scroll fareContainer by the width of a child element plus 16px in arrowScroll', () => {
        const mockChild = document.createElement('div');
        mockChild.style.width = '100px';
        component ['fareContainer'] = JSON.parse(JSON.stringify(elementRefMock.nativeElement));
        Object.assign(component['fareContainer'] , {
            querySelector : jasmine.createSpy().and.returnValue(mockChild),
            scrollBy: jasmine.createSpy('scrollBy')

        })

        component.arrowScroll('right');
        (expect(component['fareContainer'].scrollBy) as any).toHaveBeenCalledWith({ left: +16, behavior: 'smooth' });

        component.arrowScroll('left');
        (expect(component['fareContainer'].scrollBy)as any).toHaveBeenCalledWith({ left: -16, behavior: 'smooth' });
    });

    it('should complete unsubscribe subject on ngOnDestroy', () => {
        spyOn(component.unsubscribe, 'next');
        spyOn(component.unsubscribe, 'complete');

        component.ngOnDestroy();

        expect(component.unsubscribe.next).toHaveBeenCalled();
        expect(component.unsubscribe.complete).toHaveBeenCalled();
    });

    it('should init scroll subscription if displayType is CAROUSEL', fakeAsync(() => {
        const mockElement = document.createElement('div');
        mockElement.style.width = '100px';
        mockElement.style.overflow = 'scroll';
        const child = document.createElement('div');
        child.style.width = '200px';
        mockElement.appendChild(child);
        component['displayType'] = component.displayTypesEnum.CAROUSEL;
        component['fareContainer'] = mockElement;
        component['onScrollAction'] = jasmine.createSpy('onScrollAction');
        component['initCarouselScrollSub']();
        
        // Force scroll
        mockElement.scrollLeft = 200;
        mockElement.dispatchEvent(new Event('scroll'));
        tick(50);
        expect(component['onScrollAction']).toHaveBeenCalled();

    }));


});
