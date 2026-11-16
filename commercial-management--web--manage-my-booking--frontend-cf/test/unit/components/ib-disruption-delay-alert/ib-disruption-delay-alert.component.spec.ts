import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AJSRootScope } from 'ib-web-commons/utils';
import { IbDisruptionDelayAlertComponent } from '../../../../src/components/ib-disruption-main/components/ib-disruption-delay-alert/ib-disruption-delay-alert.component';

describe('IbDisruptionDelayAlertComponent test', () => {
    let component: IbDisruptionDelayAlertComponent;
    let fixture: ComponentFixture<IbDisruptionDelayAlertComponent>;
    let fakeRootScope: { appMarket?: string; appLang?: string };

    beforeEach(async () => {
        fakeRootScope = {
            appMarket: 'ES',
            appLang: 'es'
        };

        await TestBed.configureTestingModule({
            declarations: [IbDisruptionDelayAlertComponent],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: AJSRootScope, useValue: fakeRootScope }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(IbDisruptionDelayAlertComponent);
        component = fixture.componentInstance;
    });

    describe('when ngOnInit() is called', () => {
        it('should initialize linkMoreInfo with the generated URL', () => {
            component.ngOnInit();

            expect(component.linkMoreInfo).toBeDefined();
            expect(component.linkMoreInfo).toContain('https://www.iberia.com/');
            expect(component.linkMoreInfo).toContain('/estado-vuelos/');
        });
    });

    describe('when generateMoreInfoUrl() is called', () => {
        it('should generate URL with Spanish market and language', () => {
            const url = component.generateMoreInfoUrl();

            expect(url).toEqual('https://www.iberia.com/es/estado-vuelos/');
        });

        it('should generate URL with lowercase appMarket and appLang', () => {
            fakeRootScope.appMarket = 'ES';
            fakeRootScope.appLang = 'ES';

            const url = component.generateMoreInfoUrl();

            expect(url).toEqual('https://www.iberia.com/es/estado-vuelos/');
        });

        it('should generate URL with English as fallback when language is not found', () => {
            fakeRootScope.appMarket = 'UK';
            fakeRootScope.appLang = 'xx';

            const url = component.generateMoreInfoUrl();

            expect(url).toEqual('https://www.iberia.com/uk/flight-status/');
        });

        it('should generate URL with empty market and English fallback when appMarket and appLang are undefined', () => {
            fakeRootScope.appMarket = undefined;
            fakeRootScope.appLang = undefined;

            const url = component.generateMoreInfoUrl();

            expect(url).toEqual('https://www.iberia.com//flight-status/');
        });

        it('should generate URL with French market and language', () => {
            fakeRootScope.appMarket = 'FR';
            fakeRootScope.appLang = 'fr';

            const url = component.generateMoreInfoUrl();

            expect(url).toEqual('https://www.iberia.com/fr/statut-vols/');
        });

        it('should generate URL with Portuguese market and language', () => {
            fakeRootScope.appMarket = 'PT';
            fakeRootScope.appLang = 'pt';

            const url = component.generateMoreInfoUrl();

            expect(url).toEqual('https://www.iberia.com/pt/status-voos/');
        });

        it('should generate URL with Catalan market and language', () => {
            fakeRootScope.appMarket = 'CAT';
            fakeRootScope.appLang = 'ca';

            const url = component.generateMoreInfoUrl();

            expect(url).toEqual('https://www.iberia.com/cat/estat-vols/');
        });

        it('should generate URL with Japanese market and language', () => {
            fakeRootScope.appMarket = 'JP';
            fakeRootScope.appLang = 'ja';

            const url = component.generateMoreInfoUrl();

            expect(url).toEqual('https://www.iberia.com/jp/ja/flight-status/');
        });
    });

    describe('when getEndPath() is called', () => {
        it('should return the correct path for supported language', () => {
            const path = component.getEndPath('es');

            expect(path).toEqual('/estado-vuelos/');
        });

        it('should return the English path as fallback for unsupported language', () => {
            const path = component.getEndPath('unsupported');

            expect(path).toEqual('/flight-status/');
        });

        it('should return the English path when language is empty string', () => {
            const path = component.getEndPath('');

            expect(path).toEqual('/flight-status/');
        });
    });

    describe('when component bindings are set', () => {
        it('should accept flights input binding', () => {
            const mockFlights = [
                { segments: [{ departureCity: { description: 'Madrid' }, arrivalCity: { description: 'Barcelona' } }] },
                { segments: [{ departureCity: { description: 'Barcelona' }, arrivalCity: { description: 'Madrid' } }] }
            ];

            component.flights = mockFlights;

            expect(component.flights).toEqual(mockFlights);
            expect(component.flights.length).toBe(2);
        });

        it('should initialize flights as undefined by default', () => {
            expect(component.flights).toBeUndefined();
        });
    });
});
