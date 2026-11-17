import { PassengerAdditionalInfo } from "@src/app/core/models/ib-checkin-apis/services/additional-info-model";

const securityUSAPassportResponseMock = {
    errors: [
        {
            code: 'TRM_APIM_9040',
            reason: 'Please check that you have entered all the details correctly.',
            uuid: '701195ce-260e-4c69-8226-911acb4c2b2e',
            timeStamp: '2026-04-06 08:34',
            passengerId: '1'
        }
    ]
};

const securityDocumentExpiryDateResponseMock = [
    {
        id: 1,
        errors: [
            {
                code: 'API_DOCUMENT_EXPIRY_DATE',
                description: 'Requerido fecha de expiración de documento'
            }
        ]
    }
];

const securityGeneralResponseMock = {
    checkinId: 'Q2hlY2tpbkBJQkVSSUFfQ09NX2liZXJpYV93ZWJfUDEwNTEyNF8yMDI2MDIxOSAxMjo1OToxNV80MThfY29tMDQxaWNoazcwNjlfdjQ=',
    errors: [
        {
            code: 'IB_00004',
            reason: 'Tenemos problemas con tu petición. Por favor, vuelve a intentarlo',
            uuid: null,
            timeStamp: '2026-02-19 12:59'
        }
    ]
};

type SecurityResponseType = 'usaPassport' | 'expiryDate' | 'general';

export const getSecurityResponseMock = (type: SecurityResponseType) => {
    const errorsType: Record<SecurityResponseType, any> = {
        'expiryDate': securityDocumentExpiryDateResponseMock,
        'usaPassport': securityUSAPassportResponseMock,
        'general': securityGeneralResponseMock
    };

    return {
        errorCode: 409,
        message: 'Please check that you have entered all the details correctly.',
        needsTranslate: false,
        internalErrorCode: 'TRM_APIM_9040',
        requestURL: 'https://pre-ibisservices.iberia.com/api/trm-apim/rs/v3/info/Q2hlY2tpbkBJQkVSSUFfQ09NX2liZXJpYV93ZWJfUDgyMTk0XzIwMjYwNDA2IDEwOjMzOjMyXzQ2ODBfY29tMDQxdWNoazgxODZfdjQ=/security',
        data: errorsType[type]
    }
};

export const additionalInfoMock: PassengerAdditionalInfo[] = [
    {
        id: '1',
        disruptionContact: {
            phone: {
                countryCode: '+1',
                number: '234567890'
            },
            email: 'test@example.com',
            language: 'en'
        },
        frequentFlyer: undefined
    }
];