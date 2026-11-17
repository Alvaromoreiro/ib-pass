import { ElementRef, EventEmitter } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormArray } from '@angular/forms';

import { IbLotusOtpInputComponent } from './ib-lotus-otp-input.component';
import { IbPmtOtpInputComponent } from '@src/app/pages/ib-checkin-payments/components/ib-pmt-voucher-otp-modal/components/ib-pmt-otp-input/ib-pmt-otp-input.component';

interface OtpInputLike {
    inputLength: number;
    otpInputs: FormArray;
    otpChanged: EventEmitter<{ value: string }>;
    ngOnInit(): void;
    ngOnDestroy(): void;
    onPaste(event: ClipboardEvent, targetIndex: number): void;
    onKeyDown(event: KeyboardEvent): boolean;
    onKeyUp(event: KeyboardEvent, targetIndex: number): void;
    setEnabled(enabled: boolean): void;
    reset(emitEvent?: boolean): void;
}

const runOtpInputTests = (
    name: string,
    createComponent: (element: HTMLElement) => OtpInputLike
): void => {
    const createKeyUpEvent = (key: string, target: HTMLInputElement): KeyboardEvent => {
        const event = new KeyboardEvent('keyup', { key });
        target.dispatchEvent(event);
        return event;
    };

    describe(name, () => {
        let component: OtpInputLike;
        let element: HTMLElement;
        let inputs: HTMLInputElement[];

        beforeEach(() => {
            element = document.createElement('div');
            inputs = Array.from({ length: 4 }, (_, index) => {
                const input = document.createElement('input');
                input.dataset.otpIndex = String(index);
                element.appendChild(input);
                return input;
            });
            component = createComponent(element);
            component.inputLength = 4;
            component.ngOnInit();
        });

        it('creates one form control for each OTP digit', () => {
            expect(component.otpInputs.length).toBe(4);
            expect(component.otpInputs.value).toEqual(['', '', '', '']);
        });

        it('accepts numeric paste, fills available controls, and focuses the next input', () => {
            const preventDefault = jasmine.createSpy('preventDefault');
            const event = {
                preventDefault,
                clipboardData: { getData: jasmine.createSpy('getData').and.returnValue('42') }
            } as unknown as ClipboardEvent;
            spyOn(inputs[3], 'focus');

            component.onPaste(event, 1);

            expect(preventDefault).toHaveBeenCalled();
            expect(component.otpInputs.value).toEqual(['', '4', '2', '']);
            expect(inputs[3].focus).toHaveBeenCalled();
        });

        it('does not paste non-numeric content', () => {
            const event = {
                preventDefault: jasmine.createSpy('preventDefault'),
                clipboardData: { getData: jasmine.createSpy('getData').and.returnValue('4a') }
            } as unknown as ClipboardEvent;

            component.onPaste(event, 0);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(component.otpInputs.value).toEqual(['', '', '', '']);
        });

        it('filters invalid keys and moves focus for digits and navigation keys', () => {
            expect(component.onKeyDown(new KeyboardEvent('keydown', { key: 'a' }))).toBe(false);
            expect(component.onKeyDown(new KeyboardEvent('keydown', { key: '5' }))).toBe(true);
            expect(component.onKeyDown(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }))).toBe(true);

            spyOn(inputs[1], 'select');
            inputs[0].value = '5';
            component.onKeyUp(
                createKeyUpEvent('5', inputs[0]),
                0
            );
            expect(inputs[1].select).toHaveBeenCalled();

            spyOn(inputs[2], 'select');
            component.onKeyUp(
                createKeyUpEvent('ArrowRight', inputs[1]),
                1
            );
            expect(inputs[2].select).toHaveBeenCalled();
        });

        it('resets the current or previous digit on backspace and supports enable, disable, and reset', () => {
            component.otpInputs.setValue(['1', '2', '3', '4']);
            inputs[1].value = '2';
            component.onKeyUp(
                createKeyUpEvent('Backspace', inputs[1]),
                1
            );
            expect(component.otpInputs.at(1).value).toBeNull();

            component.otpInputs.setValue(['1', '', '3', '4']);
            inputs[1].value = '';
            spyOn(inputs[0], 'select');
            component.onKeyUp(
                createKeyUpEvent('Backspace', inputs[1]),
                1
            );
            expect(component.otpInputs.at(0).value).toBeNull();
            expect(inputs[0].select).toHaveBeenCalled();

            component.setEnabled(false);
            expect(component.otpInputs.disabled).toBe(true);
            component.setEnabled(true);
            expect(component.otpInputs.enabled).toBe(true);

            spyOn(inputs[0], 'focus');
            component.reset(false);
            expect(component.otpInputs.pristine).toBe(true);
            expect(inputs[0].focus).toHaveBeenCalled();
        });

        it('emits the combined OTP after the debounce interval and unsubscribes on destroy', fakeAsync(() => {
            const values: string[] = [];
            component.otpChanged.subscribe((event) => values.push(event.value));

            component.otpInputs.setValue(['1', '2', '3', '4']);
            tick(75);
            expect(values).toEqual(['1234']);

            component.ngOnDestroy();
            component.otpInputs.setValue(['4', '3', '2', '1']);
            tick(75);
            expect(values).toEqual(['1234']);
        }));
    });
};

runOtpInputTests(
    'IbLotusOtpInputComponent',
    (element) => new IbLotusOtpInputComponent(new ElementRef(element))
);

runOtpInputTests(
    'IbPmtOtpInputComponent',
    (element) => new IbPmtOtpInputComponent(new ElementRef(element))
);
