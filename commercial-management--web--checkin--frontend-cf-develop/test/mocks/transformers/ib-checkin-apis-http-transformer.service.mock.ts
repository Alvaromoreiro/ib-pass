import { FormDataApis } from 'commercial-management--digital--web-components-design--library';

export const baseDataMock: FormDataApis = {
    contactData: {
        additionalInfo: {
            email: 'test@example.com',
            number: '987654321',
            checkInfoAll: false,
            phone: { value: '34', label: '' },
        },
        emergencyInfo: {
            phone: { value: '34', label: '' },
            number: '987654321',
            name: '',
            checkEmergencyAll: false,
        },
    },
    personalData: {
        name: 'Juan',
        surname: 'Pérez',
        gender: 'M',
        birthDate: '1990-01-01',
        nationality: { value: 'ES', label: '' },
        country: { value: 'ES', label: '' },
    },
    documentationRequired: {
        mandatory: { type: '', number: '', expiryDate: '', issuerCountry: '', requiredField: [], ocrVerified: false },
        visa: { type: '', number: '', expiryDate: '', issuerCountry: '', requiredField: [], ocrVerified: false },
        other: { type: '', number: '', expiryDate: '', issuerCountry: '', requiredField: [], ocrVerified: false },
    },
    checkbox: {
        notSendNewsletter: false,
        usPrivacyEmergencyData: false,
        confirmEmergencyData: false,
    },
};

export const formDataSecurityMock: FormDataApis = {
    ...baseDataMock,
    contactData: {
        emergencyInfo: {
            name: 'Emergency Name',
            number: '123456',
            phone: {
                value: '34',
                label: '',
            },
            checkEmergencyAll: false,
        },
        additionalInfo: {
            email: '',
            phone: { value: '', label: '' },
            number: '',
            checkInfoAll: false,
        },
    },
    passengerAddress: {
        state: { value: 'Madr', label: '' },
        address: '',
        zipCode: '',
        city: '',
    },
    infant: null,
};

export const formDataBulletinMock: FormDataApis = {
    contactData: {
        additionalInfo: {
            email: 'newsletter@example.com',
            number: '987654321',
            checkInfoAll: false,
            phone: { value: '34', label: '' },
        },
        emergencyInfo: {
            phone: { value: '34', label: '' },
            number: '987654321',
            name: '',
            checkEmergencyAll: false,
        },
    },
    personalData: {
        name: 'Juan',
        surname: 'Pérez',
        gender: 'M',
        birthDate: '1990-01-01',
        nationality: { value: 'ES', label: '' },
        country: { value: 'ES', label: '' },
    },
    documentationRequired: {
        mandatory: { type: '', number: '', expiryDate: '', issuerCountry: '', requiredField: [], ocrVerified: false },
        visa: { type: '', number: '', expiryDate: '', issuerCountry: '', requiredField: [], ocrVerified: false },
        other: { type: '', number: '', expiryDate: '', issuerCountry: '', requiredField: [], ocrVerified: false },
    },
    checkbox: {
        notSendNewsletter: true,
        usPrivacyEmergencyData: false,
        confirmEmergencyData: false,
    },
};
