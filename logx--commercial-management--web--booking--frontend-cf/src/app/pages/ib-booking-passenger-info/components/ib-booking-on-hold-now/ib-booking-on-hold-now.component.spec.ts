import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbBookingOnHoldNowComponent } from './ib-booking-on-hold-now.component';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

describe('IbBookingOnHoldNowComponent', () => {
    let component: IbBookingOnHoldNowComponent;
    let fixture: ComponentFixture<IbBookingOnHoldNowComponent>;
    const fakeSessionStorage = new StorageServiceMock();
    const fakeRootscope: any = {
        $emit: ()=>{}
    };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ IbBookingOnHoldNowComponent ],
            imports:[
                TranslateModule.forRoot(),
                CommonModule
            ],
            providers:[
                { provide: CommonsSessionStorageService, useValue: fakeSessionStorage },
                { provide: AJSRootScope, useValue: fakeRootscope }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(IbBookingOnHoldNowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    describe('should create', ()=>{
        it('component', () => {
            expect(component).toBeTruthy();
        });
    });

    describe('if holdOrder is called, ', ()=>{
        it('it will redirect to payments', () => {
            component.holdOrder();
            expect(fakeSessionStorage.get('flowApp')).toEqual('BBKIOH');
        });
    });

});
