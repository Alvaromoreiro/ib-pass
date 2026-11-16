import { Pipe } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingHeaderSimpleComponent } from '@shared/components/ib-booking-header/components/ib-booking-header-simple/ib-booking-header-simple.component';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
class FakeWindowMock {
    location = '';
};
@Pipe( {
    name: 'link'
})
class IbCLinkPipeMock implements PipeTransform {
    public transform (query: string, ...args: any[]): any {
        return query;
    }
}
let fakeBookingUrlParams = {
    "fromMarket": 'ES',
    "fromLanguage": 'es'
};
let fakeCommonsSessionStorageService: StorageServiceMock;
let fakeWindow: FakeWindowMock;
describe('IbBookingHeaderSimpleComponent', () => {
    let component: IbBookingHeaderSimpleComponent;
    let fixture: ComponentFixture<IbBookingHeaderSimpleComponent>;

    beforeEach( async () => {
        fakeCommonsSessionStorageService = new StorageServiceMock();
        fakeWindow = new FakeWindowMock();
        await TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot()
            ],
            declarations: [
                IbBookingHeaderSimpleComponent,
                IbCLinkPipeMock
            ],
            providers: [
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: WINDOW_TOKEN, useValue: fakeWindow },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingHeaderSimpleComponent);
        component = fixture.componentInstance;
        component.model = {
            show: false,
            steps: {
                position: 'availability',
                totalSteps: 5
            }
        };
        component.loginInfo = {
            isLogged: false
        };
        component.flightType = '';
        fakeCommonsSessionStorageService.set('bookingUrlParams', fakeBookingUrlParams)
        fixture.detectChanges();
    });

    it( 'should create', () => {
        expect(component).toBeTruthy();
    });
});
