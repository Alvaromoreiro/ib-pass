import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpgradeModule } from '@angular/upgrade/static';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { IbMmBUmnrPassengersComponent } from './ib-Mmb-umnr-passengers.component';
import { IbMmBUmnrDataModalComponent } from './components/ib-MmB-umnr-data-modal/ib-MmB-umnr-data-modal.component';
import { IbMmBUmnrCustodiansModalComponent } from './components/ib-MmB-umnr-custodians-modal/ib-MmB-umnr-custodians-modal.component';
import { IbMmbUmnrUtilsService } from "./services/ib-Mmb-umnr-utils.service";
import { IbMmbUmnrComunicationService } from './services/ib-Mmb-umnr-comunication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select'; 
import { ibFormInputComponent } from '../../app/shared/components/ib-form/ib-form-input/ib-form-input.component';
import { ibFormSelectComponent } from '../../app/shared/components/ib-form/ib-form-select/ib-form-select.component';
import { ibFormTextareaComponent } from '../../app/shared/components/ib-form/ib-form-textarea/ib-form-textarea.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ibFormCheckboxComponent } from '../../app/shared/components/ib-form/ib-form-checkbox/ib-form-checkbox.component';

const downgradedComponents = [
    IbMmBUmnrPassengersComponent
];

@NgModule({
    imports: [
        CommonModule,
        UpgradeModule,
        BrowserModule,
        TranslateModule,
        ReactiveFormsModule,
        FormlySelectModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        ScrollingModule,
        FormlyModule.forChild({
            types: [
                //DIRECT TYPES
                { name: 'input', component: ibFormInputComponent },
                { name: 'select', component: ibFormSelectComponent },
                { name: 'checkbox', component:ibFormCheckboxComponent }, 

                //JSON-SCHEMA TYPES
                { name: 'string', component: ibFormInputComponent },
                { name: 'integer', component: ibFormInputComponent, defaultOptions: { templateOptions: { type: 'number' } } },
                { name: 'number', component: ibFormInputComponent, defaultOptions: { templateOptions: { type: 'number' } } },
                { name: 'enum', component: ibFormSelectComponent },
                { name: 'textarea', component: ibFormTextareaComponent },
                { name: 'boolean', component:ibFormCheckboxComponent } 
            ],
            // VALIDATION CONFIGURATION ERRORS
            validationMessages: [
                { name: 'required', message: 'Este campito es obligatorio.' },
                { name: 'minlength', message: (error, field) => `Debe tener al menos ${error.requiredLength} caracteres.` },
                { name: 'minimum', message: (error, field) => `El valor mínimo permitido es ${error.required} años.` }
            ],
            extras: { resetFieldOnHide: true }
        })
    ],
    declarations: [
        ...downgradedComponents,
        IbMmBUmnrDataModalComponent,
        IbMmBUmnrCustodiansModalComponent,
        ibFormInputComponent,
        ibFormSelectComponent,
        ibFormTextareaComponent,
        ibFormCheckboxComponent
    ],
    exports: [
        IbMmBUmnrDataModalComponent,
        IbMmBUmnrCustodiansModalComponent
    ],
    providers: [
        IbMmbUmnrUtilsService,
        IbMmbUmnrComunicationService
    ]
})

export class IbMmBUmnrPassengersModule { }
