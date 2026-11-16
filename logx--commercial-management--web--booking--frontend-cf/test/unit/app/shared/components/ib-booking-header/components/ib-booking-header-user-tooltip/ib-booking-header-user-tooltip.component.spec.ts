import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingHeaderUserTooltipComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-user-tooltip/ib-booking-header-user-tooltip.component';
import { IbCUserUtilsService } from 'ib-web-commons/utils';

class IbCUserUtilsServiceMock {
    isIbPlus = jasmine.createSpy( 'isIbPlus' ).and.callFake( () => false );
};
let fakeIbCUserUtilsService: IbCUserUtilsServiceMock;
describe('IbBookingHeaderUserTooltipComponent', () => {
    let component: IbBookingHeaderUserTooltipComponent;
    let fixture: ComponentFixture<IbBookingHeaderUserTooltipComponent>;

    beforeEach(async () => {
        fakeIbCUserUtilsService = new IbCUserUtilsServiceMock();
        await TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot()
            ],
            declarations: [
                IbBookingHeaderUserTooltipComponent
            ],
            providers: [
                { provide: IbCUserUtilsService, useValue: fakeIbCUserUtilsService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingHeaderUserTooltipComponent);
        component = fixture.componentInstance;
        component.model = {
            "login": {},
            "loggedData": {},
            "userLogged": false,
            "isONB": false,
            "isLogged": false,
            "show": true
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    } );

    describe('View should check if is isIbPlus', () => {
        it( 'should create', () => {
            const isIbPlus = component.isIbPlus();
            expect(isIbPlus).toBe(false);
        } );
    } );

});
