import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

//Component Created v0.25.3: https://www.figma.com/design/NCSwxMHTbORklADAboQ6tl/Legacy-Base-Components--v0.25.3-?node-id=16171-3346&t=noufh8kaDKhLXhLj-0

@Component({
  selector: 'ib-form-select',
  templateUrl: './ib-form-select.component.html',
  styleUrls: ['./ib-form-select.component.scss']
})
export class ibFormSelectComponent extends FieldType<FieldTypeConfig> implements OnInit {
  opcionesFiltradas$!: Observable<any[]>;
  valorGuardado: string = '';
  panelAbierto: boolean = false;
  private isSelecting: boolean = false;


   ngOnInit() {
    const opcionesBase = (this.props.options as any[]) || [];

    this.formControl.setValue(this.valorGuardado);

    this.opcionesFiltradas$ = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filtrarOpciones(value || '', opcionesBase))
    );
  }


  onFocus = () => {
    this.isSelecting = false;
    this.formControl.setValue('', { emitEvent: true });
  }

  onBlur = () => {
       setTimeout(() => {
          // Si el input quedó vacío o a medias, restauramos el último valor confirmado
          this.restaurarValorAnterior();
        }, 100); // Pequeño delay para permitir que el evento de selección ocurra primero
  };

  optionSelected = (newOptionSelected, inputElement: HTMLInputElement) => {
      this.isSelecting = true;
      this.valorGuardado = newOptionSelected;
      this.formControl.setValue(this.valorGuardado, { emitEvent: false });

      // eslint-disable-next-line no-console
      console.log('newOptionSelected: ', newOptionSelected);
      if (inputElement) {
        // eslint-disable-next-line no-console
        console.log('Entra en inputElement blur: ', inputElement);
        inputElement.blur();
      }
      
  }

  alAbrirPanel() {
    this.panelAbierto = true;
  }

  alCerrarPanel() {
    this.panelAbierto = false;
    if (!this.isSelecting) {
      this.restaurarValorAnterior();
    }
    this.isSelecting = false; 
  }


  private restaurarValorAnterior() {
    if (this.formControl.value !== this.valorGuardado) {
      this.formControl.setValue(this.valorGuardado);
    }
  }

   private _filtrarOpciones(value: string, opciones: any[]): any[] {
    const filterValue = (value || '').toLowerCase();
    
    if (!filterValue) return opciones;

    return opciones.filter(opt => 
      opt.label.toLowerCase().includes(filterValue)
    );
  }

  //  getCustomErrorMessage(): string {
  //   // if (this.formControl?.hasError('required')) {
  //   //   return this.to?.errors?.['required'] || 
  //   //          (this.to?.label ? `El campo "${this.to.label}" es obligatorio.` : 'Este campo es obligatorio.');
  //   // }

  //   if (this.formControl && this.formControl.errors) {
  //     const keys = Object.keys(this.formControl.errors);
  //     if (keys.length > 0) {
  //       const errorKey = keys[0];
  //       const errorConfig = this.field.validation?.messages?.[errorKey];
        
  //       if (typeof errorConfig === 'function') {
  //         return errorConfig(this.formControl.errors[errorKey], this.field) as string;
  //       }
        
  //       return (errorConfig || 'Campo inválido.') as string;
  //     }
  //   }
  //   return '';
  // }
}
                    