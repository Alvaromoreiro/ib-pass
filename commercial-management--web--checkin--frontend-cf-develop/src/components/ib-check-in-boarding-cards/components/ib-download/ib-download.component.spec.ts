import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbDownloadComponent } from './ib-download.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AJSRootScope } from 'ib-web-commons/utils';

const fakeModel = require('test/constants/boarding-cards-constants.json').model;
const fakeBoardingInfo = fakeModel.boardingInfo;
const fakeRootScope = jasmine.createSpyObj('AJSRootScope', ['$broadcast']);

fakeRootScope.appLang = 'es';

describe('IbDownloadComponent test', () => {
    let component: IbDownloadComponent;
    let fixture: ComponentFixture<IbDownloadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbDownloadComponent],
            imports: [
                CommonModule,
                TranslateModule.forRoot()
            ],
            providers: [{ provide: AJSRootScope, useValue: fakeRootScope }]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbDownloadComponent);
        component = fixture.componentInstance;
        component.model = fakeModel;
        component.channelsList = fakeBoardingInfo.channelsList;
        component.showAppleButton = false;
        component.device = {
            raw: {
                os: {
                    mac: false,
                    ios: true
                }
            }
        };

        fixture.detectChanges();

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('when ngOnInit() is called', () => {
        it('should call setImagesRoutes() and set showAppleButton property', () => {
            spyOn(component, 'setImagesRoutes');
            component.ngOnInit();
            expect(component.setImagesRoutes).toHaveBeenCalled();
            expect(component.showAppleButton).toBeTrue();
        });

    });

    describe('when downloadTickets() is called', () => {
        it('should emit event whit updated model', () => {
            spyOn(component.askForCardsEvent, 'emit');
            component.downloadTickets('PDF');
            expect(component.channelsList[0].isSelected).toBeFalse();
            expect(component.channelsList[1].isSelected).toBeTrue();
            expect(component.model.boardingInfo.downloadFormatSelected).toEqual([{ type: 'PDF', isSelected: true }]);
            expect(component.askForCardsEvent.emit).toHaveBeenCalledWith(component.model)

        });

    });

});
