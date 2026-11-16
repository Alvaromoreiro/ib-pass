import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiSchemaService {
  // Cambia esto por la URL real de tu API o un archivo JSON local en /assets
  private urlApi = 'https://int.iberia.com/apiFormsJsonSchema';
  // private jsonSchemaMock: FormJsonSchema = {
  private jsonSchemaMock:any = {
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

  constructor(private http: HttpClient) {}

  // Devuelve un Observable con la estructura del esquema
  // getFormSchema(): Observable<IbFormBuilderService> {
  getFormSchema(): any {
    // return this.http.get<IbFormBuilderService>(this.urlApi);
    return this.jsonSchemaMock;
  }
}