import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { MainFooterComponent } from '@src/app/shared/components/ib-main-footer/ib-main-footer.component';
import { MainFooterService } from '@src/app/shared/components/ib-main-footer/ib-main-footer.service';
import { RootStore } from '@src/app/core/store/ib-booking-root.store';
import { StorageServiceMock } from '../../../../../mocks/Services/StorageServiceMock';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Pipe({name: 'link'})
class IbCLinkPipeMock implements PipeTransform {
    transform(value: any): any {
        return `mock-link-${value}`;
    }
}

class MainFooterServiceMock {
    getIcons = jasmine.createSpy('getIcons').and.returnValue(of({}));
}

class RootStoreMock {
    private storage = new Map<string, any>();
    
    constructor() {
        this.storage.set('appMarket', 'ES');
    }
    
    get = jasmine.createSpy('get').and.callFake((key: string) => {
        return this.storage.get(key);
    });
    
    set = jasmine.createSpy('set');
    
    getOriginalRootScope = jasmine.createSpy('getOriginalRootScope').and.returnValue({
        $on: jasmine.createSpy('$on')
    });
}

describe('MainFooterComponent', () => {
    let component: MainFooterComponent;
    let fixture: ComponentFixture<MainFooterComponent>;
    let rootStore: RootStoreMock;
    let mainFooterService: MainFooterServiceMock;
    let storageServiceMock: StorageServiceMock;

    beforeEach(async () => {
        storageServiceMock = new StorageServiceMock();
        
        await TestBed.configureTestingModule({
            declarations: [
                MainFooterComponent,
                IbCLinkPipeMock
            ],
            imports: [
                CommonModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: CommonsSessionStorageService, useValue: storageServiceMock },
                { provide: MainFooterService, useClass: MainFooterServiceMock },
                { provide: RootStore, useClass: RootStoreMock },                
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();

        fixture = TestBed.createComponent(MainFooterComponent);
        component = fixture.componentInstance;
        
        rootStore = TestBed.inject(RootStore) as any;
        mainFooterService = TestBed.inject(MainFooterService) as any;
    });

    describe('Component initialization', () => {
        it('should create the component', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize with undefined values', () => {
            expect(component.footerModel).toBeUndefined();
            expect(component.isFullWidth).toBeUndefined();
            expect(component.isFixed).toBeUndefined();
            expect(component.hashChangeControl).toBeUndefined();
            expect(component.extraClass).toBeUndefined();
        });
    });

    describe('ngOnInit', () => {
        it('should set current year and call initFooterIcons', () => {
            spyOn(component, 'initFooterIcons');
            
            component.ngOnInit();
            
            expect(component.year).toBeDefined();
            expect(component.initFooterIcons).toHaveBeenCalled();
        });
    });

    describe('fillData', () => {
        it('should handle empty payment methods without errors', () => {
            expect(() => {
                component.fillData({});
            }).not.toThrow();
        });

        it('should process payment methods data without errors', () => {
            const mockData = {
                paymentMethods: [
                    {
                        creditCardTypes: [
                            { cardTypeCode: 'VI' },
                            { cardTypeCode: 'CA' }
                        ]
                    }
                ]
            };
            
            expect(() => {
                component.fillData(mockData);
            }).not.toThrow();
        });
    });

    describe('Input properties', () => {
        it('should accept input properties', () => {
            const mockFooterModel = { test: 'data' };
            
            component.footerModel = mockFooterModel;
            component.isFullWidth = true;
            component.isFixed = false;
            component.hashChangeControl = true;
            component.extraClass = 'test-class';
            
            expect(component.footerModel).toBe(mockFooterModel);
            expect(component.isFullWidth).toBe(true);
            expect(component.isFixed).toBe(false);
            expect(component.hashChangeControl).toBe(true);
            expect(component.extraClass).toBe('test-class');
        });
    });
});
