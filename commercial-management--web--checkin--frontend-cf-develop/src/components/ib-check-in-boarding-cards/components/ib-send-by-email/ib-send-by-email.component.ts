import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AJSRootScope, downgradeToAJSComponent } from 'ib-web-commons/utils';


@Component({
    selector: 'ib-send-by-email',
    templateUrl: './ib-send-by-email.component.html',
    styleUrls: ['./ib-send-by-email.component.scss']
})
export class IbSendByEmailComponent implements OnInit {

    darkText: string = 'darkText';
    sendOneEmailForm: FormGroup;
    sendAllEmailForm: FormGroup;
    oneFormSubmitted = false;
    allFormSubmitted = false;
    @Input() model;
    @Input() formatsList;
    @Input() channelsList;
    @Input() passengersList;
    @Input() showContinueButton;
    @Input() onlyPdf;

    qrCheckBoxDisabled = false;
    pdfCheckBoxDisabled = false;
    qr2CheckBoxDisabled = false;
    pdf2CheckBoxDisabled = false;
    labelFocus = '';

    @Output() askForCardsEvent = new EventEmitter<any>();

    constructor (private fb: FormBuilder, @Inject(AJSRootScope) protected rootScope) {

    }

    ngOnInit (): void {
        this.updateCheckboxes();
        this.createForms();

    }

    createForms () {
        this.sendOneEmailForm = this.fb.group({
            pdfFormat: {value:true, disabled: true},
            qrFormat: {value:false, disabled: false},
            email: [this.passengersList[0].email, [Validators.required, Validators.pattern(this.rootScope.CHECKIN_PATTERNS.EMAIL_PATTERN)]]
        });

        this.sendAllEmailForm = this.fb.group({
            pdfFormat2: {value:true, disabled: true},
            qrFormat2: {value:false, disabled: false}
        });
        this.passengersList.forEach((passenger, i) => {
            this.sendAllEmailForm.addControl(`email${i}`, new FormControl(passenger.email, [Validators.required, Validators.pattern(this.rootScope.CHECKIN_PATTERNS.EMAIL_PATTERN)]));
        });
    }

    updateCheckboxes () {
        this.formatsList[0].isSelected = true;
        if(this.formatsList[1]){
            this.formatsList[1].isSelected = false;
        }
        this.pdfCheckBoxDisabled = true;
        this.pdf2CheckBoxDisabled = true;
    }

    updateCheckbox (form:string, format1:string, format2:string) {
        let value;
        if (form === 'sendAll'){
            format1 = format1.concat('2');
            value = this.sendAllEmailForm.get(format1)?.value;
        } else{
            value = this.sendOneEmailForm.get(format1)?.value;
        }

        if(value){
            this.sendOneEmailForm.get(format2)?.enable();
            this.sendAllEmailForm.get(format2+'2')?.enable();
            if(format2 === 'pdfFormat'){
                this.pdfCheckBoxDisabled = false;
                this.pdf2CheckBoxDisabled = false;
            } else {
                this.qrCheckBoxDisabled = false;
                this.qr2CheckBoxDisabled = false;
            }
        } else {
            this.sendOneEmailForm.get(format2)?.disable();
            this.sendAllEmailForm.get(format2+'2')?.disable();
            if(format2 === 'pdfFormat'){
                this.pdfCheckBoxDisabled = true;
                this.pdf2CheckBoxDisabled = true;
            } else {
                this.qrCheckBoxDisabled = true;
                this.qr2CheckBoxDisabled = true;
            }

        }
    }

    isOtherCheckboxUnchecked (other:number): boolean {
        return !this.formatsList[other].isSelected;
    }

    sendEmailTickets (): void {
        let valid;
        if (this.model.boardingInfo.selectedTab === 0) {
            this.oneFormSubmitted = true;
            valid = this.sendOneEmailForm.valid;
        } else {
            this.allFormSubmitted = true;
            valid = this.sendAllEmailForm.valid;
        }
        if (valid) {
            this.channelsList[0].isSelected = true;
            this.channelsList[1].isSelected = false;
            this.askForCardsEvent.emit(this.model);
        }
    }

    setSelectedTab (tab:number): void {
        this.model.boardingInfo.selectedTab = tab;
    }

    setFocus (label: string): void {
        this.labelFocus = label;
    }

    formatName (text: string): string {
        const fragments = text.toLowerCase().split(' ');

        fragments.forEach((fragment, index) => {
            fragments[index] = fragment.charAt(0).toUpperCase() + fragment.slice(1);
        });

        return fragments.join(' ');
    }
}
downgradeToAJSComponent('ibSendByEmail', { component: IbSendByEmailComponent }, 'ib-send-by-email-module');
