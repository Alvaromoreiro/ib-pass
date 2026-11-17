import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbUiPrefixCountryComponent } from './ib-ui-prefix-country.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const fakePrefixList = require('test/constants/boarding-cards-constants.json').model.boardingInfo.prefixList;

describe('IbUiPrefixCountryComponent', () => {
    let component: IbUiPrefixCountryComponent;
    let fixture: ComponentFixture<IbUiPrefixCountryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                TranslateModule,
                NgbModule,
                FormsModule
            ],
            declarations: [
                IbUiPrefixCountryComponent
            ]
          }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbUiPrefixCountryComponent);
        component = fixture.componentInstance;
        component.prefixList = fakePrefixList;
        component.prefixModel = '34';

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('when ngOnInit() is called', () => {
        it('should call functions', () => {
            spyOn(component, 'initPrefix');
            component.ngOnInit();
            expect(component.initPrefix).toHaveBeenCalled();
            expect(component.filteredPrefix).toEqual(component.prefixList);

        });
    });

    describe('when initPrefix() is called', () => {
        it('should set properties', () => {
            component.initPrefix();
            expect(component.selectedPrefix).toEqual('España / +34');
            expect(component.query).toEqual(component.selectedPrefix);

        });
    });

    describe('when selectPrefix() is called', () => {
        it('should update properties and emit event', () => {
            const fakePrefix = fakePrefixList[2]; //Alemania
            spyOn(component.outPrefixModel, 'emit');
            component.selectPrefix(fakePrefix);
            expect(component.selectedPrefix).toEqual('Alemania / +49');
            expect(component.query).toEqual(component.selectedPrefix);
            expect(component.outPrefixModel.emit).toHaveBeenCalledWith(fakePrefix.code)

        });
    });

    describe('when clickSelect() is called', () => {
        it('should update collapsed property', () => {
            spyOn(component, 'filterPrefix');
            component.clickSelect();
            expect(component.collapsed).toEqual(component.myDropdown.isOpen());
            expect(component.query).toEqual('');
            expect(component.filterPrefix).toHaveBeenCalled();

            component.myDropdown.open();
            component.clickSelect();
            expect(component.query).toEqual(component.selectedPrefix);

        });
    });

    describe('when clickOutsideSelect() is called', () => {
        it('should update query and collapsed', () => {
            component.myDropdown.open();
            component.clickOutsideSelect();
            expect(component.collapsed).toBeTrue();
            expect(component.query).toEqual(component.selectedPrefix);

        });
    });

    describe('when filterPrefix() is called', () => {
        it('should update filteredPrefix and haveResults', () => {
            component.query = 'Alb';
            const fakeFilteredPrefix = [{code: '355', description: 'Albania / +355', $$hashKey: 'object:3142'}];
            component.filterPrefix();
            expect(component.collapsed).toBeFalse();
            expect(component.myDropdown.isOpen()).toBeTrue();
            expect(component.filteredPrefix).toEqual(fakeFilteredPrefix);
            expect(component.haveResults).toBeTrue();

        });
    });
});
