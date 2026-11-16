import { Component, Input } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

//COMPONENT Created v0.25.3: https://www.figma.com/design/NCSwxMHTbORklADAboQ6tl/Legacy-Base-Components--v0.25.3-?node-id=15498-1935&m=dev
@Component({
  selector: 'ib-form-checkbox',
  templateUrl: './ib-form-checkbox.component.html',
  styleUrls: ['./ib-form-checkbox.component.scss']
})
export class ibFormCheckboxComponent extends FieldType<FieldTypeConfig> {
    @Input() checked?: boolean = false;
    @Input() disabled?: boolean = false;
    @Input() required?: boolean = false;
    @Input() idCustom?: string;
    @Input() labelCustom?: string;
    @Input() titleCustom?: string;
    @Input() valueCustom?: boolean;

    // Permite usar el componente fuera de Formly
    @Input() externalControl?: any;

    get control() {
      return this.field?.formControl || this.externalControl;
    }

    onChange(event: any) {
      if (this.control) {
        this.control.setValue(event.target.checked);
      }
    }

    get props() {
      return {
        label: this.resolveLabel(),
        title: this.resolveTitle(),
        value: this.resolveValue(),
        disabled: this.resolveDisabled(),
        required: this.resolveRequired(),
      };
    }

    private resolveLabel(): string {
      return this.field?.props?.label || this.labelCustom || '';
    }

    private resolveTitle(): string {
      return this.field?.props?.title || this.titleCustom || '';
    }

    private resolveValue(): boolean {
      return this.field?.props?.value || this.valueCustom || false;
    }

    private resolveDisabled(): boolean {
      return this.field?.props?.disabled ?? this.disabled ?? false;
    }

    private resolveRequired(): boolean {
      return this.field?.props?.required ?? this.required ?? false;
    }

    get inputId() {
      // Prioriza idCustom cuando se usa fuera de Formly
      return this.idCustom || this.field?.id || '';
    }

    get getCustomErrorMessage(): string {
        if (this.formControl && this.formControl.errors) {
          const keys = Object.keys(this.formControl.errors);
          if (keys.length > 0) {
              const errorKey = keys[0];
              const errorConfig = this.field.validation?.messages?.[errorKey];
              
              if (typeof errorConfig === 'function') {
                return errorConfig(this.formControl.errors[errorKey], this.field) as string;
              }
              
              return (errorConfig || 'Campo inválido.') as string;
          }
        }
        return '';
    }
  }
