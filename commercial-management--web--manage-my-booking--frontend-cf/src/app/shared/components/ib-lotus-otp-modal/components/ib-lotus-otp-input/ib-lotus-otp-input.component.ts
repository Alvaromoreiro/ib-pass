import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { OtpInputChangeEvent } from '@src/app/core/models/ib-lotus-otp-models';
import { Observable, Subscription, debounceTime } from 'rxjs';



@Component({
    selector: 'ib-lotus-otp-input',
    templateUrl: './ib-lotus-otp-input.component.html',
    styleUrls: ['./ib-lotus-otp-input.component.scss']
})
export class IbLotusOtpInputComponent implements OnInit, OnDestroy {


    private readonly FOCUS_PREV_KEYSET = new Set<string>(['Backspace', 'ArrowLeft']);
    private readonly VALID_PASTE_VALUE= /^[0-9]*$/;
    private readonly VALID_KEYS= /^[0-9]{1}$/;
    private readonly INVALID_KEYS= /^([a-zA-Z]|(Backspace)){1}$/; 

    @Input() public inputLength = 6;
    @Output() otpChanged = new EventEmitter<OtpInputChangeEvent>();
    public otpInputs = new FormArray([]);
    public form  = new FormGroup({
        otpInputs: this.otpInputs
    });

    public subscriptions : Subscription[] = [];

    private selfElement: HTMLElement;

    constructor (
        private ElementRef: ElementRef
    ){
        this.selfElement = this.ElementRef.nativeElement;
    }
    ngOnDestroy (): void {
        this.subscriptions.forEach((sub)=>{sub.unsubscribe();});
    }
    ngOnInit (): void {
        for (let i = 1 ;i <= this.inputLength; i++ ){
            this.otpInputs.push(new FormControl(''));
        }
        this.reactiveChangeTrigger();
    }

    private reactiveChangeTrigger = () => {
        const observable = this.otpInputs.valueChanges as Observable<string[]>;
        this.subscriptions.push(
            observable.pipe(
                debounceTime(75))
                .subscribe(
                    (inputsVal) =>{
                        this.otpChanged.emit({value:inputsVal.join('')});
                    }));
    };
    

    public onPaste = (event: ClipboardEvent, targetIndex: number) => {
        event.preventDefault();
        const data = event.clipboardData.getData('Text');
        const controls = this.otpInputs.controls;
        let lastIndex;
        let j = 0;
        if(this.VALID_PASTE_VALUE.test(data)){
            for (lastIndex = targetIndex, j=0; (lastIndex< controls.length && j< data.length); lastIndex++, j++) {
                controls[lastIndex].setValue(data[j]);
            }
            (this.selfElement.querySelector(`[data-otp-index="${lastIndex}"]`) as HTMLInputElement)?.focus();
        }
        
        

    };

    public onKeyDown = (ev: KeyboardEvent) => {
        const {key} = ev;
        if (ev.ctrlKey) {
            return true;
        }
        if (this.INVALID_KEYS.test(key)){
            return false;
        }
        return true;
    };

    private changeFocus = (target: HTMLInputElement, key:string, value:string)=> {
        if ('ArrowRight'=== key) {
            ((target.nextElementSibling as HTMLInputElement)??target)?.select();
            return;
        }
        if (this.FOCUS_PREV_KEYSET.has(key)) {
            ((target.previousElementSibling as HTMLInputElement)?? target)?.select();
            return;
        }
        if(value.length>0 && this.VALID_KEYS.test(key)) {
            ((target.nextElementSibling as HTMLInputElement) ?? target)?.select();
            return;
        }
    };
    public onKeyUp = (ev: KeyboardEvent, targetIndex: number) => {
        const target =  ev.target as HTMLInputElement;
        const key  = ev.key;
        const value = target.value;
        if ('Backspace'=== key) {
            if (value.length > 0) {
                this.otpInputs.controls[targetIndex].reset();
                return;
            } else{
                this.otpInputs.controls[targetIndex-1]?.reset();
            }
        }
        this.changeFocus(target, key, value);
    };

    public setEnabled = (enabled:boolean) => {
        try{
            this.otpInputs[(enabled ?'enable': 'disable')]({emitEvent: false});
        }catch(e){}
        
    };
    public reset = (emitEvent= true) => {
        try{
            this.otpInputs.reset(Array(this.inputLength), {emitEvent});
            (this.selfElement.querySelector(`[data-otp-index="0"]`) as HTMLInputElement)?.focus();
        }catch(e){}
        
    };
   
}   