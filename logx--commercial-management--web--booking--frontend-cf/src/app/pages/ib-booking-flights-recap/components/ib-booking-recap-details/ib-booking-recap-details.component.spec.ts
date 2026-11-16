import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbBookingRecapDetailsComponent } from './ib-booking-recap-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { IbSliceUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-slice-utils.service';
import { IbSliceUtilsServiceMock } from '@test-mocks/class/IbSliceUtilsServiceMock';
import { IbSliceDetailsComponentServiceMock } from '@test-mocks/class/IbSliceDetailsComponentServiceMock';
import { IbSliceDetailsComponentService } from '@src/app/shared/components/ib-booking-slice-details-info/ib-booking-slice-details.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SelectedTripInfoMockClass } from '@test-mocks/unit/app/pages/ib-booking-flights-recap/SelectedTripInfoMock';
let fakeIbSliceUtilsService: IbSliceUtilsServiceMock;
let fakeIbSliceDetailsComponentService: IbSliceDetailsComponentServiceMock;
let SelectedTripInfoMock = new SelectedTripInfoMockClass();

describe('IbBookingRecapDetailsComponent', () => {
    let component: IbBookingRecapDetailsComponent;
    let fixture: ComponentFixture<IbBookingRecapDetailsComponent>;
    let selectedSlices = null;
    beforeEach(async () => {
        selectedSlices = SelectedTripInfoMock.selectedTripInfo;
        fakeIbSliceUtilsService = new IbSliceUtilsServiceMock();
        fakeIbSliceDetailsComponentService = new IbSliceDetailsComponentServiceMock();
        await TestBed.configureTestingModule({
            declarations: [IbBookingRecapDetailsComponent],
            imports: [
                TranslateModule.forRoot()
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: IbSliceUtilsService, useValue: fakeIbSliceUtilsService },
                { provide: IbSliceDetailsComponentService, useValue: fakeIbSliceDetailsComponentService }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(IbBookingRecapDetailsComponent);
        component = fixture.componentInstance;
        component.sliceInfo = selectedSlices[0];
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    } );
    it( 'should call details modal when click on button', () => {
        component.showDetails();
        expect(fakeIbSliceDetailsComponentService.show).toHaveBeenCalled();
    });
    it('should set showAirlineLogo to false when handleAirlineLogoError is called', () => {
        component.handleAirlineLogoError();
        expect(component.showAirlineLogo).toBeFalse();
    });

});
