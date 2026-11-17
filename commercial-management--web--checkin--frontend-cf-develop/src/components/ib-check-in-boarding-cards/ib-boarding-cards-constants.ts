namespace CKIBoardingCardsNamespace {
    const envCopy: any = {};
    (<any>Object).assign(envCopy, (<any>window).env);

    const boardingCardsConstants = {
        FORMATS_LIST: ['PDF', 'QR', 'PASSBOOK'],
        FORMATS_NAMES: {
            PDF: 'PDF',
            QR: 'QR',
            PASSBOOK: 'PASSBOOK',
            GOOGLE_WALLET: 'GOOGLE_WALLET',
            NATIVE: 'NATIVE'
        },
        FORMATS: {
            PDF: {
                description: 'IBECBP_PDF',
                classes: 'icon-documento_pdf',
                priority: 0,
                deviceType: 'desktop',
                dataLayer: 'pdf'
            },
            QR: {
                description: 'IBECBP_QR',
                classes: 'icon-codigo_qr',
                priority: 1,
                deviceType: 'tablet',
                dataLayer: 'qr'
            },
            PASSBOOK: {
                description: 'IBECBP_PASS',
                classes: 'icon-tarjeta_de_embarque_movil',
                priority: 2,
                deviceType: 'mobile',
                dataLayer: 'passbook'
            },
            GOOGLE_WALLET: {
                description: 'IBECBP_GW',
                priority: 3,
                dataLayer: 'google_wallet',
                baseURL: 'https://pay.google.com/gp/v/save/'
            }
        },
        CHANNELS_LIST: ['SMS', 'DOWNLOAD', 'EMAIL'],
        CHANNELS_NAMES: { EMAIL: 'EMAIL', SMS: 'SMS', DOWNLOAD: 'DOWNLOAD' },
        CHANNELS: {
            EMAIL: {
                description: 'IBECBP_EMAIL',
                classes: 'icon-mensajes',
                priority: 0
            },
            SMS: {
                description: 'IBECBP_SMS',
                classes: 'icon-posicion_correcta',
                priority: 1
            },
            DOWNLOAD: {
                description: 'IBECBP_DESCARGAR',
                classes: 'icon-descargar',
                priority: 2
            }
        },
        DOCS_TYPES: {
            BOARDING_CARD: 'BOARDING_CARD',
            PRINTED_TAG: 'HOME_PRINTED_BAG_TAG'
        },
        MODEL_INHIBIT: {
            inhibitBoardingCard: {
                status: false,
                isAircheckReason: false,
                isInhibitReason: false,
                reason: [],
                segment: [],
                priority: null,
                isHomogeneous: false
            },
            airCheck: {
                status: false,
                airCheckDocumentationRequired: false,
                url: ''
            },
            segments: [],
            LITERALS: {},
            modal: {
                title: {
                    needsTranslate: true,
                    message: 'MODAL_INHIBIT_MIX_BOARDING_CARD_TITLE',
                    subtitle: {
                        status: false,
                        message: '',
                        needsTranslate: false
                    }
                },
                message: 'MODAL_INHIBIT_MIX_BOARDING_CARD_BODY',
                needsTranslate: true,
                btn: {
                    accept: 'MODAL_INHIBIT_MIX_BOARDING_CARD_BTN_ACCEPT',
                    cancel: 'MODAL_INHIBIT_MIX_BOARDING_CARD_BTN_CANCEL'
                }
            }
        }
    };
    angular.module('ib-boarding-cards-module').constant('BoardingCardsConstants', boardingCardsConstants);

    export type BoardingCardsConstants = typeof boardingCardsConstants;
}
