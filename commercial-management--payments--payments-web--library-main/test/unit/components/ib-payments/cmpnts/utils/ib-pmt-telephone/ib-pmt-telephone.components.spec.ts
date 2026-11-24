import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { IbPmtTelephoneService } from 'src/components/ib-payments/cmpnts/utils/ib-pmt-telephone/service/ib-pmt-telephone.service';
import { IbPmtTelephone } from 'src/components/ib-payments/cmpnts/utils/ib-pmt-telephone/ib-pmt-telephone.components';
import { IbUiPrefixAndPhoneService } from 'ib-web-commons/ui-components';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subscription } from 'rxjs';
import { MockPipe } from 'ng-mocks';
import {TranslatePipe} from '@ngx-translate/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('IbPmtTelephoneComponent test', ()=>{

    let fixture:ComponentFixture<IbPmtTelephone>;
    let ibPmtTelephoneComponent:IbPmtTelephone;
    let spyIbUiPrefixAndPhoneService: jasmine.SpyObj<IbUiPrefixAndPhoneService>;
    let spySubScription: Subscription;
    class fakeIbpmtTelephoneService{
        constructor (){
            this.submittedForm = new BehaviorSubject(false);
            this.$submittedFormObser = this.submittedForm.asObservable();
        }
        private submittedForm : BehaviorSubject<boolean>;
        public readonly $submittedFormObser : Observable<boolean>;
            
    }


    beforeEach(async ()=>{

        await TestBed.configureTestingModule({
            providers:[
                IbPmtTelephone,
                {
                    provide:IbPmtTelephoneService, useClass:fakeIbpmtTelephoneService
                },
                {
                    provide:IbUiPrefixAndPhoneService, useValue:jasmine.createSpyObj('IbUiPrefixAndPhoneService', ['initializePrefixAndPhone'])
                }
                
            ],
            imports: [HttpClientTestingModule, AutoCompleteModule],
            declarations:[ IbPmtTelephone, MockPipe(TranslatePipe)]

        }).compileComponents();
        spySubScription = new Subscription();

       

        spyOn(spySubScription, 'unsubscribe').and.callThrough();
        spyIbUiPrefixAndPhoneService =TestBed.inject(IbUiPrefixAndPhoneService) as jasmine.SpyObj<IbUiPrefixAndPhoneService>;
        spyIbUiPrefixAndPhoneService.initializePrefixAndPhone.and.resolveTo([{'id':'+34', country:'ES', name:'ES'}, {'id':'+35', country:'ES', name:'ES'}]);

        fixture = TestBed.createComponent(IbPmtTelephone);
        ibPmtTelephoneComponent =fixture.componentInstance;
        ibPmtTelephoneComponent.phoneSelected ={prefix:{id:'', name:'', country:''}, number:''};
        ibPmtTelephoneComponent.containerForm={};

    });


    it('should create', fakeAsync( ()=>{
        fixture.detectChanges();
        expect(ibPmtTelephoneComponent).toBeTruthy();
    }));
    
    it('Component is initialize', fakeAsync( ()=>{
        fixture.detectChanges();
        tick();
        expect( ibPmtTelephoneComponent.prefixList.length).toEqual(2);
        expect( ibPmtTelephoneComponent.prefixList[0].id).toEqual('+34');    
    }));


});