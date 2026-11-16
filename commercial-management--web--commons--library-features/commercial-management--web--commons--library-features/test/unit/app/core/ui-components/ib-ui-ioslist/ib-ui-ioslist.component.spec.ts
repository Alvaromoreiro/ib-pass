import { CommonModule } from '@angular/common';
import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { IbUiIoslistComponent } from 'ib-web-commons/ui-components';

describe('IbUiIoslistComponent', () => {
    let component: IbUiIoslistComponent;
    let fixture: ComponentFixture<IbUiIoslistComponent>;
    class fakeElementRef extends ElementRef {}
    class TranslateServiceMock {
        public instant = jasmine.createSpy( 'instant' ).and.callFake( (description) => description );
    }
    let fakeTranslateService = new TranslateServiceMock();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ IbUiIoslistComponent ],
            imports:[
                TranslateModule.forRoot(),
                CommonModule
            ],
            providers:[
                { provide: TranslateService, useValue: fakeTranslateService },
                { provide: ElementRef, useValue: fakeElementRef }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbUiIoslistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.group = 'España';
        component.cities = [{
            code: 'MAD',
            description: 'Madrid',
            countryCode: 'ES',
            areaCode: 'test',
            group: 'España',
            country: 'España'
        },
        {
            code: 'VLC',
            description: 'Valencia',
            countryCode: 'ES',
            areaCode: 'test',
            group: 'España',
            country: 'España'
        },
        {
            code: 'BCN',
            description: 'Barcelona',
            countryCode: 'ES',
            areaCode: 'test',
            group: 'España',
            country: 'España'
        },
        {
            code: 'BCN',
            description: 'Barcelona',
            countryCode: 'ES',
            areaCode: 'test',
            group: 'España',
            country: 'España'
        }];
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('when isSelected is called', () => {
        it(' , it will send city info to city selector component', ()=>{
            let mouseEvent = new MouseEvent('click');
            spyOn(mouseEvent, 'preventDefault');
            spyOn(mouseEvent, 'stopPropagation');
            spyOn(fixture.nativeElement, 'dispatchEvent');
            component.isSelected(mouseEvent, {
                code: 'MAD',
                description: 'Madrid',
                countryCode: 'ES',
                areaCode: 'test',
                group: 'España',
                country: 'España'
            });
            expect(fixture.nativeElement.dispatchEvent).toHaveBeenCalled();
        });
    });

    describe('when sortAndGroupedCities is called', () => {
        it(' and there is a letter to filter , it will return sorted and grouped cities array ', ()=>{
            let city = {
                code: 'MAD',
                description: 'Madrid',
                countryCode: 'ES',
                areaCode: 'test',
                group: 'España',
                country: 'España'
            };
            let returnData = component.sortAndGroupedCities('M');
            expect(returnData).toEqual([city]);
        });
        it(' and there is no letter to filter , it will return sorted and grouped cities array ', ()=>{
            let returnData = component.sortAndGroupedCities('all');
            expect(returnData).toEqual([]);
        });
    });
    describe('when isCityInGroup is called', () => {
        it(' and there is no letter to filter', ()=>{
            let returnData = component.isCityInGroup('all');
            expect(returnData).toEqual(component.cities);
        });
    });
});
