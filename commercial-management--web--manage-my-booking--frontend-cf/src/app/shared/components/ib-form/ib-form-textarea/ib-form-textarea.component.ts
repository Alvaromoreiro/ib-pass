import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

//COMPONENT created v0.25.3: https://www.figma.com/design/NCSwxMHTbORklADAboQ6tl/Legacy-Base-Components--v0.25.3-?node-id=15947-1396&m=dev

@Component({
  selector: 'ib-form-textarea',
  templateUrl: './ib-form-textarea.component.html',
  styleUrls: ['./ib-form-textarea.component.scss']
})
export class ibFormTextareaComponent extends FieldType<FieldTypeConfig> {
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