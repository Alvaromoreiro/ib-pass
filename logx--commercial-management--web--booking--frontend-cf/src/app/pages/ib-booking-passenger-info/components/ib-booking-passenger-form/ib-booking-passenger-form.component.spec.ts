import { IbBookingPassengerFormComponent } from '@pages/ib-booking-passenger-info/components/ib-booking-passenger-form/ib-booking-passenger-form.component';
import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AJSRootScope, CommonsSessionStorageService, IbCUserUtilsService } from 'ib-web-commons/utils';
import { IbBookingRegisterFormDataService } from '@src/app/pages/ib-booking-passenger-info/components/ib-booking-register-form/services/ib-booking-register-form-data.service';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { AJSBookingModalService } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { AJSBookingPassengerInfoService } from '@src/app/pages/ib-booking-passenger-info/services/ib-booking-passenger-info-service-bridge.service';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { CommonsUserUtilsServiceMock } from 'test/unit/app/services/ib-booking-availability/ib-booking-availability-service-test-mocks';
import { IbBookingPassengerInfoUtilsService } from '@src/app/shared/services/ib-booking-passenger-info/ib-booking-passenger-info-utils.service';
import { IbBookingPassengerFormUtilsService } from '@src/app/shared/services/ib-booking-passenger-form/ib-booking-passenger-form-utils.service';
import { emptyAdultData, fullAdultData, fullChildData, fullInfantData } from '@test-mocks/unit/app/pages/ib-booking-passenger-info/ib-booking-passenger-form/PassengersDataMock';
import { AutoComplete } from 'primeng/autocomplete';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { PassengerFormUtilsService } from '@pages/ib-booking-passenger-info/components/ib-booking-passenger-form/services/passenger-form-utils.service';
import { ManageStoredPassengerFormDataService } from '@pages/ib-booking-passenger-info/components/ib-booking-passenger-form/services/manage-stored-passenger-form-data.service';


class RootScopeMock {
    private handlers: { [name: string]: (...args: any[]) => void } = {};
    $broadcast (name: string, ...args: any[]) { this.handlers[name]?.(...args); }
    public isShuttleFlow:false;
}
class BookingModalServiceMock {
    showBKIGenericModal () { }
} 

class BookingPassengerInfoServiceMock{
    showGender (){}
    recoverUserName (){}
}

class BookingUtilServiceMock {
    trunkateMaxLength = jasmine.createSpy('trunkateMaxLength').and.returnValue({surname:'test'});
    checkUserMustFlyFromFare = jasmine.createSpy('trunkateMaxLength').and.returnValue(true);
    getTypeOfPassenger (){}
}

class IbBookingRegisterFormDataServiceMock {
    setName (){}
    setLastName (){}
}

class IbBookingPassengerInfoUtilsServiceMock{
    resetStoragedMandatoryDocs (){}
    addTravelDocs (){}
}

class PassengerFormUtilsServiceMock {
    public getPreselectedFieldValue = jasmine.createSpy('getPreselectedFieldValue').and.callFake((passengerInfo, fieldKey: string, code: string) => {
        const allValues = passengerInfo?.requiredFields[fieldKey]?.values || [];
        return allValues.find(item => item.code === code);
    });
}

class ManageStoredPassengerFormDataServiceMock {
    public setFormValuesFromStorage = jasmine.createSpy('setFormValuesFromStorage');
}

describe('IbBookingPassengerFormComponent', () => {

    let component: IbBookingPassengerFormComponent;
    let fixture: ComponentFixture<IbBookingPassengerFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingPassengerFormComponent],
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: AJSRootScope, useClass: RootScopeMock },
                { provide: AJSBookingModalService, useClass: BookingModalServiceMock },
                { provide: AJSBookingPassengerInfoService, useClass: BookingPassengerInfoServiceMock },
                { provide: AJSBookingUtilsService, useClass: BookingUtilServiceMock },
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock },
                { provide: IbCUserUtilsService, useClass: CommonsUserUtilsServiceMock },
                { provide: IbBookingRegisterFormDataService, useClass: IbBookingRegisterFormDataServiceMock },
                { provide: IbBookingPassengerInfoUtilsService, useClass: IbBookingPassengerInfoUtilsServiceMock },
                { provide: IbBookingPassengerFormUtilsService, useClass: IbBookingPassengerFormUtilsService},
                { provide: PassengerFormUtilsService, useClass: PassengerFormUtilsServiceMock },
                { provide: ManageStoredPassengerFormDataService, useClass: ManageStoredPassengerFormDataServiceMock },
                FormBuilder
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingPassengerFormComponent);
        component = fixture.componentInstance;
        component.passengersData = emptyAdultData;
        component.index = 0;
        component['alreadyInitialized'] = false;
        component.ngOnChanges({
            index: new SimpleChange(null, 0, true),
            passengersData: new SimpleChange(null, emptyAdultData, true)
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe('When component is created', () => {
        beforeEach(() => {
         
        });
        it('should create form if passengers is an adult', () => {
            expect(component).toBeTruthy();
            expect(component.passengerForm.get('name_0').value).toEqual('');
            expect(component.passengerForm.get('first_surname_0').value).toEqual('');
            expect(component.passengerForm.get('gender_0').value).toEqual('MALE');
            expect(component.passengerForm.get('check_ff_0').value).toBeFalsy();
            expect(component.passengerForm.get('check_obn_0').value).toBeFalsy();
            expect(component.passengerForm.get('check_fill_large_family').value).toBeFalsy();
            expect(component.passengerForm.get('check_fill_resident_number').value).toBeFalsy();
        });
        it('should create form with filled adult', fakeAsync(() => {
            component['alreadyInitialized'] = false;
            component.passengersData = fullAdultData as any;
            component.ngOnChanges({
                index: new SimpleChange(null, 0, true),
                passengersData: new SimpleChange(null, fullAdultData, true)
            });
            tick();
            expect(component.passengerForm.get('name_0').value).toEqual('test');
            expect(component.passengerForm.get('first_surname_0').value).toEqual('test');
            expect(component.passengerForm.get('gender_0').value).toEqual('MALE');
            expect(component.passengerForm.get('check_ff_0').value).toBeTruthy();
            expect(component.passengerForm.get('company_0').value).toEqual({airlineName:'Iberia', iataCompanyCode:'IB'});
            expect(component.passengerForm.get('number_card_0').value).toEqual(559234);
        }));
        it('should create form with child', fakeAsync(() => {
            component['alreadyInitialized'] = false;
            component.passengersData = fullChildData as any;
            component.ngOnChanges({
                index: new SimpleChange(null, 0, true),
                passengersData: new SimpleChange(null, fullChildData, true)
            });
            tick();
            expect(component.passengersData.securityInfo.passengerInfo[0].data.birthDate).toEqual(['26', '12', '2025']);
            expect(component.passengerForm.get('name_0').value).toEqual('test');
            expect(component.passengerForm.get('first_surname_0').value).toEqual('test');
            expect(component.passengerForm.get('gender_0').value).toEqual('MALE');
            expect(component.passengerForm.get('check_ff_0').value).toBeTruthy();
            expect(component.passengerForm.get('company_0').value).toEqual({airlineName:'Iberia', iataCompanyCode:'IB'});
            expect(component.passengerForm.get('number_card_0').value).toEqual(559234);
            expect(component.showMunicipalityCode).toBeTruthy();
            expect(component.showCommunityCode).toBeTruthy();
        }));
        it('should create form with infant', fakeAsync(() => {
            component['alreadyInitialized'] = false;
            component.passengersData = fullInfantData;
            component.passengersData.securityInfo.passengerInfo[component.index].isSelected = false;
            component.index = 0;
            component.ngOnChanges({
                index: new SimpleChange(null, 0, true),
                passengersData: new SimpleChange(null, fullInfantData, true)
            });
            tick();
            expect(component.passengersData.securityInfo.passengerInfo[1].data.birthDate).toEqual(['28', '11', '2027']);
            expect(component.passengerForm.get('name_0').value).toEqual('test');
            expect(component.passengerForm.get('first_surname_0').value).toEqual('test');
            expect(component.passengerForm.get('gender_0').value).toEqual('MALE');
            expect(component.passengerForm.get('check_ff_0').value).toBeTruthy();
            expect(component.passengerForm.get('company_0').value).toEqual({airlineName:'Iberia', iataCompanyCode:'IB'});
            expect(component.passengerForm.get('number_card_0').value).toEqual(559234);
            expect(component.passengerForm.get('communityCode_0').value).toEqual({code: '410917', description: 'Andalucía'});
            expect(component.passengerForm.get('largeFamilyNumber_0').value).toEqual({code: '', communityCodePattern: '', firstPattern: '', secondPattern: '', thirdPattern:'', fourthPattern:''});
            expect(component.passengerForm.get('largeFamilyType_0').value).toEqual('GENERAL');
            expect(component.passengerForm.get('municipalityCode_0').value).toEqual({code: '070197', description: 'Escorca'});
            // expect(component.passengerForm.get('personInCharge_0').value).toEqual({...fullAdultData.securityInfo.passengerInfo[0], displayName:'test test', isSelected: true})
        }));
    });

    describe('When localStoragePassengersData changes', () => {
        it('should update passengerform values', fakeAsync(() => {
            component['alreadyInitialized'] = false;
            component.passengersData = fullInfantData;
            component.passengersData.securityInfo.passengerInfo[component.index].isSelected = false;
            component.ngOnChanges({
                localStoragePassengersData: new SimpleChange(false, true, true)
            });
            tick();
            expect(component['ManageStoredPassengerFormDataService'].setFormValuesFromStorage).toHaveBeenCalled();
        }));
    });

    describe('When fillResidentChecked is checked', () => {
        it('should update check and municipality code value', fakeAsync(() => {
            component['alreadyInitialized'] = false;
            component.passengersData = fullInfantData;
            component.passengersData.securityInfo.passengerInfo[component.index].isSelected = false;
            component.ngOnChanges({
                fillResidentChecked: new SimpleChange(false, {index:0, isChecked:true}, true)
            });
            tick();
            expect(component.passengerForm.get('check_fill_resident_number').value).toBeTrue();
            expect(component.passengerForm.get('municipalityCode_0').value).toEqual({ code: '070197', description: 'Escorca'});
        }));
    });
    describe('When fillLargeFamilyChecked is checked', () => {
        it('should update check, communityCode and largeFamilyNumber code value', fakeAsync(() => {
            component['alreadyInitialized'] = false;
            component.passengersData = fullInfantData;
            component.passengersData.securityInfo.passengerInfo[component.index].isSelected = false;
            component.ngOnChanges({
                fillLargeFamilyChecked: new SimpleChange(false, {index:0, isChecked:true}, true)
            });
            tick();
            expect(component.passengerForm.get('check_fill_large_family').value).toBeTrue();
            expect(component.passengerForm.get('communityCode_0').value).toEqual({ code: '410917', description: 'Andalucía'});
            expect(component.passengerForm.get('largeFamilyNumber_0').get('code').value).toEqual('(AAAA)999-9999-99999999-9');
            expect(component.passengerForm.get('largeFamilyNumber_0').get('communityCodePattern').value).toEqual('(AAAA)999-9999-99999999-9');
        }));
    });

    function testRegisterField ({moduleId, inputId, inputValue, methodToCall, expectedValue, serviceMethod}) {
        let registerService: IbBookingRegisterFormDataServiceMock;
        registerService = TestBed.inject(IbBookingRegisterFormDataService) as any;
        const moduleDiv = document.createElement('div');
        moduleDiv.id = moduleId;
        document.body.appendChild(moduleDiv);

        (document.getElementById(inputId)as HTMLInputElement).value  = inputValue;

        const setSpy = spyOn(registerService, serviceMethod);

        methodToCall();
        expect(setSpy).toHaveBeenCalledWith(expectedValue);

        document.body.removeChild(moduleDiv);
        // document.body.removeChild(input);
    }

    describe('When register fields are propagated to the register data service', () => {
        const registerFieldCases = [
            {
                description: 'should upload register name form value',
                moduleId: 'register_module_name',
                inputId: 'name_0',
                inputValue: 'John',
                expectedValue: 'John',
                serviceMethod: 'setName',
                method: 'setRegisterName'
            },
            {
                description: 'should clean edge chars before pushing name to register data service',
                moduleId: 'register_module_name',
                inputId: 'name_0',
                inputValue: '-Álvaro ',
                expectedValue: 'Álvaro',
                serviceMethod: 'setName',
                method: 'setRegisterName'
            },
            {
                description: 'should preserve internal hyphens and apostrophes in name',
                moduleId: 'register_module_name',
                inputId: 'name_0',
                inputValue: 'Anne-Marie',
                expectedValue: 'Anne-Marie',
                serviceMethod: 'setName',
                method: 'setRegisterName'
            },
            {
                description: 'should upload register surname form value',
                moduleId: 'register_module_surname',
                inputId: 'first_surname_0',
                inputValue: 'Doe',
                expectedValue: 'Doe',
                serviceMethod: 'setLastName',
                method: 'setRegisterSurame'
            },
            {
                description: 'should clean edge chars before pushing surname to register data service',
                moduleId: 'register_module_surname',
                inputId: 'first_surname_0',
                inputValue: " O'Brien-",
                expectedValue: "O'Brien",
                serviceMethod: 'setLastName',
                method: 'setRegisterSurame'
            }
        ];

        registerFieldCases.forEach(testCase => {
            it(testCase.description, () => {
                testRegisterField({
                    moduleId: testCase.moduleId,
                    inputId: testCase.inputId,
                    inputValue: testCase.inputValue,
                    methodToCall: component[testCase.method].bind(component),
                    expectedValue: testCase.expectedValue,
                    serviceMethod: testCase.serviceMethod
                });
            });
        });
    });

    describe('When onNameBlur is called', () => {
        it('should clean edge chars from the control value', () => {
            component.passengerForm.get('name_0').setValue('-Álvaro');
            component.onNameBlur('name_0');
            expect(component.passengerForm.get('name_0').value).toBe('Álvaro');
        });

        it('should not modify the control if value is already clean', () => {
            component.passengerForm.get('name_0').setValue('Álvaro');
            const control = component.passengerForm.get('name_0');
            const setValueSpy = spyOn(control!, 'setValue').and.callThrough();

            component.onNameBlur('name_0');

            expect(setValueSpy).not.toHaveBeenCalled();
        });

        it('should clean edge chars from surnames as well', () => {
            component.passengerForm.get('first_surname_0').setValue("O'Brien-");
            component.onNameBlur('first_surname_0');
            expect(component.passengerForm.get('first_surname_0').value).toBe("O'Brien");
        });

        it('should do nothing if control does not exist', () => {
            expect(() => component.onNameBlur('nonexistent_field')).not.toThrow();
        });
    });

    describe('When updateSpecialNeeds is called', () => {
        beforeEach(() => {
         
        });
        it('should update special needs values', () => {
            const specialNeeds = {
                isValid: true,
                values: {
                    check_enable_0: true,
                    check_vision_0: false,
                    check_hearing_0: true,
                    check_intellDisability_0: false,
                    check_guide_dog_0: true,
                    check_chair_0: false,
                    specialWheelchairValue: 'manual'
                }
            };
            component.passengersData = {
                securityInfo: {
                    passengerInfo: [
                        { specialNeeds: {
                            availableTypes: [],
                            specialVision: false,
                            specialHearing: false,
                            specialGuideDog: false,
                            specialIntellDisability: false,
                            specialWheelchair: false,
                            specialWheelchairValue: '',
                            specialWheelchairInfo: []
                        }}
                    ]
                }
            }as any;
            component.updateSpecialNeeds(specialNeeds, 0);
            const needs = component.passengersData.securityInfo.passengerInfo[0].specialNeeds;
            expect(component.isSpecialNeedsFormValid).toBe(true);
            expect(needs.isEnable).toBe(true);
            expect(needs.specialVision).toBe(false);
            expect(needs.specialHearing).toBe(true);
            expect(needs.specialIntellDisability).toBe(false);
            expect(needs.specialGuideDog).toBe(true);
            expect(needs.specialWheelchair).toBe(false);
            expect(needs.specialWheelchairValue).toBe('manual');
        });
    });

    describe('When checkDocumentUnicityList is called', () => {
        beforeEach(() => {
            component['alreadyInitialized'] = false;
            component.passengersData = {
                ...fullInfantData,
                securityInfo:{
                    ...fullInfantData.securityInfo,
                    passengerInfo:[
                        {
                            ...fullInfantData.securityInfo.passengerInfo[0],
                            mandatoryDocs: [
                                { code: 'DNI', number: '123', description: 'DNI', showFields: {} }, 
                                { code: 'PAS', number: '999', description: 'Pasaporte', showFields: {} }
                            ]
                        },
                        {
                            ...fullInfantData.securityInfo.passengerInfo[1],
                            mandatoryDocs: [{ code: 'DNI', number: '456', description: 'DNI', showFields: {} }]
                        }
                    ]
                }
            };
            component.passengerForm.get('mandatoryDoc_0').get('number').setValue('111');
            component.passengerForm.get('mandatoryDoc_0').get('code').setValue('DNI');
            component.passengerForm.get('mandatoryDoc_0').get('number').setValue('222');
            component.passengerForm.get('mandatoryDoc_0').get('code').setValue('DNI');
            // component.passengerForm.get('mandatoryDoc_0').setValue({code: ['DNI'], number: ['222']})
            component.passengerForm.get('mandatoryDoc_0').get('number').setErrors({ docDuplicity: true, other: true });
            spyOn(component, 'checkDocumentUnicity').and.callThrough();
            spyOn(component, 'checkAndCleanServiceError').and.callThrough();
        });
        it('should update the number property of the correct mandatoryDocs entry', () => {
            component.passengerForm.get('mandatoryDoc_0').get('number').setValue('NEWNUM');
            component.passengerForm.get('mandatoryDoc_0').get('code').setValue('DNI');
            component.checkDocumentUnicityList(0);
            expect(component.passengersData.securityInfo.passengerInfo[0].mandatoryDocs[0].number).toBe('NEWNUM');
        });

        it('should remove docDuplicity error from control if present', () => {
            component.checkDocumentUnicityList();
            const errors = component.passengerForm.get('mandatoryDoc_0').get('number').errors;
            expect(errors.docDuplicity).toBeUndefined();
            expect(errors.other).toBeTrue();
        });

        it('should call checkAndCleanServiceError with correct arguments', () => {
            component.checkDocumentUnicityList(1);
            expect(component.checkAndCleanServiceError).toHaveBeenCalledWith('mandatoryDoc_', 1, 'idInfoError', 'number');
        });

        it('should not throw if idPassenger is undefined or out of bounds', () => {
            expect(() => component.checkDocumentUnicityList(undefined)).not.toThrow();
            expect(() => component.checkDocumentUnicityList(99)).not.toThrow();
        });

        it('should handle the case where no passengers exist', () => {
            component.passengersData.securityInfo.passengerInfo = [];
            expect(() => component.checkDocumentUnicityList()).not.toThrow();
        });
    });

    describe('When updateCardValidators is called', () => {
        beforeEach(() => {
            component.passengerForm.get('number_card_0').setValue('');
            component.passengerForm.get('company_0').setValue('');
        });
        it('should set IB validators when company is IB', () => {
            component.passengerForm.get('company_0').setValue({ iataCompanyCode: 'IB' });
            const control = component.passengerForm.get('number_card_0');
            component.updateCardValidators(0);

            control.setValue('79927398713');
            expect(control.errors).toBeNull();

            control.setValue('abcdefghij');
            expect(control.errors?.pattern).toBeDefined();
        });

        it('should set IB validators when company is IB but number is undefined', () => {
            component.passengerForm.get('company_0').setValue({ iataCompanyCode: 'IB' });
            const control = component.passengerForm.get('number_card_0');
            component.updateCardValidators(0);

            control.setValue(undefined);
            expect(control.errors.required).toBeTrue();

        });

        it('should set IB validators when company is IB but number is " "', () => {
            component.passengerForm.get('company_0').setValue({ iataCompanyCode: 'IB' });
            const control = component.passengerForm.get('number_card_0');
            component.updateCardValidators(0);

            control.setValue('');
            expect(control.errors.required).toBeTrue();

        });

        it('should set AA validators when company is AA', () => {
            component.passengerForm.get('company_0').setValue({ iataCompanyCode: 'AA' });
            const control = component.passengerForm.get('number_card_0');
            component.updateCardValidators(0);

            control.setValue('AA12345678');
            expect(control.errors).toBeNull();

        });

        it('should set generic validators when company is not IB or AA', () => {
            component.passengerForm.get('company_0').setValue({ iataCompanyCode: 'LH' });
            const control = component.passengerForm.get('number_card_0');
            component.updateCardValidators(0);

            control.setValue('123456789012345678');
            expect(control.errors).toBeNull();

            control.setValue('1234567890123456789');
            expect(control.errors?.maxlength).toBeDefined();
        });
    });


    describe('When updateLargeFamilyCodePattern is called', () => {
        beforeEach(() => {
            component.passengersData = {
                ...fullInfantData,
                securityInfo:{
                    ...fullInfantData.securityInfo,
                    passengerInfo:[
                        {
                            ...fullInfantData.securityInfo.passengerInfo[0],
                            requiredFields:{
                                ...fullInfantData.securityInfo.passengerInfo[0].requiredFields,
                                COMMUNITY_CODE:{
                                    values:[
                                        {...fullInfantData.securityInfo.passengerInfo[0].requiredFields.COMMUNITY_CODE.values[0]},
                                        {
                                            code: '070407',
                                            description: 'Islas Baleares'
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            };
        });
        it('should set first pattern and second pattern because is Balearic Islands code', () => {
            component.passengerForm.get('communityCode_0').setValue({code: '070407', description: 'Islas Baleares'});
            component.updateLargeFamilyCodePattern(0);
            expect(component.passengerForm.get('largeFamilyNumber_0').get('firstPattern').value).toEqual('Mallorca: 07-999999-9999');
            expect(component.passengerForm.get('largeFamilyNumber_0').get('secondPattern').value).toEqual('Menorca: 07-02-9999-99');
            expect(component.passengerForm.get('largeFamilyNumber_0').get('thirdPattern').value).toEqual('Ibiza: 07-03-9999-99');
            expect(component.passengerForm.get('largeFamilyNumber_0').get('fourthPattern').value).toEqual('Formentera: 07-04-9999-99');
        });
        it('should set communityCodePattern', () => {
            component.passengerForm.get('communityCode_0').setValue({code: '410917', description: 'Andalucía'});
            component.updateLargeFamilyCodePattern(0);
            expect(component.passengerForm.get('largeFamilyNumber_0').get('communityCodePattern').value).toEqual('(AAAA)999-9999-99999999-9');
        });
    });

    describe('When isLargeFamilyCodeAvailable is called', () => {
        beforeEach(()=>{
            component.passengersData = {
                ...fullInfantData,
                securityInfo:{
                    ...fullInfantData.securityInfo,
                    passengerInfo:[
                        {
                            ...fullInfantData.securityInfo.passengerInfo[0],
                            serviceErrors:[
                                {
                                    typeError: 'largeFamilyError',
                                    errorMessage: '',
                                    type: ''
                                }
                            ]
                        }
                    ]
                }
            };
        });
        it('should clean largeFamilyCommunityError control error', () => {
            component.passengerForm.get('largeFamilyNumber_0').get('code').setErrors({ largeFamilyCommunityError: true });
            component.isLargeFamilyCodeAvailable(0);
            expect(component.passengerForm.get('largeFamilyNumber_0').get('code').errors).toEqual(null);
            expect(component.passengersData.securityInfo.passengerInfo[0].serviceErrors.length).toEqual(0);
         
        });
    });
    describe('When onLargeFamilyTypeSelect is called', () => {
        it('should set large family type', () => {
            component.passengerForm.get('largeFamilyType_0').setValue('');
            component.onLargeFamilyTypeSelect('GENERAL', 0);
            expect(component.passengerForm.get('largeFamilyType_0').value).toEqual('GENERAL');
        });
    });
    describe('When onHide is called', () => {
        it('should set large family type', () => {
            const removeClassSpy = jasmine.createSpy('removeClass');
            component['renderer'] = { removeClass: removeClassSpy } as any;
            component.dropdownIcon = {} as any; // puede ser cualquier objeto simulado

            component.onHide();

            expect(removeClassSpy).toHaveBeenCalledWith(component.dropdownIcon, 'rotate');
        });
    });


    describe('When styleSelectLabelOrError is called', () => {
        const buildPersonInChargeForm = (value: string, withRequired: boolean = false, markTouched: boolean = false) => {
            const control = withRequired
                ? new FormControl(value, Validators.required)
                : new FormControl(value);
            const form = new FormBuilder().group({ personInCharge_0: control });
            if (markTouched) form.get('personInCharge_0').markAsTouched();
            return form;
        };

        it('should return false if form is not a FormGroup', () => {
            const result = component.styleSelectLabelOrError({}, 0, true);
            expect(result).toBeFalse();
        });

        it('should return false if control does not exist', () => {
            component.passengerForm = new FormBuilder().group({});
            const result = component.styleSelectLabelOrError(component.passengerForm, 0, true);
            expect(result).toBeFalse();
        });

        const errorCases = [
            { description: 'should return true if isError is true, control is invalid and touched', value: '', expected: true },
            { description: 'should return false if isError is true, but control is valid', value: 'value', expected: false }
        ];

        errorCases.forEach(testCase => {
            it(testCase.description, () => {
                const form = buildPersonInChargeForm(testCase.value, true, true);
                const result = component.styleSelectLabelOrError(form, 0, true);
                expect(result).toBe(testCase.expected);
            });
        });

        const valueCases = [
            { description: 'should return true if isError is false and value is not null or empty', value: 'value', expected: true },
            { description: 'should return false if isError is false and value is null or empty', value: '', expected: false }
        ];

        valueCases.forEach(testCase => {
            it(testCase.description, () => {
                const form = buildPersonInChargeForm(testCase.value);
                const result = component.styleSelectLabelOrError(form, 0, false);
                expect(result).toBe(testCase.expected);
            });
        });
    });

    describe('When onMandatoryDocSelect is called', () => {
        it('should set mandatoryDoc selected', () => {
            component.passengerForm.get(`mandatoryDoc_0`).get('code').setValue('');
            component.passengerForm.get(`mandatoryDoc_0`).get('description').setValue('');
            component.onMandatoryDocSelect({code:'DN', description:'DNI', number:8932, showFields: {}}, 0);
            expect(component.passengerForm.get(`mandatoryDoc_0`).get('code').value).toEqual('DN');
        });
    });

    describe('When getMaxLengthMandatoryDocNumber is called', () => {
        it('should return DNI length', () => {
            let returnValue = component.getMaxLengthMandatoryDocNumber('DN');
            expect(returnValue).toEqual(9);
        });
        it('should return RUC length', () => {
            let returnValue = component.getMaxLengthMandatoryDocNumber('RUC');
            expect(returnValue).toEqual(11);
        });
        it('should return default length', () => {
            let returnValue = component.getMaxLengthMandatoryDocNumber('default');
            expect(returnValue).toEqual(component.MAX_LENGTH_MANDATORY_DOC);
        });
    });

    
    describe('When onDropdownShow is called', () => {
        it('should add "rotate" class to dropdownButton and set highlightOption if suggestions exist', () => {
            const addClassSpy = jasmine.createSpy('addClass');
            component['renderer'] = { addClass: addClassSpy } as any;

            const dropdownButton = {};
            const autocomplete = {
                el: {
                    nativeElement: {
                        querySelector: jasmine.createSpy('querySelector').and.returnValue(dropdownButton)
                    }
                },
                suggestions: [{ name: 'A' }, { name: 'B' }],
                highlightOption: null
            };

            component.onDropdownShow(autocomplete as any);

            expect(autocomplete.el.nativeElement.querySelector).toHaveBeenCalledWith('.p-autocomplete-dropdown');
            expect(addClassSpy).toHaveBeenCalledWith(dropdownButton, 'rotate');
            expect(autocomplete.highlightOption).toBe(autocomplete.suggestions[0]);
        });

        it('should not set highlightOption if suggestions is empty or undefined', () => {
            const addClassSpy = jasmine.createSpy('addClass');
            component['renderer'] = { addClass: addClassSpy } as any;

            const autocompleteEmpty = {
                el: { nativeElement: { querySelector: jasmine.createSpy('querySelector').and.returnValue({}) } },
                suggestions: [],
                highlightOption: null
            };
            component.onDropdownShow(autocompleteEmpty as any);
            expect(autocompleteEmpty.highlightOption).toBeNull();

            const autocompleteUndefined = {
                el: { nativeElement: { querySelector: jasmine.createSpy('querySelector').and.returnValue({}) } },
                suggestions: undefined,
                highlightOption: null
            };
            component.onDropdownShow(autocompleteUndefined as any);
            expect(autocompleteUndefined.highlightOption).toBeNull();
        });
    });
    describe('When onDropdownHide is called', () => {
        it('should remove rotate class to dropdownButton', () => {
            const removeClassSpy = jasmine.createSpy('removeClass');
            component['renderer'] = { removeClass: removeClassSpy } as any;

            const dropdownButton = {};
            const autocomplete = {
                el: {
                    nativeElement: {
                        querySelector: jasmine.createSpy('querySelector').and.returnValue(dropdownButton)
                    }
                }
            };

            component.onDropdownHide(autocomplete as any);

            expect(autocomplete.el.nativeElement.querySelector).toHaveBeenCalledWith('.p-autocomplete-dropdown');
            expect(removeClassSpy).toHaveBeenCalledWith(dropdownButton, 'rotate');
        });
    });

    describe('When checkResidentChanges is called', () => {
        it('should emit if resident check is checked', () => {
            spyOn(component.fillResident, 'emit');
            component.passengerForm.get('check_fill_resident_number').setValue(true);
            component.checkResidentChanges();
            expect(component.fillResident.emit).toHaveBeenCalledWith({isChecked:true, index:component.index});
        });
    });
    describe('When checkLargeFamilyChanges is called', () => {
        it('should emit if resident check is checked', () => {
            spyOn(component.fillLargeFamily, 'emit');
            component.passengerForm.get('check_fill_large_family').setValue(true);
            component.checkLargeFamilyChanges();
            expect(component.fillLargeFamily.emit).toHaveBeenCalledWith({isChecked:true, index:component.index});
        });
    });

    describe('When closeUploadLargeFamInfoBanner is called', () => {
        it('should close upload large family info banner', () => {
            component.closeUploadLargeFamInfoBanner();
            expect(component.showUploadedInfoLargeFam).toBeFalsy();
        });
    });
    describe('When closeUploadResidentInfoBanner is called', () => {
        it('should close upload large family info banner', () => {
            component.closeUploadResidentInfoBanner();
            expect(component.showUploadedInfoResident).toBeFalsy();
        });
    });
    describe('When setSurnames is called', () => {
        it('should concat surnames', () => {
            const bookingUtilsService = TestBed.inject(AJSBookingUtilsService) as any;
            bookingUtilsService.trunkateMaxLength = jasmine.createSpy('trunkateMaxLength').and.returnValue({surname:'try test'});
            const passenger = {surname2:'test', userInfo: {lastName:'try', secondLastName:'test'}};
            component['setSurnames'](false, passenger, 0);
            expect(component.passengerForm.get('first_surname_0').value).toEqual('try test');
        });
        it('should no concat surnames', () => {
            const passenger = {surname1:'test', userInfo: {lastName:'test'}};
            component['setSurnames'](false, passenger, 0);
            expect(component.passengerForm.get('first_surname_0').value).toEqual('test');
        });
    });
    xdescribe('When changeState is called', () => {
        it('should no change beneficiarie state', () => {
            component.passengersData = emptyAdultData;
            const passenger = {index:0};
            const frequentlyPassengers = {beneficiaries:[{index:0, isSelected:false, type:'DEFAULT'}]};
            component.changeState(passenger, frequentlyPassengers);
            expect(component.showFrequentlyPassengers).toBeFalsy();
        });
    });
    describe('When checkCanBeInCharge is called', () => {
        beforeEach(()=>{
            component.infoTypesPassenger.infants = [{}, {}];  
            component.passengersData = fullInfantData;
        });
        it('should preselect person in charge', () => {
            component.checkCanBeInCharge('0', {id:'ADULT_02'});
            expect(component.passengersData.securityInfo.passengerInfo[1].isSelected).toBeTrue();
        });
        it('should reset person in charge', () => {
            spyOn(component.resetPersonInCharge, 'emit');
            component.passengersData.securityInfo.passengerInfo[0].data.personInCharge = {
                id:'ADULT_01'
            } as any;
            component.checkCanBeInCharge('0', {id:'ADULT_01'});
            expect(component.resetPersonInCharge.emit).toHaveBeenCalledWith(0);
        });
    });
    describe('When checkITravel is called', () => {
        it('should set iTravel check to true', () => {
            component.passengersData = fullInfantData;
            component.checkITravel();
            expect(component.passengerForm.get('iTravelCheck').value).toBeTruthy();
        });
    });
    describe('When unCheckITravel is called', () => {
        it('should set iTravel check to false', () => {
            component.unCheckITravel();
            expect(component.passengerForm.get('iTravelCheck').value).toBeFalsy();
        });
    });
    describe('When setOBValues is called', () => {
        it('should change check and company value', () => {
            component['setOBValues']({program:'IB', frequentFlyer: 'test'});
            expect(component.passengerForm.get('check_ff_0').value).toBeTrue();
            expect(component.passengerForm.get('company_0').value).toEqual({iataCompanyCode: 'IB', airlineName:'Iberia'});
            expect(component.passengerForm.get('number_card_0').value).toEqual('test');
        });
    });
    describe('When checkFfFormValues is called', () => {
        it('should update number card validators', () => {
            component.passengerForm.get('check_ff_0').setValue(true);
            component.passengerForm.get('number_card_0').setValue('');
            component.checkFfFormValues();
            expect(component.passengerForm.get('number_card_0').errors.required).toBeTruthy();
        });
    });
    describe('When filterMandatoryDocs is called', () => {
        it('should filter mandatory docs according to user typing', () => {
            component.passengersData = fullInfantData;
            component.filterMandatoryDocs({query:'Menor'}, 0);
            expect(component.filteredMandatoryDocs[0]).toEqual([{
                code: 'MR',
                description: 'Menor de edad sin DNI',
                showFields: {
                    BIRTH_DATE: {}
                },
                number: ''
            }]);
        });
    });

    describe('When filterOptionalDocuments is called', () => {
        it('should filter optional documents according to user typing', () => {
            component.optionalDocsArray = [{
                code: 'NIT',
                description: 'NIT',
                showFields: {
                    NUM_DOC: {}
                }
            }];
            component.passengerForm.get(`check_optional_docs_${component.index}`).setValue(true);
            component.filterOptionalDocuments({query:'NIT'}, 0);
            expect(component.filteredOptionalDocuments[0]).toEqual([{code: 'NIT', description: 'NIT', showFields: { NUM_DOC: {}}}]);
            expect(component.showOptionalDocsSection()).toBeTrue();
        });
    });

    describe('When initializeOptionalDocsArray is called', () => {
        it('should set optionalDocsArray as empty array when optionalDocs is undefined', () => {
            component.passengersData = {
                securityInfo: {
                    passengerInfo: [{
                        data: {
                            name: '',
                            surname: '',
                            lastSurname: '',
                            gender: '',
                            birthDate: [],
                            mandatoryDoc: undefined,
                            optionalDoc: {
                                code: '',
                                description: '',
                                showFields: {}
                            },
                            residentDiscountInfo: {
                                municipalityCode: ''
                            },
                            largeFamilyDiscountInfo: {
                                largeFamilyCertificateNumber: '',
                                communityCode:{} as any,
                                communityCodePattern: ''
                            },
                            largeFamilyType: '',
                            freqFlyerInfo: undefined,
                            freqFlyerSelected: false,
                            OBNumberSelected: false,
                            OBNumberInfo: {
                                businessCodeType: {
                                    name: '',
                                    code: ''
                                },
                                number: ''
                            },
                            personInCharge: undefined
                        }
                    
                    }]
                }
            }as any;
            component['initializeOptionalDocsArray']();
            expect(component.optionalDocsArray).toEqual([]);
        });

        it('should set optionalDocsArray with the array values when optionalDocs is an array', () => {
            const mockOptionalDocsArray = [{
                code: 'PP',
                description: 'Pasaporte'
            }];

            component.passengersData = {
                securityInfo: {
                    passengerInfo: [{
                        optionalDocs: mockOptionalDocsArray
                    }]
                }
            } as any;
            component['initializeOptionalDocsArray']();
            expect(component.optionalDocsArray).toEqual(mockOptionalDocsArray);
        });
    });
    describe('When setupOptionalDocsCheckboxListener is called', () => {
        it('should reset the optional documents form with the new structure when checkbox is unchecked', () => {
            component['setupOptionalDocsCheckboxListener']();
            component.passengerForm.get(`check_optional_docs_${component.index}`).setValue(false);

            expect(component.passengerForm.get(`optionalDocuments_${component.index}`).value).toEqual({
                selectedDoc: null,
                number: ''
            });
        });
    });
    function setupMandatoryDocBlurTestData () {
        component.passengersData = {
            ...fullInfantData,
            securityInfo: {
                ...fullInfantData.securityInfo,
                passengerInfo: [{
                    ...fullInfantData.securityInfo.passengerInfo[0],
                    mandatoryDocs: [
                        { code: 'NIE', description: 'NIE', number: '123', showFields: {} }
                    ]
                }]
            }
        };
    }

    describe('When getDniNumberValidators is called', () => {
        let utilsService: IbBookingPassengerFormUtilsService;

        beforeEach(() => {
            utilsService = TestBed.inject(IbBookingPassengerFormUtilsService);
        });

        it('should return an empty array when code is NOT DNI/NIF', () => {
            const spy = spyOn(utilsService, 'isDniCode').and.returnValue(false);

            const result = component.getDniNumberValidators('MR');

            expect(spy).toHaveBeenCalledWith('MR');
            expect(Array.isArray(result)).toBeTrue();
            expect(result.length).toBe(0);
        });

        it('should return a single ValidatorFn when code IS DNI/NIF', () => {
            const spy = spyOn(utilsService, 'isDniCode').and.returnValue(true);

            const result = component.getDniNumberValidators('DN');

            expect(spy).toHaveBeenCalledWith('DN');
            expect(Array.isArray(result)).toBeTrue();
            expect(result.length).toBe(1);
            expect(typeof result[0]).toBe('function');
        });

        it('returned ValidatorFn should validate modulo-23: valid case returns null', () => {
            spyOn(utilsService, 'isDniCode').and.returnValue(true);
            const [validator] = component.getDniNumberValidators('DN') as [ValidatorFn];

            const ctrlValid = { value: '12345678Z' } as any;
            expect(validator(ctrlValid)).toBeNull();
        });

        it('returned ValidatorFn should validate modulo-23: invalid letter returns error', () => {
            spyOn(utilsService, 'isDniCode').and.returnValue(true);
            const [validator] = component.getDniNumberValidators('DN') as [ValidatorFn];

            const ctrlInvalid = { value: '12345678A' } as any;
            expect(validator(ctrlInvalid)).toEqual({ invalidDocumentError: true });
        });

        it('returned ValidatorFn should not act on bad format (delegated to pattern)', () => {
            spyOn(utilsService, 'isDniCode').and.returnValue(true);
            const [validator] = component.getDniNumberValidators('DN') as [ValidatorFn];

            const ctrlBadFormat = { value: '1234567A' } as any; 
            expect(validator(ctrlBadFormat)).toBeNull();
        });
    });

    describe('When checkMandatoryDoc is called', () => {
        beforeEach(() => {
            setupMandatoryDocBlurTestData();
        });

        it('should not set validators on number field when document code is MR', () => {
            component.passengerForm.get(`mandatoryDoc_${component.index}`).get('code').setValue('MR');
            component.checkMandatoryDoc();
            
            const numberControl = component.passengerForm.get(`mandatoryDoc_${component.index}`).get('number');
            expect(numberControl.hasValidator(Validators.required)).toBeFalse();
        });

        it('should return true when passenger has mandatory docs', () => {
            const result = component.checkMandatoryDoc();
            expect(result).toBeTrue();
        });
    });

    
    describe('When onOptionalDocSelect is called', () => {
        let utilsService: IbBookingPassengerFormUtilsService;
        const testIndex = 0;

        beforeEach(() => {
            utilsService = TestBed.inject(IbBookingPassengerFormUtilsService);
            spyOn(utilsService, 'getMandatoryDocCleaner').and.callThrough();
        });

        const testCases = [
            { code: 'NIT' },
            { code: 'CUI' },
            { code: 'PP' }
        ];

        testCases.forEach(testCase => {

            it('should set the correct cleaner for document code', () => {
                const mockEvent = { code: testCase.code };

                component.onOptionalDocSelect(mockEvent, testIndex);

                expect(utilsService.getMandatoryDocCleaner).toHaveBeenCalledWith(testCase.code);
                expect(component.optionalDocCleaner[testIndex]).toBe(BookingAppConstants.bookingPatterns.DOCS_CLEANER);
            });

        });
    });
    describe('When onMandatoryDocBlur is called', () => {
        beforeEach(() => {
            setupMandatoryDocBlurTestData();
        });

        it('should update form when input matches a valid document', () => {
            const autocompleteMock = {
                inputEL: { nativeElement: { value: 'NIE' } }
            } as AutoComplete;
            
            component.onMandatoryDocBlur(0, autocompleteMock);

            const mandatoryDocGroup = component.passengerForm.get('mandatoryDoc_0');
            expect(mandatoryDocGroup.value).toEqual({
                code: 'NIE',
                description: 'NIE',
                number: '123',
                showFields: {}
            });
        });

        it('should keep last valid document when input does not match', () => {
            const lastValidDoc = { 
                code: 'NIE', 
                description: 'NIE', 
                number: '123', 
                showFields: {} 
            };
            
            const mandatoryDocGroup = component.passengerForm.get('mandatoryDoc_0');
            mandatoryDocGroup.patchValue(lastValidDoc);
            component.lastSelectedMandatoryDoc = lastValidDoc;

            const autocompleteMock = {
                inputEL: { nativeElement: { value: 'NI' } }
            } as AutoComplete;
            
            component.onMandatoryDocBlur(0, autocompleteMock);

            expect(mandatoryDocGroup.value).toEqual(lastValidDoc);
        }); 

        it('should reset form to empty values when no previous valid document exists', () => {
            component.lastSelectedMandatoryDoc = null;
            const mandatoryDocGroup = component.passengerForm.get('mandatoryDoc_0');
            
            const autocompleteMock = {
                inputEL: { nativeElement: { value: 'INVALID' } }
            } as AutoComplete;
            
            component.onMandatoryDocBlur(0, autocompleteMock);

            expect(mandatoryDocGroup.value).toEqual({
                code: '',
                description: '',
                number: '',
                showFields: {}
            });
        });
    });
    
    describe('When onMandatoryDocNumberBlur is called', () => {
        beforeEach(() => {
            setupMandatoryDocBlurTestData();
        });

        it('should mark number control as touched and revalidate with onlySelf:true', () => {
            const numberCtrl = component.passengerForm.get('mandatoryDoc_0')!.get('number')!;
            const spyTouched = spyOn(numberCtrl, 'markAsTouched').and.callThrough();
            const spyRevalidate = spyOn(numberCtrl, 'updateValueAndValidity').and.callThrough();

            expect(numberCtrl.touched).toBeFalse();

            component.onMandatoryDocNumberBlur(0);

            expect(spyTouched).toHaveBeenCalledWith({ onlySelf: true });
            expect(spyRevalidate).toHaveBeenCalledWith({ onlySelf: true });
            expect(numberCtrl.touched).toBeTrue();
        });

        it('should not throw when index is out of bounds', () => {
            expect(() => component.onMandatoryDocNumberBlur(99)).not.toThrow();
        });
    });

});