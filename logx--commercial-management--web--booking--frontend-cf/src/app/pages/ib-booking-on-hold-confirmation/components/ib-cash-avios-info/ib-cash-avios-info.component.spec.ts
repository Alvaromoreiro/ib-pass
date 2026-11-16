import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbCashAviosInfoComponent } from '@src/app/pages/ib-booking-on-hold-confirmation/components/ib-cash-avios-info/ib-cash-avios-info.component';
import { AJSRootScope } from 'ib-web-commons/utils';
import { TranslatePipeMock } from '@src/app/shared/components/ib-booking-partners-modal/ib-booking-partners-modal.component.spec';

export class RootScopeMock {
    isMobile = {
        general: true
    };
    public $on = ( eventName: string, callback: () => void ) => { };
}

let fakeAJSRootScope: RootScopeMock;

describe('IbCashAviosInfoComponent: ', () => {
    let component: IbCashAviosInfoComponent;
    let fixture: ComponentFixture<IbCashAviosInfoComponent>;

    beforeEach(async () => {
        fakeAJSRootScope = new RootScopeMock();
        await TestBed.configureTestingModule({
            declarations: [ IbCashAviosInfoComponent, TranslatePipeMock ],
            providers: [
                { provide: AJSRootScope, useValue: fakeAJSRootScope }]
        })
            .compileComponents();

        fixture = TestBed.createComponent(IbCashAviosInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
