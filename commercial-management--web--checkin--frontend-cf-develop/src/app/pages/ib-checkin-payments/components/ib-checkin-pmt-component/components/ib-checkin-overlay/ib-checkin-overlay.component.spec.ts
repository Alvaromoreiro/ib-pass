import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import {
    IbCheckinOverlayComponent
} from './ib-checkin-overlay.component';
import { NgReactComponent } from '@src/app/react/wrapper/ng-react.component';
import { AJSRootScope } from 'ib-web-commons/utils';

describe('IbCheckinOverlayComponent', () => {
    let component: IbCheckinOverlayComponent;
    let fixture: ComponentFixture<IbCheckinOverlayComponent>;
    let translateService: jasmine.SpyObj<TranslateService>;
    let mockRootScope: { appLang: string };

    beforeEach(async () => {
        const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);
        mockRootScope = { appLang: 'es' };

        await TestBed.configureTestingModule({
            declarations: [IbCheckinOverlayComponent, NgReactComponent],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: TranslateService, useValue: translateServiceSpy },
                { provide: AJSRootScope, useValue: mockRootScope }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbCheckinOverlayComponent);
        component = fixture.componentInstance;
        translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize props with default title from TranslateService', () => {
        translateService.instant.and.returnValue('Loading...');
        component.ngOnChanges({});
        expect(component.props).toEqual({
            title: 'Loading...',
            subtitles: undefined,
            textTransition: undefined,
            isOpen: false
        });
        expect(translateService.instant).toHaveBeenCalledWith('WAITING_LOADING_PAYMENTS_CARDS_TEXT');
    });

    it('should update props when inputs change', () => {
        component.title = 'Custom Title';
        component.subtitles = ['Subtitle 1', 'Subtitle 2'];
        component.textTransition = 10;
        component.isOpen = true;

        component.ngOnChanges({
            title: new SimpleChange(null, 'Custom Title', true),
            subtitles: new SimpleChange(null, ['Subtitle 1', 'Subtitle 2'], true),
            textTransition: new SimpleChange(null, 'Transition Text', true),
            isOpen: new SimpleChange(null, true, true)
        });

        expect(component.props).toEqual({
            title: 'Custom Title',
            subtitles: ['Subtitle 1', 'Subtitle 2'],
            textTransition: 10,
            isOpen: true
        });
    });

    it('should update title with translation if not provided', () => {
        translateService.instant.and.returnValue('Translated Title');
        component.subtitles = ['Subtitle 1', 'Subtitle 2'];
        component.textTransition = 10;
        component.isOpen = true;

        component.ngOnChanges({
            subtitles: new SimpleChange(null, ['Subtitle 1', 'Subtitle 2'], true),
            textTransition: new SimpleChange(null, 'Transition Text', true),
            isOpen: new SimpleChange(null, true, true)
        });

        expect(component.props).toEqual({
            title: 'Translated Title',
            subtitles: ['Subtitle 1', 'Subtitle 2'],
            textTransition: 10,
            isOpen: true
        });
        expect(translateService.instant).toHaveBeenCalledWith('WAITING_LOADING_PAYMENTS_CARDS_TEXT');
    });
});
