import { Component, OnInit, Output, EventEmitter, OnDestroy  } from "@angular/core";
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbMmBUmnrCustodiansModalComponent } from '../ib-MmB-umnr-custodians-modal/ib-MmB-umnr-custodians-modal.component';
import { Subscription } from "rxjs";
import { IbMmbUmnrComunicationService } from "../../services/ib-Mmb-umnr-comunication.service";
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';

export interface UmnrPayload {
  id: number;
  name: string;
  type: string;
}

@Component({
  selector: 'ib-mmb-umnr-data-modal-modal',
  templateUrl: './ib-MmB-umnr-data-modal-view.component.html'
})


export class IbMmBUmnrDataModalComponent implements OnInit, OnDestroy  {
    @Output() saveDataUmnr = new EventEmitter<UmnrPayload>();
    private dataUmnrSubscription?: Subscription;
    isDataUmnrCompleted:boolean = false;
    dataCustodiansUmnr = {};
    fields: { [passengerId: string]: FormlyFieldConfig[] } = {};
    loadingForm = false;
    model: any = {};
    passengers:any = [];
    options: FormlyFormOptions = {
        formState: {
            mainModel: this.model // Compartimos el modelo con la extensión global
        }
    };
    dataMock:any = [
        {
            passengerId:'ADULT_01',
            name: 'Carlos',
            surname: 'Mendoza',
            document: 'DNI',
            documentNumber: '012345678K'
        },
        {
            passengerId:'INFANT_01',
            name: 'OTROname',
            surname: 'otrosurname',
            document: 'DNI',
            documentNumber: '876543210K'
        }
    ];

     private realjsonSchemaMock:any = {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "Servicio de acompañamiento de menores: Responsable legal",
        description: "Completa los datos y ten en cuenta que podrás modificarlos hasta 2 horas antes del vuelo.",
        type: "object",
        required: ["minors", "acceptTermsAndConditions"],
        properties: {
            minors: {
                "type": "array",
                "minItems": 1,
                "items": {
                    "type": "object",
                    "required": [
                        "firstName",
                        "lastName",
                        "documentType",
                        "documentNumber",
                        "dialingCode",
                        "phoneNumber",
                        "minorLanguage",
                        "relationship"
                    ],
                    "properties": {
                        "minorPassengerName": { // Esto es el titulo, no es un campo ¿?
                            "type": "string",
                            "readOnly": true,
                            "description": "NOMBRE_MENOR"
                        },
                        "name": {
                            "type": "string",
                            "title": "Nombre"
                        },
                        "surname": {
                            "type": "string",
                            "title": "Apellidos"
                        },
                        "documentType": {
                            "type": "string",
                            "title": "TIPO DE DOCUMENTO",
                            "enum": ["1", "2", "3"],
                            "enumNames": [
                            "NIE", "DNI", "LOQUESEA"
                            ]
                        },
                        "documentNumber": {
                            "type": "string",
                            "title": "Número de documento",
                            "minLength": 5
                        },
                        "phonePrefix": {
                            "type": "string",
                            "title": "PREFIJO",
                            "enum": ["1", "2"],
                            "enumNames": [
                            "Spain/+34", "Other"
                            ]
                        },
                        "phoneNumber": {
                            "type": "string",
                            "title": "Número de teléfono",
                            "minLength": 9,
                            "maxLength": 15,
                            "pattern": "^[0-9]+$"
                        },
                        "spokenLanguage": {
                            "type": "string",
                            "title": "Idioma del menor",
                            "enum": ["1", "2", "3", "4"],
                            "enumNames": [
                            "Spanish", "English", "French", "Other"
                            ]
                        },
                        "relationship": {
                            "type": "string",
                            "title": "Parentesco",
                            "enum": ["Familia", "Responsable Legal", "YoQueSe"],
                        },
                        "specialInstructions": {
                            "type": "string",
                            "title": "Instrucciones especiales (alergias, medicación, dietas especiales...). El personal de a bordo no podrá administrar medicamentos a menores."
                        }
                    }
                }
            },
            copyDataToAllPassengers: {
                "type": "boolean",
                "title": "Utilizar estos datos para todos los pasajeros",
                "default": false
            },
            acceptTermsAndConditions: {
                "type": "boolean",
                "title": "Confirmo que acepto la declaración de responsabilidad y las Condiciones Generales del servicio, así como la información sobre protección de datos.",
                "const": true
                }
            }
        }

    schemaMock:any = {
        type: 'object',
        required: ['name', 'surname'],
        properties: {
            name: { type: 'string', title: 'Nombre' },
            surname: { type: 'string', title: 'Apellidos' },
            document: { type: 'string', title: 'Tipo de documento', enum: [1, 2, 3], enumNames: ['DNI', 'Pasaporte', 'NIE'] },
            documentNumber: { type: 'string', title: 'Número de documento' },
            prefix: { type: 'string', title: 'Prefijo', enum: ['+34', '+18', '+365'] },
            phoneNumber: { type: 'string', title: 'Nº de Teléfono', pattern: '^[0-9]' },
            language: { type: 'string', title: 'Idioma del menor', enum: ['Español', 'Ingles', 'Francés'] },
            relationship: { type: 'string', title: 'Parentesco', enum: ['Padre', 'Madre', 'Tutor legal'] },
            specialInstructions: { 
                type: 'string', 
                title: 'Declaración de datos relevantes del menor',
                maxLength: 110,
                description: 'Instrucciones especiales (alergias, medicación, dietas especiales....). El personal de a bordo no podrá administrar medicamentos a menores.', 
                widget: 'textarea' 
            },
            copyDataToAllPassengers: {
                "type": "boolean",
                "title": "Utilizar estos datos para todos los pasajeros",
                "default": true
            },
            acceptTermsAndConditions: {
                "type": "boolean",
                "title": "Confirmo que acepto la declaración de responsabilidad y las Condiciones Generales del servicio, así como la información sobre protección de datos.",
                "const": true
            }
        }
    };
    constructor(
        private NgbActiveModal: NgbActiveModal,
        private NgbModal: NgbModal,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbCModalService: IbCModalService,
        private IbMmbUmnrComunicationService: IbMmbUmnrComunicationService,
        private FormlyJsonschema: FormlyJsonschema
    ) {
            let bookingInfo:any = this.CommonsSessionStorageService.get('bookingInfo');
            this.passengers = bookingInfo?.passengers || [];
    }

    ngOnInit = (): void => { 
        // this.dataUmnrSubscription = this.IbMmbUmnrComunicationService.actualData.subscribe(data => {
        //     this.dataUmnr = data;
        //     this.isDataUmnrCompleted = true;
        // });
    };

    saveDataAndCloseModal = () => {
        // eslint-disable-next-line no-console
        console.log('comprobar datos, si esta todo listo salimos: ' , this.dataCustodiansUmnr);

        this.closeModal(this.dataCustodiansUmnr);
    };

    closeModal = (data?) => {
        this.NgbActiveModal.close(data);
    };

    closeAllModal = (): void => {
        this.NgbModal.dismissAll();
    };

    openCustodiansModal = (): void => {
        this.resetModalState();

        try {
            const camposPlanos = this.buildFieldsFromSchema();
            this.RellenarDatosDesdeElMock(camposPlanos);
            this.openModalWithData();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error al procesar el JSON Schema:', error);
        }
    };

    private resetModalState(): void {
        this.fields = {};

        // ✅ No pisamos el model si ya hay datos guardados
        if (this.dataCustodiansUmnr && Object.keys(this.dataCustodiansUmnr).length > 0) {
            this.model = { ...this.dataCustodiansUmnr };
        } else {
            this.model = {};
        }
    }

    private buildFieldsFromSchema(): FormlyFieldConfig[] {
        const configConvertida = this.FormlyJsonschema.toFieldConfig(this.schemaMock, {
            map: (mappedField: FormlyFieldConfig, mapSource: any) =>
                this.mapSchemaField(mappedField, mapSource)
        });

        return configConvertida.fieldGroup?.length
            ? configConvertida.fieldGroup
            : [configConvertida];
    }

    private mapSchemaField(
        mappedField: FormlyFieldConfig,
        mapSource: any
    ): FormlyFieldConfig {
        mappedField.props = { ...mappedField.props };

        this.applyLabel(mappedField, mapSource);
        this.applyEnumOptions(mappedField, mapSource);
        this.applyDescription(mappedField, mapSource);
        this.applyLayout(mappedField, mapSource);

        return mappedField;
    }

    private applyLabel(field: FormlyFieldConfig, source: any): void {
        if (source.title) {
            field.props.label = source.title;
        }
    }

    private applyEnumOptions(field: FormlyFieldConfig, source: any): void {
        if (source.enum && source.enumNames) {
            field.props.options = source.enum.map((value: any, index: number) => ({
                value,
                label: source.enumNames[index]
            }));
        }
    }

    private applyDescription(field: FormlyFieldConfig, source: any): void {
        if (source.description) {
            field.props.description = source.description;
        }
    }

    private applyLayout(field: FormlyFieldConfig, source: any): void {
        if (source.widget === 'textarea') {
            field.type = 'textarea';
            field.className = 'mmb-form__row--full';
            return;
        }

        if (field.key) {
            field.className = 'mmb-form__row--fifty';
        }
    }

    private openModalWithData(): void {
        const optionsModal = {
            windowClass: 'ib-modals ib-modals--right mmb-modals mmb-modals--right ib-modals--full-mobile',
            modalBlocked: false
        };

        const modalRef = this.IbCModalService.showGenericComponentModal(
            IbMmBUmnrCustodiansModalComponent,
            { ...optionsModal }
        );

        modalRef.componentInstance.passengers = this.passengers;
        modalRef.componentInstance.fields = this.fields;
        modalRef.componentInstance.options = this.options;
        modalRef.componentInstance.model = { ...this.model };
        modalRef.componentInstance.loadingForm = false;

        modalRef.result
            .then((data) => {
                this.dataCustodiansUmnr = data;
                this.model = { ...data };
            })
            .catch(() => {
                // eslint-disable-next-line no-console
                console.log('se cerró la modal sin guardar');
            });
    }

    private RellenarDatosDesdeElMock = (camposPlanos) => {
        this.passengers.forEach((passenger, index) => {
            const datosUsuario = this.dataMock.find(d => d.passengerId === passenger.passengerId);

            // Eliminamos los checkboxes globales del schema porque
            // ahora se renderizan manualmente fuera de Formly
            const camposFiltrados = camposPlanos.filter(
                campo =>
                    campo.key !== 'copyDataToAllPassengers' &&
                    campo.key !== 'acceptTermsAndConditions'
            );

            this.fields[passenger.passengerId] = camposFiltrados.map(campoOriginal => {
                // Clonamos el campo de forma segura para no pisar propiedades de los otros usuarios
                const campoClonado: FormlyFieldConfig = {
                    ...campoOriginal,
                    props: { ...campoOriginal.props } 
                };

                // ALTERACIÓN CRUCIAL: Modificamos la KEY agregando el prefijo del usuario (ej: 'user_1.ciudad')
                if (campoClonado.key) {
                    campoClonado.key = `${passenger.passengerId}.${campoOriginal.key}`;
                }

                delete campoClonado.defaultValue;

                // Si el tipo de campo es tu autocomplete, le incrustas sus datos independientes
                // if (campoClonado.type === 'my-autocomplete') {
                //     campoClonado.props.options = this.obtenerDatosDeServicioParaUsuario(passenger.passengerId);
                // }

                // Si hay datos mock para este pasajero, los usamos como defaultValue
                if (datosUsuario && datosUsuario[campoOriginal.key as string] !== undefined) {
                    campoClonado.defaultValue = datosUsuario[campoOriginal.key as string];
                }

                return campoClonado;
            });
        });
    }
            

    ngOnDestroy() {
        this.dataUmnrSubscription?.unsubscribe();
    };
}
