import { FormDataApis } from "commercial-management--digital--web-components-design--library";

export const currentFormModelMock: FormDataApis = {
    personalData: {
        name: "",
        surname: "",
        birthDate: "",
        gender: "",
        nationality: {
            value: "",
            label: "",
        },
        country: {
            value: "",
            label: "",
        },
    },
    contactData: {
        additionalInfo: {
            email: "",
            phone: {
                value: "34",
                label: "Spain / +34",
            },
            number: "",
            checkInfoAll: false,
        },
        emergencyInfo: {
            number: "",
            name: "",
            checkEmergencyAll: false,
        },
    },
    documentationRequired: {
        mandatory: {
            type: {
                value: "PSPT",
                label: "Passport",
            },
            number: "",
            expiryDate: "",
            issuerCountry: {
                value: "ES",
                label: "Spain",
            },
            ocrVerified: false,
        },
        visa: {
            type: {
                value: "VISA",
                label: "Visa",
            },
            number: "",
            expiryDate: "",
            issuerCountry: "",
            ocrVerified: false,
        },
        other: {
            type: "",
            number: "",
            expiryDate: "",
        },
    },
    checkbox: {
        confirmEmergencyData: false,
        notSendNewsletter: false,
    },
};

export const currentFormModelInfantMock: FormDataApis = {
    personalData: {
        name: "",
        surname: "",
        birthDate: "",
        gender: "",
    },
    passengerAddress: {
        address: "",
        zipCode: "",
        city: "",
        checkAddressForAll: false,
    },
    contactData: {
        additionalInfo: {
            email: "",
            phone: {
                value: "34",
                label: "Spain / +34",
            },
            number: "",
            checkInfoAll: false,
        },
        emergencyInfo: {
            number: "",
            name: "",
            checkEmergencyAll: false,
        },
    },
    documentationRequired: {
        mandatory: {
            type: {
                value: "PSPT",
                label: "Passport",
            },
            number: "",
            ocrVerified: false,
        },
        visa: {
            type: {
                value: "VISA",
                label: "Visa",
            },
            number: "",
            expiryDate: "",
            issuerCountry: "",
            ocrVerified: false,
        },
        other: {
            type: "",
            number: "",
            expiryDate: "",
        },
    },
    infant: {
        personalData: {
            name: "",
            surname: "",
            birthDate: "",
            gender: "",
        },
        documentationRequired: {
            mandatory: {
                type: {
                    value: "PSPT",
                    label: "Passport",
                },
                number: "",
                ocrVerified: false,
            },
            visa: {
                type: {
                    value: "VISA",
                    label: "Visa",
                },
                number: "",
                expiryDate: "",
                issuerCountry: "",
                ocrVerified: false,
            },
            other: {
                type: "",
                number: "",
                expiryDate: "",
            },
        },
    },
    checkbox: {
        usPrivacyEmergencyData: false,
        confirmEmergencyData: false,
        notSendNewsletter: false,
    },
};