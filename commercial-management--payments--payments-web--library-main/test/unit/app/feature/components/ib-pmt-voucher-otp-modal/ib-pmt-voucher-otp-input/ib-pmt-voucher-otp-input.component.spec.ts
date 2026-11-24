
import { TestBed} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { IbPmtOtpInputComponent } from 'src/app/feature/components/ib-pmt-voucher-otp-modal/components/ib-pmt-otp-input/ib-pmt-otp-input.component';

describe('Test OTP input', ()=> {
    let fixture;
    let component: IbPmtOtpInputComponent;

    beforeEach(()=>{
        TestBed.configureTestingModule( {
            declarations: [ IbPmtOtpInputComponent ],
            providers: [TranslateService],
            imports: [ReactiveFormsModule, TranslateModule, FormsModule, TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })]
        } );
        fixture = TestBed.createComponent( IbPmtOtpInputComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should add collapse classes and attributes on click', () => {
        expect( component ).toBeDefined();
    });

    it('Test reactiveCompletedTrigger', (done) => {
        const value = ['1', '2', '3', '4', '5', '6'];
        component.otpInputs.setValue(value);
        let sub = component.otpChanged.subscribe((event)=>{
            sub.unsubscribe();
            expect(event).toEqual({value: value.join('')});
            done();
        });
    });

    describe('Test onPaste form first input', ()=> {
        it('Test pasting valid data', ()=> {
            const pasteValue = '123456';
            const mockEvent: any = { preventDefault: ()=>{}, clipboardData:{getData:()=> pasteValue}};
            component.onPaste(mockEvent as ClipboardEvent, 0);
            expect(component.otpInputs.getRawValue()).toEqual(['1', '2', '3', '4', '5', '6']);
        });
        it('Test pasting invalid data', ()=> {
            const pasteValue = '123w456';
            const mockEvent: any = { preventDefault: ()=>{}, clipboardData:{getData:()=> pasteValue}};
            component.onPaste(mockEvent as ClipboardEvent, 0);
            expect(component.otpInputs.getRawValue()).toEqual(['', '', '', '', '', '']);
        });
        it('Test from different input index', ()=> {
            const pasteValue = '123456';
            const mockEvent: any = { preventDefault: ()=>{}, clipboardData:{getData:()=> pasteValue}};
            component.onPaste(mockEvent as ClipboardEvent, 3);
            expect(component.otpInputs.getRawValue()).toEqual(['', '', '', '1', '2', '3']);
        });
    });

    describe('Test KeyDown actions', ()=> {
        it('Control key is presed', ()=> {
            const mockEvent: any = {key: 'Control', ctrlKey: true};
            expect(component.onKeyDown(mockEvent)).toBeTruthy();
        });
        it('Invalid key is presed', ()=> {
            const mockEvent: any = {key: 'a'};
            expect(component.onKeyDown(mockEvent)).toBeFalsy();
        });
        it('Valid key is presed', ()=> {
            const mockEvent: any = {key: '4'};
            expect(component.onKeyDown(mockEvent)).toBeTruthy();
        });
    });

    describe('Test onKeyUp', ()=> {

        let targetMock;
        beforeEach(()=> {
            targetMock = {
                nextElementSibling:{
                    select: jasmine.createSpy('select').and.callFake(()=>{})
                },
                previousElementSibling:{
                    select: jasmine.createSpy('select').and.callFake(()=>{})
                }
            };
        });
        it('pushed backspace and previously exists value', ()=> {
            const target = Object.assign({value:'6' }, targetMock);
            const event= {key: 'Backspace', target};
            component.otpInputs.setValue(['1', '2', '3', '4', '5', '6']);
            component.onKeyUp(event as any, 5);
            expect(component.otpInputs.getRawValue()).toEqual(['1', '2', '3', '4', '5', null]);
            expect(target.previousElementSibling.select).not.toHaveBeenCalled();
        });
        it('pushed backspace and index is empty', ()=> {
            const target = Object.assign({value:'' }, targetMock);
            const event= {key: 'Backspace', target};
            component.otpInputs.setValue(['1', '2', '3', '4', '5', '']);
            component.onKeyUp(event as any, 5);
            expect(component.otpInputs.getRawValue()).toEqual(['1', '2', '3', '4', null, '']);
            expect(target.previousElementSibling.select).toHaveBeenCalled();
        });
        it('Valid value inserted in position 3', ()=> {
            const target = Object.assign({value:'8' }, targetMock);
            const event= {key: '8', target};
            component.onKeyUp(event as any, 3);
            expect(target.nextElementSibling.select).toHaveBeenCalled();
        }); 
        it('pushed ArrowRight', ()=> {
            const target = Object.assign({value:'6' }, targetMock);
            const event= {key: 'ArrowRight', target};
            component.otpInputs.setValue(['1', '2', '3', '4', '5', '6']);
            component.onKeyUp(event as any, 5);
            expect(component.otpInputs.getRawValue()).toEqual(['1', '2', '3', '4', '5', '6']);
            expect(target.nextElementSibling.select).toHaveBeenCalled();
        });       
    });

    it('Test set Enabled', () =>{
        component.setEnabled(true);
        expect(component.otpInputs.enabled).toBeTruthy();
        component.setEnabled(false);
        expect(component.otpInputs.enabled).toBeFalsy();
    });
    it('Test reset', () =>{
        component.otpInputs.setValue(['1', '2', '3', '4', '5', '6']);
        component.reset();
        expect(component.otpInputs.getRawValue()).toEqual([null, null, null, null, null, null]);
    });

    
});