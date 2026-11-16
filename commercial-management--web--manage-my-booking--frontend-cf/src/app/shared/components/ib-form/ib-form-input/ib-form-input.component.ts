import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

//COMPONENT Created v0.25.3: https://www.figma.com/design/NCSwxMHTbORklADAboQ6tl/Legacy-Base-Components--v0.25.3-?node-id=14460-40&p=f&m=dev
@Component({
  selector: 'ib-form-input',
  templateUrl: './ib-form-input.component.html',
  styleUrls: ['./ib-form-input.component.scss']
})
export class ibFormInputComponent extends FieldType<FieldTypeConfig> {
    @Input() label: string = 'Campo por defecto';
    @Input() placeholder: string = 'Escribe algo aquí...';
    @Input() type: string = 'text';
    @Input() disabled: boolean = false;
    
    // Recibe un FormControl estándar de Angular (si no se pasa, crea uno aislado)
    @Input() control: FormControl = new FormControl('');


    get getCustomErrorMessage(): string {
      // if (this.formControl?.hasError('required')) {
      //   return this.to?.errors?.['required'] || 
      //         (this.to?.label ? `El campo "${this.to.label}" es obligatorio.` : 'Este campo es obligatorio.');
      // }

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