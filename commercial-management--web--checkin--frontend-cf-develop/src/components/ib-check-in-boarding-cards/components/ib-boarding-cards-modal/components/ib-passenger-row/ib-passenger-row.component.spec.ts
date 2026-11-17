import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbPassengerRowComponent } from './ib-passenger-row.component';
import { AJSRootScope } from 'ib-web-commons/utils';
import { IRootScopeExt } from '@src/app/core/models/generic-models/generic-models';
import { mockBoardingCardsModelMap } from '../../mocks/ib-boarding-cards-modal.mocks';

describe('IbPassengerRowComponent', () => {
    let component: IbPassengerRowComponent;
    let fixture: ComponentFixture<IbPassengerRowComponent>;

    let mockRootScope: jasmine.SpyObj<IRootScopeExt>;
    const mockCheckinAppConstants = {
        imagesRoute: '/iberia-web-content/imagenes'
    }

    beforeEach(async () => {
        mockRootScope = jasmine.createSpyObj('$rootScope', [], { appLang: 'es' });

        await TestBed.configureTestingModule({
            declarations: [IbPassengerRowComponent],
            providers: [
                { provide: AJSRootScope, useValue: mockRootScope },
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbPassengerRowComponent);
        component = fixture.componentInstance;

        component.passengerInfo = mockBoardingCardsModelMap[0].passengers[0];

        fixture.detectChanges();
    });

    describe('component initialize', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should set googleWallet image with correct lang', () => {
            expect(component.googleWalletImg).toBe(`${mockCheckinAppConstants.imagesRoute}/google-wallet/es_google_wallet.svg`);
        });
    });

    describe('download', () => {
        it('should emit event with passengerId', () => {
            spyOn(component.downloadGWEvent, 'emit');

            component.download();

            expect(component.downloadGWEvent.emit).toHaveBeenCalledWith({
                passengerId: '1'
            });
        });
    });
});
