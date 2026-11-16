import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IbBookingSliceDetailsInfoComponent } from '@src/app/shared/components/ib-booking-slice-details-info/ib-booking-slice-details-info.component';
import { sliceDetailsModelMock } from './mocks/SliceDetailsModel-mock';

describe('IbBookingSliceDetailsInfoComponent', () => {
    let component: IbBookingSliceDetailsInfoComponent;
    let fixture: ComponentFixture<IbBookingSliceDetailsInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ IbBookingSliceDetailsInfoComponent ],
            imports:[
                TranslateModule.forRoot(),
                CommonModule
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(IbBookingSliceDetailsInfoComponent);
        component = fixture.componentInstance;
        component.sliceDetailsInfoModel = sliceDetailsModelMock;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe('should detect changes ', () => {
        it('and it will open modal',()=>{
            const div = document.createElement('div');
            const htmlElement = document.querySelector("body");
            div.className = 'slidesel-animated-container';
            htmlElement.appendChild(div);
            component.toggle();
            fixture.detectChanges();
            expect(document.querySelectorAll('body')[0].className).toContain('modal-open');
            expect(document.querySelectorAll('.slidesel-animated-container')[0].className).toContain('slidesel-animated-container--open-modal');
        })
        it('and it will close modal',fakeAsync(()=>{
            const div = document.createElement('div');
            const htmlElement = document.querySelector("body");
            div.className = 'slidesel-animated-container slidesel-animated-container--open-modal';
            htmlElement.appendChild(div);
            component.opened = true;
            component.toggle();
            fixture.detectChanges();
            tick(500);
            expect(document.querySelectorAll('body')[0].className).not.toContain('modal-open');
            expect(document.querySelectorAll('.slidesel-animated-container')[0].className).not.toContain('slidesel-animated-container--open-modal');
        }))
    });


    describe('should handle company logo ',()=>{
        it('if logo returns 404 error',()=>{
            const img = document.createElement('img');
            const htmlElement = document.querySelector("body");
            img.className = 'company-logo';
            img.style.display = 'flex';
            htmlElement.appendChild(img);
            component.handleCompanyLogoError({target:img});
            expect(img.style.display).toEqual('none');
        })
    })
});
