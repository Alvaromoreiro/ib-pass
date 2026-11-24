import { Component, Input, OnInit, ViewChild, OnDestroy, AfterViewInit, HostBinding } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
import angular from 'angular';
import { Prefix } from 'ib-web-commons/models';
import { IbUiPrefixAndPhoneService } from 'ib-web-commons/ui-components';
import { ComposePhoneNumber } from 'src/app/core/models/ib-pmt-telephone';
import parsePhoneNumberFromString, { CountryCode } from 'libphonenumber-js/mobile';
import { IbPmtTelephoneService } from './service/ib-pmt-telephone.service';
import { AutoComplete } from 'primeng/autocomplete';
import { Subscription } from 'rxjs';

@Component({
    selector:'ib-pmt-telephone',
    templateUrl:'./ib-pmt-telephone.component.html',
    styleUrls: ['./ib-pmt-telephone.component.scss']

})

export class IbPmtTelephone implements OnInit, OnDestroy, AfterViewInit {

    @Input()
    public phoneSelected:ComposePhoneNumber;
    @Input()
    public submittedTab: ComposePhoneNumber;
    @Input()
    public containerForm;

    @ViewChild('autoComplete')
        autoComplete!: AutoComplete;

    @HostBinding('class.ib-pmt-telephone--open')
    public dropdownOpened = false;

    public filteredPrefix: any[];
    public prefixList;
    public requiredError : boolean;
    public patternError : boolean;
    public prefixReadonly: boolean = true;
    private subscriptionTelephoneService: Subscription;
    private lastValidPrefix: Prefix;
    

    constructor (private ibUiPrefixAndPhoneService: IbUiPrefixAndPhoneService, private ibPmtTelephoneService:IbPmtTelephoneService){
    }
   
    ngOnInit (): void  {
        this.ibUiPrefixAndPhoneService.initializePrefixAndPhone().then(
            (response:Prefix[]) => {
                if (!this.phoneSelected?.prefix?.id ){
                    this.phoneSelected.prefix = response[0];
                }
                this.lastValidPrefix = this.phoneSelected.prefix;    
                this.prefixList = response;
                this.filteredPrefix = response;
            }, () => { });

        this.subscriptionTelephoneService=this.ibPmtTelephoneService.$submittedFormObser.subscribe((submitState)=>{if(submitState)this.validatePhoneNumber();});
            

    }
    ngOnDestroy (): void {
        this.subscriptionTelephoneService.unsubscribe();
    }

    ngAfterViewInit (): void {
        const $input = this.autoComplete.el.nativeElement.querySelector('input');
        $input?.setAttribute('autocomplete', 'off');
    }
    
    filterPrefix (event) {
        let filtered: Prefix[] = [];
        let query = event.query;
        for (let i = 0; i < this.prefixList.length; i++) {
            let actualPrefix = this.prefixList[i];
            if (actualPrefix.name.includes(query)) {
                filtered.push(actualPrefix);
            }
        }

        this.filteredPrefix = filtered;
    }


    onDropdownShow (): void {
        this.dropdownOpened = true;
    }

    onDropdownHide (): void {
        this.dropdownOpened = false;
    }

    onFocus ():void{
        this.prefixReadonly = false;
        this.autoComplete.show();
    } 

    onSelect (prefix: Prefix) {
        this.lastValidPrefix = prefix;
    }

    onBlur ():void{
        this.prefixReadonly = true;
        if(!this.phoneSelected.prefix){
            this.phoneSelected.prefix = this.lastValidPrefix;
        }
    } 

    validatePhoneNumber (): void {

        const phone = parsePhoneNumberFromString(`${this.phoneSelected.prefix?.id}${this.phoneSelected.number}`, <CountryCode>this.phoneSelected.prefix?.country);

        const validateFunc = phone?.isValid()&&this.phoneSelected.prefix?.id  ?this.clearErrors: this.detectError;

        validateFunc();
    }

 
    private clearErrors= ():void=>{
        this.containerForm.$invalid=false;
        if(Object.keys(this.containerForm.$error).length===0)
            this.containerForm.$valid=true;
        this.requiredError=false;
        this.patternError=false;

    };

    private detectError= ():void=>{
        this.containerForm.$invalid=true;
        this.containerForm.$valid=false;
        this.containerForm.newPhone.$valid=false;

        if(!this.phoneSelected.number || !this.phoneSelected.prefix){
            this.requiredError=true;
            this.patternError=false;
        }
        if(this.phoneSelected.number ){
            this.requiredError=false;
            this.patternError=true;

        }
    };
}

try {
    
    angular.module('ib-pmt-telephone-module').directive('ibPmtTelephone', downgradeComponent({
        component:IbPmtTelephone,
        inputs:[
            'phoneSelected', 'containerForm'
        ]
    })as angular.IDirectiveFactory);

} catch {
   
    angular.module('ib-pmt-telephone-module', []).directive('ibPmtTelephone', downgradeComponent({
        component:IbPmtTelephone,
        inputs:[
            'phoneSelected', 'containerForm'
        ]
    })as angular.IDirectiveFactory);

}

