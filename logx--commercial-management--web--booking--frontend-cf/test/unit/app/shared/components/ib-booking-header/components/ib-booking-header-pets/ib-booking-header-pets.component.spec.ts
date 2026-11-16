import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbBookingHeaderPetsComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-pets/ib-booking-header-pets.component';
import { TranslateModule } from '@ngx-translate/core';


describe('IbBookingHeaderPetsComponent', () => {
  let component: IbBookingHeaderPetsComponent;
  let fixture: ComponentFixture<IbBookingHeaderPetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
            TranslateModule.forRoot()
        ],
      declarations: [IbBookingHeaderPetsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IbBookingHeaderPetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });


  it('should emit petsChange with toggled value when enabled and not disabledByTime', () => {
    spyOn(component.petsChange, 'emit');

    component.enabled = true;
    component.disabledByTime = false;

    component.togglePets();

    expect(component.petsChange.emit).toHaveBeenCalledWith(false);
  });

  it('should NOT emit petsChange when disabledByTime is true', () => {
    spyOn(component.petsChange, 'emit');

    component.enabled = true;
    component.disabledByTime = true;

    component.togglePets();

    expect(component.petsChange.emit).not.toHaveBeenCalled();
  });

  it('should show tooltip on mouse enter', () => {
    component.onMouseEnter();
    expect(component.isTooltipHovered).toBeTrue();
    expect(component.showTooltip).toBeTrue();
  });

  it('should hide tooltip on mouse leave when not pinned', () => {
    component.onMouseEnter();
    component.onMouseLeave();

    expect(component.isTooltipHovered).toBeFalse();
    expect(component.showTooltip).toBeFalse();
  });

  it('should keep tooltip visible when pinned after click', () => {
    const fakeEvent = new Event('click');

    component.onMouseEnter();
    component.onInfoClick(fakeEvent);
    component.onMouseLeave();

    expect(component.isTooltipPinned).toBeTrue();
    expect(component.showTooltip).toBeTrue();
  });

  it('should close tooltip when closeTooltip is called', () => {
    const fakeEvent = new Event('click');

    component.onMouseEnter();
    component.onInfoClick(fakeEvent);

    component.closeTooltip(fakeEvent);

    expect(component.isTooltipPinned).toBeFalse();
    expect(component.isTooltipHovered).toBeFalse();
    expect(component.showTooltip).toBeFalse();
  });


  it('showTooltip should return true when hovering', () => {
    component.isTooltipHovered = true;
    component.isTooltipPinned = false;

    expect(component.showTooltip).toBeTrue();
  });

  it('showTooltip should return true when pinned', () => {
    component.isTooltipHovered = false;
    component.isTooltipPinned = true;

    expect(component.showTooltip).toBeTrue();
  });

  it('showTooltip should return false when neither hovering nor pinned', () => {
    component.isTooltipHovered = false;
    component.isTooltipPinned = false;

    expect(component.showTooltip).toBeFalse();
  });
});